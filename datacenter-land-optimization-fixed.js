// ========================================
// ENHANCED DATA CENTER LAND POSITIONING OPTIMIZATION
// ========================================

/**
 * Enhanced system for precise data center positioning analysis
 * Integrates user-provided bounding box checking with water boundary detection
 */

// Current data center positions
const CURRENT_DATACENTERS = [
    {
        id: 'DC01',
        name: 'DATA CENTER 01',
        position: { x: 450, z: 0 },
        dimensions: { width: 60, height: 25, depth: 40 }
    },
    {
        id: 'DC02', 
        name: 'DATA CENTER 02',
        position: { x: 400, z: 60 },
        dimensions: { width: 55, height: 22, depth: 35 }
    },
    {
        id: 'DC03',
        name: 'DATA CENTER 03', 
        position: { x: 490, z: 70 },
        dimensions: { width: 45, height: 20, depth: 30 }
    }
];

// Terrain and water boundaries
const TERRAIN_CONFIG = {
    groundPlane: {
        position: { x: 100, y: 0, z: 0 },
        dimensions: { width: 800, depth: 600 },
        bounds: { xMin: -300, xMax: 500, zMin: -300, zMax: 300 }
    },
    riverPath: [
        { x: 180, z: -250 }, { x: 160, z: -150 }, { x: 200, z: -80 },
        { x: 170, z: -20 }, { x: 220, z: 40 }, { x: 190, z: 100 },
        { x: 240, z: 160 }, { x: 210, z: 220 }, { x: 200, z: 280 }
    ],
    riverWidth: 15,
    safetyBuffer: 20
};

/**
 * Get precise water boundary coordinates for accurate detection
 * @returns {Object} Water boundary configuration
 */
function getWaterBoundary() {
    return {
        river: {
            path: TERRAIN_CONFIG.riverPath,
            width: TERRAIN_CONFIG.riverWidth,
            curves: generateRiverCurvePoints()
        },
        coolingPonds: getCoolingPondBoundaries(),
        exclusionZones: getWaterExclusionZones()
    };
}

/**
 * Generate detailed river curve points for precise boundary detection
 */
function generateRiverCurvePoints() {
    const points = [];
    
    for (let i = 0; i < TERRAIN_CONFIG.riverPath.length - 1; i++) {
        const start = TERRAIN_CONFIG.riverPath[i];
        const end = TERRAIN_CONFIG.riverPath[i + 1];
        
        // Interpolate 20 points between each river segment
        for (let t = 0; t <= 1; t += 0.05) {
            const x = start.x + (end.x - start.x) * t;
            const z = start.z + (end.z - start.z) * t;
            
            // Calculate width variation along curve
            const width = TERRAIN_CONFIG.riverWidth + Math.sin(i * 0.3 + t * Math.PI) * 3;
            
            points.push({
                center: { x, z },
                width: width,
                leftBank: { x: x - width/2, z },
                rightBank: { x: x + width/2, z }
            });
        }
    }
    
    return points;
}

/**
 * Check if a point is within water boundary
 * @param {THREE.Vector3} point - Point to check
 * @param {Object} waterBoundary - Water boundary configuration
 * @returns {boolean} True if point is in water
 */
function isPointInWater(point, waterBoundary) {
    const x = point.x;
    const z = point.z;
    
    // Check against river curves
    for (const curvePoint of waterBoundary.river.curves) {
        const distanceToCenter = Math.sqrt(
            (x - curvePoint.center.x) ** 2 + 
            (z - curvePoint.center.z) ** 2
        );
        
        if (distanceToCenter < curvePoint.width / 2) {
            return true;
        }
    }
    
    // Check against cooling ponds
    for (const pond of waterBoundary.coolingPonds) {
        const distance = Math.sqrt((x - pond.x) ** 2 + (z - pond.z) ** 2);
        if (distance < pond.radius) {
            return true;
        }
    }
    
    return false;
}

/**
 * Find nearest safe land position for data center relocation
 * @param {THREE.Vector3} currentPosition - Current position
 * @returns {THREE.Vector3} Safe land position
 */
function findNearestLandPosition(currentPosition) {
    const waterBoundary = getWaterBoundary();
    const searchRadius = 50;
    const stepSize = 5;
    
    // Start from current position and spiral outward
    for (let radius = stepSize; radius <= searchRadius; radius += stepSize) {
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
            const testX = currentPosition.x + Math.cos(angle) * radius;
            const testZ = currentPosition.z + Math.sin(angle) * radius;
            const testPoint = new THREE.Vector3(testX, currentPosition.y, testZ);
            
            // Check if position is on land and within ground boundaries
            if (!isPointInWater(testPoint, waterBoundary) && 
                isWithinGroundBoundaries(testX, testZ, 60, 40).covered) {
                return testPoint;
            }
        }
    }
    
    // Fallback: move eastward to safe area
    return new THREE.Vector3(450, currentPosition.y, currentPosition.z);
}

