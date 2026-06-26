import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  withWordmark?: boolean;
  size?: number;
}

/**
 * PartyVibe logo — minimalist "P" formed from a stylized waveform.
 * Flat, no gradients, scales cleanly, works on light + dark surfaces.
 * Uses currentColor for the accent strokes so it themes via parent.
 */
export function Logo({ className, withWordmark = false, size = 32 }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Rounded square mark */}
        <rect width="40" height="40" rx="11" fill="#6D28D9" />
        {/* Stylized P: vertical stem */}
        <rect x="11" y="10" width="3.2" height="20" rx="1.6" fill="white" />
        {/* P bowl as an arc */}
        <path
          d="M14.2 12 H22 a6 6 0 0 1 0 12 H14.2"
          stroke="white"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Waveform spark — accent */}
        <g stroke="#F97316" strokeWidth="2.2" strokeLinecap="round">
          <line x1="27" y1="22" x2="27" y2="26" />
          <line x1="30.5" y1="19" x2="30.5" y2="29" />
          <line x1="34" y1="22" x2="34" y2="26" />
        </g>
      </svg>
      {withWordmark && (
        <span className="font-display font-bold text-[1.05em] tracking-tight">
          PartyVibe
        </span>
      )}
    </span>
  );
}

export default Logo;