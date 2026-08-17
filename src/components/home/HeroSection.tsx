import React from 'react';
import { ArrowRight, Sparkles, Heart, Bot, Globe, Check, ShieldCheck, Flame } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const HeroSection: React.FC = () => {
  const { setCurrentView, setSelectedCategory, setSelectedProductId } = useStore();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-zinc-950 via-zinc-900/60 to-zinc-950 border-b border-zinc-800/80 pt-10 pb-16 lg:pt-16 lg:pb-24">
      {/* Subtle geometric grid backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Tagline Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-700/80 px-3.5 py-1.5 rounded-full text-xs font-medium text-zinc-200 shadow-lg">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" />
            <span className="text-zinc-400">HARCONXS 2026 Collection Live</span>
            <span className="text-zinc-600">•</span>
            <span className="text-amber-400 font-semibold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              Over 2,400+ Custom Sanctuaries Created
            </span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto space-y-5">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-zinc-100 tracking-tight leading-[1.15]">
            SHOP <span className="text-zinc-500 font-light">•</span> PERSONALIZE <span className="text-zinc-500 font-light">•</span> CUSTOMIZE <span className="text-zinc-500 font-light">•</span> CREATE
          </h1>
          
          <p className="text-sm sm:text-base lg:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed font-sans">
            Find something you love, personalize it your way, request something completely bespoke, or generate a lifetime couple website & bot automation suite.
          </p>

          {/* Action Hub Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setCurrentView('catalog');
              }}
              className="bg-zinc-100 hover:bg-white text-zinc-950 font-semibold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Storefront</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentView('custom-builder')}
              className="bg-zinc-900 hover:bg-zinc-800 text-amber-300 border border-amber-500/40 font-semibold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Create Custom Order</span>
            </button>

            <button
              onClick={() => setCurrentView('couple-builder')}
              className="bg-zinc-900 hover:bg-zinc-800 text-rose-300 border border-rose-500/40 font-semibold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Build Couple Sanctuary</span>
            </button>

            <button
              onClick={() => setCurrentView('bot-panels')}
              className="bg-zinc-900 hover:bg-zinc-800 text-sky-300 border border-sky-500/40 font-semibold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <Bot className="w-4 h-4 text-sky-400" />
              <span>Bot Panels Suite</span>
            </button>
          </div>
        </div>

        {/* 4 Pillars Showcase Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
          
          {/* Card 1: Physical & Fine Jewelry */}
          <div 
            onClick={() => { setSelectedCategory('couples'); setCurrentView('catalog'); }}
            className="group relative bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 transition-all cursor-pointer overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider">Couples Atelier</span>
              <Heart className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
            </div>
            <h2 className="text-base font-bold text-zinc-100 group-hover:text-white mb-1">Laser Engraved Goods</h2>
            <p className="text-xs text-zinc-400 leading-normal mb-4">Coordinates bracelets, acrylic song plaques & personalized velvet capsules.</p>
            <div className="flex items-center text-xs font-semibold text-rose-400 group-hover:text-rose-300 gap-1">
              <span>Personalize now</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Custom Commission */}
          <div 
            onClick={() => setCurrentView('custom-builder')}
            className="group relative bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 transition-all cursor-pointer overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">Bespoke Fabrication</span>
              <Sparkles className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <h2 className="text-base font-bold text-zinc-100 group-hover:text-white mb-1">Create Something Special</h2>
            <p className="text-xs text-zinc-400 leading-normal mb-4">Submit your dream concept, get custom quotations with 3D mockups in &lt;12h.</p>
            <div className="flex items-center text-xs font-semibold text-amber-400 group-hover:text-amber-300 gap-1">
              <span>Launch Custom Wizard</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Couple Websites */}
          <div 
            onClick={() => setCurrentView('couple-builder')}
            className="group relative bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 transition-all cursor-pointer overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Digital Sanctuaries</span>
              <Globe className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <h2 className="text-base font-bold text-zinc-100 group-hover:text-white mb-1">Couple Websites</h2>
            <p className="text-xs text-zinc-400 leading-normal mb-4">Dedicated subdomain, relationship countdown timer, music sync & memory timeline.</p>
            <div className="flex items-center text-xs font-semibold text-emerald-400 group-hover:text-emerald-300 gap-1">
              <span>Choose Template</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Bot Panels */}
          <div 
            onClick={() => setCurrentView('bot-panels')}
            className="group relative bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 transition-all cursor-pointer overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider">Turnkey Automation</span>
              <Bot className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
            </div>
            <h2 className="text-base font-bold text-zinc-100 group-hover:text-white mb-1">Bot Panels & API Suite</h2>
            <p className="text-xs text-zinc-400 leading-normal mb-4">Telegram & Discord cloud panels with subscription billing, webhooks & API keys.</p>
            <div className="flex items-center text-xs font-semibold text-sky-400 group-hover:text-sky-300 gap-1">
              <span>Explore Bot Services</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
