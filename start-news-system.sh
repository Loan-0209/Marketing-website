#!/bin/bash

echo "🚀 Starting HEART News System..."

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first:"
    echo "   brew services start mongodb/brew/mongodb-community"
    echo "   or"
    echo "   sudo systemctl start mongod"
    exit 1
fi

# Start backend server
echo "📡 Starting backend server..."
cd backend
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

# Create admin user if doesn't exist
echo "👤 Creating admin user..."
node ../create-admin.js

# Start backend in background
npm start &
BACKEND_PID=$!

echo "✅ Backend server started (PID: $BACKEND_PID)"
echo "📰 News API available at: http://localhost:5001/api/news"
echo "🔐 Auth API available at: http://localhost:5001/api/auth"

# Go back to main directory
cd ..

# Start frontend server
echo "🌐 Starting frontend server..."
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

npm start &
FRONTEND_PID=$!

echo "✅ Frontend server started (PID: $FRONTEND_PID)"
echo "🏠 Website available at: http://localhost:3000"

echo ""
echo "🎉 HEART News System is ready!"
echo ""
echo "📋 Available pages:"
echo "   • Main News Page: http://localhost:3000/news.html"
echo "   • Login Page: http://localhost:3000/simple-login.html"
echo "   • Admin Panel: http://localhost:3000/admin/post-news.html"
echo ""
echo "🔑 Test Admin Account:"
echo "   Username: admin"
echo "   Password: admin123"
echo ""
echo "⏹️  To stop servers:"
echo "   kill $BACKEND_PID $FRONTEND_PID"

# Wait for user input to stop
echo "Press Enter to stop all servers..."
read

# Stop servers
echo "🛑 Stopping servers..."
kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
echo "✅ All servers stopped"