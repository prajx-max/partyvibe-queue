import { motion } from 'framer-motion';
import { Music, Trash2, ChevronUp, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SongWithVotes } from '@/hooks/useSongs';

interface SongCardProps {
  song: SongWithVotes;
  rank: number;
  onVote: (songId: string) => void;
  onRemove?: (songId: string) => void;
  onPlay?: (songId: string) => void;
  isVoting?: boolean;
  isHost?: boolean;
  votingLocked?: boolean;
  isCurrentSong?: boolean;
}

export function SongCard({ song, rank, onVote, onRemove, onPlay, isVoting, isHost, votingLocked, isCurrentSong }: SongCardProps) {
  const isTopSong = rank === 1 && song.vote_count > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -30, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      layout
      className={`group relative flex items-center gap-2 sm:gap-3 rounded-xl glass-heavy p-2.5 sm:p-3 transition-all ${
        isCurrentSong ? 'ring-2 ring-primary/60 bg-primary/5' : isTopSong ? 'neon-border animate-pulse-glow' : 'border border-border/50'
      }`}
    >
      {/* Rank badge */}
      <span
        className={`text-sm font-bold w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full shrink-0 ${
          rank === 1
            ? 'bg-primary/20 text-primary'
            : rank <= 3
              ? 'bg-secondary/20 text-secondary'
              : 'text-muted-foreground'
        }`}
      >
        {rank === 1 ? '👑' : rank}
      </span>

      {/* Song icon - hidden on very small screens */}
      <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 shrink-0">
        <Music className="h-4 w-4 text-primary" />
      </div>

      {/* Song info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium truncate">{song.title}</h3>
        <p className="text-xs text-muted-foreground truncate">{song.artist || 'Unknown Artist'}</p>
      </div>

      {/* Vote count */}
      <div className="flex items-center gap-1 text-xs font-bold text-accent shrink-0">
        <span>🔥</span>
        <span>{song.vote_count}</span>
      </div>

      {/* Vote button */}
      <button
        disabled={isVoting || votingLocked}
        onClick={() => onVote(song.id)}
        className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl transition-all disabled:opacity-50 active:scale-90 ${
          song.user_voted
            ? 'bg-primary/20 text-primary neon-border'
            : 'bg-muted/50 text-muted-foreground active:text-primary active:bg-primary/10'
        }`}
      >
        <ChevronUp className={`h-5 w-5 transition-all ${song.user_voted ? 'text-primary' : ''}`} />
      </button>

      {/* Host controls: Play & Remove */}
      {isHost && (
        <div className="flex items-center gap-1 shrink-0">
          {onPlay && !isCurrentSong && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary"
              onClick={() => onPlay(song.id)}
              title="Play this song now"
            >
              <Play className="h-3.5 w-3.5" />
            </Button>
          )}
          {onRemove && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => onRemove(song.id)}
              title="Remove song"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
}
