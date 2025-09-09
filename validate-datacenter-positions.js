// Script Validation cho Data Centers Position
// Sử dụng: Copy và paste vào browser console khi đang xem 3D Smart City

(function validateDataCenters() {
    console.log('🔍 BẮT ĐẦU VALIDATION DATA CENTERS...\n');
    
    // Vị trí mục tiêu an toàn - FULLY WITHIN MAIN PLATFORM (Aligned at x=350)
    const targetPositions = {
        'DATA CENTER 01': { x: 350, z: -120 },
        'DATA CENTER 02': { x: 350, z: 0 },
        'DATA CENTER 03': { x: 350, z: 120 }
    };
    
    // Vùng sông nguy hiểm
    const riverZone = {
        xMin: 160,
        xMax: 240,
        zMin: -250,
        zMax: 280
    };
    
    // Tìm tất cả Data Centers trong scene
    let dataCenters = [];
    let issues = [];
    let warnings = [];
    
    if (typeof scene !== 'undefined') {
        scene.traverse((object) => {
            // Tìm Data Center buildings
            if (object.name && object.name.includes('DATA CENTER')) {
                dataCenters.push({
                    name: object.name,
                    position: object.position.clone(),
                    object: object
                });
            }
        });
    } else {
        console.error('❌ Không tìm thấy scene object. Đảm bảo bạn đang ở trang 3D Smart City.');
        return;
    }
    
    console.log(`📊 Tìm thấy ${dataCenters.length} Data Centers\n`);
    
    // Kiểm tra từng Data Center
    dataCenters.forEach(dc => {
        console.log(`\n🏢 ${dc.name}:`);
        console.log(`   Vị trí hiện tại: x=${dc.position.x.toFixed(1)}, z=${dc.position.z.toFixed(1)}`);
        
        // Kiểm tra với vị trí mục tiêu
        const target = targetPositions[dc.name];
        if (target) {
            const deltaX = Math.abs(dc.position.x - target.x);
            const deltaZ = Math.abs(dc.position.z - target.z);
            
            if (deltaX > 5 || deltaZ > 5) {
                issues.push(`${dc.name} KHÔNG ở vị trí mục tiêu! Cần di chuyển đến x=${target.x}, z=${target.z}`);
                console.log(`   ❌ SAI VỊ TRÍ - Cần di chuyển ${deltaX.toFixed(1)} đơn vị theo X, ${deltaZ.toFixed(1)} đơn vị theo Z`);
            } else {
                console.log(`   ✅ Đúng vị trí mục tiêu`);
            }
        }
        
        // Kiểm tra an toàn với sông
        const nearRiver = dc.position.x >= riverZone.xMin && dc.position.x <= riverZone.xMax;
        if (nearRiver) {
            warnings.push(`${dc.name} QUÁ GẦN SÔNG - Có nguy cơ ngập lụt!`);
            console.log(`   ⚠️ CẢNH BÁO: Quá gần vùng sông!`);
        }
        
        // Tính khoảng cách đến sông
        const distanceToRiver = Math.min(
            Math.abs(dc.position.x - riverZone.xMax),
            Math.abs(dc.position.x - riverZone.xMin)
        );
        console.log(`   📏 Khoảng cách đến sông: ${distanceToRiver.toFixed(1)} đơn vị`);
        
        if (distanceToRiver < 100) {
            warnings.push(`${dc.name} chỉ cách sông ${distanceToRiver.toFixed(1)} đơn vị - CẦN DI CHUYỂN XA HƠN!`);
        }
    });
    
    // Kiểm tra Cooling Towers
    console.log('\n\n💨 KIỂM TRA COOLING TOWERS:');
    let coolingTowers = 0;
    scene.traverse((object) => {
        if (object.name && object.name.includes('cooling')) {
            coolingTowers++;
        }
    });
    console.log(`   Tìm thấy ${coolingTowers} cooling towers`);
    
    // Báo cáo tổng hợp
    console.log('\n\n📋 BÁO CÁO TỔNG HỢP:');
    console.log('=====================================');
    
    if (issues.length > 0) {
        console.log('\n❌ VẤN ĐỀ NGHIÊM TRỌNG:');
        issues.forEach(issue => console.log(`   - ${issue}`));
    }
    
    if (warnings.length > 0) {
        console.log('\n⚠️ CẢNH BÁO:');
        warnings.forEach(warning => console.log(`   - ${warning}`));
    }
    
    if (issues.length === 0 && warnings.length === 0) {
        console.log('\n✅ TẤT CẢ DATA CENTERS Ở VỊ TRÍ AN TOÀN!');
    } else {
        console.log('\n🔧 KHUYẾN NGHỊ:');
        console.log('   1. Cập nhật vị trí Data Centers trong code theo tọa độ mục tiêu');
        console.log('   2. Di chuyển xa khỏi vùng sông (x < 350 hoặc x > 500)');
        console.log('   3. Đảm bảo mỗi Data Center có 4 cooling towers');
    }
    
    // Hiển thị vị trí mục tiêu
    console.log('\n📍 VỊ TRÍ MỤC TIÊU - TRÊN NỀN CHÍNH:');
    Object.entries(targetPositions).forEach(([name, pos]) => {
        console.log(`   ${name}: x=${pos.x}, z=${pos.z} (Trên nền chính 800x600)`);
    });
    
    console.log('\n🏗️ THÔNG TIN NỀN CHÍNH:');
    console.log('   Kích thước: 800x600 units');
    console.log('   Trung tâm: (100, 0, 0)');
    console.log('   Phạm vi X: -300 đến 500');
    console.log('   Phạm vi Z: -300 đến 300');
    
    console.log('\n=====================================');
    console.log('🏁 HOÀN THÀNH VALIDATION');
})();