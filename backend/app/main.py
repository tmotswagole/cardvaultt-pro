from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .db.session import engine, get_db, SessionLocal
from .models import models
from .api.endpoints import auth, inventory, issuance, transfers, audit, users, dashboard, health
from .db.seed import seed_db
from .core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_db(db)
    finally:
        db.close()
    yield


app = FastAPI(title="CardVault Pro API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.CORS_ORIGINS.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
app.include_router(inventory.router, prefix="/api/inventory", tags=["inventory"])
app.include_router(issuance.router, prefix="/api/issuance", tags=["issuance"])
app.include_router(transfers.router, prefix="/api/transfers", tags=["transfers"])
app.include_router(audit.router, prefix="/api/audit", tags=["audit"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(health.router, prefix="/api/health", tags=["health"])

@app.get("/")
def read_root():
    return {"message": "Welcome to CardVault Pro API"}
