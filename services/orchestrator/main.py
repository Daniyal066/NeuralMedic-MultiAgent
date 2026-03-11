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
            """
            
            workers = {
                'pathology_worker': os.getenv("PATHOLOGY_WORKER_URL", "http://pathology_worker:8002"),
                'risk_worker': os.getenv("RISK_WORKER_URL", "http://risk_worker:8004")
            }

            # Using a transaction for atomicity
            async with conn.transaction():
                # First, ensure jobs are in DB and visible to other connections
                for name, url in workers.items():
                    await conn.execute(query, session_id, name)
            
            # Fan-out to specialized workers via HTTP outside the transaction
            async with httpx.AsyncClient() as client:
                for name, url in workers.items():
                    try:
                        # Map worker names to our specific endpoints
                        endpoint = "pathology" if "pathology" in name else "risk"
                        await client.post(f"{url}/analyze/{endpoint}/{session_id}", timeout=2.0)
                        logger.info(f"Triggered {name} for session {session_id}")
                    except Exception as e:
                        logger.error(f"Failed to trigger {name}: {e}")
            
            logger.info(f"Created jobs for session {session_id}")
            
        except Exception as e:
            logger.error(f"Error creating jobs for session {session_id}: {e}")

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
                    logger.info(f"Parsed event_type: {event_type}, session_id: {session_id}")
                    
                    if event_type == 'JOB_READY':
                        logger.info(f"Matched JOB_READY for {session_id}")
                        if session_id:
                            await create_jobs(session_id)
                        else:
                            logger.warning(f"Received JOB_READY event without session_id: {data}")
                    else:
                        logger.info(f"Ignoring event type: {event_type}")

                except json.JSONDecodeError:
                    logger.error(f"Failed to decode message: {message['data']}")
                except Exception as e:
                    logger.error(f"Error processing message: {e}")
                    
    except Exception as e:
        logger.error(f"Redis listener error: {e}")
        # In a real app, we might want to restart the listener or exit the app to let Docker restart it.
        # For now, let's just log it.

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    task = asyncio.create_task(redis_listener())
    yield
    # Shutdown
    # Force cancel the task if needed, or let it die with the loop
    task.cancel()
    if db_pool:
        await db_pool.close()

app = FastAPI(lifespan=lifespan)

@app.get("/health")
async def health_check():
    return {"status": "ok"}
