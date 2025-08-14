#!/bin/bash

echo "🚨 EMERGENCY SERVER START"
echo "========================"

# Change to project directory
cd /Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/

# Kill old servers
echo "🛑 Killing old servers..."
pkill -f "python.*http.server" 2>/dev/null
sleep 2

# Start server on port 9999
echo "🚀 Starting emergency server on port 9999..."
python3 -m http.server 9999 > /dev/null 2>&1 &
SERVER_PID=$!

echo "📋 Server PID: $SERVER_PID"
sleep 3

# Open browser
echo "🌐 Opening browser..."
open "http://localhost:9999/"

echo "✅ Emergency server started at http://localhost:9999/"
echo ""
echo "🎯 MAIN URLS:"
echo "   🏠 Homepage: http://localhost:9999/"
echo "   🏛️ 3D Campus: http://localhost:9999/archive-3d/ai-campus-3d-structure.html"
echo "   📊 Dashboard: http://localhost:9999/project-dashboard.html"
echo ""
echo "🛑 To stop server: kill $SERVER_PID"
echo "💾 Server PID saved to .server_pid"

# Save PID for later
echo $SERVER_PID > .server_pid

echo ""
echo "Press Enter to stop server..."
read

# Stop server
kill $SERVER_PID 2>/dev/null
echo "✅ Server stopped"