# HEART Technology Website - Setup Guide

This guide will help you set up and run the HEART Technology Website with both frontend and backend components.

## 🚀 Quick Start (Recommended)

### Option 1: Using the Startup Script (macOS/Linux)
```bash
./start.sh
```

The startup script will automatically:
- Check system requirements
- Start MongoDB
- Install dependencies
- Seed the database
- Start both frontend and backend servers

### Option 2: Manual Setup

#### 1. Prerequisites
Make sure you have the following installed:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)

#### 2. Start MongoDB
```bash
# Create data directory
mkdir -p ./data/db

# Start MongoDB
mongod --dbpath ./data/db
```

#### 3. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env file with your configuration (optional for local development)

# Seed the database with sample data
npm run seed

# Start the backend server
npm run dev
```

#### 4. Frontend Setup
```bash
# Navigate back to root directory
cd ..

# Install frontend dependencies
npm install

# Start the frontend server
npm start
```

## 🌐 Access the Application

After successful setup:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 🔐 Login Credentials

Default admin login:
- **Username**: `admin`
- **Password**: `heart2024`

## 📁 Project Structure

```
HEART Technology Website/
├── backend/                 # Backend API (Node.js/Express)
│   ├── models/             # Database models (MongoDB/Mongoose)
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   ├── scripts/            # Database scripts
│   └── server.js           # Main server file
├── css/                    # Frontend stylesheets
│   ├── main.css           # Main styles
│   └── components.css     # Component styles
├── js/                     # Frontend JavaScript
│   ├── api.js             # API client
│   ├── components.js      # UI components
│   └── dashboard.js       # Admin dashboard
├── index.html              # Main HTML file
├── start.sh               # Startup script
└── README.md              # Documentation
```

## 🔧 Configuration

### Environment Variables (Backend)

Create a `.env` file in the `backend` directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/heart_db
JWT_SECRET=your_very_secure_jwt_secret_key
JWT_EXPIRE=30d

# Email Configuration (for contact form)
EMAIL_FROM=noreply@heart.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Email Setup (Optional)

To enable email notifications for contact form submissions:

1. **Gmail Setup**:
   - Enable 2-factor authentication
   - Generate an app-specific password
   - Update `EMAIL_USER` and `EMAIL_PASS` in `.env`

2. **Other Email Providers**:
   - Update `EMAIL_HOST` and `EMAIL_PORT` accordingly

## 🎯 Features

### Frontend Features
- **Modern responsive design** with CSS Grid and Flexbox
- **Single-page application** with smooth navigation
- **Dynamic news loading** with pagination and search
- **Admin authentication** with JWT tokens
- **Contact form** with backend integration
- **Real-time notifications** with toast messages
- **Admin dashboard** for content management

### Backend Features
- **RESTful API** with Express.js
- **MongoDB database** with Mongoose ODM
- **JWT authentication** and authorization
- **News management** (CRUD operations)
- **Contact form submissions** with email notifications
- **File upload** support for images
- **Input validation** and sanitization
- **Security middleware** (Helmet, CORS, rate limiting)

## 📖 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### News Endpoints
- `GET /api/news` - Get all news articles
- `GET /api/news/:id` - Get single news article
- `POST /api/news` - Create news article (admin/editor only)
- `PUT /api/news/:id` - Update news article (admin/editor only)
- `DELETE /api/news/:id` - Delete news article (admin/editor only)
- `POST /api/news/:id/like` - Like news article

### Contact Endpoints
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contacts (admin/editor only)

### File Upload Endpoints
- `POST /api/upload/image` - Upload image (admin/editor only)

## 🔧 Development

### Available Scripts

#### Backend (`backend/` directory)
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run seed       # Seed database with sample data
npm test           # Run tests (when implemented)
```

#### Frontend (root directory)
```bash
npm start          # Start live-server on port 3000
npm run dev        # Same as start
npm run serve      # Start on port 8080 (all interfaces)
```

### Database Seeding

The database seeding script creates:
- **Admin user** (admin/heart2024)
- **Editor user** (editor/editor123)
- **6 sample news articles** with different categories

Run the seeding script:
```bash
cd backend
npm run seed
```

## 🐳 Docker Deployment

### Using Docker Compose
```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d

# Stop services
docker-compose down
```

### Services included:
- **Frontend** (http://localhost:3000)
- **Backend** (http://localhost:5000)
- **MongoDB** (mongodb://localhost:27017)

## 🛠️ Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   ```
   Error: connect ECONNREFUSED 127.0.0.1:27017
   ```
   **Solution**: Ensure MongoDB is running
   ```bash
   mongod --dbpath ./data/db
   ```

2. **Port Already in Use**
   ```
   Error: listen EADDRINUSE :::3000
   ```
   **Solution**: Kill the process using the port
   ```bash
   lsof -ti:3000 | xargs kill -9
   ```

3. **Email Not Sending**
   - Check email credentials in `.env`
   - Verify SMTP settings
   - For Gmail, use app-specific password

4. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT secret in `.env`
   - Verify token expiration

### Reset Database
```bash
cd backend
mongo heart_db --eval "db.dropDatabase()"
npm run seed
```

### Check Logs
- **Backend logs**: Console output in the terminal
- **MongoDB logs**: `./data/mongodb.log`
- **Browser logs**: Developer Tools → Console

## 🔐 Security Notes

- Admin login is functional with JWT authentication
- Passwords are hashed with bcrypt
- API endpoints are protected with proper authorization
- Input validation prevents injection attacks
- Rate limiting prevents abuse
- CORS is configured for security

## 📞 Support

For issues and questions:
- Check the troubleshooting section above
- Review the console logs for error messages
- Ensure all prerequisites are installed
- Verify environment configuration

## 🎉 Success!

If everything is working correctly, you should see:
- Frontend running at http://localhost:3000
- Backend API responding at http://localhost:5000
- Admin dashboard accessible after login
- News articles loading dynamically
- Contact form submitting successfully

Enjoy exploring the HEART Technology Website!