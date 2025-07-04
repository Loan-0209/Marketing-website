function createImmediateBuilding() {
    console.log("=== CREATING IMMEDIATE BUILDING ===");
    
    // Skip all content checks - just create if URL contains 'about'
    const isAboutPage = window.location.href.toLowerCase().includes('about');
    
    if (!isAboutPage) {
        console.log("Not About page, skipping");
        return;
    }
    
    console.log("About page detected, creating building immediately");
    
    // Remove any existing parallax
    document.querySelectorAll('[id*="parallax"], [class*="parallax"], [style*="position: fixed"]').forEach(el => {
        if (el.style.right === '0px' || el.style.right === '0' || el.id.includes('parallax') || el.className.includes('parallax')) {
            el.remove();
            console.log("Removed existing parallax element");
        }
    });
    
    // Create building container - always visible
    const container = document.createElement('div');
    container.id = 'immediate-building-container';
    container.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        right: 0 !important;
        width: 350px !important;
        height: 100vh !important;
        z-index: 999 !important;
        pointer-events: none !important;
        display: block !important;
        background: rgba(255, 0, 0, 0.1) !important;
        border: 3px solid red !important;
    `;
    
    // Create gradient background
    const gradientBg = document.createElement('div');
    gradientBg.style.cssText = `
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        background: white !important;
        z-index: 1 !important;
    `;
    
    // Create main building
    const building = document.createElement('div');
    building.style.cssText = `
        position: absolute !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
        width: 180px !important;
        height: 140px !important;
        background: #2E3A8C !important;
        border-radius: 10px !important;
        z-index: 10 !important;
        border: 3px solid yellow !important;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important;
    `;
    
    // Add building details
    building.innerHTML = `
        <!-- Header bar -->
        <div style="
            position: absolute;
            top: 15px;
            left: 15px;
            right: 15px;
            height: 18px;
            background: #FFD700;
            border-radius: 6px;
            border: 1px solid orange;
        "></div>
        
        <!-- HEART TECHNOLOGY label -->
        <div style="
            position: absolute;
            top: 40px;
            left: 15px;
            right: 15px;
            height: 16px;
            background: white;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: Arial, sans-serif;
            font-size: 8px;
            font-weight: bold;
            color: #2E3A8C;
            border: 1px solid #ccc;
        ">HEART TECHNOLOGY</div>
        
        <!-- Windows grid -->
        <div style="
            position: absolute;
            top: 65px;
            left: 20px;
            right: 20px;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
        ">
            ${Array(12).fill().map((_, i) => `
                <div style="
                    height: 14px;
                    background: white;
                    border-radius: 2px;
                    border: 1px solid #ddd;
                    opacity: 0.9;
                "></div>
            `).join('')}
        </div>
        
        <!-- Bottom accent -->
        <div style="
            position: absolute;
            bottom: 12px;
            left: 50%;
            transform: translateX(-50%);
            width: 20px;
            height: 10px;
            background: #FFD700;
            border-radius: 4px;
            border: 1px solid orange;
        "></div>
    `;
    
    // Add background buildings
    const leftBuilding = document.createElement('div');
    leftBuilding.style.cssText = `
        position: absolute;
        left: 50px;
        top: 40%;
        width: 50px;
        height: 80px;
        background: rgba(59, 130, 246, 0.7);
        border-radius: 6px;
        z-index: 5;
        border: 2px solid blue;
    `;
    
    const rightBuilding = document.createElement('div');
    rightBuilding.style.cssText = `
        position: absolute;
        right: 50px;
        top: 40%;
        width: 50px;
        height: 80px;
        background: rgba(156, 163, 175, 0.7);
        border-radius: 6px;
        z-index: 5;
        border: 2px solid gray;
    `;
    
    // Add side decorative elements
    const sideElements = `
        <div style="position: absolute; left: 20px; top: 30%; width: 6px; height: 40px; background: #FFD700; border-radius: 3px; border: 1px solid orange;"></div>
        <div style="position: absolute; left: 30px; top: 25%; width: 6px; height: 50px; background: #3B82F6; border-radius: 3px; border: 1px solid blue;"></div>
        <div style="position: absolute; right: 20px; top: 30%; width: 6px; height: 40px; background: #FFD700; border-radius: 3px; border: 1px solid orange;"></div>
        <div style="position: absolute; right: 30px; top: 25%; width: 6px; height: 50px; background: #3B82F6; border-radius: 3px; border: 1px solid blue;"></div>
    `;
    
    // Assemble everything
    gradientBg.appendChild(building);
    gradientBg.appendChild(leftBuilding);
    gradientBg.appendChild(rightBuilding);
    gradientBg.innerHTML += sideElements;
    container.appendChild(gradientBg);
    
    // Add to page
    document.body.appendChild(container);
    
    console.log("✅ Building created immediately with visible borders");
    
    // Add simple scroll effect (only for About page)
    const isAboutPage = window.location.href.toLowerCase().includes('about');
    if (isAboutPage) {
        let ticking = false;
        function handleScroll() {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    if (scrolled > 50) {
                        gradientBg.style.transform = `translateY(${scrolled * 0.3}px)`;
                        
                        // Fade effect
                        const opacity = Math.max(0.3, 1 - (scrolled / window.innerHeight) * 0.5);
                        container.style.opacity = opacity;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    return container;
}

// Execute right now (check About page first)
if (window.location.href.toLowerCase().includes('about')) {
    createImmediateBuilding();
    
    // Also execute after short delay
    setTimeout(createImmediateBuilding, 500);
    setTimeout(createImmediateBuilding, 1500);
}

// Execute on any navigation
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.href && link.href.includes('about')) {
        setTimeout(createImmediateBuilding, 200);
    }
});

// Execute on hash change
window.addEventListener('hashchange', () => {
    if (window.location.href.includes('about')) {
        setTimeout(createImmediateBuilding, 200);
    }
});

// Manual functions for testing
window.createBuildingNow = function() {
    console.log("Manual building creation triggered");
    createImmediateBuilding();
};

window.removeBuildingBorders = function() {
    const container = document.getElementById('immediate-building-container');
    if (container) {
        // Remove container border
        container.style.border = 'none';
        container.style.background = 'transparent';
        
        // Remove all children borders
        container.querySelectorAll('*').forEach(el => {
            if (el.style.border) {
                el.style.border = 'none';
            }
        });
        
        console.log("✅ All borders removed");
    }
};

window.showBuilding = function() {
    const container = document.getElementById('immediate-building-container');
    if (container) {
        container.style.display = 'block';
        console.log("Building shown");
    } else {
        createImmediateBuilding();
    }
};

// REMOVE BUILDING COMPLETELY
function removeBuilding() {
    // Remove by ID
    const building1 = document.getElementById('clean-building-parallax');
    const building2 = document.getElementById('immediate-building-container');
    
    if (building1) {
        building1.remove();
        console.log("✅ Removed clean-building-parallax");
    }
    
    if (building2) {
        building2.remove();
        console.log("✅ Removed immediate-building-container");
    }
    
    // Remove any fixed positioned elements on the right
    document.querySelectorAll('[style*="position: fixed"][style*="right: 0"]').forEach(el => {
        if (el.style.width && parseInt(el.style.width) > 300) {
            el.remove();
            console.log("✅ Removed fixed element");
        }
    });
    
    // Remove any parallax containers
    document.querySelectorAll('[id*="building"], [id*="parallax"]').forEach(el => {
        el.remove();
    });
    
    console.log("🧹 All buildings removed!");
}

// Execute immediately
removeBuilding();

// Also create shortcut
window.removeAllBuildings = removeBuilding;

// HIDE BORDER WITH CSS TRICKS
const container = document.getElementById('immediate-building-container');
if (container) {
    // Multiple approaches to remove border
    container.style.border = '0px solid transparent !important';
    container.style.borderWidth = '0px !important';
    container.style.borderColor = 'transparent !important';
    container.style.borderStyle = 'none !important';
    container.style.outline = 'none !important';
    
    console.log("🎯 Border should be gone now!");
}

// Quick border removal
document.querySelectorAll('[style*="border"]').forEach(el => el.style.border = 'none');
console.log("Borders removed!");

console.log("=== MANUAL FUNCTIONS AVAILABLE ===");
console.log("window.createBuildingNow() - Force create building");
console.log("window.removeBuildingBorders() - Remove test borders");
console.log("window.showBuilding() - Show/create building");

// Building fix functions
window.debugBuildingState = function() {
    console.log("=== BUILDING STATE DEBUG ===");
    console.log("Building element:", document.querySelector('[style*="HEART TECHNOLOGY"]'));
    console.log("Parallax container:", document.querySelector('.parallax-container'));
    console.log("About section:", document.getElementById('about'));
    console.log("Current URL:", window.location.href);
    console.log("Hash includes 'about':", window.location.hash.includes('about'));
    
    // Check all potential building elements
    const buildingElements = document.querySelectorAll('.building-image, [style*="HEART TECHNOLOGY"], .parallax-container img');
    console.log("Found building elements:", buildingElements.length);
    buildingElements.forEach((el, i) => {
        console.log(`Building element ${i+1}:`, el);
    });
    
    return buildingElements.length > 0;
};

window.forceCreateBuilding = function() {
    console.log("Forcing building creation in existing container");
    
    // Find or create container
    let container = document.querySelector('.parallax-container');
    if (!container) {
        console.log("No parallax container found, creating one");
        container = document.createElement('div');
        container.className = 'parallax-container';
        container.style.cssText = `
            position: fixed;
            top: 0;
            right: 0;
            width: 100%;
            height: 100vh;
            z-index: -1;
            pointer-events: none;
        `;
        document.body.appendChild(container);
    }
    
    // Create building image
    const building = document.createElement('img');
    building.className = 'building-image';
    building.alt = 'HEART TECHNOLOGY PARK';
    building.src = 'assets/heart-building.png';
    building.style.cssText = `
        position: absolute;
        bottom: 0;
        right: 10%;
        height: 80vh;
        opacity: 0.9;
        transform: translateY(0);
        transition: transform 0.5s ease;
    `;
    
    // Add to container
    container.appendChild(building);
    
    console.log("Building created:", building);
    return building;
};

window.createCompleteAboutParallax = function() {
    console.log("Creating complete about parallax structure");
    
    // Remove existing parallax elements first
    document.querySelectorAll('[id*="parallax"], [class*="parallax"]').forEach(el => {
        el.remove();
    });
    
    // Create main container
    const container = document.createElement('div');
    container.id = 'about-parallax-forced';
    container.className = 'forced-about-parallax';
    container.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        right: 0 !important;
        width: 300px !important;
        height: 100vh !important;
        z-index: 998 !important;
        pointer-events: none !important;
        display: block !important;
    `;
    
    // Create gradient background
    const gradientBg = document.createElement('div');
    gradientBg.className = 'parallax-gradient';
    gradientBg.style.cssText = `
        position: absolute !important;
        top: 0 !important;
        right: 0 !important;
        width: 100% !important;
        height: 200% !important;
        background: white !important;
        transform: translateY(0) !important;
        transition: transform 0.5s ease !important;
    `;
    
    // Create building
    const building = document.createElement('div');
    building.className = 'building-image';
    building.style.cssText = `
        position: absolute !important;
        bottom: 0 !important;
        right: 10% !important;
        width: 200px !important;
        height: 80vh !important;
        background-image: url('assets/heart-building.png') !important;
        background-size: contain !important;
        background-position: bottom !important;
        background-repeat: no-repeat !important;
        opacity: 0.9 !important;
    `;
    
    // Add indicator
    building.innerHTML = `
        <div style="
            position: absolute !important;
            bottom: 20px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            width: 20px !important;
            height: 8px !important;
            background: #FFD700 !important;
            border-radius: 3px !important;
        "></div>
    `;
    
    // Assemble structure
    gradientBg.appendChild(building);
    container.appendChild(gradientBg);
    document.body.appendChild(container);
    
    // Add scroll effect (only for About page)
    const isAboutPage = window.location.href.toLowerCase().includes('about');
    if (isAboutPage) {
        let ticking = false;
        function handleScroll() {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    if (scrolled > 100) {
                        gradientBg.style.transform = `translateY(${scrolled * 0.3}px)`;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    return container;
};

// Test functions
window.testBuilding1 = function() {
    console.log("Testing method 1: Force create in existing container");
    window.forceCreateBuilding();
};

window.testBuilding2 = function() {
    console.log("Testing method 2: Create complete structure");
    window.createCompleteAboutParallax();
};

window.removeAllParallax = function() {
    console.log("Removing all parallax elements");
    document.querySelectorAll('[id*="parallax"], [class*="parallax"], [style*="position: fixed"]').forEach(el => {
        if (el.style.right === '0px' || el.style.right === '0' || 
            el.id.includes('parallax') || el.className.includes('parallax')) {
            el.remove();
        }
    });
    console.log("All parallax removed");
};

window.restoreAboutBuilding = function() {
    if (window.location.href.includes('about') || window.location.hash.includes('about')) {
        console.log("About page detected - restoring building");
        window.forceCreateBuilding();
    }
};

// Multiple execution strategies
document.addEventListener('DOMContentLoaded', createImmediateBuilding);
window.addEventListener('load', createImmediateBuilding);

// Immediate execution if DOM already ready
if (document.readyState !== 'loading') {
    createImmediateBuilding();
}

// Backup execution every 2 seconds for 10 seconds
let attempts = 0;
const interval = setInterval(() => {
    if (window.location.href.includes('about')) {
        const existing = document.getElementById('immediate-building-container');
        if (!existing) {
            createImmediateBuilding();
        }
    }
    
    attempts++;
    if (attempts >= 5) {
        clearInterval(interval);
    }
}, 2000);

// Log available functions
console.log("🏢 BUILDING CREATION FUNCTIONS AVAILABLE:");
console.log("- window.debugBuildingState() - Check current state");
console.log("- window.testBuilding1() - Force create in existing container");
console.log("- window.testBuilding2() - Create complete new structure");
console.log("- window.removeAllParallax() - Remove all parallax");
console.log("- window.restoreAboutBuilding() - Main restore function");
