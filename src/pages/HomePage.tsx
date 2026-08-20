import React from 'react';
import { useStore } from '../context/StoreContext';
import { PageSectionRenderer } from '../components/admin/PageSectionRenderer';
import { HeroSection } from '../components/home/HeroSection';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { FeaturedSection } from '../components/home/FeaturedSection';

export const HomePage: React.FC = () => {
  const { activePageRecord } = useStore();

  // If active page record has sections configured from Supabase, render them dynamically
  if (activePageRecord?.sections && activePageRecord.sections.length > 0) {
    return (
      <div id="home-page-storefront" className="space-y-0 min-h-screen bg-zinc-950 text-zinc-100">
        {activePageRecord.sections.map((section) => (
          <PageSectionRenderer
            key={section.id}
            section={section}
            isLiveStorefront={true}
          />
        ))}
      </div>
    );
  }

  // Fallback default storefront
  return (
    <div id="home-page-fallback" className="space-y-0">
      <HeroSection />
      <CategoryGrid />
      <FeaturedSection />
    </div>
  );
};

export default HomePage;
