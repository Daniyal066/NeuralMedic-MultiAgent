import os
import uuid

# Map Docker service hostnames to localhost for host-side execution
os.environ["REDIS_HOST"] = "localhost"
os.environ["DB_HOST"] = "localhost"

from services.interview_agent.database import SessionLocal
from services.interview_agent.models import Healthcare
from neuralmedic_shared.redis_client import RedisManager

# 1. Database Commit
db = SessionLocal()
session_id = str(uuid.uuid4())
test_session = Healthcare(
    id=session_id,
    patient_id="PATIENT_99",
    session_id=session_id,
    symptoms_text="Test transcript: Patient reports mild headache."
)
db.add(test_session)
db.commit()
print(f"✅ DB COMMIT SUCCESS: Session {session_id} saved.")

# 2. Redis Signal
redis_manager = RedisManager()
client = getattr(redis_manager, "redis", getattr(redis_manager, "client", redis_manager))
client.set(f"session:{session_id}:status", "INTERVIEW_COMPLETE")
print(f"✅ REDIS PUBLISH SUCCESS: Signal sent for {session_id}.")

db.close()