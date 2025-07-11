#!/usr/bin/env python3
"""
HEART Technology Park - LAUNCH NOW
Final working solution for nuclear mode testing
"""

import os
import sys
import time
import webbrowser
import threading

print("🚀" * 30)
print("🚀 HEART TECHNOLOGY PARK - LAUNCH NOW")
print("🚀 Final solution for nuclear gradient removal testing")
print("🚀" * 30)

# Step 1: Basic environment check
print("\n1️⃣ ENVIRONMENT CHECK:")
print(f"   🐍 Python: {sys.version.split()[0]}")
print(f"   📁 Working Directory: {os.getcwd()}")

# Step 2: Navigate to project directory
target_dir = '/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18'
try:
    os.chdir(target_dir)
    print(f"   ✅ Changed to: {os.getcwd()}")
except Exception as e:
    print(f"   ❌ Directory error: {e}")
    sys.exit(1)

# Step 3: Check key files
print("\n2️⃣ FILES CHECK:")
key_files = ['about.html', 'QUICK_TEST.html', 'index.html']
for file in key_files:
    if os.path.exists(file):
        size = os.path.getsize(file)
        print(f"   ✅ {file} ({size} bytes)")
    else:
        print(f"   ❌ {file} missing")

# Step 4: Import required modules
print("\n3️⃣ MODULES CHECK:")
try:
    import http.server
    import socketserver
    print("   ✅ HTTP server modules ready")
except ImportError as e:
    print(f"   ❌ Import failed: {e}")
    sys.exit(1)

# Step 5: Browser opener function
def open_browser_tabs(port):
    """Open browser tabs with nuclear mode test pages"""
    print(f"\n🌐 Opening browser tabs for port {port}...")
    time.sleep(3)  # Wait for server to start
    
    urls = [
        f'http://localhost:{port}/about.html',
        f'http://localhost:{port}/QUICK_TEST.html'
    ]
    
    for i, url in enumerate(urls, 1):
        try:
            webbrowser.open(url)
            print(f"   ✅ Tab {i}: {url}")
            time.sleep(1)
        except Exception as e:
            print(f"   ❌ Tab {i} failed: {e}")

# Step 6: Test ports and start server
print("\n4️⃣ SERVER STARTUP:")
ports = [8000, 3000, 8080, 5000, 9000, 4000]

server_started = False
for port in ports:
    try:
        print(f"   🔄 Testing port {port}...")
        
        # Create server
        Handler = http.server.SimpleHTTPRequestHandler
        httpd = socketserver.TCPServer(("", port), Handler)
        httpd.allow_reuse_address = True
        
        print(f"   ✅ Port {port} available!")
        
        # Start browser opening thread
        browser_thread = threading.Thread(target=open_browser_tabs, args=(port,))
        browser_thread.daemon = True
        browser_thread.start()
        
        # Success message
        print("\n🎉" * 30)
        print("🎉 SUCCESS! HEART Technology Park Server Started!")
        print("🎉" * 30)
        print(f"\n📍 Server URLs:")
        print(f"   🏠 Home:       http://localhost:{port}/")
        print(f"   💥 About:      http://localhost:{port}/about.html")
        print(f"   🧪 Quick Test: http://localhost:{port}/QUICK_TEST.html")
        print(f"\n🎯 NUCLEAR GRADIENT REMOVAL TESTING:")
        print(f"   ✅ Auto-activates on About page after 1 second")
        print(f"   ✅ Manual controls on Quick Test page")
        print(f"   ✅ Console commands available:")
        print(f"      window.nuclearGradientRemoval()")
        print(f"      window.toggleNuclearMode()")
        print(f"      window.debugBuilding()")
        print(f"\n💡 EXPECTED RESULTS:")
        print(f"   🎨 Pure white background (gradients removed)")
        print(f"   🏢 Enhanced HEART building with blue glow")
        print(f"   📏 Building 8% larger with enhanced contrast")
        print(f"\n🔧 Server running on port {port} - Press Ctrl+C to stop")
        print("=" * 60)
        
        server_started = True
        httpd.serve_forever()
        
    except OSError:
        print(f"   ❌ Port {port} busy")
        continue
    except KeyboardInterrupt:
        print(f"\n🛑 Server stopped by user")
        break
    except Exception as e:
        print(f"   ❌ Error on port {port}: {e}")
        continue

# If no server started
if not server_started:
    print("\n💥 CRITICAL: All ports busy!")
    print("\n🆘 BACKUP SOLUTION:")
    print("   1. Open Terminal and run:")
    print("      killall Python")
    print("      python3 LAUNCH_NOW.py")
    print("\n   2. Or open files directly:")
    
    # Open files directly as fallback
    try:
        webbrowser.open(f'file://{target_dir}/about.html')
        webbrowser.open(f'file://{target_dir}/QUICK_TEST.html')
        print("   ✅ Opened files directly in browser")
        print("   ⚠️ Note: Some features may be limited with file:// URLs")
        print("\n🎯 Nuclear mode will still work!")
        print("   💥 Auto-activates on About page")
        print("   🧪 Manual testing on Quick Test page")
    except Exception as e:
        print(f"   ❌ Backup solution failed: {e}")
    
    input("\nPress Enter to exit...")

print("\n✅ Launch session complete")