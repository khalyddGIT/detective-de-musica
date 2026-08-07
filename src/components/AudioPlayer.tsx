'use client';

import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, Music } from 'lucide-react';

interface AudioPlayerProps {
  url: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ url }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  if (!url || url.includes('no disponible')) {
    return (
      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center text-xs text-slate-400 font-medium">
        <Music className="w-5 h-5 mx-auto mb-1.5 text-slate-600" />
        Muestra de audio no disponible para esta canción.
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-emerald-500/25 shadow-xl shadow-emerald-500/5">
      <audio
        ref={audioRef}
        src={url}
        onEnded={handleEnded}
        preload="metadata"
      />
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-400/25 transition-transform active:scale-95 shrink-0"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-emerald-400" />
              Muestra de Audio (30 Segundos)
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
              {isPlaying ? 'Reproduciendo' : 'Pausa / Listo'}
            </span>
          </div>

          {/* Sound wave visualizer */}
          <div className="flex items-center gap-1.5 h-7 px-1 bg-slate-950/80 rounded-xl p-1.5 border border-slate-800">
            {[40, 75, 35, 95, 55, 85, 45, 65, 100, 35, 85, 55, 95, 45, 75, 35, 65, 90, 50, 80].map((height, i) => (
              <div
                key={i}
                className={`flex-1 rounded-full transition-all duration-200 ${
                  isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-slate-800'
                }`}
                style={{
                  height: isPlaying ? `${Math.max(20, (height * (0.6 + Math.sin(i + Date.now()/200) * 0.4)) % 100)}%` : '25%',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
