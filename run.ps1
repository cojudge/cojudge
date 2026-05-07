# Cojudge Run Script for Windows
# This script starts the Cojudge application on Windows.

$PORT = if ($env:PORT) { $env:PORT } else { "5375" }

# Colors
$Yellow = "Yellow"
$Green = "Green"
$Red = "Red"

# Check for Node.js
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Node.js is not installed." -ForegroundColor $Red
    Write-Host "Please install Node.js (v18+) to run Cojudge."
    exit 1
}

# Check for npm
if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "Error: npm is not installed." -ForegroundColor $Red
    exit 1
}

if (!(Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor $Yellow
    npm install
}

if (!(Test-Path ".svelte-kit\output")) {
    Write-Host "Building application..." -ForegroundColor $Yellow
    npm run build
}

Write-Host "Starting application on http://localhost:$PORT ..." -ForegroundColor $Yellow
Write-Host "Note: Docker is required for code execution but not for browsing and editing." -ForegroundColor $Green

# Use npm run preview with host and port
npm run preview -- --port $PORT --host
