import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Lock, Unlock, RotateCcw, ArrowLeft } from 'lucide-react';
import { PartyBackground } from '@/components/PartyBackground';
import { Button } from '@/components/ui/button';
import { NowPlayingCard } from '@/components/NowPlayingCard';
import { UpNextCard } from '@/components/UpNextCard';
import { SongCard } from '@/components/SongCard';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';
import { AudioPlayer } from '@/components/AudioPlayer';
import { SongUpload } from '@/components/SongUpload';
import { JioSaavnSearch } from '@/components/JioSaavnSearch';
import { SearchBar } from '@/components/SearchBar';
import { useAuth } from '@/hooks/useAuth';
import { useSession } from '@/hooks/useSession';
import { useSongs, SongWithVotes } from '@/hooks/useSongs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import vibeJamLogo from '@/assets/vibejam-logo.png';

export default function HostDashboard() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { data: session, isLoading: sessionLoading, refetch: refetchSession } = useSession(sessionId);
  const { data: songs, isLoading: songsLoading, refetch: refetchSongs } = useSongs(sessionId, null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentSong, setCurrentSong] = useState<SongWithVotes | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate('/');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (session && user && session.host_id !== user.id) {
      toast.error("You're not the host of this session");
      navigate('/');
    }
  }, [session, user, navigate]);

  useEffect(() => {
    if (songs && songs.length > 0) {
      const topSong = songs[0];
      if (!currentSong || currentSong.id !== topSong.id) {
        if (!currentSong || progress >= 99) {
          setCurrentSong(topSong);
        }
      }
    }
  }, [songs]);

  const handleSongEnd = () => {
    setProgress(0);
    if (songs && songs.length > 1) {
      setCurrentSong(songs.find(s => s.id !== currentSong?.id) || null);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
      setCurrentSong(null);
    }
  };

  const toggleVoting = async () => {
    if (!session) return;
    const { error } = await supabase.from('sessions').update({ is_voting_open: !session.is_voting_open }).eq('id', session.id);
    if (error) toast.error('Failed to toggle voting');
    else { refetchSession(); toast.success(session.is_voting_open ? 'Voting locked' : 'Voting unlocked'); }
  };

  const resetVotes = async () => {
    if (!sessionId) return;
    const { error } = await supabase.from('votes').delete().eq('session_id', sessionId);
    if (error) toast.error('Failed to reset votes');
    else { refetchSongs(); toast.success('All votes reset'); }
  };

  const removeSong = async (songId: string) => {
    const { error } = await supabase.from('songs').update({ is_active: false }).eq('id', songId);
    if (error) toast.error('Failed to remove song');
    else {
      if (currentSong?.id === songId) handleSongEnd();
      refetchSongs();
      toast.success('Song removed');
    }
  };

  const handleVote = async () => { toast.info('Use the guest page to vote!'); };

  const filteredSongs = songs?.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (song.artist && song.artist.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const upNextSong = songs && songs.length > 1 ? songs.find(s => s.id !== currentSong?.id) : null;

  if (authLoading || sessionLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <h1 className="font-display text-2xl font-bold mb-4">Session not found</h1>
        <Button onClick={() => navigate('/')}>Go Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen party-gradient-bg">
      <PartyBackground />
      <header className="sticky top-0 z-50 border-b border-border/50 glass-heavy">
        <div className="container mx-auto flex items-center justify-between p-3 sm:p-4 gap-2">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="shrink-0 h-8 w-8 sm:h-10 sm:w-10">
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <div className="flex items-center gap-2 min-w-0">
              <img src={vibeJamLogo} alt="VibeJam" className="h-6 w-6 sm:h-7 sm:w-7 rounded-lg shrink-0" />
              <span className="font-display font-bold text-sm sm:text-base truncate">{session.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Button
              variant="outline" size="sm" onClick={toggleVoting}
              className={`text-xs sm:text-sm px-2 sm:px-3 ${session.is_voting_open ? '' : 'border-destructive text-destructive'}`}
            >
              {session.is_voting_open ? <><Unlock className="mr-1 sm:mr-2 h-3.5 w-3.5" /><span className="hidden sm:inline">Voting Open</span><span className="sm:hidden">Open</span></> : <><Lock className="mr-1 sm:mr-2 h-3.5 w-3.5" /><span className="hidden sm:inline">Voting Locked</span><span className="sm:hidden">Locked</span></>}
            </Button>
            <Button variant="outline" size="sm" onClick={resetVotes} className="text-xs sm:text-sm px-2 sm:px-3">
              <RotateCcw className="mr-1 h-3.5 w-3.5" /><span className="hidden sm:inline">Reset</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-3 sm:p-4 lg:p-6">
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <NowPlayingCard song={currentSong} isPlaying={isPlaying} progress={progress} onPlayPause={() => setIsPlaying(!isPlaying)} isHost />
            <AudioPlayer currentSong={currentSong} onSongEnd={handleSongEnd} onProgressChange={setProgress} isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
            <UpNextCard song={upNextSong} />

            <div>
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="font-display text-lg sm:text-xl font-semibold">Song Queue</h2>
                <span className="text-sm text-muted-foreground">{songs?.length || 0} songs</span>
              </div>
              <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search queue..." />
              <div className="mt-3 sm:mt-4 space-y-2 max-h-[350px] sm:max-h-[400px] overflow-y-auto">
                <AnimatePresence>
                  {filteredSongs?.map((song, index) => (
                    <SongCard key={song.id} song={song} rank={index + 1} onVote={handleVote} onRemove={removeSong} isHost votingLocked={!session.is_voting_open} />
                  ))}
                </AnimatePresence>
                {(!filteredSongs || filteredSongs.length === 0) && (
                  <p className="py-6 sm:py-8 text-center text-muted-foreground">No songs yet. Add some tracks!</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <QRCodeDisplay sessionId={session.id} sessionName={session.name} />
            <JioSaavnSearch sessionId={session.id} onSongAdded={refetchSongs} />
            <SongUpload sessionId={session.id} onUploadComplete={refetchSongs} />
          </div>
        </div>
      </main>
    </div>
  );
}
