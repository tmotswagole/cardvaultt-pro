from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ...db.session import get_db
from ...schemas import schemas
from ...models import models

router = APIRouter()

@router.get("/", response_model=List[schemas.User])
def get_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()

@router.post("/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    hashed_password = pwd_context.hash(user.password)

    new_user = models.User(
        employee_id=user.employee_id,
        full_name=user.full_name,
        role=user.role,
        branch_id=user.branch_id,
        hashed_password=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
