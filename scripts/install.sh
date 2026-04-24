#!/usr/bin/env bash
# CardVault Pro - Unix/Linux/macOS Installation Script
# Usage: chmod +x install.sh && ./install.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "======================================"
echo "  CardVault Pro - Installer"
echo "======================================"

# Check prerequisites
echo ""
echo "Checking prerequisites..."

if ! command -v python3 &> /dev/null; then
    echo "Error: python3 is not installed or not in PATH. Please install Python 3.10+ and try again."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed or not in PATH. Please install Node.js 18+ and try again."
    exit 1
fi

echo "Found: $(python3 --version)"
echo "Found: Node $(node --version)"

# Install backend dependencies
echo ""
echo "[1/3] Installing backend dependencies..."
cd "$SCRIPT_DIR/backend"
python3 -m pip install -r requirements.txt

echo ""
echo "[2/3] Installing frontend dependencies..."
cd "$SCRIPT_DIR/frontend"
npm install

echo ""
echo "[3/3] Installing root/e2e dependencies..."
cd "$SCRIPT_DIR"
npm install

echo ""
echo "======================================"
echo "  Installation Complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo "  - Start backend:  make run-backend"
echo "  - Start frontend: make run-frontend"
echo "  - Run tests:      make test"
echo ""
echo "Or open two terminals and run:"
echo "  Terminal 1: cd backend && python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
echo "  Terminal 2: cd frontend && npm run dev"
