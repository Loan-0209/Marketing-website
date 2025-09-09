#!/usr/bin/env python3
"""
FIX 404 ERROR - Emergency server with proper file serving
"""
import http.server
import socketserver
import os
import sys

# Change to project directory
project_dir = '/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18'
os.chdir(project_dir)

print("🚨 FIXING 404 ERROR")
print("===================")
print(f"📁 Working directory: {os.getcwd()}")

# List available HTML files
print("\n📄 Available HTML files:")
html_files = [f for f in os.listdir('.') if f.endswith('.html')]
for i, file in enumerate(html_files[:10], 1):
    print(f"  {i}. {file}")

if len(html_files) > 10:
    print(f"  ... and {len(html_files) - 10} more files")

print(f"\n✅ Total HTML files: {len(html_files)}")

# Check if the specific file exists
target_file = 'heart-smart-city-3d-restored.html'
if os.path.exists(target_file):
    print(f"✅ Target file exists: {target_file}")
    file_size = os.path.getsize(target_file)
    print(f"📊 File size: {file_size:,} bytes")
else:
    print(f"❌ Target file NOT found: {target_file}")

# Start server with custom handler
class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Log the request
        print(f"📥 Request: {self.path}")
        
        # Handle root path
        if self.path == '/':
            self.path = '/index.html'
        
        # Check if file exists before serving
        file_path = self.path[1:] if self.path.startswith('/') else self.path
        if os.path.exists(file_path):
            print(f"✅ Serving: {file_path}")
        else:
            print(f"❌ File not found: {file_path}")
            # List similar files
            similar = [f for f in html_files if file_path.lower() in f.lower()]
            if similar:
                print(f"💡 Similar files: {similar}")
        
        return super().do_GET()
    
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

# Try multiple ports
ports = [8080, 8081, 8000, 3000, 5000]
server = None

for port in ports:
    try:
        print(f"\n🔧 Trying port {port}...")
        
        # Create server
        handler = MyHTTPRequestHandler
        server = socketserver.TCPServer(("", port), handler)
        server.allow_reuse_address = True
        
        print(f"✅ SUCCESS! Server started on port {port}")
        print(f"🌐 Access URLs:")
        print(f"   http://localhost:{port}/")
        print(f"   http://localhost:{port}/index.html")
        print(f"   http://localhost:{port}/3d-smart-city.html")
        print(f"   http://localhost:{port}/heart-smart-city-3d-restored.html")
        print(f"   http://127.0.0.1:{port}/")
        print("\n💡 Press Ctrl+C to stop server")
        print("=" * 50)
        
        # Start serving
        server.serve_forever()
        break
        
    except OSError as e:
        print(f"❌ Port {port} failed: {e}")
        if server:
            server.server_close()
        continue
    except KeyboardInterrupt:
        print("\n\n🛑 Server stopped by user")
        if server:
            server.server_close()
        sys.exit(0)

if not server:
    print("\n❌ ERROR: Could not start server on any port!")
    print("Try running with sudo or use a different directory")