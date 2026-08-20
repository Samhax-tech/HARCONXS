import React, { useState } from 'react';
import { Mail, Heart, Sparkles, Feather, Eye, EyeOff } from 'lucide-react';
import { CoupleSite, CoupleSiteSection, CoupleSiteThemeConfig } from '../types';

interface CoupleLoveLettersSectionProps {
  site: CoupleSite;
  section: CoupleSiteSection;
  theme: CoupleSiteThemeConfig;
}

export const CoupleLoveLettersSection: React.FC<CoupleLoveLettersSectionProps> = ({
  site,
  section,
  theme
}) => {
  const content = section.content || {};
  const letters = content.letters || [];
  const [openedLetterIdx, setOpenedLetterIdx] = useState<number | null>(null);

  return (
    <section
      id="love_letters"
      className="py-20 px-4 relative overflow-hidden"
      style={{
        backgroundColor: theme.palette.surface,
        color: theme.palette.textPrimary,
        borderTop: `1px solid ${theme.palette.border}`,
        borderBottom: `1px solid ${theme.palette.border}`
      }}
    >
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest" style={{ color: theme.palette.primary }}>
            <Feather className="w-3.5 h-3.5" />
            <span>Epistles</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{
              fontFamily: theme.fonts.heading,
              color: theme.palette.textPrimary
            }}
          >
            {section.title || 'Sealed With A Promise'}
          </h2>
          {section.subtitle && (
            <p className="text-xs sm:text-sm max-w-md mx-auto opacity-80" style={{ color: theme.palette.textSecondary }}>
              {section.subtitle}
            </p>
          )}
        </div>

        {/* Letters Grid */}
        <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto">
          {letters.map((letter: any, idx: number) => {
            const isOpened = openedLetterIdx === idx;

            return (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-3xl border shadow-xl relative transition-all duration-300"
                style={{
                  backgroundColor: theme.palette.background,
                  borderColor: theme.palette.border
                }}
              >
                <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: theme.palette.border }}>
                  <div className="space-y-0.5">
                    <div className="text-xs font-mono font-bold" style={{ color: theme.palette.primary }}>
                      To: {letter.to}
                    </div>
                    <div className="text-[11px] opacity-70" style={{ color: theme.palette.textSecondary }}>
                      From: {letter.from} • {letter.date}
                    </div>
                  </div>

                  {/* Wax Seal Stamp */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg border"
                    style={{
                      backgroundColor: letter.waxSealColor || theme.palette.primary,
                      borderColor: theme.palette.accent,
                      color: theme.palette.background
                    }}
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </div>
                </div>

                <div className="pt-5 space-y-4">
                  <p
                    className="text-sm sm:text-base leading-relaxed italic font-serif"
                    style={{ color: theme.palette.textPrimary }}
                  >
                    {isOpened ? (letter.fullContent || letter.excerpt) : letter.excerpt}
                  </p>

                  {letter.fullContent && (
                    <button
                      onClick={() => setOpenedLetterIdx(isOpened ? null : idx)}
                      className="text-xs font-semibold underline underline-offset-4 cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ color: theme.palette.primary }}
                    >
                      {isOpened ? 'Read Less' : 'Break Wax Seal & Read Full Epistle →'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
