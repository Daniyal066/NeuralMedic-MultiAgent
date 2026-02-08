# NeuralMedic: Agentic AI-Based Disease Detection System 🏥🤖

## 1. Project Mission: The Agentic Medical Board
The core objective of this project is to build an **Agentic AI-Based Disease Detection System**. It uses a collaborative "Medical Board" of **11 autonomous agents** to analyze multimodal patient data (lab reports, skin/hair images, and health history) to provide high-fidelity decision support to doctors while keeping patients informed.

## 2. Integrated System Architecture
To ensure clinical reliability and system responsiveness, we have engineered an **Asynchronous, Event-Driven Architecture** using the following stack:

*   **Ingestion Layer (FastAPI)**: Acts as the entry point, receiving patient artifacts (PDFs, JPEGs) and offloading heavy processing to the background to ensure zero UI latency.
*   **Message Broker (Redis)**: Manages the communication between the API and workers. It features a **Priority Queue (Urgency Filter)** to ensure life-threatening alerts (like heart spikes) jump to the front of the line.
*   **Worker Pool (Celery)**: Hosts the **11 Specialized Agents** as stateless, horizontally scalable workers that process data in parallel.
*   **Storage Tier**: Uses **PostgreSQL** for reasoning paths and metadata, and **S3/MinIO** for raw medical artifacts like high-res images and lab reports.

## 3. The 11-Agent Intelligence Framework
The "intelligence" is split into three integrated tiers to ensure the doctor receives a "pre-verified" case file:

### Tier 1: Specialized Experts (The Workers)
*   **Triage Agent**: Conducts adaptive patient interviews to gather symptoms.
*   **Multimodal Parser**: Extracts structured data from raw PDFs and images.
*   **Cardio-Metabolic Agent**: Detects patterns in heart and glucose data.
*   **Derm-Pathology Agent**: Analyzes skin and hair pathologies visually.
*   **Memory Agent**: Compares current data with historical records to find "slow-burn" trends.

### Tier 2: Audit & Safety (The Fact-Checkers)
*   **Explainability (XAI) Agent**: Grounding AI claims by linking them directly to evidence in the lab reports.
*   **Pharmacology Agent**: Checks for drug-to-drug interactions and allergies.
*   **Ethics Auditor**: Ensures diagnostic logic remains fair across all demographics.
*   **Sentiment Agent**: Assesses patient anxiety to help the doctor adjust their tone.

### Tier 3: Management (The Bridge)
*   **The Orchestrator**: Synthesizes all specialist findings into a unified 30-Second Dashboard for the doctor.
*   **Compliance Agent**: Monitors the patient post-visit to ensure they follow the treatment plan.

## 4. Clinical Workflow & Features
The system follows a strict "Human-in-the-Loop" flow to maintain medical accountability:

*   **Urgency Filter**: Automatically categorizes cases into **Red (Emergency)**, **Yellow (Consult)**, or **Green (Stable)**.
*   **Dual-Output Reporting**:
    *   **Patient**: Receives a simplified "Health Snapshot" with traffic-light status.
    *   **Doctor**: Receives a deep-dive "Clinical Case File" with evidence-based decision support.
*   **One-Click Validation**: The doctor reviews the AI's proposed plan and can approve or modify it with a single click.

## Why Antigravity Wins
By using Celery and Redis to power an Agentic Board, we turn hours of manual data review into seconds of verified insight. This architecture is not just an app—it is a scalable medical infrastructure designed for the future of healthcare.
