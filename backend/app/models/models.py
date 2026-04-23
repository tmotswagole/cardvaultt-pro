from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Float, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
import enum
import datetime

Base = declarative_base()

class Role(str, enum.Enum):
    TELLER = "TELLER"
    BR_MANAGER = "BR_MANAGER"
    CARD_OPS = "CARD_OPS"
    SYS_ADMIN = "SYS_ADMIN"
    AUDITOR = "AUDITOR"

class CardType(str, enum.Enum):
    VISA_DEBIT = "VISA_DEBIT"
    MASTERCARD_DEBIT = "MASTERCARD_DEBIT"
    PREPAID = "PREPAID"

class CardStatus(str, enum.Enum):
    IN_VAULT = "IN_VAULT"
    ALLOCATED = "ALLOCATED"
    ISSUED = "ISSUED"
    EXPIRED = "EXPIRED"
    DESTROYED = "DESTROYED"

class TransferStatus(str, enum.Enum):
    PENDING_APPROVAL = "PENDING_APPROVAL"
    APPROVED = "APPROVED"
    IN_TRANSIT = "IN_TRANSIT"
    DELIVERED = "DELIVERED"
    REJECTED = "REJECTED"
    CANCELLED = "CANCELLED"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String, unique=True, index=True)
    full_name = Column(String)
    hashed_password = Column(String)
    role = Column(String) # Role enum
    branch_id = Column(String, ForeignKey("branches.id"))
    status = Column(String, default="ACTIVE") # ACTIVE, SUSPENDED, PENDING
    last_login = Column(DateTime, nullable=True)

    branch = relationship("Branch", back_populates="users")

class Branch(Base):
    __tablename__ = "branches"
    id = Column(String, primary_key=True, index=True) # e.g. GBR-001
    name = Column(String)
    code = Column(String, unique=True)

    users = relationship("User", back_populates="branch")
    batches = relationship("CardBatch", back_populates="branch")

class CardBatch(Base):
    __tablename__ = "card_batches"
    id = Column(String, primary_key=True, index=True) # BATCH-ID
    card_type = Column(String) # CardType
    network = Column(String) # VISA, MASTERCARD
    branch_id = Column(String, ForeignKey("branches.id"))
    received_date = Column(DateTime, default=datetime.datetime.utcnow)
    expiry_date = Column(DateTime)
    quantity_total = Column(Integer)
    quantity_available = Column(Integer)
    quantity_issued = Column(Integer, default=0)
    status = Column(String, default="IN_VAULT") # CardStatus
    vendor_batch_ref = Column(String)

    branch = relationship("Branch", back_populates="batches")

class CardIssuance(Base):
    __tablename__ = "card_issuances"
    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String)
    account_number = Column(String)
    id_number = Column(String)
    card_batch_id = Column(String, ForeignKey("card_batches.id"))
    issued_by_id = Column(Integer, ForeignKey("users.id"))
    branch_id = Column(String, ForeignKey("branches.id"))
    issued_at = Column(DateTime, default=datetime.datetime.utcnow)
    serial_number = Column(String, unique=True)

class Transfer(Base):
    __tablename__ = "transfers"
    id = Column(Integer, primary_key=True, index=True)
    from_branch_id = Column(String, ForeignKey("branches.id"))
    to_branch_id = Column(String, ForeignKey("branches.id"))
    card_type = Column(String)
    quantity = Column(Integer)
    requested_by_id = Column(Integer, ForeignKey("users.id"))
    approved_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    status = Column(String, default="PENDING_APPROVAL") # TransferStatus
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)
    reason = Column(String, nullable=True)
    rejection_reason = Column(String, nullable=True)

class AuditEntry(Base):
    __tablename__ = "audit_log"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    event_type = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))
    branch_id = Column(String, ForeignKey("branches.id"))
    description = Column(String)
    severity = Column(String, default="INFO") # INFO, WARNING, CRITICAL
    ip_address = Column(String)
    details = Column(JSON, nullable=True) # Before/After state or additional info

class ExceptionEvent(Base):
    __tablename__ = "exceptions"
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String)
    severity = Column(String) # RED, AMBER
    description = Column(String)
    branch_id = Column(String, ForeignKey("branches.id"))
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    resolved = Column(Integer, default=0) # 0 or 1
