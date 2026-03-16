import { motion } from 'framer-motion';
import { ChevronDown, Instagram, Youtube, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroBg from '@/assets/hero-bg.jpg';

const floatingNotes = ['♪', '♫', '♬', '♩', '♭', '♪', '♫', '♬'];

export function HeroSection() {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-[80vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden"
    >
      {/* Background image with parallax-like fixed attachment on desktop */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat md:bg-fixed"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(270,60%,8%,0.85)] via-[hsl(240,20%,5%,0.8)] to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-[hsl(270,60%,12%,0.4)] to-[hsl(185,80%,15%,0.2)]" />

      {/* Floating music notes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingNotes.map((note, i) => (
          <motion.span
            key={i}
            className="absolute text-primary/10 text-[clamp(20px,4vw,40px)] select-none"
            style={{
              left: `${10 + i * 12}%`,
              top: `${15 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.05, 0.15, 0.05],
              rotate: [-5, 5, -5],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.3,
            }}
          >
            {note}
          </motion.span>
        ))}
      </div>

      {/* Animated equalizer bars in background */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-[3px] h-24 opacity-[0.07] pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-[clamp(2px,0.5vw,4px)] bg-primary rounded-t-full"
            animate={{ height: ['8%', `${30 + Math.random() * 60}%`, '8%'] }}
            transition={{
              duration: 1 + Math.random(),
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.05,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 text-center w-full py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <h1 className="font-extrabold text-[clamp(36px,9vw,80px)] leading-[1.05] tracking-[-1px] sm:tracking-[-2px] md:tracking-[-3px] mb-4 sm:mb-6">
            <span className="gradient-text">Your Event</span>
            <span className="text-foreground/15">,</span>{' '}
            <br className="sm:hidden" />
            <span className="gradient-text-accent">Our Beat</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
          className="text-[clamp(14px,2.5vw,20px)] text-foreground/70 max-w-[640px] mx-auto leading-relaxed mb-8 sm:mb-10 px-2"
        >
          Premium DJ & Sound Services for Weddings, Parties & Corporate Events.
          Let the crowd decide the vibe.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-12"
        >
          <Button
            onClick={() => scrollTo('#host')}
            className="glow-cyan font-semibold text-[clamp(14px,2vw,16px)] px-8 py-3 min-h-[48px] w-full sm:w-auto"
          >
            Book Now
          </Button>
          <Button
            variant="outline"
            onClick={() => scrollTo('#portfolio')}
            className="border-foreground/20 text-foreground hover:bg-foreground/5 font-semibold text-[clamp(14px,2vw,16px)] px-8 py-3 min-h-[48px] w-full sm:w-auto"
          >
            View Our Work
          </Button>
        </motion.div>

        {/* Social proof stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-10 gap-y-2 mb-8 sm:mb-10"
        >
          {[
            { value: '500+', label: 'Events' },
            { value: '100+', label: 'Happy Clients' },
            { value: '10+', label: 'Years Experience' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <span className="text-[clamp(18px,3vw,28px)] font-extrabold gradient-text">{stat.value}</span>
              <p className="text-[clamp(11px,1.5vw,13px)] text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Social icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="flex items-center justify-center gap-4"
        >
          {[
            { icon: Instagram, href: '#', label: 'Instagram' },
            { icon: Youtube, href: '#', label: 'YouTube' },
            { icon: Facebook, href: '#', label: 'Facebook' },
          ].map((social) => (
            <a
              key={social.label}
              href={social.href}
              aria-label={social.label}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-foreground/10 text-muted-foreground hover:text-primary hover:border-primary/40 transition-all duration-200"
            >
              <social.icon className="w-4 h-4" />
            </a>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={() => scrollTo('#services')}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-muted-foreground/50 hover:text-primary transition-colors"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        aria-label="Scroll down"
      >
        <ChevronDown className="w-7 h-7" />
      </motion.button>
    </section>
  );
}
