#!/bin/bash
cd "$(dirname "$0")"

echo "🚀 Mở 3D Campus Smart City..."
echo "📂 Current directory: $(pwd)"

# Try to start server if not running
if ! lsof -i :8000 >/dev/null 2>&1; then
    echo "🌐 Starting local server..."
    python3 -m http.server 8000 &
    SERVER_PID=$!
    sleep 2
fi

# Open browser
echo "🌐 Opening browser..."
open http://localhost:8000/3d-campus-smart-city.html

echo "✅ 3D Campus Smart City should now be loading in your browser!"
echo "🎮 Features:"
echo "   • Phase buttons: Phase 1/2/3 (50/100/200 buildings)"
echo "   • View buttons: Overview/Aerial/Ground/Orbit"
echo "   • Click buildings for details"
echo "   • Mouse: Drag to rotate, scroll to zoom"

read -p "Press Enter to close..."