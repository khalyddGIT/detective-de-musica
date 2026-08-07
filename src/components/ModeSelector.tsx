'use client';

import React from 'react';
import { ModoJuego } from '@/types/game';
import { Dices, Calendar, Disc, Radio, ArrowUpRight } from 'lucide-react';

interface ModeSelectorProps {
  currentMode: ModoJuego;
  onSelectMode: (mode: ModoJuego) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  currentMode,
  onSelectMode,
}) => {
  const modes: Array<{ id: ModoJuego; label: string; icon: React.ReactNode; desc: string }> = [
    { id: 'aleatorio', label: 'Aleatorio', icon: <Dices className="w-4 h-4" />, desc: 'Canciones variadas al azar' },
    { id: 'diario', label: 'Desafío Diario', icon: <Calendar className="w-4 h-4" />, desc: 'La canción del día' },
    { id: 'clasicos', label: 'Clásicos 70s-90s', icon: <Disc className="w-4 h-4" />, desc: 'Rock y Pop de época' },
    { id: 'modernos', label: 'Éxitos 2010+', icon: <Radio className="w-4 h-4" />, desc: 'Hits contemporáneos' },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="pop-card p-3 grid grid-cols-2 sm:grid-cols-4 gap-2.5 shadow-lg">
        {modes.map((mode) => {
          const isActive = currentMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => onSelectMode(mode.id)}
              className={`p-3.5 rounded-2xl transition-all text-left flex flex-col justify-between group active:scale-95 ${
                isActive
                  ? 'bg-[#0b0b0e] text-white shadow-xl border-2 border-black'
                  : 'bg-white/70 text-[#0b0b0e] border border-black/10 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold transition-colors ${
                    isActive
                      ? 'bg-[#facc15] text-[#0b0b0e]'
                      : 'bg-[#0b0b0e]/10 text-[#0b0b0e] group-hover:bg-[#0b0b0e] group-hover:text-white'
                  }`}
                >
                  {mode.icon}
                </div>
                {isActive ? (
                  <div className="w-5 h-5 rounded-full badge-yellow flex items-center justify-center font-black text-[10px]">
                    <ArrowUpRight className="w-3 h-3 stroke-[3]" />
                  </div>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-black/20 group-hover:bg-black/40 transition-colors" />
                )}
              </div>
              <div>
                <h3 className={`font-extrabold text-xs sm:text-sm leading-tight ${isActive ? 'text-white' : 'text-[#0b0b0e]'}`}>
                  {mode.label}
                </h3>
                <p className={`text-[10.5px] font-medium truncate mt-0.5 ${isActive ? 'text-white/70' : 'text-[#0b0b0e]/60'}`}>
                  {mode.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

