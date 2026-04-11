# ============================================
# TemplateMart Backend Startup Script
# ============================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TemplateMart Backend Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check MySQL
Write-Host "[1/5] Checking MySQL..." -ForegroundColor Yellow
$mysqlService = Get-Service -Name "MySQL*" -ErrorAction SilentlyContinue
if ($mysqlService) {
    if ($mysqlService.Status -eq "Running") {
        Write-Host "✓ MySQL is running" -ForegroundColor Green
    } else {
        Write-Host "✗ MySQL is not running. Starting..." -ForegroundColor Red
        Start-Service $mysqlService.Name
        Write-Host "✓ MySQL started" -ForegroundColor Green
    }
} else {
    Write-Host "✗ MySQL service not found. Please install MySQL." -ForegroundColor Red
    exit 1
}

# Step 2: Get MySQL Password
Write-Host ""
Write-Host "[2/5] Database Configuration" -ForegroundColor Yellow
$dbPassword = Read-Host "Enter MySQL root password" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword)
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# Step 3: Create Database
Write-Host ""
Write-Host "[3/5] Creating database..." -ForegroundColor Yellow
$createDbScript = @"
CREATE DATABASE IF NOT EXISTS templatemart CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
"@

try {
    $createDbScript | mysql -u root -p"$plainPassword" 2>&1 | Out-Null
    Write-Host "✓ Database 'templatemart' ready" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to create database. Check password." -ForegroundColor Red
    exit 1
}

# Step 4: Set Environment Variables
Write-Host ""
Write-Host "[4/5] Setting environment variables..." -ForegroundColor Yellow
$env:DB_PASSWORD = $plainPassword
$env:RAZORPAY_KEY_ID = "test_key_placeholder"
$env:RAZORPAY_KEY_SECRET = "test_secret_placeholder"
Write-Host "✓ Environment variables set" -ForegroundColor Green

# Step 5: Start Application
Write-Host ""
Write-Host "[5/5] Starting Spring Boot application..." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Application Starting..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location backend
mvn spring-boot:run

# Cleanup
[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR)
