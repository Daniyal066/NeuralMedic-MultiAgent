from enum import Enum
from typing import Dict, Any, Tuple

class UrgencyLevel(Enum):
    RED = "Red (Critical)"
    YELLOW = "Yellow (Urgent)"
    GREEN = "Green (Routine)"

def evaluate_urgency(findings: Dict[str, Any]) -> Tuple[UrgencyLevel, str]:
    """
    Evaluate the findings and determine the urgency level.
    """
    # Simple logic for demonstration
    # In a real system, this would analyze specific metrics or agent flags
    
    # Example logic: if any specialist reports high risk/critical condition
    is_critical = False # Placeholder check
    is_urgent = False   # Placeholder check
    
    # Traverse findings to check for keywords (very basic implementation)
    # Ideally, agents would return a risk score or urgency flag
    
    risk_score = 0.0
    for agent, result in findings.get("detailed_findings", {}).items():
        if "risk_score" in result and result["risk_score"] > 0.8:
            is_critical = True
        if "condition" in result and result["condition"] == "Critical":
             is_critical = True
        
    if is_critical:
        return UrgencyLevel.RED, "Life-threatening condition detected. Immediate attention required."
    elif is_urgent:
        return UrgencyLevel.YELLOW, "Urgent condition detected. Follow-up required."
    else:
        return UrgencyLevel.GREEN, "Routine check-up. No immediate concerns."

def triage_input(data: Dict[str, Any]) -> UrgencyLevel:
    """
    Quickly triage input data to determine priority queue.
    """
    # Simple keyword detection for demo purposes
    # In reality, this might use a lightweight NLP model
    symptoms = data.get("symptoms", [])
    if isinstance(symptoms, list):
        critical_keywords = ["chest pain", "shortness of breath", "stroke", "heart attack"]
        for symptom in symptoms:
            if any(keyword in str(symptom).lower() for keyword in critical_keywords):
                return UrgencyLevel.RED
    
    return UrgencyLevel.GREEN
