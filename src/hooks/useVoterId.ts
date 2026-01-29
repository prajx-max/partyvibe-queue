import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useVoterId(sessionId: string | undefined) {
  const [voterId, setVoterId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      setIsLoading(false);
      return;
    }

    const getOrCreateVoter = async () => {
      // Generate or retrieve device fingerprint
      let fingerprint = localStorage.getItem('partyvote_fingerprint');
      if (!fingerprint) {
        fingerprint = crypto.randomUUID();
        localStorage.setItem('partyvote_fingerprint', fingerprint);
      }

      // Check if voter exists for this session
      const { data: existingVoter } = await supabase
        .from('voters')
        .select('id')
        .eq('session_id', sessionId)
        .eq('device_fingerprint', fingerprint)
        .maybeSingle();

      if (existingVoter) {
        // Update last seen
        await supabase
          .from('voters')
          .update({ last_seen_at: new Date().toISOString() })
          .eq('id', existingVoter.id);
        setVoterId(existingVoter.id);
      } else {
        // Create new voter
        const { data: newVoter, error } = await supabase
          .from('voters')
          .insert({
            session_id: sessionId,
            device_fingerprint: fingerprint,
          })
          .select('id')
          .single();

        if (!error && newVoter) {
          setVoterId(newVoter.id);
        }
      }
      setIsLoading(false);
    };

    getOrCreateVoter();
  }, [sessionId]);

  return { voterId, isLoading };
}
