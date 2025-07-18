#!/usr/bin/env python3
"""
Move HEART Button to Hue Hi Tech Park Position
"""

import re
from pathlib import Path
import time

def move_heart_button():
    """Move HEART button to Hue Hi Tech Park position on map"""
    
    index_file = Path('index.html')
    
    if not index_file.exists():
        print("❌ index.html not found!")
        return False
    
    print("🎯 MOVING HEART BUTTON TO HUE HI TECH PARK POSITION...")
    print("=" * 60)
    
    # Read current content
    html_content = index_file.read_text(encoding='utf-8')
    
    # Create backup
    timestamp = int(time.time())
    backup_file = f'index.html.move-heart-backup-{timestamp}'
    Path(backup_file).write_text(html_content, encoding='utf-8')
    
    # CSS and JavaScript to move HEART button
    move_heart_css_js = """
/* 🎯 MOVE HEART BUTTON TO HUE HI TECH PARK POSITION */

/* Hide original HEART overlay if it exists */
.map-overlay div:contains("HEART"):not(.heart-relocated) {
    display: none !important;
}

/* Style for relocated HEART button */
.heart-button-relocated {
    position: absolute !important;
    top: 45% !important; /* Position near Hue Hi Tech Park area */
    left: 35% !important; /* Adjust based on map layout */
    z-index: 100 !important;
    
    /* Button styling */
    background: linear-gradient(135deg, #4A90E2, #357ABD) !important;
    color: white !important;
    padding: 8px 16px !important;
    border-radius: 25px !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    box-shadow: 0 4px 15px rgba(74, 144, 226, 0.4) !important;
    border: 2px solid rgba(255, 255, 255, 0.9) !important;
    cursor: pointer !important;
    transition: all 0.3s ease !important;
    
    /* Ensure visibility */
    display: flex !important;
    align-items: center !important;
    gap: 6px !important;
    min-width: 80px !important;
    text-align: center !important;
    justify-content: center !important;
}

/* Hover effect for relocated HEART button */
.heart-button-relocated:hover {
    transform: scale(1.05) !important;
    box-shadow: 0 6px 20px rgba(74, 144, 226, 0.6) !important;
    background: linear-gradient(135deg, #357ABD, #2E6BA8) !important;
}

/* Icon for HEART button */
.heart-button-relocated::before {
    content: "📍" !important;
    font-size: 16px !important;
    margin-right: 4px !important;
}

/* Responsive positioning */
@media (max-width: 1024px) {
    .heart-button-relocated {
        top: 50% !important;
        left: 40% !important;
        font-size: 12px !important;
        padding: 6px 12px !important;
    }
}

@media (max-width: 768px) {
    .heart-button-relocated {
        top: 55% !important;
        left: 45% !important;
        font-size: 11px !important;
        padding: 5px 10px !important;
    }
}

/* Alternative positioning if above doesn't work well */
.heart-button-relocated.alternative-position {
    top: 40% !important;
    left: 30% !important;
}

/* Make sure it appears above other elements */
.location-map {
    position: relative !important;
}

<script>
// 🎯 JavaScript to move HEART button to Hue Hi Tech Park position
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Moving HEART button to Hue Hi Tech Park position...');
    
    function createRelocatedHeartButton() {
        // Find the map container
        const mapContainer = document.querySelector('.location-map, .map-container');
        
        if (!mapContainer) {
            console.log('❌ Map container not found');
            return;
        }
        
        // Remove any existing relocated button
        const existingButton = mapContainer.querySelector('.heart-button-relocated');
        if (existingButton) {
            existingButton.remove();
        }
        
        // Create new HEART button
        const heartButton = document.createElement('div');
        heartButton.className = 'heart-button-relocated';
        heartButton.textContent = 'HEART';
        heartButton.title = 'HEART - 300MW Data Center Location';
        
        // Add click handler
        heartButton.addEventListener('click', function() {
            console.log('🎯 HEART button clicked!');
            // Add your click handler logic here
            alert('HEART - Vietnam\'s First 300MW AI-Optimized Hyperscale Data Center');
        });
        
        // Add button to map container
        mapContainer.style.position = 'relative';
        mapContainer.appendChild(heartButton);
        
        console.log('✅ HEART button relocated to Hue Hi Tech Park position');
        
        return heartButton;
    }
    
    // Function to position button precisely
    function positionHeartButton() {
        const heartButton = document.querySelector('.heart-button-relocated');
        const mapImage = document.querySelector('.map-image, .location-map img');
        
        if (!heartButton || !mapImage) return;
        
        // Get map dimensions
        const mapRect = mapImage.getBoundingClientRect();
        const mapContainer = heartButton.parentElement.getBoundingClientRect();
        
        // Calculate relative position for Hue Hi Tech Park area
        // Based on typical map layout where Hue Hi Tech Park is roughly center-left
        const relativeX = 0.35; // 35% from left
        const relativeY = 0.45; // 45% from top
        
        // Set position
        heartButton.style.left = (relativeX * 100) + '%';
        heartButton.style.top = (relativeY * 100) + '%';
        
        console.log('📍 HEART button positioned at', relativeX * 100 + '%', relativeY * 100 + '%');
    }
    
    // Create button immediately
    createRelocatedHeartButton();
    
    // Position after a short delay to ensure map is loaded
    setTimeout(positionHeartButton, 500);
    
    // Reposition on window resize
    window.addEventListener('resize', positionHeartButton);
    
    // Observer for dynamic content changes
    const observer = new MutationObserver(function(mutations) {
        let shouldReposition = false;
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                shouldReposition = true;
            }
        });
        
        if (shouldReposition) {
            setTimeout(function() {
                if (!document.querySelector('.heart-button-relocated')) {
                    createRelocatedHeartButton();
                }
                positionHeartButton();
            }, 100);
        }
    });
    
    // Start observing
    const mapContainer = document.querySelector('.location-map, .map-container');
    if (mapContainer) {
        observer.observe(mapContainer, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });
    }
    
    console.log('👀 Observer set up for HEART button positioning');
});
</script>
"""
    
    # Insert CSS and JavaScript before closing tags
    if '</style>' in html_content and '</body>' in html_content:
        # Insert CSS before closing style tag
        html_content = html_content.replace('</style>', f'\n{move_heart_css_js.split("<script>")[0]}\n</style>')
        
        # Insert JavaScript before closing body tag
        js_part = "<script>" + move_heart_css_js.split("<script>")[1]
        html_content = html_content.replace('</body>', f'{js_part}\n</body>')
        
        # Write updated content
        index_file.write_text(html_content, encoding='utf-8')
        
        print("✅ HEART BUTTON RELOCATION APPLIED!")
        print(f"📁 Backup created: {backup_file}")
        print()
        print("🎯 CHANGES APPLIED:")
        print("• 📍 HEART button moved to Hue Hi Tech Park position")
        print("• 🎨 Blue gradient styling with location icon")
        print("• 📱 Responsive positioning for all screen sizes")
        print("• 🖱️ Click handler for interactivity")
        print("• 👀 Dynamic positioning observer")
        print()
        print("📍 POSITIONING:")
        print("• Desktop: 35% from left, 45% from top")
        print("• Tablet: 40% from left, 50% from top") 
        print("• Mobile: 45% from left, 55% from top")
        print()
        print("🎨 STYLING:")
        print("• Blue gradient background")
        print("• White text with location icon (📍)")
        print("• Rounded corners with shadow")
        print("• Hover effects")
        
        return True
    else:
        print("❌ Could not find </style> or </body> tags")
        return False

if __name__ == "__main__":
    move_heart_button()
