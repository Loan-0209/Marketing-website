#!/usr/bin/env python3
"""
HEART Website Image Optimization Pipeline
Advanced image processing and CDN preparation
"""

import os
import json
import shutil
from pathlib import Path
from PIL import Image, ImageEnhance, ImageFilter
import subprocess

class ImageOptimizer:
    def __init__(self, project_root='.'):
        self.project_root = Path(project_root)
        self.images_dir = self.project_root / 'assets' / 'images'
        self.optimized_dir = self.project_root / 'assets' / 'optimized'
        self.backup_dir = self.project_root / 'assets' / 'backup'
        
        # Create directories if they don't exist
        self.optimized_dir.mkdir(parents=True, exist_ok=True)
        self.backup_dir.mkdir(parents=True, exist_ok=True)
    
    def backup_original(self, image_path):
        """Create backup of original image"""
        backup_path = self.backup_dir / f"{image_path.stem}_original_{int(time.time())}{image_path.suffix}"
        shutil.copy2(image_path, backup_path)
        return backup_path
    
    def optimize_image(self, input_path, output_path, quality=85, max_width=None, max_height=None):
        """Optimize single image with PIL"""
        try:
            with Image.open(input_path) as img:
                # Convert to RGB if necessary
                if img.mode in ('RGBA', 'LA', 'P'):
                    # Create white background
                    background = Image.new('RGB', img.size, (255, 255, 255))
                    if img.mode == 'RGBA':
                        background.paste(img, mask=img.split()[-1])
                    else:
                        background.paste(img)
                    img = background
                
                # Resize if max dimensions specified
                if max_width or max_height:
                    img.thumbnail((max_width or img.width, max_height or img.height), Image.LANCZOS)
                
                # Enhance image
                enhancer = ImageEnhance.Sharpness(img)
                img = enhancer.enhance(1.1)
                
                # Save optimized image
                img.save(output_path, 'JPEG', quality=quality, optimize=True, progressive=True)
                
                return True
        except Exception as e:
            print(f"❌ Error optimizing {input_path}: {e}")
            return False
    
    def create_webp_version(self, input_path, output_path, quality=85):
        """Create WebP version of image"""
        try:
            with Image.open(input_path) as img:
                if img.mode in ('RGBA', 'LA', 'P'):
                    background = Image.new('RGB', img.size, (255, 255, 255))
                    if img.mode == 'RGBA':
                        background.paste(img, mask=img.split()[-1])
                    else:
                        background.paste(img)
                    img = background
                
                img.save(output_path, 'WEBP', quality=quality, optimize=True)
                return True
        except Exception as e:
            print(f"❌ Error creating WebP for {input_path}: {e}")
            return False
    
    def optimize_all_maps(self):
        """Optimize all hue-location-map images"""
        map_images = list(self.images_dir.glob('hue-location-map-*.jpg'))
        
        results = {
            'optimized': [],
            'failed': [],
            'total_saved': 0
        }
        
        for image_path in map_images:
            if 'backup' in image_path.name or 'original' in image_path.name:
                continue
                
            print(f"🔄 Optimizing {image_path.name}...")
            
            # Backup original
            backup_path = self.backup_original(image_path)
            
            # Get original size
            original_size = image_path.stat().st_size
            
            # Optimize image
            optimized_path = self.optimized_dir / image_path.name
            if self.optimize_image(image_path, optimized_path, quality=90):
                
                # Create WebP version
                webp_path = optimized_path.with_suffix('.webp')
                self.create_webp_version(optimized_path, webp_path, quality=85)
                
                # Get optimized size
                optimized_size = optimized_path.stat().st_size
                savings = original_size - optimized_size
                
                results['optimized'].append({
                    'file': image_path.name,
                    'original_size': original_size,
                    'optimized_size': optimized_size,
                    'savings': savings,
                    'savings_percent': (savings / original_size) * 100
                })
                
                results['total_saved'] += savings
                
                print(f"✅ {image_path.name}: {original_size} → {optimized_size} bytes ({savings} saved)")
            else:
                results['failed'].append(image_path.name)
        
        return results
    
    def create_cdn_structure(self):
        """Create CDN-ready directory structure"""
        cdn_dir = self.project_root / 'cdn'
        cdn_dir.mkdir(exist_ok=True)
        
        # Create version-based directories
        version_data = self.load_version_data()
        version = version_data.get('version', '1.0.0')
        
        version_dir = cdn_dir / f"v{version}"
        version_dir.mkdir(exist_ok=True)
        
        # Copy optimized images to CDN structure
        for image_path in self.optimized_dir.glob('hue-location-map-*'):
            cdn_path = version_dir / image_path.name
            shutil.copy2(image_path, cdn_path)
        
        # Create manifest file
        manifest = {
            'version': version,
            'base_url': f'/cdn/v{version}/',
            'images': {}
        }
        
        for image_path in version_dir.glob('hue-location-map-*'):
            key = image_path.stem
            manifest['images'][key] = {
                'url': f"/cdn/v{version}/{image_path.name}",
                'size': image_path.stat().st_size
            }
        
        manifest_path = cdn_dir / 'manifest.json'
        with open(manifest_path, 'w') as f:
            json.dump(manifest, f, indent=2)
        
        return cdn_dir
    
    def load_version_data(self):
        """Load version data"""
        try:
            with open(self.project_root / 'image-version.json', 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {"version": "1.0.0", "images": {}}
    
    def generate_performance_report(self, results):
        """Generate performance optimization report"""
        report = {
            'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
            'summary': {
                'total_files': len(results['optimized']) + len(results['failed']),
                'optimized_files': len(results['optimized']),
                'failed_files': len(results['failed']),
                'total_savings_bytes': results['total_saved'],
                'total_savings_mb': results['total_saved'] / (1024 * 1024)
            },
            'details': results['optimized']
        }
        
        report_path = self.project_root / 'optimization-report.json'
        with open(report_path, 'w') as f:
            json.dump(report, f, indent=2)
        
        return report_path

def main():
    """Main optimization function"""
    import time
    
    optimizer = ImageOptimizer()
    
    print("🚀 Starting HEART Website Image Optimization")
    print("=" * 50)
    
    # Optimize all map images
    results = optimizer.optimize_all_maps()
    
    # Create CDN structure
    cdn_dir = optimizer.create_cdn_structure()
    print(f"📦 CDN structure created at: {cdn_dir}")
    
    # Generate report
    report_path = optimizer.generate_performance_report(results)
    print(f"📊 Performance report saved to: {report_path}")
    
    # Print summary
    print("\n✅ Optimization Complete!")
    print(f"📈 Total files optimized: {len(results['optimized'])}")
    print(f"💾 Total space saved: {results['total_saved'] / 1024:.1f} KB")
    print(f"📁 CDN-ready files available in: {cdn_dir}")

if __name__ == "__main__":
    main()