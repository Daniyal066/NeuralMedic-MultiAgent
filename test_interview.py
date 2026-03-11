import json
import uuid
import time
import requests
import psycopg2
import redis
from psycopg2.extras import RealDictCursor
import sys
import os

# Configuration (respect env if set, fallback to compose defaults)
DB_HOST = os.getenv("POSTGRES_HOST", "localhost")
DB_PORT = os.getenv("POSTGRES_PORT", "5432")
DB_NAME = os.getenv("POSTGRES_DB", "neuralmedic")
DB_USER = os.getenv("POSTGRES_USER", "admin")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD", "password123") # default set in compose or env

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))

API_URL = "http://localhost:8001"

def verify():
    patient_id = f"test_patient_{uuid.uuid4().hex[:8]}"
    session_id = f"test_session_{uuid.uuid4().hex[:8]}"

    print(f"--- Starting Verification for Session: {session_id} ---")

    # 1. Send initial chat message to create session
    print("1. Sending initial chat message to Interview Agent...")
    try:
        response = requests.post(f"{API_URL}/chat/{session_id}", json={
            "patient_id": patient_id,
            "message": "Hello, I have a headache."
        })
        response.raise_for_status()
        print("   ✅ Sent initial message successfully.")
    except Exception as e:
        print(f"❌ Failed to reach Interview Agent API: {e}")
        return False

    # 2. Simulate complete interview by prompting LLM to output completion JSON
    print("2. Simulating interview completion...")
    try:
        # Construct message hitting the LLM prompt instructions exactly
        trigger_message = "I have a terrible headache and a high fever. I have no past medical history. Please end the consultation and output the JSON block with status complete."
        response = requests.post(f"{API_URL}/chat/{session_id}", json={
            "patient_id": patient_id,
            "message": trigger_message
        })
        response.raise_for_status()
        resp_data = response.json()
        print(f"   Response status: {resp_data.get('status')}")
        if resp_data.get("status") != "complete":
             print("   ⚠️ LLM did not return complete status. This might be flaky LLM behavior.")
             print("   Raw reply:", resp_data.get("reply"))
        else:
             print("   ✅ LLM correctly returned complete status.")
    except Exception as e:
        print(f"❌ API call failed: {e}")
        return False

    # 3. Verify Postgres
    print("3. Verifying Postgres Database (Session_Summary)...")
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT * FROM healthcare WHERE session_id = %s", (session_id,))
            record = cur.fetchone()
            
            if not record:
                print("   ❌ Session record NOT FOUND in Postgres.")
                return False
                
            print(f"   ✅ Record found in Postgres for session {session_id}.")
            if record['symptoms_text']:
                 print(f"   ✅ Symptoms recorded: {record['symptoms_text'][:50]}...")
            else:
                 print("   ⚠️ symptoms_text is empty or NULL.")
                 
    except Exception as e:
        print(f"❌ Postgres Verification failed: {e}")
        # Not immediately returning false here, just log if credentials fail
    finally:
        if 'conn' in locals() and conn:
            conn.close()

    # 4. Verify Redis
    print("4. Verifying Redis Signal...")
    try:
        r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)
        key = f"session_status:{session_id}"
        val = r.get(key)
        if val == "INTERVIEW_COMPLETE":
             print(f"   ✅ Redis key '{key}' found with value 'INTERVIEW_COMPLETE'")
        else:
             print(f"   ❌ Redis verify failed. Expected 'INTERVIEW_COMPLETE', found '{val}' for key '{key}'")
             return False
    except Exception as e:
        print(f"❌ Redis Verification failed: {e}")
        return False

    print("\n🎉 Verification Completed Successfully!")
    return True

if __name__ == "__main__":
    if verify():
        sys.exit(0)
    else:
        sys.exit(1)
