import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Mail, KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { supabaseResetPasswordForEmail } from '../lib/supabase';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { showToast } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    const { success, error } = await supabaseResetPasswordForEmail(email.trim());
    setIsLoading(false);
    setIsSent(true);
    showToast('If an account exists with this email, a password reset link has been dispatched.');
  };

  return (
    <div className="min-h-[80vh] bg-zinc-950 flex items-center justify-center p-4 py-12">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6 shadow-2xl">
        
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
            <KeyRound className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-serif font-bold text-zinc-100">Reset Your Password</h1>
          <p className="text-xs text-zinc-400">
            Enter the email associated with your HARCONXS account to receive password recovery instructions.
          </p>
        </div>

        {isSent ? (
          <div className="p-5 bg-emerald-950/40 border border-emerald-800/60 rounded-2xl space-y-3 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-emerald-300">Recovery Email Dispatched</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We have sent a password reset token and verification link to <strong className="text-white">{email}</strong>.
            </p>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300">Registered Email Address</label>
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 cursor-pointer transition-all mt-2"
            >
              {isLoading ? <span>Dispatching link...</span> : <span>Send Password Reset Link</span>}
            </button>

            <div className="pt-2 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
