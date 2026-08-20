import React from 'react';
import { BookOpen, Sparkles, Heart } from 'lucide-react';
import { CoupleSite, CoupleSiteSection, CoupleSiteThemeConfig } from '../types';

interface CoupleStorySectionProps {
  site: CoupleSite;
  section: CoupleSiteSection;
  theme: CoupleSiteThemeConfig;
}

export const CoupleStorySection: React.FC<CoupleStorySectionProps> = ({
  site,
  section,
  theme
}) => {
  const content = section.content || {};
  const chapters = content.chapters || [];

  return (
    <section
      id="story"
      className="py-20 px-4 relative overflow-hidden"
      style={{
        backgroundColor: theme.palette.background,
        color: theme.palette.textPrimary
      }}
    >
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Section Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest" style={{ color: theme.palette.primary }}>
            <BookOpen className="w-3.5 h-3.5" />
            <span>Our Narrative</span>
          </div>
          <h2
            className="text-3xl sm:text-5xl font-bold tracking-tight"
            style={{
              fontFamily: theme.fonts.heading,
              color: theme.palette.textPrimary
            }}
          >
            {section.title || 'The Chapters of Us'}
          </h2>
          {section.subtitle && (
            <p className="text-xs sm:text-sm max-w-lg mx-auto opacity-80" style={{ color: theme.palette.textSecondary }}>
              {section.subtitle}
            </p>
          )}
        </div>

        {/* Chapters Stack */}
        <div className="space-y-16">
          {chapters.map((chapter: any, idx: number) => {
            const isEven = idx % 2 === 0;

            return (
              <div
                key={idx}
                className={`flex flex-col ${
                  isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } items-center gap-8 lg:gap-12 p-6 sm:p-8 rounded-3xl border shadow-xl`}
                style={{
                  backgroundColor: theme.palette.surface,
                  borderColor: theme.palette.border
                }}
              >
                {/* Chapter Photo */}
                {chapter.image && (
                  <div className="w-full lg:w-1/2 overflow-hidden rounded-2xl border aspect-[4/3] relative shadow-md group shrink-0" style={{ borderColor: theme.palette.border }}>
                    <img
                      src={chapter.image}
                      alt={chapter.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{ backgroundColor: theme.palette.primary }}
                    />
                  </div>
                )}

                {/* Chapter Text Content */}
                <div className="w-full lg:w-1/2 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-widest font-bold" style={{ color: theme.palette.primary }}>
                      {chapter.number || `Chapter ${idx + 1}`}
                    </span>
                    {chapter.date && (
                      <span className="text-xs font-mono px-2.5 py-0.5 rounded-full border" style={{ borderColor: theme.palette.border, color: theme.palette.textSecondary }}>
                        {chapter.date}
                      </span>
                    )}
                  </div>

                  <h3
                    className="text-2xl sm:text-3xl font-bold leading-tight"
                    style={{
                      fontFamily: theme.fonts.heading,
                      color: theme.palette.textPrimary
                    }}
                  >
                    {chapter.title}
                  </h3>

                  <p className="text-xs sm:text-sm leading-relaxed opacity-90 font-light" style={{ color: theme.palette.textSecondary }}>
                    {chapter.text}
                  </p>

                  {chapter.quote && (
                    <div className="p-3.5 rounded-xl border italic text-xs leading-relaxed" style={{ backgroundColor: `${theme.palette.background}80`, borderColor: theme.palette.border, color: theme.palette.accent }}>
                      “{chapter.quote}”
                    </div>
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
