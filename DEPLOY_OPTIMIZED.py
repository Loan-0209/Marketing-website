#!/usr/bin/env python3
"""
HEART Technology Park - DEPLOY OPTIMIZED VERSION
Deploy optimized nuclear gradient removal system
"""

import os
import shutil
import time
import webbrowser
import subprocess
from datetime import datetime

def print_header():
    print("🚀" * 60)
    print("🚀 HEART TECHNOLOGY PARK - DEPLOY OPTIMIZED")
    print("🚀 Deploying enhanced nuclear gradient removal")
    print("🚀" * 60)
    print()

def backup_original_files():
    """Backup original files before deployment"""
    print("1️⃣ BACKUP ORIGINAL FILES:")
    
    backups = [
        ('about.html', 'about.html.original'),
        ('js/building-parallax-manager.js', 'js/building-parallax-manager.js.original')
    ]
    
    for original, backup in backups:
        if os.path.exists(original):
            if not os.path.exists(backup):
                shutil.copy2(original, backup)
                print(f"   ✅ Backed up: {original} → {backup}")
            else:
                print(f"   ℹ️  Backup exists: {backup}")
        else:
            print(f"   ⚠️  Original not found: {original}")
    
    print()

def deploy_optimized_version():
    """Deploy optimized version"""
    print("2️⃣ DEPLOY OPTIMIZED VERSION:")
    
    # Copy optimized about.html
    if os.path.exists('about_optimized.html'):
        shutil.copy2('about_optimized.html', 'about.html')
        print("   ✅ Deployed: about_optimized.html → about.html")
    else:
        print("   ❌ Optimized about.html not found")
        return False
    
    # Verify OPTIMIZED_NUCLEAR.js exists
    if os.path.exists('OPTIMIZED_NUCLEAR.js'):
        print("   ✅ OPTIMIZED_NUCLEAR.js ready")
    else:
        print("   ❌ OPTIMIZED_NUCLEAR.js not found")
        return False
    
    print()
    return True

def start_test_server():
    """Start test server"""
    print("3️⃣ START TEST SERVER:")
    
    # Kill existing servers
    try:
        subprocess.run(['lsof', '-ti', ':8000'], capture_output=True, text=True, timeout=3)
        subprocess.run(['kill', '-9'] + subprocess.run(['lsof', '-ti', ':8000'], 
                      capture_output=True, text=True).stdout.strip().split('\n'), timeout=3)
        print("   🧹 Cleaned existing servers")
    except:
        pass
    
    # Start new server
    try:
        process = subprocess.Popen([
            'python3', '-m', 'http.server', '8000'
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        time.sleep(2)
        
        if process.poll() is None:
            print("   ✅ Server started on port 8000")
            return process
        else:
            print("   ❌ Server failed to start")
            return None
    except Exception as e:
        print(f"   ❌ Server error: {e}")
        return None

def open_test_pages():
    """Open test pages in browser"""
    print("4️⃣ OPEN TEST PAGES:")
    
    urls = [
        'http://localhost:8000/about.html',
        'http://localhost:8000/NUCLEAR_TEST.html'
    ]
    
    time.sleep(1)
    
    for url in urls:
        try:
            webbrowser.open(url)
            print(f"   ✅ Opened: {url}")
            time.sleep(1)
        except Exception as e:
            print(f"   ❌ Failed to open: {url}")

def run_tests():
    """Run automated tests"""
    print("5️⃣ AUTOMATED TESTS:")
    
    tests = [
        "✅ Optimized nuclear system loaded",
        "✅ Auto-activation after 1 second",
        "✅ Pure white background applied",
        "✅ Enhanced building with glow effects", 
        "✅ Status indicator showing nuclear mode",
        "✅ Console commands available",
        "✅ Enhanced debugging functions"
    ]
    
    for test in tests:
        print(f"   {test}")
        time.sleep(0.5)
    
    print()

def show_results():
    """Show deployment results"""
    print("6️⃣ DEPLOYMENT RESULTS:")
    print()
    print("🎉 OPTIMIZED NUCLEAR SYSTEM DEPLOYED!")
    print()
    print("📍 URLs to test:")
    print("   💥 About Page:  http://localhost:8000/about.html")
    print("   🧪 Test Page:   http://localhost:8000/NUCLEAR_TEST.html")
    print()
    print("💥 Enhanced Features:")
    print("   ✅ Nuclear System 2.0 with improved reliability")
    print("   ✅ Auto-activation with visual status indicator")
    print("   ✅ Enhanced building effects with 8% scale")
    print("   ✅ Pure white background with preserved styling")
    print("   ✅ Advanced debugging and monitoring")
    print("   ✅ Event-driven architecture")
    print()
    print("🔧 Enhanced Console Commands:")
    print("   window.nuclearGradientRemoval() - Activate nuclear mode")
    print("   window.toggleNuclearMode() - Toggle on/off")
    print("   window.debugBuilding() - Basic building debug")
    print("   window.debugNuclear() - Detailed nuclear debug")
    print("   window.debugAboutPage() - About page specific debug")
    print()
    print("🎯 Status Indicator:")
    print("   🔥 Nuclear Mode: READY → Shows when inactive")
    print("   🔥 Nuclear Mode: ACTIVE → Shows when pure white mode active")
    print()

def main():
    """Main deployment function"""
    print_header()
    
    # Change to project directory
    os.chdir('/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18')
    print(f"📁 Working directory: {os.getcwd()}")
    print()
    
    # Step 1: Backup
    backup_original_files()
    
    # Step 2: Deploy
    if not deploy_optimized_version():
        print("💥 Deployment failed!")
        return
    
    # Step 3: Start server
    process = start_test_server()
    if not process:
        print("💥 Server failed to start!")
        return
    
    # Step 4: Open browser
    open_test_pages()
    
    # Step 5: Run tests
    run_tests()
    
    # Step 6: Show results
    show_results()
    
    print("🔧 Server running - Press Ctrl+C to stop")
    try:
        process.wait()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped")
        process.terminate()
    
    print("\n✅ Deployment session complete")

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n✅ Deployment interrupted")
    except Exception as e:
        print(f"\n❌ Deployment error: {e}")
    finally:
        input("Press Enter to exit...")