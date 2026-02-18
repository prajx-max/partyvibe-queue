
-- Drop duplicate conflicting SELECT policies
DROP POLICY IF EXISTS "Anyone can view active songs in a session" ON public.songs;

-- The hosts can update songs policy requires auth.uid() check via sessions table.
-- Make sure there's no issue by also allowing hosts to update directly when authenticated.
-- The existing "Hosts can update songs" policy should work but let's verify it's correct by recreating it:
DROP POLICY IF EXISTS "Hosts can update songs" ON public.songs;

CREATE POLICY "Hosts can update songs"
ON public.songs FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM sessions
    WHERE sessions.id = songs.session_id
    AND sessions.host_id = auth.uid()
  )
);
