import { motion } from 'framer-motion';
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl glass-heavy p-6 neon-border"
    >
      {/* Animated background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -left-20 -top-20 h-44 w-44 rounded-full bg-primary/15 blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 h-44 w-44 rounded-full bg-accent/15 blur-3xl"
          animate={{ scale: [1.3, 1, 1.3], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative z-10">
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
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
            <div className="flex items-start gap-4">
              {/* Album cover placeholder */}
              <motion.div
                animate={isPlaying ? { rotate: 360 } : {}}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className="flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-secondary to-accent shrink-0 shadow-[0_0_30px_hsl(var(--primary)/0.3)]"
              >
                <Music className="h-8 w-8 text-primary-foreground" />
              </motion.div>
              <div className="flex-1 min-w-0">
                <h2 className="font-display text-2xl font-bold tracking-tight truncate">{song.title}</h2>
                <p className="text-muted-foreground truncate">{song.artist || 'Unknown Artist'}</p>
                <div className="mt-2 flex items-center gap-2">
                  <motion.span
                    className="text-sm text-primary font-bold flex items-center gap-1"
                    key={song.vote_count}
                    initial={{ scale: 1.3 }}
                    animate={{ scale: 1 }}
                  >
                    🔥 {song.vote_count} votes
                  </motion.span>
                </div>
              </div>
              {isHost && onPlayPause && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onPlayPause}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground glow-cyan shrink-0"
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                </motion.button>
              )}
            </div>

            {/* Progress bar */}
            <div className="mt-6">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent"
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

            {/* Animated soundwave visualizer */}
            {isPlaying && (
              <div className="mt-4 flex items-end justify-center gap-[3px] h-8">
                {Array.from({ length: 32 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-[3px] rounded-full bg-gradient-to-t from-primary to-accent"
                    animate={{
                      height: [`${4 + Math.random() * 8}px`, `${12 + Math.random() * 20}px`, `${4 + Math.random() * 8}px`],
                    }}
                    transition={{
                      duration: 0.5 + Math.random() * 0.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.03,
                    }}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <Music className="mb-4 h-12 w-12 text-muted-foreground" />
            </motion.div>
            <p className="text-lg text-muted-foreground">No song playing</p>
            <p className="text-sm text-muted-foreground">Add songs and start voting!</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
