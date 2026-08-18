import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { FeaturedSection } from '../components/home/FeaturedSection';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-0">
      <HeroSection />
      <CategoryGrid />
      <FeaturedSection />
    </div>
  );
};
