# 📰 HEART News Management System - Hướng dẫn sử dụng

## 🎯 Tổng quan
Hệ thống quản lý tin tức của HEART cho phép admin dễ dàng thêm, sửa, xóa và quản lý các bài viết tin tức trên website.

## 🔐 Đăng nhập Admin

### Bước 1: Access Admin
1. Click button **"Login"** ở navigation bar
2. Nhập thông tin:
   - **Username:** `admin`
   - **Password:** `heart2024`
3. Click **"Login"**

### Kết quả sau khi đăng nhập:
- ✅ Button "Login" chuyển thành "Logout"
- ✅ Button "+ Add News" xuất hiện trong section News
- ✅ Các button "Edit" và "Delete" xuất hiện trên mỗi bài viết
- ✅ Thông báo "Login successful" hiển thị

## ✏️ Quản lý tin tức

### 📝 Thêm bài viết mới

1. **Vào section News**
   - Click "News" trong navigation hoặc scroll đến phần News

2. **Mở form thêm bài**
   - Click button **"+ Add News"** (chỉ hiện khi đã login admin)

3. **Điền thông tin bài viết:**
   - **Title*** (bắt buộc): Tiêu đề bài viết
   - **Category**: Chọn danh mục (Development, Partnership, Investment, Technology, Event, General)
   - **Excerpt*** (bắt buộc): Tóm tắt ngắn gọn
   - **Full Content*** (bắt buộc): Nội dung đầy đủ của bài viết
   - **Icon**: Emoji đại diện (mặc định 📰)
   - **Status**: Published (xuất bản) hoặc Draft (nháp)
   - **Tags**: Các từ khóa, cách nhau bằng dấu phẩy

4. **Xuất bản**
   - Click **"Publish Article"**
   - Bài viết sẽ xuất hiện ngay lập tức trong danh sách

### ✏️ Chỉnh sửa bài viết

1. **Tìm bài viết cần sửa**
   - Scroll trong section News

2. **Mở form chỉnh sửa**
   - Click button **"✏️ Edit"** trên bài viết

3. **Cập nhật thông tin**
   - Form sẽ hiện với thông tin hiện tại
   - Chỉnh sửa các trường cần thiết
   - Click **"Update Article"**

### 🗑️ Xóa bài viết

1. **Xóa trực tiếp**
   - Click button **"🗑️ Delete"** trên bài viết
   - Confirm trong dialog xác nhận

2. **Xóa từ form edit**
   - Mở form edit của bài viết
   - Click button **"Delete"** màu đỏ ở cuối form

## 📱 Các tính năng nâng cao

### 🏷️ Categories và Tags
- **Categories**: Phân loại chính (Development, Partnership, Investment, etc.)
- **Tags**: Từ khóa chi tiết, giúp tìm kiếm và phân loại
- Mỗi category có màu sắc riêng để dễ phân biệt

### 📊 Status Management
- **Published**: Bài viết hiển thị công khai
- **Draft**: Bài viết chỉ admin thấy được, có badge "Draft"

### 🔍 View Full Article
- Click **"Read more →"** để xem bài viết đầy đủ trong modal
- Modal hiển thị:
  - Tiêu đề và metadata
  - Nội dung đầy đủ
  - Tags
  - Thông tin tác giả

## 💾 Lưu trữ dữ liệu

### Local Storage
- Tất cả bài viết được lưu trong **localStorage** của browser
- Dữ liệu tồn tại ngay cả khi refresh page
- **Lưu ý**: Xóa cache browser sẽ mất dữ liệu

### Backup và Restore
```javascript
// Backup dữ liệu (chạy trong Console)
const backup = localStorage.getItem('heart_news');
console.log(backup); // Copy và lưu lại

// Restore dữ liệu
localStorage.setItem('heart_news', 'YOUR_BACKUP_DATA');
location.reload();
```

## 🎨 Giao diện và UX

### 📱 Responsive Design
- Form tự động adapt trên mobile/tablet
- Touch-friendly buttons
- Optimized cho các screen sizes

### 🔔 Notifications
- Toast notifications cho mọi action
- Success (xanh): Thành công
- Error (đỏ): Lỗi
- Info (xanh dương): Thông tin

### ⚡ Performance
- Lazy loading news cards
- Smooth animations
- Optimized rendering

## 🛠️ Troubleshooting

### ❌ Không thể đăng nhập
**Giải pháp:**
1. Kiểm tra username/password: `admin` / `heart2024`
2. Hard refresh: `Cmd+Shift+R` (macOS) hoặc `Ctrl+F5` (Windows)
3. Check browser console (F12) cho errors

### ❌ Button "+ Add News" không hiện
**Nguyên nhân:** Chưa đăng nhập admin
**Giải pháp:**
1. Đảm bảo đã login thành công
2. Refresh page
3. Check JavaScript console cho errors

### ❌ Bài viết không lưu
**Giải pháp:**
1. Kiểm tra các trường bắt buộc (có dấu *)
2. Check browser localStorage settings
3. Try incognito/private mode

### ❌ News không load
**Giải pháp:**
1. Check browser console cho errors
2. Đảm bảo file `js/news-manager.js` được load
3. Hard refresh browser

## 🔧 Development

### File Structure
```
├── js/news-manager.js     # Core news management logic
├── css/news-manager.css   # Styles cho news system
└── index.html            # Main HTML với news section
```

### JavaScript API
```javascript
// Access news manager
newsManager.createNews(newsData);
newsManager.updateNews(id, newsData);
newsManager.deleteNews(id);
newsManager.renderNewsGrid();
newsManager.setAdminStatus(true/false);
```

### CSS Classes
- `.news-card` - News item container
- `.news-form-modal` - Add/edit form modal
- `.status-badge` - Draft/published indicator
- `.admin-actions` - Edit/delete buttons

## 📈 Future Enhancements

### Planned Features
- [ ] Rich text editor (WYSIWYG)
- [ ] Image upload functionality
- [ ] Category management
- [ ] User roles và permissions
- [ ] Backend integration
- [ ] Search và filtering
- [ ] Comments system
- [ ] Social sharing

### Backend Integration
```javascript
// Example API integration
const api = {
    async createNews(data) {
        return fetch('/api/news', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    }
};
```

## 📞 Support

### Debug Commands
```javascript
// Browser console commands
newsManager.getAllNews();           // View all news
localStorage.clear();               // Clear all data
newsManager.renderNewsGrid();       // Re-render news
```

### Common Issues
1. **LocalStorage full**: Clear other site data
2. **JavaScript errors**: Check file loading
3. **CSS not loading**: Check network tab
4. **Mobile issues**: Test in device mode

---

## 🎉 Quick Start Checklist

- [ ] Website loaded successfully
- [ ] Login với admin/heart2024
- [ ] Button "+ Add News" hiển thị
- [ ] Tạo bài viết test thành công
- [ ] Edit bài viết hoạt động
- [ ] Delete bài viết hoạt động
- [ ] Responsive design OK trên mobile

**Chúc bạn sử dụng news management system hiệu quả! 🚀**
