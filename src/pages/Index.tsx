import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Music, Disc3, Users, Play, ArrowRight, Sparkles, Zap, Radio } from 'lucide-react';
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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

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

    const { error } = isLogin
      ? await signIn(email, password)
      : await signUp(email, password);

    if (error) {
      toast.error(error.message);
    } else if (!isLogin) {
      toast.success('Account created! You can now create sessions.');
    }

    setIsSubmitting(false);
  };

  const createSession = async () => {
    if (!sessionName.trim()) {
      toast.error('Please enter a session name');
      return;
    }

    setIsSubmitting(true);

    const { data, error } = await supabase
      .from('sessions')
      .insert({
        name: sessionName.trim(),
        host_id: user!.id,
      })
      .select()
      .single();

    if (error) {
      toast.error('Failed to create session');
      console.error(error);
    } else {
      navigate(`/host/${data.id}`);
    }

    setIsSubmitting(false);
  };

  const handleJoinSession = () => {
    if (!joinCode.trim()) {
      toast.error('Please enter a session code');
      return;
    }
    const sessionId = joinCode.includes('/session/')
      ? joinCode.split('/session/')[1]
      : joinCode;
    navigate(`/session/${sessionId}`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden party-gradient-bg">
      <PartyBackground />

      <div className="relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between p-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="relative">
              <Disc3 className="h-9 w-9 text-primary animate-spin" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-0 h-9 w-9 rounded-full bg-primary/20 blur-md" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight">PartyVote DJ</span>
            <Equalizer isPlaying className="ml-1" />
          </motion.div>
          {user && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Button variant="ghost" size="sm" onClick={signOut} className="text-muted-foreground hover:text-foreground">
                Sign Out
              </Button>
            </motion.div>
          )}
        </header>

        {/* Hero Section */}
        <main className="container mx-auto px-4 py-12">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-16"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-block"
              >
                <h1 className="font-display text-6xl md:text-8xl font-bold tracking-tighter">
                  <span className="gradient-text">Vote.</span>{' '}
                  <span className="gradient-text-accent">Play.</span>{' '}
                  <span className="gradient-text">Party.</span>
                </h1>
              </motion.div>
            </motion.div>
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Let your guests choose the music. Create a session, share the QR code, and watch the
              votes roll in while the top songs play automatically.
            </motion.p>
          </motion.div>

          {/* Features */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-3 gap-5 mb-16 max-w-4xl mx-auto"
          >
            {[
              { icon: Users, title: 'Crowd-Powered', desc: 'Guests vote on their phones', color: 'primary' },
              { icon: Zap, title: 'Real-Time Queue', desc: 'Top voted songs play next', color: 'accent' },
              { icon: Radio, title: 'Easy Hosting', desc: 'Connect and hit play', color: 'secondary' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="group flex flex-col items-center p-6 rounded-2xl glass-heavy transition-all hover:neon-border cursor-default"
              >
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                  className={`p-3 rounded-xl bg-${feature.color}/10 mb-4`}
                >
                  <feature.icon className={`h-8 w-8 text-${feature.color}`} />
                </motion.div>
                <h3 className="font-display font-semibold text-lg mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground text-center">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Auth / Create Session Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            {/* Host Card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="relative rounded-2xl glass-heavy p-8 overflow-hidden group"
            >
              {/* Glow accent */}
              <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl group-hover:bg-primary/20 transition-all duration-700" />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}>
                    <Sparkles className="h-5 w-5 text-primary" />
                  </motion.div>
                  <h2 className="font-display text-2xl font-bold">Host a Party</h2>
                </div>

                {authLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Disc3 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : user ? (
                  <div className="space-y-4">
                    <p className="text-muted-foreground text-sm mb-4">
                      Logged in as {user.email}
                    </p>
                    <div>
                      <Label htmlFor="session-name">Session Name</Label>
                      <Input
                        id="session-name"
                        placeholder="My Awesome Party 🎉"
                        value={sessionName}
                        onChange={(e) => setSessionName(e.target.value)}
                        className="mt-1 bg-muted/50 border-border/50 focus:border-primary"
                      />
                    </div>
                    <Button
                      onClick={createSession}
                      disabled={isSubmitting}
                      className="w-full glow-cyan font-semibold"
                    >
                      Create Session
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleAuth} className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 bg-muted/50 border-border/50 focus:border-primary"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 bg-muted/50 border-border/50 focus:border-primary"
                        required
                        minLength={6}
                      />
                    </div>
                    <Button type="submit" disabled={isSubmitting} className="w-full glow-cyan font-semibold">
                      {isLogin ? 'Sign In' : 'Create Account'}
                    </Button>
                    <button
                      type="button"
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-sm text-muted-foreground hover:text-primary w-full text-center transition-colors"
                    >
                      {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Guest Card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="relative rounded-2xl glass-heavy p-8 overflow-hidden group"
            >
              {/* Glow accent */}
              <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-accent/10 blur-3xl group-hover:bg-accent/20 transition-all duration-700" />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <Users className="h-5 w-5 text-accent" />
                  <h2 className="font-display text-2xl font-bold">Join a Party</h2>
                </div>
                <p className="text-muted-foreground mb-6">
                  Got a session code or QR link? Enter it below to start voting on songs!
                </p>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="join-code">Session Code or Link</Label>
                    <Input
                      id="join-code"
                      placeholder="Paste session link or ID"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                      className="mt-1 bg-muted/50 border-border/50 focus:border-accent"
                    />
                  </div>
                  <Button onClick={handleJoinSession} variant="secondary" className="w-full font-semibold glow-magenta">
                    Join Session
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="text-center py-8 text-sm text-muted-foreground">
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Made for parties 🎉
          </motion.p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
