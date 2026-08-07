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
    if (index === 0) return <Medal className="w-5 h-5 text-amber-400 fill-amber-400/20" />;
    if (index === 1) return <Medal className="w-5 h-5 text-slate-300 fill-slate-300/20" />;
    if (index === 2) return <Medal className="w-5 h-5 text-amber-700 fill-amber-700/20" />;
    return <span className="text-xs font-mono font-bold text-slate-500">#{index + 1}</span>;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in">
      <div className="w-full max-w-lg bezel-outer shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="bezel-inner p-6 sm:p-7 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[9.5px] font-mono uppercase tracking-[0.2em] font-bold text-amber-400 block">
                  GLOBAL RANKING
                </span>
                <h2 className="font-extrabold text-base text-slate-100">Tabla de Posiciones</h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List Content */}
          {loading ? (
            <div className="py-12 text-center text-xs font-mono text-slate-400">
              Cargando tabla de posiciones...
            </div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 space-y-2">
              <Sparkles className="w-6 h-6 text-slate-600 mx-auto" />
              <p>¡Sé el primero en adivinar una canción y encabezar el ranking!</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700/80 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 flex items-center justify-center shrink-0">
                      {getRankBadge(idx)}
                    </div>

                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-600 flex items-center justify-center text-xs font-bold text-emerald-400 font-mono shrink-0">
                      {item.nombre ? item.nombre[0].toUpperCase() : 'U'}
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-bold text-xs text-slate-200 truncate">
                        {item.nombre}
                      </h3>
                      <p className="text-[10px] text-slate-400">
                        {item.pistas_usadas ? `${item.pistas_usadas} pistas usadas` : 'Detective'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-black text-sm text-emerald-400 font-mono">
                      +{item.puntaje} <span className="text-[10px] text-emerald-500/70">PTS</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-2 text-center">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-full text-xs font-semibold text-slate-300 glass-pill"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
