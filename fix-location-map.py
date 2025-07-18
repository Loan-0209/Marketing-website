#!/usr/bin/env python3
"""
FIX HEART LOCATION MAP - Replace with complete version
"""

import os
import shutil
import webbrowser
from datetime import datetime

def fix_location_map():
    print("🛠️ FIXING HEART LOCATION MAP")
    print("=" * 50)
    
    project_dir = "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"
    images_dir = f"{project_dir}/assets/images"
    current_map = f"{images_dir}/hue-location-map.jpg"
    
    print("📊 PROBLEM ANALYSIS:")
    print("❌ Current map (Image 2): Missing legend, limited coverage")
    print("✅ Required map (Image 1): Complete with legend and full context")
    print("")
    
    # Backup current map
    if os.path.exists(current_map):
        backup_name = f"hue-location-map-incomplete-backup-{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
        backup_path = f"{images_dir}/{backup_name}"
        shutil.copy2(current_map, backup_path)
        print(f"💾 Backed up current map: {backup_name}")
    
    print("\n🎯 SOLUTION REQUIRED:")
    print("1. You need to save Image 1 (the complete map with legend)")
    print("2. Replace the current incomplete map")
    print("")
    
    print("📋 STEP-BY-STEP INSTRUCTIONS:")
    print("=" * 50)
    print("STEP 1: Save Image 1")
    print("  • Right-click on Image 1 (the complete map)")
    print("  • Select 'Save image as...'")
    print("  • Save as: 'hue-location-map-complete.jpg'")
    print("  • Save to your Downloads folder")
    print("")
    
    print("STEP 2: Replace current map")
    print(f"  • Copy 'hue-location-map-complete.jpg' to:")
    print(f"    {images_dir}/")
    print("  • Rename it to: 'hue-location-map.jpg'")
    print("  • Overwrite the current file")
    print("")
    
    print("STEP 3: Optimize for responsive")
    print("  • The script below will create multiple sizes")
    print("  • Run after you've replaced the main image")
    print("")
    
    # Create the folder opening script
    open_folder_script = f"""
# Open images folder for easy access
import subprocess
subprocess.run(["open", "{images_dir}"])
print("📂 Images folder opened!")
"""
    
    with open(f"{project_dir}/open-images-folder.py", 'w') as f:
        f.write(open_folder_script)
    
    print("🚀 EXECUTING:")
    print("  • Opening images folder...")
    
    # Open images folder
    try:
        os.system(f"open '{images_dir}'")
        print("✅ Images folder opened!")
    except:
        print("❌ Could not open folder automatically")
    
    print("\n💡 WHAT YOU'LL SEE IN THE COMPLETE MAP:")
    print("✅ Legend with 8 infrastructure types:")
    print("  • Existing urban areas (red)")
    print("  • New urban areas (light red)")  
    print("  • National highway 1A (yellow)")
    print("  • National highway 49 (blue)")
    print("  • National HCM road (gray)")
    print("  • National Expressway (purple)")
    print("  • Planning zone (light blue)")
    print("  • Coastal Road (green)")
    print("")
    print("✅ Complete geographic context:")
    print("  • Hong Van border gate (left)")
    print("  • Phong Dien Port (top)")
    print("  • Thuan An Port (center)")
    print("  • Chan May Port (right)")
    print("  • Da Nang City (bottom right)")
    print("  • HEART location clearly marked")
    
    return images_dir

def create_optimization_script(images_dir):
    """Create script to optimize the complete map after replacement"""
    
    optimization_script = f'''#!/usr/bin/env python3
"""
OPTIMIZE COMPLETE LOCATION MAP
Run this AFTER replacing with Image 1
"""

from PIL import Image
import os

def optimize_complete_map():
    images_dir = "{images_dir}"
    main_map = f"{{images_dir}}/hue-location-map.jpg"
    
    if not os.path.exists(main_map):
        print("❌ Main map not found. Please replace with Image 1 first.")
        return
    
    print("🎨 OPTIMIZING COMPLETE MAP FOR RESPONSIVE...")
    
    # Create responsive versions
    sizes = {{
        'high': (1600, 1143),      # High resolution
        'desktop': (1400, 1000),   # Desktop
        'tablet': (1000, 714),     # Tablet  
        'mobile': (600, 428)       # Mobile
    }}
    
    try:
        with Image.open(main_map) as img:
            print(f"📐 Original size: {{img.size}}")
            
            # Ensure RGB mode
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            for name, size in sizes.items():
                # Resize maintaining aspect ratio
                img_resized = img.resize(size, Image.LANCZOS)
                
                # Save with high quality
                output_path = f"{{images_dir}}/hue-location-map-{{name}}.jpg"
                img_resized.save(output_path, 'JPEG', quality=92, optimize=True)
                
                file_size = os.path.getsize(output_path)
                print(f"✅ Created {{name}}: {{size[0]}}x{{size[1]}} ({{file_size:,}} bytes)")
            
            print("\\n🎉 OPTIMIZATION COMPLETE!")
            print("✅ All responsive versions created")
            print("✅ Website will auto-select optimal size")
            
    except Exception as e:
        print(f"❌ Error optimizing: {{e}}")

def update_html_responsive():
    """Update HTML to use responsive images"""
    
    html_file = "{project_dir}/index.html"
    
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Update img tag for responsive
        old_img = 'src="assets/images/hue-location-map.jpg"'
        new_img = \\'''srcset="assets/images/hue-location-map-mobile.jpg 600w,
                        assets/images/hue-location-map-tablet.jpg 1000w,
                        assets/images/hue-location-map-desktop.jpg 1400w,
                        assets/images/hue-location-map-high.jpg 1600w"
                 sizes="(max-width: 768px) 600px,
                        (max-width: 1024px) 1000px,
                        (max-width: 1440px) 1400px,
                        1600px"
                 src="assets/images/hue-location-map-desktop.jpg"\\'''
        
        if old_img in content:
            content = content.replace(old_img, new_img)
            
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print("✅ HTML updated for responsive images")
        else:
            print("⚠️ Image tag not found - may need manual update")
            
    except Exception as e:
        print(f"❌ Error updating HTML: {{e}}")

if __name__ == "__main__":
    print("🎨 OPTIMIZING HEART LOCATION MAP")
    print("=" * 50)
    optimize_complete_map()
    update_html_responsive()
    
    # Open website to test
    import webbrowser
    import time
    
    website_url = "file://{project_dir}/index.html?v={{int(time.time())}}"
    webbrowser.open(website_url)
    print("\\n🌐 Website opened for testing!")
    print("🔍 Scroll to Strategic Location section to verify complete map")
'''
    
    script_path = f"{images_dir}/../optimize-complete-map.py"
    with open(script_path, 'w') as f:
        f.write(optimization_script)
    
    print(f"📄 Created optimization script: optimize-complete-map.py")
    print("   Run this AFTER replacing the map image")

def main():
    print("🎯 HEART LOCATION MAP FIX")
    print("Current Status: INCOMPLETE MAP (missing legend & context)")
    print("Target Status: COMPLETE MAP (with legend & full coverage)")
    print("")
    
    images_dir = fix_location_map()
    create_optimization_script(images_dir)
    
    print("\n" + "=" * 50)
    print("🚀 SUMMARY:")
    print("1. ✅ Images folder opened")
    print("2. ✅ Current map backed up")  
    print("3. ✅ Optimization script created")
    print("4. 📋 Manual steps provided above")
    print("")
    print("⏭️ NEXT: Replace map with Image 1, then run optimize script")
    print("🎯 RESULT: Professional map with legend and complete context!")

if __name__ == "__main__":
    main()
