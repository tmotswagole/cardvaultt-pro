from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ...db.session import get_db
from ...schemas import schemas
from ...models import models

router = APIRouter()

@router.get("/", response_model=List[schemas.Transfer])
def get_transfers(db: Session = Depends(get_db)):
    return db.query(models.Transfer).all()

@router.post("/", response_model=schemas.Transfer)
def create_transfer(transfer: schemas.TransferCreate, db: Session = Depends(get_db)):
    new_transfer = models.Transfer(
        **transfer.model_dump(),
        requested_by_id=1,
        status="PENDING_APPROVAL"
    )
    db.add(new_transfer)
    db.commit()
    db.refresh(new_transfer)
    return new_transfer
