import os
import logging
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

class Settings(BaseSettings):
    PROJECT_NAME: str = "CardVault Pro"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-not-for-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "*")

    # Mocking
    FLEXCUBE_API_URL: str = os.getenv("FLEXCUBE_API_URL", "")
    CMS_API_URL: str = os.getenv("CMS_API_URL", "")

settings = Settings()

# Validation logging so Vercel logs show missing config clearly
if not settings.DATABASE_URL:
    logger.warning("DATABASE_URL is not set! Database operations will fail.")
if settings.SECRET_KEY == "dev-secret-not-for-production":
    logger.warning("SECRET_KEY is using the default insecure value. Set a strong SECRET_KEY in production.")
