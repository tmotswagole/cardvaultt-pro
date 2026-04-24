#!/usr/bin/env python3
"""Standalone database seeding script for one-off execution."""
import os
import sys

# Ensure backend is on the path
backend_dir = os.path.join(os.path.dirname(__file__), "..")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.db.session import engine, SessionLocal
from app.models import models
from app.db.seed import seed_db


def main():
    print("Creating tables...")
    models.Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        print("Seeding database...")
        seed_db(db)
        print("Database seeded successfully.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
