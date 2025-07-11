#!/usr/bin/env python3
"""
HEART Technology Park - ULTIMATE FIX
Final solution for website access issues
"""

import os
import sys
import time
import webbrowser
import subprocess
import threading
from pathlib import Path

def print_header():
    print("🔥" * 60)
    print("🔥 HEART TECHNOLOGY PARK - ULTIMATE ACCESS FIX")
    print("🔥 Solving all website connection issues")
    print("🔥" * 60)
    print()

def fix_step_1_directory():
    """Step 1: Ensure correct directory"""
    target = '/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18'
    print("1️⃣ DIRECTORY FIX:")
    print(f"   📂 Target: {target}")
    
    if os.path.exists(target):
        os.chdir(target)
        print(f"   ✅ Success: {os.getcwd()}")
        return True
    else:
        print(f"   ❌ Directory not found!")
        return False

def fix_step_2_files():
    """Step 2: Verify files exist"""
    print("\n2️⃣ FILES CHECK:")
    
    files = ['about.html', 'index.html']
    all_exist = True
    
    for file in files:
        if os.path.exists(file):
            size = os.path.getsize(file)
            print(f"   ✅ {file} ({size:,} bytes)")
        else:
            print(f"   ❌ {file} missing")
            all_exist = False
    
    return all_exist

def fix_step_3_ports():
    """Step 3: Clean up ports"""
    print("\n3️⃣ PORT CLEANUP:")
    
    ports = [8000, 3000, 8080, 5000]
    
    for port in ports:
        try:
            # Find and kill processes on port
            result = subprocess.run(['lsof', '-ti', f':{port}'], 
                                  capture_output=True, text=True, timeout=3)
            
            if result.stdout.strip():
                pids = result.stdout.strip().split('\n')
                for pid in pids:
                    subprocess.run(['kill', '-9', pid], timeout=2)
                print(f"   🔪 Killed processes on port {port}")
            else:
                print(f"   ✅ Port {port} free")
                
        except Exception:
            print(f"   ⚠️  Port {port} check failed")

def fix_step_4_server():
    """Step 4: Start server"""
    print("\n4️⃣ SERVER START:")
    
    ports = [8000, 3000, 8080, 5000, 9000]
    
    for port in ports:
        try:
            print(f"   🔄 Trying port {port}...")
            
            # Start server using subprocess
            cmd = [sys.executable, '-m', 'http.server', str(port)]
            process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            
            # Wait and test
            time.sleep(2)
            
            if process.poll() is None:  # Still running
                print(f"   ✅ SERVER STARTED on port {port}!")
                print(f"   📍 URL: http://localhost:{port}")
                return port, process
            else:
                print(f"   ❌ Port {port} failed")
                
        except Exception as e:
            print(f"   ❌ Error on port {port}: {e}")
            continue
    
    return None, None

def fix_step_5_browser(port):
    """Step 5: Open browser"""
    print(f"\n5️⃣ BROWSER LAUNCH:")
    
    urls = [
        f'http://localhost:{port}/about.html',
        f'http://localhost:{port}/NUCLEAR_TEST.html'
    ]
    
    time.sleep(1)  # Let server stabilize
    
    for url in urls:
        try:
            webbrowser.open(url)
            print(f"   ✅ Opened: {url}")
            time.sleep(1)
        except Exception as e:
            print(f"   ❌ Failed: {url} - {e}")

def fix_step_6_fallback():
    """Step 6: Fallback direct file access"""
    print(f"\n6️⃣ FALLBACK - DIRECT FILE ACCESS:")
    
    files = ['about.html', 'NUCLEAR_TEST.html']
    
    for file in files:
        if os.path.exists(file):
            file_path = os.path.abspath(file)
            file_url = f'file://{file_path}'
            
            try:
                webbrowser.open(file_url)
                print(f"   ✅ Opened: {file}")
                time.sleep(1)
            except Exception as e:
                print(f"   ❌ Failed: {file} - {e}")

def main():
    """Main ultimate fix"""
    print_header()
    
    # Step 1: Fix directory
    if not fix_step_1_directory():
        print("\n💥 CRITICAL: Cannot access project directory!")
        print("🔧 Manual fix: Check if directory exists")
        input("Press Enter to exit...")
        return
    
    # Step 2: Check files
    if not fix_step_2_files():
        print("\n💥 CRITICAL: Required files missing!")
        print("🔧 Manual fix: Ensure about.html exists")
        input("Press Enter to exit...")
        return
    
    # Step 3: Clean ports
    fix_step_3_ports()
    
    # Step 4: Start server
    port, process = fix_step_4_server()
    
    if port and process:
        # Server success
        print("\n🎉" * 30)
        print("🎉 ULTIMATE SUCCESS! SERVER RUNNING!")
        print("🎉" * 30)
        print(f"\n📍 ACCESS URLs:")
        print(f"   🏠 Home:        http://localhost:{port}/")
        print(f"   💥 About:       http://localhost:{port}/about.html")
        print(f"   🧪 Nuclear:     http://localhost:{port}/NUCLEAR_TEST.html")
        
        print(f"\n💥 NUCLEAR GRADIENT REMOVAL:")
        print(f"   ✅ Auto-activates on About page after 1 second")
        print(f"   ✅ Manual controls on Nuclear test page")
        print(f"   ✅ Pure white background with enhanced building")
        
        print(f"\n🔧 CONSOLE COMMANDS:")
        print(f"   window.nuclearGradientRemoval()")
        print(f"   window.toggleNuclearMode()")
        print(f"   window.debugBuilding()")
        
        # Open browser
        fix_step_5_browser(port)
        
        print(f"\n🔧 Server running on port {port} - Press Ctrl+C to stop")
        print("=" * 60)
        
        try:
            process.wait()
        except KeyboardInterrupt:
            print(f"\n🛑 Server stopped by user")
            process.terminate()
    
    else:
        # Server failed - use fallback
        print(f"\n⚠️  SERVER FAILED - USING DIRECT ACCESS")
        fix_step_6_fallback()
        
        print(f"\n💥 NUCLEAR MODE STILL WORKS!")
        print(f"   ✅ Files opened directly in browser")
        print(f"   ✅ Nuclear gradient removal available")
        print(f"   ⚠️  Limited functionality with file:// URLs")
    
    print(f"\n✅ Ultimate fix complete!")
    input("Press Enter to exit...")

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n✅ Interrupted by user")
    except Exception as e:
        print(f"\n❌ Fatal error: {e}")
        input("Press Enter to exit...")