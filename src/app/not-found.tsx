import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#05070f] text-slate-100 p-4 text-center">
      <div className="bezel-outer max-w-sm w-full">
        <div className="bezel-inner p-8 space-y-4">
          <span className="text-4xl">🎵</span>
          <h2 className="text-2xl font-black text-slate-100">404 — Página no encontrada</h2>
          <p className="text-xs text-slate-400">
            La página que buscas no existe o ha sido movida.
          </p>
          <Link
            href="/"
            className="inline-block py-2.5 px-6 rounded-full text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-lg shadow-emerald-400/20"
          >
            Volver al Juego
          </Link>
        </div>
      </div>
    </div>
  );
}
