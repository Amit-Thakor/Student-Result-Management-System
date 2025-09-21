#!/bin/bash

# Student Result Management System - Setup Script
# This script helps set up the project quickly

echo "🎓 Student Result Management System - Setup Script"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

# Check if PHP is installed
if ! command -v php &> /dev/null; then
    print_error "PHP is not installed. Please install PHP 7.4+ first."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    print_warning "PostgreSQL client not found. Make sure PostgreSQL is installed and accessible."
fi

print_info "Starting setup process..."

# Install frontend dependencies
print_info "Installing frontend dependencies..."
if npm install; then
    print_status "Frontend dependencies installed successfully"
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi

# Create database (optional - user might want to do this manually)
read -p "Do you want to create the PostgreSQL database? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter database name (default: student_result_system): " db_name
    db_name=${db_name:-student_result_system}
    
    if createdb "$db_name" 2>/dev/null; then
        print_status "Database '$db_name' created successfully"
        
        # Import schema
        if psql -d "$db_name" -f database_schema.sql > /dev/null 2>&1; then
            print_status "Database schema imported successfully"
        else
            print_warning "Failed to import database schema. Please run manually:"
            echo "psql -d $db_name -f database_schema.sql"
        fi
    else
        print_warning "Database might already exist or creation failed"
    fi
fi

# Update database configuration
print_info "Updating database configuration..."
read -p "Enter database host (default: localhost): " db_host
db_host=${db_host:-localhost}

read -p "Enter database name (default: student_result_system): " db_name
db_name=${db_name:-student_result_system}

read -p "Enter database username (default: postgres): " db_user
db_user=${db_user:-postgres}

read -s -p "Enter database password: " db_pass
echo

# Update backend database config
if [ -f "backend/config/database.php" ]; then
    sed -i.bak "s/private \$host = \".*\";/private \$host = \"$db_host\";/" backend/config/database.php
    sed -i.bak "s/private \$db_name = \".*\";/private \$db_name = \"$db_name\";/" backend/config/database.php
    sed -i.bak "s/private \$username = \".*\";/private \$username = \"$db_user\";/" backend/config/database.php
    sed -i.bak "s/private \$password = \".*\";/private \$password = \"$db_pass\";/" backend/config/database.php
    print_status "Database configuration updated"
else
    print_warning "Backend database config not found"
fi

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=Student Result Management System
NEXT_PUBLIC_APP_VERSION=1.0.0
EOF
    print_status "Environment file created"
fi

# Build the project
print_info "Building the project..."
if npm run build; then
    print_status "Project built successfully"
else
    print_warning "Build failed, but you can still run in development mode"
fi

echo
echo "🎉 Setup completed!"
echo
print_info "To start the application:"
echo "1. Start the PHP backend:"
echo "   cd backend && php -S localhost:8000"
echo
echo "2. Start the Next.js frontend (in another terminal):"
echo "   npm run dev"
echo
echo "3. Open your browser and go to:"
echo "   http://localhost:3000"
echo
print_info "Default login credentials:"
echo "Admin: admin@school.edu / password"
echo "Student: john.smith@student.edu / password"
echo
print_info "For more information, check:"
echo "- README.md - Project overview and setup"
echo "- API_DOCUMENTATION.md - Complete API reference"
echo "- TECH_STACK_ALIGNMENT.md - Technical details"
echo
echo "Happy coding! 🚀"