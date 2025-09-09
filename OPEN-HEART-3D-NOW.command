#!/bin/bash
cd "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"

echo "🚀 HEART Smart City 3D - Starting Server..."
echo "================================================"

python3 -m http.server 8080 &
SERVER_PID=$!

echo "✅ Server started with PID: $SERVER_PID"
echo ""
echo "🎯 Access URLs:"
echo "• HEART 3D Restored: http://localhost:8080/heart-smart-city-3d-restored.html"
echo "• Original 3D City:  http://localhost:8080/3d-smart-city.html"
echo "• Homepage:          http://localhost:8080/"
echo ""
echo "🌐 Opening in browser..."

# Wait 2 seconds for server to start
sleep 2

# Open in browser
open "http://localhost:8080/heart-smart-city-3d-restored.html"

echo ""
echo "💡 Server is running in background (PID: $SERVER_PID)"
echo "💡 Press Ctrl+C to stop, or run: kill $SERVER_PID"
echo "================================================"

wait $SERVER_PID