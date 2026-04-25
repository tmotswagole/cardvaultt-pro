import os
import sys
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")
logger = logging.getLogger(__name__)

logger.info("=== Vercel function cold start ===")
logger.info(f"__file__: {__file__}")
logger.info(f"cwd: {os.getcwd()}")
logger.info(f"sys.path: {sys.path}")

# Add backend directory to Python path
backend_path = os.path.join(os.path.dirname(__file__), '..', 'backend')
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)
    logger.info(f"Added backend path: {backend_path}")

# Import the FastAPI application
try:
    logger.info("Importing app.main...")
    from app.main import app as application
    logger.info("Successfully imported app.main")
except Exception:
    logger.exception("CRITICAL: Failed to import app.main")
    raise

# Vercel expects an 'app' variable for ASGI applications
app = application
logger.info("ASGI app registered for Vercel")
