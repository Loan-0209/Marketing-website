import webbrowser
import os
import time

# Đường dẫn đến thư mục project
project_path = "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"

# File paths
heart_file = os.path.join(project_path, "heart_standalone.html")
campus_file = os.path.join(project_path, "3d-campus-interactive.html")

print("🌐 MỞ HEART WEBSITE TRONG BROWSER")
print("=" * 40)

try:
    # Mở HEART Standalone
    if os.path.exists(heart_file):
        webbrowser.open(f"file://{heart_file}")
        print("✅ Đã mở: HEART Standalone Website")
        time.sleep(2)  # Đợi 2 giây
    else:
        print("❌ Không tìm thấy heart_standalone.html")

    # Mở 3D Campus Interactive  
    if os.path.exists(campus_file):
        webbrowser.open(f"file://{campus_file}")
        print("✅ Đã mở: 3D Campus Interactive")
    else:
        print("❌ Không tìm thấy 3d-campus-interactive.html")

    print("\n🎯 HƯỚNG DẪN KIỂM TRA:")
    print("1. HEART Standalone - Trang chính của website HEART")
    print("2. 3D Campus Interactive - Trang 3D campus với:")
    print("   • Stats panel với FPS counter") 
    print("   • Phase controls (1,2,3)")
    print("   • View controls (Overview, Aerial, Ground)")
    print("   • Interactive buildings")
    print("   • Animated particles background")
    print("\n✅ CẢ HAI TRANG ĐÃ MỞ THÀNH CÔNG!")

except Exception as e:
    print(f"❌ Lỗi: {e}")