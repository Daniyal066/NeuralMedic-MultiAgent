import asyncio
import json
import logging
import os
from contextlib import asynccontextmanager

import asyncpg
import redis.asyncio as redis
from fastapi import FastAPI
from dotenv import load_dotenv
from groq import AsyncGroq

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("synthesizer-service")

# Configuration
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "neuralmedic")
DB_USER = os.getenv("DB_USER", "admin")
DB_PASSWORD = os.getenv("DB_PASS", "change_me")

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
REDIS_CHANNEL = "worker_results"

GROQ_API_KEY = os.environ.get("GROQ_API_KEY")

WORKERS = {
    'pathology_hunter',
    'biometric_analyst',
    'risk_calculator',
    'pharmacology_agent'
}

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

# Groq Client (initialized once at module level)
groq_client = AsyncGroq(api_key=GROQ_API_KEY)

SYNTHESIZER_PROMPT = """
You are the *Synthesizer Agent*, acting as the Chief Medical Officer. You receive analysis from specialized workers (Pathology, Biometric, Risk, Pharmacology).
*   **Role:** Synthesize these disjointed reports into a coherent final diagnosis.
*   **Contradiction Check:** If workers disagree (e.g., Pathology says 'Benign', Risk says 'High'), you must flag this contradiction immediately.
*   **Bias Auditing:** Explicitly check for demographic bias. Does the diagnosis change if the patient's race/gender were different?
*   **The Confidence Rule:** If confidence is below 80% (0.8) OR if critical information is missing to form a safe diagnosis:
    *   **DO NOT** output a diagnosis.
    *   **Output JSON:** `{ "action": "RECURSIVE_TRIGGER", "confidence_score": 0.7, "missing_info": ["<LIST_MISSING_FIELDS>"], "context_summary": "<WHY_INFO_IS_MISSING>" }`.
*   **Success Rule:** If confidence is >= 80% (0.8):
    *   **Output JSON:** `{ "action": "FINAL_DIAGNOSIS", "confidence_score": 0.9, "clinical_summary": "<COHERENT_SUMMARY>" }`.

Output pure JSON. Do not wrap in markdown tags.
"""

async def check_all_workers_completed(session_id: str, pool: asyncpg.Pool) -> bool:
    """Checks if all 4 workers are DONE for a session_id."""
    async with pool.acquire() as conn:
        records = await conn.fetch(
            "SELECT worker_type, status FROM job_status WHERE session_id = $1",
            session_id
        )

        status_map = {rec['worker_type']: rec['status'] for rec in records}

        for worker in WORKERS:
            if status_map.get(worker) != 'DONE':
                return False
        return True

async def process_session(session_id: str):
    pool = await get_db_pool()

    async with pool.acquire() as conn:
        # Check if already synthesized
        existing = await conn.fetchval(
            "SELECT id FROM final_diagnoses WHERE session_id = $1", session_id
        )
        if existing:
            logger.info(f"Session {session_id} already has a final diagnosis.")
            return

        # Fetch all reasoning paths
        records = await conn.fetch('''
            SELECT rp.worker_name, rp.reasoning_jsonb
            FROM reasoning_paths rp
            JOIN job_status js ON rp.job_id = js.job_id
            WHERE js.session_id = $1
        ''', session_id)

        if not records:
            logger.warning(f"No reasoning paths found for session {session_id}. Cannot synthesize.")
            return

        reports = {rec['worker_name']: rec['reasoning_jsonb'] for rec in records}

    logger.info(f"All worker reports gathered for session {session_id}. Calling Groq LLM...")

    # ------------------------------------------------------------------ #
    #  Live Groq API call — wraps the chat completion in try/except so    #
    #  the Orchestrator's Redlock is always released via a status update. #
    # ------------------------------------------------------------------ #
    try:
        response = await groq_client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": SYNTHESIZER_PROMPT},
                {"role": "user", "content": f"Here are the worker reports: {json.dumps(reports)}"}
            ],
            temperature=0.2,
            max_tokens=1024,
        )
        result_text = response.choices[0].message.content
        result_json = json.loads(result_text)
        logger.info(f"Groq LLM Response: {result_json}")

    except Exception as e:
        logger.error(f"Groq API call failed for session {session_id}: {e}")
        # Mark job as FAILED so the Orchestrator releases the Redlock
        async with pool.acquire() as conn:
            await conn.execute(
                "UPDATE jobs SET status = 'FAILED' WHERE session_id = $1",
                session_id
            )
        logger.info(f"Job status set to FAILED for session {session_id}.")
        return

    confidence = result_json.get('confidence_score', 0.0)
    action = result_json.get('action', 'FINAL_DIAGNOSIS')

    async with pool.acquire() as conn:
        async with conn.transaction():
            if action == 'RECURSIVE_TRIGGER' or confidence < 0.8:
                logger.info(f"Low confidence ({confidence}). Triggering recursion for session {session_id}...")
                payload = {
                    "session_id": str(session_id),
                    "missing_information_list": result_json.get('missing_info', []),
                    "context_summary": result_json.get(
                        'context_summary',
                        "Confidence too low based on synthesized reports."
                    )
                }
                # Write RE_ENGAGE_EVENT to transactional outbox
                await conn.execute(
                    """
                    INSERT INTO outbox_events (aggregate_id, event_type, payload)
                    VALUES ($1, $2, $3::jsonb)
                    """,
                    str(session_id),
                    "RE_ENGAGE_EVENT",
                    json.dumps(payload)
                )
            else:
                logger.info(f"High confidence ({confidence}). Saving final diagnosis for session {session_id}...")
                # Persist the final diagnosis
                await conn.execute(
                    """
                    INSERT INTO final_diagnoses (session_id, clinical_summary, confidence_score)
                    VALUES ($1, $2, $3)
                    """,
                    session_id,
                    result_json.get('clinical_summary', 'No summary provided'),
                    confidence
                )
                # Mark the job as COMPLETED to release the Orchestrator's Redlock
                await conn.execute(
                    "UPDATE jobs SET status = 'COMPLETED' WHERE session_id = $1",
                    session_id
                )
                logger.info(f"Job status set to COMPLETED for session {session_id}.")

async def redis_listener():
    """Listens to worker_results channel for WORKER_DONE events."""
    logger.info(f"Starting Redis listener on channel: {REDIS_CHANNEL}")
    try:
        r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)
        pubsub = r.pubsub()
        await pubsub.subscribe(REDIS_CHANNEL)

        pool = await get_db_pool()

        async for message in pubsub.listen():
            if message['type'] == 'message':
                try:
                    data = json.loads(message['data'])
                    event_type = data.get('event_type') or data.get('type')

                    if event_type == 'WORKER_DONE' or data.get('status') == 'DONE':
                        job_id = data.get('job_id')
                        if job_id:
                            async with pool.acquire() as conn:
                                session_id = await conn.fetchval(
                                    "SELECT session_id FROM job_status WHERE job_id = $1",
                                    job_id
                                )

                            if session_id:
                                if await check_all_workers_completed(session_id, pool):
                                    await process_session(session_id)
                        else:
                            logger.warning(f"WORKER_DONE event missing job_id: {data}")

                except json.JSONDecodeError:
                    pass
                except Exception as e:
                    logger.error(f"Error processing message: {e}")

    except Exception as e:
        logger.error(f"Redis listener error: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(redis_listener())
    yield
    task.cancel()
    if db_pool:
        await db_pool.close()

app = FastAPI(lifespan=lifespan)

@app.get("/health")
async def health_check():
    return {"status": "ok"}
