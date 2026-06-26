
-- 1. Drop unused passcode column
ALTER TABLE public.sessions DROP COLUMN IF EXISTS passcode;

-- 2. Lock down voters UPDATE
DROP POLICY IF EXISTS "Anyone can update their voter" ON public.voters;

-- 3. Replace votes DELETE with RPC
DROP POLICY IF EXISTS "Anyone can remove their vote" ON public.votes;

CREATE OR REPLACE FUNCTION public.delete_my_vote(p_voter_id uuid, p_song_id uuid, p_fingerprint text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.voters
    WHERE id = p_voter_id AND device_fingerprint = p_fingerprint
  ) THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;
  DELETE FROM public.votes WHERE voter_id = p_voter_id AND song_id = p_song_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.delete_my_vote(uuid, uuid, text) TO anon, authenticated;

-- 4. Restrict guest song inserts to open sessions
DROP POLICY IF EXISTS "Guests can request songs" ON public.songs;
CREATE POLICY "Guests can request songs into open sessions"
ON public.songs FOR INSERT
TO anon, authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.sessions
    WHERE sessions.id = songs.session_id
      AND sessions.is_voting_open = true
  )
);

-- 5. Storage policies: scope to session host
DROP POLICY IF EXISTS "Users can delete their uploaded songs" ON storage.objects;
CREATE POLICY "Hosts can delete their session song files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'songs'
  AND EXISTS (
    SELECT 1 FROM public.sessions
    WHERE sessions.id::text = (storage.foldername(name))[1]
      AND sessions.host_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Anyone can view song files" ON storage.objects;
CREATE POLICY "Hosts can list their session song files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'songs'
  AND EXISTS (
    SELECT 1 FROM public.sessions
    WHERE sessions.id::text = (storage.foldername(name))[1]
      AND sessions.host_id = auth.uid()
  )
);
