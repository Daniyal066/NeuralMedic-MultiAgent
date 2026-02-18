from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "worker",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_queues={
        "critical": {"exchange": "critical", "routing_key": "critical"},
        "default": {"exchange": "default", "routing_key": "default"},
    },
    task_routes={
        "app.agents.tasks.run_consultation": {"queue": "default"}, 
        # By default routed to default, but we will override in the API call
    },
    task_default_queue="default",
)
