# SERVICE_BOUNDARIES.md

## 1. Directory Structure

We will adopt a scalable **Monorepo** structure:

```
/
├── apps/
│   ├── frontend/         # Next.js / React
│   └── admin-dashboard/  # Internal tools
├── services/
│   ├── orchestrator/     # Master Orchestrator (Kubernetes)
│   ├── interview-agent/  # Stateful Interview Service
│   ├── synthesizer/      # Decision Engine
│   ├── worker-pathology/ # Specialized Worker
│   ├── worker-risk/      # Specialized Worker
│   └── cdc-service/      # Change Data Capture
├── packages/
│   ├── shared-types/     # TypeScript definitions (shared across all apps/services)
│   ├── db-schema/        # Prisma / SQL migrations
│   └── logger/           # Structured logging library
└── docs/
    └── context_pack/     # Immutable architectural constraints
```

## 2. Responsibility Matrix

| Component           | Responsibility                                                                 | Owner Team      |
| :---                | :---                                                                           | :---            |
| **Frontend**        | Rendering UI, capturing initial complaint, displaying final diagnosis.         | UX Team         |
| **Interview Agent** | Conversational flow, state management, writing to PostgreSQL.                  | Core AI Team    |
| **Orchestrator**    | Routing jobs, managing retries, scaling workers.                               | DevOps / Infra  |
| **Workers**         | Pure compute. Fetch context -> Process -> Write Result + Outbox.               | Domain Experts  |
| **Synthesizer**     | Aggregating results, bias checking, final decision, triggering recursion.      | Core AI Team    |
| **CDC Service**     | Reliable event propagation from Postgres to Redis.                             | Data Eng Team   |
| **Document Service**| Managing S3 access via pre-signed URLs.                                        | Security Team   |
