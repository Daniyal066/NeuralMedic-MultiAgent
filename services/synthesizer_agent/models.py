from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, text
from sqlalchemy.dialects.postgresql import JSONB
from database import Base

class OutboxEvent(Base):
    __tablename__ = "outbox_events"

    id = Column(Integer, primary_key=True, autoincrement=True)
    aggregate_id = Column(String(50), nullable=False)
    event_type = Column(String(255), nullable=False)
    payload = Column(JSONB, nullable=False)
    processed = Column(Boolean, server_default=text("FALSE"))
    created_at = Column(DateTime, server_default=text("NOW()"))

class JobStatus(Base):
    __tablename__ = "job_status"

    id = Column(Integer, primary_key=True, autoincrement=True)
    session_id = Column(String(50), nullable=False)
    worker_type = Column(String(50), nullable=False)
    status = Column(String(20), default="PENDING")
    result = Column(JSONB)
    created_at = Column(DateTime, server_default=text("NOW()"))
    updated_at = Column(DateTime, server_default=text("NOW()"))
