# NeuralMedic-MultiAgent Infrastructure

This project uses a containerized infrastructure for the database (PostgreSQL) and message broker (Redis).

## Prerequisites

1.  **Docker Desktop**: Must be installed and running.
2.  **Python 3.11+**: For running verification scripts and agents.

## Quick Start

### 1. Start Infrastructure
Start the PostgreSQL and Redis containers:
```bash
docker compose up -d
```

### 2. Install Python Dependencies
Install the required libraries:
```bash
pip install -r requirements.txt
```

### 3. Verify Setup
Check if the containers are running:
```bash
docker ps
```
You should see `neuralmedic_postgres` and `neuralmedic_redis`.

## Architecture
- **PostgreSQL**: Port `5432`. Stores `sessions`, `job_status`, and `outbox`.
- **Redis**: Port `6379`. Channels: `critical_queue`, `default_queue`.
