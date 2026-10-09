import os
import time
import psycopg2
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from pgvector.psycopg2 import register_vector
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="NeuralMedic Embedding Service", version="1.0.0")

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_NAME = os.getenv("DB_NAME", "neuralmedic_db")
DB_USER = os.getenv("DB_USER", "neuralmedic_user")
DB_PASSWORD = os.getenv("DB_PASSWORD", "neuralmedic_password")
DB_PORT = os.getenv("DB_PORT", "5432")

# Initialize embedding model
model = SentenceTransformer('all-MiniLM-L6-v2')

class EmbeddingRequest(BaseModel):
    text: str

@app.get("/health")
def health_check():
    return {"status": "healthy", "model": "all-MiniLM-L6-v2"}

@app.post("/embed")
def generate_embedding(req: EmbeddingRequest):
    try:
        vector = model.encode(req.text).tolist()
        return {"embedding": vector, "dimensions": len(vector)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
