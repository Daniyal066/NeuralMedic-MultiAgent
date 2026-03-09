from sqlalchemy import Column, String, Text, DateTime, text
from sqlalchemy.dialects.postgresql import UUID
from pgvector.sqlalchemy import Vector
from database import Base

class Healthcare(Base):
    __tablename__ = "healthcare"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    patient_id = Column(String, nullable=False)
    session_id = Column(String, nullable=False)
    symptoms_text = Column(Text)
    medical_history = Column(Text)
    doctor_notes = Column(Text)
    created_at = Column(DateTime, server_default=text("NOW()"))
    
    # Vector columns
    symptoms_embedding = Column(Vector(384))
    history_embedding = Column(Vector(384))
    notes_embedding = Column(Vector(384))
