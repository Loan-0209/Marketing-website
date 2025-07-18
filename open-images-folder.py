#!/usr/bin/env python3
import subprocess
import os

def open_images_folder():
    print("📂 Opening assets/images folder for you...")
    
    # Path to images folder
    images_path = "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/assets/images"
    
    if os.path.exists(images_path):
        # Open folder in Finder
        subprocess.run(["open", images_path])
        
        print("✅ Images folder opened!")
        print("\n📋 TO ADD THE MAP IMAGE:")
        print("1. The images folder is now open in Finder")
        print("2. Go back to your location map image")
        print("3. Right-click → Save image as...")
        print("4. Save as: hue-location-map.jpg")
        print("5. Save to the open folder: assets/images/")
        print("6. Refresh the website to see the map!")
        
        print("\n📝 REMEMBER:")
        print("• File name must be: hue-location-map.jpg")
        print("• Must be saved in the images folder that just opened")
        print("• After saving, refresh the website (F5 or Cmd+R)")
        
    else:
        print(f"❌ Images folder not found: {images_path}")

if __name__ == "__main__":
    open_images_folder()
