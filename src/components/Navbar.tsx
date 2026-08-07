'use client';

import React from 'react';
import { Music2, Trophy, LogOut, Sparkles, HelpCircle, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  user: any;
  onOpenAuth: () => void;
  onOpenLeaderboard: () => void;
  onOpenHelp: () => void;
  onNewGame: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenAuth,
  onOpenLeaderboard,
  onOpenHelp,
  onNewGame,
  onLogout,
}) => {
  return (
    <header className="sticky top-4 z-40 w-full max-w-5xl mx-auto px-4">
      <div className="pop-pill rounded-full px-4 sm:px-6 py-3 flex items-center justify-between shadow-xl transition-all duration-300">
        {/* Logo */}
        <div 
          onClick={onNewGame}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="flex items-center gap-1.5">
            <div className="w-9 h-9 rounded-full bg-[#0b0b0e] text-[#facc15] flex items-center justify-center font-bold text-sm shadow-md group-hover:scale-105 transition-transform">
              <Music2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="w-7 h-7 rounded-full badge-yellow flex items-center justify-center font-black text-xs">
              <ArrowUpRight className="w-4 h-4 stroke-[3]" />
            </div>
          </div>

          <div>
            <h1 className="font-black text-base sm:text-lg leading-none tracking-tight text-[#0b0b0e] flex items-center gap-1.5">
              <span>Detective de Música</span>
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            </h1>
            <p className="text-[10px] font-mono text-[#0b0b0e]/70 tracking-[0.2em] uppercase font-bold mt-0.5">
              SONG CLUE GAME
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenHelp}
            className="px-3 py-1.5 rounded-full text-xs font-bold text-[#0b0b0e] bg-white/60 hover:bg-white border border-black/10 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            title="Instrucciones del juego"
          >
            <HelpCircle className="w-4 h-4 text-[#0b0b0e]" />
            <span className="hidden md:inline">Reglas</span>
          </button>

          <button
            onClick={onNewGame}
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black badge-yellow shadow-md hover:bg-yellow-400 active:scale-95 transition-all group"
          >
            <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Nueva Partida</span>
          </button>

          <button
            onClick={onOpenLeaderboard}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#0b0b0e] bg-white/70 border border-black/15 hover:bg-white transition-all active:scale-95 shadow-sm"
            title="Ver Tabla de Posiciones"
          >
            <Trophy className="w-4 h-4 text-[#eab308]" />
            <span className="hidden xs:inline font-bold">Ranking</span>
          </button>

          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-black/15">
              <div className="w-8 h-8 rounded-full bg-[#0b0b0e] text-[#facc15] border border-black flex items-center justify-center text-xs font-black font-mono shadow-md">
                {user.email ? user.email[0].toUpperCase() : 'U'}
              </div>
              <button
                onClick={onLogout}
                className="p-2 text-[#0b0b0e]/70 hover:text-rose-600 hover:bg-rose-500/10 rounded-full transition-colors"
                title="Cerrar Sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black badge-green shadow-md hover:brightness-105 transition-all active:scale-95 group"
            >
              <span>Ingresar</span>
              <ArrowUpRight className="w-4 h-4 stroke-[3] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

