import React from 'react';
import { ArrowRight, Sparkles, Heart, Gift, Star, ShieldCheck, Truck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface HeroSectionProps {
  content?: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    primaryBtnText?: string;
    primaryBtnLink?: string;
    secondaryBtnText?: string;
    secondaryBtnLink?: string;
    bannerImage?: string;
    badgeText?: string;
    stats?: { label: string; value: string }[];
  };
}

export const HeroSection: React.FC<HeroSectionProps> = ({ content }) => {
  const { setCurrentView, setSelectedCategory } = useStore();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-zinc-950 via-zinc-900/60 to-zinc-950 border-b border-zinc-800/80 pt-10 pb-14 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24">
      {/* Subtle radial ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Tagline Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-700/80 px-3.5 py-1.5 rounded-full text-xs font-medium text-zinc-200 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" />
            <span className="text-zinc-300 font-medium">HARCONXS 2026 Atelier Collection</span>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <span className="text-amber-400 font-semibold hidden sm:inline">Complimentary Archival Velvet Packaging</span>
          </div>
        </div>

        {/* 2-Column Split Hero Layout for Finished Brand Aesthetics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="space-y-3">
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-amber-400 block font-mono">
                {content?.eyebrow || 'Haute Joaillerie & Bespoke Keepsakes'}
              </span>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-zinc-100 tracking-tight leading-[1.12]">
                {content?.title || 'Artisanal Craftsmanship For Life’s Cherished Milestones'}
              </h1>
            </div>

            <p className="text-sm sm:text-base lg:text-lg text-zinc-400 max-w-2xl mx-auto lg:mx-0 font-sans leading-relaxed">
              {content?.subtitle || 'Discover handcrafted coordinates jewelry, laser-engraved acrylic keepsakes, and private interactive couple websites designed to immortalize your memories.'}
            </p>

            {/* Primary & Secondary Action Hub */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setCurrentView('catalog');
                }}
                className="w-full sm:w-auto bg-zinc-100 hover:bg-white text-zinc-950 font-bold px-7 py-3.5 rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{content?.primaryBtnText || 'Explore Catalog'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentView('custom-builder')}
                className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-amber-300 border border-amber-500/40 font-semibold px-6 py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{content?.secondaryBtnText || 'Custom Commission'}</span>
              </button>
            </div>

            {/* Trust Proof Micro-Bar */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-zinc-400 border-t border-zinc-800/80">
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="font-semibold text-zinc-200">4.9★</span>
                <span>(10,000+ Patrons)</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-300">
                <Truck className="w-3.5 h-3.5 text-amber-400" />
                <span>Pan-India Insured Transit</span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Hero Showcase Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl border border-zinc-800 bg-zinc-900/60 p-3.5 sm:p-4 shadow-2xl overflow-hidden group">
              <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden bg-zinc-950">
                <img
                  src={content?.bannerImage || 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=1200&auto=format&fit=crop&q=85'}
                  alt="HARCONXS Atelier Masterpieces"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                
                {/* Floating Badge */}
                <div className="absolute top-3 left-3 bg-zinc-950/80 border border-zinc-700/70 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-amber-300">
                  {content?.badgeText || 'Signature Edition'}
                </div>

                {/* Floating Product Teaser at Bottom of Hero Card */}
                <div className="absolute bottom-3 inset-x-3 bg-zinc-900/90 border border-zinc-700/80 backdrop-blur-md rounded-xl p-3 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xs sm:text-sm font-bold text-zinc-100 line-clamp-1">Coordinates Engraved Titanium Bands</h2>
                    <p className="text-[11px] text-zinc-400">Hypoallergenic & Laser-etched</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCategory('couples');
                      setCurrentView('catalog');
                    }}
                    className="shrink-0 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    View Piece
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
