'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { GameBoard } from '@/components/GameBoard';
import { ModeSelector } from '@/components/ModeSelector';
import { ResultModal } from '@/components/ResultModal';
import { Leaderboard } from '@/components/Leaderboard';
import { AuthModal } from '@/components/AuthModal';
import { HelpModal } from '@/components/HelpModal';
import { Pista, ModoJuego, StreakInfo } from '@/types/game';
import { loadStreak, updateStreak } from '@/lib/game/daily';
import { createClient } from '@/lib/supabase/client';
import { Sparkles, ArrowUpRight } from 'lucide-react';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [cancionId, setCancionId] = useState<string>('');
  const [pistas, setPistas] = useState<Pista[]>([]);
  const [totalPistas, setTotalPistas] = useState<number>(5);
  const [wrongGuesses, setWrongGuesses] = useState<string[]>([]);

  const [currentMode, setCurrentMode] = useState<ModoJuego>('aleatorio');
  const [streakInfo, setStreakInfo] = useState<StreakInfo>({ rachaActual: 0, mejorRacha: 0 });
  
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
  const [showHelp, setShowHelp] = useState<boolean>(false);

  const supabase = createClient();

  useEffect(() => {
    setStreakInfo(loadStreak());

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

  const startNewGame = async (mode = currentMode) => {
    setIsLoadingGame(true);
    setGameResult(null);
    setPistas([]);
    setWrongGuesses([]);

    try {
      const res = await fetch(`/api/game/random?mode=${mode}`);
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

  const handleSelectMode = (newMode: ModoJuego) => {
    setCurrentMode(newMode);
    startNewGame(newMode);
  };

  useEffect(() => {
    startNewGame(currentMode);
  }, []);

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

      if (data.acerto || guess === '___RENDICION___') {
        const isWin = Boolean(data.acerto);
        const updatedStreak = updateStreak(isWin);
        setStreakInfo(updatedStreak);

        if (data.cancion) {
          setGameResult({
            finished: true,
            acerto: isWin,
            puntaje: data.puntaje,
            cancion: data.cancion,
          });
        }
      } else {
        setWrongGuesses((prev) => [...prev, guess]);
      }
    } catch (error) {
      console.error('Error al evaluar la respuesta:', error);
    } finally {
      setIsSubmittingGuess(false);
    }
  };

  const handleRendirse = async () => {
    await handleEnviarRespuesta('___RENDICION___');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#a393ff] text-[#0e0e12] relative selection:bg-[#facc15] selection:text-[#0e0e12]">
      {/* Background Watermark */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none flex items-center justify-center">
        <span className="text-[25vw] font-black tracking-tighter text-[#0e0e12]/[0.05] uppercase leading-none">
          MUSIC
        </span>
      </div>

      <Navbar
        user={user}
        onOpenAuth={() => setShowAuth(true)}
        onOpenLeaderboard={() => setShowLeaderboard(true)}
        onOpenHelp={() => setShowHelp(true)}
        onNewGame={() => startNewGame(currentMode)}
        onLogout={handleLogout}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 pt-6 pb-16 relative z-10 space-y-6">
        {/* Banner Hero */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full badge-yellow text-[11px] font-mono uppercase tracking-wider font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DESAFÍO DETECTIVE MUSICAL</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0e0e12] leading-tight">
            ¿Reconoces esta canción?
          </h2>

          <p className="text-xs sm:text-sm font-medium text-[#0e0e12]/70 max-w-md mx-auto leading-relaxed">
            Analiza las pistas de difícil a fácil y adivina el título exacto con la menor cantidad de intentos posible.
          </p>
        </div>

        {/* Selector de Modo de Juego */}
        <ModeSelector
          currentMode={currentMode}
          onSelectMode={handleSelectMode}
        />

        {/* Game State */}
        {isLoadingGame ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full border-4 border-black/10 border-t-[#0e0e12] animate-spin" />
            <p className="text-xs font-mono font-bold text-[#0e0e12]/70 tracking-wide uppercase">
              Cargando canción y generando pistas...
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
            wrongGuesses={wrongGuesses}
            streakInfo={streakInfo}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-black/10 py-6 text-center text-xs text-[#0e0e12]/60 relative z-10 font-mono font-bold">
        <p>Detective de Música &copy; {new Date().getFullYear()} — Song Clue Game</p>
      </footer>

      {/* Modales */}
      {gameResult && (
        <ResultModal
          acerto={gameResult.acerto}
          puntaje={gameResult.puntaje}
          pistasUsadas={pistas.length}
          cancion={gameResult.cancion}
          onPlayAgain={() => startNewGame(currentMode)}
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

      {showHelp && (
        <HelpModal onClose={() => setShowHelp(false)} />
      )}
    </div>
  );
}


