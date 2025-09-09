// Debug Element Visibility
console.log("🔍 Debug Element Script Loaded");

window.debugElement = function() {
    console.log("=== DEBUG ELEMENT VISIBILITY ===");
    
    const element = document.querySelector('#simple-about-parallax');
    console.log("1. Element found:", !!element);
    
    if (element) {
        // Basic properties
        console.log("2. Element HTML:", element.outerHTML.substring(0, 200) + "...");
        
        // Position and size
        const rect = element.getBoundingClientRect();
        console.log("3. Bounding rect:", rect);
        console.log("4. Has dimensions:", rect.width > 0 && rect.height > 0);
        
        // Computed styles
        const computed = getComputedStyle(element);
        console.log("5. Display:", computed.display);
        console.log("6. Visibility:", computed.visibility);
        console.log("7. Opacity:", computed.opacity);
        console.log("8. Position:", computed.position);
        console.log("9. Z-index:", computed.zIndex);
        console.log("10. Height:", computed.height);
        console.log("11. Background:", computed.backgroundColor);
        console.log("12. Border:", computed.border);
        
        // Parent visibility
        let parent = element.parentElement;
        let level = 0;
        while (parent && level < 3) {
            const parentComputed = getComputedStyle(parent);
            console.log(`13.${level} Parent ${parent.tagName} display:`, parentComputed.display);
            parent = parent.parentElement;
            level++;
        }
        
        // Image check
        const img = element.querySelector('.building-image');
        if (img) {
            console.log("14. Image found:", !!img);
            console.log("15. Image src:", img.src);
            console.log("16. Image complete:", img.complete);
            console.log("17. Image error:", img.onerror ? "Has error handler" : "No error handler");
            
            // Force reload image
            img.src = img.src + "?t=" + Date.now();
        }
        
        // Try to force visibility
        element.style.display = 'block';
        element.style.visibility = 'visible';
        element.style.opacity = '1';
        element.style.height = '400px';
        element.style.backgroundColor = 'lime';
        element.style.border = '5px solid purple';
        
        console.log("18. Forced styles applied");
        
        // Check again after force
        setTimeout(() => {
            const newRect = element.getBoundingClientRect();
            console.log("19. After force - new rect:", newRect);
            console.log("20. Now visible:", newRect.width > 0 && newRect.height > 0);
        }, 100);
    } else {
        console.error("❌ Element #simple-about-parallax not found!");
        
        // Check what elements do exist
        const aboutSection = document.querySelector('#about');
        console.log("About section exists:", !!aboutSection);
        
        if (aboutSection) {
            const children = aboutSection.querySelectorAll('*');
            console.log("About section children count:", children.length);
            
            // Look for similar IDs
            const allIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
            console.log("All IDs in document:", allIds.filter(id => id.includes('parallax') || id.includes('building')));
        }
    }
};

// Auto debug when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        console.log("🔍 Auto-debugging element visibility");
        window.debugElement();
    }, 1000);
});

// Also debug when About section becomes active
const observer = new MutationObserver(() => {
    const aboutSection = document.querySelector('#about');
    if (aboutSection && aboutSection.classList.contains('active')) {
        setTimeout(() => {
            console.log("🔍 About section activated - debugging");
            window.debugElement();
        }, 500);
    }
});

const aboutSection = document.querySelector('#about');
if (aboutSection) {
    observer.observe(aboutSection, {
        attributes: true,
        attributeFilter: ['class']
    });
}

console.log("✅ Debug Element script ready - use window.debugElement()");