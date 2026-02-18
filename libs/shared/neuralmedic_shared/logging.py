import json
from datetime import datetime

class MedicalAuditLogger:
    def __init__(self, agent_name):
        self.agent_name = agent_name

    def log(self, message, level="INFO"):
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "agent": self.agent_name,
            "level": level,
            "message": message
        }
        print(json.dumps(log_entry))
        return log_entry
