import psycopg2
import os
import sys

# Load config from env or defaults
PG_HOST = os.getenv("POSTGRES_HOST", "localhost")
PG_PORT = os.getenv("POSTGRES_PORT", "5432")
PG_DB = os.getenv("POSTGRES_DB", "neuralmedic")
PG_USER = os.getenv("POSTGRES_USER", "admin")
PG_PASS = os.getenv("POSTGRES_PASSWORD", "password123")

EXPECTED_TABLES = [
    "patients", "doctors", "symptoms", "diseases",
    "sessions", "patient_symptoms", "job_status",
    "agents", "agent_tasks", "agent_execution_logs",
    "predictions", "feedback", "audit_logs", "notifications",
    "outbox"
]

def verify_schema():
    print("--- Verifying Production Schema ---")
    try:
        conn = psycopg2.connect(
            host=PG_HOST,
            port=PG_PORT,
            dbname=PG_DB,
            user=PG_USER,
            password=PG_PASS
        )
        cur = conn.cursor()
        
        # Get all tables
        cur.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        """)
        existing_tables = [row[0] for row in cur.fetchall()]
        
        missing_tables = []
        for table in EXPECTED_TABLES:
            if table in existing_tables:
                print(f"✅ Table found: {table}")
            else:
                print(f"❌ Table MISSING: {table}")
                missing_tables.append(table)
        
        cur.close()
        conn.close()
        
        if not missing_tables:
            print("\n🎉 Schema Verification PREFECT! All tables exist.")
            return True
        else:
            print(f"\n⚠️  Missing tables: {missing_tables}")
            return False

    except Exception as e:
        print(f"❌ Verification Failed: {e}")
        return False

if __name__ == "__main__":
    verify_schema()
