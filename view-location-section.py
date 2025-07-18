#!/usr/bin/env python3
import webbrowser
import os
import time

def open_website():
    print("🚀 Opening HEART Technology Park website...")
    
    # Path to index.html
    file_path = "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/index.html"
    
    if os.path.exists(file_path):
        # Convert to file URL
        file_url = f"file://{file_path}"
        print(f"📂 Opening: {file_url}")
        
        # Open in default browser
        webbrowser.open(file_url)
        
        print("✅ Website opened successfully!")
        print("\n📍 NEW LOCATION SECTION ADDED:")
        print("- Strategic Location section with Huế map")
        print("- Port access information")
        print("- Highway connectivity details")
        print("- Airport proximity")
        print("- Power infrastructure info")
        print("- Responsive design for mobile")
        
        print("\n📋 TO COMPLETE THE SETUP:")
        print("1. Save your location map image as: 'hue-location-map.jpg'")
        print("2. Place it in: /Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/assets/images/")
        print("3. Refresh the webpage to see the map")
        
    else:
        print(f"❌ File not found: {file_path}")

if __name__ == "__main__":
    open_website()
