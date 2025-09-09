// Script để kiểm tra vị trí data center hiện tại
// Paste vào console để xem vị trí

function checkCurrentDataCenterPositions() {
    console.log("🔍 Checking current data center positions...");
    
    let foundDataCenters = [];
    
    scene.traverse((child) => {
        if (child.userData && (
            child.userData.type === 'data_center_complex' ||
            child.userData.type === 'data_center' ||
            (child.userData.name && child.userData.name.includes('DC-'))
        )) {
            const pos = child.position;
            foundDataCenters.push({
                name: child.userData.name || 'Unknown',
                position: `(${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}, ${pos.z.toFixed(1)})`,
                expected: getExpectedPosition(child.userData.name)
            });
            
            console.log(`📍 Found: ${child.userData.name} at (${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}, ${pos.z.toFixed(1)})`);
        }
    });
    
    console.log("\n🎯 Expected positions:");
    console.log("DC-01: (150, 11, 0)");
    console.log("DC-02: (170, 14, 15)"); 
    console.log("DC-03: (160, 12.5, -20)");
    
    if (foundDataCenters.length === 0) {
        console.log("❌ No data centers found!");
    }
    
    return foundDataCenters;
}

function getExpectedPosition(name) {
    const expected = {
        'DC-01': '(150, 11, 0)',
        'DC-02': '(170, 14, 15)',
        'DC-03': '(160, 12.5, -20)'
    };
    return expected[name] || 'Unknown';
}

checkCurrentDataCenterPositions();
