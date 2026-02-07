from fastapi import FastAPI
from app.core.config import settings
from app.core.celery_app import celery_app

app = FastAPI(title=settings.PROJECT_NAME)

@app.get("/")
def read_root():
    return {"message": "Welcome to NeuralMedic-MultiAgent System"}

# Placeholder for API routes
from app.api import routes
app.include_router(routes.router, prefix=settings.API_V1_STR)
