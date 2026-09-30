// ============================================
// ADIM 3: FİZİK MOTORU - Kışkan Sürtünmesi
// ============================================

// Simülasyonun fizik durumunu tutacak obje
const physicsState = {
    position: 0,           // Cismin konumu (metre)
    velocity: 0,           // Cismin hızı (m/s)
    acceleration: 0,       // İvme (m/s²)
    mass: 1,               // Kütle (kg)
    linearDrag: 1.5,       // Lineer sürtünme katsayısı (k₁)
    quadraticDrag: 0.5,    // Karesel sürtünme katsayısı (k₂)
    isSpringActive: false, // Yay aktif mi?
    springConstant: 15,    // Yay sabiti (N/m)
    frictionForce: 0,      // Anlık sürtünme kuvveti
    springForce: 0,        // Anlık yay kuvveti
    totalForce: 0          // Toplam kuvvet
};

// Fizik güncelleme fonksiyonu
// dt: Zaman adımı (saniye)
function updatePhysics(dt) {
    // Sınır kontrolü - çok büyük hızları sınırla
    if (physicsState.velocity > 50) physicsState.velocity = 50;
    if (physicsState.velocity < -50) physicsState.velocity = -50;

    // 1. Hızın yönünü belirle (-1, 0 veya +1)
    const velocityDirection = physicsState.velocity > 0 ? 1 : 
                             physicsState.velocity < 0 ? -1 : 0;

    // 2. Lineer ve karesel sürtünme kuvvetlerini hesapla
    // Formül: F_friction = -(k₁ * v + k₂ * v²)
    const linearFriction = physicsState.linearDrag * Math.abs(physicsState.velocity);
    const quadraticFriction = physicsState.quadraticDrag * 
                             (physicsState.velocity * physicsState.velocity);
    
    // Toplam sürtünme kuvveti (her zaman harekete karşı yönde)
    const frictionMagnitude = linearFriction + quadraticFriction;
    physicsState.frictionForce = -frictionMagnitude * velocityDirection;

    // 3. Yay kuvvetini hesapla (eğer aktifse)
    // Formül: F_spring = -k * x (Hooke'un Yasası)
    physicsState.springForce = 0;
    if (physicsState.isSpringActive) {
        physicsState.springForce = -physicsState.springConstant * physicsState.position;
    }

    // 4. Toplam kuvveti hesapla
    physicsState.totalForce = physicsState.frictionForce + physicsState.springForce;

    // 5. Newton'un 2. Yasasından ivmeyi hesapla: F = m * a → a = F / m
    physicsState.acceleration = physicsState.totalForce / physicsState.mass;

    // 6. Hızı güncelle (v = v₀ + a*t)
    physicsState.velocity += physicsState.acceleration * dt;

    // 7. Konumu güncelle (x = x₀ + v*t)
    physicsState.position += physicsState.velocity * dt;

    // 8. Konumun limitlendirme (simülasyon sınırları)
    const boundaryLimit = 20;
    if (physicsState.position > boundaryLimit) {
        physicsState.position = boundaryLimit;
        physicsState.velocity = 0;
    }
    if (physicsState.position < -boundaryLimit) {
        physicsState.position = -boundaryLimit;
        physicsState.velocity = 0;
    }

    // Yay aktifse konumun sıfırında durma etkisi
    if (physicsState.isSpringActive && Math.abs(physicsState.position) < 0.1 && 
        Math.abs(physicsState.velocity) < 0.5) {
        physicsState.position = 0;
        physicsState.velocity = 0;
    }
}

// Fizik motorunu sıfırla
function resetPhysics() {
    physicsState.position = 0;
    physicsState.velocity = 0;
    physicsState.acceleration = 0;
    physicsState.frictionForce = 0;
    physicsState.springForce = 0;
    physicsState.totalForce = 0;
    physicsState.isSpringActive = false;
}

// Hız ve kuvveti grafik için çıkar
function getGraphData() {
    return {
        velocity: physicsState.velocity,
        force: physicsState.frictionForce,
        position: physicsState.position,
        springActive: physicsState.isSpringActive
    };
}
