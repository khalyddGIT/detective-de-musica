'use client';

import React, { useState } from 'react';
import { Mail, Sparkles, X, CheckCircle2, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const supabase = createClient();

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
        },
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setSent(true);
      }
    } catch (err: any) {
      setErrorMsg('Ocurrió un error al enviar el enlace.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in">
      <div className="w-full max-w-md bezel-outer shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="bezel-inner p-6 sm:p-7 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[9.5px] font-mono uppercase tracking-[0.2em] font-bold text-emerald-400 block">
                  SUPABASE AUTH
                </span>
                <h2 className="font-extrabold text-base text-slate-100">Ingresar con Magic Link</h2>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {sent ? (
            <div className="py-6 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="font-extrabold text-base text-slate-100">¡Enlace Enviado!</h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                Revisa tu casilla en <strong className="text-emerald-400 font-mono">{email}</strong> y haz clic en el botón de acceso.
              </p>
              <button
                onClick={onClose}
                className="mt-4 w-full py-3 rounded-full text-xs font-bold bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-400/20"
              >
                Entendido
              </button>
            </div>
          ) : (
            <form onSubmit={handleSendMagicLink} className="space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed">
                Guarda tu puntaje y compite en la tabla global sin contraseñas. Recibirás un enlace seguro de acceso directo.
              </p>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider block">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-full bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-400 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full pl-5 pr-2 py-2 rounded-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs flex items-center justify-between shadow-lg shadow-emerald-400/20 transition-all active:scale-95 disabled:opacity-50 group"
              >
                <span>{loading ? 'Enviando enlace...' : 'Enviar Magic Link'}</span>
                <div className="w-7 h-7 rounded-full bg-slate-950/15 flex items-center justify-center text-slate-950 group-hover:translate-x-0.5 transition-transform">
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
