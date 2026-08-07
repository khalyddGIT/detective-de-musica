'use client';

import React, { useState } from 'react';
import { Pista, StreakInfo } from '@/types/game';
import { AudioPlayer } from './AudioPlayer';
import { Calendar, Tag, Disc, FileText, Music, Lock, Send, PlusCircle, HelpCircle, Flame, AlertCircle, Sparkles, HelpCircle as HelpIcon, CheckCircle2 } from 'lucide-react';

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
  // Si usó el comodín de opciones, restar 30 pts adicionales
  const penaltyWildcard = usedWildcard ? 30 : 0;
  const puntajeMaximoActual = Math.max(10, 120 - pistasUsadas * 20 - penaltyWildcard);
  const progressPercent = (puntajeMaximoActual / 100) * 100;

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
        return <Calendar className="w-4 h-4 text-sky-400" />;
      case 'genero':
        return <Tag className="w-4 h-4 text-purple-400" />;
      case 'colaboradores':
        return <Disc className="w-4 h-4 text-amber-400" />;
      case 'letra':
        return <FileText className="w-4 h-4 text-rose-400" />;
      case 'audio':
        return <Music className="w-4 h-4 text-emerald-400" />;
      default:
        return <HelpCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 pb-12">
      {/* Dynamic Score Panel & Streak Header */}
      <div className="bezel-outer">
        <div className="bezel-inner p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-[10px] uppercase tracking-[0.2em] font-bold">
                  <Flame className="w-3.5 h-3.5 fill-amber-400/30" />
                  <span>DESBLOQUEO PROGRESIVO</span>
                </div>

                {streakInfo.rachaActual > 0 && (
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 font-mono text-[10px] font-bold animate-pulse">
                    <span>🔥 Racha: {streakInfo.rachaActual}</span>
                  </div>
                )}
              </div>

              <h2 className="font-extrabold text-base sm:text-lg text-slate-100 tracking-tight">
                Pistas Reveladas: {pistasUsadas} de {totalPistas}
              </h2>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-center sm:text-right px-4 py-2 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-inner">
                <span className="text-[9.5px] uppercase font-mono tracking-widest text-slate-400 block font-bold">
                  Puntuación Posible
                </span>
                <span className="text-2xl font-black text-emerald-400 font-mono tracking-tight">
                  +{puntajeMaximoActual} <span className="text-xs font-normal text-emerald-500/80">PTS</span>
                </span>
              </div>
            </div>
          </div>

          {/* Score Potential Bar */}
          <div className="space-y-1">
            <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/80 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[9.5px] font-mono text-slate-500 font-bold px-1">
              <span>20 PTS (Audio)</span>
              <span>60 PTS (Álbum)</span>
              <span>100 PTS (Año)</span>
            </div>
          </div>
        </div>
      </div>

      {/* List of Revealed Clues */}
      <div className="space-y-4">
        {pistas.map((pista) => (
          <div key={pista.orden} className="bezel-outer animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="bezel-inner p-5 sm:p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 shadow-inner">
                    {getPistaIcon(pista.tipo)}
                  </div>
                  <div>
                    <span className="text-[9.5px] font-mono uppercase tracking-[0.2em] font-bold text-emerald-400/90 block">
                      PISTA REVELADA #{pista.orden}
                    </span>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-100 tracking-tight">
                      {pista.titulo}
                    </h3>
                  </div>
                </div>
              </div>

              {pista.tipo === 'audio' ? (
                <AudioPlayer url={pista.contenido} />
              ) : (
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
                  <p className="text-sm text-slate-200 leading-relaxed font-normal">
                    {pista.contenido}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Locked Clues Placeholders */}
        {Array.from({ length: totalPistas - pistasUsadas }).map((_, idx) => {
          const lockedNum = pistasUsadas + idx + 1;
          return (
            <div
              key={lockedNum}
              className="rounded-2xl p-4 border border-dashed border-slate-800/80 bg-slate-950/30 text-slate-500 flex items-center justify-between backdrop-blur-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-600">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9.5px] font-mono uppercase tracking-[0.18em] font-bold text-slate-600 block">
                    BLOQUEADA
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    Pista #{lockedNum} por desbloquear
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-mono font-semibold text-slate-500 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
                -{lockedNum * 20} pts
              </span>
            </div>
          );
        })}
      </div>

      {/* Comodín de 4 Opciones Múltiples */}
      {wildcardOptions.length > 0 && (
        <div className="bezel-outer animate-in fade-in zoom-in-95 duration-300">
          <div className="bezel-inner p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold text-purple-300">
                Comodín Activado: Selecciona una de las 4 opciones (-30 pts)
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {wildcardOptions.map((option, i) => (
                <button
                  key={i}
                  onClick={() => onEnviarRespuesta(option)}
                  disabled={isSubmittingGuess}
                  className="p-3.5 rounded-xl bg-slate-950 border border-purple-500/30 hover:border-purple-400 hover:bg-purple-500/10 text-slate-100 font-bold text-xs text-left transition-all active:scale-95 flex items-center justify-between group"
                >
                  <span>{option}</span>
                  <CheckCircle2 className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Wrong Guesses History Chips */}
      {wrongGuesses.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/15 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
            <AlertCircle className="w-4 h-4" />
            <span>Intentos fallidos en esta partida:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {wrongGuesses.map((guess, idx) => (
              <span
                key={idx}
                className="text-xs font-mono px-3 py-1 rounded-full bg-slate-950 border border-rose-500/30 text-slate-300 line-through decoration-rose-500/60"
              >
                {guess}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Control Panel & Input Bar */}
      <div className="bezel-outer">
        <div className="bezel-inner p-5 sm:p-6 space-y-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={guessInput}
              onChange={(e) => setGuessInput(e.target.value)}
              placeholder="Escribe el título exacto de la canción..."
              className={`flex-1 bg-slate-950 border text-slate-100 placeholder-slate-500 rounded-full px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium ${
                shakeInput 
                  ? 'border-rose-500 animate-bounce' 
                  : 'border-slate-800 focus:border-emerald-500/80'
              }`}
              disabled={isSubmittingGuess}
            />
            <button
              type="submit"
              disabled={!guessInput.trim() || isSubmittingGuess}
              className="pl-5 pr-2 py-2 rounded-full bg-emerald-400 hover:bg-emerald-300 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-400/20 transition-all active:scale-95 shrink-0 group"
            >
              <span>Adivinar</span>
              <div className="w-8 h-8 rounded-full bg-slate-950/15 flex items-center justify-center text-slate-950 group-hover:translate-x-0.5 transition-transform">
                <Send className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
            </button>
          </form>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={onPedirPista}
                disabled={pistasUsadas >= totalPistas || isLoadingPista}
                className="flex items-center gap-2 pl-4 pr-2 py-2 rounded-full text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 disabled:opacity-40 transition-all active:scale-95 group"
              >
                <span>{isLoadingPista ? 'Desbloqueando...' : 'Pedir más pistas (-20 pts)'}</span>
                <div className="w-6 h-6 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform">
                  <PlusCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </button>

              {!usedWildcard && (
                <button
                  onClick={handleActivarComodin}
                  disabled={isLoadingWildcard}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold text-purple-300 bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 disabled:opacity-40 transition-all active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>{isLoadingWildcard ? 'Cargando...' : 'Comodín 4 Opciones (-30 pts)'}</span>
                </button>
              )}
            </div>

            <button
              onClick={onRendirse}
              className="text-xs font-semibold text-slate-400 hover:text-rose-400 px-4 py-2 rounded-full hover:bg-rose-500/10 transition-colors"
            >
              Rendirme y ver respuesta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
