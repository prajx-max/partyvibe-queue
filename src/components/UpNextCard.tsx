import { motion } from 'framer-motion';
import { Music, ChevronRight } from 'lucide-react';
import { SongWithVotes } from '@/hooks/useSongs';

interface UpNextCardProps {
  song: SongWithVotes | null;
}

export function UpNextCard({ song }: UpNextCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl glass-heavy border border-border/50 p-4 hover:border-accent/30 transition-colors"
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
        <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ChevronRight className="h-4 w-4 text-accent" />
        </motion.div>
        <span className="uppercase tracking-wider text-xs font-semibold">Up Next</span>
      </div>

      {song ? (
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          key={song.id}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <Music className="h-4 w-4 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate text-sm">{song.title}</h3>
            <p className="text-xs text-muted-foreground truncate">{song.artist || 'Unknown Artist'}</p>
          </div>
          <span className="text-sm text-accent font-medium">{song.vote_count} votes</span>
        </motion.div>
      ) : (
        <p className="text-sm text-muted-foreground">No songs in queue</p>
      )}
    </motion.div>
  );
}
