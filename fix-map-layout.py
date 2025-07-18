#!/usr/bin/env python3
"""
Map Layout Optimization Script
Analyzes current layout and provides CSS fixes for better map display
"""

import os
import re
from pathlib import Path

class MapLayoutOptimizer:
    def __init__(self, project_root='.'):
        self.project_root = Path(project_root)
        
    def analyze_current_layout(self):
        """Analyze current CSS and HTML for map layout issues"""
        print("🔍 ANALYZING CURRENT MAP LAYOUT...")
        
        # Find HTML files containing map
        html_files = []
        css_files = []
        
        for file in self.project_root.glob('*.html'):
            try:
                content = file.read_text(encoding='utf-8')
                if 'hue-location-map' in content.lower() or 'location' in content.lower():
                    html_files.append(file)
                    print(f"✅ Found map in: {file.name}")
            except:
                continue
                
        # Find CSS files
        css_dir = self.project_root / 'css'
        if css_dir.exists():
            for file in css_dir.glob('*.css'):
                css_files.append(file)
                
        # Check styles.css in root
        if (self.project_root / 'styles.css').exists():
            css_files.append(self.project_root / 'styles.css')
            
        return html_files, css_files
    
    def get_image_info(self):
        """Get information about map images"""
        images_dir = self.project_root / 'assets' / 'images'
        map_images = []
        
        if images_dir.exists():
            for img in images_dir.glob('hue-location-map*'):
                if img.suffix.lower() in ['.jpg', '.jpeg', '.png', '.webp']:
                    size = img.stat().st_size
                    map_images.append({
                        'name': img.name,
                        'size': f"{size // 1024}KB",
                        'path': str(img)
                    })
        
        return map_images
    
    def create_optimized_css(self):
        """Create optimized CSS for map layout"""
        css_fixes = """
/* 🎯 OPTIMIZED MAP LAYOUT CSS */

/* Container tối ưu cho map */
.location-section {
    padding: 2rem 0; /* Giảm padding để tận dụng không gian */
    margin: 0;
}

.map-container {
    width: 100%;
    max-width: 1200px; /* Tăng max-width */
    margin: 0 auto;
    position: relative;
    /* Aspect ratio theo tỷ lệ hình gốc */
    aspect-ratio: 16/10; /* Điều chỉnh theo tỷ lệ hình thực tế */
}

.map-image {
    width: 100%;
    height: 100%;
    object-fit: contain; /* Hiển thị full image, không crop */
    object-position: center;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
}

/* Hover effect */
.map-image:hover {
    transform: scale(1.02);
}

/* Responsive breakpoints */
@media (max-width: 768px) {
    .location-section {
        padding: 1rem 0;
    }
    
    .map-container {
        aspect-ratio: 4/3; /* Tỷ lệ khác cho mobile */
        margin: 0 1rem;
    }
}

@media (max-width: 480px) {
    .map-container {
        aspect-ratio: 1/1; /* Square cho screen nhỏ */
    }
}

/* Alternative: Fullwidth approach */
.map-fullwidth {
    width: 100vw;
    margin-left: calc(-50vw + 50%);
    height: 60vh; /* Cố định height */
    object-fit: cover;
    object-position: center top; /* Ưu tiên hiển thị phần trên */
}

/* Grid layout optimization */
.content-grid {
    display: grid;
    grid-template-columns: 1fr 2fr; /* Text nhỏ, map lớn */
    gap: 2rem;
    align-items: center;
}

@media (max-width: 768px) {
    .content-grid {
        grid-template-columns: 1fr; /* Stack trên mobile */
        gap: 1rem;
    }
}
"""
        return css_fixes
    
    def create_html_template(self):
        """Create optimized HTML template for map section"""
        html_template = """
<!-- 🎯 OPTIMIZED MAP SECTION -->
<section class="location-section">
    <div class="container">
        <div class="content-grid">
            <!-- Text content -->
            <div class="location-info">
                <h2>Vị trí chiến lược</h2>
                <p>Khu Công nghệ cao Huế nằm tại vị trí đắc địa...</p>
                <ul class="location-features">
                    <li>🛫 Gần sân bay Phú Bài</li>
                    <li>🚢 Kết nối cảng Thuận An</li>
                    <li>🏭 Trung tâm 300MW Data Center</li>
                </ul>
            </div>
            
            <!-- Map container -->
            <div class="map-container">
                <img 
                    src="assets/images/hue-location-map-desktop.jpg" 
                    alt="Bản đồ vị trí Khu Công nghệ cao Huế"
                    class="map-image"
                    loading="lazy"
                />
            </div>
        </div>
    </div>
</section>

<!-- Alternative: Fullwidth map -->
<section class="location-section-fullwidth">
    <div class="container">
        <h2 class="text-center mb-4">Vị trí địa lý</h2>
    </div>
    <img 
        src="assets/images/hue-location-map-desktop.jpg" 
        alt="Bản đồ vị trí Khu Công nghệ cao Huế"
        class="map-fullwidth"
        loading="lazy"
    />
</section>
"""
        return html_template
    
    def analyze_and_recommend(self):
        """Main analysis and recommendation function"""
        print("=" * 60)
        print("🎯 MAP LAYOUT OPTIMIZATION ANALYSIS")
        print("=" * 60)
        
        # Analyze current files
        html_files, css_files = self.analyze_current_layout()
        map_images = self.get_image_info()
        
        print(f"\n📁 Found {len(html_files)} HTML files with maps")
        print(f"📁 Found {len(css_files)} CSS files")
        print(f"🖼️ Found {len(map_images)} map images")
        
        print("\n🖼️ MAP IMAGES:")
        for img in map_images:
            print(f"  • {img['name']} ({img['size']})")
        
        print("\n💡 RECOMMENDATIONS:")
        print("1. 🎨 Use object-fit: contain instead of cover")
        print("2. 📐 Set proper aspect-ratio for container")
        print("3. 📱 Optimize responsive breakpoints")
        print("4. 🚀 Reduce unnecessary padding/margins")
        print("5. 🔄 Consider fullwidth layout option")
        
        # Create fix files
        css_file = self.project_root / 'map-layout-fixes.css'
        html_file = self.project_root / 'map-layout-template.html'
        
        css_file.write_text(self.create_optimized_css(), encoding='utf-8')
        html_file.write_text(self.create_html_template(), encoding='utf-8')
        
        print(f"\n✅ Created optimization files:")
        print(f"  • {css_file.name} - CSS fixes")
        print(f"  • {html_file.name} - HTML template")
        
        return {
            'html_files': [str(f) for f in html_files],
            'css_files': [str(f) for f in css_files],
            'map_images': map_images,
            'fix_files': [str(css_file), str(html_file)]
        }

if __name__ == "__main__":
    optimizer = MapLayoutOptimizer()
    result = optimizer.analyze_and_recommend()
    
    print("\n🚀 NEXT STEPS:")
    print("1. Review generated CSS fixes")
    print("2. Apply changes to your HTML/CSS")
    print("3. Test responsive behavior")
    print("4. Optimize image dimensions if needed")
