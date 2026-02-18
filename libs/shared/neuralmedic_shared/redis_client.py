import redis
import os

class RedisManager:
    def __init__(self):
        # Default to localhost if environment variables aren't set
        self.host = os.getenv("REDIS_HOST", "localhost")
        self.port = int(os.getenv("REDIS_PORT", 6379))
        self.client = redis.Redis(host=self.host, port=self.port, decode_responses=True)

    def get_client(self):
        return self.client
