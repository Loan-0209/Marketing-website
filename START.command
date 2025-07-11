#!/bin/bash

echo "🚀 HEART Technology Park - START WEBSITE"
echo "========================================"

# Navigate to project directory
cd /Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/

echo "📁 Directory: $(pwd)"
echo ""

# Method 1: Run Ultimate Fix
echo "🔥 METHOD 1: Ultimate Fix Script"
if [ -f "ULTIMATE_FIX.py" ]; then
    echo "✅ Running ultimate fix..."
    python3 ULTIMATE_FIX.py
    exit 0
fi

# Method 2: Simple HTTP Server
echo "🔄 METHOD 2: Simple HTTP Server"
echo "🧹 Cleaning up ports..."
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

echo "🚀 Starting server on port 8000..."
python3 -m http.server 8000 &
SERVER_PID=$!

# Wait for server
sleep 3

# Test server
if curl -s http://localhost:8000/ > /dev/null 2>&1; then
    echo "✅ Server responding!"
    echo "📍 URLs:"
    echo "   💥 About: http://localhost:8000/about.html"
    echo "   🧪 Test:  http://localhost:8000/NUCLEAR_TEST.html"
    
    # Open browser
    echo "🌐 Opening browser..."
    open http://localhost:8000/about.html
    sleep 1
    open http://localhost:8000/NUCLEAR_TEST.html
    
    echo ""
    echo "🎉 SUCCESS! Nuclear gradient removal ready!"
    echo "💥 Auto-activates on About page after 1 second"
    echo "🔧 Press Ctrl+C to stop server"
    
    # Keep server running
    wait $SERVER_PID
    
else
    echo "❌ Server failed, trying direct file access..."
    
    # Method 3: Direct file access
    echo "📂 Opening files directly..."
    open about.html
    open NUCLEAR_TEST.html
    
    echo "✅ Files opened directly"
    echo "💥 Nuclear mode still works!"
fi

echo ""
echo "✅ Startup complete!"