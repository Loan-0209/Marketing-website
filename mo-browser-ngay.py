#!/usr/bin/env python3
import os
import webbrowser
import time

print("🚀 Đang mở 3D Campus Browser...")

# Change to project directory
os.chdir("/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18")

# Check if file exists
if os.path.exists("3d-campus-smart-city-complete.html"):
    print("✅ File 3d-campus-smart-city-complete.html tìm thấy!")
    
    # Get full file path
    file_path = os.path.abspath("3d-campus-smart-city-complete.html")
    file_url = f"file://{file_path}"
    
    print(f"📂 Path: {file_path}")
    print(f"🌐 URL: {file_url}")
    
    # Open in browser
    try:
        webbrowser.open(file_url)
        print("✅ Đã mở browser thành công!")
        
        print("\n🛠️ Debug functions có sẵn trong console:")
        print("   • debugBrowserSync() - Chẩn đoán toàn diện")
        print("   • forceCompleteVisibility() - Force hiển thị")
        print("   • switchCameraView() - Đổi góc camera")  
        print("   • emergencyReset() - Reset khẩn cấp")
        
        print("\n📝 Hướng dẫn:")
        print("   1. Đợi 3D scene load xong")
        print("   2. Mở Developer Console (F12)")
        print("   3. Chạy: debugBrowserSync()")
        print("   4. Xem kết quả popup + console")
        
    except Exception as e:
        print(f"❌ Lỗi mở browser: {e}")
        
else:
    print("❌ Không tìm thấy file 3d-campus-smart-city-complete.html!")
    print("📂 Files có sẵn:")
    for f in os.listdir("."):
        if f.endswith(".html") and "3d" in f:
            print(f"   - {f}")

print("\n🎯 Hoàn thành!")