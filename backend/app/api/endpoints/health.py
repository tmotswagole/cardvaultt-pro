from fastapi import APIRouter
from typing import List
from datetime import datetime
from ...schemas import schemas

router = APIRouter()

@router.get("/", response_model=List[schemas.SystemHealthItem])
def get_health():
    return [
        {"name": "FastAPI Application", "status": "healthy", "last_checked": datetime.utcnow(), "latency": 5.0},
        {"name": "PostgreSQL Database", "status": "healthy", "last_checked": datetime.utcnow(), "latency": 12.0},
        {"name": "Redis Cache", "status": "healthy", "last_checked": datetime.utcnow(), "latency": 2.0},
        {"name": "Celery Workers", "status": "healthy", "last_checked": datetime.utcnow(), "latency": 0.0},
        {"name": "Oracle Flexcube Integration", "status": "healthy", "last_checked": datetime.utcnow(), "latency": 45.0},
        {"name": "Card Management System (CMS)", "status": "degraded", "last_checked": datetime.utcnow(), "latency": 1200.0},
        {"name": "Notification Service", "status": "healthy", "last_checked": datetime.utcnow(), "latency": 25.0},
        {"name": "Backup Status", "status": "healthy", "last_checked": datetime.utcnow(), "latency": 0.0},
    ]
