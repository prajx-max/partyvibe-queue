import { motion } from 'framer-motion';

interface EqualizerProps {
  isPlaying?: boolean;
  className?: string;
  barCount?: number;
}

export function Equalizer({ isPlaying = true, className = '', barCount = 4 }: EqualizerProps) {
  return (
    <div className={`flex items-end gap-0.5 h-4 ${className}`}>
      {Array.from({ length: barCount }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full bg-primary"
          animate={isPlaying ? {
            height: ['4px', `${8 + Math.random() * 10}px`, '4px'],
          } : { height: '4px' }}
          transition={{
            duration: 0.4 + Math.random() * 0.4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
}
