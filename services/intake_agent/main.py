import os
import json
import uuid
import logging
from typing import Dict, Any

from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, Field
import psycopg2
from psycopg2.extras import RealDictCursor

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("intake-agent")

# Configuration
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "neuralmedic")
DB_USER = os.getenv("DB_USER", "admin")
DB_PASSWORD = os.getenv("DB_PASS", "password")

app = FastAPI(title="NeuralMedic Intake Agent")

# Pydantic models for API
class IntakeRequest(BaseModel):
    user_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    transcript: str

class IntakeResponse(BaseModel):
    session_id: str
    status: str
    message: str

def get_db_connection():
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        return conn
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        raise HTTPException(status_code=500, detail="Database connection error")

@app.post("/api/intake", response_model=IntakeResponse, status_code=status.HTTP_202_ACCEPTED)
async def process_intake(request: IntakeRequest):
    logger.info(f"Received intake request for user {request.user_id}")
    
    conn = None
    try:
        conn = get_db_connection()
        conn.autocommit = False # Ensure explicit transaction
        
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # 1. Create a new session
            transcript_data = json.dumps({"text": request.transcript})
            cur.execute(
                "INSERT INTO sessions (user_id, transcript_jsonb) VALUES (%s, %s) RETURNING id",
                (request.user_id, transcript_data)
            )
            session_id = cur.fetchone()['id']
            
            # 2. Create job status
            worker_type = "transcript_processor"
            cur.execute(
                "INSERT INTO job_status (session_id, worker_type, status) VALUES (%s, %s, 'PENDING') RETURNING job_id",
                (session_id, worker_type)
            )
            job_id = cur.fetchone()['job_id']
            
            # 3. Create Outbox event (Commit-then-Publish pattern)
            outbox_payload = {
                "session_id": str(session_id),
                "job_id": str(job_id),
                "user_id": request.user_id,
                "action": "PROCESS_TRANSCRIPT",
                "timestamp": str(uuid.uuid1()) # Just a unique timestamp-ish ID
            }
            
            cur.execute(
                "INSERT INTO outbox (aggregate_type, aggregate_id, payload_json) VALUES (%s, %s, %s)",
                ("JOB_READY", str(session_id), json.dumps(outbox_payload))
            )
            
            # Commit the transaction
            conn.commit()
            logger.info(f"Successfully processed intake. Session ID: {session_id}")
            
            return IntakeResponse(
                session_id=str(session_id),
                status="accepted",
                message="Intake request accepted and queued for processing."
            )
            
    except Exception as e:
        if conn:
            conn.rollback()
        logger.error(f"Error processing intake: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn:
            conn.close()

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
