import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Heart,
  Briefcase,
  PartyPopper,
  Music,
  Users,
  Speaker,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const services = [
  {
    icon: Heart,
    title: 'DJ for Weddings',
    desc: 'Crafting the perfect soundtrack for your special day with curated playlists and seamless mixes.',
    price: 'Starting from ₹15,000',
    color: 'hsl(320, 100%, 55%)',
  },
  {
    icon: Briefcase,
    title: 'Corporate Events',
    desc: 'Professional sound and atmosphere for conferences, launches, and corporate celebrations.',
    price: 'Starting from ₹20,000',
    color: 'hsl(185, 100%, 50%)',
  },
  {
    icon: PartyPopper,
    title: 'Private Parties',
    desc: 'Turn any gathering into an unforgettable party with crowd-powered music selection.',
    price: 'Starting from ₹10,000',
    color: 'hsl(270, 60%, 60%)',
  },
  {
    icon: Music,
    title: 'Club Nights',
    desc: 'High-energy sets with genre-spanning mixes designed to keep the dance floor packed.',
    price: 'Custom Pricing',
    color: 'hsl(150, 100%, 50%)',
  },
  {
    icon: Users,
    title: 'Festival & Concert Sets',
    desc: 'Festival-grade performances with massive sound and lighting for large-scale events.',
    price: 'Custom Pricing',
    color: 'hsl(45, 100%, 60%)',
  },
  {
    icon: Speaker,
    title: 'Sound & Lighting Setup',
    desc: 'Professional-grade audio systems and dynamic lighting rigs for any venue size.',
    price: 'Starting from ₹8,000',
    color: 'hsl(0, 80%, 60%)',
  },
];

function ServiceCard({
  service,
  index,
}: {
  service: (typeof services)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      className="group relative rounded-2xl glass-heavy p-5 sm:p-6 overflow-hidden transition-all duration-300
        hover:scale-[1.03] hover:shadow-[0_8px_40px_rgba(0,0,0,0.4)]"
      style={{
        ['--card-accent' as string]: service.color,
      }}
    >
      {/* Hover glow border */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 0 1px ${service.color}33, 0 0 20px ${service.color}15`,
        }}
      />

      <div className="relative z-10">
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
          style={{
            background: `linear-gradient(135deg, ${service.color}20, ${service.color}08)`,
            border: `1px solid ${service.color}30`,
          }}
        >
          <service.icon className="w-5 h-5" style={{ color: service.color }} />
        </div>

        {/* Title */}
        <h3 className="font-bold text-[clamp(15px,2vw,17px)] mb-2 tracking-tight text-foreground">
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-[clamp(13px,1.8vw,14px)] text-muted-foreground leading-relaxed mb-4">
          {service.desc}
        </p>

        {/* Price badge */}
        <span
          className="inline-block text-[11px] sm:text-xs font-semibold px-3 py-1 rounded-full mb-4"
          style={{
            background: `${service.color}12`,
            color: service.color,
            border: `1px solid ${service.color}25`,
          }}
        >
          {service.price}
        </span>

        {/* Learn more */}
        <button className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group/link">
          Learn More
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
        </button>
      </div>
    </motion.div>
  );
}

export function ServicesSection() {
  const headingRef = useRef(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: '-40px' });

  return (
    <section id="services" className="relative py-16 sm:py-20 md:py-28">
      {/* Subtle section background differentiation */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(270,30%,5%,0.3)] to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Section heading */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-primary/50" />
            <Music className="w-5 h-5 text-primary" />
            <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-primary/50" />
          </div>
          <h2 className="font-extrabold text-[clamp(24px,5vw,42px)] tracking-tight mb-3">
            <span className="gradient-text">Our Services</span>
          </h2>
          <p className="text-[clamp(13px,2vw,16px)] text-muted-foreground max-w-[500px] mx-auto">
            From intimate gatherings to massive festivals, we bring the perfect sound to every occasion.
          </p>
        </motion.div>

        {/* Service cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-10 sm:mb-14">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-muted-foreground text-[clamp(13px,2vw,15px)] mb-4">
            Can't find what you need? We create custom packages for any event.
          </p>
          <Button
            variant="outline"
            className="border-primary/30 text-primary hover:bg-primary/10 font-semibold min-h-[44px] px-6"
            onClick={() => document.querySelector('#host')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Contact Us
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
