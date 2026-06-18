import { useState } from 'react';
import { Music, ChevronUp, X } from 'lucide-react';
import { SongWithVotes } from '@/hooks/useSongs';
import { Equalizer } from '@/components/Equalizer';

interface MobileMiniPlayerProps {
  song: SongWithVotes | null;
  upNext: SongWithVotes | null;
  isPlaying: boolean;
  progress: number;
}

/**
 * Spotify-style mini-player pinned to the bottom on mobile.
 * Tap to expand into a full-screen now-playing view.
 */
export function MobileMiniPlayer({ song, upNext, isPlaying, progress }: MobileMiniPlayerProps) {
  const [expanded, setExpanded] = useState(false);

  if (!song) return null;

  return (
    <>
      {/* Mini bar - always visible on mobile when a song exists */}
      <button
        onClick={() => setExpanded(true)}
        aria-label="Open now playing"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/85 backdrop-blur-xl border-t border-border/60 px-3 py-2 flex items-center gap-3 text-left active:bg-background/95 transition-colors"
        style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
      >
        <div className="h-10 w-10 rounded-lg overflow-hidden shrink-0 ring-1 ring-white/10">
          {song.image_url ? (
            <img src={song.image_url} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary via-secondary to-accent">
              <Music className="h-4 w-4 text-primary-foreground" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{song.title}</p>
          <p className="text-xs text-muted-foreground truncate">{song.artist || 'Unknown Artist'}</p>
        </div>
        <div className="shrink-0 flex items-center gap-2 pr-1">
          {isPlaying ? <Equalizer isPlaying barCount={3} /> : null}
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        </div>
        {/* Mini progress bar */}
        <div className="absolute left-0 right-0 top-0 h-[2px] bg-muted/40">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-[width] duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </button>

      {/* Full-screen expanded view */}
      {expanded && (
        <div className="md:hidden fixed inset-0 z-[200] bg-background/95 backdrop-blur-2xl animate-fade-in flex flex-col">
          <div className="flex items-center justify-between p-4">
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Now Playing</span>
            <button
              onClick={() => setExpanded(false)}
              aria-label="Close"
              className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-muted/50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8 gap-6">
            <div className="relative w-full max-w-[320px] aspect-square rounded-3xl overflow-hidden shadow-[0_20px_80px_hsl(var(--primary)/0.4)] ring-1 ring-white/10">
              {song.image_url ? (
                <img src={song.image_url} alt={song.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary via-secondary to-accent">
                  <Music className="h-20 w-20 text-primary-foreground" />
                </div>
              )}
              <div className="absolute -inset-8 -z-10 bg-primary/30 blur-3xl opacity-50" />
            </div>

            <div className="w-full max-w-[360px] text-center">
              <h1 className="text-2xl font-bold tracking-tight truncate">{song.title}</h1>
              <p className="text-base text-muted-foreground truncate mt-1">{song.artist || 'Unknown Artist'}</p>
              <p className="text-sm text-primary font-semibold mt-2">🔥 {song.vote_count} votes</p>
            </div>

            <div className="w-full max-w-[360px]">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent transition-[width] duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {upNext && (
              <div className="w-full max-w-[360px] rounded-xl glass-heavy border border-border/40 p-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-md overflow-hidden shrink-0">
                  {upNext.image_url ? (
                    <img src={upNext.image_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-accent/15">
                      <Music className="h-4 w-4 text-accent" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Up Next</p>
                  <p className="text-sm font-medium truncate">{upNext.title}</p>
                </div>
                <span className="text-xs text-accent font-semibold shrink-0">{upNext.vote_count} 🔥</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}