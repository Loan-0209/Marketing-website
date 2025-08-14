#!/usr/bin/env python3
import os
import webbrowser
import time

print("🧠 KHỞI ĐỘNG 3D CAMPUS VỚI NEURAL NETWORKS...")

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
        
        print("\n🧠 NEURAL NETWORK FUNCTIONS:")
        print("   • initNeuralNetworks() - Kích hoạt AI neural networks")
        print("   • getNeuralStats() - Xem thống kê networks")
        print("   • removeNeuralNetworks() - Xóa tất cả networks")
        
        print("\n🛠️ DEBUG FUNCTIONS:")
        print("   • debugBrowserSync() - Chẩn đoán toàn diện")
        print("   • forceCompleteVisibility() - Force hiển thị")
        print("   • switchCameraView() - Đổi góc camera")  
        print("   • emergencyReset() - Reset khẩn cấp")
        
        print("\n📝 HƯỚNG DẪN SỬ DỤNG:")
        print("   1. Đợi 3D scene load xong (3-5 giây)")
        print("   2. Mở Developer Console (F12)")
        print("   3. Chạy: initNeuralNetworks()")
        print("   4. Xem AI neural networks phủ khắp thành phố!")
        
        print("\n🎯 NEURAL NETWORK FEATURES:")
        print("   🔵 Hexagonal node grids trên tòa nhà")
        print("   ⚡ Glowing connection lines")
        print("   🎬 Pulsing animations (0.5-2.0 intensity)")
        print("   📊 4 mức độ density (sparse/medium/dense/ultra)")
        print("   🚀 Optimized cho 146+ tòa nhà")
        print("   🧠 AI brain activity effects")
        
    except Exception as e:
        print(f"❌ Lỗi mở browser: {e}")
        
else:
    print("❌ Không tìm thấy file 3d-campus-smart-city-complete.html!")
    print("📂 Files có sẵn:")
    for f in os.listdir("."):
        if f.endswith(".html") and "3d" in f:
            print(f"   - {f}")

print("\n🎉 SẴN SÀNG KHÁM PHÁ AI NEURAL NETWORKS!")