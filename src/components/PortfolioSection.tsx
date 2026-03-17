import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Camera, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Category = 'All' | 'Weddings' | 'Corporate' | 'Parties' | 'Festivals';

interface GalleryItem {
  src: string;
  title: string;
  date: string;
  venue: string;
  category: Category;
}

const galleryItems: GalleryItem[] = [
  { src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80', title: 'Grand Wedding Reception', date: 'Dec 2025', venue: 'The Taj Palace, Delhi', category: 'Weddings' },
  { src: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80', title: 'Annual Tech Conference', date: 'Nov 2025', venue: 'Hyderabad Convention Center', category: 'Corporate' },
  { src: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80', title: 'NYE Club Night', date: 'Dec 2025', venue: 'Club Marquee, Mumbai', category: 'Parties' },
  { src: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80', title: 'Sunburn Music Festival', date: 'Oct 2025', venue: 'Vagator Beach, Goa', category: 'Festivals' },
  { src: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80', title: 'Royal Sangeet Night', date: 'Sep 2025', venue: 'Leela Palace, Udaipur', category: 'Weddings' },
  { src: 'https://images.unsplash.com/photo-1504680177321-2e6a879aac86?w=800&q=80', title: 'Product Launch Party', date: 'Aug 2025', venue: 'The Oberoi, Bangalore', category: 'Corporate' },
  { src: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80', title: 'Rooftop Sunset Party', date: 'Jul 2025', venue: 'Sky Lounge, Pune', category: 'Parties' },
  { src: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&q=80', title: 'Bass Nation Festival', date: 'Jun 2025', venue: 'JLN Stadium, Delhi', category: 'Festivals' },
  { src: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80', title: 'Haldi Ceremony DJ Night', date: 'May 2025', venue: 'ITC Grand, Chennai', category: 'Weddings' },
];

const categories: Category[] = ['All', 'Weddings', 'Corporate', 'Parties', 'Festivals'];

export function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const headingRef = useRef(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: '-40px' });

  const filtered = activeCategory === 'All' ? galleryItems : galleryItems.filter((item) => item.category === activeCategory);

  const openLightbox = (idx: number) => { setLightboxIndex(idx); document.body.style.overflow = 'hidden'; };
  const closeLightbox = () => { setLightboxIndex(null); document.body.style.overflow = ''; };
  const navigateLightbox = (dir: -1 | 1) => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + dir + filtered.length) % filtered.length);
  };

  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) navigateLightbox(diff > 0 ? 1 : -1);
  };

  return (
    <section id="portfolio" className="relative py-16 sm:py-20 md:py-28">
      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6">
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-primary/50" />
            <Camera className="w-5 h-5 text-primary" />
            <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-primary/50" />
          </div>
          <h2 className="font-display font-extrabold text-[clamp(24px,5vw,42px)] tracking-tight mb-3">
            <span className="gradient-text-accent">Event Gallery</span>
          </h2>
          <p className="text-[clamp(13px,2vw,16px)] text-muted-foreground max-w-[500px] mx-auto">
            A glimpse into the events we've powered with unforgettable music experiences.
          </p>
        </motion.div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-8 sm:mb-10 overflow-x-auto pb-2 scrollbar-hide justify-start sm:justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 min-h-[40px]',
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground shadow-[0_0_12px_hsl(var(--primary)/0.3)]'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.div
                key={item.src}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="group relative rounded-xl overflow-hidden cursor-pointer aspect-[4/3]"
                onClick={() => openLightbox(i)}
              >
                <img src={item.src} alt={item.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 sm:p-5">
                  <h4 className="text-foreground font-display font-bold text-[clamp(14px,2vw,16px)] mb-0.5">{item.title}</h4>
                  <p className="text-foreground/60 text-[clamp(11px,1.5vw,13px)]">{item.date} · {item.venue}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-10 sm:mt-14">
          <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 font-semibold min-h-[44px] px-6 rounded-lg">
            View Full Portfolio
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <button onClick={closeLightbox} className="absolute top-4 right-4 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-muted/20 hover:bg-muted/40 text-foreground transition-colors" aria-label="Close">
              <X className="w-5 h-5" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }} className="absolute left-3 sm:left-6 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-muted/20 hover:bg-muted/40 text-foreground transition-colors" aria-label="Previous">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }} className="absolute right-3 sm:right-6 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-muted/20 hover:bg-muted/40 text-foreground transition-colors" aria-label="Next">
              <ChevronRight className="w-5 h-5" />
            </button>
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className="max-w-[90vw] max-h-[85vh] sm:max-w-[80vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={filtered[lightboxIndex].src.replace('w=800', 'w=1400')} alt={filtered[lightboxIndex].title} className="max-w-full max-h-[80vh] object-contain rounded-xl" />
              <div className="text-center mt-3">
                <h4 className="text-foreground font-display font-bold text-base">{filtered[lightboxIndex].title}</h4>
                <p className="text-muted-foreground text-sm">{filtered[lightboxIndex].date} · {filtered[lightboxIndex].venue}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
