import React from 'react';
import { useStore } from '../context/StoreContext';
import { PageSectionRenderer } from '../components/admin/PageSectionRenderer';
import { HeroSection } from '../components/home/HeroSection';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { FeaturedSection } from '../components/home/FeaturedSection';
import { SeoHead } from '../components/common/SeoHead';

export const HomePage: React.FC = () => {
  const { activePageRecord } = useStore();

  return (
    <div id="home-page-root" className="space-y-0">
      <SeoHead
        title="HARCONXS | Haute Joaillerie, Bespoke Gifts & Digital Sanctuary"
        description="Explore handcrafted 18K/Platinum heirloom jewelry, personalized engraved bracelets, private couple memory websites, and sovereign bot integrations."
      />

      {/* If active page record has sections configured from Supabase, render them dynamically */}
      {activePageRecord?.sections && activePageRecord.sections.length > 0 ? (
        <div id="home-page-storefront" className="space-y-0 min-h-screen bg-zinc-950 text-zinc-100">
          {activePageRecord.sections.map((section) => (
            <PageSectionRenderer
              key={section.id}
              section={section}
              isLiveStorefront={true}
            />
          ))}
        </div>
      ) : (
        /* Fallback default storefront */
        <div id="home-page-fallback" className="space-y-0">
          <HeroSection />
          <CategoryGrid />
          <FeaturedSection />
        </div>
      )}
    </div>
  );
};

export default HomePage;

