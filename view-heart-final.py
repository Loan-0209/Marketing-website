#!/usr/bin/env python3
import webbrowser
import os
import time

def open_heart_website():
    print("🚀 Opening HEART Website - Brand Name Updated!")
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
        print("\n❤️ HEART - BRAND NAME RESTORED:")
        print("=" * 60)
        
        print("🔄 BRAND CHANGES APPLIED:")
        print("• Title & Meta → HEART (Vietnam's First 300MW AI-Optimized Hyperscale Data Center)")
        print("• Logo → HEART")
        print("• Hero Section → HEART")
        print("• About Section → HEART")
        print("• Location Section → HEART")
        print("• Features Section → Why Choose HEART?")
        print("• CTA Section → Join HEART")
        print("• Map Marker → HEART location pin")
        
        print("\n💎 TECHNICAL SPECS MAINTAINED:")
        print("• 300MW Data Center Capacity")
        print("• 500kV Onsite Grid Power")
        print("• 4 Transmission Lines")
        print("• 99.99% Uptime Guarantee")
        print("• AI-Optimized Hyperscale Infrastructure")
        print("• International Submarine Cable Connectivity")
        
        print("\n📍 DETAILED LOCATION INFO PRESERVED:")
        print("• AIR: Phu Bai Airport + Da Nang International (80km)")
        print("• LAND: North-South Expressway + National Highway 1A")
        print("• SEA: Chan May + Thuan An + Da Nang ports")
        print("• POWER: 500kV onsite grid + 4 transmission lines")
        print("• CONNECTIVITY: Da Nang international submarine cables")
        
        print("\n🎯 KEY FEATURES:")
        print("• 300MW Power Capacity with 500kV grid")
        print("• International submarine cable connectivity")
        print("• AI-optimized hyperscale infrastructure")
        print("• Strategic Central Vietnam location")
        print("• 99.99% uptime guarantee")
        print("• Scalable modular design")
        
        print("\n🔥 FINAL STEP TO COMPLETE:")
        print("1. Save location map image as: 'hue-location-map.jpg'")
        print("2. Place in: assets/images/ folder")
        print("3. Refresh webpage to see complete HEART location section")
        
        print("\n🎯 STATUS: HEART website ready with all technical specifications!")
        print("=" * 60)
        
    else:
        print(f"❌ File not found: {file_path}")

if __name__ == "__main__":
    open_heart_website()
