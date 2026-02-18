from neuralmedic_shared.logging import MedicalAuditLogger
from neuralmedic_shared.redis_client import RedisManager

print("🚀 NeuralMedic SDK is officially LIVE!")
logger = MedicalAuditLogger("SuccessBot")
logger.log_audit("123", "TASK_COMPLETE", {"status": "all systems go"})
