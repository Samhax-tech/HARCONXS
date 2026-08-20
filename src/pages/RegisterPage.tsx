import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { UserPlus, Mail, Lock, User, Phone, Loader2 } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register, user, loading: authLoading } = useAuth();
  const { showToast } = useStore();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user && !authLoading) {
      navigate('/account', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('All mandatory fields are required.');
      return;
    }
    if (!agreeTerms) {
      setErrorMsg('Please agree to terms and privacy policy.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    const res = await register(email.trim(), password.trim(), {
      full_name: fullName.trim(),
      phone: phone.trim()
    });
    setIsLoading(false);

    if (res.success) {
      showToast('Account registered successfully! Welcome to HARCONXS.');
      navigate('/account', { replace: true });
    } else {
      setErrorMsg(res.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-[85vh] bg-zinc-950 flex items-center justify-center p-4 py-12">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6 shadow-2xl">
        
        <div className="text-center space-y-2">
          <Link to="/" className="font-serif text-2xl font-bold tracking-wider text-white uppercase inline-block">
            HARCONXS
          </Link>
          <h1 className="text-xl font-serif font-bold text-zinc-100">Create Member Account</h1>
          <p className="text-xs text-zinc-400">
            Join the HARCONXS Atelier circle to personalize jewelry, launch couple websites, and receive member perks.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs text-center font-mono">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-zinc-300">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Hamza Shahid"
                required
                className="w-full pl-9 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 text-xs focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
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

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-zinc-300">Mobile Number (Optional)</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-9 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 text-xs focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-zinc-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                minLength={6}
                className="w-full pl-9 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 text-xs focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          <label className="flex items-start gap-2 pt-1 text-[11px] text-zinc-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 rounded border-zinc-700 bg-zinc-950 text-amber-500 focus:ring-0"
            />
            <span>
              I agree to the{' '}
              <Link to="/terms" className="text-amber-400 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy-policy" className="text-amber-400 hover:underline">
                Privacy Policy
              </Link>
              .
            </span>
          </label>

          <button
            type="submit"
            disabled={isLoading || authLoading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 cursor-pointer transition-all mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account in Supabase...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create HARCONXS Account</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-zinc-400">
          <span>Already have an account? </span>
          <Link to="/login" className="font-semibold text-amber-400 hover:text-amber-300 transition-colors">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
