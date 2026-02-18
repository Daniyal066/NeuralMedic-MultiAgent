-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- 1. Core Domain
-- ==========================================

-- patients: Stores patient demographics and medical history
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID, -- Optional link to auth system
    full_name VARCHAR(255),
    dob DATE,
    gender VARCHAR(50),
    medical_history_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- doctors: Registered medical professionals
CREATE TABLE IF NOT EXISTS doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    specialization VARCHAR(100),
    license_number VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- symptoms: Reference data for standardized symptoms
CREATE TABLE IF NOT EXISTS symptoms (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    severity_scale INT CHECK (severity_scale BETWEEN 1 AND 10)
);

-- diseases: Reference data for standardized diseases (ICD-10)
CREATE TABLE IF NOT EXISTS diseases (
    id SERIAL PRIMARY KEY,
    icd10_code VARCHAR(50) UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

-- ==========================================
-- 2. Operational Schema
-- ==========================================

-- sessions: Medical consultation sessions
-- Note: 'patient_id' and 'doctor_id' added. 'user_id' kept for backward compatibility if needed, or deprecated.
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id),
    doctor_id UUID REFERENCES doctors(id),
    user_id UUID, -- Deprecated, use patient_id
    status VARCHAR(50) DEFAULT 'ACTIVE', -- ACTIVE, COMPLETED, ARCHIVED
    transcript_jsonb JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- patient_symptoms: Many-to-Many link between sessions and symptoms
CREATE TABLE IF NOT EXISTS patient_symptoms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES sessions(id),
    symptom_id INT REFERENCES symptoms(id),
    severity INT,
    duration_days INT,
    notes TEXT
);

-- job_status_enum: Status for jobs and tasks
DO $$ BEGIN
    CREATE TYPE job_status_enum AS ENUM ('PENDING', 'PROCESSING', 'DONE', 'FAILED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- job_status: High-level job tracking (Preserved for compatibility)
CREATE TABLE IF NOT EXISTS job_status (
    job_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES sessions(id),
    worker_type VARCHAR(50) NOT NULL,
    status job_status_enum NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 3. Agent System Schema
-- ==========================================

-- agents: Registry of AI agents
CREATE TABLE IF NOT EXISTS agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL,
    version VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- agent_tasks: Granular tasks assigned to agents
CREATE TABLE IF NOT EXISTS agent_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES sessions(id),
    agent_id UUID REFERENCES agents(id),
    task_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    input_payload JSONB,
    output_payload JSONB,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- agent_execution_logs: Debug logs for agents
CREATE TABLE IF NOT EXISTS agent_execution_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES agent_tasks(id),
    log_level VARCHAR(20) DEFAULT 'INFO',
    message TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 4. Analytics & Audit
-- ==========================================

-- predictions: Final diagnostic outputs
CREATE TABLE IF NOT EXISTS predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES sessions(id),
    primary_disease_id INT REFERENCES diseases(id),
    confidence_score DECIMAL(5,4),
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- feedback: RLHF from doctors
CREATE TABLE IF NOT EXISTS feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prediction_id UUID REFERENCES predictions(id),
    reviewer_id UUID,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- audit_logs: Security and traceability
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50),
    entity_id UUID,
    action VARCHAR(50),
    actor_id UUID,
    changes JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- notifications: Real-time alerts for users/doctors
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- Recipient (Doctor or Patient)
    type VARCHAR(50) NOT NULL, -- e.g., 'JOB_COMPLETE', 'ACTION_REQUIRED'
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 5. Infrastructure
-- ==========================================

-- outbox: Transactional Outbox for events
CREATE TABLE IF NOT EXISTS outbox (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aggregate_type VARCHAR(100) NOT NULL,
    aggregate_id VARCHAR(100) NOT NULL,
    payload_json JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
