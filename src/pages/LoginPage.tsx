import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { LogIn, Mail, Lock, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { supabaseSignInWithGoogle, supabaseSignIn } from '../lib/supabase';

export const LoginPage: React.FC = () => {
  const { userLogin, showToast, isUserLoggedIn } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const from = (location.state as any)?.from?.pathname || '/account';

  if (isUserLoggedIn) {
    navigate(from, { replace: true });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Email and password are required.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    // Attempt Supabase / Store sign in
    const result = await userLogin(email.trim(), password.trim());
    setIsLoading(false);
    if (result.success) {
      showToast('Welcome back to HARCONXS.');
      navigate(from, { replace: true });
    } else {
      setErrorMsg(result.message || 'Invalid email or password.');
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const { error } = await supabaseSignInWithGoogle();
    setIsLoading(false);
    if (error) {
      showToast('Google OAuth initialization error. Proceeding with email login.');
    }
  };

  return (
    <div className="min-h-[85vh] bg-zinc-950 flex items-center justify-center p-4 py-12">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6 shadow-2xl">
        
        <div className="text-center space-y-2">
          <Link to="/" className="font-serif text-2xl font-bold tracking-wider text-white uppercase inline-block">
            HARCONXS
          </Link>
          <h1 className="text-xl font-serif font-bold text-zinc-100">Welcome to Your Atelier Account</h1>
          <p className="text-xs text-zinc-400">
            Sign in to track live shipments, manage couple websites, and review bespoke quotations.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs text-center font-mono">
            {errorMsg}
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-2.5 px-4 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs font-semibold text-zinc-200 flex items-center justify-center gap-3 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.54 0 2.94.55 4.04 1.46l3.03-3.03C17.24 1.7 14.79 1 12 1 7.48 1 3.63 3.6 1.83 7.39l3.66 2.84C6.37 7.27 8.95 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.69 2.86c2.16-1.99 3.73-4.93 3.73-8.68z"
            />
            <path
              fill="#FBBC05"
              d="M5.49 14.77c-.24-.72-.37-1.49-.37-2.27s.13-1.55.37-2.27L1.83 7.39C1.07 8.94.63 10.68.63 12.5s.44 3.56 1.2 5.11l3.66-2.84z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.69-2.86c-1.08.72-2.45 1.16-4.24 1.16-3.05 0-5.63-2.27-6.51-5.23L1.83 17.61C3.63 21.4 7.48 23 12 23z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="h-px bg-zinc-800 flex-1" />
          <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">or sign in with email</span>
          <div className="h-px bg-zinc-800 flex-1" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="connoisseur@example.com"
                required
                className="w-full pl-9 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 text-xs focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-zinc-300">Password</label>
              <Link to="/forgot-password" className="text-[11px] text-amber-400 hover:text-amber-300 transition-colors">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full pl-9 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 text-xs focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 cursor-pointer transition-all mt-2"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In to Account</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-zinc-400">
          <span>Don't have an account yet? </span>
          <Link to="/register" className="font-semibold text-amber-400 hover:text-amber-300 transition-colors">
            Register for Free
          </Link>
        </div>
      </div>
    </div>
  );
};
