import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';

interface CtaSectionProps {
  content?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    primaryBtnText?: string;
    primaryBtnLink?: string;
    secondaryBtnText?: string;
    secondaryBtnLink?: string;
  };
}

export const CtaSection: React.FC<CtaSectionProps> = ({ content }) => {
  const { setCurrentView, setSelectedCategory } = useStore();

  return (
    <section id="sec-cta" className="py-16 sm:py-24 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 border-b border-zinc-800/80 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/60 border border-amber-800/60 text-amber-300 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{content?.badge || 'Private Concierge Available'}</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-zinc-100 leading-tight">
          {content?.title || 'Celebrate Your Cherished Moments With HARCONXS'}
        </h2>

        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto font-sans leading-relaxed">
          {content?.subtitle || 'Whether gifting an eternal coordinates bracelet or launching a lifetime interactive couple website, experience the epitome of modern bespoke craftsmanship.'}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => {
              setSelectedCategory('all');
              setCurrentView('catalog');
            }}
            className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold px-8 py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{content?.primaryBtnText || 'Shop All Collections'}</span>
          </button>

          <button
            onClick={() => setCurrentView('custom-builder')}
            className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-semibold px-7 py-3.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{content?.secondaryBtnText || 'Start Custom Commission'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
