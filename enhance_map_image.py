#!/usr/bin/env python3
"""
Image Enhancement Script for HEART Technology Park Location Map
Improves image quality using PIL and OpenCV
"""

import cv2
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter
import os
import shutil
from datetime import datetime

def backup_original(image_path):
    """Create backup of original image"""
    backup_path = image_path.replace('.jpg', '_original_backup.jpg')
    if not os.path.exists(backup_path):
        shutil.copy2(image_path, backup_path)
        print(f"✅ Backup created: {backup_path}")
    return backup_path

def enhance_image_pil(img):
    """Enhance image using PIL methods"""
    print("🔧 Applying PIL enhancements...")
    
    # 1. Upscaling with high-quality resampling
    width, height = img.size
    new_size = (int(width * 1.5), int(height * 1.5))  # 1.5x instead of 2x for balance
    img_upscaled = img.resize(new_size, Image.LANCZOS)
    print(f"   📏 Upscaled to: {new_size[0]} x {new_size[1]}")
    
    # 2. Enhance sharpness
    enhancer = ImageEnhance.Sharpness(img_upscaled)
    img_sharp = enhancer.enhance(1.8)  # More conservative sharpening
    print("   🔪 Sharpness enhanced")
    
    # 3. Improve contrast
    enhancer = ImageEnhance.Contrast(img_sharp)
    img_contrast = enhancer.enhance(1.2)  # Subtle contrast boost
    print("   🌈 Contrast improved")
    
    # 4. Enhance colors
    enhancer = ImageEnhance.Color(img_contrast)
    img_color = enhancer.enhance(1.15)  # Gentle color enhancement
    print("   🎨 Colors enhanced")
    
    # 5. Reduce noise with gentle smoothing
    img_final = img_color.filter(ImageFilter.SMOOTH)
    print("   🧹 Noise reduced")
    
    return img_final

