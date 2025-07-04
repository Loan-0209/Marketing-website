#!/bin/bash

echo "🔧 Setting up HEART Backend..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Go to backend directory
cd backend

# Install dependencies
echo -e "${BLUE}📦 Installing backend dependencies...${NC}"
npm install

# Create admin user
echo -e "${BLUE}👤 Creating admin user...${NC}"
node scripts/createAdmin.js

echo -e "${GREEN}✅ Backend setup completed!${NC}"
echo ""
echo -e "${YELLOW}🚀 To start the backend server:${NC}"
echo "   cd backend && npm run dev"
echo ""
echo -e "${YELLOW}🔐 Admin credentials:${NC}"
echo "   Username: admin"
echo "   Password: heart2024"