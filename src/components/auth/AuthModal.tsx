import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Mail, Lock, User, Phone, CheckCircle2, Sparkles, Shield, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    userLogin,
    userRegister,
    userGoogleLogin,
    userOtpLogin
  } = useStore();

  const [authMode, setAuthMode] = useState<'login' | 'register' | 'otp'>('login');
  
  // Login form
  const [loginEmailOrPhone, setLoginEmailOrPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('+91 ');
  const [registerPassword, setRegisterPassword] = useState('');

  // OTP form
  const [otpPhone, setOtpPhone] = useState('+91 98765 43210');
  const [otpCode, setOtpCode] = useState('1234');
  const [otpSent, setOtpSent] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    setTimeout(() => {
      const res = userLogin(loginEmailOrPhone, loginPassword);
      setLoading(false);
      if (!res.success) {
        setErrorMessage(res.message);
      }
    }, 400);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    setTimeout(() => {
      const res = userRegister(registerName, registerEmail, registerPhone, registerPassword);
      setLoading(false);
      if (!res.success) {
        setErrorMessage(res.message);
      }
    }, 400);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpPhone.trim() || otpPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    setOtpSent(true);
    setErrorMessage('');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const res = userOtpLogin(otpPhone, otpCode);
      setLoading(false);
      if (!res.success) {
        setErrorMessage(res.message);
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-zinc-100 overflow-hidden">
        
        {/* Top decorative accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-rose-500 to-amber-500" />

        {/* Close button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with benefits */}
        <div className="text-center mb-6">
          <span className="font-serif text-xl font-bold tracking-wider text-zinc-100 uppercase">
            HARCONXS
          </span>
          <h3 className="text-base font-semibold text-zinc-200 mt-1">
            {authMode === 'login' && 'Sign In to Your Account'}
            {authMode === 'register' && 'Create Your Member Account'}
            {authMode === 'otp' && 'Fast Mobile OTP Login'}
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            {authMode === 'register'
              ? 'Join to access orders, bespoke engravings & couple websites'
              : 'Sign in to complete your checkout and track real-time orders'}
          </p>
        </div>

        {/* Tabs: Sign In / Create Account / Mobile OTP */}
        <div className="flex bg-zinc-900 p-1 rounded-xl mb-5 border border-zinc-800">
          <button
            type="button"
            onClick={() => { setAuthMode('login'); setErrorMessage(''); }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              authMode === 'login' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('register'); setErrorMessage(''); }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              authMode === 'register' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('otp'); setErrorMessage(''); }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              authMode === 'otp' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            🇮🇳 Mobile OTP
          </button>
        </div>

        {/* Error message banner */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-950/50 border border-rose-800/80 rounded-xl text-xs text-rose-300">
            {errorMessage}
          </div>
        )}

        {/* 1. SIGN IN FORM */}
        {authMode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                Email or Mobile Number
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={loginEmailOrPhone}
                  onChange={(e) => setLoginEmailOrPhone(e.target.value)}
                  placeholder="e.g. hamza@gmail.com or 9876543210"
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setAuthMode('otp')}
                  className="text-[11px] text-amber-400 hover:underline"
                >
                  Forgot? Use OTP
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-amber-500/10 cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In & Continue'}
            </button>
          </form>
        )}

        {/* 2. REGISTER FORM */}
        {authMode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  placeholder="Your Full Name"
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                Mobile Number (India +91)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={registerPhone}
                  onChange={(e) => setRegisterPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                Create Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-amber-500/10 cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? 'Creating Account...' : 'Create Account (+150 Bonus Points)'}
            </button>
          </form>
        )}

        {/* 3. MOBILE OTP FORM */}
        {authMode === 'otp' && (
          <div className="space-y-3.5">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                    Enter Indian Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={otpPhone}
                      onChange={(e) => setOtpPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      required
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-amber-500/10 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Send Verification Code</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3">
                <div className="p-2.5 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-[11px] text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>OTP code sent to {otpPhone}. (Demo Code: 1234)</span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                    4-Digit Verification OTP
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="1 2 3 4"
                    required
                    className="w-full text-center tracking-widest text-lg font-mono font-bold bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-500/10 cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify OTP & Continue'}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="text-[11px] text-zinc-400 hover:text-zinc-200 underline"
                  >
                    Change Mobile Number
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-zinc-950 px-2 text-zinc-500">Or continue with</span>
          </div>
        </div>

        {/* Google One-Click Login */}
        <button
          type="button"
          onClick={userGoogleLogin}
          className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 hover:border-zinc-700 text-xs font-medium rounded-xl flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.7 0 3 .6 4 1.5l3-3C17.1 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.1-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Trust footer */}
        <div className="mt-4 pt-3 border-t border-zinc-900 text-center flex items-center justify-center gap-1.5 text-[10px] text-zinc-500">
          <Shield className="w-3.5 h-3.5 text-amber-500" />
          <span>256-Bit Encrypted • Never Shared • Instant Account</span>
        </div>

      </div>
    </div>
  );
};
