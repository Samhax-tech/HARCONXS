import React from 'react';
import { PageRecord, PageSection } from '../../types';
import { PageSectionRenderer } from '../admin/PageSectionRenderer';
import { HeroSection } from '../home/HeroSection';
import { CategoryGrid } from '../home/CategoryGrid';
import { FeaturedSection } from '../home/FeaturedSection';
import { CoupleWebsitesSection } from '../home/CoupleWebsitesSection';
import { CustomServicesSection } from '../home/CustomServicesSection';
import { SupportSection } from '../home/SupportSection';
import { TrustBenefitsSection } from '../home/TrustBenefitsSection';
import { CtaSection } from '../home/CtaSection';
import { Sparkles, Layers } from 'lucide-react';

export interface SiteRendererProps {
  pageRecord?: PageRecord | null;
  sections?: PageSection[];
  isLiveStorefront?: boolean;
  previewMode?: boolean;
  selectedSectionId?: string | null;
  onSelectSection?: (section: PageSection) => void;
  showInspectorOutline?: boolean;
  className?: string;
  onAddFirstSection?: () => void;
}

export const SiteRenderer: React.FC<SiteRendererProps> = ({
  pageRecord,
  sections,
  isLiveStorefront = false,
  previewMode = false,
  selectedSectionId = null,
  onSelectSection,
  showInspectorOutline = true,
  className = '',
  onAddFirstSection
}) => {
  const activeSections = sections || pageRecord?.sections || [];

  // If page has defined sections, render them sequentially
  if (activeSections.length > 0) {
    // Sort sections by sortOrder
    const sortedSections = [...activeSections].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

    return (
      <div 
        id={isLiveStorefront ? "storefront-root-renderer" : "preview-canvas-site-renderer"}
        className={`w-full min-h-screen bg-zinc-950 text-zinc-100 space-y-0 ${className}`}
      >
        {sortedSections.map((section) => (
          <PageSectionRenderer
            key={section.id}
            section={section}
            previewMode={previewMode}
            isLiveStorefront={isLiveStorefront}
            isSelected={section.id === selectedSectionId}
            showInspectorOutline={showInspectorOutline && !previewMode}
            onSelectSection={onSelectSection}
          />
        ))}
      </div>
    );
  }

  // Fallback 1: If in Editor and page has no sections, show a clean empty state
  if (!isLiveStorefront) {
    return (
      <div className={`w-full min-h-[600px] flex items-center justify-center p-8 bg-zinc-950 text-zinc-100 ${className}`}>
        <div className="py-16 px-6 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-zinc-100">
            {pageRecord?.title || 'Page'} Layout is Empty
          </h2>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
            Start composing this page by choosing from curated hero showcases, bespoke product grids, couple sanctum carousels, or customer trust pillars.
          </p>
          {onAddFirstSection && (
            <button
              onClick={onAddFirstSection}
              className="px-6 py-3 rounded-2xl bg-amber-400 text-zinc-950 font-bold text-xs hover:bg-amber-300 transition-colors shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              + Browse Section Library
            </button>
          )}
        </div>
      </div>
    );
  }

  // Fallback 2: Default Live Storefront if no sections exist in database
  return (
    <div id="storefront-fallback-renderer" className={`w-full min-h-screen bg-zinc-950 text-zinc-100 space-y-0 ${className}`}>
      <HeroSection />
      <CategoryGrid />
      <FeaturedSection />
      <CoupleWebsitesSection />
      <CustomServicesSection />
      <TrustBenefitsSection />
      <SupportSection />
      <CtaSection />
    </div>
  );
};
