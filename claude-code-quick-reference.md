# 🚀 Claude Code Quick Reference for HEART Project

## 📋 Essential Commands

### Project Setup
```bash
# Initialize new project
claude-code init --project-name "PROJECT_NAME" --description "DESCRIPTION"

# Create folder structure
claude-code create structure --prompt "STRUCTURE_DESCRIPTION"

# Setup package.json
claude-code create file package.json --prompt "Node.js project config"
```

### File Creation
```bash
# HTML files
claude-code create file index.html --prompt "HTML_REQUIREMENTS"

# CSS files  
claude-code create file css/style.css --prompt "CSS_REQUIREMENTS"

# JavaScript files
claude-code create file js/script.js --prompt "JS_REQUIREMENTS"

# Documentation
claude-code create file README.md --prompt "PROJECT_DOCUMENTATION"
```

### Development
```bash
# Start dev server
claude-code dev start --port 3000 --watch "**/*.{html,css,js}"

# Real-time editing
claude-code edit FILENAME --prompt "EDIT_INSTRUCTIONS"

# Hot reload
claude-code dev start --reload --watch
```

### Testing & Validation
```bash
# Run tests
claude-code test run --coverage

# Validate HTML
claude-code validate html index.html

# Validate CSS
claude-code validate css css/

# Accessibility audit
claude-code audit accessibility --fix-issues
```

### Build & Deploy
```bash
# Build for production
claude-code build --minify --optimize --output "dist/"

# Deploy
claude-code deploy --target "netlify" --build-dir "dist/"

# Pre-deployment check
claude-code deploy check --validate-html --check-links
```

## 🎯 HEART Project Specific Commands

### Website Structure
```bash
claude-code create file index.html --prompt "
Create SPA for HEART Vietnam AI technology park:
- Navigation: Hero, About, Master Plan, Facilities, Investment, Technology, News, Contact
- Fixed navbar with smooth scrolling
- Responsive design with mobile-first approach
- Color scheme: primary blue #1e3a8a, accent yellow #fbbf24
- Professional animations and transitions
- Modal support for forms and content
- Loading screen with spinner
- SEO-optimized structure
"
```

### CSS Framework
```bash
claude-code create file css/main.css --prompt "
Professional CSS framework:
- CSS custom properties for consistent theming
- Modern flexbox and grid layouts
- Responsive breakpoints: mobile (320px), tablet (768px), desktop (1200px)
- Component library: cards, buttons, forms, modals
- Animation library: fade, slide, scale effects
- Utility classes for spacing, colors, typography
- Dark mode support with CSS variables
"
```

### News Management System
```bash
claude-code create file js/news-manager.js --prompt "
Complete news management system:
- Class-based architecture with ES6+
- CRUD operations: create, read, update, delete
- LocalStorage persistence with error handling
- Admin authentication system
- Modal forms for add/edit with validation
- Category system: Development, Partnership, Investment, Technology, Event
- Tag management with autocomplete
- Status management: draft, published, archived
- Search and filter functionality
- Toast notification system
- Mobile-responsive interface
- Real-time updates without page refresh
"
```

### Responsive Design
```bash
claude-code enhance responsive --prompt "
Mobile-first responsive design:
- Flexible grid system
- Touch-friendly navigation
- Optimized images with lazy loading
- Mobile-specific interactions
- Performance optimization for mobile
- Cross-browser compatibility
"
```

## 🔧 Advanced Workflows

### Complete Project Creation
```bash
# One-command project setup
claude-code create project heart-website \
  --template "spa-with-cms" \
  --features "responsive-design,news-management,admin-panel,pwa" \
  --theme "professional" \
  --color-scheme "blue-yellow" \
  --deploy "netlify"
```

### Feature Addition
```bash
# Add new features
claude-code add feature search --prompt "Global search functionality"
claude-code add feature i18n --languages "en,vi"
claude-code add feature analytics --service "google-analytics"
claude-code add feature pwa --prompt "Progressive Web App features"
```

### Code Optimization
```bash
# Performance optimization
claude-code optimize performance --minify --compress --lazy-load
claude-code optimize seo --meta-tags --sitemap --structured-data
claude-code optimize accessibility --aria-labels --keyboard-nav
```

### Integration Commands
```bash
# Third-party integrations
claude-code integrate cms --service "strapi" --endpoint "API_URL"
claude-code integrate email --service "emailjs" --template "contact"
claude-code integrate analytics --service "google-analytics" --id "GA-XXXXX"
claude-code integrate payment --service "stripe" --mode "subscription"
```

## 🎨 Theme & Styling

### Custom Themes
```bash
# Create custom theme
claude-code create theme heart-corporate \
  --base-colors "blue,yellow,white" \
  --typography "modern-sans" \
  --components "cards,buttons,forms" \
  --animations "subtle"

# Apply theme
claude-code apply theme heart-corporate --output "css/theme.css"
```

