import os
import time
import json
import psycopg2
import redis
from datetime import datetime
import sys

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
    print("Starting Outbox Poller...", flush=True)
    r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)

    while True:
        conn = None
        try:
            conn = connect_db()
            cur = conn.cursor()

            # Select unprocessed events
            cur.execute("SELECT id, aggregate_id, event_type, payload FROM outbox_events WHERE processed = FALSE ORDER BY created_at LIMIT 10")
            events = cur.fetchall()

            if events:
                print(f"Found {len(events)} unprocessed events.", flush=True)
                for event in events:
                    event_id, agg_id, event_type, payload = event
                    
                    # Publish to Redis
                    message = {
                        "event_id": str(event_id),
                        "aggregate_id": agg_id,
                        "event_type": event_type,
                        "payload": payload
                    }
                    r.publish("healthcare_events", json.dumps(message))
                    print(f"Published event {event_id} to Redis.", flush=True)

                    # Mark as processed
                    cur.execute("UPDATE outbox_events SET processed = TRUE WHERE id = %s", (event_id,))
                
                conn.commit()
            
        except Exception as e:
            # Print error but iterate
            print(f"Error in poller: {e}", flush=True)
            if conn:
                conn.rollback()
        finally:
            if conn:
                conn.close()
        
        time.sleep(POLL_INTERVAL)

if __name__ == "__main__":
    main()
