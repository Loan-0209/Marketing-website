# 🚀 HƯỚNG DẪN KHỞI ĐỘNG HEART WEBSITE LOCALHOST SERVER

## Cách 1: Sử dụng Terminal (Khuyến nghị)

1. Mở Terminal
2. Chạy lệnh:
```bash
cd "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"
python3 -m http.server 8000
```
3. Mở browser và truy cập: `http://localhost:8000`

## Cách 2: Double-click Python file

1. Double-click file: `quick_localhost.py`
2. Browser sẽ tự động mở

## Cách 3: Sử dụng Command Script

1. Double-click file: `KHOI-DONG-LOCALHOST-SERVER.command`
2. Browser sẽ tự động mở

## 🌐 CÁC URL AVAILABLE

Sau khi server khởi động, bạn có thể truy cập:

- **Trang chính**: http://localhost:8000/
- **Homepage**: http://localhost:8000/index.html
- **Heart Standalone**: http://localhost:8000/heart_standalone.html
- **3D Campus Interactive**: http://localhost:8000/3d-campus-interactive.html
- **About**: http://localhost:8000/about.html
- **Facilities**: http://localhost:8000/facilities.html
- **Master Plan**: http://localhost:8000/master-plan.html
- **Contact**: http://localhost:8000/contact.html
- **Technology**: http://localhost:8000/technology.html
- **Investment**: http://localhost:8000/investment.html
- **News**: http://localhost:8000/news.html

## ⚠️ Lưu ý

- Server sẽ chạy trên port 8000, nếu port này bận thì sẽ tự động chuyển sang port 8001
- Để dừng server, nhấn `Ctrl+C` trong Terminal
- Đảm bảo không có ứng dụng nào khác đang sử dụng port 8000/8001

## 🔧 Khắc phục sự cố

Nếu gặp lỗi "Address already in use":
1. Thử port khác: `python3 -m http.server 8001`
2. Hoặc kill process đang sử dụng port: `lsof -ti:8000 | xargs kill -9`

## ✅ Server đã sẵn sàng!

Giờ bạn có thể truy cập HEART website qua localhost URL thay vì file:// protocol.