'use client';

import React from 'react';
import { HelpCircle, X, Flame, Search, Trophy, Music } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in">
      <div className="w-full max-w-md bezel-outer shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="bezel-inner p-6 sm:p-7 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[9.5px] font-mono uppercase tracking-[0.2em] font-bold text-emerald-400 block">
                  INSTRUCCIONES DE JUEGO
                </span>
                <h2 className="font-extrabold text-base text-slate-100">¿Cómo Jugar a Detective?</h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 shrink-0 mt-0.5">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-200">1. Analiza las pistas</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                  El juego comienza revelando únicamente la Pista 1 (Año de lanzamiento).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0 mt-0.5">
                <Search className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-200">2. Pide más pistas si las necesitas</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                  Puedes desbloquear géneros, álbum, fragmentos de letra y una muestra de audio de 30s (-20 pts por pista).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                <Music className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-200">3. Escribe tu respuesta</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                  No te preocupes por mayúsculas o tildes, la validación es inteligente y tolerante.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-200">4. ¡Sube al Leaderboard Global!</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                  Gana hasta 100 puntos por canción y posiciona tu nombre en la tabla de los mejores detectives.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-full text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-lg shadow-emerald-400/20 transition-all active:scale-95"
            >
              ¡Entendido, a jugar!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
