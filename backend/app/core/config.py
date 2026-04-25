import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "CardVault Pro"
    DATABASE_URL: str = os.environ["DATABASE_URL"]
    SECRET_KEY: str = os.environ["SECRET_KEY"]
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "*")

    # Mocking
    FLEXCUBE_API_URL: str = os.getenv("FLEXCUBE_API_URL", "")
    CMS_API_URL: str = os.getenv("CMS_API_URL", "")

settings = Settings()
