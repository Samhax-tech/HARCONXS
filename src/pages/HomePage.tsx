import React from 'react';
import { useStore } from '../context/StoreContext';
import { SiteRenderer } from '../components/common/SiteRenderer';
import { SeoHead } from '../components/common/SeoHead';

export const HomePage: React.FC = () => {
  const { activePageRecord } = useStore();

  return (
    <div id="home-page-root" className="space-y-0 w-full min-h-screen bg-zinc-950 text-zinc-100">
      <SeoHead
        title="HARCONXS | Haute Joaillerie, Bespoke Gifts & Digital Sanctuary"
        description="Explore handcrafted 18K/Platinum heirloom jewelry, personalized engraved bracelets, private couple memory websites, and sovereign bot integrations."
      />

      {/* Shared SiteRenderer for live storefront and editor preview */}
      <SiteRenderer
        pageRecord={activePageRecord}
        isLiveStorefront={true}
      />
    </div>
  );
};

export default HomePage;

