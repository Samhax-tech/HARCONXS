import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Shield, Lock, Mail, X, AlertCircle, KeyRound } from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const {
    isAdminLoginModalOpen,
    setIsAdminLoginModalOpen,
    adminLogin,
    isAdminAuthenticated
  } = useStore();

  const [adminEmail, setAdminEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAdminLoginModalOpen || isAdminAuthenticated) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await adminLogin(adminEmail, password);
      setIsLoading(false);
      if (!res.success) {
        setErrorMessage(res.message);
      } else {
        setAdminEmail('');
        setPassword('');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err?.message || 'Authentication failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-zinc-100 overflow-hidden">
        
        {/* Subtle accent hairline */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-400" />

        {/* Close Button */}
        <button
          onClick={() => setIsAdminLoginModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer"
          aria-label="Close admin modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-serif uppercase tracking-wider text-zinc-100">
              Admin Atelier Console
            </h2>
            <p className="text-xs text-zinc-400">
              Supabase RBAC verified administrator portal
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-950/40 border border-rose-800/80 rounded-xl text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@harconxs.com"
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Verifying credentials with Supabase...</span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Authenticate Admin Portal</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-zinc-800/80 text-center">
          <p className="text-[11px] text-zinc-400">
            Protected by Supabase Auth and Row Level Security. All administrative activities are auditable.
          </p>
        </div>

      </div>
    </div>
  );
};
