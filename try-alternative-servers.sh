#!/bin/bash

try_alternative_servers() {
    echo "🔄 TRYING ALTERNATIVE SERVER METHODS"
    echo "==================================="
    
    # Change to project directory
    cd /Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/
    echo "📁 Working directory: $(pwd)"
    
    # Method 1: Node.js http-server (if available)
    if command -v node &> /dev/null; then
        echo -e "\n🟢 Method 1: Node.js http-server"
        echo "Installing http-server if needed..."
        npm install -g http-server 2>/dev/null || echo "http-server may already be installed"
        echo "Starting Node server on port 8000..."
        npx http-server -p 8000 --cors > node_server.log 2>&1 &
        NODE_PID=$!
        sleep 3
        
        if curl -s http://localhost:8000/ > /dev/null 2>&1; then
            echo "✅ Node.js server working!"
            open "http://localhost:8000/"
            echo "🎉 SUCCESS with Node.js server!"
            echo "Server PID: $NODE_PID"
            echo "Press Enter to stop server..."
            read
            kill $NODE_PID 2>/dev/null
            return 0
        else
            kill $NODE_PID 2>/dev/null
            echo "❌ Node.js server failed"
        fi
    else
        echo "⚠️ Node.js not available"
    fi
    
    # Method 2: Ruby WEBrick server
    if command -v ruby &> /dev/null; then
        echo -e "\n🔴 Method 2: Ruby WEBrick server"
        echo "Starting Ruby server on port 8001..."
        ruby -run -ehttpd . -p8001 > ruby_server.log 2>&1 &
        RUBY_PID=$!
        sleep 3
        
        if curl -s http://localhost:8001/ > /dev/null 2>&1; then
            echo "✅ Ruby server working!"
            open "http://localhost:8001/"
            echo "🎉 SUCCESS with Ruby server!"
            echo "Server PID: $RUBY_PID"
            echo "Press Enter to stop server..."
            read
            kill $RUBY_PID 2>/dev/null
            return 0
        else
            kill $RUBY_PID 2>/dev/null
            echo "❌ Ruby server failed"
        fi
    else
        echo "⚠️ Ruby not available"
    fi
    
    # Method 3: PHP built-in server
    if command -v php &> /dev/null; then
        echo -e "\n🟠 Method 3: PHP built-in server"
        echo "Starting PHP server on port 8002..."
        php -S localhost:8002 > php_server.log 2>&1 &
        PHP_PID=$!
        sleep 3
        
        if curl -s http://localhost:8002/ > /dev/null 2>&1; then
            echo "✅ PHP server working!"
            open "http://localhost:8002/"
            echo "🎉 SUCCESS with PHP server!"
            echo "Server PID: $PHP_PID"
            echo "Press Enter to stop server..."
            read
            kill $PHP_PID 2>/dev/null
            return 0
        else
            kill $PHP_PID 2>/dev/null
            echo "❌ PHP server failed"
        fi
    else
        echo "⚠️ PHP not available"
    fi
    
    # Method 4: Python with different approach
    echo -e "\n🐍 Method 4: Python with explicit binding"
    python3 -c "
import http.server
import socketserver
import webbrowser
import threading
import time
import os

os.chdir('/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/')

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        print(f'✅ Server: {format % args}')

def start_server():
    try:
        with socketserver.TCPServer(('127.0.0.1', 8003), CustomHandler) as httpd:
            print('✅ Python server started on http://127.0.0.1:8003/')
            threading.Timer(2, lambda: webbrowser.open('http://127.0.0.1:8003/')).start()
            print('🌐 Browser should open automatically...')
            print('🛑 Press Ctrl+C to stop server')
            httpd.serve_forever()
    except Exception as e:
        print(f'❌ Python server failed: {e}')

start_server()
" &
    PYTHON_PID=$!
    
    sleep 5
    
    if curl -s http://127.0.0.1:8003/ > /dev/null 2>&1; then
        echo "✅ Python alternative server working!"
        echo "🎉 SUCCESS with Python alternative!"
        echo "Server PID: $PYTHON_PID"
        echo "Press Enter to stop server..."
        read
        kill $PYTHON_PID 2>/dev/null
        return 0
    else
        kill $PYTHON_PID 2>/dev/null
        echo "❌ Python alternative failed"
    fi
    
    # Method 5: Simple netcat approach (last resort)
    if command -v nc &> /dev/null; then
        echo -e "\n🔵 Method 5: Netcat simple server"
        echo "Starting simple netcat server on port 8004..."
        
        # Create simple HTTP response
        cat > simple_response.txt << 'RESPONSE'
HTTP/1.1 200 OK
Content-Type: text/html
Connection: close

<!DOCTYPE html>
<html><head><title>Simple Server Test</title></head>
<body style="font-family:Arial;text-align:center;padding:50px;background:#4f46e5;color:white;">
<h1>🎉 NETCAT SERVER WORKS!</h1>
<p>Simple fallback server is running</p>
<a href="heart_standalone.html" style="color:yellow;">Open Standalone Version</a>
</body></html>
RESPONSE
        
        while true; do
            nc -l 8004 < simple_response.txt
        done &
        NC_PID=$!
        
        sleep 2
        echo "✅ Netcat server started"
        open "http://localhost:8004/"
        echo "🎉 SUCCESS with Netcat server!"
        echo "Server PID: $NC_PID"
        echo "Press Enter to stop server..."
        read
        kill $NC_PID 2>/dev/null
        rm -f simple_response.txt
        return 0
    fi
    
    echo -e "\n❌ All server methods failed"
    echo "📱 Please try opening heart_standalone.html directly"
    return 1
}

# Run the function
try_alternative_servers