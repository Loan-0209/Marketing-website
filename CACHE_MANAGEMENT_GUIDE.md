# 🚀 HEART Website Cache Management Guide

**Comprehensive guide for managing browser cache and image optimization**

---

## 📋 OVERVIEW

This guide provides complete instructions for managing cache behavior on the HEART website to prevent browser cache mismatch issues with map images.

### 🎯 Problem Solved
- Browser cache serving old versions of map images
- Inconsistent image display across different browsers
- Cache invalidation when images are updated

### 💡 Solution Implemented
- **Cache Busting System**: Version parameters automatically added to image URLs
- **HTTP Headers**: Proper cache-control headers for different file types
- **Versioning System**: Automatic version tracking for all images
- **Maintenance Tools**: Scripts for ongoing cache management

---

## 🛠️ INSTALLED COMPONENTS

### 1. Core Files
```
📁 HEART Website Root/
├── 📄 .htaccess                    # Apache cache configuration
├── 📄 image-version.json          # Version tracking data
├── 📄 cache-server.py             # Python server with cache headers
├── 📄 update-versions.py          # Version management script
├── 📄 backup-system.py            # Backup and restore system
├── 📄 image-optimizer.py          # Image optimization pipeline
├── 📄 test-cache.py               # Cache validation tests
├── 📄 maintenance.py              # All-in-one maintenance tool
├── 📁 js/
│   └── 📄 cache-buster.js         # Client-side cache busting
└── 📁 assets/images/
    ├── 📄 hue-location-map-mobile.jpg
    ├── 📄 hue-location-map-tablet.jpg
    ├── 📄 hue-location-map-desktop.jpg
    ├── 📄 hue-location-map-high.jpg
    └── 📄 [WebP versions of all above]
```

### 2. Generated Files
```
📁 Generated During Operation/
├── 📄 cache-test-report.json      # Test results
├── 📄 optimization-report.json    # Image optimization results
├── 📁 backups/                    # Backup archives
├── 📁 assets/optimized/           # Optimized image versions
└── 📁 cdn/                        # CDN-ready structure
```

---

## 🚀 QUICK START

### Option 1: Use Maintenance Manager (Recommended)
```bash
# Run complete maintenance routine
python3 maintenance.py full

# Start optimized server
python3 maintenance.py server 3000
```

### Option 2: Manual Steps
```bash
# 1. Update image versions
python3 update-versions.py update

# 2. Create backup
python3 backup-system.py create

# 3. Start cache-optimized server
python3 cache-server.py 3000

# 4. Test cache behavior
python3 test-cache.py
```

---

## 📚 DETAILED USAGE

### 🔧 Maintenance Manager
The main tool for all cache management tasks:

```bash
# Show help
python3 maintenance.py help

# Run health check
python3 maintenance.py health

# Clear server cache
python3 maintenance.py clear-cache

# Update image versions
python3 maintenance.py update-versions

# Create backup
python3 maintenance.py backup

# Optimize images
python3 maintenance.py optimize

# Run cache tests
python3 maintenance.py test

# Start optimized server
python3 maintenance.py server [port]

# Show browser cache instructions
python3 maintenance.py browser-cache
```

### 📊 Version Management
Track and update image versions automatically:

```bash
# Update all versions
python3 update-versions.py update

# Show current versions
python3 update-versions.py show

# Get version for specific image
python3 update-versions.py version hue-location-map-desktop.jpg
```

**Version File Structure:**
```json
{
  "version": "1.0.1",
  "lastUpdate": "2025-07-15T15:39:24.897110",
  "images": {
    "hue-location-map-desktop": {
      "version": "1.1.2",
      "timestamp": "1752564201",
      "size": "147044",
      "hash": "861a7675321b9a1a99ce6509023a3ea0"
    }
  }
}
```

### 💾 Backup System
Create and manage backups:

```bash
# Create backup
python3 backup-system.py create [backup_name]

# List backups
python3 backup-system.py list

# Restore from backup
python3 backup-system.py restore backup_name

# Clean old backups (keep latest 5)
python3 backup-system.py cleanup 5
```

### 🧪 Cache Testing
Validate cache behavior:

```bash
# Run all tests
python3 test-cache.py

# Test specific server
python3 test-cache.py http://localhost:8000
```

**Test Categories:**
- ✅ Image Loading Test
- ✅ Cache Headers Test  
- ✅ Version Invalidation Test
- ✅ JavaScript Cache Buster Test

---

## 🌐 SERVER CONFIGURATIONS

