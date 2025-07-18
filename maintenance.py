#!/usr/bin/env python3
"""
HEART Website Maintenance Scripts
All-in-one maintenance utility for cache management
"""

import os
import sys
import json
import time
import shutil
import subprocess
from pathlib import Path
from datetime import datetime

class MaintenanceManager:
    def __init__(self, project_root='.'):
        self.project_root = Path(project_root)
        self.scripts = {
            'update-versions': self.project_root / 'update-versions.py',
            'backup-system': self.project_root / 'backup-system.py',
            'cache-server': self.project_root / 'cache-server.py',
            'test-cache': self.project_root / 'test-cache.py',
            'image-optimizer': self.project_root / 'image-optimizer.py'
        }
    
    def clear_browser_cache_instructions(self):
        """Display browser cache clearing instructions"""
        print("🧹 Browser Cache Clearing Instructions")
        print("=" * 40)
        print("Chrome/Edge:")
        print("  • Windows: Ctrl + Shift + Delete")
        print("  • Mac: Cmd + Shift + Delete")
        print("  • Or: F12 → Network → Disable cache")
        print()
        print("Firefox:")
        print("  • Windows: Ctrl + Shift + Delete")
        print("  • Mac: Cmd + Shift + Delete")
        print("  • Or: F12 → Network → Disable cache")
        print()
        print("Safari:")
        print("  • Mac: Cmd + Option + E")
        print("  • Or: Develop → Empty Caches")
        print()
        print("Force Refresh (any browser):")
        print("  • Windows: Ctrl + F5 or Ctrl + Shift + R")
        print("  • Mac: Cmd + Shift + R")
    
    def clear_server_cache(self):
        """Clear server-side cache"""
        print("🧹 Clearing server cache...")
        
        # Clear any cached files
        cache_dirs = [
            self.project_root / 'assets' / 'optimized',
            self.project_root / 'cdn',
            self.project_root / '__pycache__'
        ]
        
        for cache_dir in cache_dirs:
            if cache_dir.exists():
                shutil.rmtree(cache_dir)
                print(f"  ✅ Cleared: {cache_dir}")
        
        # Clear Python cache files
        for cache_file in self.project_root.rglob('*.pyc'):
            cache_file.unlink()
        
        for cache_file in self.project_root.rglob('__pycache__'):
            if cache_file.is_dir():
                shutil.rmtree(cache_file)
        
        print("✅ Server cache cleared")
    
    def update_all_versions(self):
        """Update all image versions"""
        print("🔄 Updating all image versions...")
        
        if self.scripts['update-versions'].exists():
            result = subprocess.run([sys.executable, str(self.scripts['update-versions']), 'update'], 
                                  capture_output=True, text=True)
            
            if result.returncode == 0:
                print("✅ Versions updated successfully")
                print(result.stdout)
            else:
                print("❌ Version update failed")
                print(result.stderr)
        else:
            print("❌ update-versions.py not found")
    
    def create_backup(self):
        """Create system backup"""
        print("📦 Creating system backup...")
        
        if self.scripts['backup-system'].exists():
            backup_name = f"maintenance_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            result = subprocess.run([sys.executable, str(self.scripts['backup-system']), 'create', backup_name], 
                                  capture_output=True, text=True)
            
            if result.returncode == 0:
                print("✅ Backup created successfully")
                print(result.stdout)
            else:
                print("❌ Backup creation failed")
                print(result.stderr)
        else:
            print("❌ backup-system.py not found")
    
    def optimize_images(self):
        """Optimize all images"""
        print("🖼️ Optimizing images...")
        
        if self.scripts['image-optimizer'].exists():
            result = subprocess.run([sys.executable, str(self.scripts['image-optimizer'])], 
                                  capture_output=True, text=True)
            
            if result.returncode == 0:
                print("✅ Images optimized successfully")
                print(result.stdout)
            else:
                print("❌ Image optimization failed")
                print(result.stderr)
        else:
            print("❌ image-optimizer.py not found")
    
    def run_cache_tests(self):
        """Run cache validation tests"""
        print("🧪 Running cache tests...")
        
        if self.scripts['test-cache'].exists():
            result = subprocess.run([sys.executable, str(self.scripts['test-cache'])], 
                                  capture_output=True, text=True)
            
            if result.returncode == 0:
                print("✅ Cache tests passed")
                print(result.stdout)
            else:
                print("❌ Cache tests failed")
                print(result.stderr)
        else:
            print("❌ test-cache.py not found")
    
    def start_optimized_server(self, port=3000):
        """Start cache-optimized server"""
        print(f"🚀 Starting cache-optimized server on port {port}...")
        
        if self.scripts['cache-server'].exists():
            print("Server will run in foreground. Press Ctrl+C to stop.")
            subprocess.run([sys.executable, str(self.scripts['cache-server']), str(port)])
        else:
            print("❌ cache-server.py not found")
    
    def health_check(self):
        """Perform system health check"""
        print("🏥 HEART Website Health Check")
        print("=" * 40)
        
        checks = []
        
        # Check if all scripts exist
        for script_name, script_path in self.scripts.items():
            exists = script_path.exists()
            checks.append({
                'name': f"Script: {script_name}",
                'status': 'OK' if exists else 'MISSING',
                'path': str(script_path)
            })
        
        # Check version file
        version_file = self.project_root / 'image-version.json'
        version_exists = version_file.exists()
        checks.append({
            'name': 'Version file',
            'status': 'OK' if version_exists else 'MISSING',
            'path': str(version_file)
        })
        
        # Check images directory
        images_dir = self.project_root / 'assets' / 'images'
        images_exist = images_dir.exists()
        if images_exist:
            map_images = list(images_dir.glob('hue-location-map-*.jpg'))
            checks.append({
                'name': 'Map images',
                'status': f'OK ({len(map_images)} found)',
                'path': str(images_dir)
            })
        else:
            checks.append({
                'name': 'Images directory',
                'status': 'MISSING',
                'path': str(images_dir)
            })
        
        # Check cache buster
        cache_buster = self.project_root / 'js' / 'cache-buster.js'
        cache_buster_exists = cache_buster.exists()
        checks.append({
            'name': 'Cache buster script',
            'status': 'OK' if cache_buster_exists else 'MISSING',
            'path': str(cache_buster)
        })
        
        # Print results
        for check in checks:
            status_icon = "✅" if check['status'].startswith('OK') else "❌"
            print(f"{status_icon} {check['name']}: {check['status']}")
        
        # Summary
        ok_count = sum(1 for check in checks if check['status'].startswith('OK'))
        total_count = len(checks)
        
        print(f"\n📊 Health Check Summary: {ok_count}/{total_count} checks passed")
        
        if ok_count == total_count:
            print("🎉 All systems operational!")
        else:
            print("⚠️ Some issues detected. Please review the above.")
    
    def full_maintenance(self):
        """Run complete maintenance routine"""
        print("🔧 Running Full Maintenance Routine")
        print("=" * 50)
        
        # Step 1: Health check
        self.health_check()
        print()
        
        # Step 2: Create backup
        self.create_backup()
        print()
        
        # Step 3: Clear caches
        self.clear_server_cache()
        print()
        
        # Step 4: Update versions
        self.update_all_versions()
        print()
        
        # Step 5: Optimize images
        self.optimize_images()
        print()
        
        # Step 6: Run tests
        self.run_cache_tests()
        print()
        
        print("✅ Full maintenance completed!")
        print("🌐 You can now start the optimized server with:")
        print(f"    python3 {self.scripts['cache-server']} [port]")
    
    def show_usage(self):
        """Show usage information"""
        print("🔧 HEART Website Maintenance Manager")
        print("=" * 40)
        print("Usage: python3 maintenance.py [command]")
        print()
        print("Commands:")
        print("  health          - Run health check")
        print("  clear-cache     - Clear server cache")
        print("  update-versions - Update image versions")
        print("  backup          - Create system backup")
        print("  optimize        - Optimize images")
        print("  test            - Run cache tests")
        print("  server [port]   - Start optimized server")
        print("  full            - Run complete maintenance")
        print("  browser-cache   - Show browser cache clearing instructions")
        print("  help            - Show this help message")

def main():
    """Main maintenance function"""
    manager = MaintenanceManager()
    
    if len(sys.argv) < 2:
        manager.show_usage()
        return
    
    command = sys.argv[1]
    
    if command == "health":
        manager.health_check()
    elif command == "clear-cache":
        manager.clear_server_cache()
    elif command == "update-versions":
        manager.update_all_versions()
    elif command == "backup":
        manager.create_backup()
    elif command == "optimize":
        manager.optimize_images()
    elif command == "test":
        manager.run_cache_tests()
    elif command == "server":
        port = int(sys.argv[2]) if len(sys.argv) > 2 else 3000
        manager.start_optimized_server(port)
    elif command == "full":
        manager.full_maintenance()
    elif command == "browser-cache":
        manager.clear_browser_cache_instructions()
    elif command == "help":
        manager.show_usage()
    else:
        print(f"Unknown command: {command}")
        manager.show_usage()

if __name__ == "__main__":
    main()