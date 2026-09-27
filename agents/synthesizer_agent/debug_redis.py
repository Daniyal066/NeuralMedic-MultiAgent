import asyncio
import redis.asyncio as redis

async def main():
    try:
        r = redis.Redis(host='redis', port=6379, decode_responses=True)
        await r.ping()
        print('PING SUCCESS')
        await r.close()
    except Exception as e:
        print(f'Error connecting to Redis: {e}')

asyncio.run(main())
