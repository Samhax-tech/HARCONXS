import React from 'react';
import { ProductComparePage } from '../components/shop/ProductComparePage';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const ComparePage: React.FC = () => {
  return (
    <div className="bg-zinc-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumbs items={[{ label: 'Shop', view: 'catalog' }, { label: 'Compare Creations' }]} />
      </div>
      <ProductComparePage />
    </div>
  );
};
