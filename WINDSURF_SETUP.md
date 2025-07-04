# Hướng dẫn chạy dự án HEART Website trên Windsurf

## 🚀 Hướng dẫn setup nhanh

### Bước 1: Mở dự án trong Windsurf
1. Khởi động Windsurf
2. Chọn **File** → **Open Folder**
3. Navigate đến `/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18`
4. Click **Open**

### Bước 2: Cài đặt Live Server Extension (Nếu chưa có)
1. Mở Extensions panel bằng cách:
   - Nhấn `Cmd+Shift+X` (macOS) hoặc `Ctrl+Shift+X` (Windows/Linux)
   - Hoặc click vào icon Extensions ở sidebar trái
2. Tìm kiếm **"Live Server"**
3. Click **Install** trên extension "Live Server" by Ritwick Dey

### Bước 3: Chạy website
**Cách 1: Sử dụng Live Server (Khuyến nghị)**
1. Mở file `index.html` trong Windsurf
2. Click chuột phải vào file `index.html`
3. Chọn **"Open with Live Server"**
4. Website sẽ mở tự động trong browser tại `http://localhost:5500`

**Cách 2: Chạy trực tiếp trong browser**
1. Click chuột phải vào file `index.html`
2. Chọn **"Open in Default Browser"**
3. Website sẽ mở trực tiếp từ file system

**Cách 3: Sử dụng npm (Advanced)**
```bash
# Mở Terminal trong Windsurf (Terminal → New Terminal)
npm install
npm start
```

### Bước 4: Test website
1. Website sẽ hiển thị màn hình loading đầu tiên
2. Navigate qua các sections: Home, About Us, Master Plan, Facilities, Investment, Technology, News, Contact
3. Test login functionality:
   - Click button **"Login"** ở navigation
   - Username: `admin`
   - Password: `heart2024`
   - Sau khi login thành công, bạn có thể thêm news articles

## 🛠️ Troubleshooting

### Problem: Live Server không hoạt động
**Solution:**
1. Restart Windsurf
2. Đảm bảo Live Server extension đã được install và enable
3. Thử click "Go Live" ở status bar (thanh trạng thái ở dưới cùng)

### Problem: Website không load đúng styles
**Solution:**
1. Hard refresh browser: `Cmd+Shift+R` (macOS) hoặc `Ctrl+Shift+F5` (Windows)
2. Kiểm tra Developer Tools (F12) để xem có lỗi CSS nào không

### Problem: JavaScript không hoạt động
**Solution:**
1. Mở Developer Tools (F12)
2. Check Console tab để xem errors
3. Đảm bảo JavaScript được enable trong browser

### Problem: Port 5500 đã được sử dụng
**Solution:**
1. Dừng Live Server hiện tại (click "Port : 5500" ở status bar)
2. Hoặc change port trong Live Server settings

## 📁 Cấu trúc Project

```
Test_WEBSITE_2025.06.18/
├── index.html              # File chính của website
├── README.md               # Documentation
├── WINDSURF_SETUP.md       # File hướng dẫn này
├── package.json            # NPM configuration
└── .gitignore             # Git ignore rules
```

## 🎨 Customization trong Windsurf

### Thay đổi màu sắc
1. Mở file `index.html`
2. Tìm phần `:root` trong CSS (dòng ~15)
3. Thay đổi các biến CSS:
```css
:root {
    --primary-blue: #1e3a8a;    /* Màu xanh chính */
    --primary-yellow: #fbbf24;  /* Màu vàng chính */
    /* ... các màu khác */
}
```

### Thêm content mới
1. Tìm section tương ứng trong HTML
2. Copy/paste structure tương tự
3. Thay đổi nội dung theo ý muốn

### Thêm animations mới
1. Tìm phần `@keyframes` trong CSS
2. Thêm animation mới
3. Apply vào elements với `animation` property

## 🔧 Development Tips trong Windsurf

### 1. Auto-completion
- Windsurf có built-in HTML/CSS/JS auto-completion
- Gõ `!` và nhấn Tab để tạo HTML template nhanh

### 2. Multi-cursor editing
- `Cmd+Click` (macOS) hoặc `Alt+Click` (Windows) để tạo multiple cursors
- Hữu ích khi muốn edit nhiều chỗ cùng lúc

### 3. Integrated Terminal
- `Cmd+`` (macOS) hoặc `Ctrl+`` (Windows) để mở terminal
- Có thể chạy npm commands trực tiếp

### 4. File Navigation
- `Cmd+P` (macOS) hoặc `Ctrl+P` (Windows) để quick open files
- `Cmd+Shift+P` (macOS) hoặc `Ctrl+Shift+P` (Windows) để mở Command Palette

## 📱 Testing Responsive Design

### 1. Browser DevTools
- F12 → Toggle device toolbar
- Test các screen sizes khác nhau

### 2. Live Server với mobile
- Lấy IP address của máy: `ifconfig` (macOS) hoặc `ipconfig` (Windows)
- Access từ mobile: `http://[YOUR_IP]:5500`

## 🚀 Production Deployment

### 1. Static hosting (Netlify, Vercel)
- Drag & drop thư mục project vào Netlify
- Hoặc connect với Git repository

### 2. GitHub Pages
1. Push code lên GitHub repository
2. Settings → Pages → Deploy from branch main

### 3. Traditional hosting
- Upload tất cả files vào web server
- Đảm bảo `index.html` là file chính

## 📝 Notes

- Website là static HTML/CSS/JavaScript thuần, không cần backend
- Login system chỉ là demo (client-side only)
- Để production thật, cần implement proper authentication
- News management hiện tại chỉ lưu trong memory, refresh sẽ mất data

## 🆘 Support

Nếu gặp vấn đề, hãy check:
1. Browser console (F12 → Console)
2. Network tab để xem có file nào load fail
3. Windsurf output panel để xem có errors
4. Live Server output trong Windsurf terminal

## ✅ Checklist sau khi setup

- [ ] Website load thành công
- [ ] Navigation giữa các sections hoạt động
- [ ] Responsive design work trên mobile/tablet
- [ ] Login functionality hoạt động
- [ ] Form submission hiển thị success message
- [ ] Animations và hover effects work
- [ ] Live Server auto-reload khi edit code

Chúc bạn coding vui vẻ! 🎉
