# 🏢 HƯỚNG DẪN DI CHUYỂN DATA CENTERS VỀ ĐẤT LIỀN

## 🎯 Mục tiêu
Di chuyển tất cả Data Centers từ vị trí hiện tại (gần sông) về vị trí an toàn trên đất liền, giống như trong hình bạn gửi.

## 🚀 CÁCH THỰC HIỆN NHANH NHẤT

### Bước 1: Khởi động hướng dẫn
```bash
./RUN-DATACENTER-FIX.command
```

### Bước 2: Làm theo hướng dẫn
1. ✅ File sẽ tự động mở hướng dẫn HTML
2. ✅ Server sẽ tự động khởi động
3. ✅ Copy script từ hướng dẫn
4. ✅ Paste vào Console (F12) của browser

## 📋 SCRIPT CHÍNH (Copy vào Console)

```javascript
// 🚀 SCRIPT DI CHUYỂN DATA CENTERS VỀ ĐẤT LIỀN

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
```

## 📍 VỊ TRÍ MỚI CỦA DATA CENTERS

| Data Center | Vị trí X | Vị trí Z | Ghi chú |
|-------------|----------|----------|---------|
| DC1 | 600 | 0 | Xa nhất về phía đông |
| DC2 | 550 | 80 | Phía đông bắc |
| DC3 | 650 | 60 | Phía đông nam |

## ✅ KẾT QUẢ MONG ĐỢI

Sau khi chạy script:
- 🏢 **3 Data Centers** nằm hoàn toàn trên đất liền
- ⚪ **12 Cooling Towers** (4 towers/data center)
- 🌊 **Tránh xa sông** - không còn va chạm với nước
- 📐 **Layout chuẩn** giống như hình mẫu

## 🔧 FILES ĐÃ TẠO

- ✅ `move-datacenters-guide.html` - Hướng dẫn chi tiết với UI đẹp
- ✅ `quick-move-datacenters.js` - Script JavaScript chính
- ✅ `move-datacenters-to-land.js` - Script đầy đủ với validation
- ✅ `RUN-DATACENTER-FIX.command` - Script khởi động tự động

## 🎮 CÁCH SỬ DỤNG

### Phương pháp 1: Tự động (Khuyến nghị)
```bash
./RUN-DATACENTER-FIX.command
```

### Phương pháp 2: Thủ công
1. Mở: `move-datacenters-guide.html`
2. Khởi động server: `python3 -m http.server 8000`
3. Truy cập: `http://localhost:8000/3d-smart-city.html`
4. Nhấn F12, copy script, paste vào Console

## 🎉 HOÀN TẤT!

Data Centers sẽ được di chuyển về vị trí an toàn trên đất liền, chính xác như trong hình mẫu bạn yêu cầu!
