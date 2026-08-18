import React from 'react';
import { useParams } from 'react-router-dom';
import { BotPanelsPage } from '../components/digital/BotPanelsPage';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const BotPanelsPageWrapper: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  return (
    <div className="bg-zinc-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumbs
          items={[
            { label: 'Explore', view: 'catalog' },
            { label: 'Bot Panels & APIs' },
            ...(slug ? [{ label: slug.replace(/-/g, ' ').toUpperCase() }] : [])
          ]}
        />
      </div>
      <BotPanelsPage />
    </div>
  );
};
