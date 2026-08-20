import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Music } from 'lucide-react';
import { CoupleSiteThemeConfig } from '../types';

interface CoupleMusicPlayerBarProps {
  musicUrl?: string;
  musicTitle?: string;
  autoplay?: boolean;
  theme: CoupleSiteThemeConfig;
}

export const CoupleMusicPlayerBar: React.FC<CoupleMusicPlayerBarProps> = ({
  musicUrl,
  musicTitle = 'Acoustic Reverie',
  autoplay = false,
  theme
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (autoplay && musicUrl && audioRef.current && !hasStarted) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasStarted(true);
        })
        .catch(() => {
          // Autoplay blocked by browser until user gesture
          setIsPlaying(false);
        });
    }
  }, [autoplay, musicUrl, hasStarted]);

  const togglePlay = () => {
    if (!audioRef.current || !musicUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasStarted(true);
        })
        .catch(() => setIsPlaying(false));
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  if (!musicUrl) return null;

  return (
    <div
      id="couple-music-floating-player"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-4 py-2.5 rounded-full shadow-2xl backdrop-blur-md border transition-all duration-300 hover:scale-105"
      style={{
        backgroundColor: `${theme.palette.surface}E6`,
        borderColor: theme.palette.border,
        color: theme.palette.textPrimary
      }}
    >
      <audio
        ref={audioRef}
        src={musicUrl}
        loop
        preload="auto"
        onEnded={() => setIsPlaying(false)}
      />

      <button
        onClick={togglePlay}
        className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 cursor-pointer shrink-0"
        style={{
          backgroundColor: theme.palette.primary,
          color: theme.palette.background
        }}
        title={isPlaying ? 'Pause Music' : 'Play Soundtrack'}
      >
        {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
      </button>

      <div className="flex flex-col min-w-0 pr-1">
        <div className="flex items-center gap-1.5">
          <Music className="w-3 h-3 shrink-0" style={{ color: theme.palette.accent }} />
          <span className="text-[11px] font-semibold truncate max-w-[130px]" style={{ color: theme.palette.textPrimary }}>
            {musicTitle}
          </span>
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          {/* Animated sound bars */}
          <div className="flex items-center gap-0.5 h-2">
            {[40, 90, 60, 100, 50].map((h, i) => (
              <div
                key={i}
                className={`w-0.5 rounded-full transition-all ${
                  isPlaying ? 'animate-pulse' : 'h-1'
                }`}
                style={{
                  height: isPlaying ? `${h}%` : '2px',
                  backgroundColor: theme.palette.accent,
                  animationDelay: `${i * 120}ms`
                }}
              />
            ))}
          </div>
          <span className="text-[9px] uppercase tracking-wider ml-1" style={{ color: theme.palette.textSecondary }}>
            {isPlaying ? 'Playing' : 'Paused'}
          </span>
        </div>
      </div>

      <button
        onClick={toggleMute}
        className="p-1 rounded-full hover:opacity-80 transition-opacity cursor-pointer text-xs"
        style={{ color: theme.palette.textSecondary }}
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};
