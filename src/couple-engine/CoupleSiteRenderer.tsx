import React, { useState, useEffect } from 'react';
import { 
  CoupleSiteBundle, 
  CoupleSite, 
  CoupleSiteThemeConfig, 
  CoupleSitePage, 
  CoupleSiteSection, 
  CoupleSiteSettings,
  CoupleGuestbookEntryData 
} from './types';
import { CoupleHeroSection } from './sections/CoupleHeroSection';
import { CoupleCountdownSection } from './sections/CoupleCountdownSection';
import { CoupleStorySection } from './sections/CoupleStorySection';
import { CoupleTimelineSection } from './sections/CoupleTimelineSection';
import { CoupleGallerySection } from './sections/CoupleGallerySection';
import { CoupleLoveLettersSection } from './sections/CoupleLoveLettersSection';
import { CoupleMemoryVaultSection } from './sections/CoupleMemoryVaultSection';
import { CoupleWishesGuestbookSection } from './sections/CoupleWishesGuestbookSection';
import { CoupleMusicPlayerBar } from './sections/CoupleMusicPlayerBar';
import { CouplePasscodeGate } from './sections/CouplePasscodeGate';
import { CoupleAmbientEffects } from './sections/CoupleAmbientEffects';
import { Heart, Share2, Copy, Check, QrCode, X, Sparkles } from 'lucide-react';
import { likeCoupleSite, recordCoupleSiteView } from './services/coupleEngineService';

export interface CoupleSiteRendererProps {
  bundle: CoupleSiteBundle;
  onNavigatePage?: (pageSlug: string) => void;
  previewMode?: boolean;
}

