import time
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from sqlalchemy.orm import Session
from .db.session import engine, get_db, SessionLocal
from .models import models
from .api.endpoints import auth, inventory, issuance, transfers, audit, users, dashboard, health
from .db.seed import seed_db
from .core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start = time.time()
        method = request.method
        path = request.url.path
        query = request.url.query
        client = request.client.host if request.client else "unknown"
        logger.info(f"[{client}] Request started: {method} {path}?{query}")
        try:
            response = await call_next(request)
            duration = (time.time() - start) * 1000
            logger.info(f"[{client}] Request completed: {method} {path} -> {response.status_code} ({duration:.2f}ms)")
            return response
        except Exception as e:
            duration = (time.time() - start) * 1000
            logger.exception(f"[{client}] Request failed: {method} {path} ({duration:.2f}ms)")
            raise


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("=== CardVault API Lifespan startup ===")
    logger.info(f"DATABASE_URL configured: {bool(settings.DATABASE_URL)}")
    logger.info(f"CORS_ORIGINS: {settings.CORS_ORIGINS}")
    logger.info(f"Routers mounted: auth, dashboard, inventory, issuance, transfers, audit, users, health")
    if engine:
        try:
            models.Base.metadata.create_all(bind=engine)
            logger.info("Database tables created")
        except Exception:
            logger.exception("Failed to create database tables")
        db = SessionLocal()
        try:
            seed_db(db)
            logger.info("Database seeded")
        except Exception:
            logger.exception("Failed to seed database")
        finally:
            db.close()
    else:
        logger.warning("No database engine available; skipping table creation and seeding")
    logger.info("=== Lifespan startup complete ===")
    yield
    logger.info("=== Lifespan shutdown ===")


app = FastAPI(title="CardVault Pro API", lifespan=lifespan)
app.add_middleware(LoggingMiddleware)

cors_origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",") if origin.strip()]
logger.info(f"CORS origins configured: {cors_origins}")

if "*" in cors_origins:
    logger.warning("CORS_ORIGINS contains '*'. Using allow_credentials=False for browser compatibility with wildcard.")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=cors_origins,
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
