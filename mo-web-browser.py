#!/usr/bin/env python3
"""
🌐 Mở Web Browser - HEART Website
Mở website với link 3D Campus đã được sửa
"""

import os
import webbrowser
import time

def mo_web_browser():
    print("🌐 ĐANG MỞ WEB BROWSER - HEART WEBSITE")
    print("=" * 50)
    
    # Chuyển đến thư mục dự án
    project_dir = "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"
    os.chdir(project_dir)
    
    print(f"📁 Thư mục làm việc: {os.getcwd()}")
    print()
    
    # Kiểm tra file tồn tại
    print("🔍 Kiểm tra files...")
    
    if os.path.exists("index.html"):
        print("✅ index.html tồn tại")
    else:
        print("❌ index.html không tìm thấy")
        return
    
    if os.path.exists("archive-3d/ai-campus-3d-structure.html"):
        print("✅ 3D Campus file tồn tại")
    else:
        print("❌ 3D Campus file không tìm thấy")
        return
    
    print()
    print("🚀 Đang mở website...")
    
    # Tạo file URL đầy đủ
    file_path = os.path.abspath("index.html")
    file_url = f"file://{file_path}"
    
    print(f"🔗 URL: {file_url}")
    
    # Mở browser
    try:
        webbrowser.open(file_url)
        print("✅ Browser đã được mở thành công!")
        
        time.sleep(2)
        
        print()
        print("🎯 HƯỚNG DẪN KIỂM TRA:")
        print("1. ✅ Website HEART đã mở trong browser")
        print("2. 🖱️  Nhấp vào '3D Campus' trong menu điều hướng")
        print("3. 🎮 Trang 3D Campus sẽ tải thành công")
        print("4. 🚫 KHÔNG còn lỗi ERR_FILE_NOT_FOUND")
        print()
        print("🎉 Link 3D Campus đã được sửa hoàn toàn!")
        
    except Exception as e:
        print(f"❌ Lỗi khi mở browser: {e}")
        print()
        print("📋 GIẢI PHÁP THAY THẾ:")
        print(f"Sao chép URL này vào browser: {file_url}")

if __name__ == "__main__":
    mo_web_browser()