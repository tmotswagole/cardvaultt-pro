from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...db.session import get_db
from ...schemas import schemas
from ...models import models
from .auth import get_current_user

router = APIRouter()

@router.get("/customer-lookup/{id_number}")
def lookup_customer(id_number: str):
    # Mocking Flexcube response
    if id_number == "999":
        raise HTTPException(status_code=404, detail="Customer not found")
    return {
        "full_name": "Mothusi Lekgowe",
        "account_number": "1002003004",
        "id_number": id_number,
        "status": "ACTIVE",
        "account_type": "Savings",
        "branch": "Gaborone Main"
    }

@router.post("/issue", response_model=schemas.CardIssuance)
def issue_card(
    issuance: schemas.CardIssuanceCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    batch = db.query(models.CardBatch).filter(models.CardBatch.id == issuance.card_batch_id).first()
    if not batch or batch.quantity_available <= 0:
        raise HTTPException(status_code=400, detail="Card batch not available or empty")

    batch.quantity_available -= 1
    batch.quantity_issued += 1

    new_issuance = models.CardIssuance(
        **issuance.model_dump(),
        issued_by_id=current_user.id,
        branch_id=batch.branch_id
    )
    db.add(new_issuance)
    db.commit()
    db.refresh(new_issuance)
    return new_issuance
