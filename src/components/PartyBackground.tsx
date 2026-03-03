import { useEffect, useRef, useCallback } from 'react';

// ═══════════════════════════════════
// SHARED STATE
// ═══════════════════════════════════
let mouseX = 0, mouseY = 0;
let smoothMouseX = 0.5, smoothMouseY = 0.5;
let isBeat = false;
const BPM = 128;
const beatInterval = 60000 / BPM;

// ═══════════════════════════════════
// ORB DATA
// ═══════════════════════════════════
const orbs = [
  { x: 0.2, y: 0.3, r: 0.45, color: [0, 200, 255], phase: 0, speed: 0.0008 },
  { x: 0.8, y: 0.7, r: 0.4, color: [200, 50, 255], phase: 1.5, speed: 0.0012 },
  { x: 0.5, y: 0.5, r: 0.35, color: [100, 80, 255], phase: 3, speed: 0.0007 },
  { x: 0.1, y: 0.8, r: 0.3, color: [0, 255, 200], phase: 0.8, speed: 0.001 },
  { x: 0.9, y: 0.2, r: 0.35, color: [180, 0, 255], phase: 2.2, speed: 0.0009 },
  { x: 0.6, y: 0.1, r: 0.25, color: [255, 50, 100], phase: 4.0, speed: 0.0011 },
  { x: 0.3, y: 0.9, r: 0.3, color: [50, 255, 150], phase: 1.0, speed: 0.0006 },
];

// ═══════════════════════════════════
// LASER CLASS
// ═══════════════════════════════════
class LaserBeam {
  originX = 0; originY = -0.05; angle = 0; speed = 0; swingRange = 0;
  phase = 0; width = 0; length = 0; color = [0,0,0]; alpha = 0;
  flickerSpeed = 0;

  constructor() { this.reset(); }

  reset() {
    this.originX = Math.random();
    this.originY = -0.05;
    this.angle = Math.PI * 0.3 + Math.random() * Math.PI * 0.4;
    this.speed = 0.0003 + Math.random() * 0.0006;
    this.swingRange = 0.3 + Math.random() * 0.8;
    this.phase = Math.random() * Math.PI * 2;
    this.width = 1 + Math.random() * 2;
    this.length = 0.8 + Math.random() * 0.6;
    const colors = [[0,229,255],[224,64,251],[124,58,237],[255,50,100],[50,255,150],[255,200,0],[0,255,200]];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.alpha = 0.15 + Math.random() * 0.2;
    this.flickerSpeed = 2 + Math.random() * 4;
  }
}

// ═══════════════════════════════════
// PARTICLE CLASS
// ═══════════════════════════════════
class Particle {
  x = 0; y = 0; size = 0; speedX = 0; speedY = 0;
  life = 1; decay = 0; color = [0,0,0]; twinkleSpeed = 0;
  wobble = 0; wobbleSpeed = 0;

  constructor(w: number, h: number, initial = false) { this.reset(w, h, initial); }

  reset(w: number, h: number, initial = false) {
    this.x = Math.random() * w;
    this.y = initial ? Math.random() * h : h + 20;
    this.size = 1 + Math.random() * 3;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = -0.3 - Math.random() * 1.5;
    this.life = 1;
    this.decay = 0.001 + Math.random() * 0.004;
    const colors = [[0,229,255],[224,64,251],[124,58,237],[255,255,255],[255,200,50],[50,255,200]];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.twinkleSpeed = 2 + Math.random() * 5;
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = 0.02 + Math.random() * 0.03;
  }
}

class BurstParticle {
  x: number; y: number; vx: number; vy: number;
  size: number; life = 1; decay: number; color: number[];

  constructor(x: number, y: number) {
    this.x = x; this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 4;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.size = 1 + Math.random() * 3;
    this.decay = 0.015 + Math.random() * 0.02;
    const colors = [[0,229,255],[224,64,251],[255,255,255],[255,200,50]];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
}

// ═══════════════════════════════════
// SPOTLIGHT CLASS
// ═══════════════════════════════════
class Spotlight {
  baseX: number; speed: number; phase: number; range: number;
  color: number[]; coneWidth: number;

