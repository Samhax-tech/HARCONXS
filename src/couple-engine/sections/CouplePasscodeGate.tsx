import React, { useState } from 'react';
import { Lock, Key, Heart, Sparkles, AlertCircle } from 'lucide-react';
import { CoupleSite, CoupleSiteThemeConfig } from '../types';

interface CouplePasscodeGateProps {
  site: CoupleSite;
  theme: CoupleSiteThemeConfig;
  passcodeHint?: string;
  expectedPasscode: string;
  onUnlocked: () => void;
}

export const CouplePasscodeGate: React.FC<CouplePasscodeGateProps> = ({
  site,
  theme,
  passcodeHint,
  expectedPasscode,
  onUnlocked
}) => {
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim() === expectedPasscode.trim()) {
      onUnlocked();
    } else {
      setError(true);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 min-h-screen select-none"
      style={{
        backgroundColor: theme.palette.background,
        color: theme.palette.textPrimary
      }}
    >
      {/* Background ambient lighting */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${theme.palette.primary} 0%, transparent 70%)`
        }}
      />

      <div
        className={`w-full max-w-md p-8 rounded-3xl border shadow-2xl relative z-10 text-center transition-all ${
          isShaking ? 'animate-bounce' : ''
        }`}
        style={{
          backgroundColor: theme.palette.surface,
          borderColor: theme.palette.border
        }}
      >
        {/* Emblem */}
        <div
          className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-6 border shadow-inner"
          style={{
            backgroundColor: `${theme.palette.background}80`,
            borderColor: theme.palette.border,
            color: theme.palette.accent
          }}
        >
          <Lock className="w-7 h-7" />
        </div>

        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-4 h-4" style={{ color: theme.palette.primary }} />
          <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: theme.palette.primary }}>
            Private Couple Sanctuary
          </span>
          <Sparkles className="w-4 h-4" style={{ color: theme.palette.primary }} />
        </div>

        <h1
          className="text-2xl sm:text-3xl font-bold mb-3 tracking-tight"
          style={{
            fontFamily: theme.fonts.heading,
            color: theme.palette.textPrimary
          }}
        >
          {site.partner1_name} & {site.partner2_name}
        </h1>

        <p className="text-xs max-w-xs mx-auto mb-6 leading-relaxed" style={{ color: theme.palette.textSecondary }}>
          This sanctuary is protected. Enter the confidential passcode to unlock their memories, letters, and timelines.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              placeholder="Enter Sanctuary Passcode..."
              value={inputCode}
              onChange={(e) => {
                setInputCode(e.target.value);
                if (error) setError(false);
              }}
              autoFocus
              className="w-full px-4 py-3.5 rounded-2xl text-center text-sm font-mono tracking-widest outline-none border transition-all"
              style={{
                backgroundColor: theme.palette.background,
                borderColor: error ? '#f43f5e' : theme.palette.border,
                color: theme.palette.textPrimary
              }}
            />
            <Key className="w-4 h-4 absolute left-4 top-4 opacity-40 pointer-events-none" />
          </div>

          {error && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-rose-400">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Incorrect passcode. Please verify with the couple.</span>
            </div>
          )}

          {passcodeHint && (
            <p className="text-[11px] italic" style={{ color: theme.palette.textSecondary }}>
              Hint: {passcodeHint}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:opacity-90 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            style={{
              backgroundColor: theme.palette.primary,
              color: theme.palette.background
            }}
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Unlock Sanctuary</span>
          </button>
        </form>
      </div>
    </div>
  );
};
