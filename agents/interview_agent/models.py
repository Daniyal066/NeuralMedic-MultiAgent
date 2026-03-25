from sqlalchemy import Column, String, Text, DateTime, Integer, Boolean, text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from database import Base

class Healthcare(Base):
    __tablename__ = "healthcare"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    patient_id = Column(String, nullable=False)
    session_id = Column(String, nullable=False, unique=True)
    symptoms_text = Column(Text)
    medical_history = Column(Text)
    doctor_notes = Column(Text)
    created_at = Column(DateTime, server_default=text("NOW()"))
    
    # Optional field for storing the full raw transcript
    transcript = Column(Text)

class OutboxEvent(Base):
    __tablename__ = "outbox_events"

    id = Column(Integer, primary_key=True, autoincrement=True)
    aggregate_id = Column(String(50), nullable=False)
    event_type = Column(String(255), nullable=False)
    payload = Column(JSONB, nullable=False)
    processed = Column(Boolean, server_default=text("FALSE"))
    created_at = Column(DateTime, server_default=text("NOW()"))
