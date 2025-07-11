# 🔧 HƯỚNG DẪN KHẮC PHỤC LỖI TRUY CẬP WEBSITE

## ❌ **Lỗi thường gặp và cách khắc phục**

### 1. **Lỗi "không thể truy cập trang web"**

#### ✅ **Cách khắc phục:**

**Bước 1: Kiểm tra server có chạy không**
```bash
# Mở Terminal và chạy:
cd /Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18
```

**Bước 2: Khởi động server**

**Cách 1 - Sử dụng npm (Khuyến nghị):**
```bash
npm start
```

**Cách 2 - Sử dụng Python:**
```bash
python3 -m http.server 3000
```

**Cách 3 - Sử dụng script tự động:**
- Double-click vào file `KHỞI_ĐỘNG_WEBSITE.command`
- Hoặc double-click vào file `open-heart-website.command`

### 2. **Lỗi Port đã được sử dụng**

#### ✅ **Khắc phục:**
```bash
# Tìm và đóng process đang sử dụng port
lsof -ti:3000 | xargs kill -9

# Hoặc thử port khác
python3 -m http.server 8080
```

### 3. **Lỗi CSS/JS không load**

#### ✅ **Kiểm tra files:**
```bash
ls css/     # Phải có: main.css, components.css, responsive.css
ls js/      # Phải có: main.js, parallax.js, navigation.js
```

### 4. **Website mở nhưng thiếu design**

#### ✅ **Kiểm tra paths:**
- Đảm bảo các file CSS được link đúng trong HTML
- Kiểm tra browser Console (F12) để xem lỗi

---

## 🚀 **CÁCH MỞ WEBSITE NHANH NHẤT**

### **Option 1: Script tự động (Khuyến nghị)**
1. Double-click vào `KHỞI_ĐỘNG_WEBSITE.command`
2. Đợi 3-5 giây để server khởi động
3. Browser sẽ tự động mở tại `http://localhost:3000`

### **Option 2: Manual**
1. Mở Terminal
2. Chạy: `cd /Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18`
3. Chạy: `npm start` hoặc `python3 -m http.server 3000`
4. Mở browser và vào: `http://localhost:3000`

### **Option 3: Test page**
1. Khởi động server theo Option 1 hoặc 2
2. Vào: `http://localhost:3000/test.html`
3. Kiểm tra tất cả links hoạt động

---

## 📱 **KIỂM TRA WEBSITE HOẠT ĐỘNG**

### **Trang chính cần test:**
- ✅ **Homepage:** `http://localhost:3000/index.html`
  - Hero section với animation
  - Stats counters
  - Feature cards
  - Responsive design

- ✅ **About page:** `http://localhost:3000/about.html`  
  - Building parallax effect (33.33vw)
  - Fixed header không bị che
  - Content scroll độc lập
  - Window animations

- ✅ **Test page:** `http://localhost:3000/test.html`
  - Kiểm tra tổng thể
  - Links đến các trang khác

### **Tính năng cần kiểm tra:**
- 🏢 **Building Parallax:** Scroll để xem building di chuyển
- 📱 **Responsive:** Resize browser window
- 🎨 **Colors:** Màu chính #4A6CF7, orange #FFA726
- 🚀 **Animations:** Fade-in effects, hover states
- 📊 **Stats:** Counter animations trên homepage

---

## 🔍 **TROUBLESHOOTING**

### **Nếu vẫn gặp lỗi:**

1. **Restart máy** và thử lại
2. **Check permissions:**
   ```bash
   chmod +x *.command
   chmod +x *.sh
   ```
3. **Clear browser cache:** Ctrl+F5 hoặc Cmd+Shift+R
4. **Thử browser khác:** Chrome, Safari, Firefox
5. **Check Console:** F12 → Console tab để xem lỗi JavaScript

### **Liên hệ support:**
- 📧 Email: developer@heart-tech.vn  
- 💬 GitHub Issues: repo/issues
- 📞 Hotline: 0123-456-789

---

## ✅ **WEBSITE ĐÃ SẴN SÀNG!**

🎯 **Tất cả tính năng đã được triển khai:**
- ✅ Fixed header navigation
- ✅ Building parallax effect (33.33vw)
- ✅ Responsive design (Desktop/Tablet/Mobile)
- ✅ Color palette theo yêu cầu
- ✅ Smooth animations
- ✅ Performance optimized
- ✅ Cross-browser compatible

🚀 **Enjoy your HEART Technology Park website!**