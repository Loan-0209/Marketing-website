// Force About Parallax - Simple and Direct
console.log("🚀 Loading Force About Parallax");

function createSimpleAboutParallax() {
    console.log("=== SETTING UP PARALLAX FOR EXISTING ELEMENT ===");
    console.log("🔍 DOM ready state:", document.readyState);
    console.log("🔍 Body exists:", !!document.body);
    
    // Check if HTML element already exists
    const existing = document.querySelector('#simple-about-parallax');
    if (existing) {
        console.log("✅ Found existing HTML element:", existing);
        setupParallaxForElement(existing);
        return existing;
    } else {
        console.log("❌ HTML element #simple-about-parallax not found");
        return null;
    }
}

function setupParallaxForElement(element) {
    console.log("🎯 Setting up parallax for element:", element);
    
    const imageElement = element.querySelector('.building-image');
    if (!imageElement) {
        console.error("❌ Building image not found in element");
        return;
    }
    
    console.log("✅ Found image element:", imageElement);
    
    // Add scroll effect for this specific element
    let ticking = false;
    let scrollCount = 0;
    
    function handleScroll() {
        scrollCount++;
        if (scrollCount <= 5) {
            console.log(`📜 Scroll event ${scrollCount}: pageYOffset=${window.pageYOffset}`);
        }
        
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                
                if (scrollCount <= 3) {
                    console.log(`🎯 RAF Update: scroll=${scrolled}`);
                }
                
                // Check if element is in viewport
                const rect = element.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                
                if (isVisible) {
                    // Calculate parallax offset based on element position
                    const elementTop = rect.top + scrolled;
                    const viewportMiddle = scrolled + window.innerHeight / 2;
                    const offset = (viewportMiddle - elementTop) * 0.2;
                    
                    imageElement.style.transform = `translateY(${offset}px)`;
                    
                    if (scrollCount <= 3) {
                        console.log(`✨ Applied parallax: offset=${offset}px`);
                    }
                }
                
                ticking = false;
            });
            ticking = true;
        }
    }
    
    console.log("🎪 Adding scroll event listener for element");
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Test scroll immediately
    console.log("🔧 Testing initial scroll");
    handleScroll();
}

// Execute immediately
console.log("⚡ Executing parallax creation NOW");
createSimpleAboutParallax();

// Also execute after delay to ensure DOM is ready
setTimeout(() => {
    console.log("⚡ Delayed parallax creation");
    const existing = document.querySelector('#simple-about-parallax');
    if (!existing) {
        createSimpleAboutParallax();
    }
}, 1000);

// Execute when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log("⚡ DOM ready parallax creation");
    const existing = document.querySelector('#simple-about-parallax');
    if (!existing) {
        createSimpleAboutParallax();
    }
});

// Execute on About section show
const observer = new MutationObserver(() => {
    const aboutSection = document.querySelector('#about');
    if (aboutSection && aboutSection.classList.contains('active')) {
        const existing = document.querySelector('#simple-about-parallax');
        if (!existing) {
            createSimpleAboutParallax();
        }
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
window.forceAboutParallax = function() {
    console.log("🔧 Manual About parallax creation");
    createSimpleAboutParallax();
};

// Debug functions
window.checkParallax = function() {
    const element = document.querySelector('#simple-about-parallax');
    console.log("=== PARALLAX DEBUG ===");
    console.log("Element exists:", !!element);
    if (element) {
        const rect = element.getBoundingClientRect();
        const computed = getComputedStyle(element);
        console.log("Element position:", rect);
        console.log("Element visible:", rect.width > 0 && rect.height > 0);
        console.log("Element in viewport:", rect.top < window.innerHeight && rect.bottom > 0);
        console.log("Element style:", element.style.cssText);
        console.log("Computed display:", computed.display);
        console.log("Computed visibility:", computed.visibility);
        console.log("Computed position:", computed.position);
        console.log("Computed height:", computed.height);
        console.log("Children:", element.children.length);
        
        // Check image
        const img = element.querySelector('.building-image');
        if (img) {
            console.log("Image exists:", !!img);
            console.log("Image src:", img.src);
            console.log("Image complete:", img.complete);
            console.log("Image natural size:", img.naturalWidth + "x" + img.naturalHeight);
        }
    }
    console.log("Scroll position:", window.pageYOffset);
    console.log("Window height:", window.innerHeight);
    
    // Also check About section
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
        const aboutComputed = getComputedStyle(aboutSection);
        console.log("About section display:", aboutComputed.display);
        console.log("About section active:", aboutSection.classList.contains('active'));
    }
};

window.testScroll = function() {
    console.log("🧪 Testing scroll manually");
    window.scrollTo(0, 100);
    setTimeout(() => {
        console.log("Current scroll:", window.pageYOffset);
        window.checkParallax();
    }, 100);
};

console.log("✅ Force About Parallax loaded");
console.log("🔧 Available functions:");
console.log("  - window.forceAboutParallax()");
console.log("  - window.checkParallax()");
console.log("  - window.testScroll()");