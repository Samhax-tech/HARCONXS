import React, { useState } from 'react';
import { Lock, Unlock, Play, Pause, Key, Sparkles, Volume2, ShieldCheck } from 'lucide-react';
import { CoupleSite, CoupleSiteSection, CoupleSiteThemeConfig } from '../types';

interface CoupleMemoryVaultSectionProps {
  site: CoupleSite;
  section: CoupleSiteSection;
  theme: CoupleSiteThemeConfig;
}

export const CoupleMemoryVaultSection: React.FC<CoupleMemoryVaultSectionProps> = ({
  site,
  section,
  theme
}) => {
  const content = section.content || {};
  const vaultItems = content.vaultItems || [];
  const [playingAudioIdx, setPlayingAudioIdx] = useState<number | null>(null);

  const toggleAudio = (idx: number) => {
    if (playingAudioIdx === idx) {
      setPlayingAudioIdx(null);
    } else {
      setPlayingAudioIdx(idx);
    }
  };

  return (
    <section
      id="vault"
      className="py-20 px-4 relative overflow-hidden"
      style={{
        backgroundColor: theme.palette.background,
        color: theme.palette.textPrimary
      }}
    >
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest" style={{ color: theme.palette.primary }}>
            <Lock className="w-3.5 h-3.5" />
            <span>Vault Sanctuary</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{
              fontFamily: theme.fonts.heading,
              color: theme.palette.textPrimary
            }}
          >
            {section.title || 'The Sovereign Reliquary'}
          </h2>
          {section.subtitle && (
            <p className="text-xs sm:text-sm max-w-md mx-auto opacity-80" style={{ color: theme.palette.textSecondary }}>
              {section.subtitle}
            </p>
          )}
        </div>

        {/* Relic Vault Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {vaultItems.map((item: any, idx: number) => (
            <div
              key={idx}
              className="p-6 rounded-3xl border shadow-xl relative overflow-hidden space-y-4"
              style={{
                backgroundColor: theme.palette.surface,
                borderColor: theme.palette.border
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs"
                    style={{
                      backgroundColor: `${theme.palette.primary}20`,
                      color: theme.palette.primary
                    }}
                  >
                    {item.isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-wider" style={{ color: theme.palette.primary }}>
                    {item.date}
                  </span>
                </div>

                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border" style={{ borderColor: theme.palette.border, color: theme.palette.textSecondary }}>
                  {item.type || 'Relic'}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold" style={{ color: theme.palette.textPrimary }}>
                  {item.title}
                </h3>
                <p className="text-xs leading-relaxed opacity-90" style={{ color: theme.palette.textSecondary }}>
                  {item.description}
                </p>
              </div>

              {/* Audio Player for Voice Notes */}
              {item.type === 'audio' && (
                <div className="pt-2">
                  <button
                    onClick={() => toggleAudio(idx)}
                    className="w-full py-2.5 px-4 rounded-xl border flex items-center justify-between text-xs font-semibold hover:opacity-90 transition-all cursor-pointer"
                    style={{
                      backgroundColor: theme.palette.background,
                      borderColor: theme.palette.border,
                      color: theme.palette.primary
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {playingAudioIdx === idx ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                      <span>{playingAudioIdx === idx ? 'Playing Voice Recording' : 'Listen To Voice Recording'}</span>
                    </div>
                    <Volume2 className="w-3.5 h-3.5 opacity-60" />
                  </button>
                </div>
              )}

              {/* Time Capsule Lock Banner */}
              {item.isLocked && (
                <div className="p-3 rounded-xl border flex items-center gap-2 text-xs" style={{ backgroundColor: `${theme.palette.background}80`, borderColor: theme.palette.border }}>
                  <ShieldCheck className="w-4 h-4 shrink-0" style={{ color: theme.palette.accent }} />
                  <span className="text-[11px] opacity-80" style={{ color: theme.palette.textSecondary }}>
                    Secured by cryptographic milestone lock.
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
