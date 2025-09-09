// 🔍 VALIDATION SCRIPT - KIỂM TRA VỊ TRÍ DATA CENTERS
// Script này sẽ được Claude Code tạo ra để kiểm tra kết quả

console.log("🔍 BẮT ĐẦU KIỂM TRA VỊ TRÍ DATA CENTERS");

// Định nghĩa vùng an toàn và vùng nguy hiểm
const SAFE_ZONE = {
    description: "Vùng đất liền an toàn",
    minX: 500,
    maxX: 700,
    minZ: -50,
    maxZ: 150
};

const RIVER_ZONE = {
    description: "Vùng sông (cần tránh)",
    minX: 200,
    maxX: 400,
    minZ: -100,
    maxZ: 300
};

const EXPECTED_POSITIONS = [
    { name: "DC1", x: 600, z: 0 },
    { name: "DC2", x: 550, z: 80 },
    { name: "DC3", x: 650, z: 60 }
];

// Hàm kiểm tra vị trí có an toàn không
function isPositionSafe(x, z) {
    // Kiểm tra có nằm trong vùng sông không
    const inRiver = (x >= RIVER_ZONE.minX && x <= RIVER_ZONE.maxX && 
                     z >= RIVER_ZONE.minZ && z <= RIVER_ZONE.maxZ);
    
    // Kiểm tra có nằm trong vùng an toàn không
    const inSafeZone = (x >= SAFE_ZONE.minX && x <= SAFE_ZONE.maxX && 
                        z >= SAFE_ZONE.minZ && z <= SAFE_ZONE.maxZ);
    
    return !inRiver && inSafeZone;
}

// Hàm tính khoảng cách đến sông
function distanceToRiver(x, z) {
    const riverCenterX = (RIVER_ZONE.minX + RIVER_ZONE.maxX) / 2;
    const riverCenterZ = (RIVER_ZONE.minZ + RIVER_ZONE.maxZ) / 2;
    
    return Math.sqrt(Math.pow(x - riverCenterX, 2) + Math.pow(z - riverCenterZ, 2));
}

// Hàm kiểm tra Data Centers trong scene
function validateDataCenters() {
    const results = {
        datacenters: [],
        coolingTowers: [],
        summary: {
            totalDataCenters: 0,
            safeCenters: 0,
            totalCoolingTowers: 0,
            allSafe: true,
            issues: []
        }
    };
    
    try {
        // Tìm tất cả Data Centers
        const datacenters = scene.children.filter(child => 
            child.userData && child.userData.type === 'datacenter'
        );
        
        console.log(`📊 Tìm thấy ${datacenters.length} Data Centers`);
        
        datacenters.forEach((dc, index) => {
            const pos = dc.position;
            const isSafe = isPositionSafe(pos.x, pos.z);
            const distance = distanceToRiver(pos.x, pos.z);
            const expectedPos = EXPECTED_POSITIONS[index];
            
            const dcResult = {
                name: dc.userData.name || `DC${index + 1}`,
                position: { x: pos.x, y: pos.y, z: pos.z },
                expectedPosition: expectedPos,
                isSafe: isSafe,
                distanceToRiver: Math.round(distance),
                positionCorrect: expectedPos ? 
                    (Math.abs(pos.x - expectedPos.x) < 10 && Math.abs(pos.z - expectedPos.z) < 10) : false
            };
            
            results.datacenters.push(dcResult);
            
            if (isSafe) {
                results.summary.safeCenters++;
                console.log(`✅ ${dcResult.name} AN TOÀN tại (${pos.x}, ${pos.z})`);
            } else {
                results.summary.allSafe = false;
                results.summary.issues.push(`${dcResult.name} không an toàn tại (${pos.x}, ${pos.z})`);
                console.warn(`⚠️ ${dcResult.name} KHÔNG AN TOÀN tại (${pos.x}, ${pos.z})`);
            }
        });
        
        // Kiểm tra Cooling Towers
        const coolingTowers = scene.children.filter(child => 
            child.userData && child.userData.type === 'cooling-tower'
        );
        
        console.log(`❄️ Tìm thấy ${coolingTowers.length} Cooling Towers`);
        
        coolingTowers.forEach((tower, index) => {
            const pos = tower.position;
            const isSafe = isPositionSafe(pos.x, pos.z);
            
            const towerResult = {
                name: `Tower ${index + 1}`,
                position: { x: pos.x, y: pos.y, z: pos.z },
                isSafe: isSafe
            };
            
            results.coolingTowers.push(towerResult);
            
            if (!isSafe) {
                results.summary.allSafe = false;
                results.summary.issues.push(`Cooling Tower ${index + 1} không an toàn`);
            }
        });
        
        results.summary.totalDataCenters = datacenters.length;
        results.summary.totalCoolingTowers = coolingTowers.length;
        
    } catch (error) {
        console.error("❌ Lỗi khi kiểm tra:", error);
        results.summary.issues.push(`Lỗi kiểm tra: ${error.message}`);
    }
    
    return results;
}

