import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Search, Home, ShoppingBag, Sparkles, Heart, ArrowRight } from 'lucide-react';
import { SeoHead } from '../components/common/SeoHead';

export const NotFoundPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const quickPillars = [
    {
      title: 'Ready-to-Ship Jewelry',
      description: 'Explore signature titanium, silver & tungsten luxury artifacts',
      href: '/shop',
      icon: ShoppingBag
    },
    {
      title: 'Custom Laser Commission',
      description: 'Submit CAD vector brief for bespoke jewelry & laser engraving',
      href: '/custom-products',
      icon: Sparkles
    },
    {
      title: 'Couple Sanctuaries',
      description: 'Discover digital commemorative portals with audio & memories',
      href: '/couple-websites',
      icon: Heart
    }
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 sm:px-6">
      <SeoHead
        title="404 — Sovereign Artifact Not Found | HARCONXS"
        description="The requested HARCONXS boutique route or artifact could not be located. Explore our curated shop or bespoke atelier."
      />

      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-amber-400/10 border border-amber-400/30 text-amber-400 mx-auto shadow-2xl">
          <Compass className="w-10 h-10 animate-pulse" />
        </div>

        <div className="space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
            HTTP 404 • Coordinate Uncharted
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-zinc-100 tracking-tight">
            Lost in the Atelier
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
            The collection, page, or link you are seeking has either moved to a private archive or does not exist at this address.
          </p>
        </div>

        {/* Quick Search */}
        <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bracelets, rings, custom orders, or guides..."
            className="w-full pl-11 pr-24 py-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 focus:border-amber-400 focus:outline-none text-zinc-100 placeholder-zinc-500 text-xs shadow-inner transition-all"
          />
          <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2">
          {quickPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <Link
                key={idx}
                to={pillar.href}
                className="group p-4 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-amber-400/40 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="w-8 h-8 rounded-xl bg-zinc-800 group-hover:bg-amber-400/10 text-amber-400 flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-zinc-200 group-hover:text-amber-400 text-xs transition-colors">
                    {pillar.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
                <div className="flex items-center text-[10px] text-amber-400/80 group-hover:text-amber-400 font-mono">
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Return Button */}
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-semibold uppercase tracking-wider transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Sanctuary Entrance</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