/**
 * Move data center to safe land position with all connected components
 * @param {THREE.Object3D} dataCenter - Data center object to move
 */
function moveDataCenterToSafeLand(dataCenter) {
    console.log(`🏭 Moving ${dataCenter.userData.name || 'Data Center'} to safe land position...`);
    
    const originalPosition = dataCenter.position.clone();
    const landPosition = findNearestLandPosition(dataCenter.position);
    const offset = landPosition.clone().sub(originalPosition);
    
    // Move main data center building
    dataCenter.position.copy(landPosition);
    
    // Update connected components
    updateConnectedComponents(dataCenter, offset);
    
    console.log(`✅ Relocated from (${originalPosition.x.toFixed(1)}, ${originalPosition.z.toFixed(1)}) to (${landPosition.x.toFixed(1)}, ${landPosition.z.toFixed(1)})`);
}

/**
 * Update all components connected to a data center
 * @param {THREE.Object3D} dataCenter - Main data center building
 * @param {THREE.Vector3} offset - Movement offset
 */
function updateConnectedComponents(dataCenter, offset) {
    if (!window.scene) return;
    
    const dcId = dataCenter.userData.id || dataCenter.userData.name;
    
    // Find and move cooling towers
    window.scene.traverse(child => {
        if (child.userData.type === 'cooling_tower' && child.userData.parentDC === dcId) {
            child.position.add(offset);
        }
        
        // Move cooling ponds
        if (child.userData.type === 'cooling_pond' && child.userData.parentDC === dcId) {
            child.position.add(offset);
        }
        
        // Move infrastructure elements
        if (child.userData.type === 'datacenter_infrastructure' && child.userData.parentDC === dcId) {
            child.position.add(offset);
        }
    });
    
    // Update access roads if needed
    updateAccessRoadsForDataCenter(dataCenter);
}

/**
 * MAIN ENHANCED ANALYSIS FUNCTION
 * Enhanced data center positioning analysis with precise boundary checking
 * @returns {Object} Analysis result
 */
function analyzeDataCenterPositioning() {
    console.log('🏭 === ENHANCED DATA CENTER POSITIONING ANALYSIS ===');
    
    if (!window.scene) {
        console.error('Scene not available');
        return { error: 'Scene not available' };
    }
    
    // Get precise water boundaries
    const waterBoundary = getWaterBoundary();
    console.log(`Water boundary detected: ${waterBoundary.river.curves.length} river curve points`);
    
    // Find all data center objects in scene
    const dataCenters = [];
    window.scene.traverse(obj => {
        if (obj.userData && (
            obj.userData.type === 'datacenter' || 
            obj.userData.type === 'data_center' ||
            (obj.userData.type && obj.userData.type.includes('DATA_CENTER')) ||
            (obj.name && obj.name.includes('DATA_CENTER'))
        )) {
            dataCenters.push(obj);
        }
    });
    
    console.log(`Found ${dataCenters.length} data center objects in scene`);
    
    let allOnLand = true;
    const analysis = {
        totalDataCenters: dataCenters.length,
        safeDataCenters: 0,
        relocatedDataCenters: 0,
        details: []
    };
    
    // Analyze each data center with precise boundary checking
    dataCenters.forEach((dc, index) => {
        console.log(`\\nAnalyzing ${dc.userData.name || dc.name || `Data Center ${index + 1}`}:`);
        
        // Get precise bounding box of data center
        const box = new THREE.Box3().setFromObject(dc);
        const corners = [
            new THREE.Vector3(box.min.x, box.min.y, box.min.z),
            new THREE.Vector3(box.max.x, box.min.y, box.min.z),
            new THREE.Vector3(box.min.x, box.min.y, box.max.z),
            new THREE.Vector3(box.max.x, box.min.y, box.max.z)
        ];
        
        console.log(`  Position: (${dc.position.x.toFixed(1)}, ${dc.position.z.toFixed(1)})`);
        console.log(`  Bounding box: x[${box.min.x.toFixed(1)} to ${box.max.x.toFixed(1)}], z[${box.min.z.toFixed(1)} to ${box.max.z.toFixed(1)}]`);
        
        // Check all corners for water overlap
        let hasWaterOverlap = false;
        let waterCorners = [];
        
        corners.forEach((corner, cornerIndex) => {
            if (isPointInWater(corner, waterBoundary)) {
                hasWaterOverlap = true;
                waterCorners.push(cornerIndex);
                console.warn(`  ⚠️ Corner ${cornerIndex} is in water at (${corner.x.toFixed(1)}, ${corner.z.toFixed(1)})`);
            }
        });
        
        if (hasWaterOverlap) {
            allOnLand = false;
            console.log(`  🔄 Relocating data center to safe land position...`);
            
            // Move data center to safe land position
            moveDataCenterToSafeLand(dc);
            analysis.relocatedDataCenters++;
            
            analysis.details.push({
                name: dc.userData.name || dc.name || `DC${index + 1}`,
                status: 'relocated',
                originalPosition: { x: dc.position.x, z: dc.position.z },
                waterCorners: waterCorners.length,
                action: 'Moved to safe land position'
            });
        } else {
            console.log(`  ✅ Fully on land - no relocation needed`);
            analysis.safeDataCenters++;
            
            // Calculate water clearance
            const waterClearance = getMinDistanceFromWater(dc.position.x, dc.position.z);
            
            analysis.details.push({
                name: dc.userData.name || dc.name || `DC${index + 1}`,
                status: 'safe',
                position: { x: dc.position.x, z: dc.position.z },
                waterClearance: waterClearance,
                action: 'No action required'
            });
        }
    });
    
    // Summary
    console.log(`\\n📊 Analysis Complete:`);
    console.log(`  Total data centers: ${analysis.totalDataCenters}`);
    console.log(`  Safe on land: ${analysis.safeDataCenters}`);
    console.log(`  Relocated: ${analysis.relocatedDataCenters}`);
    console.log(`  Overall status: ${allOnLand ? '✅ ALL ON LAND' : '🔄 RELOCATIONS APPLIED'}`);
    
    return {
        allOnLand: analysis.safeDataCenters === analysis.totalDataCenters,
        analysis: analysis,
        waterBoundary: waterBoundary
    };
}

