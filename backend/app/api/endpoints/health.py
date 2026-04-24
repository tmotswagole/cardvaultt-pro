from fastapi import APIRouter, Depends
from typing import List
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import text
from ...schemas import schemas
from ...db.session import get_db
import time

router = APIRouter()


def check_database_health(db: Session) -> tuple[str, float]:
    """Check database connectivity and return status with latency in ms."""
    start_time = time.time()
    try:
        db.execute(text("SELECT 1"))
        db.commit()
        latency = (time.time() - start_time) * 1000
        return "healthy", latency
    except Exception:
        latency = (time.time() - start_time) * 1000
        return "down", latency


@router.get("/", response_model=List[schemas.SystemHealthItem])
def get_health(db: Session = Depends(get_db)):
    now = datetime.utcnow()
    db_status, db_latency = check_database_health(db)

    return [
        {"name": "FastAPI Application", "status": "healthy", "last_checked": now, "latency": 0.0},
        {"name": "PostgreSQL Database", "status": db_status, "last_checked": now, "latency": round(db_latency, 2)},
    ]

# return [
#         {"name": "FastAPI Application", "status": "healthy", "last_checked": datetime.utcnow(), "latency": 5.0},
#         {"name": "PostgreSQL Database", "status": "healthy", "last_checked": datetime.utcnow(), "latency": 12.0},
#         {"name": "Redis Cache", "status": "healthy", "last_checked": datetime.utcnow(), "latency": 2.0},
#         {"name": "Celery Workers", "status": "healthy", "last_checked": datetime.utcnow(), "latency": 0.0},
#         {"name": "Oracle Flexcube Integration", "status": "healthy", "last_checked": datetime.utcnow(), "latency": 45.0},
#         {"name": "Card Management System (CMS)", "status": "degraded", "last_checked": datetime.utcnow(), "latency": 1200.0},
#         {"name": "Notification Service", "status": "healthy", "last_checked": datetime.utcnow(), "latency": 25.0},
#         {"name": "Backup Status", "status": "healthy", "last_checked": datetime.utcnow(), "latency": 0.0},
#     ]