# SECURITY_PROTOCOLS.md

## 1. Storage Access

**Direct access to S3 buckets is strictly FORBIDDEN.**

### The Process
1.  **Request:** Workers must request a pre-signed URL (upload or download) from the `Document Service`.
2.  **Authorization:** The `Document Service` validates the worker's permissions (using RBAC) and the existence of the `session_id`.
3.  **Operation:** The worker uses the pre-signed URL to perform the file operation.
4.  **Logging:** All requests for URLs are logged for audit purposes.

## 2. PII / PHI Handling

Patient Identifiable Information (PII) and Protected Health Information (PHI) must be handled with extreme care.

### Redaction Rules
*   **Logs:** NEVER log full names, SSNs, or other direct identifiers.
*   **Redis:** Redis messages should only contain `session_id` and non-sensitive metadata. The actual payload (e.g., transcript) remains in PostgreSQL or strictly controlled S3 buckets.
*   **Transcript Processing:** The transcript stored in `sessions` should be the raw source. Any downstream analysis or external API calls (e.g., to LLMs) must use a sanitized version unless strictly necessary and compliant with HIPAA business associate agreements.

## 3. Secrets Management

*   **No Hardcoding:** NEVER hardcode secrets (API keys, DB passwords, etc.) in the source code.
*   **Environment Variables:** Use `.env` files for local development (which are git-ignored).
*   **Production:** Use a dedicated secrets manager (e.g., HashiCorp Vault, AWS Secrets Manager) to inject secrets as environment variables at runtime.
