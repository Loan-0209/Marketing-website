#!/usr/bin/env python3
"""
Final test for hidden 300MW Data Center button
"""

import webbrowser
from pathlib import Path

def test_hidden_button():
    """Test website để kiểm tra nút 300MW Data Center đã bị ẩn"""
    
    project_root = Path.cwd()
    index_file = project_root / 'index.html'
    
    if not index_file.exists():
        print("❌ index.html not found!")
        return
    
    print("🎯 TESTING HIDDEN 300MW DATA CENTER BUTTON")
    print("=" * 50)
    
    # Launch website
    file_url = f"file://{index_file.absolute()}"
    print(f"📂 Opening: {file_url}")
    
    webbrowser.open(file_url)
    
    print("✅ Website opened in browser!")
    print()
    print("🔍 KIỂM TRA CÁC ĐIỂM SAU:")
    print()
    print("1️⃣ NÚT 300MW DATA CENTER:")
    print("   ❌ Nút orange '300MW Data Center' should be HIDDEN")
    print("   ✅ Map vẫn hiển thị đầy đủ")
    print("   ✅ Chỉ nút overlay bị ẩn, không ảnh hưởng map")
    print()
    print("2️⃣ MAP FUNCTIONALITY:")
    print("   ✅ Map vẫn hiển thị full image")
    print("   ✅ Scroll effect vẫn hoạt động")
    print("   ✅ Responsive design vẫn OK")
    print("   ✅ Other overlay elements vẫn visible")
    print()
    print("3️⃣ CONSOLE CHECK:")
    print("   🔧 Open browser console (F12)")
    print("   👀 Look for messages:")
    print("      • '🔍 Searching for 300MW Data Center button...'")
    print("      • '✅ Hidden X elements containing 300MW Data Center'")
    print("      • '👀 Observer set up to hide 300MW button...'")
    print()
    print("4️⃣ VISUAL VERIFICATION:")
    print("   ✅ Map shows: Thuan An Port, Da Nang City, legend")
    print("   ❌ NO orange '300MW Data Center' button visible")
    print("   ✅ HEART location marker still visible")
    print("   ✅ Other map elements unchanged")
    print()
    print("🔧 APPLIED SOLUTIONS:")
    print("   • CSS hiding rules (10+ methods)")
    print("   • JavaScript backup (text scanning)")
    print("   • Dynamic content observer")
    print("   • Multiple execution timings")
    print()
    print("⚠️  IF BUTTON STILL VISIBLE:")
    print("   1. Force refresh: Cmd+Shift+R / Ctrl+Shift+R")
    print("   2. Check browser console for JS errors")
    print("   3. Try different browsers") 
    print("   4. Report which elements are still visible")

if __name__ == "__main__":
    test_hidden_button()
