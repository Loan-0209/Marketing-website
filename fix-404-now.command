#!/bin/bash
# 🔧 FIX 404 ERROR - Quick Start

echo "🔧 FIX ERROR 404 - Starting Web Server"
echo "===================================="

# Change to project directory
cd /Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18

# Check if index.html exists
if [ -f "index.html" ]; then
    echo "✅ index.html found"
else
    echo "❌ index.html not found!"
    exit 1
fi

# Kill existing servers
echo "🔄 Stopping old servers..."
killall python3 2>/dev/null
killall Python 2>/dev/null
lsof -ti:8000 | xargs kill -9 2>/dev/null
sleep 1

# Start server
echo "🌐 Starting HTTP server on port 8000..."
echo ""
echo "📋 URLs:"
echo "  Homepage: http://localhost:8000"
echo "  3D Smart City: http://localhost:8000/3d-campus-with-navigation.html"
echo "  Facilities: http://localhost:8000/facilities.html"
echo ""

# Open browser
echo "🌐 Opening browser..."
open http://localhost:8000

# Start Python server
echo "⚡ Server is running! Press Ctrl+C to stop"
python3 -m http.server 8000