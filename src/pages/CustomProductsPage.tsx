import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CustomOrderBuilder } from '../components/custom/CustomOrderBuilder';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Sparkles, Award, ShieldCheck, Heart } from 'lucide-react';

export const CustomProductsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  return (
    <div className="bg-zinc-950 min-h-screen py-8 text-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <Breadcrumbs
          items={[
            { label: 'Shop', view: 'catalog' },
            { label: 'Bespoke Atelier' },
            ...(slug ? [{ label: slug.replace(/-/g, ' ').toUpperCase() }] : [])
          ]}
        />

        <CustomOrderBuilder />
      </div>
    </div>
  );
};
