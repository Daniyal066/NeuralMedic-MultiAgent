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
