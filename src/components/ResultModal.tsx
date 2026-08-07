'use client';

import React, { useState } from 'react';
import { Trophy, XCircle, RotateCcw, Award, Music, Share2, Check } from 'lucide-react';
import { AudioPlayer } from './AudioPlayer';
import { Confetti } from './Confetti';
import { generateShareText, copyShareToClipboard } from '@/lib/utils/share';

interface ResultModalProps {
  acerto: boolean;
  puntaje: number;
  pistasUsadas: number;
  cancion: {
    titulo: string;
    artista: string;
    album?: string;
    preview_url?: string;
  };
  onPlayAgain: () => void;
  onOpenLeaderboard: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  acerto,
  puntaje,
  pistasUsadas,
  cancion,
  onPlayAgain,
  onOpenLeaderboard,
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const text = generateShareText(cancion.titulo, cancion.artista, puntaje, pistasUsadas);
    const success = await copyShareToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <>
      {acerto && <Confetti />}

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in">
        <div className="w-full max-w-md bezel-outer shadow-2xl animate-in zoom-in-95 duration-300 relative z-10">
          <div className="bezel-inner p-6 sm:p-8 text-center space-y-6">
            {/* Header Icon */}
            <div className="relative mx-auto w-20 h-20">
              <div className={`absolute -inset-2 rounded-3xl blur-md ${acerto ? 'bg-emerald-500/30' : 'bg-rose-500/30'}`} />
              <div className={`relative w-full h-full rounded-3xl flex items-center justify-center shadow-xl ${
                acerto 
                  ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950' 
                  : 'bg-gradient-to-tr from-rose-500 to-red-600 text-slate-100'
              }`}>
                {acerto ? (
                  <Trophy className="w-10 h-10 stroke-[2.5]" />
                ) : (
                  <XCircle className="w-10 h-10 stroke-[2.5]" />
                )}
              </div>
            </div>

            {/* Title & Subtitle */}
            <div>
              <span className="text-[9.5px] font-mono uppercase tracking-[0.25em] font-bold text-emerald-400 block mb-1">
                {acerto ? '¡VICTORIA DEDUCIDA!' : 'PARTIDA CONCLUIDA'}
              </span>
              <h2 className="text-2xl font-black text-slate-100 tracking-tight">
                {acerto ? '¡Impresionante Trabajo!' : 'Casi lo consigues'}
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                {acerto
                  ? `Lograste la respuesta correcta utilizando ${pistasUsadas} ${pistasUsadas === 1 ? 'pista' : 'pistas'}.`
                  : 'Esta era la canción misteriosa:'}
              </p>
            </div>

            {/* Song Information */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-3 shadow-inner">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mt-0.5">
                  <Music className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-base text-slate-100 leading-snug truncate">
                    {cancion.titulo}
                  </h3>
                  <p className="text-xs font-bold text-emerald-400">
                    {cancion.artista}
                  </p>
                  {cancion.album && (
                    <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                      Álbum: {cancion.album}
                    </p>
                  )}
                </div>
              </div>

              {cancion.preview_url && (
                <div className="pt-2 border-t border-slate-900">
                  <AudioPlayer url={cancion.preview_url} />
                </div>
              )}
            </div>

            {/* Score Badge */}
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-around font-mono">
              <div>
                <span className="text-[9px] uppercase tracking-wider font-bold text-slate-500 block">Pistas</span>
                <span className="text-base font-bold text-slate-200">{pistasUsadas} / 5</span>
              </div>
              <div className="h-7 w-px bg-slate-800" />
              <div>
                <span className="text-[9px] uppercase tracking-wider font-bold text-slate-500 block">Puntaje</span>
                <span className="text-xl font-black text-emerald-400">+{puntaje} PTS</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleShare}
                className="w-full py-3 px-4 rounded-full text-xs font-bold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">¡Copiado al portapapeles!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-sky-400" />
                    <span>Compartir Mi Resultado</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={onOpenLeaderboard}
                  className="flex-1 py-3 px-4 rounded-full text-xs font-semibold text-slate-300 glass-pill flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Leaderboard</span>
                </button>
                <button
                  onClick={onPlayAgain}
                  className="flex-1 py-2.5 pl-4 pr-1.5 rounded-full text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-400/20 active:scale-95 group"
                >
                  <span>Jugar de Nuevo</span>
                  <div className="w-7 h-7 rounded-full bg-slate-950/15 flex items-center justify-center text-slate-950 group-hover:rotate-180 transition-transform duration-500">
                    <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
