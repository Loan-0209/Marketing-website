#!/usr/bin/env python3
import webbrowser
import os
import time

def view_enlarged_map():
    print("🗺️ HEART Website - Enhanced Location Map Size!")
    print("=" * 60)
    
    # Path to index.html
    file_path = "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/index.html"
    
    if os.path.exists(file_path):
        # Convert to file URL
        file_url = f"file://{file_path}"
        print(f"🌐 Opening: {file_url}")
        
        # Open in default browser
        webbrowser.open(file_url)
        
        print("✅ Website opened with enlarged location map!")
        
        print("\n🎯 MAP SIZE ENHANCEMENTS APPLIED:")
        print("=" * 60)
        
        print("📐 LAYOUT CHANGES:")
        print("• Grid ratio changed: Content 40% → Map 60%")
        print("• Map minimum height: 600px (desktop)")
        print("• Map maximum height: 800px (desktop)")
        print("• Large screen (1200px+): 700-900px height")
        print("• Extra large (1400px+): 800-1000px height")
        print("• Mobile: 400-500px height")
        
        print("\n🎨 VISUAL IMPROVEMENTS:")
        print("• Larger map overlays and markers")
        print("• Enhanced HEART location pin (1.8rem icon)")
        print("• Bigger 300MW data center badge")
        print("• Improved hover effect (1.03x scale)")
        print("• Better shadow effects on overlays")
        
        print("\n📱 RESPONSIVE OPTIMIZATION:")
        print("• Desktop: Map dominates the layout (60% width)")
        print("• Large screens: Map up to 70% width")
        print("• Tablet: Single column, map shows first")
        print("• Mobile: Appropriate sizing for small screens")
        
        print("\n🗺️ LOCATION FEATURES ENHANCED:")
        print("• AIR CONNECTIVITY section → Better visibility")
        print("• LAND TRANSPORT section → Clearer details")
        print("• SEA ACCESS section → Enhanced port information")
        print("• POWER INFRASTRUCTURE section → Prominent display")
        
        print("\n💎 TECHNICAL BENEFITS:")
        print("• Better readability of location details")
        print("• Improved visual hierarchy")
        print("• More impactful presentation")
        print("• Professional data center image")
        print("• Enhanced user engagement")
        
        print("\n🎯 CURRENT STATUS:")
        print("✅ Location map: Significantly enlarged")
        print("✅ Content balance: Optimized")
        print("✅ Responsive design: Enhanced")
        print("✅ Visual impact: Maximized")
        
        print("\n🚀 READY FOR REVIEW!")
        print("Check the Strategic Location section to see enlarged map!")
        
    else:
        print(f"❌ Website not found: {file_path}")

if __name__ == "__main__":
    view_enlarged_map()
