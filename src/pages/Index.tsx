import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Music, Disc3, Users, Play, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
    // Try to extract session ID from URL or use as-is
    const sessionId = joinCode.includes('/session/')
      ? joinCode.split('/session/')[1]
      : joinCode;
    navigate(`/session/${sessionId}`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -right-1/4 bottom-0 h-[600px] w-[600px] rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/10 blur-[100px]" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between p-6">
          <div className="flex items-center gap-2">
            <Disc3 className="h-8 w-8 text-primary animate-spin" style={{ animationDuration: '3s' }} />
            <span className="font-display text-xl font-bold">PartyVote DJ</span>
          </div>
          {user && (
            <Button variant="ghost" size="sm" onClick={signOut}>
              Sign Out
            </Button>
          )}
        </header>

        {/* Hero Section */}
        <main className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-4 tracking-tight">
              <span className="gradient-text">Vote. Play. Party.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Let your guests choose the music. Create a session, share the QR code, and watch the
              votes roll in while the top songs play automatically.
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto"
          >
            {[
              { icon: Users, title: 'Crowd-Powered', desc: 'Guests vote on their phones' },
              { icon: Music, title: 'Real-Time Queue', desc: 'Top voted songs play next' },
              { icon: Play, title: 'Easy Hosting', desc: 'Connect and hit play' },
            ].map((feature, i) => (
              <div
                key={i}
                className="flex flex-col items-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border"
              >
                <feature.icon className="h-10 w-10 text-primary mb-3" />
                <h3 className="font-display font-semibold text-lg mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground text-center">{feature.desc}</p>
              </div>
            ))}
          </motion.div>

          {/* Auth / Create Session Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            {/* Host Card */}
            <div className="rounded-2xl bg-card p-8 border border-border">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="h-5 w-5 text-primary" />
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
                      placeholder="My Awesome Party"
                      value={sessionName}
                      onChange={(e) => setSessionName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <Button
                    onClick={createSession}
                    disabled={isSubmitting}
                    className="w-full glow-cyan"
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
                      className="mt-1"
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
                      className="mt-1"
                      required
                      minLength={6}
                    />
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="w-full glow-cyan">
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </Button>
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-sm text-muted-foreground hover:text-primary w-full text-center"
                  >
                    {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                  </button>
                </form>
              )}
            </div>

            {/* Guest Card */}
            <div className="rounded-2xl bg-card p-8 border border-border">
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
                    className="mt-1"
                  />
                </div>
                <Button onClick={handleJoinSession} variant="secondary" className="w-full">
                  Join Session
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="text-center py-8 text-sm text-muted-foreground">
          <p>Made for parties 🎉</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
