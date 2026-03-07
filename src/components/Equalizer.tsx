interface EqualizerProps {
  isPlaying?: boolean;
  className?: string;
  barCount?: number;
}

export function Equalizer({ isPlaying = true, className = '', barCount = 4 }: EqualizerProps) {
  return (
    <div className={`flex items-end gap-0.5 h-4 ${className}`}>
      {Array.from({ length: barCount }).map((_, i) => (
        <div
          key={i}
          className="w-1 rounded-full bg-primary transition-all duration-300"
          style={{
            height: isPlaying ? undefined : '4px',
            animation: isPlaying ? `eq-bar 0.${4 + i}s ease-in-out ${i * 0.1}s infinite alternate` : 'none',
          }}
        />
      ))}
      <style>{`
        @keyframes eq-bar {
          from { height: 4px; }
          to { height: 14px; }
        }
      `}</style>
    </div>
  );
}
