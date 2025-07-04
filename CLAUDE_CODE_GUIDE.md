# 🚀 Hướng dẫn tạo HEART Website với Claude Code

## 📋 Tổng quan
Claude Code là agentic command line tool cho phép developers delegate coding tasks trực tiếp từ terminal. Hướng dẫn này sẽ giúp bạn tạo toàn bộ HEART website với news management system.

## 🛠️ Prerequisites

### 1. Cài đặt Claude Code
```bash
# Install Claude Code (requires access to research preview)
npm install -g @anthropic-ai/claude-code
# hoặc
pip install claude-code
```

### 2. Setup Authentication
```bash
# Set up API key
claude-code auth setup
# Enter your Anthropic API key when prompted
```

### 3. Verify Installation
```bash
claude-code --version
claude-code --help
```

## 🏗️ Tạo dự án HEART Website

### Bước 1: Initialize Project
```bash
# Tạo thư mục dự án
mkdir heart-website && cd heart-website

# Initialize với Claude Code
claude-code init --project-name "HEART Technology Park Website" \
                 --description "Vietnam's advanced AI technology park website with news management" \
                 --tech-stack "HTML,CSS,JavaScript,Responsive"
```

### Bước 2: Tạo Project Structure
```bash
claude-code create structure \
  --prompt "Create a modern website project structure for HEART - Vietnam's AI technology park. 
  Include folders for: css, js, images, docs. 
  Create package.json for npm scripts. 
  Add .gitignore for web projects."
```

### Bước 3: Tạo HTML Main File
```bash
claude-code create file index.html \
  --prompt "Create a professional single-page application for HEART technology park website.
  
  Requirements:
  - Modern responsive design with fixed navigation
  - Sections: Hero, About Us, Master Plan, Facilities, Investment, Technology, News, Contact
  - CSS variables for theming (blue #1e3a8a, yellow #fbbf24)
  - Smooth animations and transitions
  - Mobile-first responsive design
  - Navigation with active states
  - Loading screen animation
  - Modal support for login
  
  Content:
  - HEART is Vietnam's pioneering AI technology park
  - 2,000 hectares development area
  - $2B total investment over 10 years
  - Partnership with MIT, Stanford
  - Focus on AI, quantum computing, green technology
  
  Include placeholder sections for news management system."
```

### Bước 4: Tạo CSS Styles
```bash
claude-code create file css/main.css \
  --prompt "Create comprehensive CSS for HEART website with:
  
  - CSS custom properties for consistent theming
  - Modern flexbox/grid layouts
  - Smooth animations and hover effects
  - Professional gradient backgrounds
  - Card-based design components
  - Timeline component for master plan
  - Statistics cards with animations
  - Form styling with focus states
  - Toast notification styles
  - Loading spinner animations
  - Mobile-responsive breakpoints
  
  Color scheme:
  - Primary blue: #1e3a8a
  - Light blue: #3b82f6  
  - Primary yellow: #fbbf24
  - Light yellow: #fef3c7
  - White: #ffffff
  - Gray: #6b7280"
```

### Bước 5: Tạo News Management System
```bash
claude-code create file js/news-manager.js \
  --prompt "Create a comprehensive news management system class with:
  
  Features:
  - CRUD operations (Create, Read, Update, Delete)
  - LocalStorage persistence
  - Admin authentication system
  - Categories: Development, Partnership, Investment, Technology, Event
  - Tags support with comma-separated input
  - Draft/Published status management
  - Rich modal forms for add/edit
  - Toast notifications for user feedback
  - Mobile-responsive design
  - Real-time UI updates
  
  Data structure:
  - id: unique identifier
  - title: article title
  - excerpt: short description
  - content: full article content
  - date: publication date
  - icon: emoji representation
  - category: article category
  - status: published/draft
  - author: author name
  - tags: array of keywords
  
  Admin features:
  - Login/logout functionality
  - Add/edit/delete news articles
  - Status management
  - Category assignment
  - Tag management
  
  Include helper methods for DOM manipulation and data validation."
```

