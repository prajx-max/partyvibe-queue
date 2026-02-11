import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Disc3, Music, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NowPlayingCard } from '@/components/NowPlayingCard';
import { UpNextCard } from '@/components/UpNextCard';
import { SongCard } from '@/components/SongCard';
import { SearchBar } from '@/components/SearchBar';
import { GuestSongRequest } from '@/components/GuestSongRequest';
import { useSession } from '@/hooks/useSession';
import { useSongs, SongWithVotes } from '@/hooks/useSongs';
import { useVoterId } from '@/hooks/useVoterId';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Rate limiting
const VOTE_RATE_LIMIT = 10; // votes per minute
const RATE_LIMIT_WINDOW = 60000; // 1 minute

export default function GuestSession() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { data: session, isLoading: sessionLoading } = useSession(sessionId);
  const { voterId, isLoading: voterLoading } = useVoterId(sessionId);
  const { data: songs, isLoading: songsLoading, refetch: refetchSongs } = useSongs(sessionId, voterId);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [votingInProgress, setVotingInProgress] = useState<string | null>(null);
  const [voteTimestamps, setVoteTimestamps] = useState<number[]>([]);
  const [showRequestPanel, setShowRequestPanel] = useState(false);

  const currentSong = songs && songs.length > 0 ? songs[0] : null;
  const upNextSong = songs && songs.length > 1 ? songs[1] : null;

  const checkRateLimit = (): boolean => {
    const now = Date.now();
    const recentVotes = voteTimestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);
    return recentVotes.length < VOTE_RATE_LIMIT;
  };

  const handleVote = async (songId: string) => {
    if (!sessionId || votingInProgress) return;
    if (!voterId) {
      toast.error('Still connecting... try again in a moment');
      return;
    }

    // Check if voting is open
    if (!session?.is_voting_open) {
      toast.error('Voting is currently locked');
      return;
    }

    // Rate limit check
    if (!checkRateLimit()) {
      toast.error('Too many votes! Please wait a moment.');
      return;
    }

    setVotingInProgress(songId);

    const song = songs?.find((s) => s.id === songId);
    const hasVoted = song?.user_voted;

    try {
      if (hasVoted) {
        // Remove vote
        const { error } = await supabase
          .from('votes')
          .delete()
          .eq('song_id', songId)
          .eq('voter_id', voterId);

        if (error) throw error;
      } else {
        // Add vote
        const { error } = await supabase.from('votes').insert({
          session_id: sessionId,
          song_id: songId,
          voter_id: voterId,
        });

        if (error) throw error;

        // Update first_vote_at if this is the first vote for the song
        if (song && !song.first_vote_at) {
          await supabase
            .from('songs')
            .update({ first_vote_at: new Date().toISOString() })
            .eq('id', songId);
        }

        // Track for rate limiting
        setVoteTimestamps((prev) => [...prev, Date.now()]);
      }

      refetchSongs();
    } catch (error) {
      console.error('Vote error:', error);
      toast.error('Failed to vote');
    } finally {
      setVotingInProgress(null);
    }
  };

  const filteredSongs = songs?.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (song.artist && song.artist.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (sessionLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Disc3 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <Music className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="font-display text-2xl font-bold mb-2">Session Not Found</h1>
        <p className="text-muted-foreground text-center">
          This session may have ended or the link is invalid.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-1/4 top-0 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute -right-1/4 bottom-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[100px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Disc3 className="h-6 w-6 text-primary animate-spin" style={{ animationDuration: '3s' }} />
            <span className="font-display font-bold">{session.name}</span>
          </div>
          <div className="flex items-center gap-2">
            {!session.is_voting_open && (
              <span className="text-xs bg-destructive/20 text-destructive px-2 py-1 rounded-full">
                Voting Locked
              </span>
            )}
            <Button
              size="sm"
              variant={showRequestPanel ? 'secondary' : 'default'}
              onClick={() => setShowRequestPanel(!showRequestPanel)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Request
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 space-y-6 relative z-10 max-w-lg">
        {/* Song Request Panel */}
        {showRequestPanel && (
          <GuestSongRequest
            sessionId={sessionId!}
            onSongRequested={() => {
              refetchSongs();
              setShowRequestPanel(false);
            }}
          />
        )}
        {/* Now Playing */}
        <NowPlayingCard
          song={currentSong}
          isPlaying={true}
          progress={50}
        />

        {/* Up Next */}
        <UpNextCard song={upNextSong} />

        {/* Song List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold">Vote for Songs</h2>
            <span className="text-sm text-muted-foreground">
              {songs?.length || 0} songs
            </span>
          </div>

          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search songs..."
          />

          <div className="mt-4 space-y-2">
            <AnimatePresence>
              {filteredSongs?.map((song, index) => (
                <SongCard
                  key={song.id}
                  song={song}
                  rank={index + 1}
                  onVote={handleVote}
                  isVoting={votingInProgress === song.id}
                  votingLocked={!session.is_voting_open}
                />
              ))}
            </AnimatePresence>

            {(!filteredSongs || filteredSongs.length === 0) && !songsLoading && (
              <div className="py-12 text-center">
                <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No songs yet</p>
                <p className="text-sm text-muted-foreground">Waiting for the host to add music...</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
