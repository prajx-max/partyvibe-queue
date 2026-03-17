import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, SkipForward, Gauge } from 'lucide-react';
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

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export function AudioPlayer({ currentSong, onSongEnd, onProgressChange, isPlaying, setIsPlaying }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => { if (audioRef.current) audioRef.current.volume = isMuted ? 0 : volume / 100; }, [volume, isMuted]);
  useEffect(() => { if (audioRef.current) audioRef.current.playbackRate = speed; }, [speed]);

  useEffect(() => {
    if (!currentSong || !audioRef.current) return;
    const audio = audioRef.current;
    audio.src = currentSong.file_url;
    audio.load();
    audio.playbackRate = speed;
    if (isPlaying) audio.play().catch(console.error);
  }, [currentSong?.id]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.play().catch(console.error);
    else audioRef.current.pause();
  }, [isPlaying]);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current && audioRef.current.duration) {
      onProgressChange((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  }, [onProgressChange]);

  const handleEnded = useCallback(() => { onProgressChange(0); onSongEnd(); }, [onSongEnd, onProgressChange]);

  const handleSkip = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
    onSongEnd();
  };

  const handleSkip10 = (direction: 'forward' | 'back') => {
    if (audioRef.current && audioRef.current.duration) {
      const delta = direction === 'forward' ? 10 : -10;
      audioRef.current.currentTime = Math.max(0, Math.min(audioRef.current.duration, audioRef.current.currentTime + delta));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl glass-heavy border border-border/50 p-4 space-y-3"
    >
      <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onEnded={handleEnded} />

      <div className="flex items-center gap-3 flex-wrap">
        <Button variant="ghost" size="icon" onClick={() => setIsMuted(!isMuted)} className="shrink-0 h-10 w-10 text-muted-foreground hover:text-primary">
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
        <div className="w-24 shrink-0">
          <Slider value={[isMuted ? 0 : volume]} max={100} step={1} onValueChange={(val) => { setVolume(val[0]); if (isMuted && val[0] > 0) setIsMuted(false); }} className="cursor-pointer" />
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={() => handleSkip10('back')} disabled={!currentSong} className="h-9 px-3 text-xs rounded-lg">-10s</Button>
          <Button variant="outline" size="sm" onClick={() => handleSkip10('forward')} disabled={!currentSong} className="h-9 px-3 text-xs rounded-lg">+10s</Button>
        </div>
        <Button variant="outline" size="sm" onClick={handleSkip} disabled={!currentSong} className="gap-1.5 h-9 border-primary/30 text-primary hover:bg-primary/10 rounded-lg">
          <SkipForward className="h-4 w-4" />
          Skip
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Gauge className="h-4 w-4 text-muted-foreground shrink-0" />
        <span className="text-xs text-muted-foreground shrink-0">Speed:</span>
        <div className="flex items-center gap-1 flex-wrap">
          {SPEED_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-all min-h-[32px] ${
                speed === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
              }`}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
