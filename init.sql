-- Enable vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create healthcare table if it doesn't exist
CREATE TABLE IF NOT EXISTS healthcare (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id VARCHAR(50) NOT NULL,
    session_id VARCHAR(50) NOT NULL,
    symptoms_text TEXT,
    medical_history TEXT,
    doctor_notes TEXT,
    transcript TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    
    -- Embedding columns (384 dimensions for all-MiniLM-L6-v2)
    symptoms_embedding VECTOR(384),
    history_embedding VECTOR(384),
    notes_embedding VECTOR(384)
);

-- Outbox table for event publishing (Unified Schema)
CREATE TABLE IF NOT EXISTS outbox_events (
    id SERIAL PRIMARY KEY,
    aggregate_id VARCHAR(50) NOT NULL,
    event_type VARCHAR(255) NOT NULL,
    payload JSONB NOT NULL,
    processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job Status table for orchestration
CREATE TABLE IF NOT EXISTS job_status (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(50) NOT NULL,
    worker_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    result JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add vector indexes
CREATE INDEX IF NOT EXISTS idx_symptoms_embedding ON healthcare USING ivfflat (symptoms_embedding vector_l2_ops) WITH (lists = 100);

-- Insert dummy data for verification
INSERT INTO healthcare (patient_id, session_id, symptoms_text, medical_history, doctor_notes, symptoms_embedding)
VALUES 
('pat_001', 'sess_001', 'Headache and fever', 'No prior history', 'Patient advised rest', (SELECT array_agg(random())::vector(384) FROM generate_series(1, 384))),
('pat_002', 'sess_002', 'Stomach ache', 'Ulcer history', 'Prescribed antacids', (SELECT array_agg(random())::vector(384) FROM generate_series(1, 384))),
('pat_003', 'sess_003', 'Migraine', 'Chronic headaches', 'Prescribed painkillers', (SELECT array_agg(random())::vector(384) FROM generate_series(1, 384)));

-- Optimize index
VACUUM ANALYZE healthcare;
