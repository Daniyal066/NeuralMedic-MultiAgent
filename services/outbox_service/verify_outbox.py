import time
import os
import json
import psycopg2
import redis
import uuid
import subprocess
import sys

# Configuration
DB_HOST = "localhost"
DB_PORT = "5433"
DB_NAME = "neuralmedic"
DB_USER = "admin"
DB_PASSWORD = "password"

REDIS_HOST = "localhost"
REDIS_PORT = 6380

def main():
    print("[TEST] Starting Verification...")
    
    # 0. Start the Outbox Poller Service in the background
    print("[TEST] Launching main.py (Poller Service)...")
    env = os.environ.copy()
    # Set env vars if needed, though defaults match
    env["DB_HOST"] = DB_HOST
    env["DB_PORT"] = DB_PORT
    env["DB_NAME"] = DB_NAME
    env["DB_USER"] = DB_USER
    env["DB_PASS"] = DB_PASSWORD
    env["REDIS_HOST"] = REDIS_HOST
    env["REDIS_PORT"] = str(REDIS_PORT)
    env["PYTHONPATH"] = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))) # Add project root to path

    # Assuming main.py is in the same directory as this script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    main_py_path = os.path.join(script_dir, "main.py")
    
    process = subprocess.Popen([sys.executable, main_py_path], env=env)
    
    # Give it a moment to start
    time.sleep(2)

    try:
        # 1. Connect to DB to insert test event
        print("[TEST] Connecting to DB...")
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        cur = conn.cursor()
        
        test_id = str(uuid.uuid4())
        payload = json.dumps({"test_id": test_id, "message": "Verification Event"})
        
        print(f"[TEST] Inserting event with Payload: {payload}")
        cur.execute("""
            INSERT INTO outbox (aggregate_type, aggregate_id, payload_json)
            VALUES (%s, %s, %s)
            RETURNING id;
        """, ("JOB_READY", "test-svc", payload))
        
        inserted_id = cur.fetchone()[0]
        conn.commit()
        print(f"[TEST] Inserted ID: {inserted_id}")
        
        # 2. Listen to Redis
        print("[TEST] Connecting to Redis...")
        r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)
        pubsub = r.pubsub()
        pubsub.subscribe("job_queue")
        
        print("[TEST] Listening on Redis 'job_queue'...")
        
        start_time = time.time()
        while time.time() - start_time < 10:
            message = pubsub.get_message()
            if message and message['type'] == 'message':
                print(f"[TEST] Received: {message['data']}")
                if test_id in str(message['data']):
                    print("[TEST] SUCCESS: Event propagated!")
                    return
            time.sleep(0.1)
            
        print("[TEST] TIMEOUT: Event not received.")
        
    except Exception as e:
        print(f"[TEST] Error: {e}")
    finally:
        print("[TEST] Stopping Poller Service...")
        process.terminate()
        process.wait()

if __name__ == "__main__":
    main()
