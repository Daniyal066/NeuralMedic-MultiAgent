-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;
-- Agent Tasks Table (For Task Queue Monitoring & Status Tracking)
CREATE TABLE IF NOT EXISTS agent_tasks (
    id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(50) NOT NULL,
    agent_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'QUEUED',
    priority VARCHAR(20) NOT NULL DEFAULT 'NORMAL',
    payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Clinical Sessions Table (For Intake Transcripts and Extracted Medical Entities)
CREATE TABLE IF NOT EXISTS clinical_sessions (
    session_id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(50) NOT NULL,
    chief_complaint TEXT NOT NULL,
    triage_score VARCHAR(50),
    risk_level VARCHAR(50),
    extracted_symptoms JSONB,
    transcript JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Clinical Vector Embeddings Table (For pgvector Similarity Search)
CREATE TABLE IF NOT EXISTS clinical_embeddings (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(50) REFERENCES clinical_sessions(session_id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    embedding vector(1536), -- Standard OpenAI / Medical Embedding Dimension
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert Sample Seed Data for Admin Console Testing
INSERT INTO agent_tasks (id, patient_id, agent_name, status, priority) VALUES
('TASK-9021', 'PT-8942', 'Interview & Triage Agent', 'PROCESSING', 'HIGH'),
('TASK-9020', 'PT-3105', 'Embedding Vector Search', 'COMPLETED', 'NORMAL'),
('TASK-9019', 'PT-6621', 'Context Extraction Agent', 'QUEUED', 'URGENT')
ON CONFLICT (id) DO NOTHING;

INSERT INTO clinical_sessions (session_id, patient_id, chief_complaint, triage_score, risk_level, extracted_symptoms, transcript) VALUES
(
    'SESS-1042',
    'PT-8942',
    'Acute chest pressure radiating to left arm',
    'HIGH URGENCY (8.8/10)',
    'ACUTE_CORONARY_SYNDROME_SUSPECTED',
    '["Chest pressure", "Left arm numbness", "Dyspnea"]'::jsonb,
    '[
        {"speaker": "Agent", "text": "Hello. What symptoms are you experiencing today?"},
        {"speaker": "Patient", "text": "I have intense chest tightness and my left arm feels numb."},
        {"speaker": "Agent", "text": "When did this sensation start, and are you feeling short of breath?"},
        {"speaker": "Patient", "text": "Started about 30 minutes ago after walking upstairs. Yes, breathing is hard."}
    ]'::jsonb
)
ON CONFLICT (session_id) DO NOTHING;
