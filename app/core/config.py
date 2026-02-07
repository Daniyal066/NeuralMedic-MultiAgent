import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "NeuralMedic-MultiAgent"
    API_V1_STR: str = "/api/v1"
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")

    class Config:
        env_file = ".env"

settings = Settings()
