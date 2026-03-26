import pytest
from neuralmedic_shared.logging import MedicalAuditLogger

def test_logger_initialization():
    """Verify agent name is set correctly."""
    logger = MedicalAuditLogger("PathologyAgent")
    assert logger.agent_name == "PathologyAgent"

def test_log_structure():
    """Verify log output structure."""
    logger = MedicalAuditLogger("TestAgent")
    res = logger.log("Testing")
    assert res["agent"] == "TestAgent"
    assert "timestamp" in res 