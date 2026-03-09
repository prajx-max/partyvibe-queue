import { useEffect, useRef, useState } from 'react';

const LASER_COUNT = 6;
const LASER_COLORS = [
  'rgba(0,229,255,0.18)',
  'rgba(224,64,251,0.15)',
  'rgba(124,58,237,0.15)',
  'rgba(255,50,100,0.12)',
  'rgba(50,255,150,0.12)',
  'rgba(255,200,0,0.12)',
];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isMobile;
}

export function PartyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Skip canvas lasers entirely on mobile
    if (isMobile) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const lasers = Array.from({ length: LASER_COUNT }, (_, i) => ({
      originX: (i + 0.5) / LASER_COUNT,
      angle: Math.PI * 0.35 + Math.random() * Math.PI * 0.3,
      speed: 0.0004 + Math.random() * 0.0004,
      swingRange: 0.3 + Math.random() * 0.5,
      phase: (i / LASER_COUNT) * Math.PI * 2,
      width: 1 + Math.random() * 1.5,
      color: LASER_COLORS[i % LASER_COLORS.length],
    }));

    let lastTime = 0;
    const FRAME_INTERVAL = 1000 / 30;

    function draw(time: number) {
      animRef.current = requestAnimationFrame(draw);
      if (time - lastTime < FRAME_INTERVAL) return;
      lastTime = time;

      const w = canvas!.width;
      const h = canvas!.height;
      ctx!.clearRect(0, 0, w, h);
      const t = time * 0.001;

      lasers.forEach((laser) => {
        const swing = Math.sin(t * laser.speed * 1000 + laser.phase) * laser.swingRange;
        const currentAngle = laser.angle + swing;
        const ox = laser.originX * w;
        const oy = -10;
        const len = Math.max(w, h) * 0.9;
        const ex = ox + Math.cos(currentAngle) * len;
        const ey = oy + Math.sin(currentAngle) * len;

        ctx!.save();
        ctx!.strokeStyle = laser.color;
        ctx!.lineWidth = laser.width;
        ctx!.shadowColor = laser.color;
        ctx!.shadowBlur = 12;
        ctx!.beginPath();
        ctx!.moveTo(ox, oy);
        ctx!.lineTo(ex, ey);
        ctx!.stroke();

        ctx!.globalAlpha = 0.3;
        ctx!.lineWidth = laser.width * 4;
        ctx!.shadowBlur = 20;
        ctx!.beginPath();
        ctx!.moveTo(ox, oy);
        ctx!.lineTo(ex, ey);
        ctx!.stroke();
        ctx!.restore();
      });
    }

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [isMobile]);

  return (
    <>
      {/* Ambient gradient orbs - smaller on mobile */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute rounded-full opacity-20 animate-float
            w-[250px] h-[250px] blur-[60px] md:w-[600px] md:h-[600px] md:blur-[120px]"
          style={{ top: '10%', left: '15%', background: 'radial-gradient(circle, rgba(0,229,255,0.4), transparent 70%)' }}
        />
        <div
          className="absolute rounded-full opacity-15 animate-float
            w-[200px] h-[200px] blur-[50px] md:w-[500px] md:h-[500px] md:blur-[100px]"
          style={{ top: '50%', right: '10%', background: 'radial-gradient(circle, rgba(224,64,251,0.35), transparent 70%)', animationDelay: '1.5s' }}
        />
        {/* Third orb hidden on mobile */}
        <div
          className="absolute rounded-full opacity-10 animate-float hidden md:block w-[400px] h-[400px] blur-[80px]"
          style={{ bottom: '10%', left: '40%', background: 'radial-gradient(circle, rgba(124,58,237,0.3), transparent 70%)', animationDelay: '3s' }}
        />
      </div>

      {/* Laser canvas - desktop only */}
      {!isMobile && (
        <canvas ref={canvasRef} className="fixed inset-0 z-[1] pointer-events-none mix-blend-screen" />
      )}

      {/* Subtle grid - desktop only */}
      <div
        className="fixed inset-0 z-[2] pointer-events-none opacity-30 hidden md:block"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,229,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.02) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, transparent 100%)',
        }}
      />
    </>
  );
}
