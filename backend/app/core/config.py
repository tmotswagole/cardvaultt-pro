import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "CardVault Pro"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./cardvault.db")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "change-me-in-production-env")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Mocking
    FLEXCUBE_API_URL: str = os.getenv("FLEXCUBE_API_URL", "http://mock-flexcube/api")
    CMS_API_URL: str = os.getenv("CMS_API_URL", "http://mock-cms/api")

settings = Settings()
