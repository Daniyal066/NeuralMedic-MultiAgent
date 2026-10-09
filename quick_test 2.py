import uuid
from services.interview_agent.database import SessionLocal
from services.interview_agent.models import Session
from neuralmedic_shared.redis_client import RedisManager

# 1. Database Commit
db = SessionLocal()
session_id = str(uuid.uuid4())
test_session = Session(
    id=session_id,
    patient_id="PATIENT_99",
    transcript="Test transcript: Patient reports mild headache."
)
db.add(test_session)
db.commit()
print(f"✅ DB COMMIT SUCCESS: Session {session_id} saved.")

# 2. Redis Publish
redis_manager = RedisManager()
redis_manager.set_state(f"session:{session_id}:status", "INTERVIEW_COMPLETE")
print(f"✅ REDIS PUBLISH SUCCESS: Signal sent for {session_id}.")

db.close()