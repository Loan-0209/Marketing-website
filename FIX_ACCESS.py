#!/usr/bin/env python3
"""
HEART Technology Park - FIX ACCESS ISSUES
Comprehensive solution for website access problems
"""

import os
import sys
import time
import webbrowser
import subprocess
import socket
from pathlib import Path

def print_header():
    print("🔧" * 50)
    print("🔧 HEART TECHNOLOGY PARK - ACCESS FIX")
    print("🔧 Solving website access issues")
    print("🔧" * 50)

def check_directory():
    """Check and navigate to project directory"""
    target_dir = '/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18'
    print(f"\n1️⃣ DIRECTORY CHECK:")
    print(f"   📂 Target: {target_dir}")
    
    if os.path.exists(target_dir):
        os.chdir(target_dir)
        print(f"   ✅ Changed to: {os.getcwd()}")
        return True
    else:
        print(f"   ❌ Directory not found!")
        return False

def check_files():
    """Check if required files exist"""
    print(f"\n2️⃣ FILES CHECK:")
    files = ['about.html', 'index.html']
    
    for file in files:
        if os.path.exists(file):
            size = os.path.getsize(file)
            print(f"   ✅ {file} ({size} bytes)")
        else:
            print(f"   ❌ {file} missing")
    
    return os.path.exists('about.html')

def kill_existing_servers():
    """Kill any existing servers on common ports"""
    print(f"\n3️⃣ CLEANUP EXISTING SERVERS:")
    ports = [8000, 3000, 8080, 5000]
    
    for port in ports:
        try:
            result = subprocess.run(['lsof', '-ti', f':{port}'], 
                                  capture_output=True, text=True, timeout=5)
            if result.stdout.strip():
                pids = result.stdout.strip().split('\n')
                for pid in pids:
                    subprocess.run(['kill', '-9', pid], timeout=2)
                print(f"   🔪 Killed processes on port {port}")
            else:
                print(f"   ✅ Port {port} free")
        except:
            print(f"   ⚠️  Port {port} check failed")

def test_port_available(port):
    """Test if port is available"""
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.bind(('localhost', port))
        sock.close()
        return True
    except:
        return False

