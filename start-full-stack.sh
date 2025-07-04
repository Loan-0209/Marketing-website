#!/bin/bash

echo "🚀 Starting HEART Technology Website Full Stack..."
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${BLUE}📋 Checking prerequisites...${NC}"

if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}❌ npm is not installed. Please install npm first.${NC}"
    exit 1
fi

if ! command_exists mongod; then
    echo -e "${YELLOW}⚠️  MongoDB is not installed or not in PATH. Please ensure MongoDB is running.${NC}"
fi

echo -e "${GREEN}✅ Prerequisites check completed${NC}"
echo ""

# Start MongoDB (if not running)
echo -e "${BLUE}🗄️  Starting MongoDB...${NC}"
if pgrep -x "mongod" > /dev/null; then
    echo -e "${GREEN}✅ MongoDB is already running${NC}"
else
    echo -e "${YELLOW}⚡ Starting MongoDB...${NC}"
    # Try to start MongoDB in background
    if command_exists brew; then
        brew services start mongodb/brew/mongodb-community > /dev/null 2>&1
    else
        mongod --dbpath /usr/local/var/mongodb --logpath /usr/local/var/log/mongodb/mongo.log --fork > /dev/null 2>&1
    fi
    sleep 2
    echo -e "${GREEN}✅ MongoDB started${NC}"
fi
echo ""

# Backend setup
echo -e "${BLUE}🔧 Setting up Backend...${NC}"
cd backend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
    npm install
fi

# Create admin user
echo -e "${BLUE}👤 Creating admin user...${NC}"
node scripts/createAdmin.js

echo -e "${GREEN}✅ Backend setup completed${NC}"
echo ""

# Start backend in background
echo -e "${BLUE}🖥️  Starting Backend Server...${NC}"
npm run dev &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend started on http://localhost:5000 (PID: $BACKEND_PID)${NC}"
echo ""

# Return to root directory
cd ..

# Frontend setup
echo -e "${BLUE}🎨 Setting up Frontend...${NC}"

# Install frontend dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
    npm install
fi

echo -e "${GREEN}✅ Frontend setup completed${NC}"
echo ""

# Wait for backend to be ready
echo -e "${BLUE}⏳ Waiting for backend to be ready...${NC}"
sleep 3

# Start frontend
echo -e "${BLUE}🌐 Starting Frontend Server...${NC}"
npm start &
FRONTEND_PID=$!

echo ""
echo -e "${GREEN}🎉 HEART Technology Website is now running!${NC}"
echo "=================================================="
echo -e "${BLUE}📱 Frontend:${NC} http://localhost:3000"
echo -e "${BLUE}🔧 Backend API:${NC} http://localhost:5000"
echo -e "${BLUE}🛠️  Admin Panel:${NC} http://localhost:3000/admin-panel.html"
echo ""
echo -e "${YELLOW}🔐 Login Credentials:${NC}"
echo "   Username: admin"
echo "   Password: heart2024"
echo ""
echo -e "${BLUE}📋 Available Features:${NC}"
echo "   • 🏠 Main website with all sections"
echo "   • 📰 News management system"
echo "   • 🛠️  Admin panel with authentication"
echo "   • 📝 Create/Edit news articles"
echo "   • 💾 Database persistence"
echo ""
echo -e "${YELLOW}🛑 To stop the servers:${NC}"
echo "   Press Ctrl+C or run: kill $BACKEND_PID $FRONTEND_PID"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Shutting down servers...${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}✅ Servers stopped successfully${NC}"
    exit 0
}

# Trap Ctrl+C and cleanup
trap cleanup SIGINT SIGTERM

# Keep script running
echo -e "${BLUE}🔄 Servers are running. Press Ctrl+C to stop.${NC}"
wait