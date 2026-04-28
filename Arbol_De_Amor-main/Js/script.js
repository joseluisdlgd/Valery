// Cargar el SVG y animar los corazones
fetch('Img/treelove.svg')
  .then(res => res.text())
  .then(svgText => {
    const container = document.getElementById('tree-container');
    container.innerHTML = svgText;
    const svg = container.querySelector('svg');
    if (!svg) return;

    // Animación de "dibujo" para todos los paths
    const allPaths = Array.from(svg.querySelectorAll('path'));
    allPaths.forEach(path => {
      path.style.stroke = '#222';
      path.style.strokeWidth = '2.5';
      path.style.fillOpacity = '0';
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      path.style.transition = 'none';
    });

    // Forzar reflow y luego animar
    setTimeout(() => {
      allPaths.forEach((path, i) => {
        path.style.transition = `stroke-dashoffset 1.2s cubic-bezier(.77,0,.18,1) ${i * 0.08}s, fill-opacity 0.5s ${0.9 + i * 0.08}s`;
        path.style.strokeDashoffset = 0;
        setTimeout(() => {
          path.style.fillOpacity = '1';
          path.style.stroke = '';
          path.style.strokeWidth = '';
        }, 1200 + i * 80);
      });

      // Después de la animación de dibujo, mueve y agranda el SVG
      const totalDuration = 1200 + (allPaths.length - 1) * 80 + 500;
      setTimeout(() => {
        const isMobile = window.innerWidth <= 700;
        if (!isMobile) svg.classList.add('move-and-scale');
        // Mostrar texto con efecto typing
        setTimeout(() => {
          showDedicationText();
          // Mostrar petalos flotando
          startFloatingObjects();
          // Mostrar cuenta regresiva
          showCountdown();
          // Iniciar música de fondo
          playBackgroundMusic();
        }, 1200); //Tiempo para agrandar el SVG
      }, totalDuration);
    }, 50);

    // Selecciona los corazones (formas rojas)
    const heartPaths = allPaths.filter(el => {
      const style = el.getAttribute('style') || '';
      return style.includes('#FC6F58') || style.includes('#C1321F');
    });
    heartPaths.forEach(path => {
      path.classList.add('animated-heart');
    });
  });

// Efecto máquina de escribir para el texto de dedicatoria (seguidores)
function getURLParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function showDedicationText() { //seguidores
  let text = getURLParam('text');
  if (!text) {
    text = `Para el amor de mi vida:\n\nDesde el primer día que te vi, ese día en el gimnasio cuando nos vimos estaba muy nervioso, y se que te lo dije, pero el corazón me latía rápido y solo quería que todo saliera bien contigo.\n\nCon el tiempo entendí que no eras solo alguien que me gustaba, sino alguien especial, alguien que llegó a mi vida y que no quiero perder.\n\nMe encanta cómo se sienten mis días contigo; incluso lo más simple se vuelve bonito. Estar, hablar, reír y compartir contigo hace que todo sea mejor. Te amo de verdad, porque contigo he sentido algo real y me haces querer ser mejor.\n\nSé que no somos perfectos y que he cometido errores, pero lo que siento por ti es sincero y quiero cuidar lo nuestro, poco a poco.`;  } else {
    text = decodeURIComponent(text).replace(/\\n/g, '\n');
  }
  const container = document.getElementById('dedication-text');
  container.classList.add('typing');
  let i = 0;
  function type() {
    if (i <= text.length) {
      container.textContent = text.slice(0, i);
      i++;
      setTimeout(type, text[i - 2] === '\n' ? 350 : 45);
    } else {
      // Al terminar el typing, mostrar la firma animada
      setTimeout(showSignature, 600);
    }
  }
  type();
}

// Firma manuscrita animada
function showSignature() {
  // Cambia para buscar la firma dentro del contenedor de dedicatoria
  const dedication = document.getElementById('dedication-text');
  let signature = dedication.querySelector('#signature');
  if (!signature) {
    signature = document.createElement('div');
    signature.id = 'signature';
    signature.className = 'signature';
    dedication.appendChild(signature);
  }
  let firma = getURLParam('firma');
  signature.textContent = firma ? decodeURIComponent(firma) : "Con cariño, tu melocotón";
  signature.classList.add('visible');
}



