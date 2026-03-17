import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Heart, Briefcase, PartyPopper, Music, Users, Speaker, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const services = [
  { icon: Heart, title: 'DJ for Weddings', desc: 'Crafting the perfect soundtrack for your special day with curated playlists and seamless mixes.', price: 'Starting from ₹15,000' },
  { icon: Briefcase, title: 'Corporate Events', desc: 'Professional sound and atmosphere for conferences, launches, and corporate celebrations.', price: 'Starting from ₹20,000' },
  { icon: PartyPopper, title: 'Private Parties', desc: 'Turn any gathering into an unforgettable party with crowd-powered music selection.', price: 'Starting from ₹10,000' },
  { icon: Music, title: 'Club Nights', desc: 'High-energy sets with genre-spanning mixes designed to keep the dance floor packed.', price: 'Custom Pricing' },
  { icon: Users, title: 'Festival & Concert Sets', desc: 'Festival-grade performances with massive sound and lighting for large-scale events.', price: 'Custom Pricing' },
  { icon: Speaker, title: 'Sound & Lighting Setup', desc: 'Professional-grade audio systems and dynamic lighting rigs for any venue size.', price: 'Starting from ₹8,000' },
];

function ServiceCard({ service, index }: { service: (typeof services)[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      className="group relative rounded-xl glass-heavy p-5 sm:p-6 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-primary/20"
    >
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-primary/10 border border-primary/20">
          <service.icon className="w-5 h-5 text-primary" />
        </div>
        <h3 className="font-display font-bold text-[clamp(15px,2vw,17px)] mb-2 tracking-tight text-foreground">
          {service.title}
        </h3>
        <p className="text-[clamp(13px,1.8vw,14px)] text-muted-foreground leading-relaxed mb-4">
          {service.desc}
        </p>
        <span className="inline-block text-[11px] sm:text-xs font-semibold px-3 py-1 rounded-full mb-4 bg-primary/10 text-primary border border-primary/20">
          {service.price}
        </span>
        <button className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group/link">
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
      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6">
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
          <h2 className="font-display font-extrabold text-[clamp(24px,5vw,42px)] tracking-tight mb-3">
            <span className="gradient-text">Our Services</span>
          </h2>
          <p className="text-[clamp(13px,2vw,16px)] text-muted-foreground max-w-[500px] mx-auto">
            From intimate gatherings to massive festivals, we bring the perfect sound to every occasion.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-10 sm:mb-14">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>

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
            className="border-primary/30 text-primary hover:bg-primary/10 font-semibold min-h-[44px] px-6 rounded-lg"
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
