import { motion } from 'framer-motion';

export function PartyBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Floating orbs */}
      <motion.div
        className="absolute h-[500px] w-[500px] rounded-full bg-primary/8 blur-[120px]"
        animate={{
          x: ['-25%', '10%', '-25%'],
          y: ['0%', '20%', '0%'],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        style={{ left: '-10%', top: '-5%' }}
      />
      <motion.div
        className="absolute h-[500px] w-[500px] rounded-full bg-accent/8 blur-[120px]"
        animate={{
          x: ['10%', '-15%', '10%'],
          y: ['10%', '-10%', '10%'],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        style={{ right: '-10%', bottom: '-5%' }}
      />
      <motion.div
        className="absolute h-[350px] w-[350px] rounded-full bg-secondary/6 blur-[100px]"
        animate={{
          x: ['-5%', '5%', '-5%'],
          y: ['5%', '-5%', '5%'],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        style={{ left: '40%', top: '30%' }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(185, 100%, 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(185, 100%, 50%) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
}
