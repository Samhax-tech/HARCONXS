import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../../context/StoreContext';
import { BotPanelService, BotPanelPlan } from '../../../types';
import { BotPanelDemoEmulator } from './BotPanelDemoEmulator';
import { ContinueToBillingButton } from './ContinueToBillingButton';
import {
  Send,
  Shield,
  MessageSquare,
  Globe,
  Layers,
  Terminal,
  Zap,
  Check,
  Star,
  ChevronRight,
  ArrowLeft,
  Server,
  Cpu,
  HardDrive,
  Clock,
  Lock,
  ExternalLink,
  HelpCircle,
  Headphones,
  FileText,
  Copy,
  ChevronDown,
  ChevronUp,
  Maximize2,
  X,
  Share2,
  Sparkles
} from 'lucide-react';

export const BotPanelDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { botPanelServices, formatPrice, showToast } = useStore();

  // Find service by slug or fallback to id
  const service: BotPanelService | undefined = botPanelServices.find(
    s => s.slug === slug || s.id === slug
  );

  // If not found, use first or fallback
  const currentService = service || botPanelServices[0];

  // State
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    currentService.plans.find(p => p.isPopular)?.id || currentService.plans[0]?.id || 'p1'
  );
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'demo' | 'hosting' | 'pricing' | 'faq'>('overview');

  const selectedPlan: BotPanelPlan = 
    currentService.plans.find(p => p.id === selectedPlanId) || currentService.plans[0];

  // Calculate annual pricing with 20% discount
  const getPlanPrice = (plan: BotPanelPlan) => {
    if (plan.billingPeriod === 'lifetime') return plan.price;
    if (billingCycle === 'yearly') {
      return plan.price * 12 * 0.8; // 20% off
    }
    return plan.price;
  };

  const currentPrice = getPlanPrice(selectedPlan);

  const getPlatformIcon = (platform: string, className = 'w-5 h-5') => {
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

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Panel link copied to clipboard!');
    }
  };

  // Related services
  const relatedServices = botPanelServices
    .filter(s => s.id !== currentService.id && (s.category === currentService.category || s.platform === currentService.platform))
    .slice(0, 3);

  return (
    <div className="bg-zinc-950 min-h-screen text-zinc-100 pb-20 selection:bg-sky-500 selection:text-zinc-950 font-sans">
      
      {/* Top Breadcrumb & Return Bar */}
      <div className="border-b border-zinc-800/80 bg-zinc-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Link
              to="/bot-panels"
              className="inline-flex items-center gap-1.5 hover:text-sky-400 font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Bot Marketplace</span>
            </Link>
            <span>/</span>
            <span className="text-zinc-500">{currentService.category}</span>
            <span>/</span>
            <span className="text-zinc-200 font-semibold truncate max-w-[200px] sm:max-w-none">
              {currentService.name}
            </span>
          </div>

          <button
            onClick={handleShare}
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition-colors text-xs flex items-center gap-1.5 cursor-pointer"
            title="Share this panel"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      {/* Main Header / Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Hero Overview */}
          <div className="lg:col-span-8 space-y-5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-sky-950/80 border border-sky-800/80 text-sky-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                {getPlatformIcon(currentService.platform, 'w-3.5 h-3.5')}
                {currentService.category}
              </span>
              {currentService.badge && (
                <span className="px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-800/80 text-amber-300 text-xs font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {currentService.badge}
                </span>
              )}
              <div className="flex items-center gap-1 text-amber-400 text-xs font-bold pl-1">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{currentService.rating || 4.9}</span>
                <span className="text-zinc-500 font-normal">({currentService.reviewsCount || 120} verified reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-zinc-100 leading-tight">
              {currentService.name}
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans max-w-3xl">
              {currentService.fullDesc}
            </p>

            {/* Quick Metrics Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1">
                <span className="text-[10px] text-zinc-500 font-bold uppercase flex items-center gap-1">
                  <Server className="w-3 h-3 text-sky-400" /> Cloud Deploy
                </span>
                <span className="text-xs font-bold text-zinc-200 block">Pterodactyl Egg</span>
              </div>
              <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1">
                <span className="text-[10px] text-zinc-500 font-bold uppercase flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-amber-400" /> Uptime SLA
                </span>
                <span className="text-xs font-bold text-emerald-400 block font-mono">99.99% Guaranteed</span>
              </div>
              <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1">
                <span className="text-[10px] text-zinc-500 font-bold uppercase flex items-center gap-1">
                  <Lock className="w-3 h-3 text-indigo-400" /> Security
                </span>
                <span className="text-xs font-bold text-zinc-200 block">DDoS Filtered</span>
              </div>
              <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1">
                <span className="text-[10px] text-zinc-500 font-bold uppercase flex items-center gap-1">
                  <Headphones className="w-3 h-3 text-emerald-400" /> Support
                </span>
                <span className="text-xs font-bold text-zinc-200 block">24/7 VIP Concierge</span>
              </div>
            </div>
          </div>

          {/* Right Action Summary Card */}
          <div className="lg:col-span-4 bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-baseline justify-between border-b border-zinc-800 pb-4">
              <div>
                <span className="text-xs text-zinc-400 font-medium block">Starting from</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold font-mono text-zinc-100">
                    {formatPrice(currentPrice)}
                  </span>
                  <span className="text-xs text-zinc-400">
                    /{selectedPlan.billingPeriod === 'lifetime' ? 'lifetime' : (billingCycle === 'yearly' ? 'year' : 'mo')}
                  </span>
                </div>
              </div>
              <span className="px-2 py-1 rounded bg-sky-950 border border-sky-800 text-[11px] font-bold text-sky-300">
                {selectedPlan.name}
              </span>
            </div>

            {/* Plan selector snippet */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-300">Select Plan Tier:</label>
              <div className="grid grid-cols-1 gap-2">
                {currentService.plans.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlanId(p.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-all cursor-pointer ${
                      selectedPlanId === p.id
                        ? 'bg-sky-950/40 border-sky-500 text-white font-bold ring-1 ring-sky-500/40'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <span>{p.name}</span>
                    <span className="font-mono text-zinc-300">{formatPrice(getPlanPrice(p))}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Redirection CTA */}
            <div className="space-y-2 pt-2">
              <ContinueToBillingButton
                productId={currentService.id}
                planId={selectedPlan.id}
                slug={currentService.slug}
                billingCycle={billingCycle}
                priceFormatted={formatPrice(currentPrice)}
                className="w-full text-center"
              />
              <p className="text-[10px] text-zinc-500 text-center leading-tight">
                🔒 Subscriptions & payment verification are handled securely on the dedicated billing portal (billingharconxs.vercel.app).
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="sticky top-0 z-30 bg-zinc-950/95 backdrop-blur border-y border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto no-scrollbar py-2 text-xs">
          {[
            { id: 'overview', label: 'Screenshots & Overview' },
            { id: 'demo', label: 'Interactive Live Sandbox' },
            { id: 'features', label: 'Features & Architecture' },
            { id: 'hosting', label: 'Cloud Specifications' },
            { id: 'pricing', label: 'Pricing Plans' },
            { id: 'faq', label: 'FAQ & Support' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-zinc-800 text-sky-400 border border-zinc-700 shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">

        {/* 1. SCREENSHOTS & OVERVIEW TAB */}
        {(activeTab === 'overview' || activeTab === 'demo') && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-zinc-100 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-sky-400" />
                  Visual Dashboard & Screenshot Gallery
                </h2>
                <p className="text-xs text-zinc-400">High-resolution preview of the web control panel and bot interfaces.</p>
              </div>
            </div>

            {/* Screenshots Showcase */}
            <div className="space-y-4">
              {/* Main Active Screenshot */}
              <div className="relative group rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 aspect-video max-h-[480px] w-full flex items-center justify-center">
                <img
                  src={currentService.screenshots[activeImageIndex] || currentService.screenshots[0]}
                  alt={`${currentService.name} screenshot ${activeImageIndex + 1}`}
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-6">
                  <span className="text-xs font-semibold text-white">
                    {currentService.name} — Screen {activeImageIndex + 1} of {currentService.screenshots.length}
                  </span>
                  <button
                    onClick={() => setIsLightboxOpen(true)}
                    className="p-2 bg-zinc-900/80 hover:bg-zinc-800 text-white rounded-xl border border-zinc-700 flex items-center gap-1 text-xs cursor-pointer"
                  >
                    <Maximize2 className="w-4 h-4" /> Expand
                  </button>
                </div>
              </div>

              {/* Thumbnails Carousel */}
              {currentService.screenshots.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {currentService.screenshots.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-28 h-18 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        activeImageIndex === idx
                          ? 'border-sky-400 ring-2 ring-sky-400/30'
                          : 'border-zinc-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Interactive Live Sandbox Section */}
            <div className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  Interactive Live Simulator & Sandbox
                </h3>
                <span className="text-xs text-zinc-500 font-mono">Real-time mock event pipeline</span>
              </div>
              <BotPanelDemoEmulator service={currentService} />
            </div>
          </section>
        )}

        {/* 2. FEATURES & ARCHITECTURE TAB */}
        {(activeTab === 'features' || activeTab === 'overview') && (
          <section className="space-y-8 pt-4">
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-zinc-100 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                Key Features & Capabilities Matrix
              </h2>
              <p className="text-xs text-zinc-400">
                Detailed breakdown of included automation modules, security rules, and APIs.
              </p>
            </div>

            {/* Categorized Features Grid */}
            {currentService.categorizedFeatures && currentService.categorizedFeatures.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentService.categorizedFeatures.map((cat, idx) => (
                  <div key={idx} className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-3xl space-y-4 shadow-lg">
                    <h3 className="font-bold text-zinc-100 text-sm flex items-center gap-2">
                      <Zap className="w-4 h-4 text-sky-400 shrink-0" />
                      {cat.category}
                    </h3>
                    <ul className="space-y-2.5 text-xs text-zinc-300">
                      {cat.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentService.features?.map((feat, i) => (
                  <div key={i} className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl flex items-center gap-3 text-xs text-zinc-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Requirements Checklist */}
            {currentService.requirements && currentService.requirements.length > 0 && (
              <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-3xl space-y-4">
                <h3 className="font-bold text-zinc-100 text-sm flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-400" />
                  Prerequisites & API Requirements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {currentService.requirements.map((req, i) => (
                    <div key={i} className="p-4 bg-zinc-950 border border-zinc-800/80 rounded-2xl space-y-1.5">
                      <div className="font-bold text-zinc-200">{req.title}</div>
                      <p className="text-zinc-400 text-[11px] leading-relaxed">{req.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* 3. CLOUD HOSTING & SPECIFICATIONS TAB */}
        {(activeTab === 'hosting' || activeTab === 'overview') && (
          <section className="space-y-6 pt-4">
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-zinc-100 flex items-center gap-2">
                <Server className="w-5 h-5 text-emerald-400" />
                Cloud Infrastructure & Pterodactyl Container Specs
              </h2>
              <p className="text-xs text-zinc-400">
                High-performance hardware isolated in dedicated Docker containers with permanent uptime.
              </p>
            </div>

            {currentService.hostingInfo && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-2">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-sky-400" /> Processor (CPU)
                  </span>
                  <span className="font-bold text-zinc-100 text-sm block">{currentService.hostingInfo.cpu}</span>
                  <p className="text-[11px] text-zinc-400">AMD EPYC 9654 High-Frequency Compute</p>
                </div>

                <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-2">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold flex items-center gap-1.5">
                    <HardDrive className="w-4 h-4 text-indigo-400" /> Memory (RAM)
                  </span>
                  <span className="font-bold text-zinc-100 text-sm block">{currentService.hostingInfo.ram}</span>
                  <p className="text-[11px] text-zinc-400">DDR5 4800MHz ECC Server Memory</p>
                </div>

                <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-2">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold flex items-center gap-1.5">
                    <Server className="w-4 h-4 text-emerald-400" /> Storage
                  </span>
                  <span className="font-bold text-zinc-100 text-sm block">{currentService.hostingInfo.storage}</span>
                  <p className="text-[11px] text-zinc-400">PCIe 4.0 NVMe RAID-1 (7,000 MB/s)</p>
                </div>

                <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-2">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-amber-400" /> Network & DDoS
                  </span>
                  <span className="font-bold text-zinc-100 text-sm block">12 Tbps Mitigation</span>
                  <p className="text-[11px] text-zinc-400">Path.net Always-On Layer 3/4/7</p>
                </div>
              </div>
            )}

            {/* Global Nodes Strip */}
            {currentService.hostingInfo?.locations && (
              <div className="p-5 bg-zinc-900/40 border border-zinc-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div>
                  <span className="font-bold text-zinc-200 block">Available Deployment Node Locations</span>
                  <span className="text-zinc-400 text-[11px]">Select your closest geographic region during billing provisioning</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {currentService.hostingInfo.locations.map((loc, i) => (
                    <span key={i} className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 text-[11px] font-medium">
                      📍 {loc}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* 4. PRICING PLANS SECTION */}
        {(activeTab === 'pricing' || activeTab === 'overview') && (
          <section className="space-y-6 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-zinc-100 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-sky-400" />
                  Transparent Pricing & Subscription Tiers
                </h2>
                <p className="text-xs text-zinc-400">Choose the plan suited for your community size and automation scale.</p>
              </div>

              {/* Monthly / Annual Toggle */}
              <div className="inline-flex items-center bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    billingCycle === 'monthly' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Monthly Billing
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    billingCycle === 'yearly' ? 'bg-sky-500 text-zinc-950 shadow' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <span>Annual Billing</span>
                  <span className="px-1.5 py-0.5 bg-zinc-950/40 text-[10px] rounded font-mono font-bold">20% OFF</span>
                </button>
              </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {currentService.plans.map(plan => {
                const isSelected = selectedPlanId === plan.id;
                const price = getPlanPrice(plan);

                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`p-6 sm:p-8 rounded-3xl border flex flex-col justify-between transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-zinc-900 border-sky-400 ring-2 ring-sky-400/30 shadow-2xl scale-[1.02]'
                        : 'bg-zinc-950/70 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {plan.isPopular && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-sky-400 to-indigo-500 text-zinc-950 font-bold text-[10px] uppercase rounded-full shadow-lg">
                        Most Popular Choice
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <h3 className="font-bold text-zinc-100 text-base">{plan.name}</h3>
                        <p className="text-zinc-400 text-xs mt-0.5">High-speed Pterodactyl container tier</p>
                      </div>

                      <div className="flex items-baseline gap-1 pt-1">
                        <span className="text-3xl sm:text-4xl font-bold font-mono text-zinc-100">
                          {formatPrice(price)}
                        </span>
                        <span className="text-xs text-zinc-400">
                          /{plan.billingPeriod === 'lifetime' ? 'lifetime' : (billingCycle === 'yearly' ? 'year' : 'month')}
                        </span>
                      </div>

                      <div className="space-y-2.5 pt-4 border-t border-zinc-800 text-xs">
                        {plan.features.map((feat, i) => (
                          <div key={i} className="flex items-start gap-2 text-zinc-300">
                            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6">
                      <ContinueToBillingButton
                        productId={currentService.id}
                        planId={plan.id}
                        slug={currentService.slug}
                        billingCycle={billingCycle}
                        variant={isSelected ? 'primary' : 'secondary'}
                        className="w-full text-center"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <ExternalLink className="w-4 h-4" />
                          <span>Select {plan.name} & Continue</span>
                        </span>
                      </ContinueToBillingButton>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 5. FAQ & SUPPORT SECTION */}
        {(activeTab === 'faq' || activeTab === 'overview') && (
          <section className="space-y-8 pt-4">
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-zinc-100 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-zinc-400">Everything you need to know about deployment, billing, and credentials.</p>
            </div>

            <div className="divide-y divide-zinc-800/80 border border-zinc-800 rounded-3xl bg-zinc-900/40 overflow-hidden">
              {(currentService.faqs || [
                { question: 'How is billing processed?', answer: 'The billing and subscription activation is handled securely by our official billing portal at billingharconxs.vercel.app. We never expose API keys or billing secrets directly in the browser.' },
                { question: 'How quickly is the bot deployed after payment?', answer: 'Our automated provisioning system initializes your Pterodactyl container node within 60 seconds after checkout completion.' },
                { question: 'Can I upgrade or downgrade my plan later?', answer: 'Yes! You can manage your subscription tiers directly in the billing dashboard at any time without losing database state.' }
              ]).map((faq, idx) => (
                <div key={idx} className="p-6 transition-colors hover:bg-zinc-900/60">
                  <button
                    onClick={() => setExpandedFaqIndex(expandedFaqIndex === idx ? null : idx)}
                    className="w-full flex items-center justify-between text-left font-bold text-sm text-zinc-100 cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    {expandedFaqIndex === idx ? (
                      <ChevronUp className="w-4 h-4 text-sky-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />
                    )}
                  </button>
                  {expandedFaqIndex === idx && (
                    <p className="mt-3 text-xs text-zinc-300 leading-relaxed max-w-3xl">
                      {faq.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Support Information Box */}
            <div className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Headphones className="w-5 h-5 text-sky-400" />
                  <h3 className="font-bold text-zinc-100 text-sm">Need Help Setting Up or Custom Bot Development?</h3>
                </div>
                <p className="text-xs text-zinc-400">
                  Our DevOps engineers are available on Discord and Telegram to assist with token configuration and custom architecture.
                </p>
                <div className="flex flex-wrap gap-4 text-xs text-zinc-300 pt-1">
                  <span>⏱️ Response Time: <strong>{currentService.supportInfo?.responseTime || 'Under 15 mins'}</strong></span>
                  <span>📧 Email: <strong>{currentService.supportInfo?.contactEmail || 'support@harconxs.com'}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <a
                  href={currentService.docsUrl || 'https://docs.harconxs.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs rounded-xl border border-zinc-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-4 h-4" /> Documentation
                </a>
                <Link
                  to="/contact"
                  className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5"
                >
                  <Headphones className="w-4 h-4" /> Open Ticket
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* 6. RELATED PANELS */}
        {relatedServices.length > 0 && (
          <section className="space-y-6 pt-6 border-t border-zinc-800">
            <h2 className="text-lg font-bold text-zinc-100">Recommended Alternative Panels</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedServices.map(rel => (
                <div
                  key={rel.id}
                  onClick={() => navigate(`/bot-panels/${rel.slug}`)}
                  className="p-6 bg-zinc-900/40 border border-zinc-800 hover:border-sky-500/60 rounded-3xl space-y-4 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-zinc-800 text-[10px] font-bold text-zinc-300 rounded-lg">
                      {rel.category}
                    </span>
                    {getPlatformIcon(rel.platform)}
                  </div>
                  <h3 className="font-bold text-zinc-100 text-sm group-hover:text-sky-300 transition-colors">
                    {rel.name}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2">{rel.shortDesc}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-xs">
                    <span className="font-mono font-bold text-zinc-200">
                      From {formatPrice(rel.plans[0]?.price || 0)}
                    </span>
                    <span className="text-sky-400 font-semibold flex items-center gap-1">
                      View Panel <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute -top-10 right-0 text-white p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={currentService.screenshots[activeImageIndex] || currentService.screenshots[0]}
              alt="Screenshot Preview"
              className="max-h-[80vh] w-auto object-contain rounded-2xl border border-zinc-800 shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}

      {/* Sticky Bottom Bar on Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur border-t border-zinc-800 p-3 sm:hidden flex items-center justify-between">
        <div>
          <span className="text-[10px] text-zinc-500 block">Starting at</span>
          <span className="font-bold text-sm font-mono text-zinc-100">{formatPrice(currentPrice)}</span>
        </div>
        <ContinueToBillingButton
          productId={currentService.id}
          planId={selectedPlan.id}
          slug={currentService.slug}
          billingCycle={billingCycle}
          variant="compact"
        >
          <span>Continue to Billing</span>
        </ContinueToBillingButton>
      </div>

    </div>
  );
};
