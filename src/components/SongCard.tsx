import { motion } from 'framer-motion';
import { Heart, Music, Trash2, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SongWithVotes } from '@/hooks/useSongs';
import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

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
  const prevRankRef = useRef(rank);

  // Confetti when a song becomes #1
  useEffect(() => {
    if (rank === 1 && prevRankRef.current !== 1 && song.vote_count > 0) {
      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#00F5FF', '#7B2CFF', '#FF3CAC'],
      });
    }
    prevRankRef.current = rank;
  }, [rank, song.vote_count]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -30, scale: 0.95 }}
      transition={{ duration: 0.2, delay: rank * 0.03 }}
      whileHover={{ scale: 1.01, x: 4 }}
      layout
      className={`group relative flex items-center gap-3 rounded-xl glass-heavy p-3 transition-all ${
        isTopSong ? 'neon-border animate-pulse-glow' : 'border border-border/50 hover:border-primary/30'
      }`}
    >
      {/* Rank badge */}
      <motion.span
        className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full shrink-0 ${
          rank === 1
            ? 'bg-primary/20 text-primary'
            : rank <= 3
              ? 'bg-secondary/20 text-secondary'
              : 'text-muted-foreground'
        }`}
        key={rank}
        initial={{ scale: 1.3 }}
        animate={{ scale: 1 }}
      >
        {rank === 1 ? '👑' : rank}
      </motion.span>

      {/* Song icon */}
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 shrink-0">
        <Music className="h-4 w-4 text-primary" />
      </div>

      {/* Song info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium truncate">{song.title}</h3>
        <p className="text-xs text-muted-foreground truncate">{song.artist || 'Unknown Artist'}</p>
      </div>

      {/* Vote count & energy */}
      <div className="flex items-center gap-1 text-xs font-bold text-accent shrink-0">
        <span>🔥</span>
        <span>{song.vote_count}</span>
      </div>

      {/* Vote button - Upvote style */}
      <motion.button
        disabled={isVoting || votingLocked}
        onClick={() => onVote(song.id)}
        whileTap={{ scale: 0.85 }}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all disabled:opacity-50 ${
          song.user_voted
            ? 'bg-primary/20 text-primary neon-border'
            : 'bg-muted/50 text-muted-foreground hover:text-primary hover:bg-primary/10'
        }`}
      >
        <motion.div
          animate={song.user_voted ? { scale: [1, 1.4, 1], y: [0, -4, 0] } : {}}
          transition={{ duration: 0.3 }}
        >
          <ChevronUp className={`h-5 w-5 transition-all ${song.user_voted ? 'text-primary' : ''}`} />
        </motion.div>
      </motion.button>

      {/* Remove button (host only) */}
      {isHost && onRemove && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
          onClick={() => onRemove(song.id)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      )}
    </motion.div>
  );
}
