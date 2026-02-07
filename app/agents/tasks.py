from app.core.celery_app import celery_app
from app.agents.orchestrator import OrchestratorAgent
from app.services.urgency import evaluate_urgency
from typing import Dict, Any

@celery_app.task(bind=True)
def run_consultation(self, patient_data: Dict[str, Any]):
    # Initialize Orchestrator
    orchestrator = OrchestratorAgent()
    
    # Run analysis
    findings = orchestrator.analyze(patient_data)
    
    # Evaluate Urgency
    urgency_level, urgency_message = evaluate_urgency(findings)
    
    # Combine results
    final_report = {
        "findings": findings,
        "urgency": {
            "level": urgency_level.value,
            "message": urgency_message
        }
    }
    
    return final_report
