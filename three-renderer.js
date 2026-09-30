// ============================================
// ADIM 4: THREE.JS 3D GÖRSELLEŞTIRME
// ============================================

let scene, camera, renderer, sphere, liquidBox, velocityArrow, forceArrow;

function init3D() {
    const container = document.getElementById('canvas-container');
    
    // Kamera ayarları
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 5, 15);
    camera.lookAt(0, 0, 0);

    // Sahne oluştur
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);

    // Işıklandırma
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // Renderer oluştur
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Sıvı ortamı temsil eden kutu (yarı saydam mavi)
    const liquidGeometry = new THREE.BoxGeometry(40, 15, 15);
    const liquidMaterial = new THREE.MeshStandardMaterial({
        color: 0x0369a1,
        transparent: true,
        opacity: 0.15,
        wireframe: false,
        metalness: 0.3,
        roughness: 0.7
    });
    liquidBox = new THREE.Mesh(liquidGeometry, liquidMaterial);
    scene.add(liquidBox);

    // Sıvı kutusunun çerçevesi (kafes görünümü)
    const edgesGeometry = new THREE.EdgesGeometry(liquidGeometry);
    const wireframe = new THREE.LineSegments(edgesGeometry, 
        new THREE.LineBasicMaterial({ color: 0x0ea5e9, linewidth: 2 }));
    liquidBox.add(wireframe);

    // Cisim: beyaz küre
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.6,
        roughness: 0.3,
        emissive: 0x4f46e5
    });
    sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.castShadow = true;
    scene.add(sphere);

    // Hız vektörünü gösteren yeşil ok
    velocityArrow = new THREE.ArrowHelper(
        new THREE.Vector3(1, 0, 0),  // Başlangıç yönü
        new THREE.Vector3(0, 0, 0),  // Başlangıç noktası
        5,                           // Uzunluk
        0x22c55e,                    // Yeşil renk
        1,                           // Ok başı uzunluğu
        0.8                          // Ok başı genişliği
    );
    scene.add(velocityArrow);

    // Sürtünme kuvvetini gösteren kırmızı ok
    forceArrow = new THREE.ArrowHelper(
        new THREE.Vector3(-1, 0, 0), // Başlangıç yönü
        new THREE.Vector3(0, 0, 0),  // Başlangıç noktası
        2,                           // Uzunluk
        0xef4444,                    // Kırmızı renk
        0.8,
        0.6
    );
    scene.add(forceArrow);

    // Merkez noktası (orijin) işareti
    const originGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const originMaterial = new THREE.MeshStandardMaterial({ color: 0xfbbf24 });
    const origin = new THREE.Mesh(originGeometry, originMaterial);
    scene.add(origin);

    // Pencere yeniden boyutlandırma işleyicisi
    window.addEventListener('resize', () => {
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    });

    // İlk render
    render3D();
}

// 3D sahnesini güncelle ve render et
function render3D() {
    // Kürenin konumunu fizik durumundan güncelle
    sphere.position.x = physicsState.position;

    // Hız vektörü okunu güncelle
    const velocityMagnitude = Math.abs(physicsState.velocity);
    const velocityDirection = physicsState.velocity > 0 ? 1 : -1;
    velocityArrow.setLength(Math.min(velocityMagnitude * 0.3 + 1, 8));
    velocityArrow.setDirection(new THREE.Vector3(velocityDirection, 0, 0));

    // Kuvvet vektörü okunu güncelle
    const forceMagnitude = Math.abs(physicsState.frictionForce);
    const forceDirection = physicsState.frictionForce > 0 ? 1 : -1;
    forceArrow.setLength(Math.min(forceMagnitude * 0.15 + 0.5, 6));
    forceArrow.setDirection(new THREE.Vector3(forceDirection, 0, 0));

    // Yay kuvveti aktifse poz ekle
    if (physicsState.isSpringActive) {
        sphere.rotation.x += 0.05;
        sphere.rotation.y += 0.03;
    }

    // Render et
    renderer.render(scene, camera);
}
