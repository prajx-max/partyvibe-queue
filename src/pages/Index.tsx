import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Users, Zap, Radio, ArrowRight, Flame, Sparkles, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PartyBackground } from '@/components/PartyBackground';
import { Equalizer } from '@/components/Equalizer';
import { Navbar } from '@/components/Navbar';
import vibeJamLogo from '@/assets/vibejam-logo.png';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const featureColors = [
  { icon: 'bg-gradient-to-br from-[rgba(0,229,255,0.2)] to-[rgba(0,229,255,0.05)] border border-[rgba(0,229,255,0.25)]' },
  { icon: 'bg-gradient-to-br from-[rgba(224,64,251,0.25)] to-[rgba(224,64,251,0.05)] border border-[rgba(224,64,251,0.3)]' },
  { icon: 'bg-gradient-to-br from-[rgba(124,58,237,0.3)] to-[rgba(124,58,237,0.08)] border border-[rgba(124,58,237,0.35)]' },
];

const Index = () => {
  const { user, isLoading: authLoading, signIn, signUp, signOut } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sessionName, setSessionName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [joinCode, setJoinCode] = useState('');

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
    { icon: Users, title: 'Crowd-Powered', desc: 'Guests vote on their phones.' },
    { icon: Zap, title: 'Real-Time Queue', desc: 'Top voted songs play next.' },
    { icon: Radio, title: 'Easy Hosting', desc: 'Share QR and hit play.' },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden party-gradient-bg scroll-smooth">
      <PartyBackground />
      <Navbar user={user} onSignOut={signOut} />

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 pt-14 md:pt-16">
        {/* Hero */}
        <section id="hero" className="relative text-center pt-10 sm:pt-20 md:pt-24 pb-8 sm:pb-14 md:pb-16">
          {/* Eyebrow chip */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full mb-5 sm:mb-7 text-[11px] sm:text-xs font-semibold tracking-wide uppercase glass-heavy border border-primary/20"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary">
              Live · Real-time · Crowd-Powered
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="flex justify-center mb-4 sm:mb-6 relative"
          >
            <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
              <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-primary/20 blur-3xl animate-pulse-glow" />
            </div>
            <img
              src={vibeJamLogo}
              alt="BeatBaaja"
              className="relative w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl shadow-[0_0_60px_rgba(0,229,255,0.45)] ring-1 ring-white/10"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-extrabold text-[clamp(36px,9vw,104px)] leading-[0.95] tracking-[-1px] sm:tracking-[-2px] md:tracking-[-4px] mb-3 sm:mb-5"
          >
            <span className="gradient-text">Vote</span>
            <span className="text-foreground/15">.</span>{' '}
            <span className="gradient-text-accent">Play</span>
            <span className="text-foreground/15">.</span>{' '}
            <span className="gradient-text">Party</span>
            <span className="text-primary">.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="text-[clamp(15px,2.6vw,22px)] font-bold gradient-text-accent mb-2"
          >
            The crowd is the DJ.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="text-[clamp(13px,2vw,17px)] text-muted-foreground max-w-[560px] mx-auto leading-relaxed px-2 mb-7 sm:mb-9"
          >
            Spin up a session, drop a QR code, and let every phone in the room shape the night.
          </motion.p>

          {/* Dual CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8 sm:mb-12"
          >
            <Button
              onClick={() => document.querySelector('#host')?.scrollIntoView({ behavior: 'smooth' })}
              className="glow-cyan font-semibold text-sm sm:text-base px-6 py-3 min-h-[48px] w-full sm:w-auto"
            >
              <Play className="mr-2 h-4 w-4 fill-current" />
              Start a Party
            </Button>
            <Button
              variant="outline"
              onClick={() => document.querySelector('#join')?.scrollIntoView({ behavior: 'smooth' })}
              className="font-semibold text-sm sm:text-base px-6 py-3 min-h-[48px] w-full sm:w-auto bg-foreground/[0.03] border-foreground/15 hover:bg-foreground/[0.06] hover:border-primary/40"
            >
              Join with Code
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>

          {/* Live visualizer accent */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-end justify-center gap-[3px] sm:gap-1 h-10 sm:h-14 mb-6 sm:mb-8"
            aria-hidden="true"
          >
            {Array.from({ length: 32 }).map((_, i) => (
              <div
                key={i}
                className="w-[3px] sm:w-[4px] rounded-full bg-gradient-to-t from-primary/80 via-secondary/80 to-accent/80 equalizer-bar"
                style={{
                  animationDelay: `${(i % 8) * 0.06}s`,
                  animationDuration: `${0.5 + (i % 6) * 0.13}s`,
                  opacity: 0.4 + ((Math.abs(16 - i)) / 16) * 0.6 * -1 + 0.7,
                }}
              />
            ))}
          </motion.div>

          {/* Social proof strip */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 sm:gap-x-8 gap-y-2 text-xs sm:text-sm text-muted-foreground/80">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1DB954] animate-pulse" />
              <span>Live now</span>
            </div>
            <div className="hidden sm:block w-px h-3 bg-border" />
            <div>No installs · works on any phone</div>
            <div className="hidden sm:block w-px h-3 bg-border" />
            <div>Real-time voting</div>
          </div>
        </section>

        {/* Features */}
        <motion.div
          id="features"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 xs:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="group relative flex flex-row xs:flex-col items-center xs:items-center gap-3 xs:gap-0 p-4 sm:p-6 md:p-7 rounded-2xl glass-heavy overflow-hidden transition-all"
            >
              <div className={`w-11 h-11 sm:w-12 sm:h-12 md:w-[60px] md:h-[60px] rounded-xl md:rounded-2xl flex items-center justify-center xs:mb-3 md:mb-[18px] shrink-0 ${featureColors[i].icon}`}>
                <feature.icon className="h-5 w-5 md:h-[22px] md:w-[22px]" style={{ color: i === 0 ? '#00e5ff' : i === 1 ? '#e040fb' : '#a78bfa' }} />
              </div>
              <div className="xs:text-center">
                <h3 className="font-bold text-[clamp(13px,2vw,15px)] mb-0.5 sm:mb-1 tracking-tight">{feature.title}</h3>
                <p className="text-[clamp(12px,1.8vw,13px)] text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Action Panels */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-4 mb-12 sm:mb-20 md:mb-28"
        >
          {/* Host Panel */}
          <motion.div
            id="host"
            variants={itemVariants}
            className="relative rounded-2xl md:rounded-[22px] glass-heavy p-5 sm:p-6 md:p-8 overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4 sm:mb-5">
                <Flame className="h-5 w-5 text-primary" />
                <h2 className="font-extrabold text-[clamp(16px,3vw,22px)] tracking-tight">Host a Party</h2>
              </div>

              {authLoading ? (
                <div className="flex items-center justify-center py-8 sm:py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              ) : user ? (
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2 p-2.5 px-3 rounded-[10px]"
                    style={{ background: 'rgba(0,229,255,0.05)', border: '1px solid rgba(0,229,255,0.12)' }}>
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow shrink-0" />
                    <span className="text-[clamp(12px,2vw,13px)] text-primary font-medium truncate">{user.email}</span>
                  </div>
                  <div>
                    <Label className="text-[13px] font-semibold text-muted-foreground">Session Name</Label>
                    <Input
                      placeholder="My Awesome Party 🎉"
                      value={sessionName}
                      onChange={(e) => setSessionName(e.target.value)}
                      className="mt-1.5 bg-foreground/[0.04] border-foreground/[0.09] placeholder:text-muted-foreground/40
                        focus:border-primary/40 focus:bg-primary/5 min-h-[44px]"
                    />
                  </div>
                  <Button onClick={createSession} disabled={isSubmitting} className="w-full glow-cyan font-semibold text-[clamp(13px,2vw,15px)] py-3 min-h-[44px]">
                    Create Session
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleAuth} className="space-y-3 sm:space-y-4">
                  <div>
                    <Label className="text-[13px] font-semibold text-muted-foreground">Email</Label>
                    <Input
                      type="email" placeholder="you@example.com"
                      value={email} onChange={(e) => setEmail(e.target.value)}
                      className="mt-1.5 bg-foreground/[0.04] border-foreground/[0.09] placeholder:text-muted-foreground/40
                        focus:border-primary/40 focus:bg-primary/5 min-h-[44px]"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-[13px] font-semibold text-muted-foreground">Password</Label>
                    <Input
                      type="password" placeholder="••••••••"
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      className="mt-1.5 bg-foreground/[0.04] border-foreground/[0.09] placeholder:text-muted-foreground/40
                        focus:border-primary/40 focus:bg-primary/5 min-h-[44px]"
                      required minLength={6}
                    />
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="w-full glow-cyan font-semibold text-[clamp(13px,2vw,15px)] py-3 min-h-[44px]">
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <button
                    type="button" onClick={() => setIsLogin(!isLogin)}
                    className="text-sm text-muted-foreground hover:text-primary w-full text-center transition-colors py-2 min-h-[44px]"
                  >
                    {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Join Panel */}
          <motion.div
            id="join"
            variants={itemVariants}
            className="relative rounded-2xl md:rounded-[22px] glass-heavy p-5 sm:p-6 md:p-8 overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4 sm:mb-5">
                <Users className="h-5 w-5 text-accent" />
                <h2 className="font-extrabold text-[clamp(16px,3vw,22px)] tracking-tight">Join a Party</h2>
              </div>
              <p className="text-[clamp(13px,2vw,15px)] text-muted-foreground leading-relaxed mb-4 sm:mb-5">
                Got a session code or QR link? Enter it below!
              </p>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <Label className="text-[13px] font-semibold text-muted-foreground">Session Code or Link</Label>
                  <Input
                    placeholder="Paste session link or ID"
                    value={joinCode} onChange={(e) => setJoinCode(e.target.value)}
                    className="mt-1.5 bg-foreground/[0.04] border-foreground/[0.09] placeholder:text-muted-foreground/40
                      focus:border-accent/40 focus:bg-accent/5 min-h-[44px]"
                  />
                </div>
                <Button onClick={handleJoinSession} className="w-full glow-magenta font-semibold text-[clamp(13px,2vw,15px)] py-3 min-h-[44px]">
                  Join Session
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <footer className="text-center pb-6 sm:pb-8 text-xs text-muted-foreground/50">
          BeatBaaja — The crowd is the DJ.
        </footer>
      </div>
    </div>
  );
};

export default Index;
