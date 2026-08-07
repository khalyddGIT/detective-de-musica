'use client';

import React, { useState } from 'react';
import { Pista } from '@/types/game';
import { AudioPlayer } from './AudioPlayer';
import { Calendar, Tag, Disc, FileText, Music, Lock, Send, PlusCircle, HelpCircle, Flame, ArrowRight } from 'lucide-react';

interface GameBoardProps {
  cancionId: string;
  pistas: Pista[];
  totalPistas: number;
  onPedirPista: () => void;
  onEnviarRespuesta: (guess: string) => void;
  onRendirse: () => void;
  isLoadingPista: boolean;
  isSubmittingGuess: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  pistas,
  totalPistas,
  onPedirPista,
  onEnviarRespuesta,
  onRendirse,
  isLoadingPista,
  isSubmittingGuess,
}) => {
  const [guessInput, setGuessInput] = useState('');

  const pistasUsadas = pistas.length;
  const puntajeMaximoActual = Math.max(20, 120 - pistasUsadas * 20);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guessInput.trim()) return;
    onEnviarRespuesta(guessInput.trim());
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
      {/* Dynamic Score Indicator Panel with Double-Bezel */}
      <div className="bezel-outer">
        <div className="bezel-inner p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-[10px] uppercase tracking-[0.2em] font-bold">
              <Flame className="w-3.5 h-3.5 fill-amber-400/30" />
              <span>DESBLOQUEO PROGRESIVO</span>
            </div>
            <h2 className="font-extrabold text-base sm:text-lg text-slate-100 tracking-tight">
              Pistas Reveladas: {pistasUsadas} de {totalPistas}
            </h2>
            <p className="text-xs text-slate-400 max-w-md">
              Adivina con las primeras pistas para asegurar la máxima puntuación en el ranking.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-center sm:text-right px-4 py-2 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-inner">
              <span className="text-[9.5px] uppercase font-mono tracking-widest text-slate-400 block font-bold">
                Puntuación Máxima
              </span>
              <span className="text-2xl font-black text-emerald-400 font-mono tracking-tight">
                +{puntajeMaximoActual} <span className="text-xs font-normal text-emerald-500/80">PTS</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* List of Revealed Clues with Double-Bezel Cards */}
      <div className="space-y-4">
        {pistas.map((pista) => (
          <div key={pista.orden} className="bezel-outer animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="bezel-inner p-5 sm:p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shadow-inner">
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
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
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
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-600">
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
              <span className="text-[11px] font-mono font-semibold text-slate-500 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
                -{lockedNum * 20} pts
              </span>
            </div>
          );
        })}
      </div>

      {/* Control Panel & Input Bar */}
      <div className="bezel-outer">
        <div className="bezel-inner p-5 sm:p-6 space-y-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={guessInput}
              onChange={(e) => setGuessInput(e.target.value)}
              placeholder="Escribe el título exacto de la canción..."
              className="flex-1 bg-slate-950 border border-slate-800 focus:border-emerald-500/80 text-slate-100 placeholder-slate-500 rounded-full px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
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
            <button
              onClick={onPedirPista}
              disabled={pistasUsadas >= totalPistas || isLoadingPista}
              className="flex items-center gap-2 pl-4 pr-2 py-2 rounded-full text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 disabled:opacity-40 transition-all active:scale-95 group"
            >
              <span>{isLoadingPista ? 'Cargando...' : 'Pedir más pistas (-20 pts)'}</span>
              <div className="w-6 h-6 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform">
                <PlusCircle className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
            </button>

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
