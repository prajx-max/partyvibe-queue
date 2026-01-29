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
      className="rounded-xl bg-card border border-border p-4"
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
        <ChevronRight className="h-4 w-4" />
        UP NEXT
      </div>

      {song ? (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <Music className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate text-sm">{song.title}</h3>
            <p className="text-xs text-muted-foreground truncate">{song.artist || 'Unknown Artist'}</p>
          </div>
          <span className="text-sm text-primary font-medium">{song.vote_count} votes</span>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No songs in queue</p>
      )}
    </motion.div>
  );
}
