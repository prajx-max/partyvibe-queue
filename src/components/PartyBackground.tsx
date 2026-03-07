export function PartyBackground() {
  return (
    <>
      {/* Ambient gradient orbs - pure CSS, no JS */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[120px] animate-float"
          style={{ top: '10%', left: '15%', background: 'radial-gradient(circle, rgba(0,229,255,0.4), transparent 70%)' }} />
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[100px] animate-float"
          style={{ top: '50%', right: '10%', background: 'radial-gradient(circle, rgba(224,64,251,0.35), transparent 70%)', animationDelay: '1.5s' }} />
        <div className="absolute w-[400px] h-[400px] rounded-full opacity-10 blur-[80px] animate-float"
          style={{ bottom: '10%', left: '40%', background: 'radial-gradient(circle, rgba(124,58,237,0.3), transparent 70%)', animationDelay: '3s' }} />
      </div>

      {/* Subtle grid */}
      <div className="fixed inset-0 z-[1] pointer-events-none opacity-30"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,229,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.02) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, transparent 100%)',
        }}
      />
    </>
  );
}
