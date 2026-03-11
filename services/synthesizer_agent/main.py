from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
import os
import json
import httpx
import redis.asyncio as redis
import asyncio
import time
from groq import Groq
from contextlib import asynccontextmanager
from sqlalchemy.exc import OperationalError

import models
from database import engine, get_db

# Retry database connection on startup
for _ in range(10):
    try:
        models.Base.metadata.create_all(bind=engine)
        print("Database tables created/verified.", flush=True)
        break
    except OperationalError:
        print("Database not ready, waiting 3s...", flush=True)
        time.sleep(3)

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
REDIS_HOST = os.getenv("REDIS_HOST", "redis")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
CONTEXT_SERVICE_URL = os.getenv("CONTEXT_SERVICE_URL", "http://context_service:8000")

# Define required workers for synthesis
REQUIRED_WORKERS = ["pathology_worker", "risk_worker"]

SYNTHESIZER_SYSTEM_PROMPT = """You are the Synthesizer Agent, acting as the Chief Medical Officer for NeuralMedic.
You will receive reports from specialized medical AI workers (Pathology and Risk Assessment) along with the complete patient context.
Your goal is to:
1. Synthesize these disjointed reports into a coherent, professional final diagnosis.
2. Check for contradictions. If workers disagree (e.g., Pathology says 'Benign' but Risk says 'High'), flag this immediately.
3. Audit for demographic bias.
4. Apply the Confidence Rule: If your overall confidence is below 85% or if critical information is missing, output a RECURSIVE_TRIGGER instead of a diagnosis.

Output should be a structured JSON object:
{
  "diagnosis_summary": "Overall synthesis",
  "contradictions_found": ["List if any"],
  "risk_assessment": "Consolidated risk",
  "pathological_findings": "Consolidated pathology",
  "confidence_score": 0.92,
  "action": "FINAL_DIAGNOSIS" or "RECURSIVE_TRIGGER",
  "missing_info": ["Only if action is RECURSIVE_TRIGGER"],
  "next_steps": "Detailed clinical recommendations"
}"""

async def check_and_synthesize(session_id: str):
    db = next(get_db())
    try:
        # 1. Fetch all completed jobs for this session
        jobs = db.query(models.JobStatus).filter(
            models.JobStatus.session_id == session_id,
            models.JobStatus.status == "DONE"
        ).all()
        
        completed_worker_types = [j.worker_type for j in jobs]
        
        # 2. Check if all required workers are done
        is_complete = all(worker in completed_worker_types for worker in REQUIRED_WORKERS)
        if not is_complete:
            print(f"Session {session_id} still waiting for workers. Completed: {completed_worker_types}", flush=True)
            return

        print(f"All workers complete for session {session_id}. Starting synthesis...", flush=True)

        # 3. Fetch Context
        async with httpx.AsyncClient(timeout=30.0) as http_client:
            response = await http_client.get(f"{CONTEXT_SERVICE_URL}/context/{session_id}")
            response.raise_for_status()
            context_data = response.json()

        # 4. Prepare worker reports string
        reports = ""
        for job in jobs:
            reports += f"\n--- {job.worker_type} Report ---\n{json.dumps(job.result, indent=2)}\n"

        # 5. Build Final Prompt
        user_prompt = f"""
Patient Context:
{json.dumps(context_data[0] if context_data else {}, indent=2)}

Specialized Worker Reports:
{reports}

Please provide the final Chief Medical Officer synthesis.
"""

        # 6. Call Groq LLM
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": SYNTHESIZER_SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.2,
        )
        llm_response = chat_completion.choices[0].message.content

        # 7. Parse and Record Final Result
        try:
            if "{" in llm_response:
                start = llm_response.find("{")
                end = llm_response.rfind("}") + 1
                final_json = json.loads(llm_response[start:end])
            else:
                final_json = {"raw_synthesis": llm_response}
        except json.JSONDecodeError:
            final_json = {"raw_synthesis": llm_response}

        # Determine event type based on action
        action = final_json.get("action", "FINAL_DIAGNOSIS")
        event_name = "RE_ENGAGE_EVENT" if action == "RECURSIVE_TRIGGER" else "FinalDiagnosisProduced"

        # Write to Outbox
        outbox_event = models.OutboxEvent(
            aggregate_id=session_id,
            event_type=event_name,
            payload=final_json
        )
        db.add(outbox_event)
        db.commit()
        print(f"{event_name} produced for session {session_id}", flush=True)

    except Exception as e:
        print(f"Synthesis error for session {session_id}: {e}", flush=True)
    finally:
        db.close()

async def redis_listener():
    print(f"Synthesizer attempting to connect to Redis at {REDIS_HOST}:{REDIS_PORT}", flush=True)
    while True:
        try:
            r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)
            await r.ping()
            pubsub = r.pubsub()
            await pubsub.subscribe("healthcare_events")
            print("Synthesizer listening for events on channel: healthcare_events", flush=True)
            
            async for message in pubsub.listen():
                if message['type'] == 'message':
                    print(f"Synthesizer received message: {message['data'][:100]}...", flush=True)
                    try:
                        data = json.loads(message['data'])
                    except Exception as e:
                        print(f"Error decoding message: {e}", flush=True)
                        continue
                    event_type = data.get("event_type")
                    session_id = data.get("aggregate_id")
                    payload = data.get("payload")
                    
                    if isinstance(payload, str):
                        try:
                            payload = json.loads(payload)
                        except:
                            pass

                    # Map event types to worker types used by orchestrator
                    worker_mapping = {
                        "PathologyAnalysisCompleted": "pathology_worker",
                        "RiskAnalysisCompleted": "risk_worker"
                    }

                    if event_type in worker_mapping:
                        db = next(get_db())
                        target_worker = worker_mapping[event_type]
                        # UPSERT job status
                        job = db.query(models.JobStatus).filter(
                            models.JobStatus.session_id == session_id,
                            models.JobStatus.worker_type == target_worker
                        ).first()
                        
                        if not job:
                            job = models.JobStatus(session_id=session_id, worker_type=target_worker)
                            db.add(job)
                        
                        job.status = "DONE"
                        job.result = payload
                        job.updated_at = text("NOW()")
                        db.commit()
                        db.close()
                        
                        # Trigger check for synthesis
                        asyncio.create_task(check_and_synthesize(session_id))
        except Exception as e:
            print(f"Redis listener ERROR, reconnecting in 5s: {e}", flush=True)
            await asyncio.sleep(5)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start Redis listener as a background task
    print("Synthesizer lifespan starting...", flush=True)
    task = asyncio.create_task(redis_listener())
    yield
    print("Synthesizer lifespan shutting down...", flush=True)
    task.cancel()

app = FastAPI(title="Synthesizer Agent", lifespan=lifespan)

@app.get("/health")
def health():
    return {"status": "ok"}
