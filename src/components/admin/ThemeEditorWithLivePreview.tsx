import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { ThemeConfig, ThemeRevision } from '../../types';
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
  Tablet,
  Check,
  Globe,
  Layout,
  MousePointer,
  Square,
  ShieldCheck,
  Search,
  ExternalLink,
  History,
  Tag,
  AlertCircle,
  Clock,
  Trash2,
  Undo2,
  Send,
  HelpCircle,
  Lock,
  ChevronRight,
  ArrowRight,
  Sparkle
} from 'lucide-react';
import { INITIAL_THEME_CONFIG } from '../../data/initialData';
import { normalizeThemeConfig, getThemeButtonClasses, getCoupleWebsiteThemeStyle } from '../../utils/themeUtils';

export const ThemeEditorWithLivePreview: React.FC = () => {
  const {
    themeConfig,
    themeDraft,
    themeRevisions,
    isLoadingTheme,
    updateThemeDraft,
    saveThemeDraft,
    publishTheme,
    discardThemeChanges,
    resetThemeToDefaults,
    createThemeSnapshot,
    restoreThemeSnapshot,
    deleteThemeSnapshot,
    showToast,
    products,
    formatPrice
  } = useStore();

  // Local active editor tab
  type ThemeTab = 
    | 'brand'
    | 'typography'
    | 'colors'
    | 'buttons'
    | 'cards'
    | 'header'
    | 'footer'
    | 'announcement'
    | 'layout'
    | 'responsive'
    | 'seo'
    | 'revisions';

  const [activeTab, setActiveTab] = useState<ThemeTab>('brand');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewMode, setPreviewMode] = useState<'storefront' | 'couple-engine'>('storefront');
  
  // Action status states
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);

  // Snapshot modal/form state
  const [isCreatingSnapshot, setIsCreatingSnapshot] = useState(false);
  const [snapshotNameInput, setSnapshotNameInput] = useState('');
  const [snapshotNotesInput, setSnapshotNotesInput] = useState('');

  // Keyword tag input state for SEO
  const [newKeywordInput, setNewKeywordInput] = useState('');

  // Preset Color Palettes
  const presetPalettes = [
    { 
      name: 'Royal Gold & Amber (Default)', 
      primary: '#f59e0b', 
      accent: '#f43f5e', 
      secondary: '#38bdf8',
      bg: '#09090b',
      surface: '#18181b',
      border: '#27272a',
      mode: 'dark' as const
    },
    { 
      name: 'Midnight Obsidian', 
      primary: '#eab308', 
      accent: '#ec4899', 
      secondary: '#06b6d4',
      bg: '#000000',
      surface: '#121215',
      border: '#1f1f23',
      mode: 'obsidian' as const
    },
    { 
      name: 'Rose Gold & Champagne', 
      primary: '#fb7185', 
      accent: '#f59e0b', 
      secondary: '#c084fc',
      bg: '#0c0a09',
      surface: '#1c1917',
      border: '#292524',
      mode: 'champagne' as const
    },
    { 
      name: 'Cyber Titanium Blue', 
      primary: '#38bdf8', 
      accent: '#818cf8', 
      secondary: '#34d399',
      bg: '#030712',
      surface: '#0f172a',
      border: '#1e293b',
      mode: 'midnight' as const
    },
    { 
      name: 'Pure Monochrome Atelier', 
      primary: '#f4f4f5', 
      accent: '#a1a1aa', 
      secondary: '#71717a',
      bg: '#09090b',
      surface: '#18181b',
      border: '#27272a',
      mode: 'dark' as const
    },
    { 
      name: 'Sovereign Warm Ivory (Light Mode)', 
      primary: '#b45309', 
      accent: '#be123c', 
      secondary: '#0369a1',
      bg: '#fafaf9',
      surface: '#f5f5f4',
      border: '#e7e5e4',
      mode: 'light' as const
    }
  ];

  // Helper to handle partial updates cleanly
  const handleUpdate = (updater: Partial<ThemeConfig>) => {
    updateThemeDraft(updater);
    setSaveSuccessMessage(null);
    setSaveErrorMessage(null);
  };

  const handleSubUpdate = <K extends keyof ThemeConfig>(category: K, subField: string, value: any) => {
    const currentCategoryObj = (themeDraft[category] as any) || {};
    handleUpdate({
      [category]: {
        ...currentCategoryObj,
        [subField]: value
      }
    } as any);
  };

  // 1. Save Draft to Database
  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    setSaveSuccessMessage(null);
    setSaveErrorMessage(null);
    try {
      const res = await saveThemeDraft();
      if (res.success) {
        setSaveSuccessMessage('Draft persisted in Supabase database.');
        setTimeout(() => setSaveSuccessMessage(null), 4000);
      } else {
        setSaveErrorMessage(res.error || 'Failed to save draft in database');
      }
    } catch (err: any) {
      setSaveErrorMessage(err?.message || 'Database connection failure');
    } finally {
      setIsSavingDraft(false);
    }
  };

  // 2. Publish Live to Storefront
  const handlePublish = async () => {
    setIsPublishing(true);
    setSaveSuccessMessage(null);
    setSaveErrorMessage(null);
    try {
      const res = await publishTheme(
        themeDraft,
        `Published Live • ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`,
        'Admin published live storefront theme from Theme Studio'
      );
      if (res.success) {
        setSaveSuccessMessage('Theme published live to HARCONXS storefront & Supabase!');
        setTimeout(() => setSaveSuccessMessage(null), 5000);
      } else {
        setSaveErrorMessage(res.error || 'Failed to publish theme to database');
      }
    } catch (err: any) {
      setSaveErrorMessage(err?.message || 'Publication transaction failed');
    } finally {
      setIsPublishing(false);
    }
  };

  // 3. Discard Changes
  const handleDiscard = async () => {
    if (window.confirm('Discard all unsaved changes and reload the last published theme from database?')) {
      await discardThemeChanges();
      setSaveSuccessMessage('Draft changes discarded. Reverted to database published theme.');
      setTimeout(() => setSaveSuccessMessage(null), 3000);
    }
  };

  // 4. Reset Theme to Factory Defaults
  const handleReset = () => {
    if (window.confirm('Reset all theme settings, colors, buttons, and typography back to factory atelier defaults?')) {
      resetThemeToDefaults();
      setSaveSuccessMessage('Theme reset to atelier factory defaults. Click "Save Draft" or "Publish" to save.');
      setTimeout(() => setSaveSuccessMessage(null), 3000);
    }
  };

  // 5. Create Manual Snapshot
  const handleCreateSnapshotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!snapshotNameInput.trim()) {
      showToast('Please specify a name for the revision snapshot.');
      return;
    }
    const res = await createThemeSnapshot(snapshotNameInput.trim(), snapshotNotesInput.trim());
    if (res.success) {
      setIsCreatingSnapshot(false);
      setSnapshotNameInput('');
      setSnapshotNotesInput('');
      setActiveTab('revisions');
    }
  };

  // Sample featured products for preview
  const sampleProducts = products.slice(0, 3);
  const coupleWebsiteStyle = getCoupleWebsiteThemeStyle(themeDraft);

  return (
    <div className="space-y-6">
      
      {/* 1. TOP MASTER CONTROL BAR */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Header title & status badge */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/30 text-amber-400 flex items-center justify-center shadow-md">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-lg font-serif font-bold text-zinc-100">
                  HARCONXS Theme Studio
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 font-bold uppercase">
                  Supabase Persistent
                </span>
                {themeDraft.status === 'published' ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3 h-3" /> Live Storefront
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center gap-1 font-bold">
                    <Sparkles className="w-3 h-3" /> Draft Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Customize 11 modular design categories with instant preview, draft persistence, separate publishing, and version snapshots.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="theme-discard-changes-btn"
              onClick={handleDiscard}
              disabled={isLoadingTheme}
              className="px-3.5 py-2 min-h-[40px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              title="Discard draft changes and revert to published version"
            >
              <Undo2 className="w-3.5 h-3.5 text-zinc-400" />
              <span>Discard</span>
            </button>

            <button
              id="theme-reset-defaults-btn"
              onClick={handleReset}
              disabled={isLoadingTheme}
              className="px-3.5 py-2 min-h-[40px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              title="Reset all settings to factory atelier defaults"
            >
              <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
              <span>Reset Defaults</span>
            </button>

            <button
              id="theme-create-snapshot-modal-btn"
              onClick={() => setIsCreatingSnapshot(true)}
              disabled={isLoadingTheme}
              className="px-3.5 py-2 min-h-[40px] bg-zinc-800 hover:bg-zinc-700 text-amber-300 hover:text-amber-200 border border-amber-400/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              title="Capture a named revision snapshot in Supabase"
            >
              <History className="w-3.5 h-3.5 text-amber-400" />
              <span>Snapshot</span>
            </button>

            <button
              id="theme-save-draft-btn"
              onClick={handleSaveDraft}
              disabled={isSavingDraft || isLoadingTheme}
              className="px-4 py-2 min-h-[40px] bg-zinc-700 hover:bg-zinc-600 text-zinc-100 font-bold text-xs rounded-xl border border-zinc-600 flex items-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
            >
              {isSavingDraft ? <Clock className="w-4 h-4 animate-spin text-amber-400" /> : <Save className="w-4 h-4 text-amber-400" />}
              <span>{isSavingDraft ? 'Saving Draft...' : 'Save Draft'}</span>
            </button>

            <button
              id="theme-publish-live-btn"
              onClick={handlePublish}
              disabled={isPublishing || isLoadingTheme}
              className="px-5 py-2 min-h-[40px] bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-amber-400/20 cursor-pointer disabled:opacity-50"
            >
              {isPublishing ? <Clock className="w-4 h-4 animate-spin text-zinc-950" /> : <Send className="w-4 h-4 text-zinc-950" />}
              <span>{isPublishing ? 'Publishing...' : 'Publish Live'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic feedback banners */}
        {saveSuccessMessage && (
          <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{saveSuccessMessage}</span>
          </div>
        )}

        {saveErrorMessage && (
          <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{saveErrorMessage}</span>
          </div>
        )}
      </div>

      {/* 2. REVISION SNAPSHOT MODAL */}
      {isCreatingSnapshot && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400 font-serif font-bold text-base">
                <History className="w-5 h-5" />
                <span>Create Theme Revision Snapshot</span>
              </div>
              <button
                onClick={() => setIsCreatingSnapshot(false)}
                className="text-zinc-500 hover:text-zinc-300 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSnapshotSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Snapshot Name <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diwali Gold Atelier 2026 or Minimalist Obsidian"
                  value={snapshotNameInput}
                  onChange={(e) => setSnapshotNameInput(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Revision Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe colors, typography, or promotional changes made in this version..."
                  value={snapshotNotesInput}
                  onChange={(e) => setSnapshotNotesInput(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingSnapshot(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 rounded-xl text-xs font-bold shadow-lg shadow-amber-400/20 cursor-pointer"
                >
                  Save Snapshot to Supabase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. MAIN DUAL-PANE WORKSPACE: SETTINGS TABS (LEFT) & LIVE PREVIEW (RIGHT) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: THEME SETTINGS CATEGORIES TABS (5 Cols on XL) */}
        {/* ========================================================================= */}
        <div className="xl:col-span-5 bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-6 shadow-xl">
          
          {/* CATEGORY TABS SELECTOR (HORIZONTAL SCROLL ON MOBILE) */}
          <div>
            <div className="text-[11px] font-mono uppercase text-zinc-500 tracking-wider mb-2">
              Theme Setting Categories (11 Modules)
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
              {[
                { id: 'brand', label: 'Brand', icon: Globe },
                { id: 'typography', label: 'Typography', icon: Type },
                { id: 'colors', label: 'Colors', icon: Palette },
                { id: 'buttons', label: 'Buttons', icon: MousePointer },
                { id: 'cards', label: 'Cards', icon: Square },
                { id: 'header', label: 'Header', icon: Layout },
                { id: 'footer', label: 'Footer', icon: Layers },
                { id: 'announcement', label: 'Announcement', icon: Tag },
                { id: 'layout', label: 'Layout', icon: Sliders },
                { id: 'responsive', label: 'Responsive', icon: Smartphone },
                { id: 'seo', label: 'SEO', icon: Search },
                { id: 'revisions', label: `Revisions (${themeRevisions.length})`, icon: History }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`theme-tab-${tab.id}-btn`}
                    onClick={() => setActiveTab(tab.id as ThemeTab)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20'
                        : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/70'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TAB 1: BRAND SETTINGS */}
          {activeTab === 'brand' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="border-b border-zinc-800 pb-2">
                <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-amber-400" />
                  <span>Brand Identity & Wordmark</span>
                </h3>
                <p className="text-xs text-zinc-400">Configure public store name, legal trademark, slogans, and logo URLs.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Store / Atelier Name</label>
                <input
                  type="text"
                  value={themeDraft.brand.siteName}
                  onChange={(e) => {
                    handleSubUpdate('brand', 'siteName', e.target.value);
                    handleUpdate({ siteName: e.target.value });
                  }}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400 font-serif"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Brand Tagline</label>
                <input
                  type="text"
                  value={themeDraft.brand.tagline}
                  onChange={(e) => {
                    handleSubUpdate('brand', 'tagline', e.target.value);
                    handleUpdate({ tagline: e.target.value });
                  }}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Custom Brand Logo Image URL</label>
                <input
                  type="url"
                  placeholder="https://... (Leave empty to use refined typography wordmark)"
                  value={themeDraft.brand.logoImageUrl || ''}
                  onChange={(e) => {
                    handleSubUpdate('brand', 'logoImageUrl', e.target.value);
                    handleUpdate({ logoImageUrl: e.target.value });
                  }}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Brand Statement / Mission</label>
                <textarea
                  rows={2}
                  value={themeDraft.brand.brandStatement}
                  onChange={(e) => handleSubUpdate('brand', 'brandStatement', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Established Year</label>
                  <input
                    type="text"
                    value={themeDraft.brand.establishedYear}
                    onChange={(e) => handleSubUpdate('brand', 'establishedYear', e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Wordmark Fallback</label>
                  <label className="flex items-center gap-2 pt-2 text-xs text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={themeDraft.brand.showWordmarkIfNoLogo}
                      onChange={(e) => handleSubUpdate('brand', 'showWordmarkIfNoLogo', e.target.checked)}
                      className="rounded text-amber-400 focus:ring-0"
                    />
                    <span>Show text wordmark</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Copyright Notice Text</label>
                <input
                  type="text"
                  value={themeDraft.brand.copyrightText}
                  onChange={(e) => handleSubUpdate('brand', 'copyrightText', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          )}

          {/* TAB 2: TYPOGRAPHY SETTINGS */}
          {activeTab === 'typography' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="border-b border-zinc-800 pb-2">
                <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                  <Type className="w-4 h-4 text-amber-400" />
                  <span>Typography Hierarchy</span>
                </h3>
                <p className="text-xs text-zinc-400">Harmonize heading fonts, body text scales, letter spacing, and line heights.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Primary Display Font Archetype</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'serif', label: 'Classical Serif', sub: 'Playfair / Luxury' },
                    { id: 'sans', label: 'Clean Sans', sub: 'Plus Jakarta / Modern' },
                    { id: 'display', label: 'Atelier Cinzel', sub: 'Haute Horlogerie' },
                    { id: 'mono', label: 'Editorial Mono', sub: 'Technical Minimal' },
                  ].map(f => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => {
                        handleSubUpdate('typography', 'fontFamily', f.id);
                        handleUpdate({ fontFamily: (f.id === 'display' ? 'serif' : f.id) as any });
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        themeDraft.typography.fontFamily === f.id
                          ? 'bg-amber-400/10 border-amber-400 text-amber-300'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="text-xs font-bold">{f.label}</div>
                      <div className="text-[10px] text-zinc-500">{f.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Heading Letter Spacing</label>
                  <select
                    value={themeDraft.typography.headingLetterSpacing}
                    onChange={(e) => handleSubUpdate('typography', 'headingLetterSpacing', e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="tight">Tight (-0.025em)</option>
                    <option value="normal">Normal (0em)</option>
                    <option value="wide">Wide (0.05em)</option>
                    <option value="widest">Widest (0.1em)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Base Font Scale</label>
                  <select
                    value={themeDraft.typography.baseFontSize}
                    onChange={(e) => handleSubUpdate('typography', 'baseFontSize', e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="14px">14px (Dense)</option>
                    <option value="15px">15px (Balanced)</option>
                    <option value="16px">16px (Standard Accessible)</option>
                    <option value="18px">18px (Comfortable)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Heading Weight</label>
                  <select
                    value={themeDraft.typography.headingFontWeight}
                    onChange={(e) => handleSubUpdate('typography', 'headingFontWeight', e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="medium">Medium (500)</option>
                    <option value="semibold">Semibold (600)</option>
                    <option value="bold">Bold (700)</option>
                    <option value="extrabold">Extra Bold (800)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Body Line Height</label>
                  <select
                    value={themeDraft.typography.bodyLineHeight}
                    onChange={(e) => handleSubUpdate('typography', 'bodyLineHeight', e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="snug">Snug (1.375)</option>
                    <option value="normal">Normal (1.5)</option>
                    <option value="relaxed">Relaxed (1.625)</option>
                    <option value="loose">Loose (2.0)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COLORS & PRESET PALETTES */}
          {activeTab === 'colors' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="border-b border-zinc-800 pb-2">
                <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-amber-400" />
                  <span>Color Palette & Tokens</span>
                </h3>
                <p className="text-xs text-zinc-400">Choose a curated palette or customize hex tokens for accents, cards, and borders.</p>
              </div>

              {/* Preset Palette Buttons */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-2">Curated Atelier Presets</label>
                <div className="grid grid-cols-2 gap-2">
                  {presetPalettes.map((pal, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        handleSubUpdate('colors', 'primaryColor', pal.primary);
                        handleSubUpdate('colors', 'accentColor', pal.accent);
                        handleSubUpdate('colors', 'secondaryColor', pal.secondary);
                        handleSubUpdate('colors', 'backgroundColor', pal.bg);
                        handleSubUpdate('colors', 'surfaceColor', pal.surface);
                        handleSubUpdate('colors', 'borderColor', pal.border);
                        handleSubUpdate('colors', 'themeMode', pal.mode);
                        handleUpdate({
                          primaryColor: pal.primary,
                          accentColor: pal.accent,
                          secondaryColor: pal.secondary
                        });
                      }}
                      className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-left transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm" style={{ backgroundColor: pal.primary }} />
                        <span className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm" style={{ backgroundColor: pal.accent }} />
                        <span className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm" style={{ backgroundColor: pal.secondary }} />
                        <span className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: pal.bg }} />
                      </div>
                      <div className="text-[11px] font-bold text-zinc-200 truncate group-hover:text-amber-300">{pal.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Granular Color Pickers */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-semibold text-zinc-300">Granular Hex Tokens</div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Primary Color (Gold / Accent)</label>
                    <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-700 rounded-xl p-1.5">
                      <input
                        type="color"
                        value={themeDraft.colors.primaryColor}
                        onChange={(e) => {
                          handleSubUpdate('colors', 'primaryColor', e.target.value);
                          handleUpdate({ primaryColor: e.target.value });
                        }}
                        className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={themeDraft.colors.primaryColor}
                        onChange={(e) => {
                          handleSubUpdate('colors', 'primaryColor', e.target.value);
                          handleUpdate({ primaryColor: e.target.value });
                        }}
                        className="w-full bg-transparent text-xs font-mono text-zinc-200 uppercase focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Accent (Crimson / Highlight)</label>
                    <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-700 rounded-xl p-1.5">
                      <input
                        type="color"
                        value={themeDraft.colors.accentColor}
                        onChange={(e) => {
                          handleSubUpdate('colors', 'accentColor', e.target.value);
                          handleUpdate({ accentColor: e.target.value });
                        }}
                        className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={themeDraft.colors.accentColor}
                        onChange={(e) => {
                          handleSubUpdate('colors', 'accentColor', e.target.value);
                          handleUpdate({ accentColor: e.target.value });
                        }}
                        className="w-full bg-transparent text-xs font-mono text-zinc-200 uppercase focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Secondary / Cyan Token</label>
                    <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-700 rounded-xl p-1.5">
                      <input
                        type="color"
                        value={themeDraft.colors.secondaryColor}
                        onChange={(e) => {
                          handleSubUpdate('colors', 'secondaryColor', e.target.value);
                          handleUpdate({ secondaryColor: e.target.value });
                        }}
                        className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={themeDraft.colors.secondaryColor}
                        onChange={(e) => {
                          handleSubUpdate('colors', 'secondaryColor', e.target.value);
                          handleUpdate({ secondaryColor: e.target.value });
                        }}
                        className="w-full bg-transparent text-xs font-mono text-zinc-200 uppercase focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Page Canvas Background</label>
                    <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-700 rounded-xl p-1.5">
                      <input
                        type="color"
                        value={themeDraft.colors.backgroundColor}
                        onChange={(e) => handleSubUpdate('colors', 'backgroundColor', e.target.value)}
                        className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={themeDraft.colors.backgroundColor}
                        onChange={(e) => handleSubUpdate('colors', 'backgroundColor', e.target.value)}
                        className="w-full bg-transparent text-xs font-mono text-zinc-200 uppercase focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Card / Surface Color</label>
                    <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-700 rounded-xl p-1.5">
                      <input
                        type="color"
                        value={themeDraft.colors.surfaceColor}
                        onChange={(e) => handleSubUpdate('colors', 'surfaceColor', e.target.value)}
                        className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={themeDraft.colors.surfaceColor}
                        onChange={(e) => handleSubUpdate('colors', 'surfaceColor', e.target.value)}
                        className="w-full bg-transparent text-xs font-mono text-zinc-200 uppercase focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Border / Divider Color</label>
                    <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-700 rounded-xl p-1.5">
                      <input
                        type="color"
                        value={themeDraft.colors.borderColor}
                        onChange={(e) => handleSubUpdate('colors', 'borderColor', e.target.value)}
                        className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={themeDraft.colors.borderColor}
                        onChange={(e) => handleSubUpdate('colors', 'borderColor', e.target.value)}
                        className="w-full bg-transparent text-xs font-mono text-zinc-200 uppercase focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BUTTON SETTINGS */}
          {activeTab === 'buttons' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="border-b border-zinc-800 pb-2">
                <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                  <MousePointer className="w-4 h-4 text-amber-400" />
                  <span>Buttons & CTA Styling</span>
                </h3>
                <p className="text-xs text-zinc-400">Configure corner curvature, hover glow effects, font weights, and text transforms.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Primary Button Aesthetic Style</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'solid', label: 'Solid Minimalist', desc: 'Flat high-contrast amber' },
                    { id: 'luxury-pill', label: 'Luxury Pill Gold', desc: 'Gradient with radiant glow' },
                    { id: 'glow', label: 'Neon Cyber Glow', desc: 'Ambient drop shadow' },
                    { id: 'outline', label: 'Refined Outline', desc: 'Border with subtle tint' }
                  ].map(b => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => handleSubUpdate('buttons', 'buttonStyle', b.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        themeDraft.buttons.buttonStyle === b.id
                          ? 'bg-amber-400/10 border-amber-400 text-amber-300'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="text-xs font-bold">{b.label}</div>
                      <div className="text-[10px] text-zinc-500">{b.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Corner Curvature (Radius)</label>
                  <select
                    value={themeDraft.buttons.buttonRadius}
                    onChange={(e) => handleSubUpdate('buttons', 'buttonRadius', e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="none">Square (0px)</option>
                    <option value="sm">Subtle (rounded-sm 2px)</option>
                    <option value="md">Medium (rounded-md 6px)</option>
                    <option value="lg">Large (rounded-lg 8px)</option>
                    <option value="xl">Extra Large (rounded-xl 12px)</option>
                    <option value="full">Full Pill (rounded-full 9999px)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Text Transform</label>
                  <select
                    value={themeDraft.buttons.buttonTransform}
                    onChange={(e) => handleSubUpdate('buttons', 'buttonTransform', e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="none">Regular Capital Case</option>
                    <option value="uppercase">UPPERCASE TRACKED</option>
                    <option value="capitalize">Capitalize Each Word</option>
                  </select>
                </div>
              </div>

              {/* Interactive Live Button Sandbox */}
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-3">
                <div className="text-[11px] font-mono uppercase text-zinc-400">Live Button Preview</div>
                <div className="flex items-center gap-3 flex-wrap">
                  <button className={getThemeButtonClasses(themeDraft, 'primary', 'md')}>
                    Primary Action
                  </button>
                  <button className={getThemeButtonClasses(themeDraft, 'outline', 'md')}>
                    Outline Secondary
                  </button>
                  <button className={getThemeButtonClasses(themeDraft, 'secondary', 'md')}>
                    Dark Neutral
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CARDS & PRODUCTS */}
          {activeTab === 'cards' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="border-b border-zinc-800 pb-2">
                <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                  <Square className="w-4 h-4 text-amber-400" />
                  <span>Cards & Product Presentation</span>
                </h3>
                <p className="text-xs text-zinc-400">Adjust card border radius, background translucency, image aspect ratio, and hover zoom.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Card Radius</label>
                  <select
                    value={themeDraft.cards.cardRadius}
                    onChange={(e) => handleSubUpdate('cards', 'cardRadius', e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="none">Sharp Corners (0px)</option>
                    <option value="lg">Standard (12px)</option>
                    <option value="xl">Rounded XL (16px)</option>
                    <option value="2xl">Atelier 2XL (24px)</option>
                    <option value="3xl">Ultra Pill 3XL (32px)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Card Background</label>
                  <select
                    value={themeDraft.cards.cardBackground}
                    onChange={(e) => handleSubUpdate('cards', 'cardBackground', e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="deep">Deep Black (#121215)</option>
                    <option value="solid">Solid Surface (#18181b)</option>
                    <option value="glass">Glassmorphic Blur</option>
                    <option value="translucent">Translucent Tint</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Product Image Aspect Ratio</label>
                  <select
                    value={themeDraft.cards.productImageAspect}
                    onChange={(e) => handleSubUpdate('cards', 'productImageAspect', e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="square">Square (1:1 Ratio)</option>
                    <option value="portrait">Portrait (3:4 Ratio)</option>
                    <option value="wide">Wide Landscape (16:9 Ratio)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Shadow Elevation</label>
                  <select
                    value={themeDraft.cards.cardShadow}
                    onChange={(e) => handleSubUpdate('cards', 'cardShadow', e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="none">Flat (No Shadow)</option>
                    <option value="sm">Subtle Soft Shadow</option>
                    <option value="lg">Deep Atelier Shadow</option>
                    <option value="hover-lift">Dynamic Hover Lift Elevation</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={themeDraft.cards.imageHoverZoom}
                    onChange={(e) => handleSubUpdate('cards', 'imageHoverZoom', e.target.checked)}
                    className="rounded text-amber-400 focus:ring-0"
                  />
                  <span>Enable smooth 105% image zoom on card hover</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={themeDraft.cards.showQuickViewBadge}
                    onChange={(e) => handleSubUpdate('cards', 'showQuickViewBadge', e.target.checked)}
                    className="rounded text-amber-400 focus:ring-0"
                  />
                  <span>Show instant "Quick View" overlay badge on product cards</span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 6: HEADER SETTINGS */}
          {activeTab === 'header' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="border-b border-zinc-800 pb-2">
                <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                  <Layout className="w-4 h-4 text-amber-400" />
                  <span>Header Navigation Bar</span>
                </h3>
                <p className="text-xs text-zinc-400">Configure sticky behavior, frosted glass backdrop blur, and search prominence.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Header Style</label>
                  <select
                    value={themeDraft.header.headerStyle}
                    onChange={(e) => handleSubUpdate('header', 'headerStyle', e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="luxury">Luxury Atelier (Full Width Blur)</option>
                    <option value="minimal">Minimal Floating Bar</option>
                    <option value="bordered">Crisp High-Contrast Bordered</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Header Height</label>
                  <select
                    value={themeDraft.header.headerHeight}
                    onChange={(e) => handleSubUpdate('header', 'headerHeight', e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="compact">Compact (60px)</option>
                    <option value="normal">Standard (72px)</option>
                    <option value="tall">Spacious (84px)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={themeDraft.header.headerSticky}
                    onChange={(e) => handleSubUpdate('header', 'headerSticky', e.target.checked)}
                    className="rounded text-amber-400 focus:ring-0"
                  />
                  <span>Sticky header fixed on scroll</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={themeDraft.header.headerBlur}
                    onChange={(e) => handleSubUpdate('header', 'headerBlur', e.target.checked)}
                    className="rounded text-amber-400 focus:ring-0"
                  />
                  <span>Frosted glass backdrop blur (backdrop-blur-md)</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={themeDraft.header.showCurrencySelector}
                    onChange={(e) => handleSubUpdate('header', 'showCurrencySelector', e.target.checked)}
                    className="rounded text-amber-400 focus:ring-0"
                  />
                  <span>Display INR Currency Selector badge</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={themeDraft.header.showSearchIcon}
                    onChange={(e) => handleSubUpdate('header', 'showSearchIcon', e.target.checked)}
                    className="rounded text-amber-400 focus:ring-0"
                  />
                  <span>Show interactive catalog search bar in header</span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 7: FOOTER SETTINGS */}
          {activeTab === 'footer' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="border-b border-zinc-800 pb-2">
                <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>Footer Architecture</span>
                </h3>
                <p className="text-xs text-zinc-400">Configure footer columns, support concierge channels, and trust badges.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Footer Tagline / Bio</label>
                <textarea
                  rows={2}
                  value={themeDraft.footer.footerTagline}
                  onChange={(e) => {
                    handleSubUpdate('footer', 'footerTagline', e.target.value);
                    handleUpdate({ footerTagline: e.target.value });
                  }}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Concierge Email</label>
                  <input
                    type="email"
                    value={themeDraft.footer.supportEmail}
                    onChange={(e) => {
                      handleSubUpdate('footer', 'supportEmail', e.target.value);
                      handleUpdate({ supportEmail: e.target.value });
                    }}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Support Phone / WhatsApp</label>
                  <input
                    type="text"
                    value={themeDraft.footer.supportPhone}
                    onChange={(e) => {
                      handleSubUpdate('footer', 'supportPhone', e.target.value);
                      handleUpdate({ supportPhone: e.target.value });
                    }}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={themeDraft.footer.showPaymentBadges}
                    onChange={(e) => handleSubUpdate('footer', 'showPaymentBadges', e.target.checked)}
                    className="rounded text-amber-400 focus:ring-0"
                  />
                  <span>Show verified payment badges (UPI, Visa, Mastercard, Cashfree, Razorpay)</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={themeDraft.footer.showNewsletterBox}
                    onChange={(e) => handleSubUpdate('footer', 'showNewsletterBox', e.target.checked)}
                    className="rounded text-amber-400 focus:ring-0"
                  />
                  <span>Show VIP Atelier Newsletter subscription box in footer</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={themeDraft.footer.showSocialLinks}
                    onChange={(e) => handleSubUpdate('footer', 'showSocialLinks', e.target.checked)}
                    className="rounded text-amber-400 focus:ring-0"
                  />
                  <span>Show Instagram, Twitter, and YouTube social icons</span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 8: ANNOUNCEMENT BAR */}
          {activeTab === 'announcement' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="border-b border-zinc-800 pb-2">
                <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-amber-400" />
                  <span>Announcement & Promotional Ribbon</span>
                </h3>
                <p className="text-xs text-zinc-400">Manage promotional ticker banners, coupon codes, and threshold perks.</p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-amber-400 cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={themeDraft.announcement.announcementEnabled}
                    onChange={(e) => handleSubUpdate('announcement', 'announcementEnabled', e.target.checked)}
                    className="rounded text-amber-400 focus:ring-0"
                  />
                  <span>Enable Announcement Top Banner</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Banner Announcement Text</label>
                <input
                  type="text"
                  value={themeDraft.announcement.announcementText}
                  onChange={(e) => {
                    handleSubUpdate('announcement', 'announcementText', e.target.value);
                    handleUpdate({ announcementText: e.target.value });
                  }}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Coupon Promo Code</label>
                  <input
                    type="text"
                    value={themeDraft.announcement.announcementDiscountCode}
                    onChange={(e) => {
                      handleSubUpdate('announcement', 'announcementDiscountCode', e.target.value);
                      handleUpdate({ announcementDiscountCode: e.target.value });
                    }}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400 font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Free Shipping Threshold (₹)</label>
                  <input
                    type="number"
                    value={themeDraft.announcement.freeShippingThreshold}
                    onChange={(e) => {
                      const val = Number(e.target.value) || 0;
                      handleSubUpdate('announcement', 'freeShippingThreshold', val);
                      handleUpdate({ freeShippingThreshold: val });
                    }}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Banner Background Color</label>
                  <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-700 rounded-xl p-1.5">
                    <input
                      type="color"
                      value={themeDraft.announcement.announcementBgColor}
                      onChange={(e) => handleSubUpdate('announcement', 'announcementBgColor', e.target.value)}
                      className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={themeDraft.announcement.announcementBgColor}
                      onChange={(e) => handleSubUpdate('announcement', 'announcementBgColor', e.target.value)}
                      className="w-full bg-transparent text-xs font-mono text-zinc-200 uppercase focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Banner Text Color</label>
                  <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-700 rounded-xl p-1.5">
                    <input
                      type="color"
                      value={themeDraft.announcement.announcementTextColor}
                      onChange={(e) => handleSubUpdate('announcement', 'announcementTextColor', e.target.value)}
                      className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={themeDraft.announcement.announcementTextColor}
                      onChange={(e) => handleSubUpdate('announcement', 'announcementTextColor', e.target.value)}
                      className="w-full bg-transparent text-xs font-mono text-zinc-200 uppercase focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: LAYOUT SETTINGS */}
          {activeTab === 'layout' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="border-b border-zinc-800 pb-2">
                <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span>Layout & Spacing Math</span>
                </h3>
                <p className="text-xs text-zinc-400">Standardize container widths, rhythmic section padding, and grid gaps.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Container Max Width</label>
                  <select
                    value={themeDraft.layout.containerMaxWidth}
                    onChange={(e) => handleSubUpdate('layout', 'containerMaxWidth', e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="max-w-5xl">max-w-5xl (1024px Compact)</option>
                    <option value="max-w-6xl">max-w-6xl (1152px Refined)</option>
                    <option value="max-w-7xl">max-w-7xl (1280px Standard Luxury)</option>
                    <option value="max-w-screen-2xl">max-w-screen-2xl (1536px Ultra Wide)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Vertical Section Spacing</label>
                  <select
                    value={themeDraft.layout.sectionSpacing}
                    onChange={(e) => handleSubUpdate('layout', 'sectionSpacing', e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="compact">Compact (py-8 to py-12)</option>
                    <option value="normal">Normal (py-12 to py-16)</option>
                    <option value="spacious">Spacious (py-16 to py-24)</option>
                    <option value="airy">Airy Editorial (py-24 to py-32)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={themeDraft.layout.showSectionDividers}
                    onChange={(e) => handleSubUpdate('layout', 'showSectionDividers', e.target.checked)}
                    className="rounded text-amber-400 focus:ring-0"
                  />
                  <span>Show subtle horizontal dividers between major homepage sections</span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 10: RESPONSIVE BEHAVIOR */}
          {activeTab === 'responsive' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="border-b border-zinc-800 pb-2">
                <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-amber-400" />
                  <span>Responsive Viewport Rules</span>
                </h3>
                <p className="text-xs text-zinc-400">Optimize mobile touch interactions, product grids (375px/390px/430px), and navigation drawers.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Mobile Product Columns</label>
                  <select
                    value={themeDraft.responsive.mobileProductColumns}
                    onChange={(e) => handleSubUpdate('responsive', 'mobileProductColumns', Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400 font-mono"
                  >
                    <option value="2">2 Columns (Standard Ecommerce)</option>
                    <option value="1">1 Column (Large Featured Feed)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Mobile Navbar Format</label>
                  <select
                    value={themeDraft.responsive.mobileNavbarStyle}
                    onChange={(e) => handleSubUpdate('responsive', 'mobileNavbarStyle', e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="drawer">Slide-in Drawer (Left/Right)</option>
                    <option value="bottom-bar">Bottom Tab Bar</option>
                    <option value="compact">Compact Dropdown</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 11: SEO SETTINGS */}
          {activeTab === 'seo' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="border-b border-zinc-800 pb-2">
                <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                  <Search className="w-4 h-4 text-amber-400" />
                  <span>SEO & Meta Configuration</span>
                </h3>
                <p className="text-xs text-zinc-400">Configure global title templates, OpenGraph social sharing images, and meta tags.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Page Title Template</label>
                <input
                  type="text"
                  value={themeDraft.seo.seoTitleTemplate}
                  onChange={(e) => handleSubUpdate('seo', 'seoTitleTemplate', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400 font-mono"
                />
                <span className="text-[10px] text-zinc-500 mt-1 block">Use %s to represent the page name (e.g. "%s | HARCONXS Atelier")</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Default Meta Description</label>
                <textarea
                  rows={2}
                  value={themeDraft.seo.defaultMetaDescription}
                  onChange={(e) => handleSubUpdate('seo', 'defaultMetaDescription', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Social Share Image (OG Image URL)</label>
                <input
                  type="url"
                  value={themeDraft.seo.ogImageUrl}
                  onChange={(e) => handleSubUpdate('seo', 'ogImageUrl', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Meta Keywords</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {themeDraft.seo.metaKeywords.map((kw, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-[11px] text-zinc-300 flex items-center gap-1">
                      <span>{kw}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = themeDraft.seo.metaKeywords.filter((_, idx) => idx !== i);
                          handleSubUpdate('seo', 'metaKeywords', updated);
                        }}
                        className="hover:text-rose-400 cursor-pointer"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add keyword tag..."
                    value={newKeywordInput}
                    onChange={(e) => setNewKeywordInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newKeywordInput.trim()) {
                          handleSubUpdate('seo', 'metaKeywords', [...themeDraft.seo.metaKeywords, newKeywordInput.trim()]);
                          setNewKeywordInput('');
                        }
                      }
                    }}
                    className="flex-1 bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newKeywordInput.trim()) {
                        handleSubUpdate('seo', 'metaKeywords', [...themeDraft.seo.metaKeywords, newKeywordInput.trim()]);
                        setNewKeywordInput('');
                      }
                    }}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 12: REVISION SNAPSHOTS */}
          {activeTab === 'revisions' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="border-b border-zinc-800 pb-2 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                    <History className="w-4 h-4 text-amber-400" />
                    <span>Theme Revision History ({themeRevisions.length})</span>
                  </h3>
                  <p className="text-xs text-zinc-400">Database snapshots of prior themes. Click "Restore" to load any revision.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreatingSnapshot(true)}
                  className="px-3 py-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-xl text-xs font-bold hover:bg-amber-400/30 transition-all cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>New Snapshot</span>
                </button>
              </div>

              {themeRevisions.length === 0 ? (
                <div className="text-center py-8 bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-zinc-500 text-xs">
                  <History className="w-8 h-8 text-zinc-600 mx-auto mb-2 opacity-60" />
                  <p>No revision snapshots saved yet.</p>
                  <p className="text-[11px] text-zinc-600 mt-1">Publishing a theme or clicking "New Snapshot" automatically creates a version.</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                  {themeRevisions.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-between gap-3 hover:border-zinc-700 transition-all"
                    >
                      <div>
                        <div className="text-xs font-bold text-zinc-200 flex items-center gap-2">
                          <span>{rev.revision_name}</span>
                          {rev.is_published && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              PUBLISHED
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-zinc-500 mt-0.5 flex items-center gap-2 font-mono">
                          <span>{new Date(rev.created_at).toLocaleString()}</span>
                          <span>•</span>
                          <span>{rev.created_by || 'Admin'}</span>
                        </div>
                        {rev.notes && (
                          <div className="text-[11px] text-zinc-400 mt-1 italic">
                            "{rev.notes}"
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={async () => {
                            if (window.confirm(`Restore snapshot "${rev.revision_name}" into the active editor draft?`)) {
                              await restoreThemeSnapshot(rev.id);
                            }
                          }}
                          className="px-2.5 py-1.5 bg-amber-400/10 hover:bg-amber-400 text-amber-300 hover:text-zinc-950 border border-amber-400/30 rounded-lg text-xs font-bold transition-all cursor-pointer"
                        >
                          Restore
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            if (window.confirm(`Delete snapshot "${rev.revision_name}" from Supabase?`)) {
                              await deleteThemeSnapshot(rev.id);
                            }
                          }}
                          className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Delete snapshot"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: INTERACTIVE LIVE PREVIEW CANVAS (7 Cols on XL) */}
        {/* ========================================================================= */}
        <div className="xl:col-span-7 bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-4 shadow-xl">
          
          {/* PREVIEW TOP CONTROLS & DEVICE SELECTOR */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-zinc-200">Interactive Live Preview</span>
              <span className="text-[10px] font-mono text-zinc-500">(React Reactive)</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Mode Toggle: Storefront vs Couple Website Engine */}
              <div className="flex items-center p-1 bg-zinc-950 border border-zinc-800 rounded-xl text-xs">
                <button
                  type="button"
                  onClick={() => setPreviewMode('storefront')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    previewMode === 'storefront' ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Storefront View
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('couple-engine')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                    previewMode === 'couple-engine' ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Heart className="w-3 h-3 text-rose-400" />
                  <span>Couple Engine</span>
                </button>
              </div>

              {/* Viewport switch: Desktop / Tablet / Mobile */}
              <div className="flex items-center p-1 bg-zinc-950 border border-zinc-800 rounded-xl text-xs">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded-lg cursor-pointer ${previewDevice === 'desktop' ? 'bg-zinc-800 text-amber-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                  title="Desktop (100%)"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('tablet')}
                  className={`p-1.5 rounded-lg cursor-pointer ${previewDevice === 'tablet' ? 'bg-zinc-800 text-amber-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                  title="Tablet (768px)"
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded-lg cursor-pointer ${previewDevice === 'mobile' ? 'bg-zinc-800 text-amber-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                  title="Mobile (390px)"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* PREVIEW CONTAINER STAGE */}
          <div className="flex justify-center bg-zinc-950 p-3 sm:p-4 rounded-2xl border border-zinc-800/80 overflow-x-auto min-h-[640px]">
            <div
              style={{
                width: previewDevice === 'mobile' ? '390px' : previewDevice === 'tablet' ? '680px' : '100%',
                backgroundColor: themeDraft.colors.backgroundColor,
                color: themeDraft.colors.textColor,
                borderColor: themeDraft.colors.borderColor
              }}
              className="rounded-2xl border overflow-hidden shadow-2xl transition-all duration-300 flex flex-col font-sans"
            >
              
              {/* ========================================================================= */}
              {/* PREVIEW SUB-VIEW 1: HARCONXS STOREFRONT */}
              {/* ========================================================================= */}
              {previewMode === 'storefront' && (
                <div className="space-y-6 pb-8">
                  
                  {/* Announcement Bar */}
                  {themeDraft.announcement.announcementEnabled && (
                    <div
                      style={{
                        backgroundColor: themeDraft.announcement.announcementBgColor,
                        color: themeDraft.announcement.announcementTextColor
                      }}
                      className="px-4 py-2 text-center text-[11px] font-semibold flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{themeDraft.announcement.announcementText}</span>
                      {themeDraft.announcement.announcementDiscountCode && (
                        <span className="px-1.5 py-0.5 bg-black/20 rounded font-mono font-bold text-[10px]">
                          {themeDraft.announcement.announcementDiscountCode}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Header Navigation */}
                  <div
                    style={{
                      backgroundColor: themeDraft.header.headerBgColor || 'rgba(9,9,11,0.8)',
                      borderColor: themeDraft.colors.borderColor
                    }}
                    className={`px-4 sm:px-6 py-3.5 border-b flex items-center justify-between ${themeDraft.header.headerBlur ? 'backdrop-blur-md' : ''}`}
                  >
                    {/* Brand Wordmark / Logo */}
                    <div className="flex items-center gap-2">
                      <div
                        style={{
                          backgroundColor: themeDraft.colors.primaryColor,
                          color: '#000000'
                        }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center font-serif font-bold text-xs"
                      >
                        HX
                      </div>
                      <span
                        style={{
                          fontFamily: themeDraft.typography.fontFamily === 'serif' ? 'Playfair Display, serif' : 'sans-serif',
                          letterSpacing: themeDraft.typography.headingLetterSpacing === 'wide' ? '0.05em' : 'normal'
                        }}
                        className="font-bold text-sm"
                      >
                        {themeDraft.brand.siteName || 'HARCONXS'}
                      </span>
                    </div>

                    {/* Nav Links (Desktop) */}
                    <div className="hidden sm:flex items-center gap-4 text-xs text-zinc-400 font-medium">
                      <span className="text-zinc-100 font-bold">Shop</span>
                      <span>Couples</span>
                      <span>Custom Keepsakes</span>
                      <span>Couple Websites</span>
                    </div>

                    {/* Right action icons */}
                    <div className="flex items-center gap-2.5">
                      {themeDraft.header.showSearchIcon && (
                        <div className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300">
                          <Search className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <div className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 flex items-center gap-1 text-[11px] font-bold">
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>0</span>
                      </div>
                    </div>
                  </div>

                  {/* Hero Banner Section */}
                  <div className="px-4 sm:px-6">
                    <div
                      style={{
                        backgroundColor: themeDraft.colors.surfaceColor,
                        borderColor: themeDraft.colors.borderColor
                      }}
                      className="p-6 sm:p-8 rounded-3xl border relative overflow-hidden text-center space-y-4"
                    >
                      <div
                        style={{ color: themeDraft.colors.primaryColor }}
                        className="text-[10px] uppercase font-mono tracking-widest font-bold"
                      >
                        {themeDraft.brand.tagline || 'LUXURY COMMERCE & SANCTUARY ATELIER'}
                      </div>

                      <h2
                        style={{
                          fontFamily: themeDraft.typography.fontFamily === 'serif' ? 'Playfair Display, serif' : 'inherit',
                          color: themeDraft.colors.textColor,
                          letterSpacing: themeDraft.typography.headingLetterSpacing === 'wide' ? '0.05em' : 'normal'
                        }}
                        className="text-xl sm:text-2xl font-bold max-w-lg mx-auto leading-tight"
                      >
                        {themeDraft.heroHeadline || 'SHOP • PERSONALIZE • CUSTOMIZE • CREATE'}
                      </h2>

                      <p
                        style={{ color: themeDraft.colors.textMutedColor }}
                        className="text-xs max-w-md mx-auto leading-relaxed"
                      >
                        {themeDraft.heroSubheadline || 'Find something you love, personalize it your way, or commission bespoke titanium jewelry.'}
                      </p>

                      <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
                        <button className={getThemeButtonClasses(themeDraft, 'primary', 'sm')}>
                          <span>Explore Atelier</span>
                          <ArrowRight className="w-3 h-3 inline ml-1" />
                        </button>
                        <button className={getThemeButtonClasses(themeDraft, 'outline', 'sm')}>
                          <span>Couple Keepsakes</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Featured Product Cards Showcase */}
                  <div className="px-4 sm:px-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3
                        style={{
                          fontFamily: themeDraft.typography.fontFamily === 'serif' ? 'Playfair Display, serif' : 'inherit'
                        }}
                        className="text-sm font-bold"
                      >
                        Featured Keepsakes
                      </h3>
                      <span style={{ color: themeDraft.colors.primaryColor }} className="text-xs font-semibold">
                        View All (24) →
                      </span>
                    </div>

                    <div className={`grid ${previewDevice === 'mobile' && themeDraft.responsive.mobileProductColumns === 1 ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-3'} gap-3`}>
                      {sampleProducts.map((prod) => (
                        <div
                          key={prod.id}
                          style={{
                            backgroundColor: themeDraft.colors.surfaceColor,
                            borderColor: themeDraft.colors.borderColor
                          }}
                          className={`border p-3 rounded-2xl space-y-2 group transition-all ${
                            themeDraft.cards.cardShadow === 'hover-lift' ? 'hover:-translate-y-1' : ''
                          }`}
                        >
                          <div className="w-full aspect-square rounded-xl overflow-hidden bg-zinc-950 relative">
                            <img
                              src={prod.images?.[0] || 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=500&auto=format&fit=crop&q=80'}
                              alt={prod.name}
                              className={`w-full h-full object-cover transition-transform duration-300 ${
                                themeDraft.cards.imageHoverZoom ? 'group-hover:scale-105' : ''
                              }`}
                            />
                            {themeDraft.cards.showQuickViewBadge && (
                              <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-black/70 backdrop-blur-sm rounded text-[9px] font-bold text-white">
                                Quick View
                              </span>
                            )}
                          </div>

                          <div>
                            <div className="text-xs font-bold text-zinc-100 truncate">{prod.name}</div>
                            <div className="text-[11px] font-bold mt-0.5" style={{ color: themeDraft.colors.primaryColor }}>
                              {formatPrice(prod.price)}
                            </div>
                          </div>

                          <button className={getThemeButtonClasses(themeDraft, 'primary', 'sm') + ' w-full text-[11px] py-1.5'}>
                            Add to Cart
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Trust & Guarantee Banner */}
                  <div className="px-4 sm:px-6">
                    <div
                      style={{
                        backgroundColor: themeDraft.colors.surfaceColor,
                        borderColor: themeDraft.colors.borderColor
                      }}
                      className="p-4 rounded-2xl border grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs"
                    >
                      <div className="space-y-1">
                        <Truck className="w-4 h-4 mx-auto" style={{ color: themeDraft.colors.primaryColor }} />
                        <div className="font-bold text-[11px]">Insured Air Express</div>
                        <div className="text-[9px] text-zinc-500">Tracked to doorstep</div>
                      </div>
                      <div className="space-y-1">
                        <ShieldCheck className="w-4 h-4 mx-auto" style={{ color: themeDraft.colors.primaryColor }} />
                        <div className="font-bold text-[11px]">Lifetime Warranty</div>
                        <div className="text-[9px] text-zinc-500">Hypoallergenic titanium</div>
                      </div>
                      <div className="space-y-1">
                        <Sparkles className="w-4 h-4 mx-auto" style={{ color: themeDraft.colors.primaryColor }} />
                        <div className="font-bold text-[11px]">Laser Engraving</div>
                        <div className="text-[9px] text-zinc-500">Custom coordinates</div>
                      </div>
                      <div className="space-y-1">
                        <Heart className="w-4 h-4 mx-auto" style={{ color: themeDraft.colors.accentColor }} />
                        <div className="font-bold text-[11px]">Couple Memory Vault</div>
                        <div className="text-[9px] text-zinc-500">Lifetime portal</div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Preview */}
                  <div
                    style={{
                      backgroundColor: themeDraft.footer.footerBgColor || '#09090b',
                      borderColor: themeDraft.colors.borderColor
                    }}
                    className="px-4 sm:px-6 pt-6 pb-4 border-t text-center space-y-3"
                  >
                    <div className="font-serif font-bold text-sm text-zinc-100">
                      {themeDraft.brand.siteName || 'HARCONXS'} ATELIER
                    </div>
                    <p className="text-[11px] text-zinc-400 max-w-sm mx-auto">
                      {themeDraft.footer.footerTagline}
                    </p>

                    {themeDraft.footer.showPaymentBadges && (
                      <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500 font-mono flex-wrap">
                        <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded">UPI / QR</span>
                        <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded">Visa / MC</span>
                        <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded">Cashfree</span>
                        <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded">Razorpay</span>
                      </div>
                    )}

                    <div className="text-[10px] text-zinc-600 border-t border-zinc-900 pt-3">
                      &copy; {new Date().getFullYear()} {themeDraft.brand.copyrightText || 'HARCONXS Atelier. All Rights Reserved.'}
                    </div>
                  </div>

                </div>
              )}

              {/* ========================================================================= */}
              {/* PREVIEW SUB-VIEW 2: COUPLE WEBSITE ENGINE REUSABILITY */}
              {/* ========================================================================= */}
              {previewMode === 'couple-engine' && (
                <div className="p-6 space-y-6 text-center">
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl inline-block text-rose-400 text-xs font-bold">
                    Couple Website Engine • Reusing Active Theme Tokens
                  </div>

                  <div
                    style={{
                      backgroundColor: themeDraft.colors.surfaceColor,
                      borderColor: themeDraft.colors.borderColor,
                      borderRadius: coupleWebsiteStyle.borderRadius
                    }}
                    className="p-6 border space-y-4 shadow-xl text-left"
                  >
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                      <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5" style={{ color: coupleWebsiteStyle.accentColor }} />
                        <span className="font-serif font-bold text-sm text-zinc-100">
                          Aarav & Meera's Forever Journey
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-400/20 text-amber-300 rounded-full">
                        Theme Inherited
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs text-zinc-400">
                        The couple website engine dynamically inherits the atelier's primary color (<span className="font-mono font-bold" style={{ color: themeDraft.colors.primaryColor }}>{themeDraft.colors.primaryColor}</span>), accent highlight (<span className="font-mono font-bold" style={{ color: themeDraft.colors.accentColor }}>{themeDraft.colors.accentColor}</span>), and button geometry.
                      </div>
                      <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800/80 space-y-2">
                        <div className="text-xs font-bold text-zinc-200">Interactive Couple Timeline & RSVP</div>
                        <p className="text-[11px] text-zinc-400">
                          Our story began under the stars in Mumbai. Reconnecting memories across encrypted cloud portals.
                        </p>
                        <div className="flex items-center gap-2 pt-2">
                          <button className={getThemeButtonClasses(themeDraft, 'primary', 'sm')}>
                            Sign Couple Guestbook
                          </button>
                          <button className={getThemeButtonClasses(themeDraft, 'outline', 'sm')}>
                            View Photo Album
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
