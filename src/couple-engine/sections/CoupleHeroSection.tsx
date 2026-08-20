import React from 'react';
import { Heart, Sparkles, Calendar, ArrowDown } from 'lucide-react';
import { CoupleSite, CoupleSiteSection, CoupleSiteThemeConfig } from '../types';

interface CoupleHeroSectionProps {
  site: CoupleSite;
  section: CoupleSiteSection;
  theme: CoupleSiteThemeConfig;
  onCtaClick?: () => void;
}

export const CoupleHeroSection: React.FC<CoupleHeroSectionProps> = ({
  site,
  section,
  theme,
  onCtaClick
}) => {
  const content = section.content || {};
  const heroBadge = content.heroBadge || 'Our Sanctuary';
  const heroQuote = content.heroQuote || '“Two hearts, one endless horizon.”';
  const backgroundImage = content.backgroundImage || site.partner1_photo || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80';
  const ctaText = content.ctaText || 'Explore Our Story';

  const formattedAnniversary = site.anniversary_date 
    ? new Date(site.anniversary_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : null;

  return (
    <section
      id="hero"
      className="relative min-h-[90vh] flex items-center justify-center text-center px-4 py-20 overflow-hidden"
      style={{
        backgroundColor: theme.palette.background,
        color: theme.palette.textPrimary
      }}
    >
      {/* Background Image with Theme Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImage}
          alt={`${site.partner1_name} and ${site.partner2_name}`}
          className="w-full h-full object-cover object-center filter brightness-40 scale-105 transition-transform duration-1000"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at center, transparent 0%, ${theme.palette.background} 95%), linear-gradient(to bottom, ${theme.palette.background}80, ${theme.palette.background})`
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border backdrop-blur-md text-xs font-semibold uppercase tracking-widest"
          style={{
            backgroundColor: `${theme.palette.surface}80`,
            borderColor: theme.palette.border,
            color: theme.palette.primary
          }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{heroBadge}</span>
          <Sparkles className="w-3.5 h-3.5" />
        </div>

        {/* Partner Names */}
        <div className="space-y-2">
          <h1
            className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-none"
            style={{
              fontFamily: theme.fonts.heading,
              color: theme.palette.textPrimary
            }}
          >
            {site.partner1_name} <span style={{ color: theme.palette.primary }}>&</span> {site.partner2_name}
          </h1>

          {section.subtitle && (
            <p className="text-base sm:text-lg font-light tracking-wide max-w-xl mx-auto opacity-90" style={{ color: theme.palette.textSecondary }}>
              {section.subtitle}
            </p>
          )}
        </div>

        {/* Anniversary Date Badge if set */}
        {formattedAnniversary && (
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-medium opacity-80" style={{ color: theme.palette.accent }}>
            <Calendar className="w-4 h-4" />
            <span>Forever Since {formattedAnniversary}</span>
          </div>
        )}

        {/* Quote Block */}
        {heroQuote && (
          <div className="max-w-lg mx-auto py-2">
            <p className="italic text-sm sm:text-base leading-relaxed" style={{ color: theme.palette.textSecondary }}>
              {heroQuote}
            </p>
          </div>
        )}

        {/* CTA Button */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => {
              if (onCtaClick) {
                onCtaClick();
              } else {
                const nextSection = document.getElementById('story') || document.getElementById('countdown') || document.getElementById('timeline');
                if (nextSection) {
                  nextSection.scrollIntoView({ behavior: 'smooth' });
                }
              }
            }}
            className="px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest shadow-xl transition-all duration-300 hover:scale-105 hover:opacity-90 active:scale-95 cursor-pointer flex items-center gap-2"
            style={{
              backgroundColor: theme.palette.primary,
              color: theme.palette.background
            }}
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>{ctaText}</span>
          </button>
        </div>
      </div>

      {/* Down Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 animate-bounce opacity-60">
        <ArrowDown className="w-4 h-4" style={{ color: theme.palette.textSecondary }} />
      </div>
    </section>
  );
};
