import { useState, useRef, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, SkipForward } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { SongWithVotes } from '@/hooks/useSongs';

interface AudioPlayerProps {
  currentSong: SongWithVotes | null;
  onSongEnd: () => void;
  onProgressChange: (progress: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

export function AudioPlayer({ currentSong, onSongEnd, onProgressChange, isPlaying, setIsPlaying }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (!currentSong || !audioRef.current) return;

    const audio = audioRef.current;
    audio.src = currentSong.file_url;
    audio.load();
    
    if (isPlaying) {
      audio.play().catch(console.error);
    }
  }, [currentSong?.id]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch(console.error);
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current && audioRef.current.duration) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      onProgressChange(progress);
    }
  }, [onProgressChange]);

  const handleEnded = useCallback(() => {
    onProgressChange(0);
    onSongEnd();
  }, [onSongEnd, onProgressChange]);

  const handleSkip = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    onSongEnd();
  };

  return (
    <div className="flex items-center gap-4 rounded-xl bg-card border border-border p-4">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsMuted(!isMuted)}
        className="shrink-0"
      >
        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </Button>

      <div className="w-28">
        <Slider
          value={[isMuted ? 0 : volume]}
          max={100}
          step={1}
          onValueChange={(val) => {
            setVolume(val[0]);
            if (isMuted && val[0] > 0) setIsMuted(false);
          }}
          className="cursor-pointer"
        />
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={handleSkip}
        disabled={!currentSong}
        className="ml-auto gap-2"
      >
        <SkipForward className="h-4 w-4" />
        Skip
      </Button>
    </div>
  );
}
