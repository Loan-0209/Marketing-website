// Script kiểm tra kết quả fix Data Centers
// Sử dụng: Copy paste vào browser console

(function checkDataCenterFix() {
    console.log('🔍 KIỂM TRA KẾT QUẢ FIX DATA CENTERS\n');
    console.log('=====================================\n');
    
    if (typeof scene === 'undefined') {
        console.error('❌ Không tìm thấy scene. Đảm bảo bạn đang ở trang 3D Smart City');
        return;
    }
    
    // Tìm tất cả objects trong scene
    let dataCenterBuildings = [];
    let coolingTowers = [];
    let foundations = [];
    
    scene.traverse((object) => {
        if (object.name) {
            if (object.name.includes('DATA CENTER')) {
                dataCenterBuildings.push({
                    name: object.name,
                    position: object.position.clone(),
                    size: object.geometry ? {
                        width: object.geometry.parameters.width,
                        height: object.geometry.parameters.height,
                        depth: object.geometry.parameters.depth
                    } : 'N/A'
                });
            }
            if (object.name.toLowerCase().includes('cooling')) {
                coolingTowers.push({
                    position: object.position.clone()
                });
            }
        }
    });
    
    console.log('📊 KẾT QUẢ TÌM KIẾM:\n');
    console.log(`✅ Data Centers tìm thấy: ${dataCenterBuildings.length}`);
    console.log(`💨 Cooling Towers: ${coolingTowers.length}\n`);
    
    if (dataCenterBuildings.length > 0) {
        console.log('🏢 CHI TIẾT DATA CENTERS:');
        dataCenterBuildings.forEach(dc => {
            console.log(`\n${dc.name}:`);
            console.log(`  Vị trí: x=${dc.position.x}, z=${dc.position.z}`);
            if (dc.size !== 'N/A') {
                console.log(`  Kích thước: ${dc.size.width}x${dc.size.height}x${dc.size.depth}`);
            }
        });
        
        // Kiểm tra vị trí mong muốn
        const expectedPositions = [
            { name: 'DATA CENTER 01', x: 350, z: -120 },
            { name: 'DATA CENTER 02', x: 350, z: 0 },
            { name: 'DATA CENTER 03', x: 350, z: 120 }
        ];
        
        console.log('\n\n🎯 SO SÁNH VỚI VỊ TRÍ MONG MUỐN:');
        let allCorrect = true;
        
        expectedPositions.forEach(expected => {
            const found = dataCenterBuildings.find(dc => dc.name === expected.name);
            if (found) {
                const correct = (Math.abs(found.position.x - expected.x) < 1 && 
                               Math.abs(found.position.z - expected.z) < 1);
                console.log(`${expected.name}: ${correct ? '✅ ĐÚNG' : '❌ SAI'} vị trí`);
                if (!correct) {
                    console.log(`  Hiện tại: x=${found.position.x}, z=${found.position.z}`);
                    console.log(`  Mong muốn: x=${expected.x}, z=${expected.z}`);
                    allCorrect = false;
                }
            } else {
                console.log(`${expected.name}: ❌ KHÔNG TÌM THẤY`);
                allCorrect = false;
            }
        });
        
        if (allCorrect) {
            console.log('\n✅ TẤT CẢ DATA CENTERS Ở ĐÚNG VỊ TRÍ!');
        } else {
            console.log('\n⚠️ CÓ DATA CENTERS KHÔNG ĐÚNG VỊ TRÍ!');
        }
    } else {
        console.log('❌ KHÔNG TÌM THẤY DATA CENTERS TRONG SCENE!');
        console.log('Có thể do:');
        console.log('1. Scene chưa load xong');
        console.log('2. Data Centers bị ẩn');
        console.log('3. Vẫn còn code override chưa được disable');
    }
    
    console.log('\n=====================================');
    console.log('🏁 HOÀN THÀNH KIỂM TRA');
})();