// Controlador de objetos flotantes
function startFloatingObjects() {
  const container = document.getElementById('floating-objects');
  let count = 0;
  function spawn() {
    let el = document.createElement('div');
    el.className = 'floating-petal';
    // Posición inicial
    el.style.left = `${Math.random() * 90 + 2}%`;
    el.style.top = `${100 + Math.random() * 10}%`;
    el.style.opacity = 0.7 + Math.random() * 0.3;
    container.appendChild(el);

    // Animación flotante
    const duration = 6000 + Math.random() * 4000;
    const drift = (Math.random() - 0.5) * 60;
    setTimeout(() => {
      el.style.transition = `transform ${duration}ms linear, opacity 1.2s`;
      el.style.transform = `translate(${drift}px, -110vh) scale(${0.8 + Math.random() * 0.6}) rotate(${Math.random() * 360}deg)`;
      el.style.opacity = 0.2;
    }, 30);

    // Eliminar después de animar
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, duration + 2000);

    // Generar más objetos
    if (count++ < 32) setTimeout(spawn, 350 + Math.random() * 500);
    else setTimeout(spawn, 1200 + Math.random() * 1200);
  }
  spawn();
}

// Cuenta regresiva o fecha especial
function showCountdown() {
  const container = document.getElementById('countdown');
  let startParam = getURLParam('start');
  let eventParam = getURLParam('event');
  let startDate = startParam ? new Date(startParam + 'T00:00:00') : new Date('2025-09-21T00:00:00'); 
  let eventDate = eventParam ? new Date(eventParam + 'T00:00:00') : new Date('2027-03-22T00:00:00');

  function update() {
    const now = new Date();
    let diff = now - startDate;
    let days = Math.floor(diff / (1000 * 60 * 60 * 24));
    let eventDiff = eventDate - now;
    let eventDays = Math.max(0, Math.floor(eventDiff / (1000 * 60 * 60 * 24)));
    let eventHours = Math.max(0, Math.floor((eventDiff / (1000 * 60 * 60)) % 24));
    let eventMinutes = Math.max(0, Math.floor((eventDiff / (1000 * 60)) % 60));
    let eventSeconds = Math.max(0, Math.floor((eventDiff / 1000) % 60));

    container.innerHTML =
      `Llevamos juntos: <b>${days}</b> días<br>` +
      `Nuestro aniversario: <b>${eventDays}d ${eventHours}h ${eventMinutes}m ${eventSeconds}s</b>`;
    container.classList.add('visible');
  }
  update();
  setInterval(update, 1000);
}

// --- Música de fondo ---
function playBackgroundMusic() {
  const audio = document.getElementById('bg-music');
  if (!audio) return;

  // --- Opción archivo local por parámetro 'musica' ---
  let musicaParam = getURLParam('musica');
  if (musicaParam) {
    // Decodifica y previene rutas maliciosas
    musicaParam = decodeURIComponent(musicaParam).replace(/[^\w\d .\-]/g, '');
    audio.src = 'Music/' + musicaParam;
  }

  // --- Opción YouTube (solo mensaje de ayuda) ---
  let youtubeParam = getURLParam('youtube');
  if (youtubeParam) {
    // Muestra mensaje de ayuda para descargar el audio
    let helpMsg = document.getElementById('yt-help-msg');
    if (!helpMsg) {
      helpMsg = document.createElement('div');
      helpMsg.id = 'yt-help-msg';
      helpMsg.style.position = 'fixed';
      helpMsg.style.right = '18px';
      helpMsg.style.bottom = '180px';
      helpMsg.style.background = 'rgba(255,255,255,0.95)';
      helpMsg.style.color = '#e60026';
      helpMsg.style.padding = '10px 16px';
      helpMsg.style.borderRadius = '12px';
      helpMsg.style.boxShadow = '0 2px 8px #e6002633';
      helpMsg.style.fontSize = '1.05em';
      helpMsg.style.zIndex = 100;
      helpMsg.innerHTML = 'Para usar música de YouTube, descarga el audio (por ejemplo, usando y2mate, 4K Video Downloader, etc.), colócalo en la carpeta <b>Music</b> y usa la URL así:<br><br><code>?musica=nombre.mp3</code>';
      document.body.appendChild(helpMsg);
      setTimeout(() => { if(helpMsg) helpMsg.remove(); }, 15000);
    }
  }

  let btn = document.getElementById('music-btn');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'music-btn';
    btn.textContent = '🔊 Música';
    btn.style.position = 'fixed';
    btn.style.bottom = '18px';
    btn.style.right = '18px';
    btn.style.zIndex = 99;
    btn.style.background = 'rgba(255,255,255,0.85)';
    btn.style.border = 'none';
    btn.style.borderRadius = '24px';
    btn.style.padding = '10px 18px';
    btn.style.fontSize = '1.1em';
    btn.style.cursor = 'pointer';
    document.body.appendChild(btn);
  }
  audio.volume = 0.7;
  audio.loop = true;
  // Intentar reproducir inmediatamente
  audio.play().then(() => {
    btn.textContent = '🔊 Música';
  }).catch(() => {
    // Si falla el autoplay, esperar click en el botón
    btn.textContent = '▶️ Música';
  });
  btn.onclick = () => {
    if (audio.paused) {
      audio.play();
      btn.textContent = '🔊 Música';
    } else {
      audio.pause();
      btn.textContent = '🔈 Música';
    }
  };
}

