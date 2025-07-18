#!/usr/bin/env python3
"""
Upgrade Map Images to High Quality Version
Lossless optimization và tạo responsive versions từ hình gốc chất lượng cao
"""

import os
import shutil
from pathlib import Path
from PIL import Image, ImageEnhance, ImageFilter
import time
from datetime import datetime

class HighQualityUpgrader:
    def __init__(self, project_root='.'):
        self.project_root = Path(project_root)
        self.images_dir = self.project_root / 'assets' / 'images'
        self.high_quality_source = self.images_dir / 'hue-location-map-high.jpg'
        
    def analyze_source_image(self):
        """Phân tích hình gốc chất lượng cao"""
        print("🔍 Analyzing high quality source image...")
        
        if not self.high_quality_source.exists():
            print("❌ High quality source image not found!")
            return False
            
        try:
            with Image.open(self.high_quality_source) as img:
                info = {
                    'file': self.high_quality_source.name,
                    'size_bytes': self.high_quality_source.stat().st_size,
                    'size_kb': self.high_quality_source.stat().st_size / 1024,
                    'dimensions': f"{img.width}x{img.height}",
                    'format': img.format,
                    'mode': img.mode,
                    'has_transparency': img.mode in ('RGBA', 'LA') or 'transparency' in img.info
                }
                
                print(f"✅ Source image analysis:")
                print(f"   📁 File: {info['file']}")
                print(f"   📏 Size: {info['size_kb']:.1f} KB")
                print(f"   🖼️ Dimensions: {info['dimensions']}")
                print(f"   🎨 Format: {info['format']}, Mode: {info['mode']}")
                print(f"   🔍 Transparency: {info['has_transparency']}")
                
                return info
                
        except Exception as e:
            print(f"❌ Error analyzing source image: {e}")
            return False
    
    def create_responsive_versions(self):
        """Tạo responsive versions từ hình gốc chất lượng cao"""
        print("🔄 Creating responsive versions from high quality source...")
        
        # Định nghĩa các kích thước responsive
        responsive_sizes = {
            'mobile': {'width': 400, 'height': 300, 'quality': 85},
            'tablet': {'width': 800, 'height': 600, 'quality': 88},
            'desktop': {'width': 1200, 'height': 900, 'quality': 90},
            'high': {'width': 1600, 'height': 1200, 'quality': 92}
        }
        
        results = []
        
        try:
            with Image.open(self.high_quality_source) as source_img:
                print(f"📊 Source: {source_img.width}x{source_img.height}")
                
                for size_name, config in responsive_sizes.items():
                    print(f"  🔄 Creating {size_name} version...")
                    
                    # Tạo copy của image
                    img = source_img.copy()
                    
                    # Resize với high quality resampling
                    target_size = (config['width'], config['height'])
                    img = img.resize(target_size, Image.LANCZOS)
                    
                    # Enhance image quality
                    enhancer = ImageEnhance.Sharpness(img)
                    img = enhancer.enhance(1.1)
                    
                    enhancer = ImageEnhance.Contrast(img)
                    img = enhancer.enhance(1.05)
                    
                    # Save JPG version
                    jpg_path = self.images_dir / f"hue-location-map-{size_name}.jpg"
                    img.save(jpg_path, 'JPEG', 
                            quality=config['quality'], 
                            optimize=True, 
                            progressive=True)
                    
                    # Save WebP version
                    webp_path = self.images_dir / f"hue-location-map-{size_name}.webp"
                    img.save(webp_path, 'WEBP', 
                            quality=config['quality'], 
                            optimize=True)
                    
                    # Get file sizes
                    jpg_size = jpg_path.stat().st_size
                    webp_size = webp_path.stat().st_size
                    
                    result = {
                        'size_name': size_name,
                        'dimensions': f"{config['width']}x{config['height']}",
                        'jpg_size_kb': jpg_size / 1024,
                        'webp_size_kb': webp_size / 1024,
                        'webp_savings': ((jpg_size - webp_size) / jpg_size) * 100
                    }
                    
                    results.append(result)
                    
                    print(f"    ✅ {size_name}: {result['dimensions']} - JPG: {result['jpg_size_kb']:.1f}KB, WebP: {result['webp_size_kb']:.1f}KB")
                
                return results
                
        except Exception as e:
            print(f"❌ Error creating responsive versions: {e}")
            return []
    
    def backup_current_images(self):
        """Backup current images before replacement"""
        print("📦 Creating backup of current images...")
        
        backup_dir = self.project_root / 'assets' / 'images' / 'backup_before_upgrade'
        backup_dir.mkdir(exist_ok=True)
        
        # Files to backup
        files_to_backup = [
            'hue-location-map-mobile.jpg',
            'hue-location-map-tablet.jpg',
            'hue-location-map-desktop.jpg',
            'hue-location-map-high.jpg',
            'hue-location-map-mobile.webp',
            'hue-location-map-tablet.webp',
            'hue-location-map-desktop.webp',
            'hue-location-map-high.webp'
        ]
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backed_up = []
        
        for filename in files_to_backup:
            src_path = self.images_dir / filename
            if src_path.exists():
                backup_path = backup_dir / f"{filename.replace('.', f'_{timestamp}.')}"
                shutil.copy2(src_path, backup_path)
                backed_up.append(filename)
                print(f"  ✅ Backed up: {filename}")
        
        print(f"📦 Backup completed: {len(backed_up)} files")
        return backup_dir
    
    def update_version_system(self):
        """Update version system after upgrade"""
        print("🔢 Updating version system...")
        
        try:
            # Run version update script
            import subprocess
            import sys
            
            result = subprocess.run([
                sys.executable, 
                str(self.project_root / 'update-versions.py'), 
                'update'
            ], capture_output=True, text=True)
            
            if result.returncode == 0:
                print("✅ Version system updated successfully")
                print(result.stdout)
                return True
            else:
                print("❌ Version update failed")
                print(result.stderr)
                return False
                
        except Exception as e:
            print(f"❌ Error updating versions: {e}")
            return False
    
    def validate_upgrade(self):
        """Validate upgrade results"""
        print("🧪 Validating upgrade results...")
        
        required_files = [
            'hue-location-map-mobile.jpg',
            'hue-location-map-tablet.jpg',
            'hue-location-map-desktop.jpg',
            'hue-location-map-high.jpg',
            'hue-location-map-mobile.webp',
            'hue-location-map-tablet.webp',
            'hue-location-map-desktop.webp',
            'hue-location-map-high.webp'
        ]
        
        validation_results = []
        
        for filename in required_files:
            file_path = self.images_dir / filename
            if file_path.exists():
                try:
                    with Image.open(file_path) as img:
                        result = {
                            'file': filename,
                            'exists': True,
                            'size_kb': file_path.stat().st_size / 1024,
                            'dimensions': f"{img.width}x{img.height}",
                            'format': img.format,
                            'valid': True
                        }
                except Exception as e:
                    result = {
                        'file': filename,
                        'exists': True,
                        'error': str(e),
                        'valid': False
                    }
            else:
                result = {
                    'file': filename,
                    'exists': False,
                    'valid': False
                }
            
            validation_results.append(result)
            
            status = "✅" if result['valid'] else "❌"
            if result['valid']:
                print(f"  {status} {filename}: {result['size_kb']:.1f}KB - {result['dimensions']}")
            else:
                print(f"  {status} {filename}: {result.get('error', 'Missing')}")
        
        valid_count = sum(1 for r in validation_results if r['valid'])
        total_count = len(validation_results)
        
        print(f"\n📊 Validation summary: {valid_count}/{total_count} files valid")
        
        return valid_count == total_count
    
    def run_upgrade(self):
        """Execute complete upgrade process"""
        print("🚀 Starting High Quality Image Upgrade")
        print("=" * 50)
        
        # Step 1: Analyze source
        source_info = self.analyze_source_image()
        if not source_info:
            return False
        
        # Step 2: Backup current images
        backup_dir = self.backup_current_images()
        print()
        
        # Step 3: Create responsive versions
        responsive_results = self.create_responsive_versions()
        if not responsive_results:
            return False
        print()
        
        # Step 4: Update version system
        version_updated = self.update_version_system()
        print()
        
        # Step 5: Validate results
        validation_passed = self.validate_upgrade()
        print()
        
        if validation_passed:
            print("✅ HIGH QUALITY UPGRADE COMPLETED SUCCESSFULLY!")
            print(f"📦 Backup location: {backup_dir}")
            print(f"📊 {len(responsive_results)} responsive versions created")
            print("🔄 Version system updated")
            print("🧪 All validations passed")
            return True
        else:
            print("❌ UPGRADE FAILED VALIDATION")
            print("Please check the errors above and try again")
            return False

def main():
    """Main upgrade function"""
    upgrader = HighQualityUpgrader()
    success = upgrader.run_upgrade()
    
    if success:
        print("\\n🎉 Ready to test the upgraded images!")
        print("Next steps:")
        print("1. python3 maintenance.py test")
        print("2. python3 maintenance.py server 3000")
        print("3. Open browser and check image quality")
    else:
        print("\\n❌ Upgrade failed. Check backup directory for recovery.")

if __name__ == "__main__":
    main()