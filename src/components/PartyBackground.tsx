import { motion } from 'framer-motion';

function DancingSilhouette({ style, delay, variant }: { style: React.CSSProperties; delay: number; variant: number }) {
  const danceAnimations = [
    // Variant 0: Side-to-side bounce
    {
      y: [0, -18, 0, -12, 0],
      x: [-4, 4, -4, 4, -4],
      rotate: [-3, 3, -3, 3, -3],
      scaleY: [1, 1.05, 0.95, 1.05, 1],
    },
    // Variant 1: Jump dance
    {
      y: [0, -25, 0, -10, 0],
      scaleX: [1, 0.9, 1.1, 0.95, 1],
      scaleY: [1, 1.1, 0.9, 1.05, 1],
    },
    // Variant 2: Sway
    {
      rotate: [-8, 8, -8, 8, -8],
      y: [0, -6, 0, -6, 0],
      x: [-8, 8, -8, 8, -8],
    },
  ];

  const dance = danceAnimations[variant % 3];

  // Simple person silhouette using divs
  return (
    <motion.div
      className="absolute bottom-0"
      style={style}
      animate={dance}
      transition={{
        duration: 1.2 + variant * 0.3,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    >
      {/* Head */}
      <div className="w-3 h-3 rounded-full bg-foreground/10 mx-auto mb-0.5" />
      {/* Body */}
      <div className="w-2 h-5 bg-foreground/10 mx-auto rounded-sm" />
      {/* Arms - spread based on variant */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-0">
        <motion.div
          className="w-3 h-1 bg-foreground/8 rounded-full origin-right"
          animate={{ rotate: variant === 0 ? [-30, -60, -30] : [-20, -50, -20] }}
          transition={{ duration: 0.6 + variant * 0.15, repeat: Infinity, ease: 'easeInOut', delay }}
          style={{ transformOrigin: 'right center', marginRight: '2px' }}
        />
        <motion.div
          className="w-3 h-1 bg-foreground/8 rounded-full origin-left"
          animate={{ rotate: variant === 1 ? [30, 60, 30] : [20, 50, 20] }}
          transition={{ duration: 0.6 + variant * 0.15, repeat: Infinity, ease: 'easeInOut', delay: delay + 0.1 }}
          style={{ transformOrigin: 'left center', marginLeft: '2px' }}
        />
      </div>
      {/* Legs */}
      <div className="flex gap-0.5 justify-center">
        <motion.div
          className="w-1.5 h-4 bg-foreground/8 rounded-sm origin-top"
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut', delay }}
        />
        <motion.div
          className="w-1.5 h-4 bg-foreground/8 rounded-sm origin-top"
          animate={{ rotate: [5, -5, 5] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut', delay: delay + 0.15 }}
        />
      </div>
    </motion.div>
  );
}

function BeatPulse() {
  return (
    <>
      {/* Central beat pulse */}
      <motion.div
        className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[800px] h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(ellipse at center bottom, hsl(var(--primary) / 0.08), transparent 70%)',
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Accent beat pulse */}
      <motion.div
        className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[600px] h-[300px] rounded-full"
        style={{
          background: 'radial-gradient(ellipse at center bottom, hsl(var(--accent) / 0.06), transparent 70%)',
        }}
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
      />
    </>
  );
}

function StrobeFlash() {
  return (
    <motion.div
      className="absolute inset-0"
      style={{ background: 'hsl(var(--primary) / 0.03)' }}
      animate={{ opacity: [0, 0, 0.6, 0, 0, 0, 0.4, 0, 0, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
    />
  );
}

function LaserBeams() {
  return (
    <>
      <motion.div
        className="absolute top-0 left-1/3 w-px h-full origin-top"
        style={{ background: 'linear-gradient(to bottom, hsl(var(--primary) / 0.3), transparent 60%)' }}
        animate={{ rotate: [-15, 15, -15], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-0 right-1/3 w-px h-full origin-top"
        style={{ background: 'linear-gradient(to bottom, hsl(var(--accent) / 0.25), transparent 60%)' }}
        animate={{ rotate: [12, -12, 12], opacity: [0.15, 0.4, 0.15] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />
      <motion.div
        className="absolute top-0 left-1/2 w-px h-full origin-top"
        style={{ background: 'linear-gradient(to bottom, hsl(var(--secondary) / 0.2), transparent 50%)' }}
        animate={{ rotate: [-8, 20, -8], opacity: [0.1, 0.35, 0.1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
    </>
  );
}

const dancers = [
  { style: { left: '5%' }, delay: 0, variant: 0 },
  { style: { left: '12%' }, delay: 0.2, variant: 1 },
  { style: { left: '20%' }, delay: 0.4, variant: 2 },
  { style: { left: '30%' }, delay: 0.1, variant: 0 },
  { style: { left: '40%' }, delay: 0.5, variant: 1 },
  { style: { left: '50%' }, delay: 0.3, variant: 2 },
  { style: { left: '60%' }, delay: 0.15, variant: 0 },
  { style: { left: '70%' }, delay: 0.45, variant: 1 },
  { style: { left: '80%' }, delay: 0.25, variant: 2 },
  { style: { left: '88%' }, delay: 0.35, variant: 0 },
  { style: { left: '95%' }, delay: 0.1, variant: 1 },
];

export function PartyBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Floating orbs */}
      <motion.div
        className="absolute h-[500px] w-[500px] rounded-full blur-[120px]"
        style={{ left: '-10%', top: '-5%', background: 'hsl(var(--primary) / 0.08)' }}
        animate={{ x: ['-25%', '10%', '-25%'], y: ['0%', '20%', '0%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute h-[500px] w-[500px] rounded-full blur-[120px]"
        style={{ right: '-10%', bottom: '-5%', background: 'hsl(var(--accent) / 0.08)' }}
        animate={{ x: ['10%', '-15%', '10%'], y: ['10%', '-10%', '10%'] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute h-[350px] w-[350px] rounded-full blur-[100px]"
        style={{ left: '40%', top: '30%', background: 'hsl(var(--secondary) / 0.06)' }}
        animate={{ x: ['-5%', '5%', '-5%'], y: ['5%', '-5%', '5%'] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Laser beams from top */}
      <LaserBeams />

      {/* Beat-reactive pulse from bottom */}
      <BeatPulse />

      {/* Subtle strobe */}
      <StrobeFlash />

      {/* Dancing silhouettes along the bottom */}
      {dancers.map((d, i) => (
        <DancingSilhouette key={i} style={d.style} delay={d.delay} variant={d.variant} />
      ))}

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
}
