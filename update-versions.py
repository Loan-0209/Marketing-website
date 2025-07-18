#!/usr/bin/env python3
"""
HEART Website Version Management System
Automatically updates version numbers when images change
"""

import os
import json
import hashlib
import time
from datetime import datetime
from pathlib import Path

class VersionManager:
    def __init__(self, project_root='.'):
        self.project_root = Path(project_root)
        self.version_file = self.project_root / 'image-version.json'
        self.images_dir = self.project_root / 'assets' / 'images'
        
    def load_version_data(self):
        """Load current version data or create default"""
        try:
            with open(self.version_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {
                "version": "1.0.0",
                "lastUpdate": datetime.now().isoformat(),
                "images": {}
            }
    
    def save_version_data(self, data):
        """Save version data to file"""
        data["lastUpdate"] = datetime.now().isoformat()
        with open(self.version_file, 'w') as f:
            json.dump(data, f, indent=2)
    
    def get_file_hash(self, filepath):
        """Calculate MD5 hash of file"""
        try:
            with open(filepath, 'rb') as f:
                return hashlib.md5(f.read()).hexdigest()
        except FileNotFoundError:
            return None
    
    def get_file_stats(self, filepath):
        """Get file size and modification time"""
        try:
            stat = os.stat(filepath)
            return {
                "size": stat.st_size,
                "modified": int(stat.st_mtime),
                "modified_readable": datetime.fromtimestamp(stat.st_mtime).isoformat()
            }
        except FileNotFoundError:
            return None
    
    def scan_map_images(self):
        """Scan for all hue-location-map images"""
        map_images = []
        if not self.images_dir.exists():
            return map_images
            
        for file in self.images_dir.glob('hue-location-map-*.jpg'):
            map_images.append(file.name)
        
        for file in self.images_dir.glob('hue-location-map-*.webp'):
            map_images.append(file.name)
            
        return sorted(map_images)
    
    def increment_version(self, version_str):
        """Increment version number (e.g., '1.0.0' -> '1.0.1')"""
        parts = version_str.split('.')
        if len(parts) != 3:
            return "1.0.1"
        
        try:
            major, minor, patch = map(int, parts)
            return f"{major}.{minor}.{patch + 1}"
        except ValueError:
            return "1.0.1"
    
    def update_versions(self):
        """Update version numbers for changed images"""
        version_data = self.load_version_data()
        current_images = self.scan_map_images()
        
        changes_detected = False
        
        for image_file in current_images:
            filepath = self.images_dir / image_file
            image_key = os.path.splitext(image_file)[0]  # Remove extension
            
            # Get current file stats
            current_hash = self.get_file_hash(filepath)
            current_stats = self.get_file_stats(filepath)
            
            if not current_hash or not current_stats:
                continue
            
            # Check if this is a new image or if it has changed
            if image_key not in version_data["images"]:
                # New image
                version_data["images"][image_key] = {
                    "version": "1.0.0",
                    "timestamp": str(current_stats["modified"]),
                    "size": str(current_stats["size"]),
                    "hash": current_hash,
                    "lastModified": current_stats["modified_readable"]
                }
                changes_detected = True
                print(f"📝 New image detected: {image_file}")
                
            else:
                # Check if image has changed
                old_hash = version_data["images"][image_key].get("hash")
                if old_hash != current_hash:
                    # Image has changed - increment version
                    old_version = version_data["images"][image_key]["version"]
                    new_version = self.increment_version(old_version)
                    
                    version_data["images"][image_key].update({
                        "version": new_version,
                        "timestamp": str(current_stats["modified"]),
                        "size": str(current_stats["size"]),
                        "hash": current_hash,
                        "lastModified": current_stats["modified_readable"]
                    })
                    changes_detected = True
                    print(f"🔄 Image updated: {image_file} (v{old_version} → v{new_version})")
        
        # Remove entries for deleted images
        existing_keys = list(version_data["images"].keys())
        current_keys = [os.path.splitext(img)[0] for img in current_images]
        
        for key in existing_keys:
            if key not in current_keys:
                del version_data["images"][key]
                changes_detected = True
                print(f"🗑️ Removed deleted image: {key}")
        
        if changes_detected:
            # Increment overall version
            version_data["version"] = self.increment_version(version_data["version"])
            self.save_version_data(version_data)
            print(f"✅ Version file updated to v{version_data['version']}")
            return True
        else:
            print("ℹ️ No changes detected")
            return False
    
    def get_version_for_image(self, image_name):
        """Get version string for specific image"""
        version_data = self.load_version_data()
        image_key = os.path.splitext(image_name)[0]
        
        if image_key in version_data["images"]:
            return version_data["images"][image_key]["timestamp"]
        else:
            return str(int(time.time()))
    
    def print_current_versions(self):
        """Print current version information"""
        version_data = self.load_version_data()
        
        print(f"📋 HEART Website Version Information")
        print(f"=" * 50)
        print(f"Overall Version: {version_data['version']}")
        print(f"Last Update: {version_data['lastUpdate']}")
        print(f"Total Images: {len(version_data['images'])}")
        print()
        
        for image_key, info in version_data["images"].items():
            print(f"🖼️ {image_key}")
            print(f"   Version: {info['version']}")
            print(f"   Size: {info['size']} bytes")
            print(f"   Modified: {info['lastModified']}")
            print()

def main():
    """Main function"""
    import sys
    
    vm = VersionManager()
    
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        if command == "update":
            vm.update_versions()
        elif command == "show":
            vm.print_current_versions()
        elif command == "version":
            if len(sys.argv) > 2:
                image_name = sys.argv[2]
                version = vm.get_version_for_image(image_name)
                print(f"Version for {image_name}: {version}")
            else:
                print("Usage: python update-versions.py version <image_name>")
        else:
            print("Usage: python update-versions.py [update|show|version]")
    else:
        # Default: update versions
        vm.update_versions()

if __name__ == "__main__":
    main()