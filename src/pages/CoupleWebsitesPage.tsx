import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CoupleWebsiteBuilder } from '../components/couple/CoupleWebsiteBuilder';
import { CoupleWebsiteLiveView } from '../components/couple/CoupleWebsiteLiveView';
import { useStore } from '../context/StoreContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const CoupleWebsitesPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { coupleWebsites, coupleTemplates } = useStore();

  // Check if slug matches a published project or template
  const matchedProject = slug ? coupleWebsites.find(p => p.subdomain === slug || p.id === slug) : null;

  if (matchedProject && matchedProject.isPublished) {
    return (
      <div className="bg-zinc-950 min-h-screen">
        <CoupleWebsiteLiveView project={matchedProject} />
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 min-h-screen py-8 text-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Explore', view: 'catalog' },
            { label: 'Couple Websites' },
            ...(slug ? [{ label: slug.toUpperCase() }] : [])
          ]}
        />

        <CoupleWebsiteBuilder />
      </div>
    </div>
  );
};
