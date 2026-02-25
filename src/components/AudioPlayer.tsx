import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, SkipForward, SkipBack, Gauge } from 'lucide-react';
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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, [speed]);

  useEffect(() => {
    if (!currentSong || !audioRef.current) return;

    const audio = audioRef.current;
    audio.src = currentSong.file_url;
    audio.load();
    audio.playbackRate = speed;

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

  const handleSkip10 = (direction: 'forward' | 'back') => {
    if (audioRef.current && audioRef.current.duration) {
      const delta = direction === 'forward' ? 10 : -10;
      audioRef.current.currentTime = Math.max(0, Math.min(audioRef.current.duration, audioRef.current.currentTime + delta));
    }
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl glass-heavy border border-border/50 p-4 space-y-3"
    >
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      {/* Row 1: Volume + Playback controls */}
      <div className="flex items-center gap-3">
        {/* Mute toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMuted(!isMuted)}
          className="shrink-0 h-8 w-8 text-muted-foreground hover:text-primary"
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>

        {/* Volume slider */}
        <div className="w-24 shrink-0">
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

        <div className="flex-1" />

        {/* Skip 10s buttons */}
        <div className="flex items-center gap-1">
          <motion.div whileTap={{ scale: 0.9 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSkip10('back')}
              disabled={!currentSong}
              className="h-7 px-2 text-xs border-border/50 hover:border-primary/50 hover:text-primary"
            >
              -10s
            </Button>
          </motion.div>
          <motion.div whileTap={{ scale: 0.9 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSkip10('forward')}
              disabled={!currentSong}
              className="h-7 px-2 text-xs border-border/50 hover:border-primary/50 hover:text-primary"
            >
              +10s
            </Button>
          </motion.div>
        </div>

        {/* Skip to next song */}
        <motion.div whileTap={{ scale: 0.9 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSkip}
            disabled={!currentSong}
            className="gap-1.5 h-8 border-accent/30 text-accent hover:bg-accent/10 hover:border-accent/50"
          >
            <SkipForward className="h-4 w-4" />
            Skip
          </Button>
        </motion.div>
      </div>

      {/* Row 2: Speed control */}
      <div className="flex items-center gap-2">
        <Gauge className="h-4 w-4 text-muted-foreground shrink-0" />
        <span className="text-xs text-muted-foreground shrink-0">Speed:</span>
        <div className="flex items-center gap-1 flex-wrap">
          {SPEED_OPTIONS.map((s) => (
            <motion.button
              key={s}
              onClick={() => handleSpeedChange(s)}
              whileTap={{ scale: 0.9 }}
              className={`px-2 py-0.5 rounded text-xs font-medium transition-all ${
                speed === s
                  ? 'bg-primary text-primary-foreground glow-cyan'
                  : 'bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {s}×
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
