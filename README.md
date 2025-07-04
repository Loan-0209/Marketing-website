# HEART Technology Website

A comprehensive full-stack website for HEART Technology Park featuring backend API and frontend integration.

## 🚀 Features

### Frontend
- Modern responsive design
- Single-page application with section navigation
- Dynamic news loading with pagination
- Admin authentication and news management
- Contact form with backend integration
- Real-time notifications

### Backend
- RESTful API with Express.js
- MongoDB database with Mongoose ODM
- JWT-based authentication
- News management (CRUD operations)
- Contact form submissions with email notifications
- File upload support for images
- Comprehensive security middleware
- Input validation and sanitization

## 🛠️ Technology Stack

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Fetch API for HTTP requests
- CSS Grid and Flexbox for layouts
- Custom toast notifications

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- Nodemailer for email notifications
- Multer for file uploads
- Express-validator for input validation
- Helmet for security headers
- CORS for cross-origin requests

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (v5 or higher)
- [Git](https://git-scm.com/)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Test_WEBSITE_2025.06.18
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env file with your configuration
# Important: Update MONGODB_URI, JWT_SECRET, and email settings

# Seed the database with sample data
npm run seed

# Start the backend server
npm run dev
```

### 3. Frontend Setup
```bash
# Navigate back to root directory
cd ..

# Install frontend dependencies
npm install

# Start the frontend server
npm start
```

### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/api/health

## 🔐 Default Login Credentials

After running the seed script, you can login with:
- **Username:** `admin`
- **Password:** `heart2024`

## Development
### HTML Structure
- Single page application với nhiều sections
- Navigation sử dụng JavaScript để show/hide sections
- Responsive design với CSS Grid và Flexbox

### CSS Features
- CSS Variables cho theming
- Animations và transitions
- Mobile-first responsive design
- Modern CSS features (backdrop-filter, grid, flexbox)

### JavaScript Features
- Vanilla JavaScript (không cần framework)
- DOM manipulation
- Form handling
- Local authentication simulation
- Smooth animations

## Customization
### Thay đổi màu sắc
Chỉnh sửa CSS variables trong `:root`:
```css
:root {
    --primary-blue: #1e3a8a;
    --light-blue: #3b82f6;
    --primary-yellow: #fbbf24;
    /* ... */
}
```

### Thêm sections mới
1. Thêm HTML section trong body
2. Thêm navigation link
3. Thêm CSS styles
4. Update JavaScript navigation function

### Thêm tính năng mới
- Database integration (cần backend)
- User registration/authentication
- Content management system
- Multi-language support

## Browser Support
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Performance
- Optimized CSS và JavaScript
- Minimal external dependencies
- Fast loading times
- Mobile optimized

## Security Notes
- Admin login chỉ là demo (client-side only)
- Để production cần implement proper authentication
- Form submissions cần backend validation

## Troubleshooting
### Website không load
- Kiểm tra file index.html có tồn tại
- Đảm bảo Live Server đang chạy
- Kiểm tra browser console cho errors

### Styles không hiển thị đúng
- Hard refresh (Ctrl+F5)
- Kiểm tra CSS syntax
- Đảm bảo CSS được load đúng cách

### JavaScript không hoạt động
- Mở Developer Tools (F12)
- Kiểm tra Console tab cho errors
- Đảm bảo JavaScript được enable

## License
Dự án này chỉ dành cho mục đích học tập và demo.

## Contact
Nếu có vấn đề kỹ thuật, vui lòng tạo issue hoặc liên hệ developer.
