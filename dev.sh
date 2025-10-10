#!/bin/bash

# Development Startup Script for Licitação Project
# This script ensures proper environment setup and starts development servers

set -e

echo "🚀 Starting Licitação Project Development Environment"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check if .env exists
if [ ! -f .env ]; then
    print_warning ".env file not found"
    if [ -f .env.development ]; then
        print_info "Copying .env.development to .env"
        cp .env.development .env
        print_success ".env file created"

        # Generate app key
        print_info "Generating application key..."
        php artisan key:generate
        print_success "Application key generated"
    else
        print_error ".env file is required. Please create one from .env.example"
        exit 1
    fi
fi

# Check if public/database.db exists
if [ ! -f public/database.db ]; then
    print_warning "Database file not found at public/database.db"

    # Check if we can copy from database/database.sqlite
    if [ -f database/database.sqlite ]; then
        print_info "Copying from database/database.sqlite..."
        cp database/database.sqlite public/database.db
        print_success "Database copied successfully"
    else
        print_info "Creating new database..."
        touch public/database.db
        chmod 664 public/database.db

        print_info "Running migrations..."
        php artisan migrate --force

        read -p "Would you like to seed the database? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            php artisan db:seed
            print_success "Database seeded"
        fi
    fi
fi

# Ensure storage directories exist
print_info "Setting up storage directories..."
mkdir -p storage/framework/{sessions,views,cache/data}
mkdir -p storage/app/public
mkdir -p storage/logs
chmod -R 775 storage bootstrap/cache
print_success "Storage directories configured"

# Clear config cache
print_info "Clearing configuration cache..."
php artisan config:clear
print_success "Configuration cache cleared"

# Check if node_modules exists
if [ ! -d node_modules ]; then
    print_warning "node_modules not found"
    print_info "Installing npm dependencies..."
    npm install
    print_success "Dependencies installed"
fi

# Check if vendor exists
if [ ! -d vendor ]; then
    print_warning "vendor not found"
    print_info "Installing composer dependencies..."
    composer install
    print_success "Dependencies installed"
fi

# Generate Wayfinder types if needed
if [ ! -f resources/js/routes.ts ]; then
    print_info "Generating Wayfinder TypeScript types..."
    php artisan wayfinder:generate --with-form
    print_success "Wayfinder types generated"
fi

# Kill any existing processes on ports 8000 and 5173
print_info "Checking for existing processes..."
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    print_warning "Port 8000 is in use. Killing existing process..."
    kill -9 $(lsof -t -i:8000) 2>/dev/null || true
fi

if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1; then
    print_warning "Port 5173 is in use. Killing existing process..."
    kill -9 $(lsof -t -i:5173) 2>/dev/null || true
fi

echo ""
echo "=================================================="
print_success "Environment setup complete!"
echo "=================================================="
echo ""
print_info "Database: public/database.db"
print_info "Laravel: http://127.0.0.1:8000"
print_info "Vite: http://127.0.0.1:5173"
echo ""
echo "=================================================="
echo "🎯 Starting development servers..."
echo "=================================================="
echo ""
print_warning "Press Ctrl+C to stop all servers"
echo ""

# Start both servers using concurrently if available
if command -v concurrently &> /dev/null; then
    npx concurrently \
        -n "laravel,vite" \
        -c "blue,green" \
        "php artisan serve --host=127.0.0.1 --port=8000" \
        "npm run dev -- --host 127.0.0.1 --port 5173 --strictPort"
else
    # Fallback: Start in background and foreground
    print_info "Starting Laravel server on http://127.0.0.1:8000"
    php artisan serve --host=127.0.0.1 --port=8000 &
    LARAVEL_PID=$!

    sleep 2

    print_info "Starting Vite dev server on http://127.0.0.1:5173"
    npm run dev -- --host 127.0.0.1 --port 5173 --strictPort &
    VITE_PID=$!

    # Wait for both processes
    trap "kill $LARAVEL_PID $VITE_PID 2>/dev/null; exit" INT TERM
    wait
fi
