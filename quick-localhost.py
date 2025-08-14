#!/usr/bin/env python3
"""
🚀 QUICK LOCALHOST - Khởi động nhanh localhost server
"""

import os
import http.server
import socketserver
import webbrowser
import threading
import time

# Chuyển đến thư mục website
os.chdir("/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18")

# Port mặc định
PORT = 8000

print("🚀 QUICK LOCALHOST SERVER")
print("=" * 30)
print(f"📁 Directory: {os.getcwd()}")
print(f"🌐 Port: {PORT}")

# Tạo server
class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        print(f"📄 {format % args}")

# Khởi động server
try:
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"\n✅ Server running at: http://localhost:{PORT}")
        print("\n🔗 AVAILABLE URLS:")
        print(f"   🏠 Main: http://localhost:{PORT}/")
        print(f"   📱 Homepage: http://localhost:{PORT}/index.html")
        print(f"   ❤️  Standalone: http://localhost:{PORT}/heart_standalone.html")
        print(f"   🎮 3D Campus: http://localhost:{PORT}/3d-campus-interactive.html")
        
        # Mở browser
        def open_browser():
            time.sleep(1)
            webbrowser.open(f"http://localhost:{PORT}/")
            print("\n🌐 Browser opened!")
        
        threading.Thread(target=open_browser, daemon=True).start()
        
        print(f"\n⏹️  Press Ctrl+C to stop")
        print("=" * 30)
        
        httpd.serve_forever()
        
except KeyboardInterrupt:
    print("\n👋 Server stopped!")
except Exception as e:
    print(f"\n❌ Error: {e}")
    print("\n📋 Try different port:")
    print("python3 -m http.server 8080")