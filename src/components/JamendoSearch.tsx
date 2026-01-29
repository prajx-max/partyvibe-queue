import { useState } from 'react';
import { Search, Music, Plus, Loader2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface JamendoTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  audioUrl: string;
  imageUrl: string;
  albumName: string;
}

interface JamendoSearchProps {
  sessionId: string;
  onSongAdded: () => void;
}

export function JamendoSearch({ sessionId, onSongAdded }: JamendoSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<JamendoTrack[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [addingIds, setAddingIds] = useState<Set<string>>(new Set());

  const searchTracks = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke('jamendo-search', {
        body: { query: query.trim(), limit: 15 },
      });

      if (error) throw error;

      setResults(data.tracks || []);
      
      if (data.tracks?.length === 0) {
        toast.info('No tracks found. Try a different search term.');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search tracks');
    } finally {
      setIsSearching(false);
    }
  };

  const addTrack = async (track: JamendoTrack) => {
    setAddingIds((prev) => new Set(prev).add(track.id));

    try {
      // Add song directly with Jamendo stream URL
      const { error } = await supabase.from('songs').insert({
        session_id: sessionId,
        title: track.title,
        artist: track.artist,
        duration: track.duration,
        file_url: track.audioUrl,
      });

      if (error) throw error;

      toast.success(`Added "${track.title}"`);
      onSongAdded();
      
      // Remove from results after adding
      setResults((prev) => prev.filter((t) => t.id !== track.id));
    } catch (error) {
      console.error('Add track error:', error);
      toast.error('Failed to add track');
    } finally {
      setAddingIds((prev) => {
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
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-display text-lg font-semibold">Search Free Music</h3>
        <a
          href="https://www.jamendo.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
        >
          via Jamendo <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Search input */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search songs, artists..."
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
        <div className="space-y-2 max-h-[350px] overflow-y-auto">
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
                  className="h-12 w-12 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-background">
                  <Music className="h-5 w-5 text-muted-foreground" />
                </div>
              )}

              {/* Track info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{track.title}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {track.artist} • {formatDuration(track.duration)}
                </p>
              </div>

              {/* Add button */}
              <Button
                size="sm"
                onClick={() => addTrack(track)}
                disabled={addingIds.has(track.id)}
                className="shrink-0"
              >
                {addingIds.has(track.id) ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-1" />
                    Add
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
          Search for free Creative Commons music to add to your party!
        </p>
      )}
    </div>
  );
}