### Development Server (Python)
```bash
# Start cache-optimized server
python3 cache-server.py 3000
```

**Features:**
- Automatic cache headers
- Version parameter handling
- Security headers
- Content-Type detection

### Production Server (Apache)
The `.htaccess` file is configured for Apache with:

```apache
# Cache Control for Images
<FilesMatch "hue-location-map.*\.(jpg|jpeg|webp)$">
    Header set Cache-Control "public, max-age=604800, must-revalidate"
    Header set ETag "W/\"heart-map-v1.1.0\""
</FilesMatch>

# Force revalidation for versioned files
<FilesMatch "\.(jpg|jpeg|png|gif|webp|css|js)\?v=">
    Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>
```

---

## 🔄 WORKFLOW

### Daily Operations
1. **Start server**: `python3 maintenance.py server 3000`
2. **Check health**: `python3 maintenance.py health`

### When Images Are Updated
1. **Update versions**: `python3 maintenance.py update-versions`
2. **Create backup**: `python3 maintenance.py backup`
3. **Test cache**: `python3 maintenance.py test`

### Weekly Maintenance
1. **Full maintenance**: `python3 maintenance.py full`
2. **Clean backups**: `python3 backup-system.py cleanup 5`

---

## 🛡️ TROUBLESHOOTING

### Common Issues

#### 1. **Browser Still Shows Old Images**
```bash
# Solution 1: Force refresh
# Chrome/Firefox: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

# Solution 2: Clear browser cache
python3 maintenance.py browser-cache

# Solution 3: Update versions
python3 maintenance.py update-versions
```

#### 2. **Cache Headers Not Working**
```bash
# Check server type
python3 maintenance.py health

# Test cache headers
python3 maintenance.py test

# Restart with optimized server
python3 maintenance.py server 3000
```

#### 3. **Version File Corrupted**
```bash
# Restore from backup
python3 backup-system.py list
python3 backup-system.py restore backup_name

# Or regenerate versions
python3 update-versions.py update
```

#### 4. **Images Not Loading**
```bash
# Check image files
ls -la assets/images/hue-location-map-*

# Run health check
python3 maintenance.py health

# Test image loading
python3 maintenance.py test
```

### Emergency Recovery
```bash
# 1. Stop current server
# Press Ctrl+C

# 2. Restore from backup
python3 backup-system.py restore latest_backup_name

# 3. Clear all caches
python3 maintenance.py clear-cache

# 4. Update versions
python3 maintenance.py update-versions

# 5. Start server
python3 maintenance.py server 3000
```

---

## 📈 PERFORMANCE MONITORING

### Cache Test Results
The system automatically generates test reports:

```json
{
  "timestamp": "2025-07-15T15:39:24.897110",
  "tests": [
    {
      "name": "Image Loading Test",
      "status": "completed",
      "results": [...]
    }
  ]
}
```

### Image Optimization Results
Track optimization performance:

```json
{
  "summary": {
    "total_files": 4,
    "optimized_files": 4,
    "total_savings_bytes": 125432,
    "total_savings_mb": 0.12
  }
}
```

---

## 🔮 ADVANCED FEATURES

### CDN Integration
```bash
# Create CDN-ready structure
python3 image-optimizer.py

# Generated structure:
# cdn/v1.0.1/hue-location-map-desktop.jpg
# cdn/manifest.json
```

### Automated Monitoring
```bash
# Set up file watching (requires additional setup)
# Monitor for image changes and auto-update versions
```

### Custom Cache Strategies
Modify `cache-server.py` for custom cache behavior:

```python
def send_image_headers(self, path):
    if 'hue-location-map' in path:
        # Custom cache duration for map images
        self.send_header('Cache-Control', 'public, max-age=86400')
```

---

## 📞 SUPPORT

### Health Check
```bash
python3 maintenance.py health
```

### View Logs
```bash
# Server logs are printed to console
# Test results saved to cache-test-report.json
```

### Contact
- 📧 Technical issues: Check DIAGNOSTIC_REPORT.md
- 🔧 Maintenance: Use maintenance.py commands
- 📊 Performance: Review optimization-report.json

---

## 🎯 BEST PRACTICES

1. **Regular Maintenance**: Run `maintenance.py full` weekly
2. **Before Updates**: Always create backup before changing images
3. **Testing**: Run cache tests after any configuration changes
4. **Monitoring**: Check health status before starting server
5. **Documentation**: Keep this guide updated with any customizations

---

*Last updated: 2025-07-15*  
*Version: 1.0.1*  
*Generated by: Claude Code Cache Management System*