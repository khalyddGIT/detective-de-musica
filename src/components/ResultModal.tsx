'use client';

import React, { useState } from 'react';
import { Trophy, XCircle, RotateCcw, Award, Music, Share2, Check, ArrowUpRight } from 'lucide-react';
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

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
        <div className="w-full max-w-md pop-card p-6 sm:p-8 text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-300 relative z-10">
          {/* Header Icon */}
          <div className="relative mx-auto w-20 h-20">
            <div className={`relative w-full h-full rounded-3xl flex items-center justify-center shadow-lg border-2 border-black ${
              acerto 
                ? 'badge-yellow' 
                : 'bg-rose-500 text-white'
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
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-black text-[#0b0b0e]/70 block mb-1">
              {acerto ? '¡VICTORIA DEDUCIDA!' : 'PARTIDA CONCLUIDA'}
            </span>
            <h2 className="text-2xl font-black text-[#0b0b0e] tracking-tight">
              {acerto ? '¡Impresionante Trabajo!' : 'Casi lo consigues'}
            </h2>
            <p className="text-xs font-semibold text-[#0b0b0e]/70 mt-1 max-w-xs mx-auto">
              {acerto
                ? `Lograste la respuesta correcta utilizando ${pistasUsadas} ${pistasUsadas === 1 ? 'pista' : 'pistas'}.`
                : 'Esta era la canción misteriosa:'}
            </p>
          </div>

          {/* Song Information */}
          <div className="p-4 rounded-2xl bg-white border-2 border-black text-left space-y-3 shadow-md">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl badge-green font-black mt-0.5">
                <Music className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-extrabold text-base text-[#0b0b0e] leading-snug truncate">
                  {cancion.titulo}
                </h3>
                <p className="text-xs font-black text-[#0b0b0e]/80">
                  {cancion.artista}
                </p>
                {cancion.album && (
                  <p className="text-[11px] text-[#0b0b0e]/60 mt-0.5 font-bold">
                    Álbum: {cancion.album}
                  </p>
                )}
              </div>
            </div>

            {cancion.preview_url && (
              <div className="pt-2 border-t border-black/10">
                <AudioPlayer url={cancion.preview_url} />
              </div>
            )}
          </div>

          {/* Score Badge */}
          <div className="p-3.5 rounded-2xl bg-[#0b0b0e] text-white border-2 border-black flex items-center justify-around font-mono">
            <div>
              <span className="text-[9px] uppercase tracking-wider font-bold text-white/60 block">Pistas</span>
              <span className="text-base font-bold text-white">{pistasUsadas} / 5</span>
            </div>
            <div className="h-7 w-px bg-white/20" />
            <div>
              <span className="text-[9px] uppercase tracking-wider font-bold text-white/60 block">Puntaje</span>
              <span className="text-xl font-black text-[#facc15]">+{puntaje} PTS</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleShare}
              className="w-full py-3 px-4 rounded-full text-xs font-black text-[#0b0b0e] bg-white border-2 border-black hover:bg-white/80 flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-black">¡Copiado al portapapeles!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-[#0b0b0e]" />
                  <span>Compartir Mi Resultado</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={onOpenLeaderboard}
                className="flex-1 py-3 px-4 rounded-full text-xs font-black text-[#0b0b0e] bg-white/70 border border-black/15 hover:bg-white flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
              >
                <Award className="w-4 h-4 text-[#eab308]" />
                <span>Ranking</span>
              </button>

              <button
                onClick={onPlayAgain}
                className="flex-1 py-3 px-4 rounded-full text-xs font-black badge-yellow shadow-md hover:brightness-105 transition-all flex items-center justify-center gap-2 active:scale-95 group"
              >
                <span>Jugar de Nuevo</span>
                <RotateCcw className="w-4 h-4 stroke-[2.5] group-hover:rotate-180 transition-transform duration-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

