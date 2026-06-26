import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

export default function Contact() {
  const { user, signOut } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) { toast.error('Please fill in all fields'); return; }
    toast.success("Thanks — we'll get back to you within 24 hours.");
    setName(''); setEmail(''); setMessage('');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} onSignOut={signOut} />
      <main className="relative pt-32 pb-24">
        <div className="absolute inset-0 pv-gradient-bg-animated opacity-60 -z-10" />
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 grid lg:grid-cols-[1fr_1.2fr] gap-10 items-start">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-white/[0.04] border border-white/10 text-muted-foreground">
              <span className="w-1 h-1 rounded-full bg-accent" /> Contact
            </span>
            <h1 className="mt-5 font-display font-bold text-[clamp(32px,5vw,46px)] leading-tight tracking-tight">
              Let&apos;s talk.
            </h1>
            <p className="mt-4 text-muted-foreground">
              Questions, ideas, venue partnerships, or feedback — we read every message.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-10 h-10 rounded-xl bg-primary/15 ring-1 ring-primary/30 flex items-center justify-center">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Email</p>
                  <p className="font-medium">hello@partyvibe.app</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-10 h-10 rounded-xl bg-accent/15 ring-1 ring-accent/30 flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Support</p>
                  <p className="font-medium">Replies within 24 hours</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="pv-card p-7 sm:p-8 space-y-5"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-[13px] font-medium text-muted-foreground">Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name"
                  className="mt-2 bg-white/[0.03] border-white/10 min-h-[48px] rounded-xl" />
              </div>
              <div>
                <Label className="text-[13px] font-medium text-muted-foreground">Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                  className="mt-2 bg-white/[0.03] border-white/10 min-h-[48px] rounded-xl" />
              </div>
            </div>
            <div>
              <Label className="text-[13px] font-medium text-muted-foreground">Message</Label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                placeholder="What's on your mind?"
                className="mt-2 w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-sm placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none resize-none"
              />
            </div>
            <Button type="submit" className="w-full glow-cyan font-semibold py-3 min-h-[48px] rounded-xl">
              Send message <Send className="ml-2 h-4 w-4" />
            </Button>
          </motion.form>
        </div>
      </main>
    </div>
  );
}