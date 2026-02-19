import time
import os
import json
import logging
import psycopg2
from psycopg2.extras import RealDictCursor
import redis

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("outbox-service")

# Configuration
# Configuration
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "neuralmedic")
DB_USER = os.getenv("DB_USER", "admin")
DB_PASSWORD = os.getenv("DB_PASS", "password")

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))

POLLING_INTERVAL = 0.5

# Channel Mapping
CHANNEL_MAPPING = {
    "JOB_READY": "job_queue",
    "TASK_ASSIGNMENT": "worker_tasks",
    "WORKER_DONE": "worker_results",
    "RE_ENGAGE_EVENT": "recursion_queue"
}

def connect_db():
    conn = psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD
    )
    return conn

def connect_redis():
    return redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)

def main():
    logger.info("Starting Outbox Poller Service...")
    
    # Retry connection logic could be added here, but failing fast for now
    try:
        r = connect_redis()
        r.ping()
        logger.info("Connected to Redis")
    except Exception as e:
        logger.error(f"Failed to connect to Redis: {e}")
        return

    while True:
        conn = None
        try:
            conn = connect_db()
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                # SELECT FOR UPDATE SKIP LOCKED to handle concurrency
                cur.execute("""
                    SELECT id, event_type, payload 
                    FROM outbox 
                    WHERE status = 'PENDING'
                    LIMIT 10 
                    FOR UPDATE SKIP LOCKED
                """)
                rows = cur.fetchall()

                if not rows:
                    conn.commit()
                    time.sleep(POLLING_INTERVAL)
                    continue

                logger.info(f"Processing {len(rows)} events")

                for row in rows:
                    event_id = row['id']
                    event_type = row['event_type']
                    payload = row['payload']
                    
                    # Determine Redis Channel
                    # Use mapping for known types to maintain compatibility, fallback to event_type
                    channel = CHANNEL_MAPPING.get(event_type, event_type)
                    
                    # Publish to Redis
                    # Ensure payload is string
                    message = json.dumps(payload) if not isinstance(payload, str) else payload
                    r.publish(channel, message)
                    logger.info(f"Published event {event_id} ({event_type}) to {channel}")

                    # Mark as processed
                    cur.execute("UPDATE outbox SET status = 'PROCESSED' WHERE id = %s", (event_id,))
                
                # Commit the transaction after processing batch
                conn.commit()
                
        except Exception as e:
            logger.error(f"Error in poll loop: {e}")
            if conn:
                try:
                    conn.rollback()
                except:
                    pass
            time.sleep(5) # Backoff
        finally:
            if conn:
                conn.close()

if __name__ == "__main__":
    main()
