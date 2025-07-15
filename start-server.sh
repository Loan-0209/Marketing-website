#!/bin/bash

echo "🚀 Starting HEART Website Server..."

# Kill any existing servers
pkill -f "python.*http.server" 2>/dev/null
pkill -f "SimpleHTTPServer" 2>/dev/null

# Try different ports
for port in 3000 8000 8080 9000; do
    if ! lsof -i :$port >/dev/null 2>&1; then
        echo "✅ Port $port is available"
        echo "🌐 Starting server on http://localhost:$port"
        cd /Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18
        python3 -m http.server $port &
        SERVER_PID=$!
        echo "🔧 Server PID: $SERVER_PID"
        echo "📂 Serving from: $(pwd)"
        echo ""
        echo "🔗 Open these URLs to test:"
        echo "   • Main site: http://localhost:$port"
        echo "   • Fixed login: http://localhost:$port/login-fixed-final.html?redirect=about.html"
        echo "   • Debug login: http://localhost:$port/production-login.html?redirect=about.html"
        echo "   • Test dashboard: http://localhost:$port/test-login-flow.html"
        echo ""
        echo "🛑 To stop server: kill $SERVER_PID"
        break
    else
        echo "❌ Port $port is busy"
    fi
done

# Keep script running to show server status
sleep 2
if ps -p $SERVER_PID > /dev/null 2>&1; then
    echo "✅ Server is running successfully!"
    echo "🌐 Access the website at http://localhost:$port"
else
    echo "❌ Failed to start server"
fi