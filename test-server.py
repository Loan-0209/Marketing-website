#!/usr/bin/env python3
import http.server
import socketserver
import webbrowser
import os
import time

# Change to project directory
os.chdir('/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18')

# Start server on port 8080
PORT = 8080
Handler = http.server.SimpleHTTPRequestHandler

print(f"🚀 Starting test server on port {PORT}...")
print(f"📁 Directory: {os.getcwd()}")

try:
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"✅ Server running at http://localhost:{PORT}")
        print(f"🏢 3D Campus Complete: http://localhost:{PORT}/3d-campus-smart-city-complete.html")
        
        # Auto open browser with complete version
        time.sleep(1)
        try:
            webbrowser.open(f"http://localhost:{PORT}/3d-campus-smart-city-complete.html")
            print("🌐 Browser opened with complete 3D campus!")
        except:
            print("⚠️ Please open browser manually")
            
        print("\n🧪 Debug functions available in browser console:")
        print("   • debugBrowserSync() - Full diagnostic")
        print("   • switchCameraView() - Camera cycling")
        print("   • emergencyReset() - Scene reset test")
        
        print("\n⚡ Server running! Press Ctrl+C to stop")
        httpd.serve_forever()
        
except KeyboardInterrupt:
    print("\n👋 Server stopped")
except Exception as e:
    print(f"❌ Server error: {e}")