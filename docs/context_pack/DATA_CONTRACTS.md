# DATA_CONTRACTS.md

## PostgreSQL Schema

### `sessions`
```sql
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    transcript_jsonb JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### `job_status`
```sql
CREATE TYPE job_status_enum AS ENUM ('PENDING', 'PROCESSING', 'DONE', 'FAILED');

CREATE TABLE job_status (
    job_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES sessions(id),
    worker_type VARCHAR(50) NOT NULL,
    status job_status_enum NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### `reasoning_paths`
```sql
CREATE TABLE reasoning_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES job_status(job_id),
    worker_name VARCHAR(100) NOT NULL,
    reasoning_jsonb JSONB NOT NULL,
    evidence_links_array TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### `outbox`
```sql
CREATE TABLE outbox (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aggregate_type VARCHAR(100) NOT NULL,
    aggregate_id VARCHAR(100) NOT NULL,
    payload_json JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Redis Event Schemas

### `JOB_READY`
**Channel:** `job_queue`
```json
{
  "session_id": "uuid-string",
  "priority": "high|medium|low"
}
```

### `TASK_ASSIGNMENT`
**Channel:** `worker_tasks`
```json
{
  "job_id": "uuid-string",
  "task_type": "pathology|biometric|risk|pharmacology",
  "session_id": "uuid-string"
}
```

### `WORKER_DONE`
**Channel:** `worker_results`
```json
{
  "job_id": "uuid-string",
  "worker_type": "pathology|biometric|risk|pharmacology",
  "status": "DONE|FAILED"
}
```

### `RE_ENGAGE_EVENT`
**Channel:** `recursion_queue`
```json
{
  "session_id": "uuid-string",
  "missing_information_list": [
    "patient_age",
    "symptom_duration"
  ],
  "context_summary": "Initial assessment inconclusive due to missing basic demographics."
}
```
