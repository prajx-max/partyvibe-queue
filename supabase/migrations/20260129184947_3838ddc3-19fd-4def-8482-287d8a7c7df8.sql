-- Create sessions table (party events)
CREATE TABLE public.sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  host_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  passcode TEXT,
  is_voting_open BOOLEAN NOT NULL DEFAULT true,
  current_song_id UUID,
  now_playing_started_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create songs table
CREATE TABLE public.songs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  artist TEXT,
  duration INTEGER, -- in seconds
  file_url TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  first_vote_at TIMESTAMP WITH TIME ZONE
);

-- Create voters table (anonymous guest identities)
CREATE TABLE public.voters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
  device_fingerprint TEXT NOT NULL,
  last_seen_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(session_id, device_fingerprint)
);

-- Create votes table
CREATE TABLE public.votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
  song_id UUID REFERENCES public.songs(id) ON DELETE CASCADE NOT NULL,
  voter_id UUID REFERENCES public.voters(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(song_id, voter_id)
);

-- Add foreign key for current_song_id after songs table exists
ALTER TABLE public.sessions 
ADD CONSTRAINT sessions_current_song_id_fkey 
FOREIGN KEY (current_song_id) REFERENCES public.songs(id) ON DELETE SET NULL;

-- Enable RLS on all tables
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Sessions policies
CREATE POLICY "Anyone can view sessions" ON public.sessions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create sessions" ON public.sessions FOR INSERT TO authenticated WITH CHECK (auth.uid() = host_id);
CREATE POLICY "Hosts can update their sessions" ON public.sessions FOR UPDATE TO authenticated USING (auth.uid() = host_id);
CREATE POLICY "Hosts can delete their sessions" ON public.sessions FOR DELETE TO authenticated USING (auth.uid() = host_id);

-- Songs policies
CREATE POLICY "Anyone can view active songs in a session" ON public.songs FOR SELECT USING (is_active = true);
CREATE POLICY "Hosts can insert songs" ON public.songs FOR INSERT TO authenticated 
  WITH CHECK (EXISTS (SELECT 1 FROM public.sessions WHERE id = session_id AND host_id = auth.uid()));
CREATE POLICY "Hosts can update songs" ON public.songs FOR UPDATE TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.sessions WHERE id = session_id AND host_id = auth.uid()));
CREATE POLICY "Hosts can delete songs" ON public.songs FOR DELETE TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.sessions WHERE id = session_id AND host_id = auth.uid()));

-- Voters policies (anonymous access)
CREATE POLICY "Anyone can view voters" ON public.voters FOR SELECT USING (true);
CREATE POLICY "Anyone can create voter identity" ON public.voters FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update their voter" ON public.voters FOR UPDATE USING (true);

-- Votes policies (anonymous voting)
CREATE POLICY "Anyone can view votes" ON public.votes FOR SELECT USING (true);
CREATE POLICY "Anyone can vote" ON public.votes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can remove their vote" ON public.votes FOR DELETE USING (true);

-- Create storage bucket for songs
INSERT INTO storage.buckets (id, name, public) VALUES ('songs', 'songs', true);

-- Storage policies for songs bucket
CREATE POLICY "Anyone can view song files" ON storage.objects FOR SELECT USING (bucket_id = 'songs');
CREATE POLICY "Authenticated users can upload songs" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'songs');
CREATE POLICY "Users can delete their uploaded songs" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'songs');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for sessions updated_at
CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON public.sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.songs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.votes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.voters;