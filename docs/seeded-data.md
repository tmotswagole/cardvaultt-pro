# CardVault Pro - Seeded Data Documentation

This document contains all the initial data seeded into the CardVault Pro database.

---

## Branches (6)

| ID | Name | Code |
|---|---|---|
| GBR-001 | Gaborone Main Branch | GMB001 |
| FTW-001 | Francistown Branch | FTB001 |
| MAU-001 | Maun Branch | MAB001 |
| KAS-001 | Kasane Branch | KAB001 |
| SER-001 | Serowe Branch | SRB001 |
| PAL-001 | Palapye Branch | PLB001 |

---

## Users (11)

| Employee ID | Full Name | Role | Branch ID | Status | Password |
|---|---|---|---|---|---|
| ADMIN001 | System Administrator | SYS_ADMIN | GBR-001 | ACTIVE | admin123 |
| AUDIT001 | Head Auditor | AUDITOR | GBR-001 | ACTIVE | audit123 |
| TELLER001 | Gaborone Teller | TELLER | GBR-001 | ACTIVE | teller123 |
| TELLER002 | Francistown Teller | TELLER | FTW-001 | ACTIVE | teller456 |
| TELLER003 | Maun Teller | TELLER | MAU-001 | ACTIVE | teller789 |
| MANAGER001 | Gaborone Manager | BR_MANAGER | GBR-001 | ACTIVE | manager123 |
| MANAGER002 | Francistown Manager | BR_MANAGER | FTW-001 | ACTIVE | manager456 |
| MANAGER003 | Maun Manager | BR_MANAGER | MAU-001 | ACTIVE | manager789 |
| OPS001 | Card Ops Officer | CARD_OPS | GBR-001 | ACTIVE | ops123 |
| OPS002 | Regional Card Ops | CARD_OPS | FTW-001 | ACTIVE | ops456 |
| SUSP001 | Former Teller | TELLER | GBR-001 | SUSPENDED | susp123 |

**Note:** Passwords are stored as bcrypt hashes in the database.

---

## Card Batches (7)

| Batch ID | Card Type | Network | Branch ID | Total | Available | Issued | Status | Vendor Batch Ref |
|---|---|---|---|---|---|---|---|---|---|
| BATCH-VD-2026-0042 | VISA_DEBIT | VISA | GBR-001 | 500 | 312 | 188 | IN_VAULT | VB-ACC-2026-0112 |
| BATCH-MD-2026-0015 | MASTERCARD_DEBIT | MASTERCARD | GBR-001 | 300 | 45 | 255 | IN_VAULT | VB-ACC-2026-0115 |
| BATCH-PR-2026-0009 | PREPAID | VISA | FTW-001 | 200 | 5 | 195 | EXPIRED | VB-ACC-2026-0109 |
| BATCH-VD-2026-0055 | VISA_DEBIT | VISA | FTW-001 | 150 | 120 | 30 | IN_VAULT | VB-ACC-2026-0134 |
| BATCH-MD-2026-0022 | MASTERCARD_DEBIT | MASTERCARD | MAU-001 | 100 | 88 | 12 | IN_VAULT | VB-ACC-2026-0140 |
| BATCH-PR-2026-0033 | PREPAID | VISA | KAS-001 | 80 | 72 | 8 | IN_VAULT | VB-ACC-2026-0148 |
| BATCH-VD-2026-0066 | VISA_DEBIT | VISA | GBR-001 | 1000 | 1000 | 0 | IN_VAULT | VB-ACC-2026-0155 |

---

## Card Issuances (7)

