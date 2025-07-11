#!/usr/bin/env python3
"""
HEART Technology Park - DEBUG CHECK
Systematic debugging to identify why server won't start
"""

import os
import sys
import subprocess
import platform

def print_debug_header():
    print("🔧" * 50)
    print("🔧 HEART TECHNOLOGY PARK - DEBUG CHECK")
    print("🔧 Investigating why server won't start")
    print("🔧" * 50)
    print()

def check_1_environment():
    """Check basic environment"""
    print("1️⃣ ENVIRONMENT CHECK:")
    print(f"   🐍 Python Version: {sys.version}")
    print(f"   💻 Platform: {platform.system()} {platform.release()}")
    print(f"   📁 Current Directory: {os.getcwd()}")
    print(f"   👤 User: {os.getenv('USER', 'unknown')}")
    print()

def check_2_directory():
    """Check project directory"""
    target_dir = '/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18'
    print("2️⃣ DIRECTORY CHECK:")
    print(f"   📂 Target Directory: {target_dir}")
    
    if os.path.exists(target_dir):
        print("   ✅ Directory EXISTS")
        try:
            os.chdir(target_dir)
            print(f"   ✅ Changed to: {os.getcwd()}")
        except Exception as e:
            print(f"   ❌ Cannot change directory: {e}")
            return False
    else:
        print("   ❌ Directory DOES NOT EXIST")
        return False
    
    print()
    return True

def check_3_files():
    """Check project files"""
    print("3️⃣ FILES CHECK:")
    
    required_files = [
        'about.html',
        'index.html',
        'simple_start.py',
        'EMERGENCY_START.command',
        'QUICK_TEST.html'
    ]
    
    existing_files = []
    missing_files = []
    
    for file in required_files:
        if os.path.exists(file):
            existing_files.append(file)
            size = os.path.getsize(file)
            print(f"   ✅ {file} ({size} bytes)")
        else:
            missing_files.append(file)
            print(f"   ❌ {file} - MISSING")
    
    print(f"   📊 Files found: {len(existing_files)}/{len(required_files)}")
    print()
    return len(existing_files) > 0

def check_4_permissions():
    """Check file permissions"""
    print("4️⃣ PERMISSIONS CHECK:")
    
    files_to_check = ['simple_start.py', 'EMERGENCY_START.command']
    
    for file in files_to_check:
        if os.path.exists(file):
            stat = os.stat(file)
            perms = oct(stat.st_mode)[-3:]
            print(f"   📋 {file}: {perms}")
            
            if os.access(file, os.R_OK):
                print(f"   ✅ {file}: Readable")
            else:
                print(f"   ❌ {file}: Not readable")
                
            if os.access(file, os.X_OK):
                print(f"   ✅ {file}: Executable")
            else:
                print(f"   ❌ {file}: Not executable")
        else:
            print(f"   ❌ {file}: File not found")
    
    print()

def check_5_python():
    """Check Python functionality"""
    print("5️⃣ PYTHON CHECK:")
    
    try:
        import http.server
        print("   ✅ http.server module available")
    except ImportError as e:
        print(f"   ❌ http.server import failed: {e}")
        return False
    
    try:
        import socketserver
        print("   ✅ socketserver module available")
    except ImportError as e:
        print(f"   ❌ socketserver import failed: {e}")
        return False
    
    try:
        import webbrowser
        print("   ✅ webbrowser module available")
    except ImportError as e:
        print(f"   ❌ webbrowser import failed: {e}")
    
    print()
    return True

def check_6_ports():
    """Check port availability"""
    print("6️⃣ PORT CHECK:")
    
    import socket
    
    ports_to_test = [8000, 3000, 8080, 5000]
    
    for port in ports_to_test:
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            result = sock.bind(('localhost', port))
            sock.close()
            print(f"   ✅ Port {port}: Available")
        except OSError:
            print(f"   ❌ Port {port}: In use")
    
    print()

def check_7_network():
    """Check network connectivity"""
    print("7️⃣ NETWORK CHECK:")
    
    try:
        import socket
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(3)
        result = sock.connect_ex(('localhost', 80))
        sock.close()
        
        if result == 0:
            print("   ✅ localhost connectivity: Working")
        else:
            print("   ⚠️ localhost connectivity: May have issues")
    except Exception as e:
        print(f"   ❌ Network test failed: {e}")
    
    print()

def generate_fix_script():
    """Generate a simple fix script"""
    print("8️⃣ GENERATING FIX SCRIPT:")
    
    fix_script = '''#!/usr/bin/env python3
import os
import http.server
import socketserver
import webbrowser
import time
import threading

def open_browser():
    time.sleep(3)
    webbrowser.open('http://localhost:8000/QUICK_TEST.html')

# Change to correct directory
os.chdir('/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18')

print("🚀 HEART Technology Park - EMERGENCY FIX")
print("📁 Directory:", os.getcwd())
print("📍 Server: http://localhost:8000")

# Start browser opening
threading.Thread(target=open_browser, daemon=True).start()

# Start server
Handler = http.server.SimpleHTTPRequestHandler
with socketserver.TCPServer(("", 8000), Handler) as httpd:
    print("✅ Server started! Opening browser...")
    print("🔧 Press Ctrl+C to stop")
    httpd.serve_forever()
'''
    
    with open('EMERGENCY_FIX.py', 'w') as f:
        f.write(fix_script)
    
    print("   ✅ Created EMERGENCY_FIX.py")
    print("   🔧 Run with: python3 EMERGENCY_FIX.py")
    print()

def main():
    """Main debug function"""
    print_debug_header()
    
    check_1_environment()
    
    if not check_2_directory():
        print("💥 CRITICAL: Cannot access project directory!")
        return
    
    if not check_3_files():
        print("💥 CRITICAL: No project files found!")
        return
    
    check_4_permissions()
    
    if not check_5_python():
        print("💥 CRITICAL: Python modules not available!")
        return
    
    check_6_ports()
    check_7_network()
    generate_fix_script()
    
    print("🎯" * 50)
    print("🎯 DEBUG COMPLETE")
    print("🎯" * 50)
    print()
    print("🔧 NEXT STEPS:")
    print("   1. Run: python3 EMERGENCY_FIX.py")
    print("   2. If that fails, check firewall settings")
    print("   3. Try different port: python3 -m http.server 3000")
    print()
    print("💥 Nuclear gradient removal will work once server starts!")

if __name__ == '__main__':
    main()