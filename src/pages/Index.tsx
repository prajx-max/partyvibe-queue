import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Disc3, Users, Zap, Radio, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PartyBackground } from '@/components/PartyBackground';
import { Equalizer } from '@/components/Equalizer';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

// Card tilt hook
function useCardTilt() {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width;
    const dy = (e.clientY - cy) / rect.height;
    el.style.transform = `perspective(800px) rotateX(${-dy * 8}deg) rotateY(${dx * 8}deg) translateY(-4px) scale(1.02)`;
    el.style.transition = 'transform 0.08s ease, border-color 0.35s ease, box-shadow 0.35s ease';
  }, []);

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = '';
    el.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1), border-color 0.35s ease, box-shadow 0.35s ease';
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}

const featureColors = [
  { icon: 'bg-gradient-to-br from-[rgba(0,229,255,0.2)] to-[rgba(0,229,255,0.05)] border border-[rgba(0,229,255,0.25)] shadow-[0_8px_24px_rgba(0,229,255,0.12),inset_0_1px_0_rgba(255,255,255,0.1)]', hover: 'hover:shadow-[0_24px_48px_rgba(0,229,255,0.1),0_0_0_1px_rgba(0,229,255,0.2),0_0_80px_rgba(0,229,255,0.05)]' },
  { icon: 'bg-gradient-to-br from-[rgba(224,64,251,0.25)] to-[rgba(224,64,251,0.05)] border border-[rgba(224,64,251,0.3)] shadow-[0_8px_24px_rgba(224,64,251,0.15),inset_0_1px_0_rgba(255,255,255,0.1)]', hover: 'hover:shadow-[0_24px_48px_rgba(224,64,251,0.1),0_0_0_1px_rgba(224,64,251,0.2),0_0_80px_rgba(224,64,251,0.05)]' },
  { icon: 'bg-gradient-to-br from-[rgba(124,58,237,0.3)] to-[rgba(124,58,237,0.08)] border border-[rgba(124,58,237,0.35)] shadow-[0_8px_24px_rgba(124,58,237,0.18),inset_0_1px_0_rgba(255,255,255,0.1)]', hover: 'hover:shadow-[0_24px_48px_rgba(124,58,237,0.12),0_0_0_1px_rgba(124,58,237,0.25),0_0_80px_rgba(124,58,237,0.06)]' },
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

  const hostTilt = useCardTilt();
  const joinTilt = useCardTilt();
  const featTilts = [useCardTilt(), useCardTilt(), useCardTilt()];

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { error } = isLogin ? await signIn(email, password) : await signUp(email, password);
    if (error) toast.error(error.message);
    else if (!isLogin) toast.success('Account created! You can now create sessions.');
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
    { icon: Users, title: 'Crowd-Powered', desc: 'Guests vote on their phones' },
    { icon: Zap, title: 'Real-Time Queue', desc: 'Top voted songs play next' },
    { icon: Radio, title: 'Easy Hosting', desc: 'Connect and hit play' },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden party-gradient-bg">
      <PartyBackground />

      <div className="relative z-10 max-w-[1200px] mx-auto px-7">
        {/* Header */}
        <header className="flex items-center justify-between py-5 border-b border-foreground/5 animate-fade-in">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[10px] flex items-center justify-center animate-pulse-glow"
              style={{
                background: 'linear-gradient(135deg, rgba(0,229,255,0.2), rgba(0,229,255,0.05))',
                border: '1px solid rgba(0,229,255,0.3)',
                boxShadow: '0 0 16px rgba(0,229,255,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}>
              <Disc3 className="h-[18px] w-[18px] text-primary" />
            </div>
            <span className="font-bold text-[17px] tracking-tight">PartyVote DJ</span>
            <Equalizer isPlaying barCount={5} className="ml-0.5" />
          </div>
          {user && (
            <button
              onClick={signOut}
              className="bg-transparent border border-foreground/10 rounded-lg px-[18px] py-2 text-muted-foreground text-sm
                hover:border-foreground/25 hover:text-foreground hover:bg-foreground/5 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all duration-250"
            >
              Sign Out
            </button>
          )}
        </header>

        {/* Hero */}
        <section className="text-center py-20 pb-14">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-extrabold text-[clamp(60px,10vw,96px)] leading-none tracking-[-3px] mb-7"
          >
            <span className="gradient-text">Vote</span>
            <span className="text-foreground/15">.</span>{' '}
            <span className="gradient-text-accent">Play</span>
            <span className="text-foreground/15">.</span>{' '}
            <span className="gradient-text">Party</span>
            <span className="text-foreground/15">.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[17px] text-[#8b95a8] max-w-[520px] mx-auto leading-[1.7] font-normal"
          >
            Let your guests choose the music. Create a session, share the QR code, and watch the
            votes roll in while the top songs play automatically.
          </motion.p>
        </section>

        {/* Features */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-3 gap-4 mb-6"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              ref={featTilts[i].ref}
              onMouseMove={featTilts[i].onMouseMove}
              onMouseLeave={featTilts[i].onMouseLeave}
              className={`group relative flex flex-col items-center p-7 rounded-[18px] glass-heavy feat-card-highlight feat-card-glow cursor-default overflow-hidden
                transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.01] hover:border-foreground/15 ${featureColors[i].hover}`}
            >
              <div className="feat-shimmer" />
              <div className={`w-[60px] h-[60px] rounded-2xl flex items-center justify-center mb-[18px] transition-transform duration-300 group-hover:scale-115 group-hover:-rotate-[5deg] ${featureColors[i].icon}`}>
                <feature.icon className="h-[22px] w-[22px]" style={{ color: i === 0 ? '#00e5ff' : i === 1 ? '#e040fb' : '#a78bfa' }} />
              </div>
              <h3 className="font-bold text-[15px] mb-1.5 tracking-tight">{feature.title}</h3>
              <p className="text-[13px] text-[#606880] text-center leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Action Panels */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-4 mb-28"
        >
          {/* Host Panel */}
          <motion.div
            variants={itemVariants}
            ref={hostTilt.ref}
            onMouseMove={hostTilt.onMouseMove}
            onMouseLeave={hostTilt.onMouseLeave}
            className="relative rounded-[22px] glass-heavy p-8 overflow-hidden border-[rgba(0,229,255,0.12)]
              hover:border-[rgba(0,229,255,0.3)] hover:shadow-[0_0_80px_rgba(0,229,255,0.08),0_20px_40px_rgba(0,0,0,0.2),inset_0_0_60px_rgba(0,229,255,0.02)] transition-all duration-300"
          >
            {/* Floating orb */}
            <div className="absolute -top-20 -left-20 w-[250px] h-[250px] rounded-full pointer-events-none animate-float"
              style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.1), transparent 70%)' }} />

            <div className="relative z-10">
              <div className="flex items-center gap-2.5 mb-5">
                <span className="text-xl">✦</span>
                <h2 className="font-extrabold text-[22px] tracking-tight">Host a Party</h2>
              </div>

              {authLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Disc3 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-2.5 px-3.5 rounded-[10px]"
                    style={{ background: 'rgba(0,229,255,0.05)', border: '1px solid rgba(0,229,255,0.12)' }}>
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow shrink-0"
                      style={{ boxShadow: '0 0 8px hsl(var(--primary)), 0 0 20px hsl(var(--primary))' }} />
                    <span className="text-[13px] text-[#7dd3e0] font-medium">Logged in as {user.email}</span>
                  </div>
                  <div>
                    <Label className="text-[13px] font-semibold text-[#8b95a8] tracking-wide">Session Name</Label>
                    <Input
                      placeholder="My Awesome Party 🎉"
                      value={sessionName}
                      onChange={(e) => setSessionName(e.target.value)}
                      className="mt-2 bg-foreground/[0.04] border-foreground/[0.09] text-foreground placeholder:text-[#3d4555]
                        focus:border-[rgba(0,229,255,0.4)] focus:bg-[rgba(0,229,255,0.05)] focus:shadow-[0_0_0_3px_rgba(0,229,255,0.1),0_0_30px_rgba(0,229,255,0.08)]"
                    />
                  </div>
                  <Button onClick={createSession} disabled={isSubmitting} className="w-full glow-cyan font-semibold text-[15px] py-3.5">
                    Create Session
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleAuth} className="space-y-4">
                  <div>
                    <Label className="text-[13px] font-semibold text-[#8b95a8] tracking-wide">Email</Label>
                    <Input
                      type="email" placeholder="you@example.com"
                      value={email} onChange={(e) => setEmail(e.target.value)}
                      className="mt-2 bg-foreground/[0.04] border-foreground/[0.09] placeholder:text-[#3d4555]
                        focus:border-[rgba(0,229,255,0.4)] focus:bg-[rgba(0,229,255,0.05)] focus:shadow-[0_0_0_3px_rgba(0,229,255,0.1),0_0_30px_rgba(0,229,255,0.08)]"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-[13px] font-semibold text-[#8b95a8] tracking-wide">Password</Label>
                    <Input
                      type="password" placeholder="••••••••"
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      className="mt-2 bg-foreground/[0.04] border-foreground/[0.09] placeholder:text-[#3d4555]
                        focus:border-[rgba(0,229,255,0.4)] focus:bg-[rgba(0,229,255,0.05)] focus:shadow-[0_0_0_3px_rgba(0,229,255,0.1),0_0_30px_rgba(0,229,255,0.08)]"
                      required minLength={6}
                    />
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="w-full glow-cyan font-semibold text-[15px] py-3.5">
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <button
                    type="button" onClick={() => setIsLogin(!isLogin)}
                    className="text-sm text-muted-foreground hover:text-primary w-full text-center transition-colors"
                  >
                    {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Join Panel */}
          <motion.div
            variants={itemVariants}
            ref={joinTilt.ref}
            onMouseMove={joinTilt.onMouseMove}
            onMouseLeave={joinTilt.onMouseLeave}
            className="relative rounded-[22px] glass-heavy p-8 overflow-hidden border-[rgba(224,64,251,0.12)]
              hover:border-[rgba(224,64,251,0.3)] hover:shadow-[0_0_80px_rgba(224,64,251,0.08),0_20px_40px_rgba(0,0,0,0.2),inset_0_0_60px_rgba(224,64,251,0.02)] transition-all duration-300"
          >
            {/* Floating orb */}
            <div className="absolute -top-20 -right-20 w-[250px] h-[250px] rounded-full pointer-events-none animate-float"
              style={{ background: 'radial-gradient(circle, rgba(224,64,251,0.1), transparent 70%)', animationDelay: '1s' }} />

            <div className="relative z-10">
              <div className="flex items-center gap-2.5 mb-5">
                <Users className="h-5 w-5 text-accent" />
                <h2 className="font-extrabold text-[22px] tracking-tight">Join a Party</h2>
              </div>
              <p className="text-sm text-[#606880] leading-relaxed mb-5">
                Got a session code or QR link? Enter it below to start voting on songs!
              </p>
              <div className="space-y-4">
                <div>
                  <Label className="text-[13px] font-semibold text-[#8b95a8] tracking-wide">Session Code or Link</Label>
                  <Input
                    placeholder="Paste session link or ID"
                    value={joinCode} onChange={(e) => setJoinCode(e.target.value)}
                    className="mt-2 bg-foreground/[0.04] border-foreground/[0.09] placeholder:text-[#3d4555]
                      focus:border-[rgba(224,64,251,0.4)] focus:bg-[rgba(224,64,251,0.04)] focus:shadow-[0_0_0_3px_rgba(224,64,251,0.1),0_0_30px_rgba(224,64,251,0.08)]"
                  />
                </div>
                <Button onClick={handleJoinSession} className="w-full glow-magenta font-semibold text-[15px] py-3.5">
                  Join Session
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