### Bước 6: Tạo News Management CSS
```bash
claude-code create file css/news-manager.css \
  --prompt "Create professional CSS for news management system:
  
  Components needed:
  - Modal forms for add/edit news (overlay with backdrop blur)
  - News card grid layout (responsive 3-column to 1-column)
  - Admin action buttons (edit/delete)
  - Status badges (draft/published)
  - Category color coding
  - Tag styling (pill-shaped badges)
  - Toast notification system (slide-in from right)
  - Form styling (modern inputs with focus states)
  - Loading states and animations
  - Mobile-optimized layouts
  
  Design principles:
  - Consistent with main website theme
  - Professional and modern appearance
  - Smooth animations and transitions
  - Accessible color contrasts
  - Touch-friendly mobile interface
  
  Include hover effects, focus states, and micro-interactions."
```

### Bước 7: Enhanced JavaScript Functionality
```bash
claude-code create file js/main.js \
  --prompt "Create main JavaScript functionality for HEART website:
  
  Features:
  - Smooth section navigation with show/hide
  - Fixed navbar with scroll effects
  - Loading screen with delayed hide
  - Form submission handling
  - Admin login/logout system
  - Integration with news management system
  - Scroll animations for cards
  - Mobile menu handling (if needed)
  - Contact form validation
  - Local storage management
  
  Login system:
  - Username: admin, Password: heart2024
  - Session persistence
  - UI updates based on login status
  - Integration with news manager admin mode
  
  Include smooth scrolling, animation triggers, and responsive behavior."
```

### Bước 8: Configuration Files
```bash
# Package.json với scripts
claude-code create file package.json \
  --prompt "Create package.json for HEART website project with:
  - Project metadata and description
  - Development dependencies: live-server
  - Scripts for development and production
  - Browser compatibility settings
  - Keywords for Vietnam, AI, technology park"

# README documentation
claude-code create file README.md \
  --prompt "Create comprehensive README for HEART website project:
  - Project description and features
  - Installation and setup instructions
  - Usage guide for news management
  - Admin login credentials
  - Development workflow
  - Deployment instructions
  - File structure explanation
  - Contributing guidelines"
```

### Bước 9: Testing và Validation
```bash
# Tạo test file
claude-code create file test/news-manager.test.js \
  --prompt "Create comprehensive test suite for news management system:
  - Unit tests for CRUD operations
  - LocalStorage integration tests
  - Form validation tests
  - DOM manipulation tests
  - Admin authentication tests
  - Error handling tests
  - Mock data and test scenarios"

# HTML validation
claude-code validate html index.html \
  --prompt "Validate HTML structure and accessibility"

# CSS validation  
claude-code validate css css/ \
  --prompt "Check CSS for best practices and browser compatibility"
```

### Bước 10: Optimization và Polish
```bash
# Performance optimization
claude-code optimize \
  --prompt "Optimize website performance:
  - Minify CSS and JavaScript
  - Optimize images and assets
  - Add meta tags for SEO
  - Implement lazy loading
  - Add service worker for caching
  - Compress and bundle files"

# Accessibility improvements
claude-code enhance accessibility \
  --prompt "Improve website accessibility:
  - Add proper ARIA labels
  - Ensure keyboard navigation
  - Improve color contrast
  - Add alt texts for images
  - Semantic HTML structure
  - Screen reader compatibility"
```

## 🔧 Advanced Claude Code Commands

### Custom Workflows
```bash
# Tạo custom workflow
claude-code workflow create website-deploy \
  --steps "build,test,optimize,deploy" \
  --description "Complete deployment pipeline"

# Chạy workflow
claude-code workflow run website-deploy
```

### Code Review và Refactoring
```bash
# Code review
claude-code review js/news-manager.js \
  --prompt "Review code for best practices, security, and performance"

# Refactoring
claude-code refactor js/main.js \
  --prompt "Refactor code for better modularity and maintainability"
```

### Documentation Generation
```bash
# API documentation
claude-code document js/news-manager.js \
  --format "jsdoc" \
  --output "docs/api.md"

# User guide
claude-code create guide \
  --prompt "Create user guide for news management system"
```

## 🚀 Development Workflow

### 1. Development Mode
```bash
# Start development server
claude-code dev start \
  --port 3000 \
  --watch "**/*.{html,css,js}" \
  --reload

# Real-time editing
claude-code edit index.html \
  --prompt "Add new section for testimonials"
```

### 2. Testing
```bash
# Run tests
claude-code test run \
  --coverage \
  --watch

# Generate test reports
claude-code test report \
  --format "html" \
  --output "test-results/"
```

### 3. Build & Deploy
```bash
# Build for production
claude-code build \
  --minify \
  --optimize \
  --output "dist/"

# Deploy to hosting
claude-code deploy \
  --target "netlify" \
  --build-dir "dist/"
```

