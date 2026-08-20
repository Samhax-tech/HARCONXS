import React from 'react';
import { ThemeConfig, ThemeRevision } from '../types';
import { INITIAL_THEME_CONFIG } from '../data/initialData';

/**
 * Normalizes any partial or legacy theme configuration from database/storage,
 * ensuring all 11 settings categories are fully populated with robust fallbacks.
 */
export function normalizeThemeConfig(raw?: Partial<ThemeConfig> | null): ThemeConfig {
  if (!raw) return { ...INITIAL_THEME_CONFIG };

  const base = { ...INITIAL_THEME_CONFIG };

  return {
    ...base,
    ...raw,
    siteName: raw.siteName || raw.brand?.siteName || base.siteName,
    tagline: raw.tagline || raw.brand?.tagline || base.tagline,
    announcementText: raw.announcementText || raw.announcement?.announcementText || base.announcementText,
    announcementDiscountCode: raw.announcementDiscountCode || raw.announcement?.announcementDiscountCode || base.announcementDiscountCode,
    heroHeadline: raw.heroHeadline || base.heroHeadline,
    heroSubheadline: raw.heroSubheadline || base.heroSubheadline,
    primaryColor: raw.primaryColor || raw.colors?.primaryColor || base.primaryColor,
    accentColor: raw.accentColor || raw.colors?.accentColor || base.accentColor,
    secondaryColor: raw.secondaryColor || raw.colors?.secondaryColor || base.secondaryColor,
    fontFamily: raw.fontFamily || (raw.typography?.fontFamily as any) || base.fontFamily,
    bannerImageUrl: raw.bannerImageUrl || base.bannerImageUrl,
    logoImageUrl: raw.logoImageUrl || raw.brand?.logoImageUrl || base.logoImageUrl,
    footerTagline: raw.footerTagline || raw.footer?.footerTagline || base.footerTagline,
    supportEmail: raw.supportEmail || raw.footer?.supportEmail || base.supportEmail,
    supportPhone: raw.supportPhone || raw.footer?.supportPhone || base.supportPhone,
    freeShippingThreshold: raw.freeShippingThreshold || raw.announcement?.freeShippingThreshold || base.freeShippingThreshold,

    brand: {
      ...base.brand,
      ...(raw.brand || {}),
      siteName: raw.brand?.siteName || raw.siteName || base.brand.siteName,
      tagline: raw.brand?.tagline || raw.tagline || base.brand.tagline,
    },
    typography: {
      ...base.typography,
      ...(raw.typography || {}),
    },
    colors: {
      ...base.colors,
      ...(raw.colors || {}),
      primaryColor: raw.colors?.primaryColor || raw.primaryColor || base.colors.primaryColor,
      accentColor: raw.colors?.accentColor || raw.accentColor || base.colors.accentColor,
      secondaryColor: raw.colors?.secondaryColor || raw.secondaryColor || base.colors.secondaryColor,
    },
    buttons: {
      ...base.buttons,
      ...(raw.buttons || {}),
    },
    cards: {
      ...base.cards,
      ...(raw.cards || {}),
    },
    header: {
      ...base.header,
      ...(raw.header || {}),
    },
    footer: {
      ...base.footer,
      ...(raw.footer || {}),
      footerTagline: raw.footer?.footerTagline || raw.footerTagline || base.footer.footerTagline,
      supportEmail: raw.footer?.supportEmail || raw.supportEmail || base.footer.supportEmail,
      supportPhone: raw.footer?.supportPhone || raw.supportPhone || base.footer.supportPhone,
    },
    announcement: {
      ...base.announcement,
      ...(raw.announcement || {}),
      announcementText: raw.announcement?.announcementText || raw.announcementText || base.announcement.announcementText,
      announcementDiscountCode: raw.announcement?.announcementDiscountCode || raw.announcementDiscountCode || base.announcement.announcementDiscountCode,
      freeShippingThreshold: raw.announcement?.freeShippingThreshold || raw.freeShippingThreshold || base.announcement.freeShippingThreshold,
    },
    layout: {
      ...base.layout,
      ...(raw.layout || {}),
    },
    responsive: {
      ...base.responsive,
      ...(raw.responsive || {}),
    },
    seo: {
      ...base.seo,
      ...(raw.seo || {}),
    },
    version: raw.version || 1,
    status: raw.status || 'published',
    updatedAt: raw.updatedAt || new Date().toISOString(),
    updatedBy: raw.updatedBy || 'admin'
  };
}

