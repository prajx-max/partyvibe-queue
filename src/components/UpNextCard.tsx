import { Music, ChevronRight } from 'lucide-react';
import { SongWithVotes } from '@/hooks/useSongs';

interface UpNextCardProps {
  song: SongWithVotes | null;
}

export function UpNextCard({ song }: UpNextCardProps) {
  return (
    <div className="rounded-xl glass-heavy border border-border/50 p-4 hover:border-accent/30 transition-colors animate-fade-in">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
        <ChevronRight className="h-4 w-4 text-accent animate-bounce-subtle" />
        <span className="uppercase tracking-wider text-xs font-semibold">Up Next</span>
      </div>

      {song ? (
        <div key={song.id} className="flex items-center gap-3 animate-fade-in">
          <div className="h-11 w-11 rounded-lg overflow-hidden shrink-0 ring-1 ring-white/5">
            {song.image_url ? (
              <img src={song.image_url} alt={song.title} loading="lazy" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-accent/10">
                <Music className="h-4 w-4 text-accent" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate text-sm">{song.title}</h3>
            <p className="text-xs text-muted-foreground truncate">{song.artist || 'Unknown Artist'}</p>
          </div>
          <span className="text-sm text-accent font-medium">{song.vote_count} votes</span>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No songs in queue</p>
      )}
    </div>
  );
}
