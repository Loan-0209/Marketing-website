#!/bin/bash

# HEART Website with Claude Code - Step-by-step Demo
# This script shows exactly how to use Claude Code commands

echo "🚀 HEART Website Creation with Claude Code"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo -e "${BLUE}📋 Prerequisites Check${NC}"
echo "1. Claude Code installed: claude-code --version"
echo "2. API key configured: claude-code auth status"
echo "3. Terminal ready for commands"
echo ""

echo -e "${YELLOW}🏗️ Step-by-Step Commands${NC}"
echo ""

echo -e "${GREEN}STEP 1: Project Setup${NC}"
echo "mkdir heart-website && cd heart-website"
echo ""
echo "claude-code init \\"
echo "  --project-name 'HEART Technology Park' \\"
echo "  --description 'Vietnam AI tech park with news management' \\"
echo "  --tech-stack 'HTML,CSS,JavaScript,Responsive'"
echo ""

echo -e "${GREEN}STEP 2: Create Project Structure${NC}"
echo "claude-code create structure \\"
echo "  --prompt 'Create modern website structure: css/, js/, images/, docs/, package.json, .gitignore'"
echo ""

echo -e "${GREEN}STEP 3: Main HTML File${NC}"
echo "claude-code create file index.html \\"
echo "  --prompt 'Create professional SPA for HEART tech park:"
echo "  - Fixed navigation: Hero, About, Master Plan, Facilities, Investment, Technology, News, Contact"
echo "  - Color scheme: blue #1e3a8a, yellow #fbbf24"
echo "  - Responsive design, animations, modal support"
echo "  - HEART: Vietnam AI park, 2000 hectares, \$2B investment"
echo "  - Partnership with MIT, Stanford, focus on AI/quantum/green tech'"
echo ""

echo -e "${GREEN}STEP 4: CSS Styling${NC}"
echo "claude-code create file css/main.css \\"
echo "  --prompt 'Comprehensive CSS with:"
echo "  - CSS custom properties for theming"
echo "  - Modern flexbox/grid layouts"
echo "  - Smooth animations, gradient backgrounds"
echo "  - Card components, timeline, statistics cards"
echo "  - Form styling, toast notifications"
echo "  - Mobile-responsive breakpoints'"
echo ""

echo -e "${GREEN}STEP 5: News Management System${NC}"
echo "claude-code create file js/news-manager.js \\"
echo "  --prompt 'Complete news management class:"
echo "  - CRUD operations with LocalStorage"
echo "  - Admin auth (admin/heart2024)"
echo "  - Categories: Development, Partnership, Investment, Technology, Event"
echo "  - Tags, Draft/Published status"
echo "  - Modal forms, toast notifications"
echo "  - Mobile-responsive, real-time UI updates'"
echo ""

echo -e "${GREEN}STEP 6: News Management CSS${NC}"
echo "claude-code create file css/news-manager.css \\"
echo "  --prompt 'Professional news management styles:"
echo "  - Modal forms with backdrop blur"
echo "  - Responsive news card grid"
echo "  - Admin buttons, status badges"
echo "  - Category colors, tag styling"
echo "  - Toast notifications, form styling"
echo "  - Mobile-optimized layouts'"
echo ""

echo -e "${GREEN}STEP 7: Main JavaScript${NC}"
echo "claude-code create file js/main.js \\"
echo "  --prompt 'Main functionality:"
echo "  - Section navigation, navbar scroll effects"
echo "  - Loading screen, form handling"
echo "  - Admin login (admin/heart2024)"
echo "  - News manager integration"
echo "  - Contact form validation'"
echo ""

echo -e "${GREEN}STEP 8: Configuration Files${NC}"
echo "claude-code create file package.json \\"
echo "  --prompt 'Package.json with dev dependencies, scripts for HEART project'"
echo ""
echo "claude-code create file README.md \\"
echo "  --prompt 'Comprehensive README: setup, features, usage, admin guide'"
echo ""

echo -e "${GREEN}STEP 9: Testing${NC}"
echo "claude-code create file test/news-manager.test.js \\"
echo "  --prompt 'Test suite: CRUD operations, LocalStorage, form validation, admin auth'"
echo ""

