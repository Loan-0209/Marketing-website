#!/bin/bash

echo "🔍 CHẨN ĐOÁN LỖI WEB SERVER"
echo "=========================="

# Check current directory
echo -e "\n📂 KIỂM TRA THỦ MỤC:"
current_dir=$(pwd)
expected_dir="/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"

echo "Thư mục hiện tại: $current_dir"
echo "Thư mục mong muốn: $expected_dir"

if [[ "$current_dir" != "$expected_dir" ]]; then
    echo "❌ SAI THỦ MỤC! Chuyển đến thư mục đúng..."
    cd "$expected_dir" || {
        echo "❌ Không thể chuyển đến thư mục project!"
        exit 1
    }
    echo "✅ Đã chuyển đến thư mục đúng"
else
    echo "✅ Đúng thư mục"
fi

# Check HTML files
echo -e "\n📄 KIỂM TRA FILE HTML:"
html_count=$(ls -1 *.html 2>/dev/null | wc -l)
if [ $html_count -gt 0 ]; then
    echo "✅ Tìm thấy $html_count file HTML:"
    ls -la *.html | head -5
    if [ $html_count -gt 5 ]; then
        echo "   ... và $((html_count - 5)) files khác"
    fi
else
    echo "❌ Không tìm thấy file HTML nào!"
fi

# Check important files
echo -e "\n📋 KIỂM TRA FILE QUAN TRỌNG:"
important_files=("index.html" "project-dashboard.html" "minimal-server.py")
for file in "${important_files[@]}"; do
    if [ -f "$file" ]; then
        size=$(ls -lh "$file" | awk '{print $5}')
        echo "✅ $file ($size)"
    else
        echo "❌ $file - KHÔNG TỒN TẠI"
    fi
done

# Check ports
echo -e "\n🔌 KIỂM TRA PORTS:"
ports=(8080 8888 9999 3000 5000)
available_ports=()

for port in "${ports[@]}"; do
    if lsof -ti:$port > /dev/null 2>&1; then
        pid=$(lsof -ti:$port)
        process=$(ps -p $pid -o comm= 2>/dev/null || echo "unknown")
        echo "❌ Port $port: ĐANG SỬ DỤNG (PID: $pid, Process: $process)"
    else
        echo "✅ Port $port: SẴN SÀNG"
        available_ports+=($port)
    fi
done

echo "📊 Có ${#available_ports[@]} ports sẵn sàng"

# Check Python servers
echo -e "\n🐍 KIỂM TRA PYTHON SERVERS:"
python_servers=$(ps aux | grep "python.*http.server" | grep -v grep)
if [ -n "$python_servers" ]; then
    echo "🐍 Python servers đang chạy:"
    echo "$python_servers" | while read line; do
        pid=$(echo $line | awk '{print $2}')
        echo "   PID: $pid"
    done
else
    echo "❌ Không có Python HTTP server nào đang chạy"
fi

# Check network
echo -e "\n🌐 KIỂM TRA MẠNG:"
if ping -c 1 localhost > /dev/null 2>&1; then
    localhost_ip=$(ping -c 1 localhost | grep PING | awk '{print $3}' | tr -d '()')
    echo "✅ localhost resolves to: $localhost_ip"
else
    echo "❌ Không thể ping localhost"
fi

# Check system resources
echo -e "\n💾 KIỂM TRA TÀI NGUYÊN:"
if command -v df > /dev/null; then
    disk_usage=$(df -h . | tail -1 | awk '{print $5}')
    available_space=$(df -h . | tail -1 | awk '{print $4}')
    echo "💿 Disk: $disk_usage used, $available_space available"
fi

# Test simple connection
echo -e "\n🧪 TEST KẾT NỐI:"
test_port=8080
if [ ${#available_ports[@]} -gt 0 ]; then
    test_port=${available_ports[0]}
fi

echo "Thử kết nối đến localhost:$test_port..."
if timeout 5 bash -c "</dev/tcp/localhost/$test_port" 2>/dev/null; then
    echo "✅ Có thể kết nối đến port $test_port"
else
    echo "❌ Không thể kết nối đến port $test_port"
fi

# Summary and recommendations
echo -e "\n🎯 TỔNG KẾT VÀ KHUYẾN NGHỊ:"
echo "================================"

if [ $html_count -eq 0 ]; then
    echo "🔴 VẤNĐỀ NGHIÊM TRỌNG: Không có file HTML!"
    echo "   → Kiểm tra lại thư mục project"
elif [ ${#available_ports[@]} -eq 0 ]; then
    echo "🔴 VẤNĐỀ: Tất cả ports đều bận!"
    echo "   → Chạy: pkill -f python"
    echo "   → Thử port khác: python3 -m http.server 8888"
else
    echo "✅ CƠ BẢN OK! Có thể khởi động server"
    echo "   → Chạy: python3 minimal-server.py"
    echo "   → Hoặc: python3 -m http.server $test_port"
    echo "   → Mở: http://localhost:$test_port/"
fi

echo -e "\n🛠️ NẾU VẪN KHÔNG HOẠT ĐỘNG:"
echo "1. Khởi động lại Terminal"
echo "2. Tắt firewall: System Preferences → Security → Firewall → Off"
echo "3. Thử browser khác (Chrome, Firefox, Safari)"
echo "4. Thử IP khác: http://127.0.0.1:$test_port/"
echo "5. Khởi động lại máy tính"

echo -e "\n📞 LIÊN HỆ HỖ TRỢ:"
echo "Nếu tất cả đều thất bại, có thể là vấn đề hệ thống sâu hơn"
echo "cần kiểm tra network configuration hoặc security settings."