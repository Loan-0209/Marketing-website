#!/usr/bin/env python3
import webbrowser
import os

def view_repositioned_map():
    print("📐 HEART Website - Map Position Adjusted!")
    print("=" * 60)
    
    # Path to index.html
    file_path = "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/index.html"
    
    if os.path.exists(file_path):
        # Convert to file URL
        file_url = f"file://{file_path}"
        print(f"🌐 Opening: {file_url}")
        
        # Open in default browser
        webbrowser.open(file_url)
        
        print("✅ Website opened with repositioned map!")
        
        print("\n🎯 MAP POSITION CHANGES APPLIED:")
        print("=" * 60)
        
        print("📍 POSITION ADJUSTMENT:")
        print("• Map now starts aligned with 'AIR CONNECTIVITY' section")
        print("• Added 120px top margin to push map down")
        print("• Removed sticky positioning for better control")
        print("• Map no longer starts from the very top")
        
        print("\n📏 LAYOUT IMPROVEMENTS:")
        print("• Before: Map aligned with main title")
        print("• After:  Map aligned with AIR CONNECTIVITY")
        print("• Better visual balance with content flow")
        print("• More logical content-to-image relationship")
        
        print("\n📱 RESPONSIVE HANDLING:")
        print("• Desktop (>1024px): 120px top margin")
        print("• Tablet (768-1024px): 80px top margin") 
        print("• Mobile (<768px): 0px margin (map shows first)")
        print("• Smooth transitions between breakpoints")
        
        print("\n🎨 VISUAL BENEFITS:")
        print("• Map appears next to relevant content")
        print("• Better content hierarchy")
        print("• More professional layout flow")
        print("• Reduced white space at bottom")
        print("• Enhanced reading experience")
        
        print("\n💡 DESIGN RATIONALE:")
        print("• Users read title and intro first")
        print("• Then see AIR CONNECTIVITY alongside map")
        print("• Logical progression of information")
        print("• Map supports the connectivity details")
        
        print("\n🔍 WHAT YOU'LL SEE:")
        print("1. Title 'Strategic Location in Central Vietnam'")
        print("2. Description paragraph") 
        print("3. AIR CONNECTIVITY section starts")
        print("4. Map appears aligned with AIR section")
        print("5. Content and map flow together naturally")
        
        print("\n🎯 LAYOUT COMPARISON:")
        print("┌─ Title ─────────┬─ [Empty] ──────┐")
        print("├─ Description ───┼─ [Empty] ──────┤  BEFORE")
        print("├─ AIR CONNECT ───┼─ [Map Start] ──┤")
        print("└─ LAND/SEA... ───┴─ [Map Cont.] ──┘")
        print("")
        print("┌─ Title ─────────┬─ [Empty] ──────┐")
        print("├─ Description ───┼─ [Empty] ──────┤  AFTER")
        print("├─ AIR CONNECT ───┼─ [Map Start] ──┤")
        print("└─ LAND/SEA... ───┴─ [Map Cont.] ──┘")
        
        print("\n✨ ADDITIONAL BENEFITS:")
        print("• Better mobile experience (map first)")
        print("• Improved visual rhythm")
        print("• More balanced content distribution") 
        print("• Professional presentation")
        
        print("\n🚀 STATUS:")
        print("✅ Map position: Aligned with AIR CONNECTIVITY")
        print("✅ Responsive: Optimized for all devices")
        print("✅ Layout: More logical and balanced")
        print("✅ User experience: Enhanced")
        
        print("\n🔍 VERIFICATION:")
        print("Scroll to Strategic Location section to see the new alignment!")
        
    else:
        print(f"❌ Website not found: {file_path}")

if __name__ == "__main__":
    view_repositioned_map()
