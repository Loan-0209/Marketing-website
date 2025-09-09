// 🚀 SCRIPT NHANH - DI CHUYỂN DATA CENTERS VỀ ĐẤT LIỀN

// Chạy script này trong Console của browser (F12)
// Copy và paste toàn bộ code này

console.log("🏢 BẮTĐẦU DI CHUYỂN DATA CENTERS VỀ ĐẤT LIỀN");

// Xóa data centers hiện tại
function removeCurrentDataCenters() {
    const datacenters = scene.children.filter(child => 
        child.userData && (
            child.userData.type === 'datacenter' ||
            child.userData.type === 'cooling-tower' ||
            child.userData.type === 'water-system'
        )
    );
    
    datacenters.forEach(dc => scene.remove(dc));
    console.log(`🗑️ Đã xóa ${datacenters.length} data center objects`);
}

// Tạo data centers mới ở vị trí an toàn
function createSafeDataCenters() {
    const positions = [
        { x: 600, z: 0, name: "DC1" },    // Xa về phía đông
        { x: 550, z: 80, name: "DC2" },   // Đông bắc
        { x: 650, z: 60, name: "DC3" }    // Đông nam
    ];
    
    positions.forEach((pos, i) => {
        // Tòa nhà chính
        const geometry = new THREE.BoxGeometry(60, 45, 40);
        const material = new THREE.MeshLambertMaterial({ color: 0xf0f0f0 });
        const building = new THREE.Mesh(geometry, material);
        building.position.set(pos.x, 22.5, pos.z);
        building.userData = { type: 'datacenter', name: pos.name };
        scene.add(building);
        
        // Cooling towers
        for (let j = 0; j < 4; j++) {
            const angle = (j * Math.PI) / 2;
            const radius = 80;
            const towerX = pos.x + Math.cos(angle) * radius;
            const towerZ = pos.z + Math.sin(angle) * radius;
            
            const towerGeo = new THREE.CylinderGeometry(8, 12, 25);
            const towerMat = new THREE.MeshLambertMaterial({ color: 0xe0e0e0 });
            const tower = new THREE.Mesh(towerGeo, towerMat);
            tower.position.set(towerX, 12.5, towerZ);
            tower.userData = { type: 'cooling-tower' };
            scene.add(tower);
        }
        
        console.log(`✅ Tạo ${pos.name} tại x:${pos.x}, z:${pos.z}`);
    });
}

// Thực thi
removeCurrentDataCenters();
createSafeDataCenters();

// Render lại
renderer.render(scene, camera);

console.log("🎉 HOÀN THÀNH! Data Centers đã nằm an toàn trên đất liền");
console.log("📍 Vị trí mới: DC1(600,0), DC2(550,80), DC3(650,60)");
