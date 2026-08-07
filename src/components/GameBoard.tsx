'use client';

import React, { useState, useEffect } from 'react';
import { Pista, StreakInfo } from '@/types/game';
import { AudioPlayer } from './AudioPlayer';
import { Calendar, Tag, Disc, FileText, Music, Lock, PlusCircle, HelpCircle, Flame, AlertCircle, Sparkles, CheckCircle2, ArrowUpRight, X } from 'lucide-react';

interface GameBoardProps {
  cancionId: string;
  pistas: Pista[];
  totalPistas: number;
  onPedirPista: () => void;
  onEnviarRespuesta: (guess: string) => void;
  onRendirse: () => void;
  isLoadingPista: boolean;
  isSubmittingGuess: boolean;
  wrongGuesses?: string[];
  streakInfo: StreakInfo;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  cancionId,
  pistas,
  totalPistas,
  onPedirPista,
  onEnviarRespuesta,
  onRendirse,
  isLoadingPista,
  isSubmittingGuess,
  wrongGuesses = [],
  streakInfo,
}) => {
  const [guessInput, setGuessInput] = useState('');
  const [shakeInput, setShakeInput] = useState(false);

  // Estado del Comodín de 4 Opciones
  const [wildcardOptions, setWildcardOptions] = useState<string[]>([]);
  const [isLoadingWildcard, setIsLoadingWildcard] = useState<boolean>(false);
  const [usedWildcard, setUsedWildcard] = useState<boolean>(false);

  const pistasUsadas = pistas.length;
  const penaltyWildcard = usedWildcard ? 30 : 0;
  const puntajeMaximoActual = Math.max(10, 120 - pistasUsadas * 20 - penaltyWildcard);
  const progressPercent = (puntajeMaximoActual / 100) * 100;

  // Atajo de teclado: Alt + P para pedir pistas rápidamente
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        if (pistasUsadas < totalPistas && !isLoadingPista) {
          onPedirPista();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pistasUsadas, totalPistas, isLoadingPista, onPedirPista]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guessInput.trim()) return;

    if (wrongGuesses.includes(guessInput.trim().toLowerCase())) {
      setShakeInput(true);
      setTimeout(() => setShakeInput(false), 500);
      return;
    }

    onEnviarRespuesta(guessInput.trim());
    setGuessInput('');
  };

  const handleActivarComodin = async () => {
    if (usedWildcard || isLoadingWildcard) return;

    setIsLoadingWildcard(true);
    try {
      const res = await fetch('/api/game/options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cancion_id: cancionId }),
      });
      const data = await res.json();
      if (data.opciones && Array.isArray(data.opciones)) {
        setWildcardOptions(data.opciones);
        setUsedWildcard(true);
      }
    } catch (err) {
      console.error('Error al pedir opciones:', err);
    } finally {
      setIsLoadingWildcard(false);
    }
  };

  const getPistaIcon = (tipo: string) => {
    switch (tipo) {
      case 'anio':
        return <Calendar className="w-4 h-4 text-sky-700" />;
      case 'genero':
        return <Tag className="w-4 h-4 text-purple-700" />;
      case 'colaboradores':
        return <Disc className="w-4 h-4 text-amber-700" />;
      case 'letra':
        return <FileText className="w-4 h-4 text-rose-700" />;
      case 'audio':
        return <Music className="w-4 h-4 text-emerald-700" />;
      default:
        return <HelpCircle className="w-4 h-4 text-slate-700" />;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 pb-12">
      {/* Dynamic Score Panel & Streak Header */}
      <div className="pop-card p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full badge-yellow text-xs font-black uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>DESBLOQUEO PROGRESIVO</span>
              </div>

              {streakInfo.rachaActual > 0 && (
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full badge-orange text-xs font-black animate-pulse">
                  <span>🔥 Racha: {streakInfo.rachaActual}</span>
                </div>
              )}
            </div>

            <h2 className="font-black text-lg sm:text-xl text-[#0b0b0e] tracking-tight">
              Pistas Reveladas: <span className="underline decoration-[#facc15] decoration-4">{pistasUsadas}</span> de {totalPistas}
            </h2>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-center sm:text-right px-4 py-2 rounded-2xl bg-[#0b0b0e] text-white border-2 border-black shadow-md">
              <span className="text-[9.5px] uppercase font-mono tracking-widest text-white/70 block font-bold">
                Puntuación Posible
              </span>
              <span className="text-2xl font-black text-[#facc15] font-mono tracking-tight">
                +{puntajeMaximoActual} <span className="text-xs font-normal text-white/80">PTS</span>
              </span>
            </div>
          </div>
        </div>

        {/* Score Potential Bar with Scrubber Indicator */}
        <div className="space-y-1.5">
          <div className="relative h-3 w-full bg-black/10 rounded-full overflow-visible border border-black/10">
            <div
              className="h-full bg-[#0b0b0e] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-5 bg-[#facc15] border-2 border-[#0b0b0e] rounded-sm shadow-md transition-all duration-500"
              style={{ left: `calc(${progressPercent}% - 8px)` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-[#0b0b0e]/70 font-bold px-1">
            <span>20 PTS (Audio)</span>
            <span>60 PTS (Álbum)</span>
            <span>100 PTS (Año)</span>
          </div>
        </div>
      </div>

      {/* List of Revealed Clues */}
      <div className="space-y-4">
        {pistas.map((pista) => (
          <div key={pista.orden} className="pop-card p-5 sm:p-6 space-y-3.5 shadow-lg animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full badge-yellow flex items-center justify-center font-black text-xs">
                  0{pista.orden}
                </div>
                <div className="p-2 rounded-xl bg-white border border-black/15 shadow-sm">
                  {getPistaIcon(pista.tipo)}
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.18em] font-black text-[#0b0b0e]/60 block">
                    PISTA #{pista.orden} REVELADA
                  </span>
                  <h3 className="font-extrabold text-base text-[#0b0b0e] tracking-tight">
                    {pista.titulo}
                  </h3>
                </div>
              </div>

              <div className="w-6 h-6 rounded-full badge-green flex items-center justify-center">
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>

            {pista.tipo === 'audio' ? (
              <AudioPlayer url={pista.contenido} />
            ) : (
              <div className="p-4 rounded-2xl bg-white/80 border border-black/15 shadow-inner">
                <p className="text-sm sm:text-base text-[#0b0b0e] font-semibold leading-relaxed">
                  {pista.contenido}
                </p>
              </div>
            )}
          </div>
        ))}

        {/* Locked Clues Placeholders */}
        {Array.from({ length: totalPistas - pistasUsadas }).map((_, idx) => {
          const lockedNum = pistasUsadas + idx + 1;
          return (
            <div
              key={lockedNum}
              className="rounded-3xl p-4 border-2 border-dashed border-black/20 bg-white/30 text-[#0b0b0e]/60 flex items-center justify-between backdrop-blur-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center font-mono text-xs font-bold">
                  0{lockedNum}
                </div>
                <div className="p-2 rounded-xl bg-white/50 border border-black/10 text-black/50">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.18em] font-black text-black/40 block">
                    BLOQUEADA
                  </span>
                  <span className="text-xs font-bold text-[#0b0b0e]/70">
                    Pista #{lockedNum} por desbloquear
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold badge-yellow px-3 py-1 rounded-full">
                -{lockedNum * 20} pts
              </span>
            </div>
          );
        })}
      </div>

      {/* Comodín de 4 Opciones Múltiples */}
      {wildcardOptions.length > 0 && (
        <div className="pop-card p-5 space-y-3.5 shadow-xl animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full badge-purple flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-extrabold text-[#0b0b0e]">
              Comodín Activado: Selecciona una de las 4 opciones (-30 pts)
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {wildcardOptions.map((option, i) => (
              <button
                key={i}
                onClick={() => onEnviarRespuesta(option)}
                disabled={isSubmittingGuess}
                className="p-4 rounded-2xl bg-white border-2 border-black hover:bg-[#facc15] text-[#0b0b0e] font-black text-xs text-left transition-all active:scale-95 flex items-center justify-between shadow-md group"
              >
                <span>{option}</span>
                <CheckCircle2 className="w-4 h-4 text-black opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Wrong Guesses History Chips */}
      {wrongGuesses.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-black text-rose-700">
            <AlertCircle className="w-4 h-4" />
            <span>Intentos fallidos en esta partida:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {wrongGuesses.map((guess, idx) => (
              <span
                key={idx}
                className="text-xs font-mono px-3 py-1 rounded-full bg-white border border-rose-400 text-rose-700 font-bold line-through decoration-rose-500 shadow-sm"
              >
                {guess}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Control Panel & Input Bar */}
      <div className="pop-card p-5 sm:p-6 space-y-4 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={guessInput}
                onChange={(e) => setGuessInput(e.target.value)}
                placeholder="Escribe el título exacto de la canción..."
                className={`w-full bg-white border-2 text-[#0b0b0e] placeholder-black/40 rounded-full pl-5 pr-10 py-3.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-black/10 transition-all ${
                  shakeInput 
                    ? 'border-rose-500 animate-bounce' 
                    : 'border-black/20 focus:border-black'
                }`}
                disabled={isSubmittingGuess}
              />
              {guessInput && (
                <button
                  type="button"
                  onClick={() => setGuessInput('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/10 hover:bg-black/20 text-[#0b0b0e] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={!guessInput.trim() || isSubmittingGuess}
              className="px-6 py-3.5 rounded-full badge-yellow hover:brightness-105 disabled:opacity-40 text-[#0b0b0e] font-black text-xs flex items-center gap-2 shadow-lg transition-all active:scale-95 shrink-0 group"
            >
              <span>Adivinar</span>
              <ArrowUpRight className="w-4 h-4 stroke-[3] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[10.5px] font-mono text-[#0b0b0e]/50 px-2 font-bold">
            <span>Atajo: [Enter ↵] Adivinar</span>
            <span>[Alt + P] Pista (+ Pista)</span>
          </div>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-black/10">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onPedirPista}
              disabled={pistasUsadas >= totalPistas || isLoadingPista}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black text-[#0b0b0e] bg-white border border-black/20 hover:bg-white/80 disabled:opacity-40 transition-all active:scale-95 shadow-sm group"
              title="Pulsar Alt+P"
            >
              <PlusCircle className="w-4 h-4 text-black group-hover:scale-110 transition-transform" />
              <span>{isLoadingPista ? 'Desbloqueando...' : 'Pedir más pistas (-20 pts)'}</span>
            </button>

            {!usedWildcard && (
              <button
                onClick={handleActivarComodin}
                disabled={isLoadingWildcard}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black text-purple-900 bg-purple-200 border border-purple-400 hover:bg-purple-300 disabled:opacity-40 transition-all active:scale-95 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-700" />
                <span>{isLoadingWildcard ? 'Cargando...' : 'Comodín 4 Opciones (-30 pts)'}</span>
              </button>
            )}
          </div>

          <button
            onClick={onRendirse}
            className="text-xs font-bold text-black/60 hover:text-rose-700 px-4 py-2 rounded-full hover:bg-rose-500/10 transition-colors"
          >
            Rendirme y ver respuesta
          </button>
        </div>
      </div>
    </div>
  );
};


