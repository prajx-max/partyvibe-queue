import { memo } from 'react';
import { motion } from 'framer-motion';
import { Music, Trash2, ChevronUp, Play, Pin, PinOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SongWithVotes } from '@/hooks/useSongs';

interface SongCardProps {
  song: SongWithVotes;
  rank: number;
  onVote: (songId: string) => void;
  onRemove?: (songId: string) => void;
  onPlay?: (songId: string) => void;
  onTogglePin?: (songId: string, pinned: boolean) => void;
  isVoting?: boolean;
  isHost?: boolean;
  votingLocked?: boolean;
  isCurrentSong?: boolean;
}

function SongCardInner({ song, rank, onVote, onRemove, onPlay, onTogglePin, isVoting, isHost, votingLocked, isCurrentSong }: SongCardProps) {
  const isTopSong = rank === 1 && song.vote_count > 0;
  const isPinned = !!song.pinned_at;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -30, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      layout
      className={`group relative flex items-center gap-2 sm:gap-3 rounded-xl glass-heavy p-2.5 sm:p-3 transition-all ${
        isCurrentSong
          ? 'ring-2 ring-primary/60 bg-primary/5'
          : isPinned
            ? 'ring-1 ring-accent/50 bg-accent/[0.04]'
            : isTopSong
              ? 'neon-border'
              : 'border border-border/50'
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
        {isPinned ? '📌' : rank === 1 ? '👑' : rank}
      </span>

      {/* Album art */}
      <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-lg overflow-hidden shrink-0 ring-1 ring-white/5">
        {song.image_url ? (
          <img src={song.image_url} alt="" loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 to-accent/15">
            <Music className="h-4 w-4 text-primary" />
          </div>
        )}
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
        aria-label={song.user_voted ? 'Remove vote' : 'Vote for song'}
        className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl transition-all disabled:opacity-50 active:scale-90 ${
          song.user_voted
            ? 'bg-primary/20 text-primary neon-border'
            : 'bg-muted/50 text-muted-foreground active:text-primary active:bg-primary/10'
        }`}
      >
        <ChevronUp className={`h-5 w-5 transition-all ${song.user_voted ? 'text-primary' : ''}`} />
      </button>

      {/* Host controls: Pin, Play & Remove */}
      {isHost && (
        <div className="flex items-center gap-1 shrink-0">
          {onTogglePin && (
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${isPinned ? 'text-accent' : 'text-muted-foreground hover:text-accent'}`}
              onClick={() => onTogglePin(song.id, !isPinned)}
              aria-label={isPinned ? 'Unpin song' : 'Pin to play next'}
              title={isPinned ? 'Unpin' : 'Pin to play next'}
            >
              {isPinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
            </Button>
          )}
          {onPlay && !isCurrentSong && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary"
              onClick={() => onPlay(song.id)}
              aria-label="Play this song now"
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
              aria-label="Remove song"
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

export const SongCard = memo(SongCardInner);