/**
 * Helper functions
 */
function getCoolingPondBoundaries() {
    const ponds = [];
    
    CURRENT_DATACENTERS.forEach(dc => {
        // Add cooling ponds around each data center
        ponds.push(
            { x: dc.position.x + 60, z: dc.position.z, radius: 15 },
            { x: dc.position.x - 60, z: dc.position.z, radius: 15 },
            { x: dc.position.x, z: dc.position.z + 55, radius: 15 },
            { x: dc.position.x, z: dc.position.z - 55, radius: 15 }
        );
    });
    
    return ponds;
}

function getWaterExclusionZones() {
    return [
        { x: 0, z: 50, radius: 15, type: 'fountain' },
        { x: -100, z: -100, radius: 12, type: 'fountain' },
        { x: 100, z: 100, radius: 12, type: 'fountain' }
    ];
}

function updateAccessRoadsForDataCenter(dataCenter) {
    console.log(`🛣️ Updating access roads for ${dataCenter.userData.name || 'Data Center'}`);
}

function isWithinGroundBoundaries(x, z, width, depth) {
    const bounds = TERRAIN_CONFIG.groundPlane.bounds;
    const halfWidth = width / 2;
    const halfDepth = depth / 2;
    
    const coverage = {
        xMin: Math.max(bounds.xMin, x - halfWidth),
        xMax: Math.min(bounds.xMax, x + halfWidth),
        zMin: Math.max(bounds.zMin, z - halfDepth),
        zMax: Math.min(bounds.zMax, z + halfDepth)
    };
    
    const coveredArea = Math.max(0, coverage.xMax - coverage.xMin) * Math.max(0, coverage.zMax - coverage.zMin);
    const totalArea = width * depth;
    const coveragePercent = (coveredArea / totalArea) * 100;
    
    return {
        covered: coveragePercent >= 99,
        coveragePercent: coveragePercent,
        area: { covered: coveredArea, total: totalArea }
    };
}

function getMinDistanceFromWater(x, z) {
    let minDistance = Infinity;
    
    // Check distance from river path
    for (let i = 0; i < TERRAIN_CONFIG.riverPath.length - 1; i++) {
        const start = TERRAIN_CONFIG.riverPath[i];
        const end = TERRAIN_CONFIG.riverPath[i + 1];
        
        // Interpolate points along river segment
        for (let t = 0; t <= 1; t += 0.1) {
            const riverX = start.x + (end.x - start.x) * t;
            const riverZ = start.z + (end.z - start.z) * t;
            
            const distance = Math.sqrt((x - riverX) ** 2 + (z - riverZ) ** 2);
            minDistance = Math.min(minDistance, distance - TERRAIN_CONFIG.riverWidth / 2);
        }
    }
    
    return Math.max(0, minDistance);
}

// Export functions
window.analyzeDataCenterPositioning = analyzeDataCenterPositioning;
window.getWaterBoundary = getWaterBoundary;
window.isPointInWater = isPointInWater;
window.moveDataCenterToSafeLand = moveDataCenterToSafeLand;
window.findNearestLandPosition = findNearestLandPosition;

console.log('🏭 Enhanced Data Center Land Positioning Optimizer loaded');
console.log('Available functions:');
console.log('  - analyzeDataCenterPositioning() - Enhanced analysis with bounding box checking');
console.log('  - getWaterBoundary() - Get precise water boundary coordinates');
console.log('  - isPointInWater(point, boundary) - Check if point is in water');
console.log('  - moveDataCenterToSafeLand(dc) - Move data center to safe position');