#!/bin/bash

# Function to detect OS
detect_os() {
    case "$(uname -s)" in
        Linux*)     echo "linux";;
        Darwin*)    echo "macos";;
        *)          echo "unknown";;
    esac
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install PostgreSQL
install_postgres() {
    local os=$(detect_os)
    echo "Installing PostgreSQL..."
    
    case $os in
        "linux")
            if command_exists apt-get; then
                sudo apt-get update
                sudo apt-get install -y postgresql postgresql-contrib
            elif command_exists dnf; then
                sudo dnf install -y postgresql postgresql-server
                sudo postgresql-setup --initdb
                sudo systemctl enable postgresql
                sudo systemctl start postgresql
            elif command_exists yum; then
                sudo yum install -y postgresql postgresql-server
                sudo postgresql-setup --initdb
                sudo systemctl enable postgresql
                sudo systemctl start postgresql
            else
                echo "Unsupported Linux distribution"
                exit 1
            fi
            ;;
        "macos")
            if command_exists brew; then
                brew install postgresql
                brew services start postgresql
            else
                echo "Please install Homebrew first: https://brew.sh"
                exit 1
            fi
            ;;
        *)
            echo "Unsupported operating system"
            exit 1
            ;;
    esac
}

# Function to install Python
install_python() {
    local os=$(detect_os)
    echo "Installing Python..."
    
    case $os in
        "linux")
            if command_exists apt-get; then
                sudo apt-get update
                sudo apt-get install -y python3 python3-pip python3-venv
            elif command_exists dnf; then
                sudo dnf install -y python3 python3-pip
            elif command_exists yum; then
                sudo yum install -y python3 python3-pip
            else
                echo "Unsupported Linux distribution"
                exit 1
            fi
            ;;
        "macos")
            if command_exists brew; then
                brew install python
            else
                echo "Please install Homebrew first: https://brew.sh"
                exit 1
            fi
            ;;
        *)
            echo "Unsupported operating system"
            exit 1
            ;;
    esac
}

# Function to install Node.js
install_node() {
    local os=$(detect_os)
    echo "Installing Node.js..."
    
    case $os in
        "linux")
            if command_exists apt-get; then
                curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
                sudo apt-get install -y nodejs
            elif command_exists dnf; then
                curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
                sudo dnf install -y nodejs
            elif command_exists yum; then
                curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
                sudo yum install -y nodejs
            else
                echo "Unsupported Linux distribution"
                exit 1
            fi
            ;;
        "macos")
            if command_exists brew; then
                brew install node
            else
                echo "Please install Homebrew first: https://brew.sh"
                exit 1
            fi
            ;;
        *)
            echo "Unsupported operating system"
            exit 1
            ;;
    esac
}

# Check and install prerequisites
echo "Checking prerequisites..."

# Check PostgreSQL
if ! command_exists psql; then
    echo "PostgreSQL not found. Installing..."
    install_postgres
fi

# Check Python
if ! command_exists python3; then
    echo "Python not found. Installing..."
    install_python
fi

# Check Node.js
if ! command_exists node; then
    echo "Node.js not found. Installing..."
    install_node
fi

# Create .env file
echo "Setting up environment variables..."
read -p "Enter your OpenAI API key: " openai_key
read -p "Enter your Facebook Graph API key: " fb_key

cat > .env << EOL
OPENAI_API_KEY=$openai_key
FACEBOOK_GRAPH_API_KEY=$fb_key
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postpilotai
EOL

# Set up backend
echo "Setting up backend..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create database
echo "Creating database..."
psql -U postgres -c "CREATE DATABASE postpilotai;" || true

# Run migrations
echo "Running database migrations..."
python migrations/add_decline_reason.py

# Set up frontend
echo "Setting up frontend..."
cd ../frontend
npm install

echo "Setup complete! You can now run the application using ./start.sh" 