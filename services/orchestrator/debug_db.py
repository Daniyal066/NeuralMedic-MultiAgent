import os
import asyncpg
import asyncio
import psycopg2

DB_USER = os.getenv("DB_USER", "admin")
DB_PASSWORD = os.getenv("DB_PASS", "password")
DB_HOST = os.getenv("DB_HOST", "postgres")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "neuralmedic")

DSN = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

async def test_asyncpg():
    print(f"Testing asyncpg with DSN: {DSN}")
    try:
        conn = await asyncpg.connect(DSN, timeout=5)
        print("asyncpg: Connection SUCCESS!")
        await conn.close()
    except Exception as e:
        print(f"asyncpg: Connection FAILED: {e}")

async def test_asyncpg_pool():
    print(f"Testing asyncpg pool with DSN: {DSN}")
    try:
        pool = await asyncpg.create_pool(DSN)
        print("asyncpg pool created SUCCESS!")
        async with pool.acquire() as conn:
            print("asyncpg connection acquired from pool SUCCESS!")
        await pool.close()
    except Exception as e:
        print(f"asyncpg pool FAILED: {e}")

def test_psycopg2():
    print(f"Testing psycopg2 with DSN: {DSN}")
    try:
        conn = psycopg2.connect(DSN, connect_timeout=5)
        print("psycopg2: Connection SUCCESS!")
        conn.close()
    except Exception as e:
        print(f"psycopg2: Connection FAILED: {e}")

if __name__ == "__main__":
    test_psycopg2()
    asyncio.run(test_asyncpg())
    asyncio.run(test_asyncpg_pool())
