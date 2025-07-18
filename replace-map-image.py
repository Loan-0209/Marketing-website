#!/usr/bin/env python3
"""
Safe Map Image Replacement Script
Performs atomic replacement with backup and validation
"""

import os
import shutil
import time
from pathlib import Path
from PIL import Image
from datetime import datetime

class SafeImageReplacer:
    def __init__(self, project_root='.'):
        self.project_root = Path(project_root)
        self.images_dir = self.project_root / 'assets' / 'images'
        self.timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    
    def find_current_maps(self):
        """Find all current map files in project"""
        print("🔍 Finding current map files...")
        
        current_maps = {
            'desktop': self.images_dir / 'hue-location-map-desktop.jpg',
            'mobile': self.images_dir / 'hue-location-map-mobile.jpg',
            'tablet': self.images_dir / 'hue-location-map-tablet.jpg',
            'high': self.images_dir / 'hue-location-map-high.jpg',
            'main': self.images_dir / 'hue-location-map.jpg'
        }
        
        existing_maps = {}
        for name, path in current_maps.items():
            if path.exists():
                try:
                    with Image.open(path) as img:
                        size_kb = path.stat().st_size / 1024
                        existing_maps[name] = {
                            'path': path,
                            'dimensions': f"{img.width}x{img.height}",
                            'size_kb': size_kb,
                            'format': img.format
                        }
                        print(f"  ✅ {name}: {img.width}x{img.height} ({size_kb:.1f}KB)")
                except Exception as e:
                    print(f"  ❌ {name}: Error reading - {e}")
        
        return existing_maps
    
    def find_new_image(self):
        """Find new image file to use as replacement"""
        print("🔍 Looking for new image file...")
        
        # Possible locations for new image
        possible_paths = [
            self.project_root / 'optimized-map.jpg',
            self.project_root / 'new-map.jpg',
            self.project_root / 'map-new.jpg',
            self.project_root / 'latest-map.jpg',
            self.images_dir / 'optimized-map.jpg',
            self.images_dir / 'new-map.jpg'
        ]
        
        for path in possible_paths:
            if path.exists():
                try:
                    with Image.open(path) as img:
                        size_kb = path.stat().st_size / 1024
                        print(f"  ✅ Found new image: {path.name}")
                        print(f"     Dimensions: {img.width}x{img.height}")
                        print(f"     Size: {size_kb:.1f}KB")
                        print(f"     Format: {img.format}")
                        return {
                            'path': path,
                            'dimensions': f"{img.width}x{img.height}",
                            'size_kb': size_kb,
                            'format': img.format
                        }
                except Exception as e:
                    print(f"  ❌ {path.name}: Error reading - {e}")
        
        print("  ⚠️ No new image file found. Looking for recent files...")
        
        # Check for recently modified images
        all_images = list(self.project_root.glob('*.jpg')) + list(self.project_root.glob('*.png'))
        if all_images:
            # Sort by modification time, newest first
            all_images.sort(key=lambda x: x.stat().st_mtime, reverse=True)
            print(f"  📋 Recent image files found:")
            for img in all_images[:5]:
                mod_time = datetime.fromtimestamp(img.stat().st_mtime)
                size_kb = img.stat().st_size / 1024
                print(f"     {img.name} - {size_kb:.1f}KB - Modified: {mod_time}")
        
        return None
    
    def create_backup(self, source_path):
        """Create backup of current file"""
        print(f"📦 Creating backup of {source_path.name}...")
        
        backup_dir = self.images_dir / 'replacement_backups'
        backup_dir.mkdir(exist_ok=True)
        
        backup_filename = f"{source_path.stem}_backup_{self.timestamp}{source_path.suffix}"
        backup_path = backup_dir / backup_filename
        
        try:
            shutil.copy2(source_path, backup_path)
            print(f"  ✅ Backup created: {backup_path}")
            return backup_path
        except Exception as e:
            print(f"  ❌ Backup failed: {e}")
            return None
    
    def validate_image(self, image_path):
        """Validate image file integrity"""
        try:
            with Image.open(image_path) as img:
                # Try to load the image data
                img.load()
                return True
        except Exception as e:
            print(f"❌ Image validation failed: {e}")
            return False
    
    def atomic_replace(self, source_path, target_path):
        """Perform atomic file replacement"""
        print(f"🔄 Replacing {target_path.name} with {source_path.name}...")
        
        try:
            # Create backup first
            backup_path = self.create_backup(target_path)
            if not backup_path:
                return False
            
            # Validate new image
            if not self.validate_image(source_path):
                print("❌ New image validation failed!")
                return False
            
            # Create temporary file for atomic operation
            temp_path = target_path.with_suffix('.tmp')
            
            # Copy new file to temp location
            shutil.copy2(source_path, temp_path)
            
            # Validate temp file
            if not self.validate_image(temp_path):
                print("❌ Temp file validation failed!")
                temp_path.unlink()
                return False
            
            # Atomic rename (this is the atomic operation)
            temp_path.replace(target_path)
            
            # Set proper permissions
            os.chmod(target_path, 0o644)
            
            print(f"  ✅ Successfully replaced {target_path.name}")
            return True
            
        except Exception as e:
            print(f"  ❌ Replacement failed: {e}")
            # Cleanup temp file if it exists
            if temp_path.exists():
                temp_path.unlink()
            return False
    
    def create_responsive_versions(self, source_image_info):
        """Create responsive versions from new high-quality source"""
        print("🔄 Creating responsive versions from new source...")
        
        source_path = source_image_info['path']
        
        # Define responsive sizes
        responsive_configs = {
            'mobile': {'width': 400, 'height': 300, 'quality': 85},
            'tablet': {'width': 800, 'height': 600, 'quality': 88},
            'desktop': {'width': 1200, 'height': 900, 'quality': 90},
            'high': {'width': 1600, 'height': 1200, 'quality': 92}
        }
        
        try:
            with Image.open(source_path) as source_img:
                print(f"  📊 Source: {source_img.width}x{source_img.height}")
                
                for size_name, config in responsive_configs.items():
                    # Create resized version
                    img = source_img.copy()
                    target_size = (config['width'], config['height'])
                    img = img.resize(target_size, Image.LANCZOS)
                    
                    # Save JPG version
                    jpg_path = self.images_dir / f"hue-location-map-{size_name}.jpg"
                    
                    # Backup existing file
                    if jpg_path.exists():
                        self.create_backup(jpg_path)
                    
                    # Save new version
                    img.save(jpg_path, 'JPEG', 
                            quality=config['quality'], 
                            optimize=True, 
                            progressive=True)
                    
                    # Set permissions
                    os.chmod(jpg_path, 0o644)
                    
                    # Create WebP version
                    webp_path = self.images_dir / f"hue-location-map-{size_name}.webp"
                    img.save(webp_path, 'WEBP', 
                            quality=config['quality'], 
                            optimize=True)
                    
                    os.chmod(webp_path, 0o644)
                    
                    size_kb = jpg_path.stat().st_size / 1024
                    print(f"    ✅ {size_name}: {config['width']}x{config['height']} ({size_kb:.1f}KB)")
                
                return True
                
        except Exception as e:
            print(f"❌ Error creating responsive versions: {e}")
            return False
    
    def update_version_system(self):
        """Update version tracking system"""
        print("🔢 Updating version system...")
        
        try:
            import subprocess
            import sys
            
            result = subprocess.run([
                sys.executable, 
                str(self.project_root / 'update-versions.py'), 
                'update'
            ], capture_output=True, text=True)
            
            if result.returncode == 0:
                print("✅ Version system updated")
                return True
            else:
                print(f"❌ Version update failed: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Error updating versions: {e}")
            return False
    
    def run_replacement(self, source_file=None):
        """Execute complete replacement process"""
        print("🚀 Starting Safe Map Image Replacement")
        print("=" * 50)
        
        # Step 1: Find current maps
        current_maps = self.find_current_maps()
        if not current_maps:
            print("❌ No current map files found!")
            return False
        
        # Step 2: Find new image
        if source_file:
            new_image_path = Path(source_file)
            if not new_image_path.exists():
                print(f"❌ Specified source file not found: {source_file}")
                return False
            
            try:
                with Image.open(new_image_path) as img:
                    new_image = {
                        'path': new_image_path,
                        'dimensions': f"{img.width}x{img.height}",
                        'size_kb': new_image_path.stat().st_size / 1024,
                        'format': img.format
                    }
            except Exception as e:
                print(f"❌ Error reading source file: {e}")
                return False
        else:
            new_image = self.find_new_image()
            if not new_image:
                print("❌ No new image file found!")
                print("Please:")
                print("1. Upload new image to project root as 'optimized-map.jpg'")
                print("2. Or specify file path when running script")
                return False
        
        print(f"📊 New image: {new_image['dimensions']} ({new_image['size_kb']:.1f}KB)")
        
        # Step 3: Create responsive versions
        if not self.create_responsive_versions(new_image):
            return False
        
        # Step 4: Update version system
        if not self.update_version_system():
            print("⚠️ Version system update failed, but images were replaced")
        
        print("✅ MAP IMAGE REPLACEMENT COMPLETED!")
        print(f"📦 Backups available in: {self.images_dir}/replacement_backups/")
        print("🔄 All responsive versions updated")
        print("🎯 Ready for testing")
        
        return True

def main():
    """Main replacement function"""
    import sys
    
    replacer = SafeImageReplacer()
    
    # Check for source file argument
    source_file = sys.argv[1] if len(sys.argv) > 1 else None
    
    success = replacer.run_replacement(source_file)
    
    if success:
        print("\\n🎉 Replacement successful!")
        print("Next steps:")
        print("1. python3 maintenance.py test")
        print("2. python3 maintenance.py server 3000")
        print("3. Open browser and verify new images")
    else:
        print("\\n❌ Replacement failed.")
        print("Check the errors above and try again.")

if __name__ == "__main__":
    main()