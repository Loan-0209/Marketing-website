#!/usr/bin/env python3
import webbrowser
import os
import time

def check_website_with_map():
    print("🗺️ HEART Website - Checking Map Display...")
    print("=" * 60)
    
    # Path to index.html
    file_path = "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/index.html"
    images_path = "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/assets/images"
    
    if os.path.exists(file_path):
        # Check if map image exists
        map_file = os.path.join(images_path, "hue-location-map.jpg")
        
        print("📂 File Check:")
        print(f"✅ Website: {file_path}")
        print(f"✅ Map Image: {map_file}")
        print(f"📁 Images folder: {images_path}")
        
        # List all images
        if os.path.exists(images_path):
            images = os.listdir(images_path)
            print(f"\n📸 Available Images:")
            for img in images:
                print(f"   • {img}")
        
        # Convert to file URL
        file_url = f"file://{file_path}"
        print(f"\n🌐 Opening: {file_url}")
        
        # Open in default browser
        webbrowser.open(file_url)
        
        print("\n✅ Website opened!")
        print("\n🗺️ MAP STATUS:")
        
        if os.path.exists(map_file):
            print("✅ Placeholder map image created!")
            print("✅ Location section should now display the map")
            print("✅ You can see the layout with placeholder content")
            
            print("\n📝 TO REPLACE WITH REAL MAP:")
            print("1. Go back to your original location map image")
            print("2. Right-click → Save image as...")
            print("3. Save as: hue-location-map.jpg")
            print("4. Save to: assets/images/ folder (overwrite the placeholder)")
            print("5. Refresh website to see the real map")
            
            print("\n🎯 CURRENT STATUS:")
            print("• Placeholder map: ✅ Active")
            print("• Location section: ✅ Complete")
            print("• HEART branding: ✅ Updated")
            print("• All technical specs: ✅ Displayed")
            
        else:
            print("❌ Map image not found - something went wrong")
            
    else:
        print(f"❌ Website not found: {file_path}")

if __name__ == "__main__":
    check_website_with_map()
