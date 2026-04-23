from sqlalchemy.orm import Session
from ..models import models
from passlib.context import CryptContext
from datetime import datetime, timedelta

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def seed_db(db: Session):
    # Check if data already exists
    if db.query(models.User).first():
        return

    # Create Branches
    branches = [
        models.Branch(id="GBR-001", name="Gaborone Main Branch", code="GMB001"),
        models.Branch(id="FTW-001", name="Francistown Branch", code="FTB001"),
        models.Branch(id="MAU-001", name="Maun Branch", code="MAB001"),
        models.Branch(id="KAS-001", name="Kasane Branch", code="KAB001"),
    ]
    for b in branches:
        db.add(b)

    # Create Users
    users = [
        models.User(
            employee_id="ADMIN001",
            full_name="System Administrator",
            role="SYS_ADMIN",
            branch_id="GBR-001",
            hashed_password=pwd_context.hash("admin123")
        ),
        models.User(
            employee_id="TELLER001",
            full_name="Gaborone Teller",
            role="TELLER",
            branch_id="GBR-001",
            hashed_password=pwd_context.hash("teller123")
        ),
        models.User(
            employee_id="MANAGER001",
            full_name="Gaborone Manager",
            role="BR_MANAGER",
            branch_id="GBR-001",
            hashed_password=pwd_context.hash("manager123")
        ),
        models.User(
            employee_id="OPS001",
            full_name="Card Ops Officer",
            role="CARD_OPS",
            branch_id="GBR-001",
            hashed_password=pwd_context.hash("ops123")
        ),
    ]
    for u in users:
        db.add(u)

    # Create Card Batches
    batches = [
        models.CardBatch(
            id="BATCH-VD-2026-0042",
            card_type="VISA_DEBIT",
            network="VISA",
            branch_id="GBR-001",
            expiry_date=datetime.utcnow() + timedelta(days=730),
            quantity_total=200,
            quantity_available=147,
            quantity_issued=53,
            status="IN_VAULT",
            vendor_batch_ref="VB-ACC-2026-0112"
        ),
        models.CardBatch(
            id="BATCH-MD-2026-0015",
            card_type="MASTERCARD_DEBIT",
            network="MASTERCARD",
            branch_id="GBR-001",
            expiry_date=datetime.utcnow() + timedelta(days=90),
            quantity_total=100,
            quantity_available=20,
            quantity_issued=80,
            status="IN_VAULT",
            vendor_batch_ref="VB-ACC-2026-0115"
        ),
        models.CardBatch(
            id="BATCH-PR-2026-0009",
            card_type="PREPAID",
            network="VISA",
            branch_id="FTW-001",
            expiry_date=datetime.utcnow() - timedelta(days=10),
            quantity_total=50,
            quantity_available=5,
            quantity_issued=45,
            status="EXPIRED",
            vendor_batch_ref="VB-ACC-2026-0109"
        ),
    ]
    for batch in batches:
        db.add(batch)

    # Audit Log
    db.add(models.AuditEntry(
        event_type="User Login",
        user_id=1,
        branch_id="GBR-001",
        description="System Administrator logged in",
        ip_address="127.0.0.1"
    ))

    # Exception
    db.add(models.ExceptionEvent(
        type="Low Stock Alert",
        severity="RED",
        description="Gaborone Main Branch is low on Visa Debit cards",
        branch_id="GBR-001"
    ))

    db.commit()
