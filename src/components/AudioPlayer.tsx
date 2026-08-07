'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Music, ExternalLink, AlertCircle } from 'lucide-react';

interface AudioPlayerProps {
  url: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ url }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setIsPlaying(false);
    setAudioError(false);
  }, [url]);

  const togglePlay = async () => {
    if (!audioRef.current || audioError) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        // Asegurar que el audio esté cargado
        if (audioRef.current.readyState === 0) {
          audioRef.current.load();
        }
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn('[AudioPlayer] Error al reproducir:', err);
        setIsPlaying(false);
        setAudioError(true);
      }
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const handleError = () => {
    console.warn('[AudioPlayer] Error en la fuente de audio:', url);
    setIsPlaying(false);
    setAudioError(true);
  };

  if (!url || url.includes('no disponible')) {
    return (
      <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center text-xs text-slate-400 font-medium flex items-center justify-center gap-2">
        <Music className="w-4 h-4 text-slate-500" />
        <span>Muestra de audio no disponible para esta canción.</span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-emerald-500/25 shadow-xl shadow-emerald-500/5">
      <audio
        ref={audioRef}
        onEnded={handleEnded}
        onError={handleError}
        preload="auto"
        crossOrigin="anonymous"
      >
        <source src={url} type="audio/mp4" />
        <source src={url} type="audio/aac" />
        <source src={url} type="audio/mpeg" />
      </audio>

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
              {audioError ? 'Error de carga' : isPlaying ? 'Reproduciendo' : 'Listo'}
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

          {/* Enlace alternativo directo si el navegador bloquea el reproductor */}
          {audioError && (
            <div className="mt-2 text-right">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-400 hover:underline"
              >
                <span>Escuchar muestra directamente</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
