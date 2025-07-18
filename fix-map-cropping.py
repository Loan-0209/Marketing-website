#!/usr/bin/env python3
"""
Fix Map Cropping Issue - Optimize aspect ratio and container sizing
"""

import re
from pathlib import Path
import time

def fix_map_cropping():
    """Fix map cropping and optimize space utilization"""
    
    index_file = Path('index.html')
    
    if not index_file.exists():
        print("❌ index.html not found!")
        return False
    
    print("🎯 FIXING MAP CROPPING & SPACE OPTIMIZATION...")
    print("=" * 60)
    
    # Read current content
    html_content = index_file.read_text(encoding='utf-8')
    
    # Create backup
    timestamp = int(time.time())
    backup_file = f'index.html.crop-fix-backup-{timestamp}'
    Path(backup_file).write_text(html_content, encoding='utf-8')
    
    # Optimized CSS to fix cropping and utilize space better
    optimized_css = """
/* 🎯 OPTIMIZED MAP DISPLAY - Fix Cropping + Space Utilization */

/* 1. OPTIMAL ASPECT RATIO - Match original image proportions */
.location-map {
    position: sticky !important;
    top: 20px !important;
    width: 100% !important;
    height: auto !important;
    
    /* Aspect ratio optimized for full content display */
    aspect-ratio: 1.6/1 !important; /* Wider ratio to show full map */
    
    /* Increase max-height to utilize available space */
    max-height: calc(100vh - 40px) !important; /* Use more viewport */
    min-height: 500px !important; /* Ensure minimum size */
    
    border-radius: 20px !important;
    overflow: hidden !important;
    box-shadow: 0 15px 40px rgba(0,0,0,0.15) !important;
    transition: all 0.3s ease !important;
}

/* 2. SMART IMAGE FITTING - Show full content with minimal letterboxing */
.map-image {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important; /* Cover to fill space, but with smart positioning */
    object-position: center top !important; /* Prioritize top content (Phong Dien Port) */
    transition: transform 0.3s ease !important;
}

/* 3. RESPONSIVE BREAKPOINTS - Optimized for each screen size */
@media (min-width: 1400px) {
    .location-map {
        aspect-ratio: 1.8/1 !important; /* Even wider for large screens */
        max-height: calc(100vh - 60px) !important;
        min-height: 600px !important;
    }
}

@media (min-width: 1200px) and (max-width: 1399px) {
    .location-map {
        aspect-ratio: 1.7/1 !important;
        max-height: calc(100vh - 50px) !important;
        min-height: 550px !important;
    }
}

@media (min-width: 1024px) and (max-width: 1199px) {
    .location-map {
        aspect-ratio: 1.5/1 !important;
        max-height: calc(100vh - 40px) !important;
        min-height: 500px !important;
    }
}

@media (max-width: 1023px) {
    .location-map {
        position: static !important; /* Disable sticky on smaller screens */
        aspect-ratio: 1.4/1 !important;
        max-height: 70vh !important;
        min-height: 400px !important;
        margin-bottom: 2rem !important;
    }
}

@media (max-width: 768px) {
    .location-map {
        aspect-ratio: 1.2/1 !important;
        max-height: 60vh !important;
        min-height: 350px !important;
    }
}

/* 4. GRID OPTIMIZATION - Better space allocation */
.location-grid {
    display: grid !important;
    grid-template-columns: 0.75fr 1.25fr !important; /* More space for map */
    gap: 2rem 3rem !important;
    align-items: start !important;
    min-height: 600px !important; /* Ensure adequate container height */
}

@media (max-width: 1023px) {
    .location-grid {
        grid-template-columns: 1fr !important;
        gap: 2rem !important;
        min-height: auto !important;
    }
}

/* 5. SECTION SPACING OPTIMIZATION */
.location-section {
    padding: 40px 0 60px 0 !important; /* Reduced top, more bottom for balance */
    min-height: 70vh !important; /* Ensure section takes adequate space */
}

/* 6. ALTERNATIVE: Full Width Option for Maximum Display */
.location-map.fullwidth {
    grid-column: 1 / -1 !important;
    aspect-ratio: 2.2/1 !important;
    max-height: 80vh !important;
    margin: 2rem 0 !important;
}

/* 7. SMART POSITIONING for object-fit: cover */
.map-image.smart-position {
    object-position: center 20% !important; /* Show more of top area */
}

/* 8. FALLBACK for browsers without aspect-ratio support */
@supports not (aspect-ratio: 1.6/1) {
    .location-map {
        height: 600px !important;
    }
    
    @media (min-width: 1400px) {
        .location-map {
            height: 700px !important;
        }
    }
    
    @media (max-width: 1023px) {
        .location-map {
            height: 500px !important;
        }
    }
    
    @media (max-width: 768px) {
        .location-map {
            height: 400px !important;
        }
    }
}

/* 9. PERFORMANCE OPTIMIZATION */
.location-map {
    contain: layout style paint !important;
    will-change: transform !important;
}

/* 10. HOVER ENHANCEMENT */
.location-map:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 25px 60px rgba(0,0,0,0.2) !important;
}

.location-map:hover .map-image {
    transform: scale(1.01) !important;
}
"""
    
    # Insert optimized CSS before closing style tag
    if '</style>' in html_content:
        # Remove previous smart fix to avoid conflicts
        html_content = re.sub(r'/\* 🧠 SMART MAP FIX - Full Image \+ Scroll Effect \*/.*?(?=/\*|</style>)', '', html_content, flags=re.DOTALL)
        
        # Insert new optimized CSS
        html_content = html_content.replace('</style>', f'\n/* 🎯 OPTIMIZED MAP DISPLAY - Fix Cropping + Space Utilization */\n{optimized_css}\n</style>')
        
        # Write updated content
        index_file.write_text(html_content, encoding='utf-8')
        
        print("✅ MAP CROPPING FIX APPLIED!")
        print(f"📁 Backup created: {backup_file}")
        print()
        print("🎯 OPTIMIZATIONS APPLIED:")
        print("• 📐 Wider aspect-ratios (1.6:1 to 1.8:1) for full content")
        print("• 📏 Increased max-height (utilize more viewport)")
        print("• 🎨 Object-fit: cover with smart positioning") 
        print("• 📱 Responsive breakpoints for all screen sizes")
        print("• ⚡ Grid optimization (more space for map)")
        print("• 🎭 Section height optimization")
        print()
        print("🔄 EXPECTED IMPROVEMENTS:")
        print("• ✅ Show Da Nang City and full map content")
        print("• ✅ Reduce whitespace below map")
        print("• ✅ Better space utilization")
        print("• ✅ Maintain scroll effect")
        print("• ✅ Responsive on all devices")
        
        return True
    else:
        print("❌ Could not find </style> tag")
        return False

if __name__ == "__main__":
    fix_map_cropping()