echo -e "${GREEN}STEP 10: Optimization${NC}"
echo "claude-code optimize \\"
echo "  --prompt 'Optimize performance: minify, SEO meta tags, lazy loading, caching'"
echo ""
echo "claude-code enhance accessibility \\"
echo "  --prompt 'Improve accessibility: ARIA labels, keyboard nav, color contrast, alt texts'"
echo ""

echo -e "${PURPLE}🔧 Advanced Commands${NC}"
echo ""

echo -e "${YELLOW}Development Workflow:${NC}"
echo "claude-code dev start --port 3000 --watch '**/*.{html,css,js}' --reload"
echo ""

echo -e "${YELLOW}Real-time Editing:${NC}"
echo "claude-code edit index.html --prompt 'Add testimonials section'"
echo ""

echo -e "${YELLOW}Testing:${NC}"
echo "claude-code test run --coverage --watch"
echo ""

echo -e "${YELLOW}Build & Deploy:${NC}"
echo "claude-code build --minify --optimize --output 'dist/'"
echo "claude-code deploy --target 'netlify' --build-dir 'dist/'"
echo ""

echo -e "${YELLOW}Debugging:${NC}"
echo "claude-code debug js/news-manager.js --prompt 'Analyze and fix errors'"
echo "claude-code audit performance --url 'http://localhost:3000'"
echo ""

echo -e "${PURPLE}🎯 Specific Features${NC}"
echo ""

echo -e "${YELLOW}Vietnam-specific Content:${NC}"
echo "claude-code enhance content \\"
echo "  --prompt 'Add Vietnam gov partnerships, local tech ecosystem, HCM location'"
echo ""

echo -e "${YELLOW}Multi-language Support:${NC}"
echo "claude-code add feature i18n --languages 'en,vi' --prompt 'Add Vietnamese support'"
echo ""

echo -e "${YELLOW}PWA Features:${NC}"
echo "claude-code create file js/mobile-app.js \\"
echo "  --prompt 'PWA: service worker, app manifest, push notifications'"
echo ""

echo -e "${BLUE}📊 Analytics & Monitoring${NC}"
echo ""

echo -e "${YELLOW}Code Analysis:${NC}"
echo "claude-code analyze complexity --threshold 10"
echo "claude-code analyze dependencies --security-check"
echo ""

echo -e "${YELLOW}Integration:${NC}"
echo "claude-code integrate analytics --service 'google-analytics'"
echo "claude-code integrate email --service 'emailjs' --template 'contact-form'"
echo ""

echo -e "${GREEN}🎉 One-Command Complete Project${NC}"
echo ""
echo "claude-code create project heart-website \\"
echo "  --template 'spa-with-cms' \\"
echo "  --features 'news-management,admin-panel,responsive-design' \\"
echo "  --theme 'professional-blue-yellow' \\"
echo "  --deploy 'netlify'"
echo ""

echo -e "${PURPLE}💡 Pro Tips${NC}"
echo ""
echo "• Use --watch flag for real-time development"
echo "• Add --explain flag to understand generated code"
echo "• Use --interactive for step-by-step guidance"
echo "• Combine multiple prompts with && operator"
echo "• Save common prompts as templates"
echo ""

echo -e "${BLUE}🔍 Verification Commands${NC}"
echo ""
echo "claude-code validate html index.html"
echo "claude-code validate css css/"
echo "claude-code test run --coverage"
echo "claude-code audit accessibility"
echo "claude-code deploy check"
echo ""

echo -e "${RED}🚨 Important Notes${NC}"
echo ""
echo "• Claude Code is in research preview"
echo "• Requires valid Anthropic API key"
echo "• Internet connection needed for AI generation"
echo "• Review generated code before production use"
echo "• Keep backups of important modifications"
echo ""

echo -e "${GREEN}✨ Ready to build HEART website with Claude Code! 🚀${NC}"
echo ""
echo "Start with: mkdir heart-website && cd heart-website"
echo "Then run the commands above step by step!"
