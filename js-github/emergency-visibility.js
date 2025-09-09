// EMERGENCY VISIBILITY SCRIPT - FORCE ELEMENT TO SHOW
console.log("🚨 EMERGENCY VISIBILITY SCRIPT LOADING");

function emergencyVisibilityFix() {
    console.log("🚨 RUNNING EMERGENCY VISIBILITY FIX");
    
    // Method 1: Find existing element and force visibility
    let element = document.querySelector('#simple-about-parallax');
    
    if (element) {
        console.log("✅ Found existing element, forcing visibility");
        
        // Nuclear option - force all styles
        element.style.cssText = `
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            position: relative !important;
            width: 100% !important;
            height: 300px !important;
            background: red !important;
            border: 10px solid blue !important;
            margin: 50px auto !important;
            z-index: 99999 !important;
            box-sizing: border-box !important;
            overflow: visible !important;
            clear: both !important;
            float: none !important;
            top: auto !important;
            left: auto !important;
            right: auto !important;
            bottom: auto !important;
            transform: none !important;
        `;
        
        // Force content
        element.innerHTML = `
            <h1 style="color: white; font-size: 50px; text-align: center; padding: 100px; margin: 0; font-weight: bold; text-shadow: 2px 2px 4px black; position: relative; z-index: 100000;">
                🏢 BUILDING PARALLAX HERE! 🏢
            </h1>
        `;
        
        console.log("🎯 Element forced to be visible with content");
        
    } else {
        console.log("❌ Element not found, creating new one");
        
        // Method 2: Create new element if not found
        const aboutSection = document.querySelector('#about');
        const aboutText = document.querySelector('.about-text');
        
        if (aboutText) {
            // Find Vision section
            const visionH3 = Array.from(aboutText.querySelectorAll('h3')).find(h3 => h3.textContent.includes('Vision'));
            
            if (visionH3) {
                console.log("✅ Found Vision section, inserting element after it");
                
                // Create element
                element = document.createElement('div');
                element.id = 'simple-about-parallax';
                element.className = 'parallax-building';
                
                // Force styles
                element.style.cssText = `
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    position: relative !important;
                    width: 100% !important;
                    height: 300px !important;
                    background: red !important;
                    border: 10px solid blue !important;
                    margin: 50px auto !important;
                    z-index: 99999 !important;
                    box-sizing: border-box !important;
                `;
                
                // Add content
                element.innerHTML = `
                    <h1 style="color: white; font-size: 50px; text-align: center; padding: 100px; margin: 0; font-weight: bold; text-shadow: 2px 2px 4px black;">
                        🏢 EMERGENCY BUILDING! 🏢
                    </h1>
                `;
                
                // Insert after Vision paragraph
                const visionP = visionH3.nextElementSibling;
                if (visionP) {
                    visionP.insertAdjacentElement('afterend', element);
                    console.log("✅ Element inserted after Vision paragraph");
                } else {
                    visionH3.insertAdjacentElement('afterend', element);
                    console.log("✅ Element inserted after Vision heading");
                }
            } else {
                // Last resort - insert at beginning of about-text
                element = document.createElement('div');
                element.id = 'simple-about-parallax-emergency';
                element.style.cssText = `
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    position: relative !important;
                    width: 100% !important;
                    height: 300px !important;
                    background: red !important;
                    border: 10px solid blue !important;
                    margin: 50px auto !important;
                    z-index: 99999 !important;
                `;
                element.innerHTML = `
                    <h1 style="color: white; font-size: 50px; text-align: center; padding: 100px; margin: 0; font-weight: bold;">
                        🚨 LAST RESORT ELEMENT! 🚨
                    </h1>
                `;
                
                aboutText.insertBefore(element, aboutText.firstChild);
                console.log("🚨 Emergency element inserted at top of about-text");
            }
        } else {
            console.error("❌ Cannot find about-text container");
        }
    }
    
    // Force scroll to element
    if (element) {
        setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            console.log("📍 Scrolled to element");
        }, 500);
    }
    
    return element;
}

// Run immediately
emergencyVisibilityFix();

// Run after DOM loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(emergencyVisibilityFix, 500);
});

// Run when About section becomes active
const observer = new MutationObserver(() => {
    const aboutSection = document.querySelector('#about');
    if (aboutSection && aboutSection.classList.contains('active')) {
        setTimeout(emergencyVisibilityFix, 200);
    }
});

const aboutSection = document.querySelector('#about');
if (aboutSection) {
    observer.observe(aboutSection, {
        attributes: true,
        attributeFilter: ['class']
    });
}

// Manual function
window.emergencyFix = function() {
    console.log("🚨 Manual emergency fix triggered");
    return emergencyVisibilityFix();
};

// Keep trying every 3 seconds for 15 seconds
let attempts = 0;
const emergencyInterval = setInterval(() => {
    attempts++;
    console.log(`🚨 Emergency attempt ${attempts}`);
    
    const element = document.querySelector('#simple-about-parallax, #simple-about-parallax-emergency');
    if (!element || element.style.display === 'none') {
        emergencyVisibilityFix();
    }
    
    if (attempts >= 5) {
        clearInterval(emergencyInterval);
        console.log("🚨 Emergency attempts completed");
    }
}, 3000);

console.log("🚨 Emergency Visibility Script Ready - use window.emergencyFix()");