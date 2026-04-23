from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ...db.session import get_db
from ...schemas import schemas
from ...models import models

router = APIRouter()

@router.get("/", response_model=List[schemas.AuditEntry])
def get_audit_log(db: Session = Depends(get_db)):
    return db.query(models.AuditEntry).order_by(models.AuditEntry.timestamp.desc()).all()
