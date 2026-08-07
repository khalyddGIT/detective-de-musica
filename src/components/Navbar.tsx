'use client';

import React from 'react';
import { Music2, Trophy, User, LogOut, Sparkles, ChevronRight } from 'lucide-react';

interface NavbarProps {
  user: any;
  onOpenAuth: () => void;
  onOpenLeaderboard: () => void;
  onNewGame: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenAuth,
  onOpenLeaderboard,
  onNewGame,
  onLogout,
}) => {
  return (
    <header className="sticky top-4 z-40 w-full max-w-5xl mx-auto px-4">
      <div className="glass-pill rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-2xl transition-all duration-300">
        {/* Logo */}
        <div 
          onClick={onNewGame}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative">
            <div className="absolute -inset-1 rounded-xl bg-emerald-500/30 blur-sm group-hover:bg-emerald-400/50 transition-all" />
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg text-slate-950 group-hover:scale-105 transition-transform">
              <Music2 className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <h1 className="font-extrabold text-sm sm:text-base leading-tight tracking-tight text-slate-100 flex items-center gap-1.5">
              <span>Detective de Música</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </h1>
            <p className="text-[9.5px] font-mono text-emerald-400/90 tracking-[0.2em] uppercase font-bold">
              SONG CLUE GAME
            </p>
          </div>
        </div>

        {/* Acciones con Button-in-Button pattern */}
        <div className="flex items-center gap-2">
          <button
            onClick={onNewGame}
            className="hidden sm:flex items-center gap-2 pl-3.5 pr-1.5 py-1.5 rounded-full text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 hover:bg-emerald-500/20 active:scale-95 transition-all group"
          >
            <span>Nueva Partida</span>
            <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center text-emerald-300 group-hover:translate-x-0.5 transition-transform">
              <Sparkles className="w-3 h-3" />
            </div>
          </button>

          <button
            onClick={onOpenLeaderboard}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium text-slate-300 glass-pill hover:text-slate-100 transition-all active:scale-95"
            title="Ver Tabla de Posiciones"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xs:inline font-semibold">Leaderboard</span>
          </button>

          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-600 flex items-center justify-center text-xs font-bold text-emerald-400 font-mono shadow-inner">
                {user.email ? user.email[0].toUpperCase() : 'U'}
              </div>
              <button
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-full transition-colors"
                title="Cerrar Sesión"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 pl-4 pr-1.5 py-1.5 rounded-full text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-md shadow-emerald-400/20 active:scale-95 group"
            >
              <span>Ingresar</span>
              <div className="w-6 h-6 rounded-full bg-slate-950/15 flex items-center justify-center text-slate-950 group-hover:translate-x-0.5 transition-transform">
                <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
