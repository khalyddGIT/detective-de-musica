'use client';

import React, { useState } from 'react';
import { Mail, Sparkles, X, CheckCircle2, ArrowRight, ArrowUpRight } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md pop-card p-6 sm:p-7 space-y-5 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between border-b border-black/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full badge-green flex items-center justify-center font-black">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-black text-[#0b0b0e]/60 block">
                SUPABASE AUTH
              </span>
              <h2 className="font-black text-base text-[#0b0b0e]">Ingresar con Magic Link</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-[#0b0b0e]/60 hover:text-[#0b0b0e] hover:bg-black/5 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {sent ? (
          <div className="py-6 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="font-black text-base text-[#0b0b0e]">¡Enlace Enviado!</h3>
            <p className="text-xs text-[#0b0b0e]/80 font-medium leading-relaxed max-w-xs mx-auto">
              Revisa tu casilla en <strong className="text-emerald-700 font-mono">{email}</strong> y haz clic en el botón de acceso.
            </p>
            <button
              onClick={onClose}
              className="mt-4 w-full py-3 rounded-full text-xs font-black badge-green shadow-md"
            >
              Entendido
            </button>
          </div>
        ) : (
          <form onSubmit={handleSendMagicLink} className="space-y-4">
            <p className="text-xs font-semibold text-[#0b0b0e]/80 leading-relaxed">
              Guarda tu puntaje y compite en la tabla global sin contraseñas. Recibirás un enlace seguro de acceso directo.
            </p>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-black uppercase text-[#0b0b0e]/60 tracking-wider block">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#0b0b0e]/40 absolute left-4 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-full bg-white border-2 border-black/20 text-[#0b0b0e] placeholder-black/40 text-xs font-bold focus:outline-none focus:border-black transition-all"
                />
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-700 bg-rose-500/10 p-3 rounded-xl border border-rose-500/30 font-bold">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-5 rounded-full badge-yellow hover:brightness-105 text-[#0b0b0e] font-black text-xs flex items-center justify-between shadow-md transition-all active:scale-95 disabled:opacity-50 group"
            >
              <span>{loading ? 'Enviando enlace...' : 'Enviar Magic Link'}</span>
              <ArrowUpRight className="w-4 h-4 stroke-[3] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

