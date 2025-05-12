# Colors for output
$GREEN = "`e[32m"
$RED = "`e[31m"
$NC = "`e[0m"

# Check if PostgreSQL is running
$pgService = Get-Service postgresql* -ErrorAction SilentlyContinue
if (-not $pgService -or $pgService.Status -ne 'Running') {
    Write-Host "${RED}Error: PostgreSQL is not running${NC}"
    Write-Host "Starting PostgreSQL..."
    Start-Service postgresql*
    if (-not $?) {
        Write-Host "${RED}Failed to start PostgreSQL${NC}"
        exit 1
    }
}

# Function to check and kill processes on ports
function Test-AndKillPort {
    param($port)
    $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($process) {
        Write-Host "${RED}Port $port is in use. Attempting to free it...${NC}"
        Stop-Process -Id $process.OwningProcess -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 1
        if (Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue) {
            Write-Host "${RED}Failed to free port $port${NC}"
            exit 1
        }
    }
}

# Check and free ports if needed
Test-AndKillPort 5000
Test-AndKillPort 5174

# Start backend server
Write-Host "${GREEN}Starting backend server...${NC}"
Set-Location backend
.\venv\Scripts\Activate.ps1
$backendJob = Start-Process python -ArgumentList "app.py" -PassThru -NoNewWindow

# Start frontend server
Write-Host "${GREEN}Starting frontend server...${NC}"
Set-Location ..\frontend
$frontendJob = Start-Process npm -ArgumentList "run dev" -PassThru -NoNewWindow

# Function to handle script termination
function Cleanup {
    Write-Host "`n${GREEN}Shutting down servers...${NC}"
    # Kill the processes
    Stop-Process -Id $backendJob.Id -Force -ErrorAction SilentlyContinue
    Stop-Process -Id $frontendJob.Id -Force -ErrorAction SilentlyContinue
    # Ensure ports are freed
    Test-AndKillPort 5000
    Test-AndKillPort 5174
    exit 0
}

# Set up trap for cleanup on script termination
$null = Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action { Cleanup }

Write-Host "${GREEN}Servers are running!${NC}"
Write-Host "Backend: http://localhost:5000"
Write-Host "Frontend: http://localhost:5174"
Write-Host "${GREEN}Press Ctrl+C to stop the servers${NC}"

# Wait for both processes
Wait-Process -Id $backendJob.Id, $frontendJob.Id 