def enhance_image_opencv(img_pil):
    """Apply advanced enhancements using OpenCV"""
    print("🔧 Applying OpenCV enhancements...")
    
    # Convert PIL to OpenCV format
    img_cv = cv2.cvtColor(np.array(img_pil), cv2.COLOR_RGB2BGR)
    
    # 1. Gentle denoising
    img_denoised = cv2.bilateralFilter(img_cv, 9, 75, 75)
    print("   🔇 Bilateral filter applied")
    
    # 2. Unsharp masking for better sharpening
    gaussian = cv2.GaussianBlur(img_denoised, (0, 0), 1.5)
    img_sharpened = cv2.addWeighted(img_denoised, 1.3, gaussian, -0.3, 0)
    print("   ⚡ Unsharp masking applied")
    
    # 3. CLAHE for better local contrast
    lab = cv2.cvtColor(img_sharpened, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    l = clahe.apply(l)
    img_enhanced = cv2.merge([l, a, b])
    img_final_cv = cv2.cvtColor(img_enhanced, cv2.COLOR_LAB2BGR)
    print("   📊 CLAHE applied")
    
    # Convert back to PIL
    img_final = Image.fromarray(cv2.cvtColor(img_final_cv, cv2.COLOR_BGR2RGB))
    
    return img_final

def create_responsive_versions(img_enhanced, base_path):
    """Create multiple sizes for responsive design"""
    print("📱 Creating responsive versions...")
    
    # Define sizes for different breakpoints
    sizes = {
        'high': (2400, 1800),      # 2x original for high-DPI displays
        'desktop': (1800, 1350),   # 1.5x original for desktop
        'tablet': (1200, 900),     # Original size for tablets
        'mobile': (800, 600),      # Smaller for mobile
        'thumbnail': (400, 300)    # Very small for thumbnails
    }
    
    created_files = {}
    
    for quality_name, size in sizes.items():
        # Calculate size maintaining aspect ratio
        img_resized = img_enhanced.resize(size, Image.LANCZOS)
        
        # Create filename
        output_path = base_path.replace('.jpg', f'-{quality_name}.jpg')
        
        # Save with optimized quality
        quality = 95 if quality_name in ['high', 'desktop'] else 90
        img_resized.save(output_path, 'JPEG', quality=quality, optimize=True)
        
        file_size = os.path.getsize(output_path) / 1024
        print(f"   📄 {quality_name}: {size[0]}x{size[1]} - {file_size:.1f} KB")
        
        created_files[quality_name] = {
            'path': output_path,
            'size': size,
            'file_size': file_size
        }
    
    return created_files

def create_webp_version(img_enhanced, base_path):
    """Create WebP version for better compression"""
    print("🌐 Creating WebP version...")
    
    webp_path = base_path.replace('.jpg', '.webp')
    img_enhanced.save(webp_path, 'WEBP', quality=85, optimize=True)
    
    file_size = os.path.getsize(webp_path) / 1024
    print(f"   📦 WebP: {file_size:.1f} KB (saved)")
    
    return webp_path

def calculate_improvement_metrics(original_path, enhanced_path):
    """Calculate improvement metrics"""
    print("📊 Calculating improvement metrics...")
    
    # File size comparison
    original_size = os.path.getsize(original_path) / 1024
    enhanced_size = os.path.getsize(enhanced_path) / 1024
    
    # Resolution comparison
    with Image.open(original_path) as orig:
        orig_res = orig.size
    
    with Image.open(enhanced_path) as enh:
        enh_res = enh.size
    
    print(f"   📏 Resolution: {orig_res[0]}x{orig_res[1]} → {enh_res[0]}x{enh_res[1]}")
    print(f"   💾 File size: {original_size:.1f} KB → {enhanced_size:.1f} KB")
    
    resolution_increase = (enh_res[0] * enh_res[1]) / (orig_res[0] * orig_res[1])
    print(f"   📈 Resolution increase: {resolution_increase:.1f}x")
    
    return {
        'original_resolution': orig_res,
        'enhanced_resolution': enh_res,
        'original_size_kb': original_size,
        'enhanced_size_kb': enhanced_size,
        'resolution_multiplier': resolution_increase
    }

def main():
    """Main enhancement process"""
    print("🖼️  HEART MAP IMAGE ENHANCEMENT")
    print("=" * 50)
    
    # Paths
    image_path = "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/assets/images/hue-location-map.jpg"
    
    if not os.path.exists(image_path):
        print("❌ Image file not found!")
        return
    
    # Create backup
    backup_path = backup_original(image_path)
    
    # Load original image
    print("📖 Loading original image...")
    with Image.open(image_path) as img:
        print(f"   Original: {img.size[0]}x{img.size[1]}, {img.mode}")
        
        # Step 1: PIL enhancements
        img_pil_enhanced = enhance_image_pil(img)
        
        # Step 2: OpenCV enhancements
        img_final = enhance_image_opencv(img_pil_enhanced)
        
        # Save main enhanced version
        enhanced_path = image_path.replace('.jpg', '-enhanced.jpg')
        img_final.save(enhanced_path, 'JPEG', quality=95, optimize=True)
        print(f"✅ Main enhanced version saved: {enhanced_path}")
        
        # Step 3: Create responsive versions
        responsive_files = create_responsive_versions(img_final, image_path)
        
        # Step 4: Create WebP version
        webp_path = create_webp_version(img_final, image_path)
        
        # Step 5: Calculate metrics
        metrics = calculate_improvement_metrics(image_path, enhanced_path)
        
        print("\n📊 ENHANCEMENT SUMMARY:")
        print("=" * 50)
        print(f"✅ Original image backed up")
        print(f"✅ Enhanced main image created")
        print(f"✅ {len(responsive_files)} responsive versions created")
        print(f"✅ WebP version created")
        print(f"📈 Resolution increased by {metrics['resolution_multiplier']:.1f}x")
        print(f"📱 Ready for responsive web implementation")
        
        return {
            'enhanced_path': enhanced_path,
            'responsive_files': responsive_files,
            'webp_path': webp_path,
            'metrics': metrics
        }

if __name__ == "__main__":
    result = main()