  constructor(idx: number, total: number) {
    this.baseX = (idx + 0.5) / total;
    this.speed = 0.3 + Math.random() * 0.5;
    this.phase = (idx / total) * Math.PI * 2;
    this.range = 0.15 + Math.random() * 0.2;
    const colors = [[0,229,255,0.04],[224,64,251,0.035],[124,58,237,0.03],[255,100,100,0.025],[50,255,150,0.03]];
    this.color = colors[idx % colors.length];
    this.coneWidth = 0.08 + Math.random() * 0.06;
  }
}

// ═══════════════════════════════════
// DISCO REFLECTION
// ═══════════════════════════════════
class DiscoReflection {
  x = 0; y = 0; size = 0; speedX = 0; speedY = 0;
  life = 0; maxLife = 0; alpha = 0;

  constructor(w: number, h: number) { this.reset(w, h); }

  reset(w: number, h: number) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.size = 2 + Math.random() * 6;
    this.speedX = (Math.random() - 0.5) * 2;
    this.speedY = (Math.random() - 0.5) * 2;
    this.life = 0.5 + Math.random() * 0.5;
    this.maxLife = this.life;
    this.alpha = 0.1 + Math.random() * 0.25;
  }
}

export function PartyBackground() {
  const auroraRef = useRef<HTMLCanvasElement>(null);
  const laserRef = useRef<HTMLCanvasElement>(null);
  const particleRef = useRef<HTMLCanvasElement>(null);
  const spotlightRef = useRef<HTMLCanvasElement>(null);
  const vizRef = useRef<HTMLCanvasElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const stateRef = useRef({
    lasers: [] as LaserBeam[],
    particles: [] as Particle[],
    burstParticles: [] as BurstParticle[],
    spotlights: [] as Spotlight[],
    reflections: [] as DiscoReflection[],
    vizBars: new Array(64).fill(0),
    vizTargets: new Array(64).fill(0),
    trailDots: [] as { x: number; y: number }[],
    trailEls: [] as HTMLDivElement[],
    lastBeatTime: 0,
    lastBurstTime: 0,
    emojiTimer: 0,
    initialized: false,
  });

  const resize = useCallback(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    [auroraRef, laserRef, particleRef, spotlightRef].forEach(ref => {
      if (ref.current) { ref.current.width = w; ref.current.height = h; }
    });
    if (vizRef.current) { vizRef.current.width = w; vizRef.current.height = 100; }
  }, []);

  useEffect(() => {
    const s = stateRef.current;
    const w = window.innerWidth;
    const h = window.innerHeight;
    mouseX = w / 2;
    mouseY = h / 2;

    // Init objects
    for (let i = 0; i < 14; i++) s.lasers.push(new LaserBeam());
    for (let i = 0; i < 120; i++) s.particles.push(new Particle(w, h, true));
    for (let i = 0; i < 5; i++) s.spotlights.push(new Spotlight(i, 5));
    for (let i = 0; i < 30; i++) s.reflections.push(new DiscoReflection(w, h));

    // Trail dots
    const TRAIL_COUNT = 12;
    for (let i = 0; i < TRAIL_COUNT; i++) {
      const dot = document.createElement('div');
      dot.className = 'trail-dot';
      const hue = (i / TRAIL_COUNT) * 60 + 170;
      dot.style.background = `hsl(${hue}, 100%, 70%)`;
      dot.style.width = (6 - i * 0.4) + 'px';
      dot.style.height = (6 - i * 0.4) + 'px';
      dot.style.boxShadow = `0 0 ${8 - i}px hsl(${hue}, 100%, 60%)`;
      document.body.appendChild(dot);
      s.trailDots.push({ x: w / 2, y: h / 2 });
      s.trailEls.push(dot);
    }

    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursorGlowRef.current) {
        cursorGlowRef.current.style.left = e.clientX + 'px';
        cursorGlowRef.current.style.top = e.clientY + 'px';
      }
      const now = performance.now();
      if (now - s.lastBurstTime > 50) {
        s.lastBurstTime = now;
        for (let i = 0; i < 2; i++) s.burstParticles.push(new BurstParticle(e.clientX, e.clientY));
      }
    };

    const onClick = (e: MouseEvent) => {
      for (let i = 0; i < 30; i++) s.burstParticles.push(new BurstParticle(e.clientX, e.clientY));
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);

    s.initialized = true;

    // ═══════════════════════════════════
    // MAIN LOOP
    // ═══════════════════════════════════
    function mainLoop(time: number) {
      animRef.current = requestAnimationFrame(mainLoop);

      // Beat check
      if (time - s.lastBeatTime > beatInterval) {
        s.lastBeatTime = time;
        isBeat = true;
        spawnBeatRing();
        setTimeout(() => { isBeat = false; }, 100);
      }

      drawAurora(time);
      drawLasers(time);
      drawParticles(time);
      drawSpotlights(time);
      updateVisualizer(time);
      updateTrail();
      spawnEmoji(time);
    }

    function spawnBeatRing() {
      const ring = document.createElement('div');
      ring.className = 'beat-ring';
      document.body.appendChild(ring);
      let size = 0, opacity = 0.3;
      const colors = ['0,229,255', '224,64,251', '124,58,237'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      function expand() {
        size += 8; opacity -= 0.004;
        ring.style.width = size + 'px';
        ring.style.height = size + 'px';
        ring.style.opacity = String(Math.max(0, opacity));
        ring.style.borderColor = `rgba(${color},${Math.max(0, opacity)})`;
        if (opacity > 0) requestAnimationFrame(expand);
        else ring.remove();
      }
      requestAnimationFrame(expand);
    }

    const emojis = ['🎵','🎶','🎧','🔊','🎤','✨','💜','🎸','🪩','🥁'];
    function spawnEmoji(time: number) {
      if (time - s.emojiTimer > 3000) {
        s.emojiTimer = time;
        const el = document.createElement('div');
        el.className = 'float-emoji';
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        el.style.left = (10 + Math.random() * 80) + 'vw';
        el.style.bottom = '20px';
        el.style.fontSize = (16 + Math.random() * 14) + 'px';
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 6000);
      }
    }

    function drawAurora(time: number) {
      const ctx = auroraRef.current?.getContext('2d');
      if (!ctx || !auroraRef.current) return;
      const w = auroraRef.current.width, h = auroraRef.current.height;
      ctx.clearRect(0, 0, w, h);

      smoothMouseX += (mouseX / w - smoothMouseX) * 0.04;
      smoothMouseY += (mouseY / h - smoothMouseY) * 0.04;
      const beatBoost = isBeat ? 1.5 : 1;

      orbs.forEach((orb, i) => {
        const t = time * 0.001 * orb.speed * 500 + orb.phase;
        const mx = smoothMouseX * 0.2 * (i % 2 === 0 ? 1 : -1);
        const my = smoothMouseY * 0.15 * (i % 3 === 0 ? 1 : -1);
        const ox = (orb.x + Math.sin(t) * 0.15 + mx) * w;
        const oy = (orb.y + Math.cos(t * 0.7) * 0.12 + my) * h;
        const r = orb.r * Math.min(w, h) * beatBoost;
        const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, r);
        const alpha = (0.07 + Math.sin(t * 3) * 0.02) * beatBoost;
        grad.addColorStop(0, `rgba(${orb.color[0]},${orb.color[1]},${orb.color[2]},${alpha})`);
        grad.addColorStop(0.4, `rgba(${orb.color[0]},${orb.color[1]},${orb.color[2]},${alpha * 0.35})`);
        grad.addColorStop(1, `rgba(${orb.color[0]},${orb.color[1]},${orb.color[2]},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(ox, oy, r, 0, Math.PI * 2);
        ctx.fill();
      });

      const pulse = ctx.createRadialGradient(smoothMouseX * w, smoothMouseY * h, 0, smoothMouseX * w, smoothMouseY * h, 350);
      pulse.addColorStop(0, 'rgba(0,229,255,0.05)');
      pulse.addColorStop(0.5, 'rgba(224,64,251,0.015)');
      pulse.addColorStop(1, 'transparent');
      ctx.fillStyle = pulse;
      ctx.fillRect(0, 0, w, h);
    }

    function drawLasers(time: number) {
      const ctx = laserRef.current?.getContext('2d');
      if (!ctx || !laserRef.current) return;
      const w = laserRef.current.width, h = laserRef.current.height;
      ctx.clearRect(0, 0, w, h);
      const beatBoost = isBeat ? 2.5 : 1;

      s.lasers.forEach((laser, idx) => {
        const t = time * 0.001;
        const swing = Math.sin(t * laser.speed * 1000 + laser.phase) * laser.swingRange;
        const currentAngle = laser.angle + swing;
        const flicker = 0.5 + 0.5 * Math.sin(t * laser.flickerSpeed + idx);
        const ox = laser.originX * w;
        const oy = laser.originY * h;
        const len = laser.length * Math.max(w, h);
        const mouseInfluence = 0.1;
        const toMouseAngle = Math.atan2(mouseY - oy, mouseX - ox);
        const finalAngle = currentAngle + (toMouseAngle - currentAngle) * mouseInfluence;
        const ex = ox + Math.cos(finalAngle) * len;
        const ey = oy + Math.sin(finalAngle) * len;
        const alpha = laser.alpha * flicker * beatBoost;

        ctx.save();
        ctx.globalAlpha = Math.min(1, alpha);
        ctx.strokeStyle = `rgb(${laser.color[0]},${laser.color[1]},${laser.color[2]})`;
        ctx.lineWidth = laser.width * (isBeat ? 2.5 : 1);
        ctx.shadowColor = `rgba(${laser.color[0]},${laser.color[1]},${laser.color[2]},0.8)`;
        ctx.shadowBlur = 15 * beatBoost;
        ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ex, ey); ctx.stroke();

        ctx.globalAlpha = Math.min(1, alpha * 0.3);
        ctx.lineWidth = laser.width * 6 * (isBeat ? 2 : 1);
        ctx.shadowBlur = 30 * beatBoost;
        ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ex, ey); ctx.stroke();

        ctx.globalAlpha = Math.min(1, alpha * 0.08);
        ctx.lineWidth = laser.width * 20;
        ctx.shadowBlur = 50;
        ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ex, ey); ctx.stroke();
        ctx.restore();

        if (ey > h * 0.3) {
          const grad = ctx.createRadialGradient(ex, ey, 0, ex, ey, 40 * beatBoost);
          grad.addColorStop(0, `rgba(${laser.color[0]},${laser.color[1]},${laser.color[2]},${alpha * 0.4})`);
          grad.addColorStop(1, `rgba(${laser.color[0]},${laser.color[1]},${laser.color[2]},0)`);
          ctx.fillStyle = grad;
          ctx.beginPath(); ctx.arc(ex, ey, 40 * beatBoost, 0, Math.PI * 2); ctx.fill();
        }
      });
    }

    function drawParticles(time: number) {
      const ctx = particleRef.current?.getContext('2d');
      if (!ctx || !particleRef.current) return;
      const w = particleRef.current.width, h = particleRef.current.height;
      ctx.clearRect(0, 0, w, h);
      const t = time * 0.001;
      const beatBoost = isBeat ? 2 : 1;

      s.particles.forEach(p => {
        p.wobble += p.wobbleSpeed;
        p.x += p.speedX + Math.sin(p.wobble) * 0.3;
        p.y += p.speedY;
        p.life -= p.decay;
        if (p.life <= 0 || p.y < -20) p.reset(w, h);

        const dx = mouseX - p.x, dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          const force = (200 - dist) / 200 * 0.3;
          p.x += dx * force * 0.01;
          p.y += dy * force * 0.01;
        }

        const twinkle = 0.3 + 0.7 * Math.abs(Math.sin(t * p.twinkleSpeed));
        const alpha = p.life * twinkle * beatBoost;
        const size = p.size * (isBeat ? 1.5 : 1);

        ctx.save();
        ctx.globalAlpha = Math.min(1, alpha * 0.8);
        ctx.fillStyle = `rgb(${p.color[0]},${p.color[1]},${p.color[2]})`;
        ctx.shadowColor = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},0.8)`;
        ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.arc(p.x, p.y, size, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });

      for (let i = s.burstParticles.length - 1; i >= 0; i--) {
        const p = s.burstParticles[i];
        p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.vx *= 0.98; p.life -= p.decay;
        if (p.life <= 0) { s.burstParticles.splice(i, 1); continue; }
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = `rgb(${p.color[0]},${p.color[1]},${p.color[2]})`;
        ctx.shadowColor = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},1)`;
        ctx.shadowBlur = 12;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      // Disco reflections
      s.reflections.forEach(r => {
        r.x += r.speedX; r.y += r.speedY; r.life -= 0.005;
        if (r.life <= 0 || r.x < 0 || r.x > w || r.y < 0 || r.y > h) r.reset(w, h);
        const fade = r.life / r.maxLife;
        const alpha = r.alpha * fade * (isBeat ? 2 : 1);
        ctx.save();
        ctx.globalAlpha = Math.min(1, alpha);
        ctx.fillStyle = '#fff';
        ctx.shadowColor = 'rgba(255,255,255,0.5)';
        ctx.shadowBlur = 6;
        ctx.translate(r.x, r.y);
        ctx.rotate(r.life * 2);
        ctx.fillRect(-r.size / 2, -r.size / 2, r.size, r.size);
        ctx.restore();
      });
    }

    function drawSpotlights(time: number) {
      const ctx = spotlightRef.current?.getContext('2d');
      if (!ctx || !spotlightRef.current) return;
      const w = spotlightRef.current.width, h = spotlightRef.current.height;
      ctx.clearRect(0, 0, w, h);
      const t = time * 0.001;
      const beatBoost = isBeat ? 2 : 1;

      s.spotlights.forEach(spot => {
        const swing = Math.sin(t * spot.speed + spot.phase) * spot.range;
        const x = (spot.baseX + swing) * w;
        const mouseInf = ((mouseX / w) - 0.5) * 0.08;
        const finalX = x + mouseInf * w;
        const coneHalfWidth = spot.coneWidth * w;
        const alpha = spot.color[3] * beatBoost;

        const grad = ctx.createLinearGradient(finalX, -30, finalX, h);
        grad.addColorStop(0, `rgba(${spot.color[0]},${spot.color[1]},${spot.color[2]},${alpha * 1.5})`);
        grad.addColorStop(0.5, `rgba(${spot.color[0]},${spot.color[1]},${spot.color[2]},${alpha * 0.3})`);
        grad.addColorStop(1, `rgba(${spot.color[0]},${spot.color[1]},${spot.color[2]},0)`);

        ctx.save();
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(finalX, -30);
        ctx.lineTo(finalX - coneHalfWidth * 3, h);
        ctx.lineTo(finalX + coneHalfWidth * 3, h);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });
    }

    function updateVisualizer(time: number) {
      const ctx = vizRef.current?.getContext('2d');
      if (!ctx || !vizRef.current) return;
      const w = vizRef.current.width, h = 100;
      const t = time * 0.001;
      const BAR_COUNT = 64;

      for (let i = 0; i < BAR_COUNT; i++) {
        const freq = i / BAR_COUNT;
        const bass = Math.sin(t * 4 + i * 0.1) * 0.4 * (1 - freq);
        const mid = Math.sin(t * 7 + i * 0.3) * 0.3 * Math.exp(-Math.abs(freq - 0.4) * 5);
        const high = Math.sin(t * 12 + i * 0.5) * 0.15 * freq;
        const noise = Math.random() * 0.1;
        const beatPulse = isBeat ? 0.4 * (1 - freq * 0.5) : 0;
        s.vizTargets[i] = Math.abs(bass + mid + high + noise + beatPulse);
        s.vizBars[i] += (s.vizTargets[i] - s.vizBars[i]) * 0.2;
      }

      ctx.clearRect(0, 0, w, h);
      const barWidth = w / BAR_COUNT;

      for (let i = 0; i < BAR_COUNT; i++) {
        const barH = s.vizBars[i] * h * 1.2;
        const x = i * barWidth;
        const hue = 180 + (i / BAR_COUNT) * 120;
        const lightness = 50 + s.vizBars[i] * 30;

        const grad = ctx.createLinearGradient(0, h, 0, h - barH);
        grad.addColorStop(0, `hsla(${hue}, 100%, ${lightness}%, 0.6)`);
        grad.addColorStop(0.5, `hsla(${hue}, 100%, ${lightness}%, 0.3)`);
        grad.addColorStop(1, `hsla(${hue}, 100%, ${lightness}%, 0.05)`);

        ctx.fillStyle = grad;
        ctx.shadowColor = `hsla(${hue}, 100%, 60%, 0.4)`;
        ctx.shadowBlur = 8;
        ctx.fillRect(x + 1, h - barH, barWidth - 2, barH);
      }
    }

    function updateTrail() {
      let prevX = mouseX, prevY = mouseY;
      s.trailDots.forEach((dot, i) => {
        const ease = 0.25 - i * 0.015;
        dot.x += (prevX - dot.x) * ease;
        dot.y += (prevY - dot.y) * ease;
        if (s.trailEls[i]) {
          s.trailEls[i].style.left = dot.x + 'px';
          s.trailEls[i].style.top = dot.y + 'px';
          s.trailEls[i].style.opacity = String(1 - (i / s.trailDots.length) * 0.8);
        }
        prevX = dot.x;
        prevY = dot.y;
      });
    }

    animRef.current = requestAnimationFrame(mainLoop);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
      s.trailEls.forEach(el => el.remove());
      // Clean up any beat rings or emojis
      document.querySelectorAll('.beat-ring, .float-emoji').forEach(el => el.remove());
    };
  }, [resize]);

  return (
    <>
      {/* Canvas layers */}
      <canvas ref={auroraRef} className="fixed inset-0 z-0 pointer-events-none" />
      <canvas ref={laserRef} className="fixed inset-0 z-[1] pointer-events-none mix-blend-screen" />
      <canvas ref={particleRef} className="fixed inset-0 z-[2] pointer-events-none mix-blend-screen" />
      <canvas ref={spotlightRef} className="fixed inset-0 z-[3] pointer-events-none mix-blend-screen" />
      <canvas ref={vizRef} className="fixed bottom-0 left-0 right-0 h-[100px] z-[8] pointer-events-none" />

      {/* Grid overlay */}
      <div className="grid-overlay" />
      {/* Grain */}
      <div className="grain-overlay" />
      {/* Fog */}
      <div className="fog-overlay" />
      {/* Strobe */}
      <div className="strobe-overlay" />
      {/* Edge glows */}
      <div className="edge-glow-left" />
      <div className="edge-glow-right" />
      <div className="edge-glow-top" />
      {/* Cursor glow */}
      <div ref={cursorGlowRef} className="cursor-glow" />

      {/* Disco ball */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 z-[6] pointer-events-none">
        <div className="w-px h-3.5 bg-foreground/15 mx-auto" />
        <div className="w-6 h-6 rounded-full animate-disco-spin"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #eee, #888 40%, #555 80%)',
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: '0 0 20px rgba(255,255,255,0.1), 0 4px 12px rgba(0,0,0,0.4)',
          }}
        />
      </div>
    </>
  );
}
