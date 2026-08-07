'use client';

import React from 'react';
import { HelpCircle, X, Flame, Search, Trophy, Music } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md pop-card p-6 sm:p-7 space-y-6 shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/10 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full badge-yellow flex items-center justify-center font-black">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-black text-[#0b0b0e]/60 block">
                INSTRUCCIONES DE JUEGO
              </span>
              <h2 className="font-black text-base text-[#0b0b0e]">¿Cómo Jugar a Detective?</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#0b0b0e]/60 hover:text-[#0b0b0e] hover:bg-black/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white border border-black/15 shadow-sm">
            <div className="w-8 h-8 rounded-full badge-orange flex items-center justify-center font-black shrink-0 mt-0.5">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-xs text-[#0b0b0e]">1. Analiza las pistas</h3>
              <p className="text-[11px] font-semibold text-[#0b0b0e]/70 leading-relaxed mt-0.5">
                El juego comienza revelando únicamente la Pista 1 (Año de lanzamiento).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white border border-black/15 shadow-sm">
            <div className="w-8 h-8 rounded-full badge-purple flex items-center justify-center font-black shrink-0 mt-0.5">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-xs text-[#0b0b0e]">2. Pide más pistas si las necesitas</h3>
              <p className="text-[11px] font-semibold text-[#0b0b0e]/70 leading-relaxed mt-0.5">
                Puedes desbloquear géneros, álbum, fragmentos de letra y una muestra de audio de 30s (-20 pts por pista).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white border border-black/15 shadow-sm">
            <div className="w-8 h-8 rounded-full badge-pink flex items-center justify-center font-black shrink-0 mt-0.5">
              <Music className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-xs text-[#0b0b0e]">3. Escribe tu respuesta</h3>
              <p className="text-[11px] font-semibold text-[#0b0b0e]/70 leading-relaxed mt-0.5">
                No te preocupes por mayúsculas o tildes, la validación es inteligente y tolerante.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white border border-black/15 shadow-sm">
            <div className="w-8 h-8 rounded-full badge-yellow flex items-center justify-center font-black shrink-0 mt-0.5">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-xs text-[#0b0b0e]">4. ¡Sube al Leaderboard Global!</h3>
              <p className="text-[11px] font-semibold text-[#0b0b0e]/70 leading-relaxed mt-0.5">
                Gana hasta 100 puntos por canción y posiciona tu nombre en la tabla de los mejores detectives.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-full text-xs font-black badge-yellow shadow-md hover:brightness-105 active:scale-95 transition-all"
          >
            ¡Entendido, a jugar!
          </button>
        </div>
      </div>
    </div>
  );
};