export const CoupleSiteRenderer: React.FC<CoupleSiteRendererProps> = ({
  bundle,
  onNavigatePage,
  previewMode = false
}) => {
  const { site, theme, pages, activePage, sections, settings, guestbook } = bundle;

  // Passcode Sanctuary Gate State
  const [isUnlocked, setIsUnlocked] = useState(!settings.is_password_protected);
  const [heartsCount, setHeartsCount] = useState(site.hearts_count || 142);
  const [hasLiked, setHasLiked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Record view count on mount
  useEffect(() => {
    if (!previewMode) {
      recordCoupleSiteView(site.id);
    }
  }, [site.id, previewMode]);

  const handleLike = async () => {
    if (hasLiked) return;
    setHasLiked(true);
    setHeartsCount((prev) => prev + 1);
    if (!previewMode) {
      await likeCoupleSite(site.id);
    }
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 3000);
    });
  };

  // If password protected and not yet entered, display Passcode Gate
  if (!isUnlocked && settings.is_password_protected && settings.passcode) {
    return (
      <CouplePasscodeGate
        site={site}
        theme={theme}
        passcodeHint={settings.passcode_hint}
        expectedPasscode={settings.passcode}
        onUnlocked={() => setIsUnlocked(true)}
      />
    );
  }

  // Filter and sort sections for the active page
  const visibleSections = sections
    .filter((sec) => sec.is_visible)
    .sort((a, b) => a.sort_order - b.sort_order);

  // Render individual section based on generic section_type
  const renderSection = (section: CoupleSiteSection) => {
    switch (section.section_type) {
      case 'hero':
        return (
          <CoupleHeroSection
            key={section.id}
            site={site}
            section={section}
            theme={theme}
          />
        );
      case 'countdown':
        return (
          <CoupleCountdownSection
            key={section.id}
            site={site}
            section={section}
            theme={theme}
          />
        );
      case 'story':
        return (
          <CoupleStorySection
            key={section.id}
            site={site}
            section={section}
            theme={theme}
          />
        );
      case 'timeline':
        return (
          <CoupleTimelineSection
            key={section.id}
            site={site}
            section={section}
            theme={theme}
          />
        );
      case 'gallery':
        return (
          <CoupleGallerySection
            key={section.id}
            site={site}
            section={section}
            theme={theme}
          />
        );
      case 'love_letters':
        return (
          <CoupleLoveLettersSection
            key={section.id}
            site={site}
            section={section}
            theme={theme}
          />
        );
      case 'memory_vault':
        return (
          <CoupleMemoryVaultSection
            key={section.id}
            site={site}
            section={section}
            theme={theme}
          />
        );
      case 'wishes_guestbook':
        return (
          <CoupleWishesGuestbookSection
            key={section.id}
            site={site}
            section={section}
            theme={theme}
            initialEntries={guestbook}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      id="couple-site-root"
      className="min-h-screen relative font-sans antialiased selection:bg-rose-500/30 selection:text-white"
      style={{
        backgroundColor: theme.palette.background,
        color: theme.palette.textPrimary,
        fontFamily: theme.fonts.body
      }}
    >
      {/* Dynamic Ambient Background Particles (Petals, Stars, Sparkles) */}
      <CoupleAmbientEffects effect={theme.ambientEffect} />

      {/* Header / Sanctuary Navigation Bar */}
      {theme.headerStyle !== 'hidden' && (
        <header
          id="couple-site-header"
          className="sticky top-0 z-30 w-full backdrop-blur-md border-b transition-all duration-300"
          style={{
            backgroundColor: `${theme.palette.background}CC`,
            borderColor: theme.palette.border
          }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            {/* Logo / Couple Emblem */}
            <div className="flex items-center gap-2">
              <span
                className="text-lg sm:text-xl font-bold tracking-tight font-serif"
                style={{
                  fontFamily: theme.fonts.heading,
                  color: theme.palette.textPrimary
                }}
              >
                {site.partner1_name} <span style={{ color: theme.palette.primary }}>&</span> {site.partner2_name}
              </span>
            </div>

            {/* Navigation Links (if multi-page) or Anchor jumps */}
            {pages.length > 1 ? (
              <nav className="hidden md:flex items-center gap-1">
                {pages.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onNavigatePage && onNavigatePage(p.slug)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      activePage.id === p.id ? 'shadow-sm' : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: activePage.id === p.id ? `${theme.palette.primary}20` : 'transparent',
                      color: activePage.id === p.id ? theme.palette.primary : theme.palette.textPrimary
                    }}
                  >
                    {p.title}
                  </button>
                ))}
              </nav>
            ) : (
              <nav className="hidden sm:flex items-center gap-4 text-xs font-medium uppercase tracking-wider opacity-80" style={{ color: theme.palette.textSecondary }}>
                <a href="#story" className="hover:opacity-100 transition-opacity">Our Story</a>
                <a href="#countdown" className="hover:opacity-100 transition-opacity">Countdown</a>
                <a href="#gallery" className="hover:opacity-100 transition-opacity">Moments</a>
                <a href="#wishes_guestbook" className="hover:opacity-100 transition-opacity">Blessings</a>
              </nav>
            )}

            {/* Header Action Controls (Send Love + Share) */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleLike}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-transform active:scale-95 cursor-pointer shadow-sm"
                style={{
                  backgroundColor: hasLiked ? `${theme.palette.primary}30` : theme.palette.surface,
                  borderColor: theme.palette.border,
                  color: hasLiked ? theme.palette.primary : theme.palette.textPrimary
                }}
                title="Send Love Heart"
              >
                <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-500 text-rose-500' : 'text-rose-400'}`} />
                <span>{heartsCount}</span>
              </button>

              <button
                onClick={() => setShowShareModal(true)}
                className="p-2 rounded-full border text-xs transition-colors hover:opacity-80 cursor-pointer shadow-sm"
                style={{
                  backgroundColor: theme.palette.surface,
                  borderColor: theme.palette.border,
                  color: theme.palette.textPrimary
                }}
                title="Share Sanctuary"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Main Sections Stream */}
      <main className="relative z-10">
        {visibleSections.map((sec) => renderSection(sec))}
      </main>

      {/* Sanctuary Footer */}
      <footer
        id="couple-site-footer"
        className="py-12 px-4 text-center border-t relative z-10 space-y-3"
        style={{
          backgroundColor: theme.palette.surface,
          borderColor: theme.palette.border,
          color: theme.palette.textSecondary
        }}
      >
        <div className="flex items-center justify-center gap-2 text-xs">
          <Sparkles className="w-3.5 h-3.5" style={{ color: theme.palette.primary }} />
          <span className="font-serif italic text-sm" style={{ color: theme.palette.textPrimary }}>
            {site.partner1_name} & {site.partner2_name}’s Timeless Sanctuary
          </span>
          <Sparkles className="w-3.5 h-3.5" style={{ color: theme.palette.primary }} />
        </div>
        <p className="text-[11px] opacity-60">
          Created with devotion • Powered by Couple Sanctuary Engine
        </p>
      </footer>

      {/* Floating Ambient Music Player */}
      {settings.music_url && (
        <CoupleMusicPlayerBar
          musicUrl={settings.music_url}
          musicTitle={settings.music_title}
          autoplay={settings.music_autoplay}
          theme={theme}
        />
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none"
          onClick={() => setShowShareModal(false)}
        >
          <div
            className="w-full max-w-sm p-6 rounded-3xl border shadow-2xl space-y-4"
            style={{
              backgroundColor: theme.palette.surface,
              borderColor: theme.palette.border,
              color: theme.palette.textPrimary
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Share2 className="w-4 h-4" style={{ color: theme.palette.primary }} />
                <span>Share Sanctuary</span>
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs opacity-80 leading-relaxed" style={{ color: theme.palette.textSecondary }}>
              Share this private sanctuary with family, wedding guests, or friends.
            </p>

            <div className="flex items-center gap-2 p-2 rounded-xl border" style={{ backgroundColor: theme.palette.background, borderColor: theme.palette.border }}>
              <input
                type="text"
                readOnly
                value={window.location.href}
                className="w-full bg-transparent text-[11px] font-mono outline-none px-2 truncate"
                style={{ color: theme.palette.textPrimary }}
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                style={{
                  backgroundColor: theme.palette.primary,
                  color: theme.palette.background
                }}
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
