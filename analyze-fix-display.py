#!/usr/bin/env python3
import webbrowser
import os
import time

def analyze_and_fix_display():
    print("🔍 PHÂN TÍCH VẤN ĐỀ HIỂN THỊ LOCATION MAP")
    print("=" * 60)
    
    # Path to index.html
    file_path = "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/index.html"
    
    print("📊 PHÂN TÍCH KẾT QUẢ:")
    print("✅ Code đã được cập nhật: margin-top: 120px")
    print("❌ Browser hiển thị: Map vẫn ở vị trí cũ")
    print("")
    
    print("🔍 NGUYÊN NHÂN CÓ THỂ:")
    print("1. 🌐 Browser Cache - CSS cũ vẫn được cache")
    print("2. 💾 Browser Hard Refresh cần thiết")
    print("3. 🔧 CSS Specificity - rule khác override")
    print("4. 📱 Screen Size - responsive rule đang active")
    print("")
    
    print("🛠️ GIẢI PHÁP ĐỀ XUẤT:")
    print("1. Hard Refresh: Cmd+Shift+R (Mac) hoặc Ctrl+Shift+R (Windows)")
    print("2. Clear Browser Cache")
    print("3. Kiểm tra Developer Tools")
    print("4. Force CSS reload")
    print("")
    
    print("🚀 THỰC HIỆN FIX NGAY:")
    
    # Thêm timestamp để force reload CSS
    current_time = int(time.time())
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Thêm một CSS rule rõ ràng hơn để override
    css_fix = f"""
        /* FORCE MAP POSITION FIX - Timestamp: {current_time} */
        .location-map {{
            margin-top: 120px !important;
            position: relative !important;
        }}
        
        @media (max-width: 1024px) {{
            .location-map {{
                margin-top: 80px !important;
            }}
        }}
        
        @media (max-width: 768px) {{
            .location-map {{
                margin-top: 0px !important;
                order: -1;
            }}
        }}
        """
    
    # Tìm vị trí để chèn CSS fix
    if "/* FORCE MAP POSITION FIX" not in content:
        insert_position = content.find("</style>")
        if insert_position != -1:
            content = content[:insert_position] + css_fix + content[insert_position:]
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print("✅ Đã thêm CSS force fix với !important")
        else:
            print("❌ Không tìm thấy </style> tag")
    else:
        print("⚠️ CSS fix đã có sẵn")
    
    # Mở với force reload parameter
    file_url = f"file://{file_path}?v={current_time}"
    print(f"🌐 Opening with cache-busting: {file_url}")
    
    webbrowser.open(file_url)
    
    print("\n🎯 HƯỚNG DẪN KIỂM TRA:")
    print("1. Website sẽ mở trong 3 giây...")
    print("2. Nhấn Cmd+Shift+R (Mac) hoặc Ctrl+Shift+R để hard refresh")
    print("3. Mở Developer Tools (F12)")
    print("4. Vào tab Elements → tìm .location-map")
    print("5. Kiểm tra margin-top có được apply không")
    
    print("\n📊 KẾT QUẢ MONG ĐỢI:")
    print("• Map sẽ xuống thấp hơn")
    print("• Map bắt đầu ngang với AIR CONNECTIVITY")
    print("• Khoảng trống trên map sẽ lớn hơn")
    
    print("\n🔧 NẾU VẪN KHÔNG HOẠT ĐỘNG:")
    print("• Thử tắt và mở lại browser")
    print("• Thử browser khác (Chrome, Safari, Firefox)")
    print("• Kiểm tra CSS trong Developer Tools")
    
    time.sleep(3)
    print("\n✅ Fix applied! Check the result now!")

if __name__ == "__main__":
    analyze_and_fix_display()
