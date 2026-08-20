import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, KeyRound, Loader2, AlertCircle } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAdmin, loading, adminLogin, user } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="bg-zinc-950 min-h-[85vh] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-zinc-400">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          <span className="text-xs font-mono uppercase tracking-wider">Verifying Administrator Privileges...</span>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!identifier.trim() || !password.trim()) {
        setErrorMsg('Admin username/email and password are required.');
        return;
      }
      setIsSubmitting(true);
      setErrorMsg('');
      const res = await adminLogin(identifier.trim(), password.trim());
      setIsSubmitting(false);
      if (!res.success) {
        setErrorMsg(res.message || 'Invalid administrator credentials.');
      }
    };

    return (
      <div className="bg-zinc-950 min-h-[85vh] flex items-center justify-center p-4 w-full max-w-full overflow-hidden">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl min-w-0">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
            <Shield className="w-8 h-8" />
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold font-serif text-white">HARCONXS Master Gateway</h2>
            <p className="text-xs text-zinc-400">
              Role-protected administrative console. Enter authorized administrator credentials to access the Atelier backoffice.
            </p>
          </div>

          {user && !isAdmin && (
            <div className="p-3 bg-amber-950/40 border border-amber-800/80 rounded-xl text-xs text-amber-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Signed in as ({user.email}), but this account lacks administrator authorization.</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs text-center font-mono">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300">Admin Username or Email</label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="admin@harconxs.com or username"
                required
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 text-xs focus:outline-none focus:border-amber-500 transition-colors font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300">Administrator Password</label>
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
            <p className="text-[11px] text-zinc-400">
              Supabase Auth & RBAC Protected • Authorized Administrators Only
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
