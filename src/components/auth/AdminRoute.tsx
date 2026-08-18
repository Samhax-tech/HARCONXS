import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Shield, Lock, ArrowRight, KeyRound } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAdminAuthenticated, adminLogin, showToast } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAdminAuthenticated) {
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email.trim() || !password.trim()) {
        setErrorMsg('Admin email and master key are required.');
        return;
      }
      setIsSubmitting(true);
      setErrorMsg('');
      const res = await adminLogin(email.trim(), password.trim());
      setIsSubmitting(false);
      if (!res.success) {
        setErrorMsg(res.message || 'Invalid administrator credentials.');
      }
    };

    return (
      <div className="bg-zinc-950 min-h-[85vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
            <Shield className="w-8 h-8" />
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold font-serif text-white">HARCONXS Master Gateway</h2>
            <p className="text-xs text-zinc-400">
              Role-protected administrative console. Enter master credentials or authorized Supabase admin session.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs text-center font-mono">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300">Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@harconxs.com"
                required
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 text-xs focus:outline-none focus:border-amber-500 transition-colors font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300">Master Secret Key / PIN</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 text-xs focus:outline-none focus:border-amber-500 transition-colors font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 cursor-pointer transition-all mt-2"
            >
              {isSubmitting ? (
                <span>Verifying RBAC Permissions...</span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Authenticate Admin Session</span>
                </>
              )}
            </button>
          </form>

          <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/80 text-center">
            <p className="text-[11px] text-zinc-500">
              Demo master key: <span className="font-mono text-amber-400">admin123</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
