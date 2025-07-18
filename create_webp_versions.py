#!/usr/bin/env python3
"""
Create WebP versions of all responsive image sizes
"""

from PIL import Image
import os

def create_webp_versions():
    """Create WebP versions of all responsive sizes"""
    print("🌐 Creating WebP versions for all responsive sizes...")
    
    base_path = "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/assets/images"
    
    # List of all the responsive versions we created
    responsive_versions = [
        'hue-location-map-high.jpg',
        'hue-location-map-desktop.jpg', 
        'hue-location-map-tablet.jpg',
        'hue-location-map-mobile.jpg',
        'hue-location-map-thumbnail.jpg'
    ]
    
    webp_files = []
    
    for filename in responsive_versions:
        jpg_path = os.path.join(base_path, filename)
        webp_path = jpg_path.replace('.jpg', '.webp')
        
        if os.path.exists(jpg_path):
            with Image.open(jpg_path) as img:
                # Save as WebP with high quality
                img.save(webp_path, 'WEBP', quality=85, optimize=True)
                
                # Get file sizes
                jpg_size = os.path.getsize(jpg_path) / 1024
                webp_size = os.path.getsize(webp_path) / 1024
                savings = ((jpg_size - webp_size) / jpg_size) * 100
                
                print(f"   📦 {filename} → {filename.replace('.jpg', '.webp')}")
                print(f"      💾 {jpg_size:.1f} KB → {webp_size:.1f} KB ({savings:.1f}% savings)")
                
                webp_files.append({
                    'filename': filename.replace('.jpg', '.webp'),
                    'path': webp_path,
                    'size_kb': webp_size,
                    'savings_percent': savings
                })
        else:
            print(f"   ⚠️  {filename} not found")
    
    return webp_files

if __name__ == "__main__":
    webp_files = create_webp_versions()
    
    print(f"\n✅ Created {len(webp_files)} WebP versions")
    
    total_savings = sum(f['savings_percent'] for f in webp_files) / len(webp_files)
    print(f"📊 Average file size savings: {total_savings:.1f}%")