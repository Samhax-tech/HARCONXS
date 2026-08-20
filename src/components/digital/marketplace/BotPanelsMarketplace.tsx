import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../../context/StoreContext';
import { BotPanelCategory, BotPanelService } from '../../../types';
import { ContinueToBillingButton } from './ContinueToBillingButton';
import {
  Send,
  Shield,
  MessageSquare,
  Globe,
  Layers,
  Terminal,
  Zap,
  Search,
  Check,
  Star,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Server,
  Cpu,
  Lock,
  Headphones,
  SlidersHorizontal,
  ArrowUpRight
} from 'lucide-react';

const CATEGORIES: { label: string; value: 'All' | BotPanelCategory; icon: any }[] = [
  { label: 'All Panels', value: 'All', icon: Layers },
  { label: 'Telegram Bot Panels', value: 'Telegram Bot Panels', icon: Send },
  { label: 'Discord Bot Panels', value: 'Discord Bot Panels', icon: Shield },
  { label: 'WordPress Bot Panels', value: 'WordPress Bot Panels', icon: Globe },
  { label: 'Custom Bot Panels', value: 'Custom Bot Panels', icon: Sparkles },
  { label: 'Hosting Panels', value: 'Hosting Panels', icon: Terminal }
];

export const BotPanelsMarketplace: React.FC = () => {
  const navigate = useNavigate();
  const { botPanelServices, formatPrice } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<'All' | BotPanelCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Filter and sort services
  const filteredServices = useMemo(() => {
    return botPanelServices
      .filter((service) => {
        const matchesCategory =
          selectedCategory === 'All' || service.category === selectedCategory;

        const matchesSearch =
          !searchQuery.trim() ||
          service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.fullDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.features?.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        const aMinPrice = a.plans[0]?.price || 0;
        const bMinPrice = b.plans[0]?.price || 0;

        if (sortBy === 'price-asc') return aMinPrice - bMinPrice;
        if (sortBy === 'price-desc') return bMinPrice - aMinPrice;
        if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
        return 0; // featured default order
      });
  }, [botPanelServices, selectedCategory, searchQuery, sortBy]);

  const getPlatformIcon = (platform: string, className = 'w-4 h-4') => {
    switch (platform) {
      case 'Telegram':
        return <Send className={`${className} text-sky-400`} />;
      case 'Discord':
        return <Shield className={`${className} text-indigo-400`} />;
      case 'WordPress':
        return <Globe className={`${className} text-emerald-400`} />;
      case 'Hosting':
        return <Terminal className={`${className} text-amber-400`} />;
      case 'Custom':
      default:
        return <Layers className={`${className} text-purple-400`} />;
    }
  };

  return (
    <div className="bg-zinc-950 min-h-screen text-zinc-100 pb-20 selection:bg-sky-500 selection:text-zinc-950 font-sans">
      
      {/* Marketplace Hero Header */}
      <div className="relative border-b border-zinc-800/80 bg-gradient-to-b from-zinc-900/60 via-zinc-950 to-zinc-950 pt-10 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/15 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative space-y-6 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-950/80 border border-sky-800/80 text-sky-300 text-xs font-semibold shadow-lg">
            <Zap className="w-3.5 h-3.5 text-sky-400" />
            <span>HARCONXS Cloud Bot & Hosting Marketplace</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-zinc-100 tracking-tight">
            Turnkey Bot Panels & Automation
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-sans">
            Explore dedicated control panels for Telegram, Discord, WordPress, and Custom Bot Infrastructure.
            Provision isolated Pterodactyl Docker containers with 99.99% uptime and instant webhooks.
          </p>

          {/* Infrastructure Metrics */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-sky-400" /> Dedicated Pterodactyl Nodes
            </span>
            <span className="text-zinc-700">•</span>
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" /> AMD EPYC Compute
            </span>
            <span className="text-zinc-700">•</span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" /> 12 Tbps DDoS Shield
            </span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Safe Billing Integration Disclosure Notice */}
        <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-zinc-300">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-950 border border-sky-800 text-sky-400 shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-zinc-100 block">Secure External Billing Portal</span>
              <p className="text-zinc-400 text-[11px] mt-0.5">
                Subscriptions and automated provisioning are handled through our dedicated billing portal at{' '}
                <a
                  href="https://billingharconxs.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-400 underline hover:text-sky-300 inline-flex items-center gap-0.5"
                >
                  billingharconxs.vercel.app <ExternalLink className="w-2.5 h-2.5" />
                </a>
                . Zero sensitive credentials or payment secrets are stored in this catalog.
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <ContinueToBillingButton
              variant="outline"
              source="marketplace_banner"
            >
              <span>Visit Billing Portal</span>
            </ContinueToBillingButton>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="space-y-4">
          
          {/* Categories Horizontal Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.value;
              const count =
                cat.value === 'All'
                  ? botPanelServices.length
                  : botPanelServices.filter((s) => s.category === cat.value).length;

              return (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2.5 rounded-2xl border text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-800 border-sky-400/80 text-white ring-1 ring-sky-400/30 shadow-lg'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-sky-400" />
                  <span>{cat.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isSelected ? 'bg-sky-950 text-sky-300' : 'bg-zinc-800 text-zinc-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input & Sort Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search panels by name, platform, features (e.g. VIP gating, tickets, Pterodactyl)..."
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-zinc-100 outline-none focus:border-sky-500 transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-zinc-500 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 outline-none focus:border-sky-500 cursor-pointer"
              >
                <option value="featured">Featured & Recommended</option>
                <option value="rating">Highest Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

        </div>

        {/* Panels Catalog Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredServices.map((svc) => {
              const lowestPlan = svc.plans[0];
              const popularPlan = svc.plans.find((p) => p.isPopular) || svc.plans[0];

              return (
                <div
                  key={svc.id}
                  onClick={() => navigate(`/bot-panels/${svc.slug}`)}
                  className="bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700/80 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-200 flex flex-col justify-between group cursor-pointer"
                >
                  {/* Card Media Preview */}
                  <div className="relative aspect-video w-full bg-zinc-950 overflow-hidden border-b border-zinc-800">
                    <img
                      src={svc.screenshots[0]}
                      alt={svc.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
                    
                    {/* Platform Badge Overlay */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-zinc-950/90 border border-zinc-700/80 text-zinc-200 text-[10px] font-bold uppercase tracking-wider backdrop-blur flex items-center gap-1.5">
                        {getPlatformIcon(svc.platform, 'w-3 h-3')}
                        {svc.platform}
                      </span>
                      {svc.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-sky-950/90 border border-sky-700 text-sky-300 text-[10px] font-bold">
                          {svc.badge}
                        </span>
                      )}
                    </div>

                    {/* Rating Overlay */}
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-zinc-950/90 border border-zinc-800 text-[10px] font-bold text-amber-300 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-300" />
                      <span>{svc.rating || 4.9}</span>
                    </div>

                    {/* Category Label at bottom of image */}
                    <div className="absolute bottom-3 left-3">
                      <span className="text-[11px] font-medium text-zinc-400">
                        {svc.category}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    
                    <div className="space-y-2">
                      <h3 className="font-serif font-bold text-lg text-zinc-100 group-hover:text-sky-300 transition-colors leading-snug">
                        {svc.name}
                      </h3>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {svc.shortDesc}
                      </p>
                    </div>

                    {/* Highlighted Feature Checklist */}
                    <div className="space-y-1.5 pt-2 border-t border-zinc-800/80 text-xs text-zinc-300">
                      {svc.features?.slice(0, 3).map((feat, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Cloud Node Teaser */}
                    {svc.hostingInfo && (
                      <div className="p-2.5 bg-zinc-950/80 border border-zinc-800/80 rounded-xl flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                        <span className="flex items-center gap-1">
                          <Cpu className="w-3 h-3 text-sky-400" /> {svc.hostingInfo.ram} RAM
                        </span>
                        <span>{svc.hostingInfo.uptimeSla} SLA</span>
                      </div>
                    )}

                    {/* Pricing & CTA Actions */}
                    <div className="pt-4 border-t border-zinc-800 space-y-3">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-[10px] text-zinc-500 uppercase block font-semibold">Starting from</span>
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold font-mono text-zinc-100">
                              {formatPrice(lowestPlan?.price || 0)}
                            </span>
                            <span className="text-xs text-zinc-500">
                              /{lowestPlan?.billingPeriod || 'mo'}
                            </span>
                          </div>
                        </div>

                        <span className="text-xs font-semibold text-sky-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                          View Details <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>

                      {/* Dual Action Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
                        <Link
                          to={`/bot-panels/${svc.slug}`}
                          className="py-2 px-3 text-center bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs rounded-xl border border-zinc-700 transition-colors"
                        >
                          Demo & Specs
                        </Link>
                        
                        <ContinueToBillingButton
                          productId={svc.id}
                          planId={popularPlan.id}
                          slug={svc.slug}
                          variant="compact"
                          className="w-full text-center py-2"
                        >
                          <span>Continue</span>
                        </ContinueToBillingButton>
                      </div>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-zinc-900/30 border border-zinc-800 rounded-3xl space-y-3">
            <Search className="w-8 h-8 text-zinc-600 mx-auto" />
            <h3 className="font-bold text-zinc-200 text-sm">No bot panels found</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              No services matched your search query "{searchQuery}". Try selecting another category or resetting filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs rounded-xl cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Feature Comparison Matrix */}
        <div className="mt-16 bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-zinc-100">
              Why HARCONXS Bot Panels?
            </h2>
            <p className="text-xs text-zinc-400">
              Comparing enterprise hosting architecture against generic bot hosts.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 uppercase text-[10px] tracking-wider font-bold">
                  <th className="py-3 px-4">Capability / Feature</th>
                  <th className="py-3 px-4 text-sky-400">HARCONXS Bot Panels</th>
                  <th className="py-3 px-4 text-zinc-500">Standard Shared VPS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                <tr>
                  <td className="py-3.5 px-4 font-medium text-zinc-200">Isolation Architecture</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-semibold">Dedicated Pterodactyl Docker Node</td>
                  <td className="py-3.5 px-4 text-zinc-500">Shared OS / No Resource Limits</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-zinc-200">Database Synchronization</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-semibold">Central Real-time Supabase Data Source</td>
                  <td className="py-3.5 px-4 text-zinc-500">Local SQLite / Unsynchronized</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-zinc-200">Auto-Renewals & Billing</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-semibold">Dedicated Billing Portal (billingharconxs)</td>
                  <td className="py-3.5 px-4 text-zinc-500">Manual Invoicing</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-zinc-200">DDoS Mitigation</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-semibold">12 Tbps Layer 3/4/7 Filtering</td>
                  <td className="py-3.5 px-4 text-zinc-500">Basic 10Gbps Null-routing</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Global Support Callout */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-sky-950/40 via-zinc-900/60 to-indigo-950/40 border border-sky-900/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="font-serif font-bold text-lg text-zinc-100">Need a Custom Bot Built for Your Brand?</h3>
            <p className="text-xs text-zinc-300 max-w-xl leading-relaxed">
              We engineer custom Telegram, Discord, and WhatsApp bots with automated payments, crypto gating, and ERP integration.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/contact"
              className="px-5 py-3 bg-sky-500 hover:bg-sky-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              Request Custom Build
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};
