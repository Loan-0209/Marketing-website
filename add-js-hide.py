#!/usr/bin/env python3
"""
JavaScript backup solution to hide 300MW Data Center button
"""

from pathlib import Path
import time

def add_js_hide_button():
    """Add JavaScript to hide 300MW Data Center button as backup solution"""
    
    index_file = Path('index.html')
    
    if not index_file.exists():
        print("❌ index.html not found!")
        return False
    
    print("🔧 ADDING JAVASCRIPT BACKUP TO HIDE BUTTON...")
    print("=" * 50)
    
    # Read current content
    html_content = index_file.read_text(encoding='utf-8')
    
    # Create backup
    timestamp = int(time.time())
    backup_file = f'index.html.js-backup-{timestamp}'
    Path(backup_file).write_text(html_content, encoding='utf-8')
    
    # JavaScript to hide the button
    js_hide_script = """
<script>
// 🚫 Hide 300MW Data Center Button - JavaScript Backup Solution
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 Searching for 300MW Data Center button...');
    
    function hide300MWButton() {
        // Method 1: Find by text content
        const allElements = document.querySelectorAll('*');
        let hiddenCount = 0;
        
        allElements.forEach(element => {
            const text = element.textContent || element.innerText || '';
            
            // Hide if contains "300MW Data Center"
            if (text.includes('300MW Data Center') && !text.includes('Vietnam')) {
                // Don't hide if it's part of a larger text block
                if (text.length < 50) {
                    element.style.display = 'none';
                    element.style.visibility = 'hidden';
                    element.style.opacity = '0';
                    console.log('🚫 Hidden element:', element);
                    hiddenCount++;
                }
            }
            
            // Hide if contains just "300MW" and is small element
            if (text.trim() === '300MW Data Center' || 
                (text.includes('300MW') && text.includes('⚡') && text.length < 30)) {
                element.style.display = 'none';
                element.style.visibility = 'hidden';
                element.style.opacity = '0';
                console.log('🚫 Hidden 300MW element:', element);
                hiddenCount++;
            }
        });
        
        // Method 2: Find by common attributes
        const selectors = [
            '[data-label*="300MW"]',
            '[aria-label*="300MW"]', 
            '[title*="300MW"]',
            '.data-center-overlay',
            '.tooltip-300mw',
            '.map-button-300mw'
        ];
        
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.style.display = 'none';
                hiddenCount++;
            });
        });
        
        // Method 3: Find in map overlay specifically
        const mapOverlays = document.querySelectorAll('.map-overlay, .location-map .overlay');
        mapOverlays.forEach(overlay => {
            const children = overlay.children;
            for (let child of children) {
                const text = child.textContent || child.innerText || '';
                if (text.includes('300MW') && text.length < 50) {
                    child.style.display = 'none';
                    console.log('🚫 Hidden overlay element:', child);
                    hiddenCount++;
                }
            }
        });
        
        console.log(`✅ Hidden ${hiddenCount} elements containing 300MW Data Center`);
        return hiddenCount;
    }
    
    // Run immediately
    hide300MWButton();
    
    // Run again after a short delay (in case content loads dynamically)
    setTimeout(hide300MWButton, 500);
    setTimeout(hide300MWButton, 1000);
    
    // Set up observer for dynamic content
    const observer = new MutationObserver(function(mutations) {
        let shouldCheck = false;
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                shouldCheck = true;
            }
        });
        
        if (shouldCheck) {
            setTimeout(hide300MWButton, 100);
        }
    });
    
    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    console.log('👀 Observer set up to hide 300MW button if it appears dynamically');
});
</script>
"""
    
    # Insert JavaScript before closing body tag
    if '</body>' in html_content:
        html_content = html_content.replace('</body>', f'{js_hide_script}\n</body>')
        
        # Write updated content
        index_file.write_text(html_content, encoding='utf-8')
        
        print("✅ JAVASCRIPT BACKUP ADDED!")
        print(f"📁 Backup created: {backup_file}")
        print()
        print("🔧 JAVASCRIPT METHODS:")
        print("• Text content scanning")
        print("• Attribute-based detection")
        print("• Map overlay specific search")
        print("• Dynamic content observer")
        print("• Multiple execution timings")
        print()
        print("🎯 COMPREHENSIVE SOLUTION:")
        print("• CSS hiding (immediate)")
        print("• JavaScript hiding (backup)")
        print("• Observer for dynamic content")
        print("• Console logging for debugging")
        
        return True
    else:
        print("❌ Could not find </body> tag")
        return False

if __name__ == "__main__":
    add_js_hide_button()
