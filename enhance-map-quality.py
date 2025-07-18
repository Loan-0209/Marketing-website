#!/usr/bin/env python3
"""
HEART Location Map Quality Enhancement Script
Cải thiện chất lượng hình ảnh bản đồ từ mờ thành sắc nét
"""

import os
import cv2
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter
import subprocess

def install_requirements():
    """Cài đặt các thư viện cần thiết"""
    try:
        import cv2
        import PIL
        print("✅ All required libraries are installed")
    except ImportError:
        print("📦 Installing required libraries...")
        subprocess.run(["pip3", "install", "opencv-python", "Pillow"], check=True)

def enhance_image_quality(input_path, output_dir):
    """Cải thiện chất lượng hình ảnh"""
    print(f"🖼️ Processing: {input_path}")
    
    if not os.path.exists(input_path):
        print(f"❌ File not found: {input_path}")
        return False
    
    # Tạo thư mục output nếu chưa có
    os.makedirs(output_dir, exist_ok=True)
    
    try:
        # Đọc hình ảnh bằng PIL
        with Image.open(input_path) as img:
            print(f"📏 Original size: {img.size}")
            
            # 1. Upscaling 2x với LANCZOS
            width, height = img.size
            new_size = (width * 2, height * 2)
            img_upscaled = img.resize(new_size, Image.LANCZOS)
            print(f"📈 Upscaled to: {img_upscaled.size}")
            
            # 2. Tăng độ sắc nét
            enhancer = ImageEnhance.Sharpness(img_upscaled)
            img_sharp = enhancer.enhance(1.8)  # Tăng sharpness
            
            # 3. Cải thiện contrast
            enhancer = ImageEnhance.Contrast(img_sharp)
            img_contrast = enhancer.enhance(1.2)
            
            # 4. Cải thiện màu sắc
            enhancer = ImageEnhance.Color(img_contrast)
            img_color = enhancer.enhance(1.1)
            
            # 5. Áp dụng smooth filter nhẹ
            img_smooth = img_color.filter(ImageFilter.SMOOTH_MORE)
            
        # Chuyển sang OpenCV để xử lý nâng cao
        img_cv = cv2.cvtColor(np.array(img_smooth), cv2.COLOR_RGB2BGR)
        
        # 6. Giảm noise
        img_denoised = cv2.fastNlMeansDenoisingColored(img_cv, None, 6, 6, 7, 21)
        
        # 7. Unsharp masking
        gaussian = cv2.GaussianBlur(img_denoised, (0, 0), 1.5)
        img_sharpened = cv2.addWeighted(img_denoised, 1.4, gaussian, -0.4, 0)
        
        # 8. CLAHE cho cải thiện contrast
        lab = cv2.cvtColor(img_sharpened, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=2.5, tileGridSize=(8,8))
        l = clahe.apply(l)
        img_enhanced = cv2.merge([l, a, b])
        img_final_cv = cv2.cvtColor(img_enhanced, cv2.COLOR_LAB2BGR)
        
        # Chuyển về PIL
        img_final = Image.fromarray(cv2.cvtColor(img_final_cv, cv2.COLOR_BGR2RGB))
        
        # Tạo nhiều kích thước responsive
        sizes = {
            'high': (1600, 1200),
            'desktop': (1200, 900), 
            'tablet': (800, 600),
            'mobile': (400, 300)
        }
        
        created_files = []
        
        for quality_name, size in sizes.items():
            img_resized = img_final.resize(size, Image.LANCZOS)
            
            # Lưu JPEG chất lượng cao
            jpg_path = os.path.join(output_dir, f"hue-location-map-{quality_name}.jpg")
            img_resized.save(jpg_path, 'JPEG', quality=95, optimize=True)
            created_files.append(jpg_path)
            print(f"✅ Created: hue-location-map-{quality_name}.jpg ({size[0]}x{size[1]})")
        
        # Tạo WebP version
        webp_path = os.path.join(output_dir, "hue-location-map.webp")
        img_final.resize((1200, 900), Image.LANCZOS).save(webp_path, 'WEBP', quality=90)
        created_files.append(webp_path)
        print(f"✅ Created: hue-location-map.webp (optimized)")
        
        # Backup file gốc và thay thế
        backup_path = os.path.join(output_dir, "hue-location-map-original-backup.jpg")
        if os.path.exists(input_path):
            import shutil
            shutil.copy2(input_path, backup_path)
            print(f"💾 Backup saved: hue-location-map-original-backup.jpg")
        
        # Thay thế file gốc bằng version desktop
        desktop_path = os.path.join(output_dir, "hue-location-map-desktop.jpg")
        if os.path.exists(desktop_path):
            import shutil
            shutil.copy2(desktop_path, input_path)
            print(f"🔄 Replaced original with enhanced version")
        
        return True, created_files
        
    except Exception as e:
        print(f"❌ Error processing image: {e}")
        return False, []

def update_html_responsive(html_path):
    """Cập nhật HTML để sử dụng responsive images"""
    try:
        with open(html_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Tìm và thay thế img tag
        old_pattern = 'src="assets/images/hue-location-map.jpg"'
        new_pattern = '''srcset="assets/images/hue-location-map-mobile.jpg 400w,
                        assets/images/hue-location-map-tablet.jpg 800w,
                        assets/images/hue-location-map-desktop.jpg 1200w,
                        assets/images/hue-location-map-high.jpg 1600w"
                 sizes="(max-width: 768px) 400px,
                        (max-width: 1024px) 800px,
                        (max-width: 1440px) 1200px,
                        1600px"
                 src="assets/images/hue-location-map-desktop.jpg"'''
        
        if old_pattern in content:
            content = content.replace(old_pattern, new_pattern)
            
            with open(html_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print("✅ HTML updated with responsive images")
            return True
        else:
            print("⚠️ Image tag not found in HTML - manual update may be needed")
            return False
            
    except Exception as e:
        print(f"❌ Error updating HTML: {e}")
        return False

def main():
    print("🖼️ HEART Location Map Quality Enhancement")
    print("=" * 50)
    
    # Paths
    project_dir = "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"
    input_path = os.path.join(project_dir, "assets/images/hue-location-map.jpg")
    output_dir = os.path.join(project_dir, "assets/images")
    html_path = os.path.join(project_dir, "index.html")
    
    # Install requirements
    install_requirements()
    
    # Enhance image quality
    success, created_files = enhance_image_quality(input_path, output_dir)
    
    if success:
        print(f"\n🎉 Image enhancement completed!")
        print(f"📁 Created {len(created_files)} optimized versions")
        
        # Update HTML
        if update_html_responsive(html_path):
            print("🌐 HTML updated for responsive images")
        
        print("\n📊 QUALITY IMPROVEMENT REPORT:")
        print("• Original image: Backed up")
        print("• Sharpness: Enhanced significantly") 
        print("• Resolution: Doubled (upscaled)")
        print("• Contrast: Improved")
        print("• Noise: Reduced")
        print("• Responsive: 4 sizes created")
        print("• WebP: Optimized version created")
        
        print("\n🚀 NEXT STEPS:")
        print("1. Refresh your website to see improvements")
        print("2. Test on different devices")
        print("3. Check page load speed")
        
    else:
        print("❌ Image enhancement failed")

if __name__ == "__main__":
    main()
