// ============================================
// ADIM 5: 2D DINAMIK GRAFİK - Hız vs Kuvvet
// ============================================

let graphCanvas, graphCtx;
let velocityHistory = [];
let forceHistory = [];
const maxHistoryLength = 100;

function initGraph() {
    graphCanvas = document.getElementById('graph-canvas');
    graphCtx = graphCanvas.getContext('2d');
    
    // İlk grafik çizimi
    drawGraph();
}

function drawGraph() {
    const width = graphCanvas.width;
    const height = graphCanvas.height;
    const padding = 50;

    // Arka planı temizle
    graphCtx.fillStyle = '#0f172a';
    graphCtx.fillRect(0, 0, width, height);

    // Grafik alanı arka planı
    graphCtx.fillStyle = '#1e293b';
    graphCtx.fillRect(padding, padding, width - 2*padding, height - 2*padding);

    // Koordinat sistemi çiz
    drawCoordinateSystem(width, height, padding);

    // Teorik eğri çiz (Hız-Kuvvet ilişkisi)
    drawTheoreticalCurve(width, height, padding);

    // Anlık durumu nokta olarak çiz
    drawCurrentPoint(width, height, padding);

    // Geçmiş veriyi çiz (izleme çizgisi)
    drawHistoryTrail(width, height, padding);

    // İstatistikleri yazı olarak ekle
    drawStats(width, height);
}

function drawCoordinateSystem(width, height, padding) {
    // X ve Y eksenleri
    graphCtx.strokeStyle = '#64748b';
    graphCtx.lineWidth = 2;

    // X ekseni (yatay)
    graphCtx.beginPath();
    graphCtx.moveTo(padding, height - padding);
    graphCtx.lineTo(width - padding, height - padding);
    graphCtx.stroke();

    // Y ekseni (dikey)
    graphCtx.beginPath();
    graphCtx.moveTo(padding, padding);
    graphCtx.lineTo(padding, height - padding);
    graphCtx.stroke();

    // Eksenlerin başlıkları
    graphCtx.fillStyle = '#cbd5e1';
    graphCtx.font = 'bold 12px Arial';
    graphCtx.textAlign = 'center';
    graphCtx.fillText('Hız (v) [m/s]', width - 30, height - 10);
    
    graphCtx.save();
    graphCtx.translate(15, height / 2);
    graphCtx.rotate(-Math.PI / 2);
    graphCtx.textAlign = 'center';
    graphCtx.fillText('Kuvvet (F) [N]', 0, 0);
    graphCtx.restore();

    // Ölçek işaretleri ve sayılar
    graphCtx.fillStyle = '#94a3b8';
    graphCtx.font = '10px Arial';
    
    // X ölçek (hız)
    for (let i = -30; i <= 30; i += 10) {
        const x = padding + (i + 30) * (width - 2*padding) / 60;
        graphCtx.beginPath();
        graphCtx.moveTo(x, height - padding);
        graphCtx.lineTo(x, height - padding + 5);
        graphCtx.stroke();
        graphCtx.textAlign = 'center';
        graphCtx.fillText(i.toString(), x, height - padding + 15);
    }

    // Y ölçek (kuvvet)
    for (let i = -30; i <= 30; i += 10) {
        const y = height - padding - (i + 30) * (height - 2*padding) / 60;
        graphCtx.beginPath();
        graphCtx.moveTo(padding - 5, y);
        graphCtx.lineTo(padding, y);
        graphCtx.stroke();
        graphCtx.textAlign = 'right';
        graphCtx.fillText(i.toString(), padding - 10, y + 3);
    }

    // Sıfır noktasını vurgula
    graphCtx.strokeStyle = '#0ea5e9';
    graphCtx.lineWidth = 1;
    graphCtx.setLineDash([4, 4]);
    const centerX = padding + 30 * (width - 2*padding) / 60;
    const centerY = height - padding - 30 * (height - 2*padding) / 60;
    
    graphCtx.beginPath();
    graphCtx.moveTo(centerX, padding);
    graphCtx.lineTo(centerX, height - padding);
    graphCtx.stroke();
    
    graphCtx.beginPath();
    graphCtx.moveTo(padding, centerY);
    graphCtx.lineTo(width - padding, centerY);
    graphCtx.stroke();
    graphCtx.setLineDash([]);
}

