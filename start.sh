#!/usr/bin/env fish

# Colors for output
set -l GREEN '\033[0;32m'
set -l RED '\033[0;31m'
set -l NC '\033[0m'

# Check if PostgreSQL is running
if not systemctl is-active --quiet postgresql
    echo -e "$RED"Error: PostgreSQL is not running"$NC"
    echo "Starting PostgreSQL..."
    sudo systemctl start postgresql
    if test $status -ne 0
        echo -e "$RED"Failed to start PostgreSQL"$NC"
        exit 1
    end
end

# Function to check and kill processes on ports
function check_and_kill_port
    set -l port $argv[1]
    if lsof -i :$port >/dev/null 2>&1
        echo -e "$RED"Port $port is in use. Attempting to free it..."$NC"
        fuser -k $port/tcp 2>/dev/null
        sleep 1
        if lsof -i :$port >/dev/null 2>&1
            echo -e "$RED"Failed to free port $port"$NC"
            exit 1
        end
    end
end

# Check and free ports if needed
check_and_kill_port 5000
check_and_kill_port 5174

# Start backend server
echo -e "$GREEN"Starting backend server..."$NC"
cd backend
source venv/bin/activate.fish
python app.py &
set -l BACKEND_PID $last_pid

# Start frontend server
echo -e "$GREEN"Starting frontend server..."$NC"
cd ../frontend
npm run dev &
set -l FRONTEND_PID $last_pid

# Function to handle script termination
function cleanup
    echo -e "\n$GREEN"Shutting down servers..."$NC"
    # Kill the processes
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    # Ensure ports are freed
    fuser -k 5000/tcp 2>/dev/null
    fuser -k 5174/tcp 2>/dev/null
    # Kill any remaining child processes
    pkill -P $fish_pid 2>/dev/null
    exit 0
end

# Set up trap for cleanup on script termination
trap cleanup SIGINT SIGTERM

echo -e "$GREEN"Servers are running!"$NC"
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:5174"
echo -e "$GREEN"Press Ctrl+C to stop the servers"$NC"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID 