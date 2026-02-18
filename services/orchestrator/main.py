import asyncio
import json
import logging
import os
from contextlib import asynccontextmanager

import asyncpg
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
        try:
            db_pool = await asyncpg.create_pool(dsn)
            logger.info("Connected to PostgreSQL")
        except Exception as e:
            logger.error(f"Failed to connect to PostgreSQL: {e}")
            raise
    return db_pool

async def create_jobs(session_id: str):
    """
    Creates 'summarizer' and 'diagnosis' jobs for the given session_id.
    """
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        try:
            # Check if session exists (optional validation, but good practice)
            # Assuming foreign key constraint will handle it, but we can just insert.
            
            # Insert jobs
            query = """
                INSERT INTO job_status (session_id, worker_type, status)
                VALUES ($1, $2, 'PENDING')
            """
            
            # Using a transaction for atomicity
            async with conn.transaction():
                await conn.execute(query, session_id, 'summarizer')
                await conn.execute(query, session_id, 'diagnosis')
                
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
                    
                    event_type = data.get('type') or data.get('aggregate_type') # Handle both naming conventions if needed
                    
                    # The outbox poller sends the payload_json directly. 
                    # Let's inspect the payload content from the outbox poller.
                    # Outbox Poller logic: 
                    # message = json.dumps(payload) 
                    # So 'data' here IS the payload_json from the outbox table.
                    
                    # We expect the payload to contain 'type' if that's how we distinguish events,
                    # OR we might rely on the channel if we had multiple channels.
                    # But the requirement says: "Check if type == JOB_READY".
                    # Let's assume the payload looks like {"type": "JOB_READY", "session_id": "..."}
                    
                    if data.get('type') == 'JOB_READY':
                        session_id = data.get('session_id')
                        if session_id:
                            await create_jobs(session_id)
                        else:
                            logger.warning(f"Received JOB_READY event without session_id: {data}")
                    else:
                        logger.debug(f"Ignoring event type: {data.get('type')}")

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
