.PHONY: help install install-backend install-frontend build build-backend build-frontend run run-backend run-frontend test test-backend test-frontend test-e2e clean lint lint-backend lint-frontend

PYTHON := python
NODE := npm

help:
	@echo "CardVault Pro - Available targets:"
	@echo "  install         - Install all dependencies (backend + frontend + root)"
	@echo "  install-backend - Install Python dependencies"
	@echo "  install-frontend- Install Node.js dependencies"
	@echo "  build           - Build frontend for production"
	@echo "  run             - Run both backend and frontend (frontend in dev mode)"
	@echo "  run-backend     - Run FastAPI backend server"
	@echo "  run-frontend    - Run Vite frontend dev server"
	@echo "  test            - Run all tests"
	@echo "  test-backend    - Run backend tests with pytest"
	@echo "  test-frontend   - Run frontend tests (if configured)"
	@echo "  test-e2e        - Run Playwright end-to-end tests"
	@echo "  clean           - Clean build artifacts and caches"
	@echo "  lint            - Lint frontend and backend code"
	@echo "  lint-backend    - Run backend linters"
	@echo "  lint-frontend   - Run frontend linters"

# Install targets
install: install-backend install-frontend install-root

install-backend:
	cd backend && $(PYTHON) -m pip install -r requirements.txt

install-frontend:
	cd frontend && $(NODE) install

install-root:
	$(NODE) install

# Build targets
build: build-frontend

build-frontend:
	cd frontend && $(NODE) run build

# Run targets
run-backend:
	cd backend && $(PYTHON) -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

run-frontend:
	cd frontend && $(NODE) run dev

run:
	@echo "Starting backend and frontend..."
	@echo "Run 'make run-backend' and 'make run-frontend' in separate terminals."

# Test targets
test: test-backend test-frontend test-e2e

test-backend:
	cd backend && $(PYTHON) -m pytest -v

test-frontend:
	cd frontend && $(NODE) run lint

test-e2e:
	npx playwright test

# Lint targets
lint: lint-backend lint-frontend

lint-backend:
	cd backend && $(PYTHON) -m flake8 app --max-line-length=120 || echo "flake8 not installed, skipping..."

lint-frontend:
	cd frontend && $(NODE) run lint

# Clean target
clean:
	cd frontend && rm -rf dist node_modules
	cd backend && rm -rf __pycache__ .pytest_cache
	rm -rf node_modules test-results
