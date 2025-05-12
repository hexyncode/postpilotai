# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "Please run this script as Administrator" -ForegroundColor Red
    exit 1
}

# Function to check if a command exists
function Test-CommandExists {
    param ($command)
    $oldPreference = $ErrorActionPreference
    $ErrorActionPreference = 'stop'
    try { if (Get-Command $command) { return $true } }
    catch { return $false }
    finally { $ErrorActionPreference = $oldPreference }
}

# Function to install PostgreSQL
function Install-PostgreSQL {
    Write-Host "Installing PostgreSQL..."
    if (Test-CommandExists winget) {
        winget install PostgreSQL.PostgreSQL
        # Add PostgreSQL to PATH
        $pgPath = "C:\Program Files\PostgreSQL\14\bin"
        $currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
        if (-not $currentPath.Contains($pgPath)) {
            [Environment]::SetEnvironmentVariable("Path", "$currentPath;$pgPath", "Machine")
            $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine")
        }
    } else {
        Write-Host "WinGet not found. Please install the App Installer from the Microsoft Store or visit: https://www.postgresql.org/download/windows/" -ForegroundColor Red
        exit 1
    }
}

# Function to install Python
function Install-Python {
    Write-Host "Installing Python..."
    if (Test-CommandExists winget) {
        winget install Python.Python.3.11
        # Refresh environment variables
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine")
    } else {
        Write-Host "WinGet not found. Please install the App Installer from the Microsoft Store or visit: https://www.python.org/downloads/" -ForegroundColor Red
        exit 1
    }
}

# Function to install Node.js
function Install-NodeJS {
    Write-Host "Installing Node.js..."
    if (Test-CommandExists winget) {
        winget install OpenJS.NodeJS.LTS
        # Refresh environment variables
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine")
    } else {
        Write-Host "WinGet not found. Please install the App Installer from the Microsoft Store or visit: https://nodejs.org/" -ForegroundColor Red
        exit 1
    }
}

# Check and install prerequisites
Write-Host "Checking prerequisites..."

# Check PostgreSQL
if (-not (Test-CommandExists psql)) {
    Write-Host "PostgreSQL not found. Installing..."
    Install-PostgreSQL
}

# Check Python
if (-not (Test-CommandExists python)) {
    Write-Host "Python not found. Installing..."
    Install-Python
}

# Check Node.js
if (-not (Test-CommandExists node)) {
    Write-Host "Node.js not found. Installing..."
    Install-NodeJS
}

# Create .env file
Write-Host "Setting up environment variables..."
$openai_key = Read-Host "Enter your OpenAI API key"
$fb_key = Read-Host "Enter your Facebook Graph API key"

@"
OPENAI_API_KEY=$openai_key
FACEBOOK_GRAPH_API_KEY=$fb_key
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postpilotai
"@ | Out-File -FilePath .env -Encoding UTF8

# Set up backend
Write-Host "Setting up backend..."
Set-Location backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Create database
Write-Host "Creating database..."
$env:PGPASSWORD = "postgres"
psql -U postgres -c "CREATE DATABASE postpilotai;" -ErrorAction SilentlyContinue

# Run migrations
Write-Host "Running database migrations..."
python migrations/add_decline_reason.py

# Set up frontend
Write-Host "Setting up frontend..."
Set-Location ..\frontend
npm install

Write-Host "Setup complete! You can now run the application using .\start.ps1" -ForegroundColor Green 