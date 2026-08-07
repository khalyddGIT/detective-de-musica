'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { GameBoard } from '@/components/GameBoard';
import { ResultModal } from '@/components/ResultModal';
import { Leaderboard } from '@/components/Leaderboard';
import { AuthModal } from '@/components/AuthModal';
import { Pista } from '@/types/game';
import { createClient } from '@/lib/supabase/client';
import { Sparkles, Play, Music2 } from 'lucide-react';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [cancionId, setCancionId] = useState<string>('');
  const [pistas, setPistas] = useState<Pista[]>([]);
  const [totalPistas, setTotalPistas] = useState<number>(5);
  
  const [isLoadingGame, setIsLoadingGame] = useState<boolean>(true);
  const [isLoadingPista, setIsLoadingPista] = useState<boolean>(false);
  const [isSubmittingGuess, setIsSubmittingGuess] = useState<boolean>(false);

  const [gameResult, setGameResult] = useState<{
    finished: boolean;
    acerto: boolean;
    puntaje: number;
    cancion: {
      titulo: string;
      artista: string;
      album?: string;
      preview_url?: string;
    };
  } | null>(null);

  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [showAuth, setShowAuth] = useState<boolean>(false);

  const supabase = createClient();

  // Escuchar sesión de Supabase Auth
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user || null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Iniciar partida
  const startNewGame = async () => {
    setIsLoadingGame(true);
    setGameResult(null);
    setPistas([]);

    try {
      const res = await fetch('/api/game/random');
      const data = await res.json();

      if (data.cancion_id && data.primera_pista) {
        setCancionId(data.cancion_id);
        setTotalPistas(data.total_pistas || 5);
        setPistas([data.primera_pista]);
      }
    } catch (error) {
      console.error('Error al iniciar nueva partida:', error);
    } finally {
      setIsLoadingGame(false);
    }
  };

  useEffect(() => {
    startNewGame();
  }, []);

  // Pedir más pista
  const handlePedirPista = async () => {
    if (pistas.length >= totalPistas || isLoadingPista) return;

    setIsLoadingPista(true);
    try {
      const siguienteOrden = pistas.length + 1;
      const res = await fetch('/api/game/clue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cancion_id: cancionId,
          orden: siguienteOrden,
        }),
      });

      const data = await res.json();
      if (data.pista) {
        setPistas((prev) => [...prev, data.pista]);
      }
    } catch (error) {
      console.error('Error al obtener la siguiente pista:', error);
    } finally {
      setIsLoadingPista(false);
    }
  };

  // Enviar adivinanza
  const handleEnviarRespuesta = async (guess: string) => {
    if (isSubmittingGuess) return;

    setIsSubmittingGuess(true);
    try {
      const res = await fetch('/api/game/guess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cancion_id: cancionId,
          respuesta: guess,
          pistas_usadas: pistas.length,
          usuario_id: user?.id || null,
        }),
      });

      const data = await res.json();

      if (data.cancion) {
        setGameResult({
          finished: true,
          acerto: data.acerto,
          puntaje: data.puntaje,
          cancion: data.cancion,
        });
      }
    } catch (error) {
      console.error('Error al evaluar la respuesta:', error);
    } finally {
      setIsSubmittingGuess(false);
    }
  };

  // Rendirse
  const handleRendirse = async () => {
    await handleEnviarRespuesta('___RENDICION___');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#05070f] text-slate-100 relative selection:bg-emerald-400 selection:text-slate-950">
      {/* Mesh Glow Overlay */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-emerald-500/5 blur-[120px] pointer-events-none rounded-full" />

      <Navbar
        user={user}
        onOpenAuth={() => setShowAuth(true)}
        onOpenLeaderboard={() => setShowLeaderboard(true)}
        onNewGame={startNewGame}
        onLogout={handleLogout}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 pt-10 pb-16 relative z-10">
        {/* Banner Hero Minimalista */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] uppercase font-mono tracking-[0.2em] font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DESAFÍO DETECTIVE MUSICAL</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-100">
            ¿Reconoces esta canción?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Analiza las pistas progresivas de difícil a fácil y adivina el título exacto con la menor cantidad de intentos posible.
          </p>
        </div>

        {/* Game State */}
        {isLoadingGame ? (
          <div className="py-24 text-center space-y-4">
            <div className="relative w-12 h-12 mx-auto">
              <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20" />
              <div className="absolute inset-0 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
            </div>
            <p className="text-xs text-slate-400 font-mono tracking-wide">
              Seleccionando canción secreta y generando pistas...
            </p>
          </div>
        ) : (
          <GameBoard
            cancionId={cancionId}
            pistas={pistas}
            totalPistas={totalPistas}
            onPedirPista={handlePedirPista}
            onEnviarRespuesta={handleEnviarRespuesta}
            onRendirse={handleRendirse}
            isLoadingPista={isLoadingPista}
            isSubmittingGuess={isSubmittingGuess}
          />
        )}
      </main>

      {/* Footer Minimalista */}
      <footer className="border-t border-slate-900 py-8 text-center text-[11px] text-slate-500 relative z-10 font-mono">
        <p>Detective de Música &copy; {new Date().getFullYear()} — Powered by Next.js 14, Supabase & Last.fm API</p>
      </footer>

      {/* Modales */}
      {gameResult && (
        <ResultModal
          acerto={gameResult.acerto}
          puntaje={gameResult.puntaje}
          pistasUsadas={pistas.length}
          cancion={gameResult.cancion}
          onPlayAgain={startNewGame}
          onOpenLeaderboard={() => {
            setGameResult(null);
            setShowLeaderboard(true);
          }}
        />
      )}

      {showLeaderboard && (
        <Leaderboard onClose={() => setShowLeaderboard(false)} />
      )}

      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} />
      )}
    </div>
  );
}
