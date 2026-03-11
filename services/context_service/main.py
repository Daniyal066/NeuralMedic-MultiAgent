from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Optional, Any
import os
from pydantic import BaseModel
import models
from database import engine, get_db

import time
from sqlalchemy.exc import OperationalError

for _ in range(10):
    try:
        models.Base.metadata.create_all(bind=engine)
        break
    except OperationalError:
        print("Database not ready, waiting...")
        time.sleep(3)


app = FastAPI(title="Internal Context Service")

class ContextResponse(BaseModel):
    patient_id: str
    session_id: str
    symptoms_text: Optional[str]
    medical_history: Optional[str]
    doctor_notes: Optional[str]
    similar_cases: Optional[List[Any]] = []
    analysis_summary: Optional[str] = None
    
    class Config:
        from_attributes = True

@app.get("/context/{session_id}", response_model=List[ContextResponse])
def get_context(session_id: str, db: Session = Depends(get_db)):
    # 1. Fetch current session data
    records = db.query(models.Healthcare).filter(models.Healthcare.session_id == session_id).all()
    if not records:
        raise HTTPException(status_code=404, detail="Session context not found")
    
    response_data = []
    for record in records:
        # 2. Perform Vector Search if embedding exists
        similar_cases = []
        analysis_text = None
        if record.symptoms_embedding is not None:
             # Find top 3 similar cases excluding current session
             # Using L2 distance (<->)
             query = text("""
                SELECT session_id, symptoms_text, medical_history, doctor_notes, 1 - (symptoms_embedding <=> :embedding) as similarity
                FROM healthcare 
                WHERE session_id != :current_session_id
                ORDER BY symptoms_embedding <=> :embedding
                LIMIT 3
             """)
             
             # Convert the vector to a format Postgres understands. pgvector returns a string or list.
             # We convert properly avoiding numpy's space-separated string representation.
             embedding_val = "[" + ",".join(str(float(x)) for x in record.symptoms_embedding) + "]"
             
             try:
                result = db.execute(query, {"embedding": embedding_val, "current_session_id": session_id})
                history_context = ""
                for idx, row in enumerate(result):
                    similar_cases.append({
                        "session_id": row[0], 
                        "symptoms": row[1], 
                        "medical_history": row[2],
                        "doctor_notes": row[3],
                        "similarity": row[4]
                    })
                    history_context += f"\n--- Case {idx+1} ---\nSymptoms: {row[1]}\nMedical History: {row[2]}\nDoctor Notes: {row[3]}\n"
                
                # Fetch RAG Context from ChromaDB
                rag_context = ""
                try:
                    import chromadb
                    from chromadb.utils import embedding_functions
                    import os
                    
                    CHROMA_HOST = os.environ.get("CHROMA_HOST", "chromadb")
                    CHROMA_PORT = int(os.environ.get("CHROMA_PORT", "8000"))
                    
                    chroma_client = chromadb.HttpClient(host=CHROMA_HOST, port=CHROMA_PORT)
                    emb_func = embedding_functions.DefaultEmbeddingFunction()
                    collection = chroma_client.get_collection(name="medical_context", embedding_function=emb_func)
                    
                    if record.symptoms_text:
                        rag_results = collection.query(
                            query_texts=[record.symptoms_text],
                            n_results=3
                        )
                        if rag_results['documents'] and rag_results['documents'][0]:
                            rag_context = "\n--- Clinical Guidelines (RAG) ---\n"
                            for i, doc in enumerate(rag_results['documents'][0]):
                                rag_context += f"{doc}\n\n"
                except Exception as chroma_err:
                    print(f"ChromaDB Vector search failed/skipped: {chroma_err}")

                # 3. LLM Analysis
                if similar_cases and os.environ.get("GROQ_API_KEY"):
                    from groq import Groq
                    try:
                        groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
                        prompt = (
                            f"You are a medical AI assistant. Analyze the history of these similar past patients "
                            f"who had related symptoms, along with retrieved clinical guidelines. Provide a concise analytical summary "
                            f"highlighting common diagnoses, effective treatments found in the notes, and what we might learn for the current patient.\n\n"
                            f"Current Patient Symptoms: {record.symptoms_text}\n"
                            f"Current Patient History: {record.medical_history}\n\n"
                            f"Similar Cases History:\n{history_context}\n"
                            f"{rag_context}"
                        )
                        chat_completion = groq_client.chat.completions.create(
                            messages=[
                                {"role": "system", "content": "You are a helpful medical data analyst. Output a clean, concise analysis."},
                                {"role": "user", "content": prompt}
                            ],
                            model="llama-3.3-70b-versatile",
                        )
                        analysis_text = chat_completion.choices[0].message.content
                    except Exception as llm_err:
                        print(f"LLM Analysis failed: {llm_err}")
                        analysis_text = f"Analysis unavailable: {str(llm_err)}"

             except Exception as e:
                print(f"Vector search warning: {e}")
                similar_cases = [{"error": f"Vector search failed: {str(e)}"}]

        
        resp = ContextResponse(
            patient_id=record.patient_id,
            session_id=record.session_id,
            symptoms_text=record.symptoms_text,
            medical_history=record.medical_history,
            doctor_notes=record.doctor_notes,
            similar_cases=similar_cases,
            analysis_summary=analysis_text
        )
        response_data.append(resp)

    return response_data
