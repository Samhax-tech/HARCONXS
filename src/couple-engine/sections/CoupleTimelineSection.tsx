import React from 'react';
import { Compass, Calendar, MapPin, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { CoupleSite, CoupleSiteSection, CoupleSiteThemeConfig } from '../types';

interface CoupleTimelineSectionProps {
  site: CoupleSite;
  section: CoupleSiteSection;
  theme: CoupleSiteThemeConfig;
}

export const CoupleTimelineSection: React.FC<CoupleTimelineSectionProps> = ({
  site,
  section,
  theme
}) => {
  const content = section.content || {};
  const milestones = content.milestones || [];

  return (
    <section
      id="timeline"
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
            <Compass className="w-3.5 h-3.5" />
            <span>Chronicle</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{
              fontFamily: theme.fonts.heading,
              color: theme.palette.textPrimary
            }}
          >
            {section.title || 'Our Journey Through Time'}
          </h2>
          {section.subtitle && (
            <p className="text-xs sm:text-sm max-w-md mx-auto opacity-80" style={{ color: theme.palette.textSecondary }}>
              {section.subtitle}
            </p>
          )}
        </div>

        {/* Vertical Timeline Track */}
        <div className="relative pl-6 sm:pl-8 border-l-2 ml-4 sm:ml-8 space-y-10" style={{ borderColor: theme.palette.border }}>
          {milestones.map((milestone: any, idx: number) => (
            <div key={idx} className="relative group">
              {/* Timeline Pin Node */}
              <div
                className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center shadow-lg transition-transform group-hover:scale-125"
                style={{
                  backgroundColor: theme.palette.background,
                  borderColor: theme.palette.primary,
                  color: theme.palette.primary
                }}
              >
                <Heart className="w-3 h-3 fill-current" />
              </div>

              {/* Milestone Card */}
              <div
                className="p-5 sm:p-6 rounded-2xl border shadow-md space-y-2 transition-transform duration-300 hover:translate-x-1"
                style={{
                  backgroundColor: theme.palette.background,
                  borderColor: theme.palette.border
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: theme.palette.primary }}>
                      {milestone.date}
                    </span>
                    {milestone.tag && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider" style={{ backgroundColor: `${theme.palette.primary}20`, color: theme.palette.primary }}>
                        {milestone.tag}
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-bold" style={{ color: theme.palette.textPrimary }}>
                  {milestone.title}
                </h3>

                <p className="text-xs sm:text-sm leading-relaxed opacity-90 font-light" style={{ color: theme.palette.textSecondary }}>
                  {milestone.detail || milestone.description}
                </p>

                {milestone.location && (
                  <div className="flex items-center gap-1.5 text-xs opacity-75 pt-1" style={{ color: theme.palette.accent }}>
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>{milestone.location}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
