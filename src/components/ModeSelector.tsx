'use client';

import React from 'react';
import { ModoJuego } from '@/types/game';
import { Dices, Calendar, Disc, Radio } from 'lucide-react';

interface ModeSelectorProps {
  currentMode: ModoJuego;
  onSelectMode: (mode: ModoJuego) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  currentMode,
  onSelectMode,
}) => {
  const modes: Array<{ id: ModoJuego; label: string; icon: React.ReactNode; desc: string }> = [
    { id: 'aleatorio', label: 'Aleatorio', icon: <Dices className="w-4 h-4 text-emerald-400" />, desc: 'Canciones variadas al azar' },
    { id: 'diario', label: 'Desafío Diario', icon: <Calendar className="w-4 h-4 text-amber-400" />, desc: 'La canción del día' },
    { id: 'clasicos', label: 'Clásicos 70s-90s', icon: <Disc className="w-4 h-4 text-purple-400" />, desc: 'Rock y Pop de época' },
    { id: 'modernos', label: 'Éxitos 2010+', icon: <Radio className="w-4 h-4 text-sky-400" />, desc: 'Hits contemporáneos' },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto mb-6">
      <div className="bezel-outer">
        <div className="bezel-inner p-2.5 sm:p-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {modes.map((mode) => {
            const isActive = currentMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => onSelectMode(mode.id)}
                className={`p-3 rounded-2xl transition-all text-left flex flex-col justify-between ${
                  isActive
                    ? 'bg-slate-900 border border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-950/40 border border-slate-800/80 hover:bg-slate-900/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="p-1.5 rounded-xl bg-slate-950 border border-slate-800">
                    {mode.icon}
                  </div>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  )}
                </div>
                <div>
                  <h3 className="font-extrabold text-xs text-slate-100">{mode.label}</h3>
                  <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">{mode.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