// Hàm tạo báo cáo
function generateReport(results) {
    console.log("\n📋 BÁO CÁO KIỂM TRA DATA CENTERS");
    console.log("=====================================");
    
    console.log(`📊 Tổng quan:`);
    console.log(`   - Data Centers: ${results.summary.totalDataCenters}`);
    console.log(`   - Data Centers an toàn: ${results.summary.safeCenters}`);
    console.log(`   - Cooling Towers: ${results.summary.totalCoolingTowers}`);
    console.log(`   - Trạng thái tổng: ${results.summary.allSafe ? '✅ AN TOÀN' : '⚠️ CÓ VẤN ĐỀ'}`);
    
    console.log(`\n🏢 Chi tiết Data Centers:`);
    results.datacenters.forEach(dc => {
        console.log(`   ${dc.name}:`);
        console.log(`     - Vị trí: (${dc.position.x}, ${dc.position.z})`);
        console.log(`     - Mong muốn: (${dc.expectedPosition?.x || 'N/A'}, ${dc.expectedPosition?.z || 'N/A'})`);
        console.log(`     - An toàn: ${dc.isSafe ? '✅' : '❌'}`);
        console.log(`     - Khoảng cách đến sông: ${dc.distanceToRiver}m`);
        console.log(`     - Vị trí đúng: ${dc.positionCorrect ? '✅' : '❌'}`);
    });
    
    if (results.summary.issues.length > 0) {
        console.log(`\n⚠️ Các vấn đề:`);
        results.summary.issues.forEach(issue => {
            console.log(`   - ${issue}`);
        });
    }
    
    console.log(`\n📍 Khuyến nghị:`);
    if (results.summary.allSafe) {
        console.log(`   ✅ Tất cả Data Centers đã ở vị trí an toàn!`);
        console.log(`   ✅ Việc di chuyển đã thành công!`);
    } else {
        console.log(`   🔧 Cần di chuyển các Data Centers có vấn đề`);
        console.log(`   🎯 Sử dụng script di chuyển để fix`);
    }
}

// Hàm chính
function runValidation() {
    console.log("🚀 Khởi động validation...");
    
    // Kiểm tra scene có tồn tại không
    if (typeof scene === 'undefined') {
        console.error("❌ Scene không tồn tại! Hãy chắc chắn 3D Smart City đã load.");
        return;
    }
    
    console.log("✅ Scene đã sẵn sàng");
    
    // Chạy validation
    const results = validateDataCenters();
    
    // Tạo báo cáo
    generateReport(results);
    
    // Return kết quả để có thể sử dụng
    return results;
}

// Thực thi validation
const validationResults = runValidation();

// Export cho sử dụng sau
window.validationResults = validationResults;

console.log("\n🎉 HOÀN THÀNH KIỂM TRA!");
console.log("💡 Kết quả đã được lưu trong window.validationResults");
