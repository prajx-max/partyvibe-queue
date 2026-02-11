import { motion } from 'framer-motion';
import { Heart, Music, Trash2 } from 'lucide-react';
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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.15, delay: rank * 0.03 }}
      className={`group relative flex items-center gap-3 rounded-xl bg-card p-3 transition-all ${
        isTopSong ? 'neon-border' : 'border border-border'
      }`}
    >
      {/* Rank */}
      <span className={`text-sm font-bold w-5 text-center shrink-0 ${
        rank <= 3 ? 'text-primary' : 'text-muted-foreground'
      }`}>
        {rank}
      </span>

      {/* Song info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium truncate">{song.title}</h3>
        <p className="text-xs text-muted-foreground truncate">{song.artist || 'Unknown Artist'}</p>
      </div>

      {/* Vote tap area */}
      <button
        disabled={isVoting || votingLocked}
        onClick={() => onVote(song.id)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all active:scale-95 disabled:opacity-50 ${
          song.user_voted
            ? 'bg-primary/15 text-primary'
            : 'bg-muted text-muted-foreground hover:text-primary'
        }`}
      >
        <Heart className={`h-4 w-4 transition-all ${song.user_voted ? 'fill-current scale-110' : ''}`} />
        <span className="text-sm font-semibold min-w-[1ch]">{song.vote_count}</span>
      </button>

      {/* Remove button (host only) */}
      {isHost && onRemove && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
          onClick={() => onRemove(song.id)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      )}
    </motion.div>
  );
}
