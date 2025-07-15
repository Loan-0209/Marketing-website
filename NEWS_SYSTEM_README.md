# HEART Technology Park - News Management System

A complete news management system with Create, Read, Update, Delete (CRUD) functionality, authentication, and a beautiful user interface.

## 🎯 Features Implemented

### ✅ **Complete News Creation System**
- **Create New Button** on the main News page (visible only to authenticated admin/editor users)
- **Modal-based Form** with all required fields:
  - Title (required, max 200 characters)
  - Content/Body (required, min 100 characters)
  - Author (optional, defaults to "HEART Team")
  - Category (Announcement, Technology, Partnership, Funding, Award, General)
  - Featured Image support (ready for implementation)
  - Publication Date (automatically set)
  - Tags (comma-separated input)
  - Icon/Emoji selector

### ✅ **Form Validation & UX**
- **Real-time character counting** for all text fields
- **Client-side validation** with error highlighting
- **Server-side validation** with proper error messages
- **Loading states** and success/error notifications
- **Responsive design** that works on all devices

### ✅ **Backend Integration**
- **Express.js + MongoDB** backend with comprehensive API
- **Authentication & Authorization** system
- **Role-based permissions** (Admin, Editor, Viewer)
- **API endpoints** for all CRUD operations
- **Data validation** and error handling

### ✅ **User Interface**
- **Seamless integration** with existing News page design
- **Admin actions bar** (only visible to authenticated users)
- **Dynamic news loading** from database
- **Filter functionality** by category
- **Beautiful modal design** matching site aesthetics

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (running locally or remotely)
- npm or yarn

### 1. Start the System
```bash
# Make the startup script executable (first time only)
chmod +x start-news-system.sh

# Start both backend and frontend
./start-news-system.sh
```

### 2. Access the System
- **Main News Page**: http://localhost:3000/news.html
- **Login Page**: http://localhost:3000/simple-login.html
- **Admin Panel**: http://localhost:3000/admin/post-news.html

### 3. Test Admin Account
- **Username**: `admin`
- **Password**: `admin123`
- **Email**: `admin@heart.com`

## 📁 File Structure

```
├── news.html                 # Main news page with Create New functionality
├── simple-login.html         # Simple login page for testing
├── admin/post-news.html      # Full admin panel (existing)
├── backend/
│   ├── server.js             # Express server
│   ├── models/News.js        # News data model
│   ├── routes/news.js        # News API endpoints
│   ├── routes/auth.js        # Authentication endpoints
│   └── middleware/auth.js    # Authentication middleware
├── create-admin.js           # Script to create admin user
├── start-news-system.sh      # One-click startup script
└── NEWS_SYSTEM_README.md     # This file
```

## 🔧 Manual Setup (Alternative)

### Backend Setup
```bash
cd backend
npm install
npm start
# Backend runs on http://localhost:5001
```

### Frontend Setup
```bash
npm install
npm start
# Frontend runs on http://localhost:3000
```

### Create Admin User
```bash
node create-admin.js
```

## 📋 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token
- `GET /api/auth/me` - Get current user info

### News Management
- `GET /api/news` - Get all news articles
- `POST /api/news` - Create new article (requires admin/editor auth)
- `PUT /api/news/:id` - Update article (requires admin/editor auth)
- `DELETE /api/news/:id` - Delete article (requires admin/editor auth)
- `GET /api/news/:id` - Get single article

## 🎨 Usage Guide

### For End Users
1. Visit the **News page** to view all articles
2. Use **filter buttons** to browse by category
3. Click **"Read More"** to view full articles

### For Content Creators
1. **Login** using the simple login page
2. Navigate to the **News page**
3. Click **"Create New Article"** button (appears after login)
4. Fill out the **modal form** with article details
5. Click **"Create Article"** to publish

### For Administrators
1. **Login** with admin credentials
2. Use the **"Admin Panel"** button for advanced management
3. Access the full-featured admin interface at `/admin/post-news.html`

## 🔐 Authentication System

### User Roles
- **Admin**: Full access to create, edit, delete any article
- **Editor**: Can create and edit their own articles
- **Viewer**: Read-only access (default role)

### Security Features
- **JWT-based authentication** with secure token storage
- **Role-based authorization** for different user types
- **Password hashing** using bcrypt
- **Input validation** and sanitization
- **CORS protection** and security headers

## 📱 Responsive Design

The system is fully responsive and works seamlessly on:
- **Desktop computers** (full functionality)
- **Tablets** (optimized layout)
- **Mobile phones** (touch-friendly interface)

## 🛠️ Customization

### Adding New Categories
Edit the category options in both:
1. `news.html` (line ~737-744)
2. `backend/models/News.js` (line ~55)

### Styling Changes
The system uses the existing HEART design system. Modify:
- CSS variables in the `<style>` section of `news.html`
- Existing stylesheets in the `css/` directory

### API Configuration
Update the API base URL in `news.html`:
```javascript
const API_BASE_URL = 'http://localhost:5001/api';
```

## 🐛 Troubleshooting

### Backend Not Starting
1. Ensure MongoDB is running: `brew services start mongodb/brew/mongodb-community`
2. Check if port 5001 is available
3. Verify environment variables in `backend/.env`

### Frontend Not Loading
1. Check if port 3000 is available
2. Ensure frontend dependencies are installed: `npm install`

### Authentication Issues
1. Verify admin user exists: `node create-admin.js`
2. Check browser console for API errors
3. Ensure CORS is properly configured

### Database Connection
1. Verify MongoDB connection string in `backend/server.js`
2. Check MongoDB service status
3. Ensure database permissions are correct

## 🎉 Success! 

You now have a complete news management system with:
- ✅ Beautiful, integrated Create New functionality
- ✅ Full authentication and authorization
- ✅ Responsive design that matches your site
- ✅ Professional form validation and UX
- ✅ Real-time updates and dynamic loading
- ✅ Complete backend API with MongoDB

The system seamlessly integrates with your existing HEART Technology Park website while providing powerful content management capabilities!

## 📞 Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify all servers are running correctly
3. Ensure MongoDB is accessible
4. Review the API response messages for debugging

---

**Built with ❤️ for HEART Technology Park**