def start_simple_server():
    """Start the simplest possible HTTP server"""
    print(f"\n4️⃣ STARTING SERVER:")
    
    ports_to_try = [8000, 3000, 8080, 5000, 9000]
    
    for port in ports_to_try:
        if test_port_available(port):
            print(f"   🔄 Starting server on port {port}...")
            
            try:
                # Use subprocess to start server in background
                server_process = subprocess.Popen([
                    sys.executable, '-m', 'http.server', str(port)
                ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                
                # Wait a moment for server to start
                time.sleep(2)
                
                # Check if server is running
                if server_process.poll() is None:
                    print(f"   ✅ Server started on port {port}")
                    return port, server_process
                else:
                    print(f"   ❌ Server failed on port {port}")
                    
            except Exception as e:
                print(f"   ❌ Error on port {port}: {e}")
                continue
    
    return None, None

def open_browser_direct():
    """Open files directly in browser as backup"""
    print(f"\n5️⃣ OPENING BROWSER (DIRECT FILES):")
    
    current_dir = os.getcwd()
    files = ['about.html', 'QUICK_TEST.html']
    
    for file in files:
        file_path = os.path.join(current_dir, file)
        if os.path.exists(file_path):
            file_url = f'file://{file_path}'
            webbrowser.open(file_url)
            print(f"   ✅ Opened: {file}")
            time.sleep(1)
        else:
            print(f"   ❌ File not found: {file}")

def open_browser_server(port):
    """Open browser with server URLs"""
    print(f"\n🌐 OPENING BROWSER (SERVER URLs):")
    
    time.sleep(1)  # Let server stabilize
    
    urls = [
        f'http://localhost:{port}/about.html',
        f'http://localhost:{port}/QUICK_TEST.html'
    ]
    
    for url in urls:
        try:
            webbrowser.open(url)
            print(f"   ✅ Opened: {url}")
            time.sleep(1)
        except Exception as e:
            print(f"   ❌ Failed to open: {url}")

def create_quick_test_if_missing():
    """Create QUICK_TEST.html if it doesn't exist"""
    if not os.path.exists('QUICK_TEST.html'):
        print(f"\n📝 Creating QUICK_TEST.html...")
        
        content = '''<!DOCTYPE html>
<html>
<head>
    <title>HEART - Nuclear Test</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #ff6b6b, #4ecdc4, #45b7d1);
            min-height: 100vh;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.9);
            padding: 30px;
            border-radius: 20px;
        }
        .btn {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 15px 30px;
            margin: 10px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
        }
        .nuclear-btn {
            background: linear-gradient(135deg, #ff6b6b, #ee5a24);
            font-size: 18px;
            padding: 20px 40px;
        }
        .building-demo {
            width: 200px;
            height: 150px;
            background: linear-gradient(135deg, #4338ca, #7c3aed);
            margin: 20px auto;
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
        }
        .status {
            padding: 15px;
            margin: 10px 0;
            border-radius: 10px;
            font-weight: bold;
            text-align: center;
            background: #d1ecf1;
            color: #0c5460;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 HEART Technology Park</h1>
        <h2>Nuclear Gradient Removal - Quick Test</h2>
        
        <div class="status" id="status">
            ✅ Ready to test Nuclear Mode!
        </div>
        
        <div>
            <h3>💥 Nuclear Gradient Removal Test</h3>
            <button class="btn nuclear-btn" onclick="applyNuclear()">
                🔥 Apply Nuclear Mode
            </button>
            <button class="btn" onclick="resetNormal()">
                🔄 Reset Normal Mode
            </button>
            
            <div class="building-demo" id="building">
                🏢 HEART Building
            </div>
        </div>
        
        <div>
            <h3>🌐 Navigate:</h3>
            <button class="btn" onclick="location.href='about.html'">💥 About Page</button>
            <button class="btn" onclick="location.href='index.html'">🏠 Home Page</button>
        </div>
        
        <div id="results" class="status">Waiting for tests...</div>
    </div>

    <script>
        function applyNuclear() {
            console.log('💥 NUCLEAR GRADIENT REMOVAL');
            
            const style = document.createElement('style');
            style.id = 'nuclear-style';
            style.innerHTML = `
                *, *::before, *::after { 
                    background: #ffffff !important; 
                    background-image: none !important; 
                }
                body { background: #ffffff !important; }
                .building-demo, .heart-building {
                    background: linear-gradient(135deg, #4338ca, #7c3aed) !important;
                    filter: contrast(1.2) brightness(1.15) !important;
                    transform: scale(1.08) !important;
                    box-shadow: 0 15px 45px rgba(0,0,0,0.3), 0 0 30px rgba(67, 56, 202, 0.4) !important;
                }
                .container { background: rgba(255, 255, 255, 0.95) !important; }
                .btn { background: linear-gradient(135deg, #667eea, #764ba2) !important; }
                .nuclear-btn { background: linear-gradient(135deg, #ff6b6b, #ee5a24) !important; }
            `;
            document.head.appendChild(style);
            
            document.getElementById('results').textContent = '💥 Nuclear mode applied! Pure white background.';
            console.log('✅ Nuclear mode activated');
        }
        
        function resetNormal() {
            const style = document.getElementById('nuclear-style');
            if (style) style.remove();
            document.getElementById('results').textContent = '🔄 Normal mode restored.';
            console.log('🔄 Normal mode restored');
        }
        
        // Global functions
        window.nuclearGradientRemoval = applyNuclear;
        window.toggleNuclearMode = () => {
            const exists = document.getElementById('nuclear-style');
            if (exists) resetNormal(); else applyNuclear();
        };
        window.debugBuilding = () => {
            console.log('🔧 Nuclear active:', !!document.getElementById('nuclear-style'));
        };
        
        document.getElementById('status').textContent = '✅ Nuclear test ready! All functions loaded.';
        console.log('🎯 HEART Nuclear Test Ready!');
        console.log('Commands: window.nuclearGradientRemoval(), window.toggleNuclearMode()');
    </script>
</body>
</html>'''
        
        with open('QUICK_TEST.html', 'w') as f:
            f.write(content)
        
        print(f"   ✅ Created QUICK_TEST.html")

def main():
    """Main fix function"""
    print_header()
    
    # Step 1: Check directory
    if not check_directory():
        print("\n💥 CRITICAL: Cannot access project directory!")
        input("Press Enter to exit...")
        return
    
    # Step 2: Check files
    if not check_files():
        print("\n💥 CRITICAL: Required files missing!")
        input("Press Enter to exit...")
        return
    
    # Step 3: Create test file if missing
    create_quick_test_if_missing()
    
    # Step 4: Clean up existing servers
    kill_existing_servers()
    
    # Step 5: Try to start server
    port, server_process = start_simple_server()
    
    if port:
        # Server started successfully
        print(f"\n🎉 SUCCESS! Server running on port {port}")
        print(f"📍 URLs:")
        print(f"   🏠 Home: http://localhost:{port}/")
        print(f"   💥 About: http://localhost:{port}/about.html")
        print(f"   🧪 Test: http://localhost:{port}/QUICK_TEST.html")
        
        # Open browser with server URLs
        open_browser_server(port)
        
        print(f"\n💥 NUCLEAR GRADIENT REMOVAL READY!")
        print(f"   ✅ Auto-activates on About page after 1 second")
        print(f"   ✅ Manual controls on Quick Test page")
        print(f"   ✅ Console commands: window.nuclearGradientRemoval()")
        
        print(f"\n🔧 Server running - Press Ctrl+C to stop")
        try:
            server_process.wait()
        except KeyboardInterrupt:
            print(f"\n🛑 Server stopped")
            server_process.terminate()
    
    else:
        # Server failed - use direct file access
        print(f"\n⚠️  Server failed - using direct file access")
        open_browser_direct()
        
        print(f"\n💥 NUCLEAR MODE STILL WORKS!")
        print(f"   ✅ Files opened directly in browser")
        print(f"   ✅ Nuclear gradient removal available")
        print(f"   ⚠️  Some features may be limited with file:// URLs")
    
    print(f"\n✅ Access fix complete!")
    input("Press Enter to exit...")

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n✅ Interrupted by user")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        input("Press Enter to exit...")