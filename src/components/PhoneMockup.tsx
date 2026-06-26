import { Music, Users, QrCode } from 'lucide-react';
import { Logo } from '@/components/Logo';

/**
 * Animated product mockup of the live PartyVibe session UI.
 * Pure presentational — no real data, just a faithful preview.
 */
export function PhoneMockup() {
  const queue = [
    { title: 'Sunflower', artist: 'Post Malone, Swae Lee', votes: 42, hot: true },
    { title: 'Blinding Lights', artist: 'The Weeknd', votes: 36 },
    { title: 'As It Was', artist: 'Harry Styles', votes: 29 },
    { title: 'Levitating', artist: 'Dua Lipa', votes: 22 },
    { title: 'Starboy', artist: 'The Weeknd', votes: 17 },
  ];

  return (
    <div className="relative mx-auto w-full max-w-[360px]">
      {/* Ambient glow */}
      <div className="absolute -inset-10 bg-primary/25 blur-[80px] rounded-full -z-10" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/25 blur-[60px] rounded-full -z-10" />

      {/* Phone frame */}
      <div className="relative rounded-[42px] bg-[#0a0a0f] p-3 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.08)] ring-1 ring-white/10">
        {/* Screen */}
        <div className="rounded-[32px] overflow-hidden bg-gradient-to-b from-[#14141B] to-[#0B0B0F] border border-white/5">
          {/* Status bar */}
          <div className="flex items-center justify-between px-5 pt-3 pb-1 text-[10px] text-white/70">
            <span>9:41</span>
            <span className="flex gap-1">
              <span className="w-1 h-1 rounded-full bg-white/80" />
              <span className="w-1 h-1 rounded-full bg-white/80" />
              <span className="w-1 h-1 rounded-full bg-white/80" />
            </span>
          </div>

          {/* Header */}
          <div className="px-4 pt-2 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Logo size={22} />
              <div>
                <p className="text-[11px] text-white/50 leading-none">Live session</p>
                <p className="text-xs font-semibold leading-tight mt-0.5">Rooftop Vol. 3</p>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#22C55E]/15 text-[#4ade80] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
              LIVE
            </span>
          </div>

          {/* Now playing */}
          <div className="mx-4 mb-3 p-3 rounded-2xl bg-gradient-to-br from-primary/25 via-secondary/20 to-accent/15 border border-white/10">
            <p className="text-[9px] uppercase tracking-wider text-white/60 font-semibold mb-2">Now Playing</p>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-secondary to-accent flex items-center justify-center shrink-0">
                <Music className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">Sunflower</p>
                <p className="text-[11px] text-white/60 truncate">Post Malone, Swae Lee</p>
              </div>
              <div className="flex items-end gap-[2px] h-5">
                {[0.5, 0.9, 0.7, 1, 0.6].map((h, i) => (
                  <span
                    key={i}
                    className="w-[3px] rounded-full bg-white equalizer-bar"
                    style={{ animationDelay: `${i * 0.1}s`, animationDuration: `${0.5 + h * 0.5}s` }}
                  />
                ))}
              </div>
            </div>
            <div className="mt-2.5 h-1 rounded-full bg-white/15 overflow-hidden">
              <div className="h-full w-2/5 rounded-full bg-white" />
            </div>
          </div>

          {/* QR + Guests row */}
          <div className="mx-4 mb-3 grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center">
                <QrCode className="h-4 w-4 text-[#0B0B0F]" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-white/50">Scan to join</p>
                <p className="text-[11px] font-semibold truncate">partyvibe.app/r3</p>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-accent/15 flex items-center justify-center">
                <Users className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="text-[10px] text-white/50">Guests</p>
                <p className="text-[11px] font-semibold">38 online</p>
              </div>
            </div>
          </div>

          {/* Top voted */}
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-semibold">Top voted</p>
              <p className="text-[10px] text-white/40">{queue.length} in queue</p>
            </div>
            <div className="space-y-1.5">
              {queue.map((s, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2.5 p-2 rounded-lg border ${
                    s.hot ? 'bg-primary/10 border-primary/30' : 'bg-white/[0.03] border-white/[0.06]'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full text-[10px] flex items-center justify-center bg-white/10 text-white/70 font-bold">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium truncate">{s.title}</p>
                    <p className="text-[10px] text-white/45 truncate">{s.artist}</p>
                  </div>
                  <span className={`text-[10px] font-bold ${s.hot ? 'text-accent' : 'text-white/60'}`}>
                    🔥 {s.votes}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhoneMockup;