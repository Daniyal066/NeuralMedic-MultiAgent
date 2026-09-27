import os
import time
import psycopg2
from sentence_transformers import SentenceTransformer
from pgvector.psycopg2 import register_vector

# Configuration
DB_HOST = os.getenv("DB_HOST", "postgres")
DB_NAME = os.getenv("DB_NAME", "neuralmedic")
DB_USER = os.getenv("DB_USER", "admin")
DB_PASS = os.getenv("DB_PASS", "password123")
DB_PORT = os.getenv("DB_PORT", "5432")
POLL_INTERVAL = 5  # Seconds

# Load Model (Downloads on first run)
print("Loading Sentence Transformer model...", flush=True)
model = SentenceTransformer('all-MiniLM-L6-v2')
print("Model loaded.", flush=True)

def connect_db():
    conn = psycopg2.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASS,
        port=DB_PORT
    )
    register_vector(conn)
    return conn

def main():
    print("Starting Embedding Generator...", flush=True)
    
    while True:
        conn = None
        try:
            conn = connect_db()
            cur = conn.cursor()

            # Find records with text but NO embedding
            # We check symptoms_text -> symptoms_embedding
            cur.execute("""
                SELECT id, symptoms_text 
                FROM healthcare 
                WHERE symptoms_text IS NOT NULL 
                AND symptoms_embedding IS NULL 
                LIMIT 10
            """)
            records = cur.fetchall()

            if records:
                print(f"Found {len(records)} records needing embeddings.", flush=True)
                
                for record in records:
                    record_id, text = record
                    
                    # Generate embedding
                    embedding = model.encode(text)
                    
                    # Update DB
                    cur.execute("""
                        UPDATE healthcare 
                        SET symptoms_embedding = %s 
                        WHERE id = %s
                    """, (embedding, record_id))
                    
                    print(f"Updated embedding for record {record_id}", flush=True)
                
                conn.commit()
            
        except Exception as e:
            print(f"Error in embedding generator: {e}", flush=True)
            if conn:
                conn.rollback()
        finally:
            if conn:
                conn.close()
        
        print(f"Polling check complete. Sleeping for {POLL_INTERVAL}s...", flush=True)
        time.sleep(POLL_INTERVAL)

if __name__ == "__main__":
    main()
