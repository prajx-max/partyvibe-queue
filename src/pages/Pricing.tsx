import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';

const plans = [
  {
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    desc: 'For casual hosts and small gatherings.',
    features: ['Unlimited guests', 'Real‑time voting', 'QR code joining', '1 active session', 'Up to 2 hours per party'],
    cta: 'Start free',
    highlight: false,
  },
  {
    name: 'Host',
    price: { monthly: 12, yearly: 9 },
    desc: 'For regular hosts who want full control.',
    features: ['Everything in Free', 'Unlimited active sessions', 'Unlimited duration', 'Custom session branding', 'Host overrides & pin queue', 'Email support'],
    cta: 'Start 14‑day trial',
    highlight: true,
  },
  {
    name: 'Venue',
    price: { monthly: 49, yearly: 39 },
    desc: 'For clubs, cafés and event teams.',
    features: ['Everything in Host', 'Multi‑host accounts', 'Party analytics dashboard', 'Custom domain', 'Priority support', 'SLA & uptime guarantee'],
    cta: 'Contact sales',
    highlight: false,
  },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(true);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} onSignOut={signOut} />
      <main className="relative pt-32 pb-24">
        <div className="absolute inset-0 pv-gradient-bg-animated opacity-60 -z-10" />
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-[700px] mx-auto mb-12">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-white/[0.04] border border-white/10 text-muted-foreground">
              <span className="w-1 h-1 rounded-full bg-accent" /> Pricing
            </span>
            <h1 className="mt-5 font-display font-bold text-[clamp(32px,5vw,52px)] leading-tight tracking-tight">
              Simple pricing. <span className="gradient-text">Built for hosts.</span>
            </h1>
            <p className="mt-4 text-muted-foreground">Start free. Upgrade when your parties outgrow it.</p>

            <div className="mt-7 inline-flex items-center p-1 rounded-full bg-card border border-white/10">
              {(['Monthly', 'Yearly'] as const).map((label, i) => {
                const active = (i === 1) === yearly;
                return (
                  <button
                    key={label}
                    onClick={() => setYearly(i === 1)}
                    className={`relative px-5 py-2 text-sm rounded-full font-medium transition-colors ${active ? 'text-white bg-primary' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    {label}
                    {i === 1 && <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-accent/20 text-accent font-bold">−25%</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {plans.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`relative pv-card p-7 ${p.highlight ? 'ring-2 ring-primary/50' : ''}`}
              >
                {p.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary text-white">
                    Most popular
                  </span>
                )}
                <h3 className="font-display font-bold text-lg tracking-tight">{p.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{p.desc}</p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="font-display font-extrabold text-4xl">${yearly ? p.price.yearly : p.price.monthly}</span>
                  <span className="text-sm text-muted-foreground">/ month</span>
                </div>
                <Button
                  onClick={() => navigate('/')}
                  className={`mt-6 w-full rounded-xl font-semibold min-h-[48px] ${p.highlight ? 'glow-cyan' : 'bg-white/[0.04] hover:bg-white/[0.08] border border-white/10'}`}
                >
                  {p.cta} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <ul className="mt-6 space-y-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-[hsl(var(--success))] shrink-0 mt-0.5" />
                      <span className="text-foreground/90">{f}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}