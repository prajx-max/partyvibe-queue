import { motion } from 'framer-motion';
import { Music, Pause, Play } from 'lucide-react';
import { SongWithVotes } from '@/hooks/useSongs';

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-card p-6 neon-border"
    >
      {/* Animated background glow */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-primary blur-3xl animate-pulse-glow" />
        <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-accent blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10">
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className={`absolute inline-flex h-full w-full rounded-full bg-primary ${isPlaying ? 'animate-ping' : ''} opacity-75`} />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            NOW PLAYING
          </div>
        </div>

        {song ? (
          <>
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
                <Music className="h-8 w-8 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h2 className="font-display text-2xl font-bold tracking-tight">{song.title}</h2>
                <p className="text-muted-foreground">{song.artist || 'Unknown Artist'}</p>
                <p className="mt-1 text-sm text-primary">{song.vote_count} votes</p>
              </div>
              {isHost && onPlayPause && (
                <button
                  onClick={onPlayPause}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:scale-105 hover:shadow-lg glow-cyan"
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                </button>
              )}
            </div>

            {/* Progress bar */}
            <div className="mt-6">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              {song.duration && (
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>{formatTime((progress / 100) * song.duration)}</span>
                  <span>{formatTime(song.duration)}</span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Music className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">No song playing</p>
            <p className="text-sm text-muted-foreground">Add songs and start voting!</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
