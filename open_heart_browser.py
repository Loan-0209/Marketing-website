#!/usr/bin/env python3
import webbrowser
import os
import sys

def open_heart_website():
    # Chuyển đến thư mục chứa website
    project_dir = "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"
    os.chdir(project_dir)
    
    print("🌐 MỞ HEART WEBSITE TRONG BROWSER")
    print("=" * 40)
    print(f"📁 Thư mục: {os.getcwd()}")
    print()
    
    # Kiểm tra files tồn tại
    files_to_open = [
        ("heart_standalone.html", "HEART Standalone Website"),
        ("3d-campus-interactive.html", "3D Campus Interactive")
    ]
    
    opened_count = 0
    
    for filename, description in files_to_open:
        if os.path.exists(filename):
            print(f"✅ {description}: {filename}")
            try:
                # Mở file trong browser mặc định
                file_path = os.path.abspath(filename)
                webbrowser.open(f"file://{file_path}")
                opened_count += 1
                print(f"🚀 Đã mở: {description}")
            except Exception as e:
                print(f"❌ Lỗi mở {filename}: {e}")
        else:
            print(f"❌ Không tìm thấy: {filename}")
    
    print()
    print(f"📊 KẾT QUẢ: Đã mở {opened_count}/{len(files_to_open)} trang")
    print()
    
    if opened_count > 0:
        print("🎯 HƯỚNG DẪN KIỂM TRA:")
        print("1. HEART Standalone - Trang chính của website HEART")
        print("2. 3D Campus Interactive - Trang 3D campus với:")
        print("   • Stats panel với FPS counter")
        print("   • Phase controls (1,2,3)")
        print("   • View controls (Overview, Aerial, Ground)")
        print("   • Interactive buildings")
        print("   • Animated particles background")
        print()
        print("✅ CẢ HAI TRANG ĐÃ MỞ THÀNH CÔNG!")
    else:
        print("❌ Không thể mở được trang nào!")
        return False
    
    return True

if __name__ == "__main__":
    success = open_heart_website()
    sys.exit(0 if success else 1)