function drawTheoreticalCurve(width, height, padding) {
    // Teorik eğri: F = -(k₁*v + k₂*v²)
    // Hız aralığında eğriyi çiz
    
    graphCtx.strokeStyle = 'rgba(168, 85, 247, 0.5)'; // Mor, yarı saydam
    graphCtx.lineWidth = 2;
    graphCtx.beginPath();

    let isFirstPoint = true;
    for (let v = -30; v <= 30; v += 0.5) {
        // Teorik kuvveti hesapla
        const F = -(physicsState.linearDrag * v + 
                   physicsState.quadraticDrag * v * v);

        // Ekran koordinatlarına dönüştür
        const x = padding + (v + 30) * (width - 2*padding) / 60;
        const y = height - padding - (F + 30) * (height - 2*padding) / 60;

        // Sınırlar içinde midir kontrol et
        if (F >= -30 && F <= 30) {
            if (isFirstPoint) {
                graphCtx.moveTo(x, y);
                isFirstPoint = false;
            } else {
                graphCtx.lineTo(x, y);
            }
        }
    }
    graphCtx.stroke();

    // Eğri adı
    graphCtx.fillStyle = '#a855f7';
    graphCtx.font = 'italic 10px Arial';
    graphCtx.fillText('Teorik: F = -(k₁v + k₂v²)', padding + 10, padding + 15);
}

function drawCurrentPoint(width, height, padding) {
    // Anlık hız ve kuvveti nokta olarak çiz
    const v = physicsState.velocity;
    const F = physicsState.frictionForce;

    if (v >= -30 && v <= 30 && F >= -30 && F <= 30) {
        const x = padding + (v + 30) * (width - 2*padding) / 60;
        const y = height - padding - (F + 30) * (height - 2*padding) / 60;

        // Kırmızı parlayan nokta
        graphCtx.fillStyle = '#ef4444';
        graphCtx.beginPath();
        graphCtx.arc(x, y, 6, 0, 2 * Math.PI);
        graphCtx.fill();

        // Halo efekti
        graphCtx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
        graphCtx.lineWidth = 2;
        graphCtx.beginPath();
        graphCtx.arc(x, y, 10, 0, 2 * Math.PI);
        graphCtx.stroke();

        // Koordinat göster
        graphCtx.fillStyle = '#fca5a5';
        graphCtx.font = 'bold 9px Arial';
        graphCtx.textAlign = 'center';
        graphCtx.fillText(`v=${v.toFixed(1)}`, x, y - 18);
        graphCtx.fillText(`F=${F.toFixed(1)}`, x, y + 18);

        // Geçmiş veriyi kaydet
        velocityHistory.push(v);
        forceHistory.push(F);
        if (velocityHistory.length > maxHistoryLength) {
            velocityHistory.shift();
            forceHistory.shift();
        }
    }
}

function drawHistoryTrail(width, height, padding) {
    // Geçmiş noktaları açık çizgi olarak çiz (iz)
    if (velocityHistory.length < 2) return;

    graphCtx.strokeStyle = 'rgba(34, 197, 94, 0.4)'; // Yeşil, yarı saydam
    graphCtx.lineWidth = 1;
    graphCtx.setLineDash([2, 2]);
    graphCtx.beginPath();

    for (let i = 0; i < velocityHistory.length; i++) {
        const v = velocityHistory[i];
        const F = forceHistory[i];

        if (v >= -30 && v <= 30 && F >= -30 && F <= 30) {
            const x = padding + (v + 30) * (width - 2*padding) / 60;
            const y = height - padding - (F + 30) * (height - 2*padding) / 60;

            if (i === 0) {
                graphCtx.moveTo(x, y);
            } else {
                graphCtx.lineTo(x, y);
            }
        }
    }
    graphCtx.stroke();
    graphCtx.setLineDash([]);
}

function drawStats(width, height) {
    // Sağ üst köşeye bilgi yaz
    graphCtx.fillStyle = '#e2e8f0';
    graphCtx.font = '10px Arial';
    graphCtx.textAlign = 'right';

    const stats = [
        `k₁ = ${physicsState.linearDrag}`,
        `k₂ = ${physicsState.quadraticDrag}`,
        `Yay: ${physicsState.isSpringActive ? 'AÇIK' : 'KAPALI'}`
    ];

    stats.forEach((stat, index) => {
        graphCtx.fillText(stat, width - 10, height - 50 + index * 15);
    });
}
