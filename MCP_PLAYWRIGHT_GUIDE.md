# 🎭 MCP Playwright Guide for HEART Website

## 📋 Overview
MCP (Model Context Protocol) Playwright server provides browser automation capabilities that allow AI assistants to interact with web pages, take screenshots, and perform automated testing.

## ✅ Installation Complete
- ✅ **@playwright/mcp@0.0.29** installed globally
- ✅ **Browser binaries** downloaded (Chromium, Firefox, WebKit)
- ✅ **Test script** created for HEART website
- ✅ **Configuration** files ready

## 🚀 Quick Start

### 1. Manual Testing
```bash
# Test the MCP server directly
npx @playwright/mcp@latest

# Run HEART website test
node test-playwright-mcp.js
```

### 2. Claude Desktop Integration
Copy the configuration to your Claude Desktop config:

**macOS Location:**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Configuration:**
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

## 🛠️ Available Capabilities

### Browser Actions
- **Navigate**: Go to any URL
- **Click**: Click elements by selector or text
- **Type**: Enter text into form fields
- **Screenshot**: Capture page screenshots
- **Scroll**: Scroll page content
- **Wait**: Wait for elements or page loads

### HEART Website Testing Examples

#### 1. Test Authentication Flow
```javascript
// Navigate to website
navigate("http://localhost:3000")

// Click login button
click("text=Login")

// Fill login form
type("#username", "admin")
type("#password", "heart2024")

// Submit form
click("button[type=submit]")

// Take screenshot of result
screenshot()
```

#### 2. Test News Management
```javascript
// Login first (as above)
// Navigate to admin panel
click("text=Admin Panel")

// Test news creation
click("text=Create News")
type("#title", "Test News Article")
type("#content", "This is a test article content...")

// Submit and verify
click("button[type=submit]")
screenshot()
```

#### 3. Test Responsive Design
```javascript
// Test mobile view
setViewportSize(375, 667)
navigate("http://localhost:3000")
screenshot("mobile-view.png")

// Test tablet view
setViewportSize(768, 1024)
screenshot("tablet-view.png")

// Test desktop view
setViewportSize(1920, 1080)
screenshot("desktop-view.png")
```

## 🔧 Available MCP Tools

### `browser_action`
Main tool for browser interactions:
- `action`: Type of action (navigate, click, type, screenshot, etc.)
- `url`: Target URL (for navigate)
- `selector`: CSS selector or text selector
- `text`: Text to type
- `options`: Additional options (timeout, viewport, etc.)

### `get_accessibility_tree`
Get structured accessibility information:
- Returns semantic page structure
- Better than screenshots for LLM processing
- Includes interactive elements and their roles

### `evaluate_javascript`
Execute custom JavaScript:
- Run custom scripts on the page
- Extract data or perform complex interactions
- Return results to the MCP client

## 📊 Testing Scenarios for HEART Website

### 1. Authentication System
```bash
✅ Login with valid credentials
✅ Login with invalid credentials  
✅ Logout functionality
✅ Session persistence
✅ Admin panel access
```

### 2. News Management
```bash
✅ Create new news article
✅ Edit existing article
✅ Delete article
✅ View articles list
✅ Search functionality
```

### 3. User Interface
```bash
✅ Navigation menu responsiveness
✅ Modal popup functionality
✅ Form validation
✅ Toast notifications
✅ Mobile compatibility
```

### 4. Performance Testing
```bash
✅ Page load times
✅ Image loading
✅ JavaScript execution
✅ Memory usage
✅ Network requests
```

## 🎯 Example Test Session

```javascript
// Start browser session
await navigate("http://localhost:3000");

// Test homepage loading
const homePageLoaded = await waitForSelector("h1");
await screenshot("homepage.png");

// Test authentication
await click("text=Login");
await type("#username", "admin");
await type("#password", "heart2024");
await click("button[type=submit]");

// Verify login success
await waitForSelector("text=Admin Panel");
await screenshot("logged-in.png");

// Test admin functionality
await click("text=Admin Panel");
await waitForSelector("table");
await screenshot("admin-panel.png");

// Test logout
await click("text=Logout");
await waitForSelector("text=Login");
await screenshot("logged-out.png");
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Browser Not Found
```bash
# Reinstall browsers
npx playwright install
```

#### 2. MCP Server Not Responding
```bash
# Check if server starts
npx @playwright/mcp@latest --version

# Test with simple command
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}' | npx @playwright/mcp@latest
```

#### 3. Website Not Accessible
```bash
# Make sure HEART website is running
curl http://localhost:3000
```

## 🔄 Integration with Claude Code

When using MCP Playwright in Claude Code:

1. **Automated Testing**: Test your authentication system
2. **UI Validation**: Verify responsive design
3. **Bug Detection**: Find UI/UX issues
4. **Performance Monitoring**: Track page performance
5. **Screenshot Documentation**: Visual testing evidence

## 📈 Advanced Usage

### Custom Test Automation
Create automated test suites for:
- User registration flow
- News article workflow
- Contact form submission
- Search functionality
- Mobile responsiveness

### Performance Monitoring
- Page load timing
- Resource usage tracking
- JavaScript error detection
- Network performance analysis

### Visual Testing
- Screenshot comparison
- Layout verification
- Cross-browser compatibility
- Mobile/desktop differences

## 🎉 Ready to Use!

Your MCP Playwright setup is complete and ready for:
- ✅ **Browser automation** testing
- ✅ **Authentication system** validation  
- ✅ **News management** testing
- ✅ **UI/UX** verification
- ✅ **Performance** monitoring

Start testing your HEART website with AI-powered browser automation! 🚀