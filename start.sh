#!/bin/bash

# AI Employee Benefits Optimizer - Start Script
# This script sets up and starts the full application

set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

echo "=========================================="
echo "  AI Employee Benefits Optimizer"
echo "  Starting Application..."
echo "=========================================="

# Load environment variables
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

BACKEND_PORT=${BACKEND_PORT:-4001}
FRONTEND_PORT=${FRONTEND_PORT:-3000}

# ---- Clean used ports ----
echo ""
echo "[1/5] Cleaning used ports ($BACKEND_PORT, $FRONTEND_PORT)..."

cleanup_port() {
  local port=$1
  local pids=$(lsof -ti :$port 2>/dev/null || true)
  if [ -n "$pids" ]; then
    echo "  Killing processes on port $port: $pids"
    echo "$pids" | xargs kill -9 2>/dev/null || true
    sleep 1
  fi
}

cleanup_port $BACKEND_PORT
cleanup_port $FRONTEND_PORT

# ---- Check PostgreSQL ----
echo ""
echo "[2/5] Checking PostgreSQL..."

if ! command -v psql &> /dev/null; then
  echo "ERROR: PostgreSQL is not installed. Please install it first."
  exit 1
fi

# Check if PostgreSQL is running
if ! pg_isready -q 2>/dev/null; then
  echo "  Starting PostgreSQL..."
  brew services start postgresql@14 2>/dev/null || brew services start postgresql 2>/dev/null || {
    echo "  Trying to start with pg_ctl..."
    pg_ctl -D /opt/homebrew/var/postgresql@14 start 2>/dev/null || pg_ctl -D /opt/homebrew/var/postgres start 2>/dev/null || true
  }
  sleep 2
fi

# Create database if it doesn't exist
echo "  Ensuring database exists..."
createdb benefits_optimizer 2>/dev/null || echo "  Database already exists"

# ---- Install dependencies ----
echo ""
echo "[3/5] Installing dependencies..."

if [ ! -d "node_modules" ]; then
  echo "  Installing backend dependencies..."
  npm install --silent
fi

if [ ! -d "client/node_modules" ]; then
  echo "  Installing frontend dependencies..."
  cd client && npm install --silent && cd ..
fi

# ---- Seed database ----
echo ""
echo "[4/5] Seeding database..."
node server/seed.js

# ---- Start application ----
echo ""
echo "[5/5] Starting application..."
echo ""

# Function to handle cleanup on exit
cleanup() {
  echo ""
  echo "Shutting down..."
  cleanup_port $BACKEND_PORT
  cleanup_port $FRONTEND_PORT
  kill $(jobs -p) 2>/dev/null || true
  exit 0
}

trap cleanup SIGINT SIGTERM

# Start backend with nodemon for auto-reload
echo "  Starting backend on port $BACKEND_PORT (with auto-reload)..."
npx nodemon server/index.js --watch server &
BACKEND_PID=$!

# Wait for backend to be ready
echo "  Waiting for backend..."
for i in {1..30}; do
  if curl -s http://localhost:$BACKEND_PORT/api/health > /dev/null 2>&1; then
    echo "  Backend is ready!"
    break
  fi
  sleep 1
done

# Start frontend with hot reload
echo "  Starting frontend on port $FRONTEND_PORT (with hot reload)..."
cd client
BROWSER=none PORT=$FRONTEND_PORT REACT_APP_API_URL=http://localhost:$BACKEND_PORT/api npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "=========================================="
echo "  Application Started Successfully!"
echo "=========================================="
echo ""
echo "  Frontend: http://localhost:$FRONTEND_PORT"
echo "  Backend:  http://localhost:$BACKEND_PORT"
echo "  API Docs: http://localhost:$BACKEND_PORT/api/health"
echo ""
echo "  Login: admin@benefitsoptimizer.com"
echo "  Pass:  password123"
echo ""
echo "  Press Ctrl+C to stop all services"
echo "=========================================="
echo ""

# Wait for background processes
wait
