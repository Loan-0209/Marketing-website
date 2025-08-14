#!/bin/bash
# Emergency Localhost Fix - Khắc phục lỗi localhost ngay lập tức

echo "🚑 EMERGENCY LOCALHOST FIX"
echo "=========================="

# Change to project directory
cd "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"
echo "📁 Directory: $(pwd)"

# Kill existing servers
echo "🛑 Stopping existing servers..."
pkill -f "python.*http.server" 2>/dev/null || true
pkill -f "SimpleHTTPServer" 2>/dev/null || true

# Find free port
PORT=8000
for port in 8000 8080 8888 9000 9999; do
    if ! lsof -i :$port >/dev/null 2>&1; then
        PORT=$port
        break
    fi
done

echo "🎯 Using port: $PORT"

# Display URLs
echo ""
echo "🌐 URLs sẽ mở:"
echo "   🏠 Main: http://localhost:$PORT/"
echo "   ❤️ Standalone: http://localhost:$PORT/heart_standalone.html"
echo "   🎮 3D Campus: http://localhost:$PORT/3d-campus-interactive.html"
echo ""

# Open browser after 3 seconds
(sleep 3 && open "http://localhost:$PORT/") &

# Start server
echo "🚀 Starting server on port $PORT..."
echo "⏹️ Press Ctrl+C to stop"
echo "=========================="

python3 -m http.server $PORT