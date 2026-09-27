from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, text
from sqlalchemy.dialects.postgresql import JSONB
from database import Base

class OutboxEvent(Base):
    __tablename__ = "outbox_events"

    id = Column(Integer, primary_key=True, autoincrement=True)
    aggregate_id = Column(String(50), nullable=False)
    event_type = Column(String(50), nullable=False)
    payload = Column(JSONB, nullable=False)
    created_at = Column(DateTime, server_default=text("NOW()"))
    processed = Column(Boolean, server_default=text("FALSE"))
