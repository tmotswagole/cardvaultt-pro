import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.main import app
from app.db.session import get_db


def mock_get_db():
    """Mock database dependency for testing - just validates DB is reachable."""
    return Session()


app.dependency_overrides[get_db] = mock_get_db
client = TestClient(app)


def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to CardVault Pro API"}


def test_health_check():
    response = client.get("/api/health/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 2
    assert all("name" in item and "status" in item for item in data)
    # Verify API and DB health items are present
    names = {item["name"] for item in data}
    assert "FastAPI Application" in names
    assert "PostgreSQL Database" in names
