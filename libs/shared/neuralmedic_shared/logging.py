
import logging
import json
from datetime import datetime, timezone

class MedicalAuditLogger:
    def __init__(self, service_name: str):
        self.logger = logging.getLogger(service_name)
        self.logger.setLevel(logging.INFO)
        
    def log_audit(self, session_id: str, event_type: str, details: dict):
        entry = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "session_id": session_id,
            "event": event_type,
            "details": details
        }
        self.logger.info(json.dumps(entry))
