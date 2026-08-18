import React from 'react';
import { AboutUsPage as AboutUsComponent } from '../components/pages/AboutUsPage';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const AboutUsPage: React.FC = () => {
  return (
    <div className="bg-zinc-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumbs items={[{ label: 'About Us' }]} />
      </div>
      <AboutUsComponent />
    </div>
  );
};
