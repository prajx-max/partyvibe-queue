import { Music, Pause, Play } from 'lucide-react';
import { SongWithVotes } from '@/hooks/useSongs';
import { Equalizer } from '@/components/Equalizer';

interface NowPlayingCardProps {
  song: SongWithVotes | null;
  isPlaying: boolean;
  progress: number;
  onPlayPause?: () => void;
  isHost?: boolean;
}

export function NowPlayingCard({ song, isPlaying, progress, onPlayPause, isHost }: NowPlayingCardProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative overflow-hidden rounded-xl glass-heavy p-4 sm:p-6 neon-border">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-20 -top-20 h-32 w-32 sm:h-44 sm:w-44 rounded-full bg-primary/10 blur-3xl animate-pulse-glow" />
        <div className="absolute -bottom-20 -right-20 h-32 w-32 sm:h-44 sm:w-44 rounded-full bg-primary/5 blur-3xl animate-pulse-magenta" />
      </div>

      <div className="relative z-10">
        <div className="mb-3 sm:mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            {isPlaying ? (
              <Equalizer isPlaying barCount={3} />
            ) : (
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex h-2 w-2 rounded-full bg-muted-foreground" />
              </span>
            )}
            <span className="uppercase tracking-wider text-xs font-semibold">Now Playing</span>
          </div>
        </div>

        {song ? (
          <>
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex h-14 w-14 sm:h-20 sm:w-20 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 shrink-0">
                <Music className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-display text-lg sm:text-2xl font-bold tracking-tight truncate">{song.title}</h2>
                <p className="text-sm text-muted-foreground truncate">{song.artist || 'Unknown Artist'}</p>
                <div className="mt-1 sm:mt-2 flex items-center gap-2">
                  <span className="text-sm text-primary font-bold flex items-center gap-1">
                    🔥 {song.vote_count} votes
                  </span>
                </div>
              </div>
              {isHost && onPlayPause && (
                <button
                  onClick={onPlayPause}
                  className="flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-primary text-primary-foreground glow-primary shrink-0 active:scale-95 transition-transform"
                >
                  {isPlaying ? <Pause className="h-5 w-5 sm:h-6 sm:w-6" /> : <Play className="h-5 w-5 sm:h-6 sm:w-6 ml-0.5" />}
                </button>
              )}
            </div>

            <div className="mt-4 sm:mt-6">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {song.duration && (
                <div className="mt-1.5 sm:mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>{formatTime((progress / 100) * song.duration)}</span>
                  <span>{formatTime(song.duration)}</span>
                </div>
              )}
            </div>

            {isPlaying && (
              <div className="mt-3 sm:mt-4 flex items-end justify-center gap-[3px] h-6 sm:h-8">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-[2px] sm:w-[3px] rounded-full bg-primary equalizer-bar"
                    style={{ animationDelay: `${i * 0.05}s`, animationDuration: `${0.4 + (i % 5) * 0.15}s` }}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center">
            <Music className="mb-3 sm:mb-4 h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground animate-bounce-subtle" />
            <p className="text-base sm:text-lg text-muted-foreground">No song playing</p>
            <p className="text-sm text-muted-foreground">Add songs and start voting!</p>
          </div>
        )}
      </div>
    </div>
  );
}
