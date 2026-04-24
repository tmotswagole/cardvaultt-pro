# CardVault Pro - Windows Installation Script
# Usage: powershell -ExecutionPolicy Bypass -File install.ps1

$ErrorActionPreference = "Stop"

function Test-Command {
    param([string]$Command)
    return [bool](Get-Command -Name $Command -ErrorAction SilentlyContinue)
}

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  CardVault Pro - Installer"
Write-Host "======================================" -ForegroundColor Cyan

# Check prerequisites
Write-Host "`nChecking prerequisites..." -ForegroundColor Yellow

if (-not (Test-Command "python")) {
    Write-Error "Python is not installed or not in PATH. Please install Python 3.10+ and try again."
    exit 1
}

if (-not (Test-Command "npm")) {
    Write-Error "npm is not installed or not in PATH. Please install Node.js 18+ and try again."
    exit 1
}

$pythonVersion = python --version 2>&1
Write-Host "Found: $pythonVersion" -ForegroundColor Green

$nodeVersion = node --version 2>&1
Write-Host "Found: Node $nodeVersion" -ForegroundColor Green

# Install backend dependencies
Write-Host "`n[1/3] Installing backend dependencies..." -ForegroundColor Cyan
Set-Location -Path "$PSScriptRoot\backend"
python -m pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to install backend dependencies."
    exit 1
}
Write-Host "Backend dependencies installed." -ForegroundColor Green

# Install frontend dependencies
Write-Host "`n[2/3] Installing frontend dependencies..." -ForegroundColor Cyan
Set-Location -Path "$PSScriptRoot\frontend"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to install frontend dependencies."
    exit 1
}
Write-Host "Frontend dependencies installed." -ForegroundColor Green

# Install root dependencies (Playwright)
Write-Host "`n[3/3] Installing root/e2e dependencies..." -ForegroundColor Cyan
Set-Location -Path "$PSScriptRoot"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to install root dependencies."
    exit 1
}
Write-Host "Root dependencies installed." -ForegroundColor Green

Write-Host "`n======================================" -ForegroundColor Cyan
Write-Host "  Installation Complete!"
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "  - Start backend:  make run-backend"
Write-Host "  - Start frontend: make run-frontend"
Write-Host "  - Run tests:      make test"
Write-Host "`nOr open two terminals and run:"
Write-Host "  Terminal 1: cd backend; python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
Write-Host "  Terminal 2: cd frontend; npm run dev"
