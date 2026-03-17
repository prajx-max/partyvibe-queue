import { useState, useRef } from 'react';
import { Upload, Music, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SongUploadProps {
  sessionId: string;
  onUploadComplete: () => void;
}

interface PendingSong {
  file: File;
  title: string;
  artist: string;
}

export function SongUpload({ sessionId, onUploadComplete }: SongUploadProps) {
  const [pendingSongs, setPendingSongs] = useState<PendingSong[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const mp3Files = files.filter((f) => f.type === 'audio/mpeg' || f.name.endsWith('.mp3'));
    const newSongs: PendingSong[] = mp3Files.map((file) => {
      const nameWithoutExt = file.name.replace(/\.mp3$/i, '');
      const parts = nameWithoutExt.split(' - ');
      return { file, title: parts.length > 1 ? parts[1].trim() : nameWithoutExt, artist: parts.length > 1 ? parts[0].trim() : '' };
    });
    setPendingSongs((prev) => [...prev, ...newSongs]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePendingSong = (index: number) => setPendingSongs((prev) => prev.filter((_, i) => i !== index));

  const updatePendingSong = (index: number, field: 'title' | 'artist', value: string) => {
    setPendingSongs((prev) => prev.map((song, i) => (i === index ? { ...song, [field]: value } : song)));
  };

  const uploadSongs = async () => {
    if (pendingSongs.length === 0) return;
    setIsUploading(true);
    try {
      for (const song of pendingSongs) {
        const fileName = `${sessionId}/${Date.now()}-${song.file.name}`;
        const { error: uploadError } = await supabase.storage.from('songs').upload(fileName, song.file);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('songs').getPublicUrl(fileName);
        const duration = await getAudioDuration(song.file);
        const { error: insertError } = await supabase.from('songs').insert({ session_id: sessionId, title: song.title || 'Untitled', artist: song.artist || null, duration, file_url: urlData.publicUrl });
        if (insertError) throw insertError;
      }
      toast.success(`${pendingSongs.length} song(s) added!`);
      setPendingSongs([]);
      onUploadComplete();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload songs');
    } finally {
      setIsUploading(false);
    }
  };

  const getAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.addEventListener('loadedmetadata', () => resolve(Math.round(audio.duration)));
      audio.addEventListener('error', () => resolve(0));
      audio.src = URL.createObjectURL(file);
    });
  };

  return (
    <div className="rounded-xl glass-heavy p-4">
      <h3 className="font-display text-lg font-semibold mb-4">Add Songs</h3>

      <div className="mb-4">
        <input ref={fileInputRef} type="file" accept="audio/mpeg,.mp3" multiple onChange={handleFileSelect} className="hidden" id="song-upload" />
        <Label
          htmlFor="song-upload"
          className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border p-6 transition-colors hover:border-primary hover:bg-muted/50 min-h-[44px]"
        >
          <Upload className="h-5 w-5 text-muted-foreground" />
          <span className="text-muted-foreground text-sm">Drop MP3 files or click to browse</span>
        </Label>
      </div>

      {pendingSongs.length > 0 && (
        <div className="space-y-3 mb-4">
          {pendingSongs.map((song, index) => (
            <div key={index} className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background">
                <Music className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 space-y-2">
                <Input placeholder="Song title" value={song.title} onChange={(e) => updatePendingSong(index, 'title', e.target.value)} className="h-9 bg-background rounded-lg" />
                <Input placeholder="Artist" value={song.artist} onChange={(e) => updatePendingSong(index, 'artist', e.target.value)} className="h-9 bg-background rounded-lg" />
              </div>
              <Button variant="ghost" size="icon" onClick={() => removePendingSong(index)} className="shrink-0 h-10 w-10">
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {pendingSongs.length > 0 && (
        <Button onClick={uploadSongs} disabled={isUploading} className="w-full glow-primary rounded-lg min-h-[44px]">
          {isUploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Uploading...</> : `Add ${pendingSongs.length} Song${pendingSongs.length > 1 ? 's' : ''}`}
        </Button>
      )}
    </div>
  );
}
