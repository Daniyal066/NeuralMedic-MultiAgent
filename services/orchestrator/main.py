import asyncio
import json
import logging
import os
from contextlib import asynccontextmanager

import asyncpg
import httpx
import redis.asyncio as redis
from fastapi import FastAPI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("orchestrator-service")

# Configuration
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "neuralmedic")
DB_USER = os.getenv("DB_USER", "admin")
DB_PASSWORD = os.getenv("DB_PASS", "password")

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
REDIS_CHANNEL = "job_queue"

# Database Connection Pool
db_pool = None

async def get_db_pool():
    global db_pool
    if not db_pool:
        dsn = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
        logger.info(f"Connecting to DB at {DB_HOST}:{DB_PORT}/{DB_NAME} as {DB_USER}")
        try:
            db_pool = await asyncpg.create_pool(dsn)
            logger.info("Connected to PostgreSQL successfully")
        except Exception as e:
            logger.error(f"CRITICAL: Failed to connect to PostgreSQL: {e}")
            raise
    return db_pool

async def create_jobs(session_id: str):
    """
    Creates 'summarizer' and 'diagnosis' jobs for the given session_id.
    """
    logger.info(f"Attempting to create jobs for session: {session_id}")
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        try:
            logger.info(f"Database connection acquired for session: {session_id}")
            # Insert jobs
            query = """
                INSERT INTO job_status (session_id, worker_type, status)
                VALUES ($1, $2, 'PENDING')
                RETURNING job_id
            """
            
            workers = {
                'pathology_worker': os.getenv("PATHOLOGY_WORKER_URL", "http://pathology_worker:8002"),
                'risk_worker': os.getenv("RISK_WORKER_URL", "http://risk_worker:8004")
            }

            created_job_ids = []
            async with conn.transaction():
                for name, url in workers.items():
                    job_id = await conn.fetchval(query, session_id, name)
                    created_job_ids.append(job_id)

            # Trigger job processing through Redis pub/sub directly so new process logic takes over
            r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)
            for j_id in created_job_ids:
                await r.publish(REDIS_CHANNEL, json.dumps({"job_id": str(j_id), "type": "JOB_TRIGGER"}))

            logger.info(f"Created jobs for session {session_id} and published to Redis")
            
        except Exception as e:
            logger.error(f"Error creating jobs for session {session_id}: {e}")

async def process_job(job_id: str, r: redis.Redis):
    hostname = os.environ.get("HOSTNAME", "unknown_node")
    lock_key = f"lock:job:{job_id}"
    
    lock = r.lock(lock_key, timeout=10)
    acquired = await lock.acquire(blocking=False)
    
    if not acquired:
        logger.warning(f"Node {hostname} bypassed job {job_id} - Lock held by another orchestrator.")
        return

    try:
        logger.info(f"Node {hostname} ACQUIRED lock for job {job_id}.")
        pool = await get_db_pool()
        async with pool.acquire() as conn:
            row = await conn.fetchrow("SELECT status, session_id, worker_type FROM job_status WHERE job_id = $1", job_id)
            if not row:
                logger.error(f"Job not found in database: {job_id}")
                return
            if row['status'] != 'PENDING':
                logger.info(f"Node {hostname} bypassed job {job_id} - already processed (status: {row['status']})")
                return
            
            await conn.execute("UPDATE job_status SET status = 'PROCESSING', updated_at = NOW() WHERE job_id = $1", job_id)
            
            # Dispatch
            session_id = row['session_id']
            worker_type = row['worker_type']
            workers = {
                'pathology_worker': os.getenv("PATHOLOGY_WORKER_URL", "http://pathology_worker:8002"),
                'risk_worker': os.getenv("RISK_WORKER_URL", "http://risk_worker:8004")
            }
            url = workers.get(worker_type)
            if url:
                endpoint = "pathology" if "pathology" in worker_type else "risk"
                async with httpx.AsyncClient() as client:
                    try:
                        await client.post(f"{url}/analyze/{endpoint}/{session_id}", timeout=2.0)
                        logger.info(f"Triggered {worker_type} for job {job_id} / session {session_id}")
                    except Exception as e:
                        logger.error(f"Failed to trigger {worker_type}: {e}")
            else:
                logger.error(f"Unknown worker_type: {worker_type}")
    finally:
        try:
            await lock.release()
        except redis.exceptions.LockError:
            # Lock might have auto-expired
            pass

async def redis_listener():
    """
    Listens to Redis channel for JOB_READY events.
    """
    logger.info(f"Starting Redis listener on channel: {REDIS_CHANNEL}")
    try:
        r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)
        pubsub = r.pubsub()
        await pubsub.subscribe(REDIS_CHANNEL)
        
        async for message in pubsub.listen():
            if message['type'] == 'message':
                try:
                    data = json.loads(message['data'])
                    logger.info(f"Received message: {data}")
                    
                    event_type = data.get('event_type') or data.get('type')
                    session_id = data.get('aggregate_id') or data.get('session_id')
                    job_id = data.get('job_id')
                    
                    if job_id:
                        asyncio.create_task(process_job(job_id, r))
                    elif event_type == 'JOB_READY' and session_id:
                        logger.info(f"Matched JOB_READY for {session_id}")
                        await create_jobs(session_id)
                    else:
                        logger.info(f"Ignoring message: {data}")

                except json.JSONDecodeError:
                    logger.error(f"Failed to decode message: {message['data']}")
                except Exception as e:
                    logger.error(f"Error processing message: {e}")
                    
    except Exception as e:
        logger.error(f"Redis listener error: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    task = asyncio.create_task(redis_listener())
    yield
    # Shutdown
    task.cancel()
    if db_pool:
        await db_pool.close()

app = FastAPI(lifespan=lifespan)

@app.get("/health")
async def health_check():
    return {"status": "ok"}
