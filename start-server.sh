#!/bin/bash

echo "🚀 HEART Technology Park - Fixed Server Start"
echo "🔧 Fixing access issues..."

# Navigate to project directory
cd /Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/

echo "📁 Current directory: $(pwd)"

# Check if key files exist
echo "📋 Checking files..."
for file in "about.html" "index.html" "test-nuclear-final.html"; do
    if [ -f "$file" ]; then
        echo "✅ $file found"
    else
        echo "❌ $file missing"
    fi
done

# Kill any existing servers on ports
echo "🧹 Cleaning up existing servers..."
lsof -ti:3000,8000,8080 | xargs kill -9 2>/dev/null || true

echo ""
echo "🌐 Starting servers..."

# Method 1: Python simple server (most reliable)
echo "✅ Starting Python server on port 8000..."
python3 -m http.server 8000 &
SERVER_PID=$!

# Method 2: Try live-server if available
if command -v live-server &> /dev/null; then
    echo "✅ Starting live-server on port 3000..."
    live-server --port=3000 --host=localhost --no-browser &
    LIVE_PID=$!
fi

# Wait for servers to start
sleep 3

echo ""
echo "🎯 SERVERS READY!"
echo "🌐 Available URLs:"
echo "   🔥 Primary:   http://localhost:8000/about.html"
echo "   🏠 Home:      http://localhost:8000/"
echo "   🧪 Nuclear:   http://localhost:8000/test-nuclear-final.html"

if command -v live-server &> /dev/null; then
    echo "   ⚡ Live:      http://localhost:3000/about.html"
fi

echo ""
echo "🌐 Opening browser to About page..."
open http://localhost:8000/about.html

echo ""
echo "💥 Nuclear Gradient Removal Features:"
echo "   ✅ Auto-activates after 1 second"
echo "   🎨 Pure white background"
echo "   🏢 Enhanced building with glow effects"
echo ""
echo "🔧 Press Ctrl+C to stop all servers"

# Wait for user interrupt
trap 'echo "🛑 Stopping servers..."; kill $SERVER_PID 2>/dev/null; kill $LIVE_PID 2>/dev/null; exit' INT
wait