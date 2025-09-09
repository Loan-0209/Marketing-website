#!/bin/bash
# 🚀 KHỞI ĐỘNG CLAUDE CODE VỚI PROMPT KHÔI PHỤC

echo "🚀 CLAUDE CODE - KHÔI PHỤC BACKUP 3D SMART CITY"
echo "==============================================="
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

# Thông tin file backup
echo "📄 FILE BACKUP CẦN KHÔI PHỤC:"
echo "  📁 File: 3d-smart-city-broken-backup-20250828_143000.html"
echo "  📊 Size: 174KB (4,602 dòng)"
echo "  📅 Date: 28/08/2025"
echo "  ✨ Version: Enhanced Smart City v2.0"
echo ""

# Hiển thị các tùy chọn
echo "🎯 CHỌN CÁCH THỰC HIỆN:"
echo ""
echo "1. 📋 Copy prompt và paste vào Claude Code"
echo "2. 📁 Sử dụng file prompt"
echo "3. 🚀 Chạy lệnh trực tiếp"
echo ""

read -p "Chọn phương thức (1-3): " choice

case $choice in
    1)
        echo ""
        echo "📋 COPY PROMPT NÀY VÀO CLAUDE CODE:"
        echo "=================================="
        echo ""
        cat claude-code-prompt.txt
        echo ""
        echo "🚀 Khởi động Claude Code..."
        claude-code
        ;;
    2)
        echo ""
        echo "📁 Sử dụng file prompt..."
        claude-code --prompt-file=claude-code-prompt.txt
        ;;
    3)
        echo ""
        echo "🚀 Chạy lệnh trực tiếp..."
        claude-code "Khôi phục file 3d-smart-city-broken-backup-20250828_143000.html (174KB, Enhanced Smart City v2.0 từ 28/08/2025) thành 3d-smart-city.html. Backup file cũ trước, copy file backup, verify kết quả, tạo script khởi động server."
        ;;
    *)
        echo "❌ Lựa chọn không hợp lệ"
        exit 1
        ;;
esac

echo ""
echo "✅ Hoàn tất! Kiểm tra kết quả và khởi động website:"
echo "python3 -m http.server 8000"
echo "http://localhost:8000/3d-smart-city.html"
