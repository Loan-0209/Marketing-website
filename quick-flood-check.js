// Quick Flood Safety Check - Copy and paste this into browser console

// Find datacenter positions from the buildingPositions array
const datacenterPositions = [
    { name: "DC01-P1", x: -200, z: -200, phase: "phase1" },
    { name: "DC02-P1", x: -200, z: -140, phase: "phase1" },
    { name: "DC03-P1", x: -200, z: -80, phase: "phase1" },
    { name: "Substation", x: -160, z: -170, phase: "phase1" },
    { name: "DC02-P2", x: -200, z: -20, phase: "phase2" },
    { name: "DC01-P2", x: -260, z: -140, phase: "phase2" },
    { name: "DC03-P3", x: -260, z: -80, phase: "phase3" }
];

// River main points (from the code)
const riverPoints = [
    { x: 420, z: -220 },
    { x: 400, z: -200 },
    { x: 390, z: -180 },
    { x: 385, z: -160 },
    { x: 390, z: -140 },
    { x: 400, z: -120 },
    { x: 395, z: -100 },
    { x: 385, z: -80 },
    { x: 370, z: -60 },
    { x: 365, z: -40 },
    { x: 360, z: -20 },
    { x: 355, z: 0 },
    { x: 350, z: 20 },
    { x: 355, z: 40 },
    { x: 350, z: 60 },
    { x: 345, z: 80 }
];

console.log("🔍 FLOOD SAFETY ANALYSIS - 3D Smart City");
console.log("=====================================\n");

// Calculate distances
datacenterPositions.forEach(dc => {
    let minDistance = Infinity;
    let closestPoint = null;
    
    riverPoints.forEach(river => {
        const distance = Math.sqrt(
            Math.pow(dc.x - river.x, 2) + 
            Math.pow(dc.z - river.z, 2)
        );
        if (distance < minDistance) {
            minDistance = distance;
            closestPoint = river;
        }
    });
    
    const isSafe = minDistance > 100;
    console.log(`🏢 ${dc.name} (${dc.phase})`);
    console.log(`   Position: (${dc.x}, ${dc.z})`);
    console.log(`   Closest river point: (${closestPoint.x}, ${closestPoint.z})`);
    console.log(`   Distance to river: ${Math.round(minDistance)}m`);
    console.log(`   Flood safety: ${isSafe ? '✅ SAFE' : '⚠️ AT RISK'}`);
    console.log(`   Safety margin: ${Math.round(minDistance - 100)}m\n`);
});

// Summary
const safeCount = datacenterPositions.filter(dc => {
    const minDist = Math.min(...riverPoints.map(r => 
        Math.sqrt(Math.pow(dc.x - r.x, 2) + Math.pow(dc.z - r.z, 2))
    ));
    return minDist > 100;
}).length;

console.log("📊 SUMMARY:");
console.log(`Total datacenters: ${datacenterPositions.length}`);
console.log(`Safe from flooding: ${safeCount}`);
console.log(`At risk: ${datacenterPositions.length - safeCount}`);
console.log(`Safety rate: ${(safeCount/datacenterPositions.length*100).toFixed(1)}%`);

// Export JSON
const report = {
    timestamp: new Date().toISOString(),
    datacenters: datacenterPositions.map(dc => {
        const minDist = Math.min(...riverPoints.map(r => 
            Math.sqrt(Math.pow(dc.x - r.x, 2) + Math.pow(dc.z - r.z, 2))
        ));
        return {
            ...dc,
            distanceToRiver: Math.round(minDist),
            floodSafe: minDist > 100
        };
    })
};

console.log("\n📄 JSON Report:");
console.log(JSON.stringify(report, null, 2));