import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';

interface NavbarProps {
  user?: { email?: string } | null;
  onSignOut?: () => void;
}

const navLinks = [
  { label: 'Home', href: '#hero', type: 'anchor' as const },
  { label: 'Features', href: '#features', type: 'anchor' as const },
  { label: 'How it Works', href: '#how', type: 'anchor' as const },
  { label: 'Pricing', href: '/pricing', type: 'route' as const },
  { label: 'About', href: '/about', type: 'route' as const },
  { label: 'Contact', href: '/contact', type: 'route' as const },
];

export function Navbar({ user, onSignOut }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setIsOpen(false); }, [location]);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleNavClick = (href: string, type: 'anchor' | 'route') => {
    setIsOpen(false);
    if (type === 'route') {
      navigate(href);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCTA = () => {
    setIsOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.querySelector('#host')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.querySelector('#host')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav
        className={cn(
          'fixed left-1/2 -translate-x-1/2 z-[100] transition-all duration-300',
          'top-3 md:top-5',
          'w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] max-w-[1180px]',
          'h-14 md:h-15 rounded-2xl',
          scrolled
            ? 'bg-background/70 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.35)]'
            : 'bg-background/40 backdrop-blur-md border border-white/[0.06]'
        )}
      >
        <div className="h-full flex items-center justify-between px-3 sm:px-5">
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 min-w-0 shrink-0"
            aria-label="PartyVibe home"
          >
            <Logo size={30} />
            <span className="font-display font-bold text-[15px] md:text-[17px] tracking-tight text-foreground">
              PartyVibe
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href, link.type)}
                className="px-3 py-2 text-[13.5px] font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-2">
            {user && onSignOut ? (
              <button
                onClick={onSignOut}
                className="text-[13.5px] font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={handleCTA}
                className="text-[13.5px] font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
              >
                Sign In
              </button>
            )}
            <Button onClick={handleCTA} size="sm" className="glow-cyan font-semibold text-[13.5px] px-5 rounded-xl h-9">
              Start Party
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-foreground hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
          >
            <div className="relative w-5 h-5">
              <span
                className={cn(
                  'absolute left-0 block w-5 h-0.5 bg-current transition-all duration-300',
                  isOpen ? 'top-[9px] rotate-45' : 'top-[3px]'
                )}
              />
              <span
                className={cn(
                  'absolute left-0 top-[9px] block w-5 h-0.5 bg-current transition-all duration-300',
                  isOpen ? 'opacity-0 scale-x-0' : 'opacity-100'
                )}
              />
              <span
                className={cn(
                  'absolute left-0 block w-5 h-0.5 bg-current transition-all duration-300',
                  isOpen ? 'top-[9px] -rotate-45' : 'top-[15px]'
                )}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={cn(
          'fixed inset-0 z-[99] bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile slide-in panel */}
      <div
        className={cn(
          'fixed top-0 right-0 z-[101] h-full w-[300px] max-w-[85vw] bg-background/95 backdrop-blur-xl',
          'border-l border-white/10 shadow-[-8px_0_30px_rgba(0,0,0,0.5)]',
          'transition-transform duration-300 ease-out lg:hidden flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between p-4 h-16 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Logo size={26} />
            <span className="font-display font-bold text-sm">PartyVibe</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex flex-col gap-1 px-3 pt-3">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href, link.type)}
              className="w-full text-left px-4 py-3 rounded-xl text-base font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors min-h-[48px]"
            >
              {link.label}
            </button>
          ))}

          {user && onSignOut && (
            <button
              onClick={() => { setIsOpen(false); onSignOut(); }}
              className="w-full text-left px-4 py-3 rounded-xl text-base font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors min-h-[48px]"
            >
              Sign Out
            </button>
          )}
        </div>

        <div className="p-4 pb-6 border-t border-white/5">
          <Button onClick={handleCTA} className="w-full glow-cyan font-semibold py-3 min-h-[48px] rounded-xl">
            Start Party
          </Button>
        </div>
      </div>
    </>
  );
}
