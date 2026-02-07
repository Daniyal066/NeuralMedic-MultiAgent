from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
from celery.result import AsyncResult
from app.agents.tasks import run_consultation

router = APIRouter()

class ConsultationRequest(BaseModel):
    patient_id: str
    data: Dict[str, Any]

class ConsultationResponse(BaseModel):
    task_id: str
    status: str

@router.post("/consultation", response_model=ConsultationResponse)
async def start_consultation(request: ConsultationRequest):
    """
    Start a new medical consultation asynchronously.
    """
    task = run_consultation.delay(request.data)
    return {"task_id": task.id, "status": "Consultation Initiated"}

@router.get("/consultation/{task_id}")
async def get_consultation_status(task_id: str):
    """
    Get the status and result of a consultation.
    """
    task_result = AsyncResult(task_id)
    
    if task_result.state == 'PENDING':
        return {"status": "Processing", "result": None}
    elif task_result.state == 'FAILURE':
        return {"status": "Failed", "error": str(task_result.result)}
    elif task_result.state == 'SUCCESS':
        return {"status": "Completed", "result": task_result.result}
    else:
        return {"status": task_result.state, "result": None}
