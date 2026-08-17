import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ThemeConfig } from '../../types';
import {
  Palette,
  Eye,
  RotateCcw,
  Save,
  Sparkles,
  Type,
  Image,
  Layers,
  ShoppingBag,
  Heart,
  Truck,
  CheckCircle2,
  Sliders,
  Monitor,
  Smartphone,
  Check
} from 'lucide-react';
import { INITIAL_THEME_CONFIG } from '../../data/initialData';

export const ThemeEditorWithLivePreview: React.FC = () => {
  const { themeConfig, updateThemeConfig, showToast } = useStore();

  const [draftConfig, setDraftConfig] = useState<ThemeConfig>(themeConfig);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'branding' | 'colors' | 'hero' | 'announcement' | 'contact'>('branding');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleInputChange = (field: keyof ThemeConfig, value: any) => {
    setDraftConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveTheme = () => {
    updateThemeConfig(draftConfig);
    setSavedSuccess(true);
    showToast('Theme settings & live branding successfully saved!');
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetToDefault = () => {
    if (window.confirm('Reset all theme branding and colors back to factory atelier defaults?')) {
      setDraftConfig(INITIAL_THEME_CONFIG);
      updateThemeConfig(INITIAL_THEME_CONFIG);
      showToast('Theme reset to initial defaults.');
    }
  };

  // Preset Color Palettes
  const presetPalettes = [
    { name: 'Royal Gold & Amber', primary: '#f59e0b', accent: '#f43f5e', secondary: '#38bdf8' },
    { name: 'Midnight Emerald', primary: '#10b981', accent: '#fbbf24', secondary: '#06b6d4' },
    { name: 'Rose Quartz Sanctuary', primary: '#f43f5e', accent: '#ec4899', secondary: '#a855f7' },
    { name: 'Cyber Titanium Blue', primary: '#3b82f6', accent: '#6366f1', secondary: '#14b8a6' },
    { name: 'Monochrome Velvet', primary: '#e4e4e7', accent: '#a1a1aa', secondary: '#71717a' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/80 border border-zinc-800 p-5 rounded-3xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <span>Theme Studio & Interactive Live Preview</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full">
                WYSIWYG
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              Customize shop typography, hex color pickers, hero headlines, banner imagery, and view changes live.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleResetToDefault}
            className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-zinc-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          
          <button
            onClick={handleSaveTheme}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
          >
            {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{savedSuccess ? 'Applied Live!' : 'Publish Theme'}</span>
          </button>
        </div>
      </div>

      {/* Grid: Left Settings Editor (5 cols) / Right Interactive Preview (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: THEME SETTINGS CONTROLS */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Sub Navigation Tabs */}
          <div className="flex gap-1 overflow-x-auto bg-zinc-900 border border-zinc-800 p-1 rounded-2xl no-scrollbar">
            {(['branding', 'colors', 'hero', 'announcement', 'contact'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === tab
                    ? 'bg-amber-500 text-zinc-950 shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab 1: Branding & Fonts */}
          {activeTab === 'branding' && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-4 shadow-xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Type className="w-4 h-4 text-amber-400" />
                <span>Store Identity & Typography</span>
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-300 font-medium">Store Name / Brand</label>
                <input
                  type="text"
                  value={draftConfig.siteName}
                  onChange={(e) => handleInputChange('siteName', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:border-amber-500 outline-none"
                  placeholder="HARCONXS"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-300 font-medium">Brand Tagline</label>
                <input
                  type="text"
                  value={draftConfig.tagline}
                  onChange={(e) => handleInputChange('tagline', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:border-amber-500 outline-none"
                  placeholder="LUXURY COMMERCE & SANCTUARY ATELIER"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-300 font-medium">Display Font Family</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['serif', 'sans', 'mono'] as const).map(f => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => handleInputChange('fontFamily', f)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold capitalize transition-all cursor-pointer ${
                        draftConfig.fontFamily === f
                          ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <span className={f === 'serif' ? 'font-serif' : f === 'mono' ? 'font-mono' : 'font-sans'}>
                        {f}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-300 font-medium">Logo Image URL (Optional)</label>
                <input
                  type="url"
                  value={draftConfig.logoImageUrl || ''}
                  onChange={(e) => handleInputChange('logoImageUrl', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:border-amber-500 outline-none"
                  placeholder="https://..."
                />
                <p className="text-[10px] text-zinc-500">Leave blank to use stylized brand text wordmark.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-300 font-medium">Footer Brand Statement</label>
                <textarea
                  value={draftConfig.footerTagline}
                  onChange={(e) => handleInputChange('footerTagline', e.target.value)}
                  rows={2}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100 focus:border-amber-500 outline-none resize-none"
                />
              </div>
            </div>
          )}

          {/* Tab 2: Color Palette */}
          {activeTab === 'colors' && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-4 shadow-xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-amber-400" />
                <span>Theme Accent Colors</span>
              </h3>

              {/* Quick Palettes */}
              <div className="space-y-2">
                <label className="text-xs text-zinc-400 font-medium">Quick Designer Presets</label>
                <div className="grid grid-cols-1 gap-2">
                  {presetPalettes.map((pal, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        handleInputChange('primaryColor', pal.primary);
                        handleInputChange('accentColor', pal.accent);
                        handleInputChange('secondaryColor', pal.secondary);
                      }}
                      className="flex items-center justify-between p-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-xs transition-colors cursor-pointer"
                    >
                      <span className="text-zinc-300 font-medium">{pal.name}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full border border-black/20" style={{ backgroundColor: pal.primary }} />
                        <span className="w-4 h-4 rounded-full border border-black/20" style={{ backgroundColor: pal.accent }} />
                        <span className="w-4 h-4 rounded-full border border-black/20" style={{ backgroundColor: pal.secondary }} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Hex Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-300 font-medium">Primary Accent</label>
                  <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-xl p-1.5">
                    <input
                      type="color"
                      value={draftConfig.primaryColor}
                      onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                      className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={draftConfig.primaryColor}
                      onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                      className="w-full text-xs font-mono text-zinc-200 bg-transparent outline-none uppercase"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-300 font-medium">Secondary (Rose)</label>
                  <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-xl p-1.5">
                    <input
                      type="color"
                      value={draftConfig.accentColor}
                      onChange={(e) => handleInputChange('accentColor', e.target.value)}
                      className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={draftConfig.accentColor}
                      onChange={(e) => handleInputChange('accentColor', e.target.value)}
                      className="w-full text-xs font-mono text-zinc-200 bg-transparent outline-none uppercase"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-300 font-medium">Tertiary (Sky)</label>
                  <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-xl p-1.5">
                    <input
                      type="color"
                      value={draftConfig.secondaryColor}
                      onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                      className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={draftConfig.secondaryColor}
                      onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                      className="w-full text-xs font-mono text-zinc-200 bg-transparent outline-none uppercase"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Hero Headline & Banner Image */}
          {activeTab === 'hero' && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-4 shadow-xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>Hero Banner Presentation</span>
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-300 font-medium">Hero Main Headline</label>
                <input
                  type="text"
                  value={draftConfig.heroHeadline}
                  onChange={(e) => handleInputChange('heroHeadline', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:border-amber-500 outline-none"
                  placeholder="SHOP • PERSONALIZE • CUSTOMIZE • CREATE"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-300 font-medium">Hero Sub-headline Pitch</label>
                <textarea
                  value={draftConfig.heroSubheadline}
                  onChange={(e) => handleInputChange('heroSubheadline', e.target.value)}
                  rows={3}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100 focus:border-amber-500 outline-none resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-300 font-medium">Hero Background / Banner Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={draftConfig.bannerImageUrl}
                    onChange={(e) => handleInputChange('bannerImageUrl', e.target.value)}
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:border-amber-500 outline-none"
                    placeholder="https://..."
                  />
                </div>
                {draftConfig.bannerImageUrl && (
                  <div className="relative h-20 rounded-xl overflow-hidden border border-zinc-800 mt-2">
                    <img src={draftConfig.bannerImageUrl} alt="Banner preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 4: Announcement Bar */}
          {activeTab === 'announcement' && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-4 shadow-xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Top Ticker & Offers</span>
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-300 font-medium">Announcement Text</label>
                <input
                  type="text"
                  value={draftConfig.announcementText}
                  onChange={(e) => handleInputChange('announcementText', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:border-amber-500 outline-none"
                  placeholder="Use code WELCOME15 for 15% off first order"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-300 font-medium">Promo Coupon Code</label>
                <input
                  type="text"
                  value={draftConfig.announcementDiscountCode}
                  onChange={(e) => handleInputChange('announcementDiscountCode', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono uppercase text-amber-400 focus:border-amber-500 outline-none"
                  placeholder="WELCOME15"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-300 font-medium">Free Express Shipping Threshold (₹)</label>
                <input
                  type="number"
                  value={draftConfig.freeShippingThreshold}
                  onChange={(e) => handleInputChange('freeShippingThreshold', Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-emerald-400 focus:border-amber-500 outline-none"
                  placeholder="1500"
                />
              </div>
            </div>
          )}

          {/* Tab 5: Contact & Helpdesk */}
          {activeTab === 'contact' && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-4 shadow-xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-amber-400" />
                <span>Support & Contact Info</span>
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-300 font-medium">Customer Support Email</label>
                <input
                  type="email"
                  value={draftConfig.supportEmail}
                  onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:border-amber-500 outline-none"
                  placeholder="care@harconxs.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-300 font-medium">WhatsApp / Helpline Phone</label>
                <input
                  type="tel"
                  value={draftConfig.supportPhone}
                  onChange={(e) => handleInputChange('supportPhone', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:border-amber-500 outline-none"
                  placeholder="+91 98200 12890"
                />
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: INTERACTIVE LIVE PREVIEW CANVAS */}
        <div className="lg:col-span-7 space-y-3">
          
          <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 px-4 py-2.5 rounded-2xl">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Eye className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-zinc-200">Interactive Storefront Preview</span>
              <span className="text-[10px] text-zinc-500 font-mono">(Live Render)</span>
            </div>

            <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  previewDevice === 'desktop' ? 'bg-zinc-800 text-amber-400' : 'text-zinc-500 hover:text-zinc-300'
                }`}
                title="Desktop View"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  previewDevice === 'mobile' ? 'bg-zinc-800 text-amber-400' : 'text-zinc-500 hover:text-zinc-300'
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Frame Wrapper */}
          <div className={`mx-auto transition-all duration-300 bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl ${
            previewDevice === 'mobile' ? 'max-w-[360px] border-4 border-zinc-800' : 'w-full'
          }`}>
            
            {/* 1. Preview Top Announcement Bar */}
            <div className="bg-zinc-950 border-b border-zinc-800 px-3 py-1.5 text-[11px] flex items-center justify-between text-zinc-300">
              <div className="flex items-center gap-1.5 truncate">
                <Sparkles className="w-3 h-3 shrink-0" style={{ color: draftConfig.primaryColor }} />
                <span className="truncate">{draftConfig.announcementText}</span>
              </div>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 ml-2" style={{ backgroundColor: `${draftConfig.primaryColor}20`, color: draftConfig.primaryColor }}>
                {draftConfig.announcementDiscountCode}
              </span>
            </div>

            {/* 2. Preview Header Navbar */}
            <div className="bg-zinc-950/90 border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {draftConfig.logoImageUrl ? (
                  <img src={draftConfig.logoImageUrl} alt="Logo" className="h-6 w-auto object-contain" />
                ) : (
                  <span
                    className={`font-bold tracking-wider text-sm uppercase text-zinc-100 ${
                      draftConfig.fontFamily === 'serif' ? 'font-serif' : draftConfig.fontFamily === 'mono' ? 'font-mono' : 'font-sans'
                    }`}
                  >
                    {draftConfig.siteName || 'HARCONXS'}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-zinc-400">
                <span className="hover:text-zinc-100 cursor-pointer">Shop</span>
                <span className="hover:text-rose-400 cursor-pointer hidden sm:inline" style={{ color: draftConfig.accentColor }}>Couples</span>
                <div className="flex items-center gap-1 font-mono text-[11px] font-bold text-amber-400">
                  <span>₹ INR</span>
                </div>
                <ShoppingBag className="w-4 h-4 text-zinc-300" />
              </div>
            </div>

            {/* 3. Preview Hero Section */}
            <div className="relative p-6 sm:p-8 overflow-hidden bg-zinc-900/60 border-b border-zinc-800 text-center space-y-4">
              {draftConfig.bannerImageUrl && (
                <div className="absolute inset-0 opacity-15 pointer-events-none">
                  <img src={draftConfig.bannerImageUrl} alt="Banner" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="relative z-10 space-y-3 max-w-lg mx-auto">
                <span
                  className="inline-block text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border"
                  style={{
                    backgroundColor: `${draftConfig.primaryColor}15`,
                    borderColor: `${draftConfig.primaryColor}40`,
                    color: draftConfig.primaryColor
                  }}
                >
                  {draftConfig.tagline}
                </span>

                <h1
                  className={`text-lg sm:text-2xl font-bold tracking-tight text-zinc-100 ${
                    draftConfig.fontFamily === 'serif' ? 'font-serif' : draftConfig.fontFamily === 'mono' ? 'font-mono' : 'font-sans'
                  }`}
                >
                  {draftConfig.heroHeadline}
                </h1>

                <p className="text-xs text-zinc-400 leading-relaxed max-w-md mx-auto">
                  {draftConfig.heroSubheadline}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl text-xs font-bold shadow-lg transition-all text-zinc-950 cursor-pointer"
                    style={{ backgroundColor: draftConfig.primaryColor }}
                  >
                    Shop Atelier
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl text-xs font-bold border transition-all text-zinc-200 bg-zinc-900/80 cursor-pointer"
                    style={{ borderColor: `${draftConfig.accentColor}60`, color: draftConfig.accentColor }}
                  >
                    Couple Builder
                  </button>
                </div>
              </div>
            </div>

            {/* 4. Preview Sample Product Cards */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-200">Featured Sanctuary Picks</span>
                <span className="text-[11px] font-semibold" style={{ color: draftConfig.primaryColor }}>View All &rarr;</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 space-y-2">
                  <div className="relative aspect-square rounded-xl bg-zinc-950 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1611591475841-e40889c20a1f?w=400"
                      alt="Sample"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded text-zinc-950 font-sans" style={{ backgroundColor: draftConfig.primaryColor }}>
                      Best Seller
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-200 truncate">Coordinates Matching Bracelets</h4>
                    <p className="text-xs font-mono font-bold mt-1" style={{ color: draftConfig.primaryColor }}>₹ 5,644</p>
                  </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 space-y-2">
                  <div className="relative aspect-square rounded-xl bg-zinc-950 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400"
                      alt="Sample"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded text-white font-sans" style={{ backgroundColor: draftConfig.accentColor }}>
                      Couples
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-200 truncate">Couple Memory Projection Pendant</h4>
                    <p className="text-xs font-mono font-bold mt-1" style={{ color: draftConfig.primaryColor }}>₹ 6,557</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Preview Footer */}
            <div className="bg-zinc-950 border-t border-zinc-800 p-4 text-center space-y-2 text-[11px] text-zinc-500">
              <p className="text-zinc-400 font-medium">{draftConfig.footerTagline}</p>
              <p>Email: <span className="text-zinc-300">{draftConfig.supportEmail}</span> | Hotline: <span className="text-zinc-300">{draftConfig.supportPhone}</span></p>
              <p className="text-[10px]">© 2026 {draftConfig.siteName}. Free delivery on orders over ₹{draftConfig.freeShippingThreshold}.</p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
