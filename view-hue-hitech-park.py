#!/usr/bin/env python3
import webbrowser
import os
import time

def open_updated_website():
    print("🚀 Opening Updated HUE HI-TECH PARK Website...")
    print("=" * 60)
    
    # Path to index.html
    file_path = "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/index.html"
    
    if os.path.exists(file_path):
        # Convert to file URL
        file_url = f"file://{file_path}"
        print(f"📂 Opening: {file_url}")
        
        # Open in default browser
        webbrowser.open(file_url)
        
        print("✅ Website opened successfully!")
        print("\n🏢 HUE HI-TECH PARK - COMPLETE UPDATE SUMMARY:")
        print("=" * 60)
        
        print("📋 UPDATED SECTIONS:")
        print("• Title & Meta Tags → HUE HI-TECH PARK branding")
        print("• Hero Section → Vietnam's First 300MW AI-Optimized Hyperscale Data Center") 
        print("• Logo → Changed from HEART to HUE")
        print("• Stats Section → 300MW, 500kV, 4 Lines, 99.99% uptime")
        print("• About Section → Hyperscale data infrastructure focus")
        print("• Features Grid → Data center specific features")
        print("• Location Section → Detailed Hue Hi-Tech Park info")
        print("• CTA Section → Power Your Digital Future theme")
        
        print("\n📍 NEW DETAILED LOCATION SECTION:")
        print("• AIR: Phu Bai Airport + Da Nang International (80km)")
        print("• LAND: North-South Expressway + National Highway 1A")
        print("• SEA: Chan May + Thuan An + Da Nang ports")
        print("• POWER: 500kV onsite grid + 4 transmission lines")
        print("• CONNECTIVITY: Da Nang international submarine cables")
        
        print("\n💎 KEY FEATURES HIGHLIGHTED:")
        print("• 300MW Power Capacity with 500kV grid")
        print("• International submarine cable connectivity")
        print("• AI-optimized hyperscale infrastructure")
        print("• Strategic Central Vietnam location")
        print("• 99.99% uptime guarantee")
        print("• Scalable modular design")
        
        print("\n📱 RESPONSIVE DESIGN:")
        print("• Mobile-optimized layout")
        print("• Interactive map with overlays")
        print("• Smooth animations and hover effects")
        print("• Professional color scheme")
        
        print("\n🔥 FINAL STEP TO COMPLETE:")
        print("1. Save location map image as: 'hue-location-map.jpg'")
        print("2. Place in: assets/images/ folder")
        print("3. Refresh webpage to see complete location section")
        
        print("\n🎯 STATUS: HUE HI-TECH PARK website ready!")
        print("=" * 60)
        
    else:
        print(f"❌ File not found: {file_path}")

if __name__ == "__main__":
    open_updated_website()
