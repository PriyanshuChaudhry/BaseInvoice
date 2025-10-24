# Invoice Generator - Installation Script
# Run this script to install all dependencies

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Invoice Generator - Installation" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if MongoDB is installed
Write-Host "Checking MongoDB installation..." -ForegroundColor Yellow
$mongoVersion = mongod --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ MongoDB is installed" -ForegroundColor Green
} else {
    Write-Host "⚠ MongoDB may not be installed or not in PATH" -ForegroundColor Yellow
    Write-Host "Please ensure MongoDB is installed and running" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Installing Backend Dependencies..." -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

Set-Location -Path "$PSScriptRoot\backend"
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Backend dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "✗ Backend installation failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Installing Frontend Dependencies..." -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

Set-Location -Path "$PSScriptRoot\frontend"
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Frontend dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "✗ Frontend installation failed!" -ForegroundColor Red
    exit 1
}

Set-Location -Path $PSScriptRoot

Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "Installation Complete! 🎉" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Terminal 1 - Backend:" -ForegroundColor Cyan
Write-Host "  cd backend" -ForegroundColor White
Write-Host "  npm start" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 2 - Frontend:" -ForegroundColor Cyan
Write-Host "  cd frontend" -ForegroundColor White
Write-Host "  npm start" -ForegroundColor White
Write-Host ""
Write-Host "Or run: .\start.ps1" -ForegroundColor Yellow
Write-Host ""
