#!/bin/bash

echo "🚨 HEART Technology Park - QUICK FIX"
echo "🔧 Sửa lỗi không thể truy cập trang web"
echo ""

# Navigate to project directory
cd /Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/
echo "📁 Directory: $(pwd)"

# Kill existing processes on common ports
echo "🧹 Cleaning up existing servers..."
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:8080 | xargs kill -9 2>/dev/null || true

# Check if files exist
echo "📋 Checking files..."
if [ -f "about.html" ]; then
    echo "✅ about.html found"
else
    echo "❌ about.html missing"
fi

# Method 1: Try Python 3 HTTP server
echo ""
echo "🚀 METHOD 1: Python 3 HTTP Server"
if command -v python3 &> /dev/null; then
    echo "✅ Python 3 available"
    echo "🔄 Starting server on port 8000..."
    python3 -m http.server 8000 &
    SERVER_PID=$!
    
    # Wait for server to start
    sleep 3
    
    # Test if server is responding
    if curl -s http://localhost:8000/ > /dev/null 2>&1; then
        echo "✅ Server responding on port 8000"
        echo "📍 URLs:"
        echo "   🏠 Home: http://localhost:8000/"
        echo "   💥 About: http://localhost:8000/about.html"
        
        # Open browser
        echo "🌐 Opening browser..."
        open http://localhost:8000/about.html
        
        echo ""
        echo "🎉 SUCCESS! Nuclear gradient removal ready!"
        echo "💥 Auto-activates on About page after 1 second"
        echo "🔧 Press Ctrl+C to stop server"
        
        # Keep server running
        wait $SERVER_PID
        
    else
        echo "❌ Server not responding, trying alternative..."
        kill $SERVER_PID 2>/dev/null
        
        # Method 2: Try different port
        echo ""
        echo "🚀 METHOD 2: Alternative Port 3000"
        python3 -m http.server 3000 &
        SERVER_PID=$!
        sleep 3
        
        if curl -s http://localhost:3000/ > /dev/null 2>&1; then
            echo "✅ Server responding on port 3000"
            open http://localhost:3000/about.html
            echo "🎉 SUCCESS on port 3000!"
            wait $SERVER_PID
        else
            echo "❌ Port 3000 also failed"
            kill $SERVER_PID 2>/dev/null
        fi
    fi
else
    echo "❌ Python 3 not found"
fi

# Method 3: Direct file access
echo ""
echo "🚀 METHOD 3: Direct File Access"
echo "📂 Opening files directly..."
open about.html
if [ -f "QUICK_TEST.html" ]; then
    open QUICK_TEST.html
fi

echo ""
echo "💥 NUCLEAR GRADIENT REMOVAL:"
echo "   ✅ Available on About page"
echo "   ✅ Auto-activates after 1 second"
echo "   ✅ Console commands available"
echo ""
echo "🔧 Browser Console Commands:"
echo "   window.nuclearGradientRemoval()"
echo "   window.toggleNuclearMode()"
echo ""
echo "✅ Quick fix complete!"