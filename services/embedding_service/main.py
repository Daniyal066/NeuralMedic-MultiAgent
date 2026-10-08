from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import os

from sentence_transformers import SentenceTransformer

app = FastAPI(title="Embedding Service")

# Load model (can be overridden via env var)
model_name = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
model = SentenceTransformer(model_name)

class EmbedRequest(BaseModel):
    text: str
    session_id: Optional[str] = None

class EmbedResponse(BaseModel):
    embedding: List[float]
    session_id: Optional[str] = None

@app.post("/embed", response_model=EmbedResponse)
def embed(request: EmbedRequest):
    if not request.text:
        raise HTTPException(status_code=400, detail="Text must be provided")
    embedding = model.encode(request.text).tolist()
    return {"embedding": embedding, "session_id": request.session_id}
