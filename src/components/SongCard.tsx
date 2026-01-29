import { motion } from 'framer-motion';
import { Music, ThumbsUp, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SongWithVotes } from '@/hooks/useSongs';

interface SongCardProps {
  song: SongWithVotes;
  rank: number;
  onVote: (songId: string) => void;
  onRemove?: (songId: string) => void;
  isVoting?: boolean;
  isHost?: boolean;
  votingLocked?: boolean;
}

export function SongCard({ song, rank, onVote, onRemove, isVoting, isHost, votingLocked }: SongCardProps) {
  const isTopSong = rank === 1 && song.vote_count > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2, delay: rank * 0.05 }}
      className={`group relative flex items-center gap-4 rounded-xl bg-card p-4 transition-all hover:bg-muted/50 ${
        isTopSong ? 'neon-border' : 'border border-border'
      }`}
    >
      {/* Rank badge */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-display font-bold ${
          rank === 1
            ? 'bg-primary text-primary-foreground'
            : rank === 2
            ? 'bg-secondary text-secondary-foreground'
            : rank === 3
            ? 'bg-accent text-accent-foreground'
            : 'bg-muted text-muted-foreground'
        }`}
      >
        {rank}
      </div>

      {/* Song icon */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Music className="h-5 w-5 text-muted-foreground" />
      </div>

      {/* Song info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium truncate">{song.title}</h3>
        <p className="text-sm text-muted-foreground truncate">{song.artist || 'Unknown Artist'}</p>
      </div>

      {/* Vote count */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">{song.vote_count}</span>
        
        {/* Vote button */}
        <Button
          variant={song.user_voted ? 'default' : 'outline'}
          size="sm"
          disabled={isVoting || votingLocked}
          onClick={() => onVote(song.id)}
          className={`transition-all ${
            song.user_voted
              ? 'bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan'
              : 'hover:border-primary hover:text-primary'
          }`}
        >
          <ThumbsUp className={`h-4 w-4 ${song.user_voted ? 'fill-current' : ''}`} />
        </Button>

        {/* Remove button (host only) */}
        {isHost && onRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(song.id)}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}
