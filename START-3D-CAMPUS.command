#!/bin/bash

echo "🚀 STARTING 3D CAMPUS SERVER"
echo "=========================="

# Change to project directory
cd "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"

# Check if file exists
if [ -f "3d-campus-with-navigation.html" ]; then
    echo "✅ 3d-campus-with-navigation.html found!"
else
    echo "❌ File not found!"
    exit 1
fi

# Kill any existing servers
echo "🔄 Stopping existing servers..."
killall python3 2>/dev/null || true
lsof -ti:8000 | xargs kill -9 2>/dev/null || true

# Wait a moment
sleep 1

# Start Python server
echo "🌐 Starting HTTP server on port 8000..."
echo ""
echo "URLs available:"
echo "  🏠 Homepage: http://localhost:8000"
echo "  🏢 3D Campus: http://localhost:8000/3d-campus-with-navigation.html"
echo "  🏭 Facilities: http://localhost:8000/facilities.html"
echo ""
echo "✅ Server starting..."

# Open browser automatically after 2 seconds
(sleep 2 && open "http://localhost:8000/3d-campus-with-navigation.html") &

# Start server
python3 -m http.server 8000