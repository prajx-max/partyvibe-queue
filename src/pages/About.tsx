import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { Logo } from '@/components/Logo';

export default function About() {
  const { user, signOut } = useAuth();
  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} onSignOut={signOut} />
      <main className="relative pt-32 pb-24">
        <div className="absolute inset-0 pv-gradient-bg-animated opacity-60 -z-10" />
        <div className="max-w-[820px] mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-white/[0.04] border border-white/10 text-muted-foreground">
              <span className="w-1 h-1 rounded-full bg-accent" /> About
            </span>
            <h1 className="mt-5 font-display font-bold text-[clamp(32px,5vw,52px)] leading-tight tracking-tight">
              We&apos;re building the soundtrack to <span className="gradient-text">every great night.</span>
            </h1>
            <p className="mt-5 text-muted-foreground leading-relaxed text-[clamp(15px,1.6vw,17px)]">
              PartyVibe started with a simple frustration — at every party, someone hijacks the aux. We wanted
              the room to decide. So we built a tool that turns every phone into a vote, every guest into a co‑DJ,
              and every host into a curator who still calls the shots.
            </p>
            <p className="mt-5 text-muted-foreground leading-relaxed text-[clamp(15px,1.6vw,17px)]">
              Today, PartyVibe powers hundreds of thousands of moments — kitchen kickbacks, rooftop sunsets,
              wedding after‑parties, club residencies, café sessions. Wherever people gather around music,
              we want it to feel like everyone helped pick the playlist.
            </p>

            <div className="mt-12 grid sm:grid-cols-3 gap-4">
              {[
                { k: 'Founded', v: '2024' },
                { k: 'Team', v: 'Distributed' },
                { k: 'HQ', v: 'On the dance floor' },
              ].map((x) => (
                <div key={x.k} className="pv-card p-5">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{x.k}</p>
                  <p className="mt-1.5 font-display font-bold text-base">{x.v}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 pv-card p-8 flex items-center gap-5">
              <Logo size={48} />
              <div>
                <p className="font-display font-bold text-lg">Our promise</p>
                <p className="text-sm text-muted-foreground mt-1">Always free for hosts. Always fast. Always built around the crowd.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}