| Customer Name | Account Number | ID Number | Batch ID | Issued By | Branch ID | Serial Number |
|---|---|---|---|---|---|---|
| Olebile Makolo | 1001234567 | OM123456 | BATCH-VD-2026-0042 | TELLER001 | GBR-001 | SN-VD-000001 |
| Keletso Mpho | 1001234568 | KM234567 | BATCH-VD-2026-0042 | TELLER001 | GBR-001 | SN-VD-000002 |
| Thabo Modise | 1001234569 | TM345678 | BATCH-MD-2026-0015 | TELLER001 | GBR-001 | SN-MD-000045 |
| Amantle Gaborekwe | 1001234570 | AG456789 | BATCH-PR-2026-0009 | TELLER002 | FTW-001 | SN-PR-000012 |
| Onalenna Kgosi | 1001234571 | OK567890 | BATCH-VD-2026-0055 | TELLER002 | FTW-001 | SN-VD-000101 |
| Neo Ramotlhwana | 1001234572 | NR678901 | BATCH-MD-2026-0022 | TELLER003 | MAU-001 | SN-MD-000201 |
| Masego Tlhapi | 1001234573 | MT789012 | BATCH-PR-2026-0033 | MANAGER003 | KAS-001 | SN-PR-000301 |

---

## Transfers (6)

| From | To | Card Type | Qty | Requested By | Approved By | Status | Reason |
|---|---|---|---|---|---|---|---|
| GBR-001 | FTW-001 | VISA_DEBIT | 50 | MANAGER002 | OPS001 | DELIVERED | Routine restock for Francistown |
| GBR-001 | MAU-001 | MASTERCARD_DEBIT | 30 | MANAGER003 | OPS001 | DELIVERED | Monthly allocation to Maun |
| GBR-001 | KAS-001 | PREPAID | 25 | MANAGER001 | OPS002 | IN_TRANSIT | Emergency tourist season restock |
| FTW-001 | SER-001 | VISA_DEBIT | 40 | MANAGER002 | - | PENDING_APPROVAL | New branch opening allocation |
| GBR-001 | PAL-001 | VISA_DEBIT | 20 | MANAGER001 | OPS001 | REJECTED | Weekend rush stock request (Insufficient stock) |
| MAU-001 | KAS-001 | MASTERCARD_DEBIT | 10 | MANAGER003 | OPS002 | CANCELLED | Incorrect quantity ordered |

---

## Audit Log (8)

| Event Type | User | Branch ID | Description | IP Address | Severity |
|---|---|---|---|---|---|
| USER_LOGIN | ADMIN001 | GBR-001 | System Administrator logged in | 127.0.0.1 | INFO |
| USER_LOGIN | TELLER001 | GBR-001 | Gaborone Teller logged in | 192.168.1.45 | INFO |
| CARD_ISSUED | TELLER001 | GBR-001 | Issued Visa Debit card to Olebile Makolo | 192.168.1.45 | INFO |
| TRANSFER_APPROVED | OPS001 | GBR-001 | Approved transfer of 50 VISA_DEBIT to FTW-001 | 192.168.1.10 | INFO |
| TRANSFER_REJECTED | OPS001 | GBR-001 | Rejected transfer of 20 VISA_DEBIT to PAL-001 | 192.168.1.10 | WARNING |
| USER_SUSPENDED | ADMIN001 | GBR-001 | Suspended user SUSP001 - Former Teller | 127.0.0.1 | CRITICAL |
| STOCK_CHECK | AUDIT001 | GBR-001 | Auditor performed monthly stock verification | 192.168.1.99 | INFO |
| BATCH_RECEIVED | OPS001 | GBR-001 | Received new batch BATCH-VD-2026-0066 | 192.168.1.10 | INFO |

---

## Exception Events (6)

| Type | Severity | Description | Branch ID | Resolved |
|---|---|---|---|---|
| Low Stock Alert | RED | Gaborone Main Branch is low on Mastercard Debit cards (15 remaining) | GBR-001 | No |
| Expired Batch | AMBER | Francistown has expired prepaid batch BATCH-PR-2026-0009 | FTW-001 | No |
| Transfer Delay | AMBER | Transfer to Kasane has been in transit for 2 days | KAS-001 | No |
| Unusual Issuance | AMBER | Maun Manager issued card directly instead of teller | MAU-001 | Yes |
| Stock Discrepancy | RED | Physical count at Palapye does not match system records | PAL-001 | No |
| User Access Violation | RED | Suspended user SUSP001 attempted login | GBR-001 | Yes |

---

*Generated from seed script: `backend/app/db/seed.py`*
