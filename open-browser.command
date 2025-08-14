#!/bin/bash

echo "🚀 Opening AI Campus 3D - Master Plan Architecture"
echo "=================================================="

# Change to project directory
cd "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/"

# Start Python HTTP server in background
echo "🌐 Starting HTTP Server..."
python3 -m http.server 8080 > /dev/null 2>&1 &
SERVER_PID=$!

# Wait for server to start
sleep 2

# URLs to test
URLS=(
    "http://localhost:8080/archive-3d/ai-campus-3d-structure.html"
    "file:///Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/archive-3d/ai-campus-3d-structure.html"
)

echo "🎯 Testing URLs:"
for url in "${URLS[@]}"; do
    echo "   $url"
done

echo ""
echo "🔧 What to check:"
echo "   1. Loading message: 'Loading Professional AI Campus Architecture...'"
echo "   2. Console messages: '🚀 Initializing Master Plan 3D Professional Architecture...'"
echo "   3. Timeline controls: Phase 1, 2, 3 buttons"
echo "   4. Camera views: Overview, Aerial, Ground buttons"
echo "   5. FPS counter in top-right"
echo "   6. 3D buildings and campus architecture"
echo ""

# Try to open with default browser
echo "🌐 Opening browser..."
if command -v open >/dev/null 2>&1; then
    # macOS
    open "http://localhost:8080/archive-3d/ai-campus-3d-structure.html"
    echo "✅ Opened with macOS default browser"
elif command -v xdg-open >/dev/null 2>&1; then
    # Linux
    xdg-open "http://localhost:8080/archive-3d/ai-campus-3d-structure.html"
    echo "✅ Opened with Linux default browser"
else
    echo "⚠️  Please manually open: http://localhost:8080/archive-3d/ai-campus-3d-structure.html"
fi

echo ""
echo "📊 Server Info:"
echo "   URL: http://localhost:8080/archive-3d/ai-campus-3d-structure.html"
echo "   PID: $SERVER_PID"
echo "   Press Ctrl+C to stop server"

# Keep script running
echo ""
echo "🎮 MASTER PLAN 3D IS LOADING..."
echo "Check your browser for the professional 3D campus!"

# Wait for user input
read -p "Press Enter to stop server and exit..."

# Clean up
kill $SERVER_PID 2>/dev/null
echo "🛑 Server stopped"