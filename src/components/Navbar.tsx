import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, Home, Briefcase, Image, Radio, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import vibeJamLogo from '@/assets/vibejam-logo.png';
import { cn } from '@/lib/utils';

interface NavbarProps {
  user?: { email?: string } | null;
  onSignOut?: () => void;
}

const navLinks = [
  { label: 'Home', href: '#hero', icon: Home },
  { label: 'Services', href: '#services', icon: Briefcase },
  { label: 'Gallery', href: '#portfolio', icon: Image },
  { label: 'Host', href: '#host', icon: Radio },
  { label: 'Join', href: '#join', icon: Users },
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

  useEffect(() => { setIsOpen(false); }, [location]);

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
            ? 'bg-background/90 backdrop-blur-xl border-b border-border/50 shadow-[0_1px_8px_hsl(0,0%,0%,0.4)]'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-[1200px] mx-auto h-full flex items-center justify-between px-4 sm:px-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 min-w-0 shrink-0"
          >
            <img src={vibeJamLogo} alt="BeatBaaja" className="w-8 h-8 rounded-[10px]" />
            <span className="font-display font-bold text-base tracking-tight text-foreground">
              BeatBaaja
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg"
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
            <Button onClick={handleCTA} size="sm" className="glow-primary font-semibold text-sm px-5 rounded-lg">
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
              <span className={cn(
                'absolute left-0 block w-5 h-0.5 bg-current transition-all duration-300',
                isOpen ? 'top-[9px] rotate-45' : 'top-[3px]'
              )} />
              <span className={cn(
                'absolute left-0 top-[9px] block w-5 h-0.5 bg-current transition-all duration-300',
                isOpen ? 'opacity-0 scale-x-0' : 'opacity-100'
              )} />
              <span className={cn(
                'absolute left-0 block w-5 h-0.5 bg-current transition-all duration-300',
                isOpen ? 'top-[9px] -rotate-45' : 'top-[15px]'
              )} />
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
          'fixed top-0 right-0 z-[101] h-full w-[280px] max-w-[80vw]',
          'bg-background/95 backdrop-blur-xl border-l border-border/50',
          'transition-transform duration-300 ease-out md:hidden flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-end p-4 h-14">
          <button
            onClick={() => setIsOpen(false)}
            className="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-muted/50 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex flex-col gap-1 px-4 pt-2">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors min-h-[44px]"
            >
              <link.icon className="w-4 h-4 shrink-0" />
              {link.label}
            </button>
          ))}

          {user && onSignOut && (
            <button
              onClick={() => { setIsOpen(false); onSignOut(); }}
              className="w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors min-h-[44px]"
            >
              Sign Out
            </button>
          )}
        </div>

        <div className="p-4 pb-6">
          <Button onClick={handleCTA} className="w-full glow-primary font-semibold py-3 min-h-[44px] rounded-lg">
            Start Party
          </Button>
        </div>
      </div>
    </>
  );
}
