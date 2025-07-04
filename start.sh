#!/bin/bash

# HEART Technology Website - Startup Script

echo "🚀 Starting HEART Technology Website..."
echo "======================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "📥 Download from: https://nodejs.org/"
    exit 1
fi

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "❌ MongoDB is not installed. Please install MongoDB first."
    echo "📥 Download from: https://www.mongodb.com/try/download/community"
    exit 1
fi

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use"
        return 1
    else
        return 0
    fi
}

# Check ports
echo "🔍 Checking required ports..."
if ! check_port 3000; then
    echo "❌ Frontend port (3000) is already in use"
    exit 1
fi

if ! check_port 5000; then
    echo "❌ Backend port (5000) is already in use"
    exit 1
fi

if ! check_port 27017; then
    echo "⚠️  MongoDB port (27017) is already in use - this might be okay if MongoDB is already running"
fi

# Start MongoDB if not running
echo "🗄️  Starting MongoDB..."
if ! pgrep mongod > /dev/null; then
    mongod --dbpath ./data/db --logpath ./data/mongodb.log --fork
    sleep 3
    
    if ! pgrep mongod > /dev/null; then
        echo "❌ Failed to start MongoDB"
        echo "💡 Try creating the data directory: mkdir -p ./data/db"
        exit 1
    fi
    echo "✅ MongoDB started successfully"
else
    echo "✅ MongoDB is already running"
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install backend dependencies"
        exit 1
    fi
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created from template"
    echo "💡 Please edit backend/.env with your configuration"
fi

# Seed database
echo "🌱 Seeding database..."
npm run seed
if [ $? -ne 0 ]; then
    echo "⚠️  Database seeding failed, but continuing..."
fi

# Start backend
echo "🔧 Starting backend server..."
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Check if backend is running
if ! curl -s http://localhost:5000/api/health > /dev/null; then
    echo "❌ Backend failed to start"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo "✅ Backend started successfully at http://localhost:5000"

# Go back to root directory
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install frontend dependencies"
        kill $BACKEND_PID 2>/dev/null
        exit 1
    fi
fi

# Start frontend
echo "🎨 Starting frontend server..."
npm start &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 3

# Check if frontend is running
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "❌ Frontend failed to start"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 1
fi

echo ""
echo "🎉 HEART Technology Website is now running!"
echo "======================================="
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5000"
echo "📊 API Health: http://localhost:5000/api/health"
echo ""
echo "🔐 Login Credentials:"
echo "   Username: admin"
echo "   Password: heart2024"
echo ""
echo "📝 Press Ctrl+C to stop all services"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo "✅ Services stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait