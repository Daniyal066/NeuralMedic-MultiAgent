from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy.exc import OperationalError
from typing import Optional, List, Dict
import os
import time
import json
from groq import Groq

import models
from database import engine, get_db

for _ in range(10):
    try:
        models.Base.metadata.create_all(bind=engine)
        break
    except OperationalError:
        print("Database not ready, waiting...")
        time.sleep(3)

app = FastAPI(title="Interview Agent (Ingestion)")

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# Add system prompt
SYSTEM_PROMPT = """
You are a helpful and empathetic medical AI assistant conducting an initial triage interview with a patient.
Your goal is to gather the patient's symptoms, duration, severity, and basic medical history.
Ask 1 or 2 relevant follow-up questions at a time based on what the patient says. Be conversational and supportive.
Once you feel you have gathered enough information (symptoms and medical history), youMUST output a special JSON string at the very end of your final response exactly in this format:
```json
{
  "status": "complete",
  "symptoms_extracted": "Detailed summary of all reported symptoms.",
  "medical_history_extracted": "Summary of any past medical history or 'None reported'."
}
```
Until you have enough info, do NOT output the JSON block, just continue the conversation naturally.
"""

class ChatMessage(BaseModel):
    patient_id: str
    message: str

class ChatResponse(BaseModel):
    reply: str
    status: str

@app.post("/chat/{session_id}", response_model=ChatResponse)
def handle_chat(session_id: str, payload: ChatMessage, db: Session = Depends(get_db)):
    # 1. Fetch or create the session record
    record = db.query(models.Healthcare).filter(models.Healthcare.session_id == session_id).first()
    if not record:
        record = models.Healthcare(
            patient_id=payload.patient_id,
            session_id=session_id,
            transcript=json.dumps([{"role": "system", "content": SYSTEM_PROMPT}])
        )
        db.add(record)
        db.commit()
    
    # 2. Load transcript history
    try:
        history = json.loads(record.transcript or "[]")
    except json.JSONDecodeError:
        history = [{"role": "system", "content": SYSTEM_PROMPT}]
    
    # Append user message
    history.append({"role": "user", "content": payload.message})

    # 3. Call Groq Llama LLM
    try:
        chat_completion = client.chat.completions.create(
            messages=history,
            model="llama-3.3-70b-versatile",
            temperature=0.7,
        )
        ai_reply = chat_completion.choices[0].message.content
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM Error: {str(e)}")

    # Append AI reply to history
    history.append({"role": "assistant", "content": ai_reply})
    
    # 4. Check if AI returned the extraction JSON (meaning interview is complete)
    completion_status = "ongoing"
    if "{" in ai_reply and "}" in ai_reply:
        try:
            # Find the first { and last }
            start = ai_reply.find("{")
            end = ai_reply.rfind("}") + 1
            json_str = ai_reply[start:end]
            extracted_data = json.loads(json_str)
            
            if extracted_data.get("status") == "complete":
                completion_status = "complete"
                # Update the database with extracted data
                record.symptoms_text = extracted_data.get("symptoms_extracted", "")
                record.medical_history = extracted_data.get("medical_history_extracted", "")
                
                # Strip the json block from the actual reply sent back to the user
                ai_reply = ai_reply[:start].strip() + "\n" + ai_reply[end:].strip()
        except Exception as e:
            print(f"Failed to parse extraction JSON: {e}", flush=True)

    # 5. Save transcript back to database
    record.transcript = json.dumps(history)
    db.commit()

    return ChatResponse(reply=ai_reply, status=completion_status)
