
-- Allow anonymous/guest users to insert songs (for song requests)
CREATE POLICY "Guests can request songs"
ON public.songs FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Also ensure guests can read songs
CREATE POLICY "Anyone can view active songs"
ON public.songs FOR SELECT
TO anon, authenticated
USING (is_active = true);