/**
 * Converts active theme tokens into dynamic CSS variables injected on document root.
 */
export function getThemeCssVariables(theme: ThemeConfig): React.CSSProperties {
  const norm = normalizeThemeConfig(theme);
  return {
    '--theme-primary': norm.colors.primaryColor,
    '--theme-accent': norm.colors.accentColor,
    '--theme-secondary': norm.colors.secondaryColor,
    '--theme-bg': norm.colors.backgroundColor,
    '--theme-surface': norm.colors.surfaceColor,
    '--theme-border': norm.colors.borderColor,
    '--theme-text': norm.colors.textColor,
    '--theme-text-muted': norm.colors.textMutedColor,
  } as React.CSSProperties;
}

/**
 * Reusable theme styling for Couple Website Engine.
 * Allows couple websites to inherit master brand palette or specialized aesthetic tokens.
 */
export function getCoupleWebsiteThemeStyle(theme: ThemeConfig) {
  const norm = normalizeThemeConfig(theme);
  return {
    fontFamily: norm.typography.headingFont === 'Playfair Display' ? 'serif' : 'sans-serif',
    accentColor: norm.colors.accentColor || '#f43f5e',
    primaryColor: norm.colors.primaryColor || '#f59e0b',
    surfaceColor: norm.colors.surfaceColor || '#18181b',
    borderRadius: norm.cards.cardRadius === '3xl' ? '1.5rem' : norm.cards.cardRadius === '2xl' ? '1rem' : '0.75rem',
    buttonRadius: norm.buttons.buttonRadius === 'full' ? '9999px' : '0.75rem',
  };
}

/**
 * Generates button class strings according to theme button configuration
 */
export function getThemeButtonClasses(
  theme: ThemeConfig, 
  variant: 'primary' | 'secondary' | 'outline' = 'primary',
  size: 'sm' | 'md' | 'lg' = 'md'
): string {
  const norm = normalizeThemeConfig(theme);
  const radiusMap: Record<string, string> = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full'
  };

  const radius = radiusMap[norm.buttons.buttonRadius] || 'rounded-xl';
  const transform = norm.buttons.buttonTransform === 'uppercase' ? 'uppercase tracking-wider' : norm.buttons.buttonTransform === 'capitalize' ? 'capitalize' : '';
  const weight = norm.buttons.buttonFontWeight === 'bold' ? 'font-bold' : norm.buttons.buttonFontWeight === 'medium' ? 'font-medium' : 'font-semibold';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs min-h-[36px]',
    md: 'px-5 py-2.5 text-sm min-h-[44px]',
    lg: 'px-7 py-3.5 text-base min-h-[50px]'
  }[size];

  if (variant === 'primary') {
    if (norm.buttons.buttonStyle === 'luxury-pill') {
      return `rounded-full px-6 py-3 font-bold bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-zinc-950 shadow-lg shadow-amber-400/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer ${transform} ${sizeClasses}`;
    }
    if (norm.buttons.buttonStyle === 'glow') {
      return `${radius} ${weight} ${transform} ${sizeClasses} bg-amber-400 text-zinc-950 shadow-lg shadow-amber-400/30 hover:shadow-amber-400/50 hover:bg-amber-300 transition-all cursor-pointer`;
    }
    return `${radius} ${weight} ${transform} ${sizeClasses} bg-amber-400 hover:bg-amber-300 text-zinc-950 transition-all cursor-pointer`;
  }

  if (variant === 'outline') {
    return `${radius} ${weight} ${transform} ${sizeClasses} border border-amber-400/40 text-amber-300 hover:bg-amber-400/10 hover:border-amber-400 transition-all cursor-pointer`;
  }

  return `${radius} ${weight} ${transform} ${sizeClasses} bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700/80 transition-all cursor-pointer`;
}
