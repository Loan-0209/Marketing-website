// Road Building Collision Check for HEART Technology Park 3D Smart City
// Analysis based on the building positions from 3d-smart-city-debug.html

// Road Network Definition
const roadNetwork = {
    mainNorthSouth: { x: 0, width: 20, minX: -10, maxX: 10, name: "Main North-South road" },
    mainEastWest: { z: 0, width: 20, minZ: -10, maxZ: 10, name: "Main East-West road" },
    eastVertical: { x: 100, width: 15, minX: 92.5, maxX: 107.5, name: "East vertical road" },
    westVertical: { x: -100, width: 15, minX: -107.5, maxX: -92.5, name: "West vertical road" },
    northHorizontal: { z: 100, width: 15, minZ: 92.5, maxZ: 107.5, name: "North horizontal road" },
    southHorizontal: { z: -100, width: 15, minZ: -107.5, maxZ: -92.5, name: "South horizontal road" }
};

// Building positions from the 3D Smart City code (all have 20x20 base)
const buildingPositions = [
    // PHASE 1 - COMPLETED
    { name: "Office Tower 1", x: -150, z: -150, phase: 1, type: "office_tower" },
    { name: "Tech Campus 1", x: -120, z: -150, phase: 1, type: "tech_campus" },
    { name: "Residential Tower 1", x: 150, z: 150, phase: 1, type: "residential_tower" },
    { name: "Residential Tower 2", x: 120, z: 150, phase: 1, type: "residential_tower" },
    { name: "Commercial Center 1", x: -150, z: 150, phase: 1, type: "commercial_center" },
    { name: "Medical Center", x: -180, z: 0, phase: 1, type: "medical_center" },
    
    // PHASE 2 - UNDER CONSTRUCTION
    { name: "Office Tower 2", x: -150, z: -120, phase: 2, type: "office_tower" },
    { name: "Residential Tower 3", x: 150, z: 120, phase: 2, type: "residential_tower" },
    { name: "Education Hub 1", x: -120, z: 120, phase: 2, type: "education_hub" },
    { name: "Tech Campus 2", x: 150, z: -150, phase: 2, type: "tech_campus" },
    { name: "Office Tower 3", x: -50, z: -150, phase: 2, type: "office_tower" },
    { name: "Commercial Center 2", x: 50, z: 150, phase: 2, type: "commercial_center" },
    
    // PHASE 3 - PLANNED
    { name: "Tech Campus 3", x: 120, z: -120, phase: 3, type: "tech_campus" },
    { name: "Office Tower 4", x: 50, z: -150, phase: 3, type: "office_tower" },
    { name: "Commercial Center 3", x: -50, z: 150, phase: 3, type: "commercial_center" },
    { name: "Education Hub 2", x: 180, z: 0, phase: 3, type: "education_hub" }
];

// Building size (20x20 base, so extends ±10 from center)
const buildingSize = { width: 20, depth: 20, halfWidth: 10, halfDepth: 10 };

// Minimum clearance required from road edges (5-10m recommended)
const minClearance = 5;

// Function to check if building overlaps with a road
function checkBuildingRoadOverlap(building, road) {
    const buildingMinX = building.x - buildingSize.halfWidth;
    const buildingMaxX = building.x + buildingSize.halfWidth;
    const buildingMinZ = building.z - buildingSize.halfDepth;
    const buildingMaxZ = building.z + buildingSize.halfDepth;
    
    let conflicts = [];
    
    // Check North-South roads (defined by x coordinate)
    if (road.hasOwnProperty('x') && road.hasOwnProperty('minX') && road.hasOwnProperty('maxX')) {
        // Check if building's X range overlaps with road's X range
        if (!(buildingMaxX < road.minX || buildingMinX > road.maxX)) {
            conflicts.push({
                type: "overlap",
                building: building.name,
                road: road.name,
                message: `Building ${building.name} overlaps with ${road.name}`
            });
        } else {
            // Check clearance
            const distanceToRoad = Math.min(
                Math.abs(buildingMinX - road.maxX),
                Math.abs(buildingMaxX - road.minX)
            );
            if (distanceToRoad < minClearance) {
                conflicts.push({
                    type: "clearance",
                    building: building.name,
                    road: road.name,
                    distance: distanceToRoad.toFixed(1),
                    message: `Building ${building.name} is ${distanceToRoad.toFixed(1)}m from ${road.name} (minimum ${minClearance}m required)`
                });
            }
        }
    }
    
    // Check East-West roads (defined by z coordinate)
    if (road.hasOwnProperty('z') && road.hasOwnProperty('minZ') && road.hasOwnProperty('maxZ')) {
        // Check if building's Z range overlaps with road's Z range
        if (!(buildingMaxZ < road.minZ || buildingMinZ > road.maxZ)) {
            conflicts.push({
                type: "overlap",
                building: building.name,
                road: road.name,
                message: `Building ${building.name} overlaps with ${road.name}`
            });
        } else {
            // Check clearance
            const distanceToRoad = Math.min(
                Math.abs(buildingMinZ - road.maxZ),
                Math.abs(buildingMaxZ - road.minZ)
            );
            if (distanceToRoad < minClearance) {
                conflicts.push({
                    type: "clearance",
                    building: building.name,
                    road: road.name,
                    distance: distanceToRoad.toFixed(1),
                    message: `Building ${building.name} is ${distanceToRoad.toFixed(1)}m from ${road.name} (minimum ${minClearance}m required)`
                });
            }
        }
    }
    
    return conflicts;
}

