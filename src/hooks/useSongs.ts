import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SongWithVotes {
  id: string;
  session_id: string;
  title: string;
  artist: string | null;
  duration: number | null;
  file_url: string;
  is_active: boolean;
  added_at: string;
  first_vote_at: string | null;
  vote_count: number;
  user_voted: boolean;
}

export function useSongs(sessionId: string | undefined, voterId: string | null) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['songs', sessionId, voterId],
    queryFn: async () => {
      if (!sessionId) throw new Error('No session ID');

      // Fetch songs with vote counts
      const { data: songs, error: songsError } = await supabase
        .from('songs')
        .select('*')
        .eq('session_id', sessionId)
        .eq('is_active', true)
        .order('added_at', { ascending: true });

      if (songsError) throw songsError;

      // Fetch all votes for this session
      const { data: votes, error: votesError } = await supabase
        .from('votes')
        .select('song_id, voter_id')
        .eq('session_id', sessionId);

      if (votesError) throw votesError;

      // Process songs with vote data
      const songsWithVotes: SongWithVotes[] = songs.map((song) => {
        const songVotes = votes.filter((v) => v.song_id === song.id);
        return {
          ...song,
          vote_count: songVotes.length,
          user_voted: voterId ? songVotes.some((v) => v.voter_id === voterId) : false,
        };
      });

      // Sort by votes (desc), then by first_vote_at (asc) for tie-breaking
      return songsWithVotes.sort((a, b) => {
        if (b.vote_count !== a.vote_count) {
          return b.vote_count - a.vote_count;
        }
        // Tie-breaker: earliest first vote
        if (a.first_vote_at && b.first_vote_at) {
          return new Date(a.first_vote_at).getTime() - new Date(b.first_vote_at).getTime();
        }
        if (a.first_vote_at) return -1;
        if (b.first_vote_at) return 1;
        return new Date(a.added_at).getTime() - new Date(b.added_at).getTime();
      });
    },
    enabled: !!sessionId,
    refetchInterval: 5000, // Fallback polling
  });

  // Real-time subscription
  useEffect(() => {
    if (!sessionId) return;

    const channel = supabase
      .channel(`songs-${sessionId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'songs', filter: `session_id=eq.${sessionId}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ['songs', sessionId] });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'votes', filter: `session_id=eq.${sessionId}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ['songs', sessionId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, queryClient]);

  return query;
}
