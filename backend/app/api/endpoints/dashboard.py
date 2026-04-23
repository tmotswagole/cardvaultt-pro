from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ...db.session import get_db
from ...schemas import schemas
from ...models import models

router = APIRouter()

@router.get("/kpis", response_model=List[schemas.KPI])
def get_kpis(db: Session = Depends(get_db)):
    return [
        {"name": "Total Cards In Stock", "value": 12450, "delta": 120, "trend": [12000, 12100, 12150, 12200, 12300, 12400, 12450]},
        {"name": "Cards Issued Today", "value": 84, "delta": 5, "trend": [70, 75, 80, 65, 90, 85, 84]},
        {"name": "Near-Expiry Cards", "value": 156, "delta": -10, "trend": [200, 190, 180, 175, 170, 160, 156]},
        {"name": "Pending Approvals", "value": 12, "delta": 2, "trend": [5, 8, 10, 7, 9, 11, 12]},
    ]

@router.get("/exceptions", response_model=List[schemas.ExceptionEvent])
def get_exceptions(db: Session = Depends(get_db)):
    return db.query(models.ExceptionEvent).limit(10).all()
