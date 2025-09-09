// Debug script để verify data center position
// Paste this vào console của browser

console.log("🔍 DEBUGGING DATA CENTER POSITIONS...");

function debugDataCenters() {
    if (typeof scene === 'undefined') {
        console.log("❌ Scene not found! Make sure page is fully loaded.");
        return;
    }
    
    let dataCenterCount = 0;
    let foundPositions = [];
    
    console.log("📊 Scanning scene for data centers...");
    console.log(`Total scene children: ${scene.children.length}`);
    
    scene.traverse((child) => {
        if (child.userData) {
            // Kiểm tra các loại data center khác nhau
            if (child.userData.type === 'data_center' || 
                child.userData.type === 'data_center_complex' ||
                child.userData.type === 'tech_park_base' ||
                child.userData.name === 'Data Center' ||
                (child.userData.name && child.userData.name.includes('DC-'))) {
                
                dataCenterCount++;
                const pos = child.position;
                foundPositions.push({
                    name: child.userData.name || child.userData.type,
                    position: `(${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}, ${pos.z.toFixed(1)})`,
                    visible: child.visible,
                    object: child
                });
                
                console.log(`🏢 Found: ${child.userData.name || child.userData.type} at ${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}, ${pos.z.toFixed(1)}`);
            }
        }
    });
    
    console.log(`\n📈 SUMMARY:`);
    console.log(`Total data centers found: ${dataCenterCount}`);
    
    if (dataCenterCount === 0) {
        console.log("❌ NO DATA CENTERS FOUND!");
        console.log("Possible issues:");
        console.log("1. Functions not called yet");
        console.log("2. Objects created but with different userData");
        console.log("3. Scene not properly initialized");
        
        // Try to find any objects with 'data' or 'center' in name
        console.log("\n🔍 Searching for any objects with 'data' or 'center'...");
        scene.traverse((child) => {
            if (child.userData && child.userData.name) {
                const name = child.userData.name.toLowerCase();
                if (name.includes('data') || name.includes('center')) {
                    console.log(`📍 Found related object: ${child.userData.name} at ${child.position.x}, ${child.position.y}, ${child.position.z}`);
                }
            }
        });
    } else {
        console.log("✅ Data centers found!");
        
        // Check if any are at expected EAST positions (x > 100)
        const eastDataCenters = foundPositions.filter(dc => {
            const x = parseFloat(dc.position.split('(')[1].split(',')[0]);
            return x > 100;
        });
        
        if (eastDataCenters.length > 0) {
            console.log(`🎯 ${eastDataCenters.length} data centers found at EAST positions (x > 100):`);
            eastDataCenters.forEach(dc => {
                console.log(`   ✅ ${dc.name}: ${dc.position}`);
            });
        } else {
            console.log("⚠️ No data centers found at EAST positions (x > 100)");
            console.log("Expected positions: DC-01 (150,0), DC-02 (170,15), DC-03 (160,-20)");
        }
    }
    
    return foundPositions;
}

// Auto-run debug after 3 seconds
setTimeout(() => {
    console.log("🚀 Auto-running data center debug...");
    debugDataCenters();
}, 3000);

// Also make it available to run manually
window.debugDataCenters = debugDataCenters;

console.log("💡 Debug script loaded! Function available as: debugDataCenters()");
