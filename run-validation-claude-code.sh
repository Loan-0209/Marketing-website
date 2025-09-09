#!/bin/bash
# 🔍 SCRIPT CHẠY CLAUDE CODE ĐỂ KIỂM TRA KẾT QUẢ

echo "🔍 CLAUDE CODE - KIỂM TRA KẾT QUẢ DI CHUYỂN DATA CENTERS"
echo "======================================================="
echo ""

# Kiểm tra Claude Code
if ! command -v claude-code &> /dev/null; then
    echo "❌ Claude Code chưa được cài đặt!"
    echo ""
    echo "📥 CÀI ĐẶT CLAUDE CODE:"
    echo "npm install -g @anthropic-ai/claude-code"
    echo ""
    echo "📚 Docs: https://docs.anthropic.com/en/docs/claude-code"
    exit 1
fi

echo "✅ Claude Code đã sẵn sàng"
echo ""

# Thông tin về kiểm tra
echo "🎯 KIỂM TRA NHỮNG GÌ:"
echo "  📍 Vị trí Data Centers: DC1(600,0), DC2(550,80), DC3(650,60)"
echo "  🌊 Tránh vùng sông: x(200-400), z(-100 đến 300)"
echo "  ⚪ Cooling Towers: 4 towers/data center"
echo "  🔧 Chức năng và performance"
echo ""

# Kiểm tra files cần thiết
echo "📋 KIỂM TRA FILES:"
if [ -f "3d-smart-city.html" ]; then
    echo "  ✅ 3d-smart-city.html"
else
    echo "  ❌ 3d-smart-city.html - FILE CHÍNH KHÔNG TỒN TẠI!"
    exit 1
fi

if [ -f "claude-code-validation-prompt.txt" ]; then
    echo "  ✅ claude-code-validation-prompt.txt"
else
    echo "  ❌ validation prompt không tồn tại"
fi

if [ -f "sample-validation-script.js" ]; then
    echo "  ✅ sample-validation-script.js (script mẫu)"
else
    echo "  ⚠️ sample validation script không tồn tại"
fi

echo ""

# Hiển thị menu lựa chọn
echo "🎯 CHỌN CÁCH KIỂM TRA:"
echo ""
echo "1. 📋 Copy prompt và paste vào Claude Code"
echo "2. 📁 Sử dụng file prompt"
echo "3. 🚀 Chạy lệnh ngắn gọn"
echo "4. 📖 Xem hướng dẫn chi tiết"
echo ""

read -p "Chọn phương thức (1-4): " choice

case $choice in
    1)
        echo ""
        echo "📋 COPY PROMPT NÀY VÀO CLAUDE CODE:"
        echo "=================================="
        echo ""
        cat claude-code-validation-prompt.txt
        echo ""
        echo "🚀 Khởi động Claude Code..."
        claude-code
        ;;
    2)
        echo ""
        echo "📁 Sử dụng file prompt..."
        claude-code --prompt-file=claude-code-validation-prompt.txt
        ;;
    3)
        echo ""
        echo "🚀 Chạy lệnh ngắn gọn..."
        claude-code "Phân tích file 3d-smart-city.html - kiểm tra Data Centers đã di chuyển đúng vị trí DC1(600,0), DC2(550,80), DC3(650,60) chưa, tránh xa sông (x:200-400, z:-100-300). Tạo validation script và báo cáo chi tiết kết quả."
        ;;
    4)
        echo ""
        echo "📖 Hiển thị hướng dẫn chi tiết..."
        if [ -f "CLAUDE-CODE-VALIDATION-PROMPT.md" ]; then
            cat CLAUDE-CODE-VALIDATION-PROMPT.md
        else
            echo "❌ File hướng dẫn không tồn tại"
        fi
        ;;
    *)
        echo "❌ Lựa chọn không hợp lệ"
        exit 1
        ;;
esac

echo ""
echo "📊 SAU KHI CLAUDE CODE HOÀN THÀNH:"
echo "  ✅ Sẽ có báo cáo chi tiết về vị trí Data Centers"
echo "  ✅ Validation script để test trong browser"
echo "  ✅ Recommendations nếu cần fix"
echo ""
echo "🎯 ĐỂ TEST VALIDATION SCRIPT:"
echo "  1. Mở http://localhost:8000/3d-smart-city.html"
echo "  2. Nhấn F12, chọn Console"
echo "  3. Paste validation script Claude Code tạo ra"
echo "  4. Xem kết quả kiểm tra"
