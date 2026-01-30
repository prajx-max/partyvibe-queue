import { useState } from 'react';
import { Search, Music, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface JioSaavnTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  audioUrl: string;
  imageUrl: string;
  albumName: string;
  language: string;
}

interface GuestSongRequestProps {
  sessionId: string;
  onSongRequested: () => void;
}

export function GuestSongRequest({ sessionId, onSongRequested }: GuestSongRequestProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<JioSaavnTrack[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [requestingIds, setRequestingIds] = useState<Set<string>>(new Set());

  const searchTracks = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke('jiosaavn-search', {
        body: { query: query.trim(), limit: 10 },
      });

      if (error) throw error;

      setResults(data.tracks || []);

      if (data.tracks?.length === 0) {
        toast.info('No songs found. Try a different search.');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search songs');
    } finally {
      setIsSearching(false);
    }
  };

  const requestTrack = async (track: JioSaavnTrack) => {
    setRequestingIds((prev) => new Set(prev).add(track.id));

    try {
      // Add song to the queue (guests can request songs)
      const { error } = await supabase.from('songs').insert({
        session_id: sessionId,
        title: track.title,
        artist: track.artist,
        duration: track.duration,
        file_url: track.audioUrl,
      });

      if (error) throw error;

      toast.success(`Requested "${track.title}"`);
      onSongRequested();

      // Remove from results after requesting
      setResults((prev) => prev.filter((t) => t.id !== track.id));
    } catch (error) {
      console.error('Request error:', error);
      toast.error('Failed to request song');
    } finally {
      setRequestingIds((prev) => {
        const next = new Set(prev);
        next.delete(track.id);
        return next;
      });
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchTracks();
    }
  };

  return (
    <div className="rounded-xl bg-card border border-border p-4">
      <h3 className="font-display text-lg font-semibold mb-4">Request a Song</h3>

      {/* Search input */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search for a song..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-9"
          />
        </div>
        <Button onClick={searchTracks} disabled={isSearching || !query.trim()}>
          {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
        </Button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {results.map((track) => (
            <div
              key={track.id}
              className="flex items-center gap-3 rounded-lg bg-muted p-3 transition-colors hover:bg-muted/80"
            >
              {/* Album art */}
              {track.imageUrl ? (
                <img
                  src={track.imageUrl}
                  alt={track.albumName}
                  className="h-10 w-10 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background">
                  <Music className="h-4 w-4 text-muted-foreground" />
                </div>
              )}

              {/* Track info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{track.title}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {track.artist} • {formatDuration(track.duration)}
                </p>
              </div>

              {/* Request button */}
              <Button
                size="sm"
                variant="secondary"
                onClick={() => requestTrack(track)}
                disabled={requestingIds.has(track.id)}
                className="shrink-0"
              >
                {requestingIds.has(track.id) ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-1" />
                    Request
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isSearching && results.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-4">
          Search for your favorite songs to add to the queue!
        </p>
      )}
    </div>
  );
}
