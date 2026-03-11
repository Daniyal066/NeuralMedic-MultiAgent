import asyncio
import uuid
import json
import logging
import asyncpg
import redis.asyncio as redis
import os

# Configuration matching the orchestrator defaults
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "neuralmedic")
DB_USER = os.getenv("DB_USER", "admin")
DB_PASSWORD = os.getenv("DB_PASS", "password")

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
REDIS_CHANNEL = "job_queue"

# Setup basic logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("chaos_test")

async def setup_db_mock_data():
    """
    Sets up the mock Session, User, and a PENDING Job in Postgres
    to create a valid condition for the orchestrator to process.
    """
    logger.info("Setting up Mock Database Data...")
    
    session_id = f"sess_chaos_{uuid.uuid4().hex[:8]}"
    patient_id = f"pat_chaos_{uuid.uuid4().hex[:8]}"
    
    dsn = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    conn = await asyncpg.connect(dsn)
    
    try:
        # Pre-requisite parent inserts
        await conn.execute("INSERT INTO sessions (id, patient_id) VALUES ($1, $2)", session_id, patient_id)
        
        # Insert a job in PENDING status
        job_id = await conn.fetchval(
            """
            INSERT INTO job_status (session_id, worker_type, status)
            VALUES ($1, $2, 'PENDING')
            RETURNING job_id;
            """,
            session_id, "pathology_worker"
        )
        
        logger.info(f"Mock Data Created! Session: {session_id}, Job ID: {job_id}")
        return session_id, str(job_id)
        
    except Exception as e:
        logger.error(f"Error setting up test data: {e}")
        raise
    finally:
        await conn.close()
        
async def trigger_race_condition(job_id: str):
    """
    Rapidly fires 10 trigger messages into Redis pub/sub queue for the exact same job ID.
    This simulates multiple orchestrators picking up the same job notification simultaneously.
    """
    logger.info(f"Starting Race Condition trigger for Job ID: {job_id}")
    r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)
    
    # Send messages concurrently to increase the chance of race condition
    tasks = []
    
    async def publish_message(index):
        msg = json.dumps({"job_id": job_id, "type": "JOB_TRIGGER", "_debug_idx": index})
        await r.publish(REDIS_CHANNEL, msg)
        logger.info(f"Published trigger message #{index+1}")
        
    for i in range(10):
        tasks.append(asyncio.create_task(publish_message(i)))
        
    await asyncio.gather(*tasks)
    
    await r.close()
    logger.info("Massive payload fired into Redis queue.")

async def main():
    try:
        # Step 1: Prepare Database
        session_id, job_id = await setup_db_mock_data()
        
        # Give DB a brief moment to commit/sync
        await asyncio.sleep(1)
        
        # Step 2: Fire Chaos Triggers
        await trigger_race_condition(job_id)
        
        logger.info("Test script complete. Check out orchestrator logs to ensure only ONE instance ACQUIRED the lock and 9 instances Bypassed it.")
        
    except Exception as e:
        logger.error(f"Unexpected error in chaos script: {e}")

if __name__ == "__main__":
    # To run this script:
    # python scripts/stress_test_redlock.py
    asyncio.run(main())