## 🎯 Specific HEART Features

### Add Vietnam-specific Content
```bash
claude-code enhance content \
  --prompt "Add Vietnam-specific content:
  - Vietnamese government partnerships
  - Local technology ecosystem
  - Ho Chi Minh City location details
  - Vietnamese startup success stories
  - Regional AI development initiatives"
```

### Multi-language Support
```bash
claude-code add feature i18n \
  --languages "en,vi" \
  --prompt "Add Vietnamese language support with toggle"
```

### Mobile App Integration
```bash
claude-code create file js/mobile-app.js \
  --prompt "Create PWA functionality:
  - Service worker for offline support
  - App manifest for mobile installation
  - Push notification support
  - Mobile-optimized interactions"
```

## 🔍 Debugging với Claude Code

### Error Analysis
```bash
# Analyze JavaScript errors
claude-code debug js/news-manager.js \
  --prompt "Analyze and fix JavaScript errors"

# CSS debugging
claude-code debug css/main.css \
  --prompt "Fix CSS layout and responsive issues"
```

### Performance Analysis
```bash
# Performance audit
claude-code audit performance \
  --url "http://localhost:3000" \
  --report "performance-report.html"

# Accessibility audit
claude-code audit accessibility \
  --fix-issues \
  --report "a11y-report.html"
```

## 📊 Project Management

### Task Tracking
```bash
# Create project tasks
claude-code task create "Implement search functionality" \
  --priority "high" \
  --estimate "4h"

# Track progress
claude-code task list --status "in-progress"
```

### Code Analytics
```bash
# Code complexity analysis
claude-code analyze complexity \
  --threshold 10 \
  --report "complexity.json"

# Dependencies audit
claude-code analyze dependencies \
  --security-check \
  --outdated
```

## 🎨 Customization Examples

### Theme Variations
```bash
# Create dark theme
claude-code create theme dark \
  --base-theme "main" \
  --output "css/dark-theme.css"

# Corporate theme
claude-code create theme corporate \
  --colors "blue,gold" \
  --style "professional"
```

### Component Library
```bash
# Extract reusable components
claude-code extract components \
  --input "index.html" \
  --output "components/"

# Create component documentation
claude-code document components \
  --style-guide \
  --interactive-examples
```

## 🔗 Integration với External Services

### Analytics Integration
```bash
claude-code integrate analytics \
  --service "google-analytics" \
  --tracking-id "GA-XXXXXX"
```

### CMS Integration
```bash
claude-code integrate cms \
  --service "strapi" \
  --endpoint "https://api.heart.com"
```

### Email Service
```bash
claude-code integrate email \
  --service "emailjs" \
  --template "contact-form"
```

## 📝 Final Steps

### Complete Project Setup
```bash
# Final project setup
claude-code setup complete \
  --install-deps \
  --run-tests \
  --start-dev-server

# Generate documentation
claude-code docs generate \
  --include-api \
  --include-user-guide \
  --output "documentation/"
```

### Deployment Ready
```bash
# Pre-deployment check
claude-code deploy check \
  --validate-html \
  --check-links \
  --optimize-assets

# Deploy to production
claude-code deploy production \
  --provider "netlify" \
  --domain "heart-vietnam.com"
```

## 🎉 Advantages của Claude Code

### 1. **Speed & Efficiency**
- Tạo complete codebase trong minutes
- Automatic best practices implementation
- Consistent code quality

### 2. **Professional Quality**
- Production-ready code
- Modern web standards
- Responsive design out-of-the-box

### 3. **Comprehensive Features**
- Full-stack development capability
- Testing và validation built-in
- Documentation generation

### 4. **Learning & Development**
- Code explanation và comments
- Best practices guidance
- Performance optimization tips

---

## 🚀 Quick Start Command

```bash
# One-command project creation
claude-code create project heart-website \
  --template "spa-with-cms" \
  --features "news-management,admin-panel,responsive-design" \
  --theme "professional-blue-yellow" \
  --deploy "netlify"
```

## 📞 Support & Resources

- **Claude Code Documentation**: Official docs và examples
- **Community**: GitHub discussions và issues
- **Templates**: Pre-built project templates
- **Plugins**: Extensions và integrations

---

**🎊 Với Claude Code, bạn có thể tạo toàn bộ HEART website chỉ trong vài lệnh command line! Professional, fast, và production-ready! 🚀**
