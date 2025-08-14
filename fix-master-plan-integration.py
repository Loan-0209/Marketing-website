#!/usr/bin/env python3
"""
Fix Master Plan 3D Integration Issue
Start HTTP server and verify file loading
"""

import http.server
import socketserver
import webbrowser
import threading
import time
import os
import sys

def start_integration_test():
    # Change to project directory
    project_dir = "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"
    os.chdir(project_dir)
    
    PORT = 8080
    
    print("🔧 FIXING MASTER PLAN 3D INTEGRATION")
    print("=" * 50)
    
    # Check file structure
    print("📁 Checking file structure...")
    
    required_files = [
        "js/master-plan-3d.js",
        "archive-3d/ai-campus-3d-structure.html"
    ]
    
    all_files_exist = True
    for file_path in required_files:
        if os.path.exists(file_path):
            size = os.path.getsize(file_path) / 1024
            print(f"  ✅ {file_path} ({size:.1f} KB)")
        else:
            print(f"  ❌ {file_path} - NOT FOUND")
            all_files_exist = False
    
    if not all_files_exist:
        print("\n❌ Required files missing. Cannot proceed.")
        return
    
    # Check Master Plan 3D content
    print("\n🔍 Analyzing Master Plan 3D file...")
    try:
        with open("js/master-plan-3d.js", "r") as f:
            content = f.read()
            
        # Check for class definition
        if "class MasterPlan3D" in content:
            print("  ✅ MasterPlan3D class found")
        else:
            print("  ❌ MasterPlan3D class not found")
            
        # Check for key methods
        methods = ["constructor", "init", "createScene", "createBuildings"]
        for method in methods:
            if method in content:
                print(f"  ✅ {method} method found")
            else:
                print(f"  ⚠️  {method} method not found")
                
    except Exception as e:
        print(f"  ❌ Error reading file: {e}")
    
    # Start HTTP server
    print(f"\n🌐 Starting HTTP server on port {PORT}...")
    
    class DebugHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
        def end_headers(self):
            # Add CORS headers
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Cache-Control', 'no-cache')
            super().end_headers()
        
        def log_message(self, format, *args):
            message = format % args
            if 'master-plan-3d.js' in message:
                print(f"🎯 Master Plan JS: {message}")
            elif 'ai-campus-3d-structure.html' in message:
                print(f"🏗️  Structure HTML: {message}")
            elif any(ext in message for ext in ['.js', '.html']):
                print(f"📄 Asset: {message}")
    
    def run_server():
        with socketserver.TCPServer(("", PORT), DebugHTTPRequestHandler) as httpd:
            httpd.serve_forever()
    
    # Start server in background
    server_thread = threading.Thread(target=run_server, daemon=True)
    server_thread.start()
    
    # Wait for server to start
    time.sleep(2)
    
    test_url = f"http://localhost:{PORT}/archive-3d/ai-campus-3d-structure.html"
    
    print(f"✅ Server started successfully")
    print(f"🎯 Test URL: {test_url}")
    
    # Test file accessibility
    print(f"\n🧪 Testing file accessibility...")
    import urllib.request
    
    test_files = [
        f"http://localhost:{PORT}/js/master-plan-3d.js",
        f"http://localhost:{PORT}/archive-3d/ai-campus-3d-structure.html"
    ]
    
    for url in test_files:
        try:
            response = urllib.request.urlopen(url)
            print(f"  ✅ {url} - Status: {response.getcode()}")
        except Exception as e:
            print(f"  ❌ {url} - Error: {e}")
    
    print(f"\n🚀 Opening browser...")
    try:
        webbrowser.open(test_url)
        print("✅ Browser opened successfully")
    except Exception as e:
        print(f"⚠️  Could not auto-open browser: {e}")
        print(f"Please manually open: {test_url}")
    
    print(f"""
🔍 WHAT TO CHECK IN BROWSER:

1. OPEN DEVELOPER CONSOLE (F12):
   - Should see: "🌟 DOM loaded, starting Master Plan 3D initialization..."
   - Should see: "📚 Dependencies loaded successfully"
   - Should see: "🚀 Initializing Master Plan 3D Professional Architecture..."

2. LOOK FOR ERRORS:
   - If "MasterPlan3D class not loaded": Check Network tab for failed JS load
   - If "WebGL context not available": Check WebGL support
   - If stuck on loading: Check console for specific error messages

3. EXPECTED RESULT:
   - Professional 3D campus with multiple buildings
   - Timeline controls (Phase 1, 2, 3) working
   - Camera view buttons (Overview, Aerial, Ground) working
   - FPS counter in top-right showing performance

🛠️  TROUBLESHOOTING:
- Clear browser cache (Ctrl+Shift+R)
- Check Network tab in DevTools for failed requests
- Verify WebGL support: visit get.webgl.org
- Try different browser if issues persist

🎯 SUCCESS INDICATORS:
✅ Console shows "Master Plan 3D initialized successfully"
✅ 3D campus visible with multiple colored buildings
✅ Timeline and view controls responsive
✅ FPS counter shows 30+ FPS

Press Ctrl+C to stop server when done testing...
""")
    
    try:
        # Keep server running
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 Server stopped. Integration test complete.")

if __name__ == "__main__":
    start_integration_test()