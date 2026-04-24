from sqlalchemy.orm import Session
from ..models import models
from passlib.context import CryptContext
from datetime import datetime, timedelta

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def seed_db(db: Session):
    # Check if data already exists
    if db.query(models.User).first():
        return

    now = datetime.utcnow()

    # ── Branches ──
    branches = [
        models.Branch(id="GBR-001", name="Gaborone Main Branch", code="GMB001"),
        models.Branch(id="FTW-001", name="Francistown Branch", code="FTB001"),
        models.Branch(id="MAU-001", name="Maun Branch", code="MAB001"),
        models.Branch(id="KAS-001", name="Kasane Branch", code="KAB001"),
        models.Branch(id="SER-001", name="Serowe Branch", code="SRB001"),
        models.Branch(id="PAL-001", name="Palapye Branch", code="PLB001"),
    ]
    for b in branches:
        db.add(b)
    db.flush()

    # ── Users ──
    users_data = [
        ("ADMIN001", "System Administrator", "SYS_ADMIN", "GBR-001", "admin123", "ACTIVE", now - timedelta(hours=2)),
        ("AUDIT001", "Head Auditor", "AUDITOR", "GBR-001", "audit123", "ACTIVE", now - timedelta(days=1)),
        ("TELLER001", "Gaborone Teller", "TELLER", "GBR-001", "teller123", "ACTIVE", now - timedelta(hours=4)),
        ("TELLER002", "Francistown Teller", "TELLER", "FTW-001", "teller456", "ACTIVE", now - timedelta(hours=1)),
        ("TELLER003", "Maun Teller", "TELLER", "MAU-001", "teller789", "ACTIVE", None),
        ("MANAGER001", "Gaborone Manager", "BR_MANAGER", "GBR-001", "manager123", "ACTIVE", now - timedelta(days=2)),
        ("MANAGER002", "Francistown Manager", "BR_MANAGER", "FTW-001", "manager456", "ACTIVE", now - timedelta(hours=3)),
        ("MANAGER003", "Maun Manager", "BR_MANAGER", "MAU-001", "manager789", "ACTIVE", None),
        ("OPS001", "Card Ops Officer", "CARD_OPS", "GBR-001", "ops123", "ACTIVE", now - timedelta(hours=5)),
        ("OPS002", "Regional Card Ops", "CARD_OPS", "FTW-001", "ops456", "ACTIVE", now - timedelta(days=3)),
        ("SUSP001", "Former Teller", "TELLER", "GBR-001", "susp123", "SUSPENDED", now - timedelta(days=30)),
    ]
    for emp_id, name, role, branch, pwd, status, last_login in users_data:
        db.add(models.User(
            employee_id=emp_id,
            full_name=name,
            role=role,
            branch_id=branch,
            hashed_password=pwd_context.hash(pwd),
            status=status,
            last_login=last_login,
        ))
    db.flush()

    # Grab user IDs for later references
    user_map = {u.employee_id: u.id for u in db.query(models.User).all()}

    # ── Card Batches ──
    batches = [
        models.CardBatch(
            id="BATCH-VD-2026-0042", card_type="VISA_DEBIT", network="VISA",
            branch_id="GBR-001", received_date=now - timedelta(days=60),
            expiry_date=now + timedelta(days=730), quantity_total=500,
            quantity_available=312, quantity_issued=188, status="IN_VAULT",
            vendor_batch_ref="VB-ACC-2026-0112"
        ),
        models.CardBatch(
            id="BATCH-MD-2026-0015", card_type="MASTERCARD_DEBIT", network="MASTERCARD",
            branch_id="GBR-001", received_date=now - timedelta(days=45),
            expiry_date=now + timedelta(days=90), quantity_total=300,
            quantity_available=45, quantity_issued=255, status="IN_VAULT",
            vendor_batch_ref="VB-ACC-2026-0115"
        ),
        models.CardBatch(
            id="BATCH-PR-2026-0009", card_type="PREPAID", network="VISA",
            branch_id="FTW-001", received_date=now - timedelta(days=120),
            expiry_date=now - timedelta(days=10), quantity_total=200,
            quantity_available=5, quantity_issued=195, status="EXPIRED",
            vendor_batch_ref="VB-ACC-2026-0109"
        ),
        models.CardBatch(
            id="BATCH-VD-2026-0055", card_type="VISA_DEBIT", network="VISA",
            branch_id="FTW-001", received_date=now - timedelta(days=30),
            expiry_date=now + timedelta(days=365), quantity_total=150,
            quantity_available=120, quantity_issued=30, status="IN_VAULT",
            vendor_batch_ref="VB-ACC-2026-0134"
        ),
        models.CardBatch(
            id="BATCH-MD-2026-0022", card_type="MASTERCARD_DEBIT", network="MASTERCARD",
            branch_id="MAU-001", received_date=now - timedelta(days=20),
            expiry_date=now + timedelta(days=180), quantity_total=100,
            quantity_available=88, quantity_issued=12, status="IN_VAULT",
            vendor_batch_ref="VB-ACC-2026-0140"
        ),
        models.CardBatch(
            id="BATCH-PR-2026-0033", card_type="PREPAID", network="VISA",
            branch_id="KAS-001", received_date=now - timedelta(days=15),
            expiry_date=now + timedelta(days=60), quantity_total=80,
            quantity_available=72, quantity_issued=8, status="IN_VAULT",
            vendor_batch_ref="VB-ACC-2026-0148"
        ),
        models.CardBatch(
            id="BATCH-VD-2026-0066", card_type="VISA_DEBIT", network="VISA",
            branch_id="GBR-001", received_date=now - timedelta(days=5),
            expiry_date=now + timedelta(days=730), quantity_total=1000,
            quantity_available=1000, quantity_issued=0, status="IN_VAULT",
            vendor_batch_ref="VB-ACC-2026-0155"
        ),
    ]
    for batch in batches:
        db.add(batch)
    db.flush()

    # ── Card Issuances ──
    issuances = [
        models.CardIssuance(
            customer_name="Olebile Makolo", account_number="1001234567",
            id_number="OM123456", card_batch_id="BATCH-VD-2026-0042",
            issued_by_id=user_map["TELLER001"], branch_id="GBR-001",
            issued_at=now - timedelta(days=14), serial_number="SN-VD-000001"
        ),
        models.CardIssuance(
            customer_name="Keletso Mpho", account_number="1001234568",
            id_number="KM234567", card_batch_id="BATCH-VD-2026-0042",
            issued_by_id=user_map["TELLER001"], branch_id="GBR-001",
            issued_at=now - timedelta(days=12), serial_number="SN-VD-000002"
        ),
        models.CardIssuance(
            customer_name="Thabo Modise", account_number="1001234569",
            id_number="TM345678", card_batch_id="BATCH-MD-2026-0015",
            issued_by_id=user_map["TELLER001"], branch_id="GBR-001",
            issued_at=now - timedelta(days=10), serial_number="SN-MD-000045"
        ),
        models.CardIssuance(
            customer_name="Amantle Gaborekwe", account_number="1001234570",
            id_number="AG456789", card_batch_id="BATCH-PR-2026-0009",
            issued_by_id=user_map["TELLER002"], branch_id="FTW-001",
            issued_at=now - timedelta(days=90), serial_number="SN-PR-000012"
        ),
        models.CardIssuance(
            customer_name="Onalenna Kgosi", account_number="1001234571",
            id_number="OK567890", card_batch_id="BATCH-VD-2026-0055",
            issued_by_id=user_map["TELLER002"], branch_id="FTW-001",
            issued_at=now - timedelta(days=7), serial_number="SN-VD-000101"
        ),
        models.CardIssuance(
            customer_name="Neo Ramotlhwana", account_number="1001234572",
            id_number="NR678901", card_batch_id="BATCH-MD-2026-0022",
            issued_by_id=user_map["TELLER003"], branch_id="MAU-001",
            issued_at=now - timedelta(days=3), serial_number="SN-MD-000201"
        ),
        models.CardIssuance(
            customer_name="Masego Tlhapi", account_number="1001234573",
            id_number="MT789012", card_batch_id="BATCH-PR-2026-0033",
            issued_by_id=user_map["MANAGER003"], branch_id="KAS-001",
            issued_at=now - timedelta(days=1), serial_number="SN-PR-000301"
        ),
    ]
    for issuance in issuances:
        db.add(issuance)

    # ── Transfers ──
    transfers = [
        models.Transfer(
            from_branch_id="GBR-001", to_branch_id="FTW-001",
            card_type="VISA_DEBIT", quantity=50,
            requested_by_id=user_map["MANAGER002"],
            approved_by_id=user_map["OPS001"],
            status="DELIVERED", created_at=now - timedelta(days=20),
            updated_at=now - timedelta(days=18),
            reason="Routine restock for Francistown"
        ),
        models.Transfer(
            from_branch_id="GBR-001", to_branch_id="MAU-001",
            card_type="MASTERCARD_DEBIT", quantity=30,
            requested_by_id=user_map["MANAGER003"],
            approved_by_id=user_map["OPS001"],
            status="DELIVERED", created_at=now - timedelta(days=15),
            updated_at=now - timedelta(days=13),
            reason="Monthly allocation to Maun"
        ),
        models.Transfer(
            from_branch_id="GBR-001", to_branch_id="KAS-001",
            card_type="PREPAID", quantity=25,
            requested_by_id=user_map["MANAGER001"],
            approved_by_id=user_map["OPS002"],
            status="IN_TRANSIT", created_at=now - timedelta(days=2),
            updated_at=now - timedelta(days=2),
            reason="Emergency tourist season restock"
        ),
        models.Transfer(
            from_branch_id="FTW-001", to_branch_id="SER-001",
            card_type="VISA_DEBIT", quantity=40,
            requested_by_id=user_map["MANAGER002"],
            approved_by_id=None,
            status="PENDING_APPROVAL", created_at=now - timedelta(days=1),
            updated_at=now - timedelta(days=1),
            reason="New branch opening allocation"
        ),
        models.Transfer(
            from_branch_id="GBR-001", to_branch_id="PAL-001",
            card_type="VISA_DEBIT", quantity=20,
            requested_by_id=user_map["MANAGER001"],
            approved_by_id=user_map["OPS001"],
            status="REJECTED", created_at=now - timedelta(days=5),
            updated_at=now - timedelta(days=4),
            reason="Weekend rush stock request",
            rejection_reason="Insufficient stock after recent transfers"
        ),
        models.Transfer(
            from_branch_id="MAU-001", to_branch_id="KAS-001",
            card_type="MASTERCARD_DEBIT", quantity=10,
            requested_by_id=user_map["MANAGER003"],
            approved_by_id=user_map["OPS002"],
            status="CANCELLED", created_at=now - timedelta(days=3),
            updated_at=now - timedelta(days=3),
            reason="Incorrect quantity ordered"
        ),
    ]
    for transfer in transfers:
        db.add(transfer)

    # ── Audit Log ──
    audit_entries = [
        models.AuditEntry(
            event_type="USER_LOGIN", user_id=user_map["ADMIN001"],
            branch_id="GBR-001", description="System Administrator logged in",
            ip_address="127.0.0.1", severity="INFO", details={"method": "password"}
        ),
        models.AuditEntry(
            event_type="USER_LOGIN", user_id=user_map["TELLER001"],
            branch_id="GBR-001", description="Gaborone Teller logged in",
            ip_address="192.168.1.45", severity="INFO", details={"method": "password"}
        ),
        models.AuditEntry(
            event_type="CARD_ISSUED", user_id=user_map["TELLER001"],
            branch_id="GBR-001", description="Issued Visa Debit card to Olebile Makolo",
            ip_address="192.168.1.45", severity="INFO",
            details={"batch_id": "BATCH-VD-2026-0042", "serial": "SN-VD-000001"}
        ),
        models.AuditEntry(
            event_type="TRANSFER_APPROVED", user_id=user_map["OPS001"],
            branch_id="GBR-001", description="Approved transfer of 50 VISA_DEBIT to FTW-001",
            ip_address="192.168.1.10", severity="INFO",
            details={"transfer_id": 1, "quantity": 50}
        ),
        models.AuditEntry(
            event_type="TRANSFER_REJECTED", user_id=user_map["OPS001"],
            branch_id="GBR-001", description="Rejected transfer of 20 VISA_DEBIT to PAL-001",
            ip_address="192.168.1.10", severity="WARNING",
            details={"transfer_id": 5, "reason": "Insufficient stock"}
        ),
        models.AuditEntry(
            event_type="USER_SUSPENDED", user_id=user_map["ADMIN001"],
            branch_id="GBR-001", description="Suspended user SUSP001 - Former Teller",
            ip_address="127.0.0.1", severity="CRITICAL",
            details={"target_user": "SUSP001", "reason": "Policy violation"}
        ),
        models.AuditEntry(
            event_type="STOCK_CHECK", user_id=user_map["AUDIT001"],
            branch_id="GBR-001", description="Auditor performed monthly stock verification",
            ip_address="192.168.1.99", severity="INFO",
            details={"batches_verified": 3, "discrepancies": 0}
        ),
        models.AuditEntry(
            event_type="BATCH_RECEIVED", user_id=user_map["OPS001"],
            branch_id="GBR-001", description="Received new batch BATCH-VD-2026-0066",
            ip_address="192.168.1.10", severity="INFO",
            details={"batch_id": "BATCH-VD-2026-0066", "quantity": 1000, "vendor": "VB-ACC-2026-0155"}
        ),
    ]
    for entry in audit_entries:
        db.add(entry)

    # ── Exception Events ──
    exceptions = [
        models.ExceptionEvent(
            type="Low Stock Alert", severity="RED",
            description="Gaborone Main Branch is low on Mastercard Debit cards (15 remaining)",
            branch_id="GBR-001", resolved=0
        ),
        models.ExceptionEvent(
            type="Expired Batch", severity="AMBER",
            description="Francistown has expired prepaid batch BATCH-PR-2026-0009",
            branch_id="FTW-001", resolved=0
        ),
        models.ExceptionEvent(
            type="Transfer Delay", severity="AMBER",
            description="Transfer to Kasane has been in transit for 2 days",
            branch_id="KAS-001", resolved=0
        ),
        models.ExceptionEvent(
            type="Unusual Issuance", severity="AMBER",
            description="Maun Manager issued card directly instead of teller",
            branch_id="MAU-001", resolved=1
        ),
        models.ExceptionEvent(
            type="Stock Discrepancy", severity="RED",
            description="Physical count at Palapye does not match system records",
            branch_id="PAL-001", resolved=0
        ),
        models.ExceptionEvent(
            type="User Access Violation", severity="RED",
            description="Suspended user SUSP001 attempted login",
            branch_id="GBR-001", resolved=1
        ),
    ]
    for exc in exceptions:
        db.add(exc)

    db.commit()
