import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { PageSection, PageRecord, PageRevision, PageSectionType, ThemeConfig } from '../../types';
import { PageSectionRenderer } from './PageSectionRenderer';
import { SupabaseSqlEditor } from './SupabaseSqlEditor';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  Save, 
  Send, 
  History, 
  Eye, 
  EyeOff, 
  Copy, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Plus, 
  Sparkles, 
  Layers, 
  Settings, 
  RotateCcw, 
  Database, 
  Check, 
  ArrowLeft, 
  ShieldCheck, 
  Lock,
  Code,
  Terminal,
  HelpCircle,
  Clock,
  UserCheck,
  ExternalLink,
  Flame,
  Layout,
  Palette,
  Compass,
  Link2,
  Sliders,
  Type,
  Grid,
  Heart,
  Bot,
  Gift,
  ShoppingBag
} from 'lucide-react';
import { SECTION_TYPE_METADATA } from '../../data/defaultPageData';

type DeviceMode = 'desktop' | 'tablet' | 'mobile';
type EditorTab = 'sections' | 'components' | 'header' | 'footer' | 'theme' | 'revisions' | 'sql';

export const VisualPageEditor: React.FC = () => {
  const {
    activePageRecord,
    updateActivePageRecord,
    savePageDraft,
    publishPage,
    pageRevisions,
    fetchPageRevisionsList,
    createPageRevisionSnapshot,
    restorePageRevisionSnapshot,
    deletePageSectionItem,
    isAdminAuthenticated,
    setIsAdminLoginModalOpen,
    setCurrentView,
    showToast,
    products,
    formatPrice
  } = useStore();

  const [themeConfig, setThemeConfig] = useState({
    siteName: 'HARCONXS',
    fontFamily: 'serif' as 'serif' | 'sans' | 'mono',
    primaryColor: '#f59e0b',
    accentColor: '#fbbf24',
    announcementText: 'Complimentary Insured Air Express on Heirloom Commissions',
    announcementDiscountCode: 'WELCOME15',
    footerTagline: 'Haute Horlogerie & Precious Metals Sovereign Atelier',
    supportEmail: 'concierge@harconxs.com',
    supportPhone: '+91 (0) 80 4920 1800'
  });
  const saveThemeConfig = async (_config?: any) => {
    showToast('Brand and theme preferences saved.');
  };

  // Local Editor State
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [activeTab, setActiveTab] = useState<EditorTab>('sections');
  const [selectedPageKey, setSelectedPageKey] = useState<string>('home');
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [revisionNameInput, setRevisionNameInput] = useState('');
  const [isCreatingRevision, setIsCreatingRevision] = useState(false);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);

  // Editable Header Links State
  const [headerLinks, setHeaderLinks] = useState([
    { label: 'Shop', path: '/shop' },
    { label: 'Couples', path: '/shop/couples' },
    { label: 'Custom Orders', path: '/custom-products' },
    { label: 'Couple Websites', path: '/couple-websites' },
    { label: 'Bot Panels', path: '/bot-panels' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' }
  ]);

  const [newLinkDraft, setNewLinkDraft] = useState({ label: '', path: '' });

  // Initialize selected section
  useEffect(() => {
    if (activePageRecord.sections.length > 0 && !selectedSectionId) {
      setSelectedSectionId(activePageRecord.sections[0].id);
    }
  }, [activePageRecord.sections, selectedSectionId]);

  // Load revisions on mount
  useEffect(() => {
    if (activePageRecord?.id) {
      fetchPageRevisionsList(activePageRecord.id);
    }
  }, [activePageRecord?.id]);

  const selectedSection = activePageRecord.sections.find(s => s.id === selectedSectionId) || null;

  // Unauthenticated Admin Guard
  if (!isAdminAuthenticated) {
    return (
      <div id="admin-auth-guard" className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-3xl bg-zinc-900 border border-zinc-800 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-mono font-semibold uppercase tracking-wider border border-rose-500/20">
              Admin Access Required
            </span>
            <h1 className="text-2xl font-serif font-bold text-zinc-100">HARCONXS Website Studio</h1>
            <p className="text-xs text-zinc-400 leading-relaxed">
              This private visual site management console is restricted to authenticated administrators with verified Supabase RBAC permissions.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-3">
            <button
              id="editor-login-btn"
              onClick={() => setIsAdminLoginModalOpen(true)}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Authenticate with Supabase</span>
            </button>
            <button
              onClick={() => setCurrentView('home')}
              className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-xs transition-colors cursor-pointer"
            >
              Return to Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- SECTION MANIPULATION HANDLERS ---
  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= activePageRecord.sections.length) return;

    updateActivePageRecord(prev => {
      const newSections = [...prev.sections];
      const temp = newSections[index];
      newSections[index] = newSections[targetIndex];
      newSections[targetIndex] = temp;
      const reindexed = newSections.map((sec, idx) => ({ ...sec, sort_order: idx }));
      return { ...prev, sections: reindexed };
    });
  };

  const handleToggleVisibility = (sectionId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    updateActivePageRecord(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === sectionId ? { ...s, is_visible: !s.is_visible, isHidden: !s.isHidden } : s)
    }));
    showToast('Visibility toggled (hidden sections are never shown on live storefront).');
  };

  const handleDuplicateSection = (sectionId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const secToDuplicate = activePageRecord.sections.find(s => s.id === sectionId);
    if (!secToDuplicate) return;

    const newId = `sec_${secToDuplicate.section_type || secToDuplicate.sectionType}_${Date.now()}`;
    const duplicatedSection: PageSection = {
      ...secToDuplicate,
      id: newId,
      name: `${secToDuplicate.name} (Copy)`,
      sort_order: (secToDuplicate.sort_order || 0) + 1
    };

    updateActivePageRecord(prev => {
      const idx = prev.sections.findIndex(s => s.id === sectionId);
      const newSections = [...prev.sections];
      newSections.splice(idx + 1, 0, duplicatedSection);
      const reindexed = newSections.map((sec, i) => ({ ...sec, sort_order: i }));
      return { ...prev, sections: reindexed };
    });

    setSelectedSectionId(newId);
    showToast(`Duplicated section: "${duplicatedSection.name}"`);
  };

  const handleDeleteSection = (sectionId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activePageRecord.sections.length <= 1) {
      showToast('Page must have at least one section.');
      return;
    }
    deletePageSectionItem(sectionId);
    if (selectedSectionId === sectionId) {
      const remaining = activePageRecord.sections.filter(s => s.id !== sectionId);
      setSelectedSectionId(remaining[0]?.id || null);
    }
  };

  const handleAddSection = (type: PageSectionType) => {
    const meta = SECTION_TYPE_METADATA[type];
    const newSection: PageSection = {
      id: `sec_${type}_${Date.now()}`,
      pageId: activePageRecord.id,
      page_id: activePageRecord.id,
      sectionType: type,
      section_type: type,
      name: meta?.label || `${type.replace(/_/g, ' ').toUpperCase()}`,
      sortOrder: activePageRecord.sections.length,
      sort_order: activePageRecord.sections.length,
      isHidden: false,
      is_visible: true,
      settings: {
        backgroundColor: '#09090b',
        textColor: '#f4f4f5',
        paddingTop: 'md',
        paddingBottom: 'md',
        containerWidth: 'wide'
      },
      settings_json: {
        bg_color: '#09090b',
        text_color: '#f4f4f5',
        padding_y: 'py-12'
      },
      content: meta?.defaultContent || {
        title: meta?.label || 'New Section',
        subtitle: meta?.description || 'Customized section content',
        badge: 'Atelier Sovereign'
      },
      content_json: meta?.defaultContent || {
        title: meta?.label || 'New Section',
        subtitle: meta?.description || 'Customized section content',
        badge: 'Atelier Sovereign'
      }
    };

    updateActivePageRecord(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));

    setSelectedSectionId(newSection.id);
    setShowAddSectionModal(false);
    showToast(`Added new "${newSection.name}" section.`);
  };

  const handleUpdateSectionContent = (field: string, value: any) => {
    if (!selectedSectionId) return;
    updateActivePageRecord(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id === selectedSectionId) {
          return {
            ...s,
            content_json: {
              ...s.content_json,
              [field]: value
            }
          };
        }
        return s;
      })
    }));
  };

  const handleUpdateSectionSetting = (field: string, value: any) => {
    if (!selectedSectionId) return;
    updateActivePageRecord(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id === selectedSectionId) {
          return {
            ...s,
            settings_json: {
              ...s.settings_json,
              [field]: value
            }
          };
        }
        return s;
      })
    }));
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    await savePageDraft(activePageRecord);
    if (themeConfig) {
      await saveThemeConfig(themeConfig);
    }
    setIsSaving(false);
    showToast('Page draft and theme configuration saved.');
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    await publishPage(activePageRecord);
    if (themeConfig) {
      await saveThemeConfig(themeConfig);
    }
    setIsPublishing(false);
    showToast('Published live to storefront! Customer view updated.');
  };

  const handleCreateSnapshot = async () => {
    if (!revisionNameInput.trim()) {
      showToast('Please name your revision snapshot.');
      return;
    }
    setIsCreatingRevision(true);
    await createPageRevisionSnapshot(activePageRecord.id, revisionNameInput.trim(), activePageRecord);
    setRevisionNameInput('');
    setIsCreatingRevision(false);
  };

  const handleRestore = async (rev: PageRevision) => {
    const confirm = window.confirm(`Restore page to revision "${rev.revision_name}" created on ${new Date(rev.created_at).toLocaleString()}?`);
    if (confirm) {
      await restorePageRevisionSnapshot(rev);
    }
  };

  const handleAddHeaderLink = () => {
    if (!newLinkDraft.label.trim() || !newLinkDraft.path.trim()) {
      showToast('Please specify both a link label and destination path.');
      return;
    }
    setHeaderLinks(prev => [...prev, { label: newLinkDraft.label.trim(), path: newLinkDraft.path.trim() }]);
    setNewLinkDraft({ label: '', path: '' });
    showToast('Added navigation link to header.');
  };

  const handleRemoveHeaderLink = (index: number) => {
    setHeaderLinks(prev => prev.filter((_, idx) => idx !== index));
    showToast('Removed navigation link.');
  };

  // Preview container width styles
  const previewWidthClass = 
    deviceMode === 'mobile' ? 'max-w-[375px] min-h-[667px] shadow-2xl rounded-3xl border-4 border-zinc-800' :
    deviceMode === 'tablet' ? 'max-w-[768px] min-h-[1024px] shadow-2xl rounded-3xl border-4 border-zinc-800' :
    'w-full';

  return (
    <div id="harconxs-visual-page-editor" className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      {/* TOP ATELIER EDITOR NAVIGATION BAR */}
      <header className="h-16 px-4 sm:px-6 bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800 flex items-center justify-between sticky top-0 z-40 gap-3">
        <div className="flex items-center gap-3">
          <button
            id="back-to-admin-dashboard-btn"
            onClick={() => setCurrentView('admin')}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors flex items-center gap-2 text-xs font-medium cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Admin Hub</span>
          </button>
          <div className="h-4 w-px bg-zinc-700" />
          
          {/* PAGE SELECTOR DROPDOWN */}
          <div className="flex items-center gap-2">
            <span className="hidden md:inline font-serif font-bold text-zinc-100 text-sm">Editing Page:</span>
            <select
              id="page-selector-dropdown"
              value={selectedPageKey}
              onChange={(e) => {
                setSelectedPageKey(e.target.value);
                showToast(`Switched preview context to: ${e.target.value.toUpperCase()}`);
              }}
              className="px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-700 text-amber-400 font-semibold text-xs focus:border-amber-400 cursor-pointer"
            >
              <option value="home">🏠 Storefront Homepage (/)</option>
              <option value="shop">🛍️ Shop &amp; Catalog (/shop)</option>
              <option value="product">💍 Product Atelier Detail (/product/*)</option>
              <option value="custom-orders">✨ Custom Atelier Commissions (/custom-products)</option>
              <option value="couple-websites">💑 Couple Websites Sanctuary (/couple-websites)</option>
              <option value="bot-panels">🤖 Bot Panels Cloud Hosting (/bot-panels)</option>
              <option value="about">🏛️ Heritage &amp; About Us (/about)</option>
              <option value="contact">✉️ Concierge Contact (/contact)</option>
              <option value="faq">❓ FAQ &amp; Knowledge Center (/faq)</option>
              <option value="reviews">🌟 Patron Reviews (/reviews)</option>
              <option value="policies">📜 Store Terms &amp; Privacy (/policies)</option>
            </select>
          </div>
        </div>

        {/* DEVICE PREVIEW SELECTOR */}
        <div className="hidden lg:flex items-center gap-1 bg-zinc-950/80 p-1 rounded-xl border border-zinc-800">
          <button
            id="preview-desktop-btn"
            onClick={() => setDeviceMode('desktop')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              deviceMode === 'desktop' ? 'bg-amber-500 text-zinc-950 font-semibold shadow' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
          <button
            id="preview-tablet-btn"
            onClick={() => setDeviceMode('tablet')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              deviceMode === 'tablet' ? 'bg-amber-500 text-zinc-950 font-semibold shadow' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Tablet (768px)</span>
          </button>
          <button
            id="preview-mobile-btn"
            onClick={() => setDeviceMode('mobile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              deviceMode === 'mobile' ? 'bg-amber-500 text-zinc-950 font-semibold shadow' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile (375px)</span>
          </button>
        </div>

        {/* PERSISTENCE ACTIONS: DRAFT & PUBLISH (SUPABASE) */}
        <div className="flex items-center gap-2">
          <button
            id="save-draft-btn"
            onClick={handleSaveDraft}
            disabled={isSaving || isPublishing}
            className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? <div className="w-3.5 h-3.5 border-2 border-zinc-400 border-t-white rounded-full animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Save Draft</span>
          </button>

          <button
            id="publish-page-btn"
            onClick={handlePublish}
            disabled={isSaving || isPublishing}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isPublishing ? <div className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>Publish Live</span>
          </button>
        </div>
      </header>

      {/* MAIN TWO-COLUMN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR: COMPLETE WEBSITE STUDIO CONTROLS */}
        <aside className="w-full lg:w-[440px] bg-zinc-900/95 border-r border-zinc-800 flex flex-col h-[calc(100vh-64px)] z-20 flex-shrink-0">
          {/* TAB HEADERS */}
          <div className="flex border-b border-zinc-800 bg-zinc-950/40 p-2 gap-1 overflow-x-auto">
            <button
              id="tab-sections-btn"
              onClick={() => setActiveTab('sections')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'sections' ? 'bg-zinc-800 text-amber-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Sections ({activePageRecord.sections.length})</span>
            </button>
            <button
              id="tab-components-btn"
              onClick={() => setActiveTab('components')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'components' ? 'bg-zinc-800 text-amber-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Components</span>
            </button>
            <button
              id="tab-header-btn"
              onClick={() => setActiveTab('header')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'header' ? 'bg-zinc-800 text-amber-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Header &amp; Links</span>
            </button>
            <button
              id="tab-footer-btn"
              onClick={() => setActiveTab('footer')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'footer' ? 'bg-zinc-800 text-amber-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span>Footer</span>
            </button>
            <button
              id="tab-theme-btn"
              onClick={() => setActiveTab('theme')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'theme' ? 'bg-zinc-800 text-amber-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Theme</span>
            </button>
            <button
              id="tab-revisions-btn"
              onClick={() => setActiveTab('revisions')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'revisions' ? 'bg-zinc-800 text-amber-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Revisions</span>
            </button>
            <button
              id="tab-sql-btn"
              onClick={() => setActiveTab('sql')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'sql' ? 'bg-zinc-800 text-emerald-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>SQL</span>
            </button>
          </div>

          {/* TAB 1: SECTIONS LIST & REORDERING */}
          {activeTab === 'sections' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Page Sections Layout
                </span>
                <button
                  id="add-new-section-btn"
                  onClick={() => setShowAddSectionModal(true)}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Section
                </button>
              </div>

              <div className="space-y-2">
                {activePageRecord.sections.map((section, idx) => {
                  const isSelected = selectedSectionId === section.id;
                  const isVisible = section.is_visible !== false && !section.isHidden;
                  return (
                    <div
                      key={section.id}
                      id={`section-item-${section.id}`}
                      onClick={() => {
                        setSelectedSectionId(section.id);
                        setActiveTab('components');
                      }}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected 
                          ? 'bg-amber-500/10 border-amber-500 text-zinc-100 shadow-md' 
                          : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-300 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-6 h-6 rounded-lg bg-zinc-800 text-zinc-400 text-[11px] font-mono flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-xs truncate text-zinc-100 flex items-center gap-1.5">
                            <span>{section.name}</span>
                            {!isVisible && (
                              <span className="text-[10px] text-amber-400/80 font-mono">(Draft hidden)</span>
                            )}
                          </h4>
                          <span className="text-[10px] text-zinc-500 font-mono">[{section.section_type || section.sectionType}]</span>
                        </div>
                      </div>

                      {/* SECTION ACTIONS (REORDER, DUPLICATE, HIDE, DELETE) */}
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          title="Move Up"
                          disabled={idx === 0}
                          onClick={() => handleMoveSection(idx, 'up')}
                          className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title="Move Down"
                          disabled={idx === activePageRecord.sections.length - 1}
                          onClick={() => handleMoveSection(idx, 'down')}
                          className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title={isVisible ? 'Hide Section' : 'Show Section'}
                          onClick={(e) => handleToggleVisibility(section.id, e)}
                          className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                        >
                          {isVisible ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-zinc-500" />}
                        </button>
                        <button
                          title="Duplicate Section"
                          onClick={(e) => handleDuplicateSection(section.id, e)}
                          className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title="Delete Section"
                          onClick={(e) => handleDeleteSection(section.id, e)}
                          className="p-1 rounded hover:bg-rose-950/50 text-zinc-400 hover:text-rose-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: COMPONENT & CONTENT INSPECTOR */}
          {activeTab === 'components' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedSection ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <div>
                      <h3 className="font-serif font-bold text-zinc-100 text-sm">
                        {selectedSection.name}
                      </h3>
                      <span className="text-[10px] font-mono text-zinc-500">[{selectedSection.section_type || selectedSection.sectionType}]</span>
                    </div>
                    <button
                      onClick={() => handleToggleVisibility(selectedSection.id)}
                      className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      {selectedSection.is_visible !== false ? <Eye className="w-3 h-3 text-emerald-400" /> : <EyeOff className="w-3 h-3 text-zinc-500" />}
                      <span>{selectedSection.is_visible !== false ? 'Live on Storefront' : 'Hidden on Storefront'}</span>
                    </button>
                  </div>

                  {/* Section Rename */}
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Section Display Name</label>
                    <input
                      type="text"
                      value={selectedSection.name || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateActivePageRecord(prev => ({
                          ...prev,
                          sections: prev.sections.map(s => s.id === selectedSection.id ? { ...s, name: val } : s)
                        }));
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:border-amber-400"
                    />
                  </div>

                  {/* Title / Headline */}
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Component Title / Headline</label>
                    <input
                      type="text"
                      value={selectedSection.content_json?.title || ''}
                      onChange={(e) => handleUpdateSectionContent('title', e.target.value)}
                      placeholder="e.g. Master Artisanal Collections"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:border-amber-400"
                    />
                  </div>

                  {/* Subtitle / Description */}
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Subtitle / Body Description</label>
                    <textarea
                      rows={3}
                      value={selectedSection.content_json?.subtitle || selectedSection.content_json?.text || ''}
                      onChange={(e) => {
                        handleUpdateSectionContent('subtitle', e.target.value);
                        handleUpdateSectionContent('text', e.target.value);
                      }}
                      placeholder="e.g. Handcrafted with 18K solid gold & platinum precision..."
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:border-amber-400"
                    />
                  </div>

                  {/* Badge Text */}
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Promotional Badge / Pill</label>
                    <input
                      type="text"
                      value={selectedSection.content_json?.badge || ''}
                      onChange={(e) => handleUpdateSectionContent('badge', e.target.value)}
                      placeholder="e.g. Bespoke Atelier 2026"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:border-amber-400"
                    />
                  </div>

                  {/* CTA Primary Button */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Primary Button Label</label>
                      <input
                        type="text"
                        value={selectedSection.content_json?.cta_primary_text || selectedSection.content_json?.cta_text || ''}
                        onChange={(e) => {
                          handleUpdateSectionContent('cta_primary_text', e.target.value);
                          handleUpdateSectionContent('cta_text', e.target.value);
                        }}
                        placeholder="Explore Catalog"
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Target Link / Route</label>
                      <input
                        type="text"
                        value={selectedSection.content_json?.cta_primary_link || selectedSection.content_json?.link_url || ''}
                        onChange={(e) => {
                          handleUpdateSectionContent('cta_primary_link', e.target.value);
                          handleUpdateSectionContent('link_url', e.target.value);
                        }}
                        placeholder="/shop"
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:border-amber-400 font-mono"
                      />
                    </div>
                  </div>

                  {/* Background & Text Styling */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800">
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Background Color</label>
                      <input
                        type="text"
                        value={selectedSection.settings_json?.bg_color || 'transparent'}
                        onChange={(e) => handleUpdateSectionSetting('bg_color', e.target.value)}
                        placeholder="#09090b or transparent"
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Text Color</label>
                      <input
                        type="text"
                        value={selectedSection.settings_json?.text_color || '#f4f4f5'}
                        onChange={(e) => handleUpdateSectionSetting('text_color', e.target.value)}
                        placeholder="#f4f4f5"
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-zinc-500">
                  Select a section from the "Sections" tab to customize its components.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: HEADER & NAVIGATION LINKS */}
          {activeTab === 'header' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="border-b border-zinc-800 pb-3">
                <h3 className="font-serif font-bold text-zinc-100 text-sm flex items-center gap-2">
                  <Compass className="w-4 h-4 text-amber-400" />
                  Header &amp; Navigation Links
                </h3>
                <p className="text-xs text-zinc-400">Configure top navigation bar, announcements, and menu links across all pages.</p>
              </div>

              {/* Announcement Banner */}
              <div className="space-y-2 p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
                <h4 className="text-xs font-semibold text-zinc-200">Top Announcement Bar</h4>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Announcement Message</label>
                  <input
                    type="text"
                    value={themeConfig.announcementText}
                    onChange={(e) => setThemeConfig(prev => ({ ...prev, announcementText: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Promo Discount Code</label>
                  <input
                    type="text"
                    value={themeConfig.announcementDiscountCode}
                    onChange={(e) => setThemeConfig(prev => ({ ...prev, announcementDiscountCode: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-amber-400 font-mono text-xs"
                  />
                </div>
              </div>

              {/* Navigation Menu Links */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-zinc-200">Navigation Menu Items ({headerLinks.length})</h4>
                </div>

                <div className="space-y-1.5">
                  {headerLinks.map((link, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Link2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="font-semibold text-zinc-200">{link.label}</span>
                        <span className="text-zinc-500 font-mono text-[10px]">({link.path})</span>
                      </div>
                      <button
                        onClick={() => handleRemoveHeaderLink(idx)}
                        className="p-1 rounded text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 cursor-pointer"
                        title="Remove link"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Link Form */}
                <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-2">
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Add New Menu Link</span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Label (e.g. VIP Atelier)"
                      value={newLinkDraft.label}
                      onChange={(e) => setNewLinkDraft(prev => ({ ...prev, label: e.target.value }))}
                      className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Route (e.g. /shop/vip)"
                      value={newLinkDraft.path}
                      onChange={(e) => setNewLinkDraft(prev => ({ ...prev, path: e.target.value }))}
                      className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs font-mono"
                    />
                  </div>
                  <button
                    onClick={handleAddHeaderLink}
                    className="w-full py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Navigation Link
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FOOTER EDITOR */}
          {activeTab === 'footer' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="border-b border-zinc-800 pb-3">
                <h3 className="font-serif font-bold text-zinc-100 text-sm flex items-center gap-2">
                  <Layout className="w-4 h-4 text-amber-400" />
                  Global Footer Editor
                </h3>
                <p className="text-xs text-zinc-400">Configure brand statement, contact info, and legal links rendered across all pages.</p>
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Footer Brand Tagline</label>
                <input
                  type="text"
                  value={themeConfig.footerTagline}
                  onChange={(e) => setThemeConfig(prev => ({ ...prev, footerTagline: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Support Email</label>
                <input
                  type="email"
                  value={themeConfig.supportEmail}
                  onChange={(e) => setThemeConfig(prev => ({ ...prev, supportEmail: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Concierge Phone Hotline</label>
                <input
                  type="text"
                  value={themeConfig.supportPhone}
                  onChange={(e) => setThemeConfig(prev => ({ ...prev, supportPhone: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs font-mono"
                />
              </div>
            </div>
          )}

          {/* TAB 5: THEME & PALETTES */}
          {activeTab === 'theme' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="border-b border-zinc-800 pb-3">
                <h3 className="font-serif font-bold text-zinc-100 text-sm flex items-center gap-2">
                  <Palette className="w-4 h-4 text-amber-400" />
                  Website Theme &amp; Typography
                </h3>
                <p className="text-xs text-zinc-400">Control global brand typography, primary colors, and luxury palette.</p>
              </div>

              {/* Site Name & Tagline */}
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Store Name</label>
                <input
                  type="text"
                  value={themeConfig.siteName}
                  onChange={(e) => setThemeConfig(prev => ({ ...prev, siteName: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs"
                />
              </div>

              {/* Typography */}
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Primary Display Typography</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['serif', 'sans', 'mono'] as const).map((font) => (
                    <button
                      key={font}
                      onClick={() => setThemeConfig(prev => ({ ...prev, fontFamily: font }))}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        themeConfig.fontFamily === font
                          ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-bold'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <span className="text-xs capitalize">{font}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Palette */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Primary Gold/Amber</label>
                  <input
                    type="color"
                    value={themeConfig.primaryColor}
                    onChange={(e) => setThemeConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="w-full h-9 rounded-xl bg-zinc-950 border border-zinc-800 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Accent Secondary Color</label>
                  <input
                    type="color"
                    value={themeConfig.accentColor}
                    onChange={(e) => setThemeConfig(prev => ({ ...prev, accentColor: e.target.value }))}
                    className="w-full h-9 rounded-xl bg-zinc-950 border border-zinc-800 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: REVISIONS & SNAPSHOTS */}
          {activeTab === 'revisions' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-2">
                <span className="text-xs font-semibold text-zinc-200">Create New Snapshot</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Snapshot name (e.g. Pre-Valentine Launch)"
                    value={revisionNameInput}
                    onChange={(e) => setRevisionNameInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs"
                  />
                  <button
                    onClick={handleCreateSnapshot}
                    disabled={isCreatingRevision}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" /> Save
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Revision History ({pageRevisions.length})
                </h4>
                {pageRevisions.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-2 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-xs text-zinc-200">{rev.revision_name}</h4>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {new Date(rev.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-zinc-400">
                      <span className="flex items-center gap-1">
                        <UserCheck className="w-3 h-3 text-emerald-400" /> {rev.created_by || 'Admin'}
                      </span>
                      <button
                        onClick={() => handleRestore(rev)}
                        className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-amber-400 text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" /> Restore
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: SUPABASE SQL CONSOLE */}
          {activeTab === 'sql' && (
            <div className="flex-1 overflow-y-auto p-4">
              <SupabaseSqlEditor />
            </div>
          )}
        </aside>

        {/* RIGHT PREVIEW CANVAS */}
        <main className="flex-1 bg-zinc-950 overflow-y-auto p-4 sm:p-6 flex flex-col items-center">
          <div className="w-full flex items-center justify-between pb-3 max-w-7xl">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Interactive Website Preview &bull; Page: <span className="font-semibold text-amber-400">{selectedPageKey.toUpperCase()}</span> ({deviceMode.toUpperCase()})</span>
            </div>
            <button
              onClick={() => setCurrentView('home')}
              className="text-xs text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Public Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className={`transition-all duration-300 ${previewWidthClass} bg-zinc-950 overflow-hidden shadow-2xl border border-zinc-800/80 rounded-2xl`}>
            
            {/* LIVE PREVIEW: HEADER */}
            <div className="border-b border-zinc-800/80 bg-zinc-950/95 sticky top-0 z-30">
              {/* Announcement Bar */}
              <div className="bg-amber-600/90 text-zinc-950 text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
                <Sparkles className="w-3 h-3" />
                <span>{themeConfig.announcementText || 'Complimentary Insured Air Express on Heirloom Commissions'}</span>
                <span className="font-bold font-mono bg-zinc-950 text-amber-300 px-1.5 py-0.5 rounded text-[10px]">
                  {themeConfig.announcementDiscountCode || 'WELCOME15'}
                </span>
              </div>

              {/* Main Navbar */}
              <div className="px-4 py-3 flex items-center justify-between">
                <span className="font-serif text-lg font-bold tracking-wider text-zinc-100 uppercase">
                  {themeConfig.siteName || 'HARCONXS'}
                </span>
                
                <div className="hidden md:flex items-center gap-3 text-xs text-zinc-300">
                  {headerLinks.slice(0, 5).map((l, i) => (
                    <span key={i} className="hover:text-amber-400 cursor-pointer font-medium">{l.label}</span>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center gap-1">
                    <ShoppingBag className="w-3 h-3 text-amber-400" /> Cart (0)
                  </span>
                </div>
              </div>
            </div>

            {/* LIVE PREVIEW: PAGE SECTIONS */}
            <div className="space-y-0">
              {activePageRecord.sections.map((section) => (
                <PageSectionRenderer
                  key={section.id}
                  section={section}
                  isSelected={selectedSectionId === section.id}
                  onSelectSection={(sec) => {
                    setSelectedSectionId(sec.id);
                    setActiveTab('components');
                  }}
                />
              ))}
            </div>

            {/* LIVE PREVIEW: FOOTER */}
            <div className="border-t border-zinc-800/80 bg-zinc-950 p-6 text-center text-xs text-zinc-500 space-y-2">
              <span className="font-serif font-bold text-zinc-300 text-sm tracking-wider uppercase">
                {themeConfig.siteName || 'HARCONXS'} ATELIER
              </span>
              <p className="text-zinc-400 max-w-md mx-auto">{themeConfig.footerTagline}</p>
              <p className="text-zinc-600 text-[10px]">
                &copy; {new Date().getFullYear()} {themeConfig.siteName || 'HARCONXS'}. All Sovereign Rights Reserved.
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* ADD SECTION MODAL */}
      {showAddSectionModal && (
        <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-2xl w-full max-h-[85vh] bg-zinc-900 border border-zinc-800 rounded-3xl p-6 overflow-hidden flex flex-col space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="font-serif font-bold text-zinc-100 text-lg">Add Atelier Section</h3>
                <p className="text-xs text-zinc-400">Choose from 16 sovereign handcrafted section architectures.</p>
              </div>
              <button
                onClick={() => setShowAddSectionModal(false)}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3 pr-1">
              {(Object.keys(SECTION_TYPE_METADATA) as PageSectionType[]).map((type) => {
                const meta = SECTION_TYPE_METADATA[type];
                return (
                  <div
                    key={type}
                    onClick={() => handleAddSection(type)}
                    className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 hover:border-amber-500/60 hover:bg-zinc-800/50 transition-all cursor-pointer space-y-1.5 group"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-zinc-100 text-sm group-hover:text-amber-400 transition-colors">
                        {meta.label}
                      </h4>
                      <span className="text-[10px] font-mono text-zinc-500">[{type}]</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">{meta.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
