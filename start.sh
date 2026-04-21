#!/bin/bash
# Start script for Phase 0 setup
echo "Starting PostgreSQL..."
docker-compose up -d

echo "Installing backend dependencies..."
cd backend
npm install

echo "Installing frontend dependencies..."
cd ../frontend
npm install

echo "Running migrations / seeds if necessary..."
# Ensure backend db schema starts synced; for now, we'll configure it via app.module
# but it's good to keep placeholder tasks 

echo "Starting Backend and Frontend..."
cd ../backend
npm run start:dev &
BACKEND_PID=$!

cd ../frontend
npm run dev

wait $BACKEND_PID