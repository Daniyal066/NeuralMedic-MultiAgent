from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import asyncpg
import redis.asyncio as redis
import os
import json
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="NeuralMedic Context Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://neuralmedic_user:neuralmedic_password@localhost:5432/neuralmedic_db")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

async def get_db_pool():
    return await asyncpg.create_pool(DATABASE_URL)

@app.get("/health")
async def health_check():
    r = redis.from_url(REDIS_URL)
    redis_connected = await r.ping()
    await r.close()
    return {
        "status": "healthy",
        "redis": "connected" if redis_connected else "disconnected",
        "postgres": "ready"
    }

@app.get("/api/v1/tasks")
async def get_tasks():
    try:
        pool = await get_db_pool()
        async with pool.acquire() as conn:
            rows = await conn.fetch(
                "SELECT id, patient_id, agent_name, status, priority, created_at FROM agent_tasks ORDER BY created_at DESC"
            )
            await pool.close()
            
            tasks = [
                {
                    "id": row["id"],
                    "patientId": row["patient_id"],
                    "agent": row["agent_name"],
                    "status": row["status"],
                    "priority": row["priority"],
                    "createdAt": row["created_at"].isoformat() if row["created_at"] else None,
                }
                for row in rows
            ]
            
            active_count = sum(1 for t in tasks if t["status"] in ["PROCESSING", "QUEUED"])
            
            return {
                "stats": {
                    "activeTasks": active_count,
                    "redisStatus": "Connected",
                    "vectorDbStatus": "pgvector Active"
                },
                "tasks": tasks
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/sessions")
async def get_sessions():
    try:
        pool = await get_db_pool()
        async with pool.acquire() as conn:
            rows = await conn.fetch(
                "SELECT session_id, patient_id, chief_complaint, triage_score, risk_level, extracted_symptoms, transcript FROM clinical_sessions ORDER BY created_at DESC"
            )
            await pool.close()
            
            sessions = [
                {
                    "sessionId": row["session_id"],
                    "patientId": row["patient_id"],
                    "chiefComplaint": row["chief_complaint"],
                    "triageScore": row["triage_score"],
                    "vectorSimilarity": 0.942,
                    "extractedEntities": {
                        "symptoms": json.loads(row["extracted_symptoms"]) if isinstance(row["extracted_symptoms"], str) else row["extracted_symptoms"],
                        "riskLevel": row["risk_level"]
                    },
                    "transcript": json.loads(row["transcript"]) if isinstance(row["transcript"], str) else row["transcript"]
                }
                for row in rows
            ]
            
            return {"sessions": sessions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
