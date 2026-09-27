import os
import time
import json
import psycopg2
from psycopg2.extras import RealDictCursor
import redis
from datetime import datetime
import sys
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("OutboxPoller")

# Configuration
DB_HOST = os.getenv("DB_HOST", "postgres")
DB_NAME = os.getenv("DB_NAME", "neuralmedic")
DB_USER = os.getenv("DB_USER", "admin")
DB_PASS = os.getenv("DB_PASS", "password123")
DB_PORT = os.getenv("DB_PORT", "5432")
REDIS_HOST = os.getenv("REDIS_HOST", "redis")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
POLL_INTERVAL = 2  # Seconds

def connect_db():
    return psycopg2.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASS,
        port=DB_PORT
    )

def main():
    logger.info("Starting Outbox Poller...")
    r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)

    while True:
        conn = None
        try:
            conn = connect_db()
            # Use RealDictCursor for easier access to columns
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                # Select unprocessed events with concurrency safety
                cur.execute("""
                    SELECT id, aggregate_id, event_type, payload 
                    FROM outbox_events 
                    WHERE processed = FALSE 
                    ORDER BY created_at 
                    LIMIT 10
                    FOR UPDATE SKIP LOCKED
                """)
                events = cur.fetchall()

                if events:
                    logger.info(f"Found {len(events)} unprocessed events.")
                    for event in events:
                        event_id = event['id']
                        agg_id = event['aggregate_id']
                        event_type = event['event_type']
                        payload = event['payload']
                        
                        # Harmonize with Orchestrator (use job_queue channel)
                        # We include the standard payload plus the aggregate metadata
                        message = {
                            "event_id": str(event_id),
                            "aggregate_id": agg_id,
                            "event_type": event_type,
                            "payload": payload
                        }
                        
                        r.publish("job_queue", json.dumps(message))
                        r.publish("healthcare_events", json.dumps(message)) # Backward compatibility
                        
                        logger.info(f"Published event {event_id} ({event_type}) to job_queue.")

                        # Mark as processed
                        cur.execute("UPDATE outbox_events SET processed = TRUE WHERE id = %s", (event_id,))
                    
                    conn.commit()
            
        except Exception as e:
            logger.error(f"Error in poller: {e}")
            if conn:
                conn.rollback()
        finally:
            if conn:
                conn.close()
        
        time.sleep(POLL_INTERVAL)

if __name__ == "__main__":
    main()