// Main analysis function
function analyzeRoadBuildingConflicts() {
    console.log("🏗️ HEART Technology Park - Road Building Collision Analysis");
    console.log("=" .repeat(80));
    
    let totalConflicts = 0;
    let overlapConflicts = 0;
    let clearanceViolations = 0;
    
    // Check each building against each road
    buildingPositions.forEach(building => {
        console.log(`\n📍 Analyzing: ${building.name} at (${building.x}, ${building.z}) - Phase ${building.phase}`);
        console.log(`   Building footprint: X(${building.x - 10} to ${building.x + 10}), Z(${building.z - 10} to ${building.z + 10})`);
        
        let buildingConflicts = [];
        
        Object.values(roadNetwork).forEach(road => {
            const conflicts = checkBuildingRoadOverlap(building, road);
            buildingConflicts = buildingConflicts.concat(conflicts);
        });
        
        if (buildingConflicts.length === 0) {
            console.log("   ✅ No conflicts detected");
        } else {
            buildingConflicts.forEach(conflict => {
                if (conflict.type === "overlap") {
                    console.log(`   🚨 CRITICAL: ${conflict.message}`);
                    overlapConflicts++;
                } else if (conflict.type === "clearance") {
                    console.log(`   ⚠️  WARNING: ${conflict.message}`);
                    clearanceViolations++;
                }
                totalConflicts++;
            });
        }
    });
    
    // Summary report
    console.log("\n" + "=" .repeat(80));
    console.log("📊 ANALYSIS SUMMARY");
    console.log("=" .repeat(80));
    console.log(`Total buildings analyzed: ${buildingPositions.length}`);
    console.log(`Total conflicts found: ${totalConflicts}`);
    console.log(`🚨 Critical overlaps: ${overlapConflicts}`);
    console.log(`⚠️  Clearance violations: ${clearanceViolations}`);
    
    if (totalConflicts === 0) {
        console.log("\n🎉 EXCELLENT: All buildings maintain proper clearance from road corridors!");
    } else if (overlapConflicts === 0) {
        console.log("\n✅ GOOD: No direct overlaps found, but some clearance improvements recommended");
    } else {
        console.log("\n🔧 ACTION REQUIRED: Critical overlaps need immediate attention");
    }
    
    // Detailed road corridor analysis
    console.log("\n" + "=" .repeat(80));
    console.log("🛣️  ROAD CORRIDOR DETAILS");
    console.log("=" .repeat(80));
    
    Object.entries(roadNetwork).forEach(([key, road]) => {
        console.log(`${road.name}:`);
        if (road.hasOwnProperty('x')) {
            console.log(`  Runs North-South at X=${road.x}, Width=${road.width}m (X: ${road.minX} to ${road.maxX})`);
        } else {
            console.log(`  Runs East-West at Z=${road.z}, Width=${road.width}m (Z: ${road.minZ} to ${road.maxZ})`);
        }
    });
    
    return {
        totalConflicts,
        overlapConflicts,
        clearanceViolations,
        buildingsAnalyzed: buildingPositions.length
    };
}

// Run the analysis
const results = analyzeRoadBuildingConflicts();

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { analyzeRoadBuildingConflicts, roadNetwork, buildingPositions };
}