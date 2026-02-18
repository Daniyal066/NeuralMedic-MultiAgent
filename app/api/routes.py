from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
from celery.result import AsyncResult
from app.agents.tasks import run_consultation
from app.services.urgency import triage_input, UrgencyLevel

router = APIRouter()

class ConsultationRequest(BaseModel):
    patient_id: str
    data: Dict[str, Any]

class ConsultationResponse(BaseModel):
    task_id: str
    status: str
    urgency_assessed: str

@router.post("/consultation", response_model=ConsultationResponse)
async def start_consultation(request: ConsultationRequest):
    """
    Start a new medical consultation asynchronously.
    Triages the request to send to 'critical' or 'default' queue.
    """
    urgency = triage_input(request.data)
    
    queue_name = "default"
    if urgency == UrgencyLevel.RED:
        queue_name = "critical"
    
    # Override queue based on triage
    task = run_consultation.apply_async(
        args=[request.data],
        queue=queue_name
    )
    
    return {
        "task_id": task.id, 
        "status": "Consultation Initiated",
        "urgency_assessed": urgency.value
    }

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