### Component Library
```bash
# Generate component library
claude-code create components \
  --types "navbar,hero,cards,forms,modals,buttons" \
  --style "modern-professional" \
  --responsive true \
  --documentation true
```

## 🧪 Testing & Quality

### Comprehensive Testing
```bash
# Unit tests
claude-code create test js/news-manager.js --type "unit"

# Integration tests  
claude-code create test index.html --type "integration"

# E2E tests
claude-code create test --type "e2e" --scenarios "user-journey"

# Performance tests
claude-code test performance --metrics "lighthouse"
```

### Code Quality
```bash
# Code review
claude-code review --files "js/*.js" --standards "eslint,prettier"

# Security audit
claude-code audit security --dependencies --vulnerabilities

# Best practices check
claude-code analyze best-practices --html --css --js
```

## 🚀 Deployment & DevOps

### CI/CD Pipeline
```bash
# Create GitHub Actions
claude-code create workflow ci-cd \
  --triggers "push,pull_request" \
  --steps "test,build,deploy" \
  --deploy-target "netlify"

# Docker setup
claude-code create dockerfile --base "nginx" --static-files
claude-code create docker-compose --services "web,database"
```

### Hosting Platforms
```bash
# Netlify deployment
claude-code deploy netlify --build-dir "dist/" --domain "heart-vietnam.com"

# Vercel deployment  
claude-code deploy vercel --framework "static" --domain "heart.vercel.app"

# AWS S3 deployment
claude-code deploy aws-s3 --bucket "heart-website" --region "ap-southeast-1"
```

## 📊 Analytics & Monitoring

### Performance Monitoring
```bash
# Lighthouse audit
claude-code audit lighthouse --categories "performance,accessibility,seo"

# Bundle analysis
claude-code analyze bundle --output "bundle-report.html"

# Core Web Vitals
claude-code monitor performance --metrics "lcp,fid,cls"
```

### User Analytics
```bash
# Setup tracking
claude-code integrate analytics --service "google-analytics"
claude-code integrate heatmap --service "hotjar"
claude-code integrate error-tracking --service "sentry"
```

## 🔍 Debugging & Troubleshooting

### Common Issues
```bash
# Debug JavaScript errors
claude-code debug js/news-manager.js --prompt "Fix runtime errors"

# CSS layout issues
claude-code debug css/main.css --prompt "Fix responsive layout"

# Performance issues
claude-code debug performance --prompt "Optimize loading speed"

# Accessibility issues
claude-code debug accessibility --prompt "Fix WCAG compliance"
```

### Error Analysis
```bash
# Analyze error logs
claude-code analyze errors --log-file "error.log"

# Browser compatibility
claude-code test compatibility --browsers "chrome,firefox,safari,edge"

# Mobile testing
claude-code test mobile --devices "iphone,android,tablet"
```

## 🎯 Quick Fixes

### Rapid Prototyping
```bash
# Quick HTML prototype
claude-code prototype html --template "landing-page" --style "modern"

# Quick CSS framework
claude-code prototype css --framework "custom" --components "basic"

# Quick JS functionality
claude-code prototype js --features "forms,navigation,animations"
```

### Common Modifications
```bash
# Add new section
claude-code add section --name "testimonials" --style "cards"

# Update color scheme
claude-code update theme --colors "blue:#1e3a8a,yellow:#fbbf24"

# Add mobile menu
claude-code add component mobile-menu --style "hamburger"

# Fix responsive issues
claude-code fix responsive --breakpoints "mobile,tablet,desktop"
```

## 💡 Pro Tips

### Efficiency Shortcuts
```bash
# Use aliases for common commands
alias cc-create="claude-code create file"
alias cc-edit="claude-code edit"
alias cc-dev="claude-code dev start --watch"
alias cc-build="claude-code build --optimize"

# Batch operations
claude-code batch create --files "index.html,style.css,script.js"
claude-code batch optimize --directory "src/"
```

### Best Practices
```bash
# Always use descriptive prompts
claude-code create file --prompt "Detailed description with requirements"

# Version control integration
claude-code git init --with-hooks
claude-code git commit --message "Initial HEART website setup"

# Documentation generation
claude-code docs generate --api --user-guide --deployment
```

## 🚨 Important Notes

- **API Limits**: Be mindful of API usage limits
- **Code Review**: Always review generated code before production
- **Backups**: Keep backups of custom modifications
- **Testing**: Test thoroughly on multiple devices/browsers
- **Security**: Review security implications of generated code

## 🔗 Resources

- **Documentation**: https://docs.anthropic.com/claude-code
- **Examples**: https://github.com/anthropic/claude-code-examples
- **Community**: https://community.anthropic.com/claude-code
- **Support**: https://support.anthropic.com

---

**🎉 Happy coding with Claude Code! Build amazing projects faster! 🚀**
