from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import APIKeyHeader
from sqlalchemy.orm import Session
import os
import json
import httpx
import re
from groq import Groq

import models
from database import engine, get_db

# Ensure outbox_events table exists
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Risk Worker")

api_key_header = APIKeyHeader(name="X-API-Key")

def verify_api_key(api_key: str = Depends(api_key_header)):
    if api_key != os.environ.get("INTERNAL_API_KEY", "default_internal_secret_key"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid API Key")

groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

CONTEXT_SERVICE_URL = os.getenv("CONTEXT_SERVICE_URL", "http://context_service:8000")

RISK_SYSTEM_PROMPT = """You are a specialized Risk Assessment AI for a medical diagnostic system.
You will receive a patient's symptoms, medical history, and similar case data from other patients.
Your job is to:
1. Evaluate the urgency and severity of the patient's condition.
2. Calculate a Risk Score (0-100) based on symptom severity, medical history, and similar case outcomes.
3. Classify the risk level as: LOW, MEDIUM, HIGH, or CRITICAL.
4. Identify any red flags that require immediate medical attention.

Output your analysis as structured JSON in this exact format:
{
  "risk_score": 65,
  "risk_level": "MEDIUM",
  "urgency": "Non-emergency but requires timely attention",
  "red_flags": ["List of any alarming indicators"],
  "risk_factors": [
    {
      "factor": "Description of risk factor",
      "impact": "HIGH/MEDIUM/LOW"
    }
  ],
  "recommended_timeline": "Within 24-48 hours",
  "justification": "Brief explanation of the risk assessment"
}"""


@app.post("/analyze/risk/{session_id}")
def analyze_risk(session_id: str, db: Session = Depends(get_db), api_key: str = Depends(verify_api_key)):
    # 1. Pull data from Context Service
    try:
        headers = {"X-API-Key": os.environ.get("INTERNAL_API_KEY", "default_internal_secret_key")}
        with httpx.Client(timeout=30.0, headers=headers) as http_client:
            response = http_client.get(f"{CONTEXT_SERVICE_URL}/context/{session_id}")
            response.raise_for_status()
            context_data = response.json()
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch context: {str(e)}")

    if not context_data:
        raise HTTPException(status_code=404, detail=f"No context found for session {session_id}")

    # 2. Build prompt from context
    patient = context_data[0]
    similar_cases = patient.get("similar_cases", [])
    analysis_summary = patient.get("analysis_summary", "N/A")

    user_prompt = f"""
Patient Session: {session_id}
Symptoms: {patient.get('symptoms_text', 'N/A')}
Medical History: {patient.get('medical_history', 'N/A')}
Doctor Notes: {patient.get('doctor_notes', 'N/A')}

Context Service Analysis Summary:
{analysis_summary}

Similar Cases Found ({len(similar_cases)}):
"""
    for i, case in enumerate(similar_cases, 1):
        if "error" not in case:
            user_prompt += f"""
  Case {i}: Session {case.get('session_id', 'N/A')}
    Symptoms: {case.get('symptoms', 'N/A')}
    History: {case.get('medical_history', 'N/A')}
    Notes: {case.get('doctor_notes', 'N/A')}
    Similarity: {case.get('similarity', 'N/A')}
"""

    user_prompt += "\nPlease provide your risk assessment based on the above data."

    # 3. Run Groq LLM
    try:
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {"role": "system", "content": RISK_SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.3,
        )
        llm_response = chat_completion.choices[0].message.content
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM Error: {str(e)}")

    # 4. Parse LLM JSON response
    try:
        match = re.search(r'\{.*\}', llm_response, re.DOTALL)
        if match:
            analysis_json = json.loads(match.group(0))
        else:
            analysis_json = {"raw_analysis": llm_response}
    except json.JSONDecodeError:
        analysis_json = {"raw_analysis": llm_response}

    # 5. Write to Outbox
    outbox_event = models.OutboxEvent(
        aggregate_id=session_id,
        event_type="RiskAnalysisCompleted",
        payload=json.dumps({
            "session_id": session_id,
            "patient_id": patient.get("patient_id"),
            "analysis": analysis_json
        })
    )
    db.add(outbox_event)
    db.commit()

    return {
        "status": "completed",
        "session_id": session_id,
        "event_type": "RiskAnalysisCompleted",
        "analysis": analysis_json
    }
