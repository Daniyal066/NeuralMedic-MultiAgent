-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create sessions table (REQUIRED: Referenced by job_status)
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    transcript_jsonb JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create job_status_enum type if it doesn't exist
DO $$ BEGIN
    CREATE TYPE job_status_enum AS ENUM ('PENDING', 'PROCESSING', 'DONE', 'FAILED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create job_status table
CREATE TABLE IF NOT EXISTS job_status (
    job_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES sessions(id),
    worker_type VARCHAR(50) NOT NULL,
    status job_status_enum NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create outbox table
CREATE TABLE IF NOT EXISTS outbox (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(255) NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reasoning_paths table
CREATE TABLE IF NOT EXISTS reasoning_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES job_status(job_id),
    worker_name VARCHAR(100) NOT NULL,
    reasoning_jsonb JSONB NOT NULL,
    evidence_links_array TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create final_diagnoses table
CREATE TABLE IF NOT EXISTS final_diagnoses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES sessions(id),
    clinical_summary TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
