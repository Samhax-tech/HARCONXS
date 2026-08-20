import React, { useState, useEffect } from 'react';
import { Clock, Heart, Sparkles, Award } from 'lucide-react';
import { CoupleSite, CoupleSiteSection, CoupleSiteThemeConfig } from '../types';

interface CoupleCountdownSectionProps {
  site: CoupleSite;
  section: CoupleSiteSection;
  theme: CoupleSiteThemeConfig;
}

export const CoupleCountdownSection: React.FC<CoupleCountdownSectionProps> = ({
  site,
  section,
  theme
}) => {
  const content = section.content || {};
  const targetDateStr = content.startDate || site.anniversary_date || '2022-06-14T00:00:00.000Z';
  const anniversaryLabel = content.anniversaryLabel || 'In Love For';
  const milestones = content.milestones || [];

  const [elapsed, setElapsed] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 0
  });

  useEffect(() => {
    const updateTimer = () => {
      const start = new Date(targetDateStr).getTime();
      const now = new Date().getTime();
      const diffMs = Math.max(0, now - start);

      const totalSeconds = Math.floor(diffMs / 1000);
      const totalDays = Math.floor(totalSeconds / 86400);

      const years = Math.floor(totalDays / 365.25);
      const months = Math.floor((totalDays % 365.25) / 30.4375);
      const days = Math.floor(totalDays % 30.4375);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setElapsed({ years, months, days, hours, minutes, seconds, totalDays });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [targetDateStr]);

  const units = [
    { label: 'Years', value: elapsed.years },
    { label: 'Months', value: elapsed.months },
    { label: 'Days', value: elapsed.days },
    { label: 'Hours', value: elapsed.hours },
    { label: 'Minutes', value: elapsed.minutes },
    { label: 'Seconds', value: elapsed.seconds }
  ];

  return (
    <section
      id="countdown"
      className="py-16 px-4 relative overflow-hidden"
      style={{
        backgroundColor: theme.palette.surface,
        color: theme.palette.textPrimary,
        borderTop: `1px solid ${theme.palette.border}`,
        borderBottom: `1px solid ${theme.palette.border}`
      }}
    >
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Section Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest" style={{ color: theme.palette.primary }}>
            <Clock className="w-3.5 h-3.5" />
            <span>{anniversaryLabel}</span>
          </div>
          <h2
            className="text-2xl sm:text-4xl font-bold tracking-tight"
            style={{
              fontFamily: theme.fonts.heading,
              color: theme.palette.textPrimary
            }}
          >
            {section.title || 'Every Second Is A Treasure'}
          </h2>
          {section.subtitle && (
            <p className="text-xs sm:text-sm max-w-md mx-auto" style={{ color: theme.palette.textSecondary }}>
              {section.subtitle}
            </p>
          )}
        </div>

        {/* Counter Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 max-w-2xl mx-auto">
          {units.map((unit, idx) => (
            <div
              key={idx}
              className="p-3.5 sm:p-4 rounded-2xl border flex flex-col items-center justify-center shadow-lg transition-transform hover:-translate-y-1"
              style={{
                backgroundColor: theme.palette.background,
                borderColor: theme.palette.border
              }}
            >
              <span
                className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono tracking-tight"
                style={{ color: theme.palette.primary }}
              >
                {String(unit.value).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider mt-1 opacity-70" style={{ color: theme.palette.textSecondary }}>
                {unit.label}
              </span>
            </div>
          ))}
        </div>

        {/* Total Days Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-medium"
          style={{
            backgroundColor: `${theme.palette.background}80`,
            borderColor: theme.palette.border,
            color: theme.palette.accent
          }}
        >
          <Heart className="w-3.5 h-3.5 fill-current text-rose-400" />
          <span>{elapsed.totalDays.toLocaleString()} Continuous Days Together</span>
        </div>

        {/* Milestones if present */}
        {milestones.length > 0 && (
          <div className="pt-4 border-t max-w-xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3" style={{ borderColor: theme.palette.border }}>
            {milestones.map((m: any, idx: number) => (
              <div key={idx} className="p-3 rounded-xl border text-left space-y-1" style={{ backgroundColor: `${theme.palette.background}60`, borderColor: theme.palette.border }}>
                <div className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: theme.palette.primary }}>
                  <Award className="w-3 h-3" />
                  <span>{m.label}</span>
                </div>
                <div className="text-[10px] font-mono opacity-80" style={{ color: theme.palette.textSecondary }}>
                  {m.date}
                </div>
                {m.note && (
                  <p className="text-[11px] leading-tight" style={{ color: theme.palette.textPrimary }}>
                    {m.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
