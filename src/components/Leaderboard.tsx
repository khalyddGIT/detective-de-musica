'use client';

import React, { useEffect, useState } from 'react';
import { Trophy, X, Medal, Sparkles } from 'lucide-react';

interface LeaderboardItem {
  id: string;
  nombre: string;
  avatar?: string;
  puntaje: number;
  pistas_usadas?: number;
}

interface LeaderboardProps {
  onClose: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ onClose }) => {
  const [items, setItems] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/leaderboard');
        const data = await res.json();
        if (data.leaderboard) {
          setItems(data.leaderboard);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getRankBadge = (index: number) => {
    if (index === 0) return <div className="w-7 h-7 rounded-full badge-yellow flex items-center justify-center font-black text-xs">1</div>;
    if (index === 1) return <div className="w-7 h-7 rounded-full bg-slate-200 border-2 border-black flex items-center justify-center font-black text-xs text-black">2</div>;
    if (index === 2) return <div className="w-7 h-7 rounded-full badge-orange flex items-center justify-center font-black text-xs">3</div>;
    return <span className="text-xs font-mono font-black text-[#0b0b0e]/50">#{index + 1}</span>;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg pop-card p-6 sm:p-7 space-y-5 shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full badge-yellow flex items-center justify-center font-black">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-black text-[#0b0b0e]/60 block">
                GLOBAL RANKING
              </span>
              <h2 className="font-black text-lg text-[#0b0b0e]">Tabla de Posiciones</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#0b0b0e]/60 hover:text-[#0b0b0e] hover:bg-black/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List Content */}
        {loading ? (
          <div className="py-12 text-center text-xs font-mono font-bold text-[#0b0b0e]/60 uppercase">
            Cargando tabla de posiciones...
          </div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#0b0b0e]/70 space-y-2 font-semibold">
            <Sparkles className="w-6 h-6 text-[#0b0b0e]/40 mx-auto" />
            <p>¡Sé el primero en adivinar una canción y encabezar el ranking!</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {items.map((item, idx) => (
              <div
                key={item.id || idx}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-black/15 hover:border-black transition-all shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 flex items-center justify-center shrink-0">
                    {getRankBadge(idx)}
                  </div>

                  <div className="w-8 h-8 rounded-full bg-[#0b0b0e] text-[#facc15] border border-black flex items-center justify-center text-xs font-black font-mono shrink-0">
                    {item.nombre ? item.nombre[0].toUpperCase() : 'U'}
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-extrabold text-xs text-[#0b0b0e] truncate">
                      {item.nombre}
                    </h3>
                    <p className="text-[10px] text-[#0b0b0e]/60 font-bold">
                      {item.pistas_usadas ? `${item.pistas_usadas} pistas usadas` : 'Detective'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-black text-sm text-[#0b0b0e] font-mono">
                    +{item.puntaje} <span className="text-[10px] text-[#0b0b0e]/60">PTS</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-full text-xs font-black text-[#0b0b0e] bg-white border border-black/15 hover:bg-white/80"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

