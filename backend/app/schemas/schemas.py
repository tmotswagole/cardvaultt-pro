from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime
from ..models.models import Role, CardType, CardStatus, TransferStatus

class UserBase(BaseModel):
    employee_id: str
    full_name: str
    role: str
    branch_id: str
    status: str = "ACTIVE"

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    last_login: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    employee_id: Optional[str] = None
    role: Optional[str] = None

class BranchBase(BaseModel):
    id: str
    name: str
    code: str

class Branch(BranchBase):
    model_config = ConfigDict(from_attributes=True)

class CardBatchBase(BaseModel):
    id: str
    card_type: str
    network: str
    branch_id: str
    expiry_date: datetime
    quantity_total: int
    quantity_available: int
    quantity_issued: int = 0
    status: str = "IN_VAULT"
    vendor_batch_ref: str

class CardBatch(CardBatchBase):
    received_date: datetime
    model_config = ConfigDict(from_attributes=True)

class CardIssuanceCreate(BaseModel):
    customer_name: str
    account_number: str
    id_number: str
    card_batch_id: str
    serial_number: str

class CardIssuance(CardIssuanceCreate):
    id: int
    issued_by_id: int
    branch_id: str
    issued_at: datetime
    model_config = ConfigDict(from_attributes=True)

class TransferBase(BaseModel):
    from_branch_id: str
    to_branch_id: str
    card_type: str
    quantity: int
    reason: Optional[str] = None

class TransferCreate(TransferBase):
    pass

class Transfer(TransferBase):
    id: int
    requested_by_id: int
    approved_by_id: Optional[int] = None
    status: str
    created_at: datetime
    updated_at: datetime
    rejection_reason: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class AuditEntryBase(BaseModel):
    event_type: str
    description: str
    severity: str = "INFO"
    details: Optional[dict] = None

class AuditEntry(AuditEntryBase):
    id: int
    timestamp: datetime
    user_id: int
    branch_id: str
    ip_address: str
    model_config = ConfigDict(from_attributes=True)

class KPI(BaseModel):
    name: str
    value: float
    delta: float
    trend: List[float]

class ExceptionEvent(BaseModel):
    id: int
    type: str
    severity: str
    description: str
    branch_id: str
    timestamp: datetime
    resolved: bool
    model_config = ConfigDict(from_attributes=True)

class SystemHealthItem(BaseModel):
    name: str
    status: str # healthy, degraded, down
    last_checked: datetime
    latency: float
    details_url: Optional[str] = None