// Intentar reproducir la música lo antes posible (al cargar la página)
window.addEventListener('DOMContentLoaded', () => {
  playBackgroundMusic();
});

// ===== WINNIE POOH ANIMADO =====
function initPoohAnimation() {
  const canvas = document.getElementById('pooh-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  // Estado
  let phase = 'idle'; // idle -> pull -> shoot -> wait
  let pullProgress = 0;
  let arrow = null;        // {x,y,vx,vy,active}
  let particles = [];
  let idleTimer = 0;
  let frameCount = 0;
  let breathe = 0;

  // Colores de Pooh
  const YELLOW = '#F5C842';
  const DARKYELLOW = '#E8B030';
  const RED = '#E8372A';
  const BEIGE = '#F0E0A0';
  const BROWN = '#8B5E10';
  const DARKBROWN = '#5A3A08';

  function heart(cx, cy, size, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(cx, cy + size * 0.3);
    ctx.bezierCurveTo(cx, cy, cx - size, cy, cx - size, cy - size * 0.5);
    ctx.bezierCurveTo(cx - size, cy - size * 1.3, cx, cy - size * 1.1, cx, cy - size * 0.6);
    ctx.bezierCurveTo(cx, cy - size * 1.1, cx + size, cy - size * 1.3, cx + size, cy - size * 0.5);
    ctx.bezierCurveTo(cx + size, cy, cx, cy, cx, cy + size * 0.3);
    ctx.fill();
    ctx.restore();
  }

  function drawPooh(pull) {
    const bx = W * 0.48, by = H * 0.92;
    breathe = Math.sin(frameCount * 0.04) * 1.5;

    // Sombra
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.beginPath();
    ctx.ellipse(bx, by + 2, 40, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Piernas
    ctx.fillStyle = YELLOW;
    ctx.beginPath(); ctx.ellipse(bx - 18, by - 6, 14, 9, -0.3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(bx + 18, by - 6, 14, 9, 0.3, 0, Math.PI * 2); ctx.fill();
    // Zapatos
    ctx.fillStyle = BROWN;
    ctx.beginPath(); ctx.ellipse(bx - 20, by + 2, 16, 7, -0.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(bx + 20, by + 2, 16, 7, 0.2, 0, Math.PI * 2); ctx.fill();

    // Cuerpo
    ctx.fillStyle = YELLOW;
    ctx.beginPath();
    ctx.ellipse(bx, by - 52 + breathe * 0.3, 38, 44, 0, 0, Math.PI * 2);
    ctx.fill();
    // Pancita
    ctx.fillStyle = BEIGE;
    ctx.beginPath();
    ctx.ellipse(bx, by - 48 + breathe * 0.3, 22, 28, 0, 0, Math.PI * 2);
    ctx.fill();
    // Camisa roja
    ctx.fillStyle = RED;
    ctx.beginPath();
    ctx.ellipse(bx, by - 70 + breathe * 0.3, 36, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    // Línea camisa recta
    ctx.fillStyle = RED;
    ctx.fillRect(bx - 36, by - 84 + breathe * 0.3, 72, 16);

    // Brazo izquierdo (quieto)
    ctx.strokeStyle = YELLOW; ctx.lineWidth = 14; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(bx - 32, by - 82 + breathe * 0.3);
    ctx.quadraticCurveTo(bx - 55, by - 70, bx - 52, by - 52);
    ctx.stroke();
    // Mano izq
    ctx.fillStyle = YELLOW;
    ctx.beginPath(); ctx.arc(bx - 52, by - 48, 9, 0, Math.PI * 2); ctx.fill();
    // Tarro miel
    ctx.fillStyle = '#F0C030';
    ctx.beginPath(); ctx.roundRect(bx - 63, by - 58, 20, 22, 3); ctx.fill();
    ctx.fillStyle = '#E0B020';
    ctx.fillRect(bx - 64, by - 61, 22, 6);
    ctx.fillStyle = BROWN; ctx.font = 'bold 5px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('miel', bx - 53, by - 44);

    // Brazo derecho — apunta hacia la derecha con arco, se retrae al pull
    const armPull = pull * 12;
    ctx.strokeStyle = YELLOW; ctx.lineWidth = 14; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(bx + 32, by - 82 + breathe * 0.3);
    ctx.quadraticCurveTo(bx + 50 - armPull, by - 95 + breathe * 0.3, bx + 48 - armPull, by - 112 + breathe * 0.3);
    ctx.stroke();
    // Mano der
    ctx.fillStyle = YELLOW;
    ctx.beginPath(); ctx.arc(bx + 47 - armPull, by - 116 + breathe * 0.3, 9, 0, Math.PI * 2); ctx.fill();

    // ARCO
    const ax = bx + 46 - armPull, ay = by - 116 + breathe * 0.3;
    ctx.strokeStyle = BROWN; ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(ax, ay, 22, -Math.PI * 0.75, Math.PI * 0.75);
    ctx.stroke();
    // Cuerda
    const stringPull = pull * 14;
    const bowTop = { x: ax + Math.cos(-Math.PI * 0.75) * 22, y: ay + Math.sin(-Math.PI * 0.75) * 22 };
    const bowBot = { x: ax + Math.cos(Math.PI * 0.75) * 22, y: ay + Math.sin(Math.PI * 0.75) * 22 };
    ctx.strokeStyle = '#C8A050'; ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(bowTop.x, bowTop.y);
    ctx.lineTo(ax - stringPull, ay);
    ctx.lineTo(bowBot.x, bowBot.y);
    ctx.stroke();

    // CABEZA
    const hx = bx - 5, hy = by - 140 + breathe;
    // Orejas
    ctx.fillStyle = YELLOW;
    ctx.beginPath(); ctx.arc(hx - 36, hy - 18, 16, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(hx + 38, hy - 18, 16, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = DARKYELLOW;
    ctx.beginPath(); ctx.arc(hx - 36, hy - 18, 9, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(hx + 38, hy - 18, 9, 0, Math.PI * 2); ctx.fill();
    // Cabeza
    ctx.fillStyle = YELLOW;
    ctx.beginPath(); ctx.arc(hx, hy, 44, 0, Math.PI * 2); ctx.fill();
    // Hocico
    ctx.fillStyle = '#F0D080';
    ctx.beginPath(); ctx.ellipse(hx, hy + 14, 20, 14, 0, 0, Math.PI * 2); ctx.fill();
    // Nariz
    ctx.fillStyle = '#C26030';
    ctx.beginPath(); ctx.ellipse(hx, hy + 4, 8, 5, 0, 0, Math.PI * 2); ctx.fill();
    // Ojos
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.ellipse(hx - 14, hy - 6, 7, 8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(hx + 14, hy - 6, 7, 8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#2A1008';
    ctx.beginPath(); ctx.arc(hx - 13, hy - 5, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(hx + 15, hy - 5, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(hx - 12, hy - 6, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(hx + 16, hy - 6, 1.5, 0, Math.PI * 2); ctx.fill();
    // Cejas concentradas al disparar
    ctx.strokeStyle = DARKBROWN; ctx.lineWidth = 2; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(hx - 20, hy - 17 - pull * 3);
    ctx.quadraticCurveTo(hx - 14, hy - 20 - pull * 3, hx - 8, hy - 16 - pull * 3);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(hx + 8, hy - 16 - pull * 3);
    ctx.quadraticCurveTo(hx + 14, hy - 20 - pull * 3, hx + 20, hy - 17 - pull * 3);
    ctx.stroke();
    // Sonrisa
    ctx.strokeStyle = '#A05010'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(hx, hy + 18, 10, 0.2, Math.PI - 0.2);
    ctx.stroke();
    // Mejillas
    ctx.fillStyle = 'rgba(240,160,80,0.4)';
    ctx.beginPath(); ctx.arc(hx - 28, hy + 12, 8, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(hx + 28, hy + 12, 8, 0, Math.PI * 2); ctx.fill();

    // Devuelve posición de la punta del arco para lanzar la flecha
    return { ax: ax + 22, ay: ay };
  }

  function getTextBoxCenter() {
    const el = document.getElementById('dedication-text');
    if (!el || el.style.opacity === '0' || !el.classList.contains('typing')) return null;
    const rect = el.getBoundingClientRect();
    return {
      x: rect.left + rect.width * 0.5,
      y: rect.top + rect.height * 0.5
    };
  }

  function spawnArrow(fromX, fromY) {
    const isMobile = window.innerWidth <= 700;
    const target = getTextBoxCenter();
    const tx = target ? target.x : (isMobile ? window.innerWidth * 0.5 : window.innerWidth * 0.15);
    const ty = target ? target.y : (isMobile ? window.innerHeight * 0.15 : window.innerHeight * 0.45);
    const crect = canvas.getBoundingClientRect();
    const startX = crect.left + fromX * (crect.width / W);
    const startY = crect.top + fromY * (crect.height / H);
    const dx = tx - startX, dy = ty - startY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const speed = isMobile ? 10 : 14;
    arrow = {
      x: startX, y: startY,
      vx: dx / dist * speed,
      vy: dy / dist * speed,
      angle: Math.atan2(dy, dx),
      active: true,
      trail: []
    };
  }

  function spawnExplosion(x, y) {
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const speed = 3 + Math.random() * 5;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 6 + Math.random() * 12,
        alpha: 1,
        color: ['#E8372A','#FF6080','#FF80A0','#FFB0C0','#FF4466'][Math.floor(Math.random()*5)],
        life: 1
      });
    }
  }

  function drawArrowInWorld() {
    if (!arrow || !arrow.active) return;
    const crect = canvas.getBoundingClientRect();
    // Dibujar en un canvas overlay temporal no — en su lugar usamos un div SVG flotante
    // Mejor: dibujar la flecha directamente como elemento DOM SVG overlay
  }

  // Usamos un SVG flotante para la flecha (fuera del canvas de Pooh, en el body)
  let arrowSVG = null;
  function getArrowSVG() {
    if (!arrowSVG) {
      arrowSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      arrowSVG.setAttribute('id', 'pooh-arrow-svg');
      arrowSVG.style.cssText = 'position:fixed;left:0;top:0;width:100vw;height:100vh;pointer-events:none;z-index:20;overflow:visible;';
      document.body.appendChild(arrowSVG);
    }
    return arrowSVG;
  }

  function renderArrowSVG() {
    const svg = getArrowSVG();
    svg.innerHTML = '';
    // Partículas
    particles.forEach(p => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      // corazón
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const s = p.size;
      path.setAttribute('d', `M${p.x},${p.y + s*0.3} C${p.x},${p.y} ${p.x-s},${p.y} ${p.x-s},${p.y-s*0.5} C${p.x-s},${p.y-s*1.3} ${p.x},${p.y-s*1.1} ${p.x},${p.y-s*0.6} C${p.x},${p.y-s*1.1} ${p.x+s},${p.y-s*1.3} ${p.x+s},${p.y-s*0.5} C${p.x+s},${p.y} ${p.x},${p.y} ${p.x},${p.y+s*0.3} Z`);
      path.setAttribute('fill', p.color);
      path.setAttribute('opacity', p.alpha);
      svg.appendChild(path);
    });
    // Flecha
    if (arrow && arrow.active) {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('transform', `translate(${arrow.x},${arrow.y}) rotate(${arrow.angle * 180 / Math.PI})`);
      // Palo
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', '-20'); line.setAttribute('y1', '0');
      line.setAttribute('x2', '10'); line.setAttribute('y2', '0');
      line.setAttribute('stroke', '#8B5E10'); line.setAttribute('stroke-width', '3');
      line.setAttribute('stroke-linecap', 'round');
      g.appendChild(line);
      // Plumas
      const f1 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      f1.setAttribute('points', '-20,-6 -14,0 -20,6');
      f1.setAttribute('fill', '#E8372A');
      g.appendChild(f1);
      // Corazón punta
      const hs = 8;
      const hx = 10, hy = 0;
      const hp = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      hp.setAttribute('d', `M${hx},${hy+hs*0.3} C${hx},${hy} ${hx-hs},${hy} ${hx-hs},${hy-hs*0.5} C${hx-hs},${hy-hs*1.3} ${hx},${hy-hs*1.1} ${hx},${hy-hs*0.6} C${hx},${hy-hs*1.1} ${hx+hs},${hy-hs*1.3} ${hx+hs},${hy-hs*0.5} C${hx+hs},${hy} ${hx},${hy} ${hx},${hy+hs*0.3} Z`);
      hp.setAttribute('fill', '#E8372A');
      g.appendChild(hp);
      svg.appendChild(g);
    }
  }

  function tick() {
    frameCount++;
    ctx.clearRect(0, 0, W, H);

    let pull = 0;

    if (phase === 'idle') {
      idleTimer++;
      if (idleTimer > 120) { phase = 'pull'; pullProgress = 0; idleTimer = 0; }
    } else if (phase === 'pull') {
      pullProgress += 0.035;
      pull = Math.sin(pullProgress * Math.PI * 0.5);
      if (pullProgress >= 1) { phase = 'shoot'; }
    } else if (phase === 'shoot') {
      pull = 0;
      const bowPos = drawPooh(0);
      if (!arrow) spawnArrow(bowPos.ax, bowPos.ay);
      phase = 'flying';
    } else if (phase === 'flying') {
      // nada extra, arrow se mueve abajo
    } else if (phase === 'wait') {
      idleTimer++;
      if (idleTimer > 80) { phase = 'idle'; idleTimer = 0; }
    }

    if (phase === 'pull') { drawPooh(pull); }
    else { drawPooh(0); }

    // Mover flecha
    if (arrow && arrow.active) {
      arrow.trail.push({ x: arrow.x, y: arrow.y });
      if (arrow.trail.length > 8) arrow.trail.shift();
      arrow.x += arrow.vx;
      arrow.y += arrow.vy;
      // Detectar colisión con el texto
      const target = getTextBoxCenter();
      if (target) {
        const dx = arrow.x - target.x, dy = arrow.y - target.y;
        if (Math.sqrt(dx*dx+dy*dy) < 40) {
          spawnExplosion(arrow.x, arrow.y);
          arrow = null;
          phase = 'wait'; idleTimer = 0;
        }
      }
      // Fuera de pantalla
      if (arrow && (arrow.x < -50 || arrow.x > window.innerWidth + 50 || arrow.y < -50 || arrow.y > window.innerHeight + 50)) {
        spawnExplosion(arrow.x, arrow.y);
        arrow = null;
        phase = 'wait'; idleTimer = 0;
      }
    }

    // Actualizar partículas
    particles = particles.filter(p => p.alpha > 0.02);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      p.vy += 0.15;
      p.vx *= 0.96; p.vy *= 0.96;
      p.alpha -= 0.025;
      p.size *= 0.97;
    });

    renderArrowSVG();
    requestAnimationFrame(tick);
  }

  tick();
}

// Arrancar Pooh cuando el DOM esté listo
window.addEventListener('DOMContentLoaded', () => {
  initPoohAnimation();
});

function initPhotoGallery() {
  const gallery = document.getElementById('photo-gallery');
  if (!gallery) return;
  // Las fotos ya están incrustadas, solo mostrar la galería
  setTimeout(() => {
    gallery.classList.add('visible');
  }, 300);
}

// Iniciar galería cuando carga el DOM
window.addEventListener('DOMContentLoaded', () => {
  initPhotoGallery();
});