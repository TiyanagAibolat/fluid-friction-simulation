// ============================================
// ADIM 6: ANIMASYON DÖNGÜSÜ VE ETKİLEŞİM
// ============================================

let lastTime = Date.now();
const targetFPS = 60;
const dt = 1 / targetFPS; // Sabit zaman adımı

// Animasyon döngüsü başlat
function animate() {
    requestAnimationFrame(animate);

    // Fizik güncelle
    updatePhysics(dt);

    // 3D render et
    render3D();

    // 2D grafik çiz
    drawGraph();

    // UI bilgileri güncelle
    updateUI();
}

// UI göstergelerini güncelle
function updateUI() {
    // Hız gösterimi
    const velocityDisplay = document.getElementById('velocity-display');
    velocityDisplay.textContent = physicsState.velocity.toFixed(2) + ' m/s';

    // Kuvvet gösterimi
    const forceDisplay = document.getElementById('force-display');
    forceDisplay.textContent = physicsState.frictionForce.toFixed(2) + ' N';

    // Konum gösterimi
    const positionDisplay = document.getElementById('position-display');
    positionDisplay.textContent = physicsState.position.toFixed(2) + ' m';

    // Yay durumu
    const springDisplay = document.getElementById('spring-display');
    springDisplay.textContent = physicsState.isSpringActive ? 'AÇIK ✓' : 'KAPALI ✗';
    springDisplay.style.color = physicsState.isSpringActive ? '#facc15' : '#94a3b8';
}

// BUTON ETKİLEŞİMLERİ
document.addEventListener('DOMContentLoaded', function() {
    // Sola İt butonu
    document.getElementById('btn-left').addEventListener('click', function() {
        physicsState.velocity = -15;
        this.style.transform = 'scale(0.95)';
        setTimeout(() => { this.style.transform = 'scale(1)'; }, 100);
    });

    // Sağa İt butonu
    document.getElementById('btn-right').addEventListener('click', function() {
        physicsState.velocity = 15;
        this.style.transform = 'scale(0.95)';
        setTimeout(() => { this.style.transform = 'scale(1)'; }, 100);
    });

    // Yayı Aç/Kapat butonu
    document.getElementById('btn-spring').addEventListener('click', function() {
        physicsState.isSpringActive = !physicsState.isSpringActive;
        
        // Buton rengini değiştir
        if (physicsState.isSpringActive) {
            this.classList.add('ring-2', 'ring-yellow-300');
        } else {
            this.classList.remove('ring-2', 'ring-yellow-300');
        }

        this.style.transform = 'scale(0.95)';
        setTimeout(() => { this.style.transform = 'scale(1)'; }, 100);
    });

    // Sıfırla butonu
    document.getElementById('btn-reset').addEventListener('click', function() {
        resetPhysics();
        velocityHistory = [];
        forceHistory = [];
        updateUI();
        
        this.style.transform = 'scale(0.95)';
        setTimeout(() => { this.style.transform = 'scale(1)'; }, 100);
    });

    // 3D ve grafik başlat
    init3D();
    initGraph();

    // Animasyon döngüsünü başlat
    animate();
});

// Klavye kontrolleri (opsiyonel)
document.addEventListener('keydown', function(event) {
    switch(event.key) {
        case 'ArrowLeft':
            physicsState.velocity = -15;
            break;
        case 'ArrowRight':
            physicsState.velocity = 15;
            break;
        case ' ':
            event.preventDefault();
            physicsState.isSpringActive = !physicsState.isSpringActive;
            break;
        case 'r':
        case 'R':
            resetPhysics();
            velocityHistory = [];
            forceHistory = [];
            break;
    }
});

// Pencere yeniden boyutlandırıldığında grafik yeniden hesapla
window.addEventListener('resize', () => {
    const canvas = document.getElementById('graph-canvas');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
});
