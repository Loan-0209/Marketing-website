// Force Building Element Visibility
console.log("🔥 Force Visibility Script Loading");

function forceElementVisibility() {
    console.log("=== FORCING ELEMENT VISIBILITY ===");
    
    // Find the element
    const element = document.querySelector('#simple-about-parallax');
    
    if (element) {
        console.log("✅ Element found, forcing visibility");
        
        // Force all visibility styles
        element.style.cssText = `
            position: relative !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            height: 400px !important;
            min-height: 400px !important;
            width: 100% !important;
            background-color: lime !important;
            border: 5px solid red !important;
            margin: 20px 0 !important;
            padding: 20px !important;
            z-index: 9999 !important;
            overflow: visible !important;
            box-sizing: border-box !important;
        `;
        
        // Force image visibility
        const img = element.querySelector('.building-image');
        if (img) {
            console.log("✅ Image found, forcing visibility");
            img.style.cssText = `
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                width: 100% !important;
                height: 300px !important;
                object-fit: contain !important;
                border: 3px solid blue !important;
                background: white !important;
                margin: 0 !important;
                padding: 0 !important;
                z-index: 10000 !important;
            `;
            
            // Check image source
            console.log("Image src:", img.src);
            console.log("Image complete:", img.complete);
            console.log("Image natural size:", img.naturalWidth + "x" + img.naturalHeight);
            
            // Force reload if needed
            if (!img.complete) {
                console.log("🔄 Forcing image reload");
                img.src = img.src + "?v=" + Date.now();
            }
        } else {
            console.error("❌ Image not found in container");
        }
        
        // Add backup content if image fails
        element.innerHTML += `
            <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: black;
                color: white;
                padding: 20px;
                font-size: 16px;
                font-weight: bold;
                border: 2px solid yellow;
                z-index: 20000;
            ">
                🏢 BUILDING ELEMENT IS HERE!<br>
                Element ID: ${element.id}<br>
                Position: ${element.getBoundingClientRect().top}px from top
            </div>
        `;
        
        // Scroll to element
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        console.log("🎯 Element forced to be visible and scrolled into view");
        return true;
    } else {
        console.error("❌ Element #simple-about-parallax not found!");
        
        // Look for similar elements
        const allElements = document.querySelectorAll('[id*="parallax"], [class*="building"], [class*="parallax"]');
        console.log("Found similar elements:", allElements.length);
        allElements.forEach((el, i) => {
            console.log(`${i + 1}. ID: ${el.id}, Class: ${el.className}`);
        });
        
        return false;
    }
}

// Auto-force visibility when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        console.log("🔥 Auto-forcing visibility after DOM load");
        forceElementVisibility();
    }, 1000);
});

// Force visibility when About section becomes active
const observer = new MutationObserver(() => {
    const aboutSection = document.querySelector('#about');
    if (aboutSection && aboutSection.classList.contains('active')) {
        setTimeout(() => {
            console.log("🔥 About section active - forcing visibility");
            forceElementVisibility();
        }, 500);
    }
});

// Observe About section for changes
const aboutSection = document.querySelector('#about');
if (aboutSection) {
    observer.observe(aboutSection, {
        attributes: true,
        attributeFilter: ['class']
    });
}

// Manual function
window.forceVisibility = function() {
    console.log("🔥 Manual force visibility triggered");
    return forceElementVisibility();
};

// Force visibility every 2 seconds for first 10 seconds
let forceCount = 0;
const forceInterval = setInterval(() => {
    forceCount++;
    console.log(`🔥 Auto-force attempt ${forceCount}`);
    
    if (forceElementVisibility() || forceCount >= 5) {
        clearInterval(forceInterval);
        console.log("🔥 Force visibility completed");
    }
}, 2000);

console.log("✅ Force Visibility script ready - use window.forceVisibility()");