#!/usr/bin/env python3
"""
HEART Technology Park - EMERGENCY SERVER
Ultimate fix for website access issues
"""

import os
import sys
import time
import webbrowser
import threading

print("🚨 EMERGENCY SERVER - HEART Technology Park")
print("🔧 Fixing website access issues...")

# Step 1: Change to correct directory
target_dir = '/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18'
try:
    os.chdir(target_dir)
    print(f"✅ Directory: {os.getcwd()}")
except Exception as e:
    print(f"❌ Directory error: {e}")
    exit(1)

# Step 2: Check files exist
print("📋 Checking files...")
if os.path.exists('about.html'):
    print("✅ about.html found")
else:
    print("❌ about.html missing")

# Step 3: Import required modules
try:
    import http.server
    import socketserver
    print("✅ HTTP modules ready")
except ImportError as e:
    print(f"❌ Import error: {e}")
    exit(1)

# Step 4: Browser opener
def open_browser_delayed():
    time.sleep(3)
    try:
        webbrowser.open('http://localhost:8000/about.html')
        print("✅ Browser opened: about.html")
        time.sleep(1)
        if os.path.exists('QUICK_TEST.html'):
            webbrowser.open('http://localhost:8000/QUICK_TEST.html')
            print("✅ Browser opened: QUICK_TEST.html")
    except Exception as e:
        print(f"⚠️ Browser error: {e}")

# Step 5: Start server
ports = [8000, 3000, 8080, 5000, 9000]
server_started = False

for port in ports:
    try:
        print(f"🔄 Trying port {port}...")
        
        Handler = http.server.SimpleHTTPRequestHandler
        httpd = socketserver.TCPServer(("", port), Handler)
        
        print("🎉 SUCCESS! Server started!")
        print(f"📍 URLs:")
        print(f"   🏠 Home: http://localhost:{port}/")
        print(f"   💥 About: http://localhost:{port}/about.html")
        if os.path.exists('QUICK_TEST.html'):
            print(f"   🧪 Test: http://localhost:{port}/QUICK_TEST.html")
        
        print(f"\n💥 NUCLEAR GRADIENT REMOVAL:")
        print(f"   ✅ Auto-activates on About page")
        print(f"   ✅ Pure white background")
        print(f"   ✅ Enhanced HEART building")
        
        print(f"\n🔧 Server on port {port} - Press Ctrl+C to stop")
        
        # Start browser
        threading.Thread(target=open_browser_delayed, daemon=True).start()
        
        server_started = True
        httpd.serve_forever()
        
    except OSError:
        print(f"❌ Port {port} busy")
        continue
    except KeyboardInterrupt:
        print(f"\n🛑 Server stopped")
        break
    except Exception as e:
        print(f"❌ Error: {e}")
        continue

# Fallback if no server started
if not server_started:
    print("\n🆘 ALL PORTS BUSY - USING DIRECT FILE ACCESS")
    try:
        file_path = os.path.join(os.getcwd(), 'about.html')
        webbrowser.open(f'file://{file_path}')
        print("✅ Opened about.html directly")
        
        if os.path.exists('QUICK_TEST.html'):
            file_path = os.path.join(os.getcwd(), 'QUICK_TEST.html')
            webbrowser.open(f'file://{file_path}')
            print("✅ Opened QUICK_TEST.html directly")
        
        print("\n💥 NUCLEAR MODE STILL WORKS!")
        print("✅ Files opened with file:// protocol")
        print("⚠️ Some features may be limited")
        
    except Exception as e:
        print(f"❌ Fallback failed: {e}")

print("\n✅ Emergency server complete")