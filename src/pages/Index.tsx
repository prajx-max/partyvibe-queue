import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Users, Zap, Radio, ArrowRight, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PartyBackground } from '@/components/PartyBackground';
import { Equalizer } from '@/components/Equalizer';
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
  { icon: 'bg-gradient-to-br from-[rgba(0,229,255,0.2)] to-[rgba(0,229,255,0.05)] border border-[rgba(0,229,255,0.25)]', hover: '' },
  { icon: 'bg-gradient-to-br from-[rgba(224,64,251,0.25)] to-[rgba(224,64,251,0.05)] border border-[rgba(224,64,251,0.3)]', hover: '' },
  { icon: 'bg-gradient-to-br from-[rgba(124,58,237,0.3)] to-[rgba(124,58,237,0.08)] border border-[rgba(124,58,237,0.35)]', hover: '' },
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
    <div className="relative min-h-screen overflow-hidden party-gradient-bg">
      <PartyBackground />

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-7">
        {/* Header */}
        <header className="flex items-center justify-between py-4 sm:py-5 border-b border-foreground/5">
          <div className="flex items-center gap-2">
            <img src={vibeJamLogo} alt="VibeJam logo" className="w-8 h-8 sm:w-9 sm:h-9 rounded-[10px]" />
            <span className="font-bold text-[15px] sm:text-[17px] tracking-tight">VibeJam</span>
            <Equalizer isPlaying barCount={5} className="ml-0.5" />
          </div>
          {user && (
            <button
              onClick={signOut}
              className="bg-transparent border border-foreground/10 rounded-lg px-3 sm:px-[18px] py-1.5 sm:py-2 text-muted-foreground text-sm
                hover:border-foreground/25 hover:text-foreground transition-all"
            >
              Sign Out
            </button>
          )}
        </header>

        {/* Hero */}
        <section className="text-center py-10 sm:py-20 pb-8 sm:pb-14">
          <div className="flex justify-center mb-4 sm:mb-6">
            <img src={vibeJamLogo} alt="VibeJam" className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl shadow-[0_0_40px_rgba(0,245,255,0.3)]" />
          </div>
          <h1 className="font-extrabold text-[clamp(36px,9vw,88px)] leading-none tracking-[-2px] sm:tracking-[-3px] mb-3 sm:mb-4">
            <span className="gradient-text">Vote</span>
            <span className="text-foreground/15">.</span>{' '}
            <span className="gradient-text-accent">Play</span>
            <span className="text-foreground/15">.</span>{' '}
            <span className="gradient-text">Party</span>
            <span className="text-foreground/15">.</span>
          </h1>
          <p className="text-base sm:text-xl font-bold gradient-text-accent mb-1 sm:mb-2">
            The crowd is the DJ.
          </p>
          <p className="text-[14px] sm:text-[16px] text-muted-foreground max-w-[520px] mx-auto leading-[1.6] px-2">
            Create a session, share the QR code, and let your guests choose the music.
          </p>
        </section>

        {/* Features */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className={`group relative flex flex-col items-center p-3 sm:p-7 rounded-[14px] sm:rounded-[18px] glass-heavy overflow-hidden transition-all`}
            >
              <div className={`w-10 h-10 sm:w-[60px] sm:h-[60px] rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-[18px] ${featureColors[i].icon}`}>
                <feature.icon className="h-4 w-4 sm:h-[22px] sm:w-[22px]" style={{ color: i === 0 ? '#00e5ff' : i === 1 ? '#e040fb' : '#a78bfa' }} />
              </div>
              <h3 className="font-bold text-[12px] sm:text-[15px] mb-0.5 sm:mb-1.5 tracking-tight text-center">{feature.title}</h3>
              <p className="text-[11px] sm:text-[13px] text-muted-foreground text-center leading-relaxed hidden sm:block">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Action Panels */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-4 mb-16 sm:mb-28"
        >
          {/* Host Panel */}
          <motion.div
            variants={itemVariants}
            className="relative rounded-[18px] sm:rounded-[22px] glass-heavy p-5 sm:p-8 overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4 sm:mb-5">
                <Flame className="h-5 w-5 text-primary" />
                <h2 className="font-extrabold text-[18px] sm:text-[22px] tracking-tight">Host a Party</h2>
              </div>

              {authLoading ? (
                <div className="flex items-center justify-center py-8 sm:py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              ) : user ? (
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2 p-2 sm:p-2.5 px-3 rounded-[10px]"
                    style={{ background: 'rgba(0,229,255,0.05)', border: '1px solid rgba(0,229,255,0.12)' }}>
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow shrink-0" />
                    <span className="text-[12px] sm:text-[13px] text-primary font-medium truncate">{user.email}</span>
                  </div>
                  <div>
                    <Label className="text-[13px] font-semibold text-muted-foreground">Session Name</Label>
                    <Input
                      placeholder="My Awesome Party 🎉"
                      value={sessionName}
                      onChange={(e) => setSessionName(e.target.value)}
                      className="mt-1.5 sm:mt-2 bg-foreground/[0.04] border-foreground/[0.09] placeholder:text-muted-foreground/40
                        focus:border-primary/40 focus:bg-primary/5"
                    />
                  </div>
                  <Button onClick={createSession} disabled={isSubmitting} className="w-full glow-cyan font-semibold text-[14px] sm:text-[15px] py-3">
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
                        focus:border-primary/40 focus:bg-primary/5"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-[13px] font-semibold text-muted-foreground">Password</Label>
                    <Input
                      type="password" placeholder="••••••••"
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      className="mt-1.5 bg-foreground/[0.04] border-foreground/[0.09] placeholder:text-muted-foreground/40
                        focus:border-primary/40 focus:bg-primary/5"
                      required minLength={6}
                    />
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="w-full glow-cyan font-semibold text-[14px] sm:text-[15px] py-3">
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
            className="relative rounded-[18px] sm:rounded-[22px] glass-heavy p-5 sm:p-8 overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4 sm:mb-5">
                <Users className="h-5 w-5 text-accent" />
                <h2 className="font-extrabold text-[18px] sm:text-[22px] tracking-tight">Join a Party</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 sm:mb-5">
                Got a session code or QR link? Enter it below!
              </p>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <Label className="text-[13px] font-semibold text-muted-foreground">Session Code or Link</Label>
                  <Input
                    placeholder="Paste session link or ID"
                    value={joinCode} onChange={(e) => setJoinCode(e.target.value)}
                    className="mt-1.5 bg-foreground/[0.04] border-foreground/[0.09] placeholder:text-muted-foreground/40
                      focus:border-accent/40 focus:bg-accent/5"
                  />
                </div>
                <Button onClick={handleJoinSession} className="w-full glow-magenta font-semibold text-[14px] sm:text-[15px] py-3">
                  Join Session
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <footer className="text-center pb-6 sm:pb-8 text-xs text-muted-foreground/50">
          VibeJam — The crowd is the DJ.
        </footer>
      </div>
    </div>
  );
};

export default Index;
