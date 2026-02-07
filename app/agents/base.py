from abc import ABC, abstractmethod
from typing import Any, Dict

class BaseAgent(ABC):
    def __init__(self, name: str):
        self.name = name

    @abstractmethod
    def analyze(self, data: Any) -> Dict[str, Any]:
        """
        Analyze the input data and return findings.
        """
        pass
