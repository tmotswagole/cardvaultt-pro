from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from ...db.session import get_db
from ...schemas import schemas
from ...models import models

router = APIRouter()

@router.get("/", response_model=List[schemas.CardBatch])
def get_inventory(
    branch_id: Optional[str] = None,
    card_type: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.CardBatch)
    if branch_id:
        query = query.filter(models.CardBatch.branch_id == branch_id)
    if card_type:
        query = query.filter(models.CardBatch.card_type == card_type)
    if status:
        query = query.filter(models.CardBatch.status == status)
    return query.all()

@router.get("/{batch_id}", response_model=schemas.CardBatch)
def get_batch(batch_id: str, db: Session = Depends(get_db)):
    return db.query(models.CardBatch).filter(models.CardBatch.id == batch_id).first()
