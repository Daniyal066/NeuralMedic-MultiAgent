# SYSTEM_PATTERNS.md

## 1. Transactional Outbox Pattern

To ensure data consistency between PostgreSQL and Redis, we implement the **Transactional Outbox Pattern**.

### The Rule
**Workers MUST NOT write to Redis directly.**

### The Flow
1.  **Worker Processing:** The worker processes the task and generates a result.
2.  **Atomic Transaction:** Within a single database transaction, the worker:
    *   Writes the result to the domain table (e.g., `reasoning_paths`).
    *   Writes an event to the `outbox` table.
3.  **CDC Service (Change Data Capture):**
    *   Reads the `outbox` table.
    *   Publishes the event to the appropriate Redis channel (e.g., `worker_results`).
    *   Marks the outbox entry as processed (or deletes it).

This guarantees that we never have a situation where the database is updated but the event is lost, or vice versa.

## 2. Recursive Logic Flow

The system supports recursive refinement of the diagnosis through a feedback loop.

### The Flow
1.  **Synthesizer Agent:** Evaluates the gathered reasoning paths.
2.  **Confidence Check:** If confidence is below the threshold or critical information is missing:
    *   Synthesizer pushes a `RE_ENGAGE_EVENT` to the `recursion_queue` Redis channel.
3.  **Master Orchestrator:** Listens to `recursion_queue`.
4.  **Redirection:** Master pushes a `JOB_READY` event (with high priority) to the `interview_queue` Redis channel.
5.  **Interview Agent:**
    *   Picks up the job from `interview_queue`.
    *   Generates a follow-up question based on the `missing_information_list`.
    *   Interacts with the user to gather the missing data.

## 3. Statelessness Mandate

**All Workers must be stateless.**

*   **No Local State:** Workers must not rely on local variables or in-memory caches to persist data between requests.
*   **Context Fetching:** Workers must explicitly fetch all necessary context (transcript, previous results, patient history) from the **Internal API Gateway** using the `session_id` provided in the task assignment.
*   **Scaling:** This allows the Kubernetes Horizontal Pod Autoscaler (HPA) to scale workers up or down without data loss.
