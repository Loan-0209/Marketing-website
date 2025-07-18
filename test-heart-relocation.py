#!/usr/bin/env python3
"""
Test HEART Button Relocation - Launch website để kiểm tra
"""

import webbrowser
from pathlib import Path

def test_heart_relocation():
    """Test website để kiểm tra HEART button đã được di chuyển"""
    
    project_root = Path.cwd()
    index_file = project_root / 'index.html'
    
    if not index_file.exists():
        print("❌ index.html not found!")
        return
    
    print("🎯 TESTING HEART BUTTON RELOCATION")
    print("=" * 50)
    
    # Launch website
    file_url = f"file://{index_file.absolute()}"
    print(f"📂 Opening: {file_url}")
    
    webbrowser.open(file_url)
    
    print("✅ Website opened in browser!")
    print()
    print("🔍 KIỂM TRA CÁC ĐIỂM SAU:")
    print()
    print("1️⃣ HEART BUTTON POSITION:")
    print("   📍 HEART button có xuất hiện ở vị trí 'Hue Hi Tech Park' không?")
    print("   🎨 Button có màu xanh với icon location (📍) không?")
    print("   ❌ Button HEART cũ có bị ẩn không?")
    print("   ✅ Vị trí có nằm gần text 'Hue Hi Tech Park 300MW Data Center' không?")
    print()
    print("2️⃣ VISUAL STYLING:")
    print("   🎨 Background: Blue gradient (4A90E2 → 357ABD)")
    print("   📝 Text: White 'HEART' với icon 📍")
    print("   🔄 Border: White rounded với shadow")
    print("   🖱️ Hover: Scale + darker blue")
    print()
    print("3️⃣ RESPONSIVE BEHAVIOR:")
    print("   💻 Desktop: 35% from left, 45% from top")
    print("   📱 Tablet: 40% from left, 50% from top")
    print("   📱 Mobile: 45% from left, 55% from top")
    print("   🔄 Resize browser để test responsive")
    print()
    print("4️⃣ INTERACTIVITY:")
    print("   🖱️ Click vào HEART button")
    print("   💬 Có xuất hiện alert message không?")
    print("   ✨ Hover effects có hoạt động không?")
    print()
    print("5️⃣ CONSOLE CHECK:")
    print("   🔧 Open browser console (F12)")
    print("   👀 Look for messages:")
    print("      • '🎯 Moving HEART button to Hue Hi Tech Park position...'")
    print("      • '✅ HEART button relocated to Hue Hi Tech Park position'")
    print("      • '📍 HEART button positioned at X% Y%'")
    print()
    print("🎯 SUCCESS CRITERIA:")
    print("   ✅ HEART button visible ở vị trí Hue Hi Tech Park")
    print("   ✅ Styling đẹp với blue gradient")
    print("   ✅ Responsive positioning")
    print("   ✅ Click functionality works")
    print("   ✅ Map functionality không bị ảnh hưởng")
    print()
    print("⚠️  IF POSITION NOT PERFECT:")
    print("   1. Note exact position needed")
    print("   2. Browser console có errors không?")
    print("   3. Try refresh page")
    print("   4. Test on different screen sizes")
    print()
    print("🔧 FINE-TUNING OPTIONS:")
    print("   • Adjust left/top percentages if needed")
    print("   • Modify colors or styling")
    print("   • Change button size or text")
    print("   • Alternative positioning available")

if __name__ == "__main__":
    test_heart_relocation()
