import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import vibeJamLogo from '@/assets/vibejam-logo.png';
import { cn } from '@/lib/utils';

interface NavbarProps {
  user?: { email?: string } | null;
  onSignOut?: () => void;
}

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'Services', href: '#services' },
  { label: 'Gallery', href: '#portfolio' },
  { label: 'Host', href: '#host' },
  { label: 'Join', href: '#join' },
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

  const handleNavClick = (href: string) => {
    setIsOpen(false);
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
          'fixed top-0 left-0 right-0 z-[100] transition-all duration-300',
          'h-14 md:h-16',
          scrolled
            ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-[0_1px_12px_rgba(0,0,0,0.4)]'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-[1200px] mx-auto h-full flex items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 min-w-0 shrink-0"
          >
            <img
              src={vibeJamLogo}
              alt="BeatBaaja logo"
              className="w-8 h-8 md:w-9 md:h-9 rounded-[10px]"
            />
            <span className="font-bold text-[clamp(14px,2.5vw,17px)] tracking-tight text-foreground">
              BeatBaaja
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            {user && onSignOut && (
              <button
                onClick={onSignOut}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign Out
              </button>
            )}
            <Button onClick={handleCTA} size="sm" className="glow-cyan font-semibold text-sm px-5">
              Start Party
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex items-center justify-center w-11 h-11 rounded-lg text-foreground hover:bg-muted/50 transition-colors"
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
          'fixed inset-0 z-[99] bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile slide-in panel */}
      <div
        className={cn(
          'fixed top-0 right-0 z-[101] h-full w-[280px] max-w-[80vw] bg-background/95 backdrop-blur-xl',
          'border-l border-border/50 shadow-[-8px_0_30px_rgba(0,0,0,0.5)]',
          'transition-transform duration-300 ease-out md:hidden flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Close button */}
        <div className="flex items-center justify-end p-4 h-14">
          <button
            onClick={() => setIsOpen(false)}
            className="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-muted/50 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 flex flex-col gap-1 px-4 pt-2">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="w-full text-left px-4 py-3 rounded-lg text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors min-h-[44px]"
            >
              {link.label}
            </button>
          ))}

          {user && onSignOut && (
            <button
              onClick={() => { setIsOpen(false); onSignOut(); }}
              className="w-full text-left px-4 py-3 rounded-lg text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors min-h-[44px]"
            >
              Sign Out
            </button>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="p-4 pb-6">
          <Button onClick={handleCTA} className="w-full glow-cyan font-semibold py-3 min-h-[44px]">
            Start Party
          </Button>
        </div>
      </div>
    </>
  );
}
