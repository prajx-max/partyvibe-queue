ALTER TABLE public.songs ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.songs ADD COLUMN IF NOT EXISTS pinned_at TIMESTAMP WITH TIME ZONE;
CREATE INDEX IF NOT EXISTS idx_songs_pinned_at ON public.songs(pinned_at) WHERE pinned_at IS NOT NULL;