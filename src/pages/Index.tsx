import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import {
  Users, Zap, ArrowRight, Play, QrCode, BarChart3, Lock, PartyPopper,
  ChevronDown, Star, Twitter, Instagram, Github, Linkedin, Smartphone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Navbar } from '@/components/Navbar';
import { Logo } from '@/components/Logo';
import { PhoneMockup } from '@/components/PhoneMockup';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

/* ----------------------------------------------------------------------- */
/* Animated counter                                                        */
/* ----------------------------------------------------------------------- */
function useCountUp(end: number, duration = 1500, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * end));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, duration, start]);
  return value;
}

function StatCard({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setInView(true), { threshold: 0.4 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  const n = useCountUp(value, 1600, inView);
  return (
    <div ref={ref} className="text-center">
      <p className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
        <span className="bg-clip-text text-transparent bg-gradient-to-br from-white to-white/70">
          {n.toLocaleString()}
        </span>
        <span className="text-primary">{suffix}</span>
      </p>
      <p className="text-sm text-muted-foreground mt-2">{label}</p>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/* Floating particles for the hero                                          */
/* ----------------------------------------------------------------------- */
function HeroParticles() {
  const particles = Array.from({ length: 18 });
  return (
    <div className="pv-particles">
      {particles.map((_, i) => (
        <span
          key={i}
          style={{
            left: `${(i * 53) % 100}%`,
            bottom: `-${(i * 7) % 40}px`,
            animationDuration: `${14 + (i % 6) * 3}s`,
            animationDelay: `${(i % 8) * 1.2}s`,
            background: i % 3 === 0 ? 'rgba(249, 115, 22, 0.55)' : 'rgba(168, 85, 247, 0.55)',
            boxShadow: i % 3 === 0 ? '0 0 20px 4px rgba(249,115,22,0.45)' : '0 0 20px 4px rgba(168,85,247,0.4)',
            width: `${4 + (i % 3) * 2}px`,
            height: `${4 + (i % 3) * 2}px`,
          }}
        />
      ))}
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/* Section primitives                                                      */
/* ----------------------------------------------------------------------- */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-white/[0.04] border border-white/10 text-muted-foreground">
      <span className="w-1 h-1 rounded-full bg-accent" />
      {children}
    </span>
  );
}

/* ----------------------------------------------------------------------- */
/* Page                                                                     */
/* ----------------------------------------------------------------------- */
const Index = () => {
  const { user, isLoading: authLoading, signIn, signUp, signOut } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sessionName, setSessionName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { error } = isLogin ? await signIn(email, password) : await signUp(email, password);
    if (error) toast.error(error.message);
    else if (!isLogin) toast.success('Account created! Check your email to verify.');
    setIsSubmitting(false);
  };

  const createSession = async () => {
    if (!sessionName.trim()) { toast.error('Please enter a session name'); return; }
    setIsSubmitting(true);
    const { data, error } = await supabase
      .from('sessions')
      .insert({ name: sessionName.trim(), host_id: user!.id })
      .select()
      .single();
    if (error) { toast.error('Failed to create session'); console.error(error); }
    else navigate(`/host/${data.id}`);
    setIsSubmitting(false);
  };

  const handleJoinSession = () => {
    if (!joinCode.trim()) { toast.error('Please enter a session code'); return; }
    const sessionId = joinCode.includes('/session/') ? joinCode.split('/session/')[1] : joinCode;
    navigate(`/session/${sessionId}`);
  };

  const features = [
    { icon: Users, title: 'Crowd Voting', desc: 'Everyone in the room votes on what plays next — the loudest demand wins.', color: 'text-primary', bg: 'bg-primary/10', ring: 'ring-primary/20' },
    { icon: QrCode, title: 'QR Code Joining', desc: 'Guests scan one code and they\'re in. No app installs, no friction.', color: 'text-secondary', bg: 'bg-secondary/10', ring: 'ring-secondary/20' },
    { icon: Zap, title: 'Real-Time Sync', desc: 'Votes, requests, and the live queue update instantly across every device.', color: 'text-accent', bg: 'bg-accent/10', ring: 'ring-accent/20' },
    { icon: PartyPopper, title: 'Unlimited Guests', desc: 'Whether it\'s a kitchen kickback or a club night, the room scales with you.', color: 'text-primary', bg: 'bg-primary/10', ring: 'ring-primary/20' },
    { icon: BarChart3, title: 'Party Analytics', desc: 'See top songs, peak moments and crowd activity after every event.', color: 'text-secondary', bg: 'bg-secondary/10', ring: 'ring-secondary/20' },
    { icon: Lock, title: 'Secure Sessions', desc: 'Hosts control voting locks, song removal and full session privacy.', color: 'text-accent', bg: 'bg-accent/10', ring: 'ring-accent/20' },
  ];

  const steps = [
    { n: 1, title: 'Create your party', desc: 'Spin up a session in seconds with a name and instant QR code.' },
    { n: 2, title: 'Share the QR code', desc: 'Drop it on a screen or send the link. Guests are in with one tap.' },
    { n: 3, title: 'Guests vote live', desc: 'Everyone requests and votes on tracks from their own phones.' },
    { n: 4, title: 'Music plays itself', desc: 'Top‑voted songs roll into the queue automatically. No DJ required.' },
  ];

  const partners = ['LUMEN CLUB', 'NEON LOUNGE', 'SUNSET CAFE', 'PULSE EVENTS', 'AURA STUDIO', 'NORTH DJS'];

  const testimonials = [
    { name: 'Maya Chen', role: 'Event Host, Brooklyn', quote: '“My guests literally fought to add songs. PartyVibe turned a chill dinner into a full‑on night.”', initial: 'M', tone: 'from-primary to-secondary' },
    { name: 'DJ Ravi', role: 'Resident DJ, Lumen', quote: '“It\'s the cleanest crowd‑request tool I\'ve used. The queue actually feels alive.”', initial: 'R', tone: 'from-secondary to-accent' },
    { name: 'Sofia Alvarez', role: 'Cafe Owner', quote: '“We replaced our static playlist with PartyVibe and customers stay 30% longer.”', initial: 'S', tone: 'from-accent to-primary' },
  ];

  const faqs = [
    { q: 'Do guests need to install an app?', a: 'No. PartyVibe runs entirely in the browser. Guests scan the QR code and they\'re in — no accounts, no installs, no app store.' },
    { q: 'Where does the music come from?', a: 'You can search a huge catalog of streaming tracks or upload your own MP3s. The host\'s device handles playback, so the room hears one synced stream.' },
    { q: 'Is it actually free?', a: 'Yes — the core experience (hosting parties, unlimited guests, voting, QR joining) is free. Paid tiers unlock analytics, branding and longer sessions.' },
    { q: 'How many people can join one party?', a: 'There\'s no hard cap. We\'ve tested rooms of hundreds of guests with real‑time votes streaming back to the host.' },
    { q: 'Can the host override the crowd?', a: 'Absolutely. Hosts can pin songs to the top, skip tracks, lock voting, or remove requests at any time.' },
    { q: 'Is my session private?', a: 'Yes. Only people with your QR code or share link can join, and you can lock voting whenever you want.' },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <Navbar user={user} onSignOut={signOut} />

      {/* ============================ HERO ============================ */}
      <section id="hero" className="relative pt-28 md:pt-36 pb-16 md:pb-24 overflow-hidden">
        {/* Subtle animated gradient bg */}
        <div className="absolute inset-0 pv-gradient-bg-animated" />
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 75%)',
          }}
        />
        <HeroParticles />

        <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-12 items-center">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp}>
              <SectionLabel>
                <Smartphone className="h-3 w-3" />
                Live now in 50+ cities
              </SectionLabel>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mt-5 font-display font-extrabold text-[clamp(38px,7vw,76px)] leading-[1.02] tracking-[-0.03em]"
            >
              The smartest way to run{' '}
              <span className="gradient-text">every party.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-5 max-w-[560px] text-[clamp(15px,1.8vw,18px)] text-muted-foreground leading-relaxed"
            >
              Create unforgettable parties where everyone helps build the perfect playlist in real time.
              Crowd voting, instant QR joining, and a live queue — all in one elegant app.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => document.querySelector('#host')?.scrollIntoView({ behavior: 'smooth' })}
                className="glow-cyan font-semibold px-6 py-3 min-h-[52px] rounded-xl text-base"
              >
                <Play className="mr-2 h-4 w-4 fill-current" />
                Start Party
              </Button>
              <Button
                variant="outline"
                onClick={() => document.querySelector('#join')?.scrollIntoView({ behavior: 'smooth' })}
                className="font-semibold px-6 py-3 min-h-[52px] rounded-xl text-base bg-white/[0.03] border-white/15 hover:bg-white/[0.06] hover:border-white/25"
              >
                Join with Code
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-8 flex items-center gap-5 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {['from-primary to-secondary', 'from-secondary to-accent', 'from-accent to-primary'].map((g, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full bg-gradient-to-br ${g} ring-2 ring-background`} />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-foreground">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
                  ))}
                  <span className="ml-1.5 font-semibold">4.9/5</span>
                </div>
                <p className="text-xs">From 2,400+ party hosts</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="relative"
          >
            <PhoneMockup />
          </motion.div>
        </div>
      </section>

      {/* ============================ TRUSTED BY ============================ */}
      <section className="relative py-10 border-y border-white/5 bg-card/30">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <p className="text-center text-xs uppercase tracking-[0.18em] text-muted-foreground mb-6">
            Trusted by clubs, cafés and event teams worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-60">
            {partners.map((p) => (
              <span
                key={p}
                className="font-display font-bold text-base sm:text-lg tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ FEATURES ============================ */}
      <section id="features" className="relative py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={stagger}
            className="text-center max-w-[680px] mx-auto mb-14"
          >
            <motion.div variants={fadeUp}><SectionLabel>Features</SectionLabel></motion.div>
            <motion.h2 variants={fadeUp} className="mt-5 font-display font-bold text-[clamp(28px,4.5vw,46px)] leading-tight tracking-tight">
              Everything you need to host an unforgettable night.
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-muted-foreground text-[clamp(14px,1.6vw,17px)]">
              Built for hosts who want the room to feel involved — without losing control of the music.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
          >
            {features.map((f, i) => (
              <motion.div key={i} variants={fadeUp} className="pv-card p-6 sm:p-7 group">
                <div className={`w-12 h-12 rounded-xl ${f.bg} ring-1 ${f.ring} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <f.icon className={`h-5 w-5 ${f.color}`} />
                </div>
                <h3 className="font-display font-bold text-lg mb-2 tracking-tight">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================ HOW IT WORKS ============================ */}
      <section id="how" className="relative py-20 md:py-28 bg-card/30 border-y border-white/5">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={stagger}
            className="text-center max-w-[680px] mx-auto mb-14"
          >
            <motion.div variants={fadeUp}><SectionLabel>How it works</SectionLabel></motion.div>
            <motion.h2 variants={fadeUp} className="mt-5 font-display font-bold text-[clamp(28px,4.5vw,46px)] leading-tight tracking-tight">
              Up and running in under a minute.
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
          >
            {steps.map((s) => (
              <motion.div key={s.n} variants={fadeUp} className="relative pv-card p-6 sm:p-7">
                <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center font-display font-bold text-base mb-4 ring-1 ring-primary/30">
                  {s.n}
                </div>
                <h3 className="font-display font-bold text-base mb-2 tracking-tight">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================ LIVE DEMO ============================ */}
      <section className="relative py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
            <motion.div variants={fadeUp}><SectionLabel>Live demo</SectionLabel></motion.div>
            <motion.h2 variants={fadeUp} className="mt-5 font-display font-bold text-[clamp(28px,4.5vw,46px)] leading-tight tracking-tight">
              A queue that actually feels alive.
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-muted-foreground text-[clamp(14px,1.6vw,17px)] leading-relaxed">
              Every vote reshuffles the queue in real time. Hosts see the room\'s energy.
              Guests see their picks rise to the top. Nobody fights for the aux.
            </motion.p>
            <motion.ul variants={fadeUp} className="mt-6 space-y-3 text-sm">
              {[
                'Live now playing with synced equalizer',
                'Top‑voted upcoming tracks',
                'One‑tap voting from any phone',
                'Host overrides for the perfect flow',
              ].map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                  <span className="text-muted-foreground">{line}</span>
                </li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <PhoneMockup />
          </motion.div>
        </div>
      </section>

      {/* ============================ TESTIMONIALS ============================ */}
      <section className="relative py-20 md:py-28 bg-card/30 border-y border-white/5">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={stagger}
            className="text-center max-w-[680px] mx-auto mb-14"
          >
            <motion.div variants={fadeUp}><SectionLabel>Loved by hosts</SectionLabel></motion.div>
            <motion.h2 variants={fadeUp} className="mt-5 font-display font-bold text-[clamp(28px,4.5vw,46px)] leading-tight tracking-tight">
              Real parties. Real stories.
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}
            className="grid md:grid-cols-3 gap-4 sm:gap-5"
          >
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={fadeUp} className="pv-card p-6 sm:p-7">
                <div className="flex items-center gap-1 mb-4 text-accent">
                  {Array.from({ length: 5 }).map((_, k) => (<Star key={k} className="h-3.5 w-3.5 fill-current" />))}
                </div>
                <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">{t.quote}</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.tone} flex items-center justify-center font-display font-bold text-sm`}>
                    {t.initial}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================ STATS ============================ */}
      <section className="relative py-20 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
            <StatCard value={100} suffix="K+" label="Parties hosted" />
            <StatCard value={1} suffix="M+" label="Votes cast" />
            <StatCard value={50} suffix="+" label="Cities" />
            <StatCard value={99} suffix="%" label="Uptime" />
          </div>
        </div>
      </section>

      {/* ============================ HOST / JOIN (functional) ============================ */}
      <section className="relative py-20 md:py-24 bg-card/30 border-y border-white/5">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-[680px] mx-auto mb-12">
            <SectionLabel>Get started</SectionLabel>
            <h2 className="mt-5 font-display font-bold text-[clamp(28px,4.5vw,46px)] leading-tight tracking-tight">
              Host a party or join one.
            </h2>
            <p className="mt-3 text-muted-foreground">Spin up a new session in seconds, or jump into an existing one with a code.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 max-w-[920px] mx-auto">
            {/* Host */}
            <motion.div
              id="host"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="pv-card p-6 sm:p-8"
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="w-9 h-9 rounded-lg bg-primary/15 ring-1 ring-primary/30 flex items-center justify-center">
                  <Play className="h-4 w-4 text-primary fill-current" />
                </div>
                <h3 className="font-display font-bold text-lg tracking-tight">Host a party</h3>
              </div>

              {authLoading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              ) : user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/[0.06] border border-primary/15">
                    <span className="w-2 h-2 rounded-full bg-[hsl(var(--success))]" />
                    <span className="text-sm truncate text-muted-foreground">Signed in as <span className="text-foreground font-medium">{user.email}</span></span>
                  </div>
                  <div>
                    <Label className="text-[13px] font-medium text-muted-foreground">Session name</Label>
                    <Input
                      placeholder="Rooftop Vol. 3"
                      value={sessionName}
                      onChange={(e) => setSessionName(e.target.value)}
                      className="mt-2 bg-white/[0.03] border-white/10 placeholder:text-muted-foreground/40 focus:border-primary/50 min-h-[48px] rounded-xl"
                    />
                  </div>
                  <Button onClick={createSession} disabled={isSubmitting} className="w-full glow-cyan font-semibold py-3 min-h-[48px] rounded-xl">
                    Create session <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleAuth} className="space-y-4">
                  <div>
                    <Label className="text-[13px] font-medium text-muted-foreground">Email</Label>
                    <Input
                      type="email" placeholder="you@example.com"
                      value={email} onChange={(e) => setEmail(e.target.value)}
                      className="mt-2 bg-white/[0.03] border-white/10 placeholder:text-muted-foreground/40 focus:border-primary/50 min-h-[48px] rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-[13px] font-medium text-muted-foreground">Password</Label>
                    <Input
                      type="password" placeholder="••••••••"
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      className="mt-2 bg-white/[0.03] border-white/10 placeholder:text-muted-foreground/40 focus:border-primary/50 min-h-[48px] rounded-xl"
                      required minLength={6}
                    />
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="w-full glow-cyan font-semibold py-3 min-h-[48px] rounded-xl">
                    {isLogin ? 'Sign in' : 'Create account'} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <button
                    type="button" onClick={() => setIsLogin(!isLogin)}
                    className="text-sm text-muted-foreground hover:text-primary w-full text-center transition-colors py-2"
                  >
                    {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Join */}
            <motion.div
              id="join"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="pv-card p-6 sm:p-8"
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="w-9 h-9 rounded-lg bg-accent/15 ring-1 ring-accent/30 flex items-center justify-center">
                  <Users className="h-4 w-4 text-accent" />
                </div>
                <h3 className="font-display font-bold text-lg tracking-tight">Join a party</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-5">Paste a session link or enter the code your host shared.</p>
              <div className="space-y-4">
                <div>
                  <Label className="text-[13px] font-medium text-muted-foreground">Session code or link</Label>
                  <Input
                    placeholder="partyvibe.app/session/..."
                    value={joinCode} onChange={(e) => setJoinCode(e.target.value)}
                    className="mt-2 bg-white/[0.03] border-white/10 placeholder:text-muted-foreground/40 focus:border-accent/50 min-h-[48px] rounded-xl"
                  />
                </div>
                <Button onClick={handleJoinSession} className="w-full glow-magenta font-semibold py-3 min-h-[48px] rounded-xl">
                  Join session <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================ FAQ ============================ */}
      <section className="relative py-20 md:py-28">
        <div className="max-w-[820px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <SectionLabel>FAQ</SectionLabel>
            <h2 className="mt-5 font-display font-bold text-[clamp(28px,4.5vw,46px)] leading-tight tracking-tight">
              Questions, answered.
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={i} className="pv-card overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left"
                    aria-expanded={open}
                  >
                    <span className="font-display font-semibold text-[15px] sm:text-base tracking-tight">{f.q}</span>
                    <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`grid transition-all duration-300 ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================ CTA banner ============================ */}
      <section className="relative py-20 md:py-24">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-primary/20 via-secondary/15 to-accent/15 p-10 sm:p-14 text-center">
            <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-primary/30 blur-[100px]" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-accent/30 blur-[100px]" />
            <div className="relative">
              <h2 className="font-display font-bold text-[clamp(28px,4.5vw,44px)] leading-tight tracking-tight max-w-[640px] mx-auto">
                Ready to let the room pick the music?
              </h2>
              <p className="mt-4 text-muted-foreground max-w-[520px] mx-auto">Spin up your first party in under a minute. Free forever for hosts.</p>
              <Button
                onClick={() => document.querySelector('#host')?.scrollIntoView({ behavior: 'smooth' })}
                className="mt-7 glow-cyan font-semibold px-7 py-3 min-h-[52px] rounded-xl text-base"
              >
                Start your party <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ FOOTER ============================ */}
      <footer className="relative border-t border-white/5 bg-card/40">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Logo size={28} />
              <span className="font-display font-bold text-base">PartyVibe</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-[340px] leading-relaxed">
              The smartest way to run every party. Crowd voting, instant QR joining, and a live queue — in one elegant app.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {[Twitter, Instagram, Github, Linkedin].map((Icon, i) => (
                <a key={i} href="#" aria-label="Social link"
                   className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/[0.08] transition">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3 font-semibold">Product</p>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="text-foreground/80 hover:text-foreground">Features</a></li>
              <li><a href="#how" className="text-foreground/80 hover:text-foreground">How it works</a></li>
              <li><a href="/pricing" className="text-foreground/80 hover:text-foreground">Pricing</a></li>
              <li><a href="#" className="text-foreground/80 hover:text-foreground">Download app</a></li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3 font-semibold">Company</p>
            <ul className="space-y-2 text-sm">
              <li><a href="/about" className="text-foreground/80 hover:text-foreground">About</a></li>
              <li><a href="/contact" className="text-foreground/80 hover:text-foreground">Contact</a></li>
              <li><a href="#" className="text-foreground/80 hover:text-foreground">Support</a></li>
              <li><a href="#" className="text-foreground/80 hover:text-foreground">Privacy</a></li>
              <li><a href="#" className="text-foreground/80 hover:text-foreground">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} PartyVibe. Built for people who refuse to fight over the aux.</p>
            <p>Made with ♥ for music lovers</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;