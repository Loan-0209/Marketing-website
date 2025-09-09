#!/bin/bash
# URGENT SERVER FIX - ERR_EMPTY_RESPONSE

echo "🚨 URGENT SERVER FIX - FIXING ERR_EMPTY_RESPONSE"
echo "================================================"

# Function to kill process on port
kill_port() {
    local port=$1
    echo "🔧 Killing any process on port $port..."
    lsof -ti:$port | xargs kill -9 2>/dev/null || true
    sleep 1
}

# Function to check if port is free
is_port_free() {
    local port=$1
    ! lsof -i:$port >/dev/null 2>&1
}

# 1. DIAGNOSE
echo -e "\n1️⃣ DIAGNOSIS:"
echo "Checking port 8080 status..."
if lsof -i :8080 >/dev/null 2>&1; then
    echo "❌ Port 8080 is occupied by:"
    lsof -i :8080
else
    echo "✅ Port 8080 is free"
fi

# 2. CLEANUP
echo -e "\n2️⃣ CLEANUP:"
kill_port 8080
kill_port 8081
kill_port 8000
pkill -f "python.*http.server" 2>/dev/null || true
echo "✅ All server processes killed"

# 3. FIX PERMISSIONS
echo -e "\n3️⃣ FIXING PERMISSIONS:"
cd /Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18
chmod -R 755 .
echo "✅ Permissions fixed"

# 4. START NEW SERVER
echo -e "\n4️⃣ STARTING FRESH SERVER:"

# Try multiple methods
echo "Trying Method 1: Python simple server..."
if command -v python3 &> /dev/null; then
    # Create a simple server with error handling
    cat > temp_server.py << 'EOF'
import http.server
import socketserver
import os
import sys

os.chdir('/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18')

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        try:
            if self.path == '/':
                self.path = '/3d-smart-city.html'
            return super().do_GET()
        except Exception as e:
            print(f"Error serving {self.path}: {e}")
            self.send_error(500, f"Server Error: {str(e)}")

PORT = 8080
print(f"\n✅ Server starting at http://localhost:{PORT}")
print(f"📄 Access 3D Smart City at: http://localhost:{PORT}/3d-smart-city.html")
print("Press Ctrl+C to stop\n")

try:
    with socketserver.TCPServer(("", PORT), MyHandler) as httpd:
        httpd.allow_reuse_address = True
        httpd.serve_forever()
except KeyboardInterrupt:
    print("\n🛑 Server stopped")
except Exception as e:
    print(f"❌ Server error: {e}")
EOF

    python3 temp_server.py
else
    echo "❌ Python3 not found!"
fi