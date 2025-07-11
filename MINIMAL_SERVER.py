#!/usr/bin/env python3
"""
HEART Technology Park - MINIMAL SERVER
Absolutely simplest server that must work
"""

print("🚀 HEART Technology Park - Minimal Server Starting...")

# Step 1: Import required modules
try:
    import os
    import http.server
    import socketserver
    import webbrowser
    import time
    import threading
    print("✅ All modules imported successfully")
except ImportError as e:
    print(f"❌ Import failed: {e}")
    exit(1)

# Step 2: Change directory
target_dir = '/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18'
try:
    os.chdir(target_dir)
    print(f"✅ Changed to directory: {os.getcwd()}")
except Exception as e:
    print(f"❌ Directory change failed: {e}")
    exit(1)

# Step 3: Check files exist
if os.path.exists('about.html'):
    print("✅ about.html found")
else:
    print("❌ about.html missing")

if os.path.exists('QUICK_TEST.html'):
    print("✅ QUICK_TEST.html found")
else:
    print("⚠️ QUICK_TEST.html missing (but server will still work)")

# Step 4: Define browser opener
def open_browser_delayed():
    """Open browser after server starts"""
    print("⏳ Waiting 3 seconds for server to start...")
    time.sleep(3)
    
    try:
        webbrowser.open('http://localhost:8000/about.html')
        print("✅ Opened about.html in browser")
        time.sleep(1)
        
        if os.path.exists('QUICK_TEST.html'):
            webbrowser.open('http://localhost:8000/QUICK_TEST.html')
            print("✅ Opened QUICK_TEST.html in browser")
    except Exception as e:
        print(f"⚠️ Browser opening failed: {e}")

# Step 5: Start browser thread
browser_thread = threading.Thread(target=open_browser_delayed)
browser_thread.daemon = True
browser_thread.start()

# Step 6: Try to start server on different ports
ports_to_try = [8000, 3000, 8080, 5000, 9000]
server_started = False

for port in ports_to_try:
    try:
        print(f"🔄 Trying port {port}...")
        
        Handler = http.server.SimpleHTTPRequestHandler
        httpd = socketserver.TCPServer(("", port), Handler)
        
        print("🎉" * 30)
        print("🎉 SUCCESS! Server started!")
        print("🎉" * 30)
        print(f"📍 Server URL: http://localhost:{port}")
        print(f"💥 About page: http://localhost:{port}/about.html")
        if os.path.exists('QUICK_TEST.html'):
            print(f"🧪 Quick test: http://localhost:{port}/QUICK_TEST.html")
        print()
        print("🎯 Nuclear Gradient Removal Ready!")
        print("   💥 Auto-activates on About page after 1 second")
        print("   🔧 Console commands available:")
        print("   window.nuclearGradientRemoval()")
        print("   window.toggleNuclearMode()")
        print()
        print("🔧 Press Ctrl+C to stop server")
        print("=" * 50)
        
        server_started = True
        httpd.serve_forever()
        
    except OSError as e:
        print(f"❌ Port {port} failed: {e}")
        continue
    except KeyboardInterrupt:
        print(f"\n🛑 Server on port {port} stopped by user")
        break
    except Exception as e:
        print(f"❌ Unexpected error on port {port}: {e}")
        continue

if not server_started:
    print("💥 CRITICAL: No ports available!")
    print("🔧 Manual options:")
    print("   1. Close other applications using ports 3000-9000")
    print("   2. Try: python3 -m http.server 8000")
    print("   3. Open files directly in browser:")
    print("      - Double-click about.html in Finder")
    print("      - Double-click QUICK_TEST.html in Finder")
    print()
    input("Press Enter to exit...")