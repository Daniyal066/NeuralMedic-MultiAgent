#!/bin/bash
set -e

echo "Clearing old test data..."
docker exec neuralmedic_postgres psql -U admin -d neuralmedic -c "TRUNCATE final_diagnoses, reasoning_paths, job_status, sessions, users CASCADE;"

echo "Seeding users, sessions and job_status with 4 completed workers (required for synthesizer)..."
docker exec neuralmedic_postgres psql -U admin -d neuralmedic -c "
-- Table users
INSERT INTO users (id, email, role) VALUES ('440e8400-e29b-41d4-a716-446655440000', 'test@neuralmedic.com', 'patient');

-- Table sessions
INSERT INTO sessions (id, user_id, status) VALUES ('550e8400-e29b-41d4-a716-446655440000', '440e8400-e29b-41d4-a716-446655440000', 'active');

-- Table job_status: Synthesizer requires 4 specialized workers to be DONE
INSERT INTO job_status (job_id, session_id, worker_type, status) VALUES 
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c51', '550e8400-e29b-41d4-a716-446655440000', 'pathology_hunter', 'DONE'),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c52', '550e8400-e29b-41d4-a716-446655440000', 'biometric_analyst', 'DONE'),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c53', '550e8400-e29b-41d4-a716-446655440000', 'risk_calculator', 'DONE'),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c54', '550e8400-e29b-41d4-a716-446655440000', 'pharmacology_agent', 'DONE'),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', '550e8400-e29b-41d4-a716-446655440000', 'synthesizer', 'DONE');

-- Table reasoning_paths
INSERT INTO reasoning_paths (id, session_id, job_id, worker_name, reasoning_jsonb) VALUES 
('b1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e', '550e8400-e29b-41d4-a716-446655440000', 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c51', 'pathology_hunter', '{\"finding\": \"Normal\", \"confidence\": 0.98}');
"

echo "Seeding complete!"
