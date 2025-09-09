// QUICK COOLING SYSTEM INJECTION - Copy & paste into console

// Move river closer to datacenters
scene.traverse(c => {
    if(c.name?.includes('river-segment')) c.position.x -= 470;
});

// Move datacenters next to river
let dcPos = [[-100,-150],[-100,-80],[-100,-10]];
let i = 0;
scene.traverse(c => {
    if(c.userData?.buildingType?.includes('datacenter_') && c.userData.phase === 'phase1') {
        c.position.set(dcPos[i][0], c.position.y, dcPos[i][1]);
        i++;
    }
});

// Add cooling lake
const lake = new THREE.Group();
const water = new THREE.Mesh(
    new THREE.CylinderGeometry(40,45,1.5,32),
    new THREE.MeshPhongMaterial({color:0x006994,transparent:true,opacity:0.85})
);
water.position.y = 0.5;
lake.add(water);
lake.position.set(-50,0,-80);
scene.add(lake);

// Add pipes
const pipes = new THREE.Group();
const pipeMat = new THREE.MeshPhongMaterial({color:0x4a4a4a});

// River to lake pipes
[[-20,-80,-50,-80],[-20,-100,-50,-100]].forEach(p => {
    const pipe = new THREE.Mesh(
        new THREE.CylinderGeometry(1.5,1.5,30,16),
        pipeMat
    );
    pipe.position.set((p[0]+p[2])/2,2,(p[1]+p[3])/2);
    pipe.rotation.z = Math.PI/2;
    pipes.add(pipe);
});

// Lake to datacenter pipes
[[-50,-80,-100,-150],[-50,-80,-100,-80],[-50,-80,-100,-10]].forEach(p => {
    // Horizontal segment
    const h = new THREE.Mesh(
        new THREE.CylinderGeometry(1.2,1.2,50,16),
        pipeMat
    );
    h.position.set(-75,1.5,p[1]);
    h.rotation.z = Math.PI/2;
    pipes.add(h);
    
    // Vertical segment
    const vLen = Math.abs(p[3]-p[1]);
    if(vLen > 0) {
        const v = new THREE.Mesh(
            new THREE.CylinderGeometry(1.2,1.2,vLen,16),
            pipeMat
        );
        v.position.set(-100,1.5,(p[1]+p[3])/2);
        pipes.add(v);
    }
});

scene.add(pipes);

// Add pump stations
[[-25,-80],[-50,-60],[-50,-100]].forEach(pos => {
    const pump = new THREE.Mesh(
        new THREE.BoxGeometry(8,6,8),
        new THREE.MeshPhongMaterial({color:0x606060})
    );
    pump.position.set(pos[0],3,pos[1]);
    scene.add(pump);
});

// Add heat exchangers
[[-85,-150],[-85,-80],[-85,-10]].forEach(pos => {
    const hx = new THREE.Mesh(
        new THREE.BoxGeometry(6,8,10),
        new THREE.MeshPhongMaterial({color:0x4169e1})
    );
    hx.position.set(pos[0],4,pos[1]);
    scene.add(hx);
});

console.log('✅ Cooling system injected! River moved, datacenters repositioned, cooling infrastructure added.');