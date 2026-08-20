import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { PageSection, PageRecord, PageRevision, PageSectionType } from '../../types';
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
  Layout
} from 'lucide-react';
import { SECTION_TYPE_METADATA } from '../../data/defaultPageData';

type DeviceMode = 'desktop' | 'tablet' | 'mobile';
type EditorTab = 'sections' | 'style' | 'revisions' | 'sql';

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
    isLoadingPageConfig,
    isAdminAuthenticated,
    setIsAdminLoginModalOpen,
    setCurrentView,
    currentUser,
    showToast
  } = useStore();

  // Local Editor State
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [activeTab, setActiveTab] = useState<EditorTab>('sections');
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [revisionNameInput, setRevisionNameInput] = useState('');
  const [isCreatingRevision, setIsCreatingRevision] = useState(false);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);

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

  // Selected section object
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
            <h1 className="text-2xl font-serif font-bold text-zinc-100">HARCONXS Atelier Editor</h1>
            <p className="text-xs text-zinc-400 leading-relaxed">
              This private visual site management console is restricted to authenticated administrators with verified Supabase RBAC permissions.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-3">
            <button
              id="editor-login-btn"
              onClick={() => setIsAdminLoginModalOpen(true)}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Authenticate with Supabase</span>
            </button>
            <button
              onClick={() => setCurrentView('home')}
              className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-xs transition-colors"
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
      // Re-index sort_order
      const reindexed = newSections.map((sec, idx) => ({ ...sec, sort_order: idx }));
      return { ...prev, sections: reindexed };
    });
  };

  const handleToggleVisibility = (sectionId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    updateActivePageRecord(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === sectionId ? { ...s, is_visible: !s.is_visible } : s)
    }));
  };

  const handleDuplicateSection = (sectionId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const secToDuplicate = activePageRecord.sections.find(s => s.id === sectionId);
    if (!secToDuplicate) return;

    const newId = `sec_${secToDuplicate.section_type}_${Date.now()}`;
    const duplicatedSection: PageSection = {
      ...secToDuplicate,
      id: newId,
      name: `${secToDuplicate.name} (Copy)`,
      sort_order: secToDuplicate.sort_order + 1
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
    setIsSaving(false);
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    await publishPage(activePageRecord);
    setIsPublishing(false);
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

  // Preview container width styles
  const previewWidthClass = 
    deviceMode === 'mobile' ? 'max-w-[375px] min-h-[667px] shadow-2xl rounded-3xl border-4 border-zinc-800' :
    deviceMode === 'tablet' ? 'max-w-[768px] min-h-[1024px] shadow-2xl rounded-3xl border-4 border-zinc-800' :
    'w-full';

  return (
    <div id="harconxs-visual-page-editor" className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      {/* TOP ATELIER EDITOR NAVIGATION BAR */}
      <header className="h-16 px-6 bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button
            id="back-to-admin-dashboard-btn"
            onClick={() => setCurrentView('admin')}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors flex items-center gap-2 text-xs font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Admin Hub</span>
          </button>
          <div className="h-4 w-px bg-zinc-700" />
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-zinc-100 text-base">HARCONXS Page Studio</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
              activePageRecord.status === 'published' 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
            }`}>
              {activePageRecord.status}
            </span>
          </div>
        </div>

        {/* DEVICE PREVIEW SELECTOR */}
        <div className="hidden md:flex items-center gap-1 bg-zinc-950/80 p-1 rounded-xl border border-zinc-800">
          <button
            id="preview-desktop-btn"
            onClick={() => setDeviceMode('desktop')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              deviceMode === 'desktop' ? 'bg-amber-500 text-zinc-950 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
          <button
            id="preview-tablet-btn"
            onClick={() => setDeviceMode('tablet')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              deviceMode === 'tablet' ? 'bg-amber-500 text-zinc-950 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Tablet (768px)</span>
          </button>
          <button
            id="preview-mobile-btn"
            onClick={() => setDeviceMode('mobile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              deviceMode === 'mobile' ? 'bg-amber-500 text-zinc-950 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile (375px)</span>
          </button>
        </div>

        {/* PERSISTENCE ACTIONS: DRAFT & PUBLISH (SUPABASE) */}
        <div className="flex items-center gap-3">
          <button
            id="save-draft-btn"
            onClick={handleSaveDraft}
            disabled={isSaving || isPublishing}
            className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <div className="w-3.5 h-3.5 border-2 border-zinc-400 border-t-white rounded-full animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Draft</span>
          </button>

          <button
            id="publish-page-btn"
            onClick={handlePublish}
            disabled={isSaving || isPublishing}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isPublishing ? <div className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>Publish Live</span>
          </button>
        </div>
      </header>

      {/* MAIN TWO-COLUMN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR: SECTIONS MANAGER & EDITORS */}
        <aside className="w-full lg:w-[420px] bg-zinc-900/95 border-r border-zinc-800 flex flex-col h-[calc(100vh-64px)] z-20 flex-shrink-0">
          {/* TAB HEADERS */}
          <div className="flex border-b border-zinc-800 bg-zinc-950/40 p-2 gap-1">
            <button
              id="tab-sections-btn"
              onClick={() => setActiveTab('sections')}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'sections' ? 'bg-zinc-800 text-amber-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Sections ({activePageRecord.sections.length})</span>
            </button>
            <button
              id="tab-style-btn"
              onClick={() => setActiveTab('style')}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'style' ? 'bg-zinc-800 text-amber-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Edit Content</span>
            </button>
            <button
              id="tab-revisions-btn"
              onClick={() => setActiveTab('revisions')}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'revisions' ? 'bg-zinc-800 text-amber-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Revisions</span>
            </button>
            <button
              id="tab-sql-btn"
              onClick={() => setActiveTab('sql')}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
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
                  Page Layout Structure
                </span>
                <button
                  id="add-new-section-btn"
                  onClick={() => setShowAddSectionModal(true)}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Section
                </button>
              </div>

              <div className="space-y-2">
                {activePageRecord.sections.map((section, idx) => {
                  const isSelected = selectedSectionId === section.id;
                  return (
                    <div
                      key={section.id}
                      id={`section-item-${section.id}`}
                      onClick={() => {
                        setSelectedSectionId(section.id);
                        setActiveTab('style');
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
                          <h4 className="font-semibold text-xs truncate text-zinc-100">{section.name}</h4>
                          <span className="text-[10px] text-zinc-500 font-mono">[{section.section_type}]</span>
                        </div>
                      </div>

                      {/* SECTION ACTIONS (REORDER, DUPLICATE, HIDE, DELETE) */}
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          title="Move Up"
                          disabled={idx === 0}
                          onClick={() => handleMoveSection(idx, 'up')}
                          className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 disabled:opacity-30"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title="Move Down"
                          disabled={idx === activePageRecord.sections.length - 1}
                          onClick={() => handleMoveSection(idx, 'down')}
                          className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 disabled:opacity-30"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title={section.is_visible ? 'Hide Section' : 'Show Section'}
                          onClick={(e) => handleToggleVisibility(section.id, e)}
                          className={`p-1 rounded hover:bg-zinc-800 ${section.is_visible ? 'text-zinc-400 hover:text-zinc-200' : 'text-amber-500'}`}
                        >
                          {section.is_visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          title="Duplicate Section"
                          onClick={(e) => handleDuplicateSection(section.id, e)}
                          className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title="Delete Section"
                          onClick={(e) => handleDeleteSection(section.id, e)}
                          className="p-1 rounded hover:bg-rose-500/20 text-zinc-500 hover:text-rose-400"
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

          {/* TAB 2: EDIT SECTION CONTENT & APPEARANCE */}
          {activeTab === 'style' && selectedSection && (
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div>
                  <h3 className="font-semibold text-zinc-100 text-sm">{selectedSection.name}</h3>
                  <span className="text-[11px] text-amber-400 font-mono">[{selectedSection.section_type}]</span>
                </div>
                <button
                  onClick={() => handleToggleVisibility(selectedSection.id)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 flex items-center gap-1"
                >
                  {selectedSection.is_visible ? <Eye className="w-3 h-3 text-emerald-400" /> : <EyeOff className="w-3 h-3 text-amber-400" />}
                  <span>{selectedSection.is_visible ? 'Visible' : 'Hidden'}</span>
                </button>
              </div>

              {/* SECTION NAME */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Section Label in Studio</label>
                <input
                  type="text"
                  value={selectedSection.name}
                  onChange={(e) => {
                    const newName = e.target.value;
                    updateActivePageRecord(prev => ({
                      ...prev,
                      sections: prev.sections.map(s => s.id === selectedSection.id ? { ...s, name: newName } : s)
                    }));
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* DYNAMIC CONTENT FIELDS */}
              {selectedSection.content_json?.badge !== undefined && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400">Badge / Eyebrow Tag</label>
                  <input
                    type="text"
                    value={selectedSection.content_json.badge || ''}
                    onChange={(e) => handleUpdateSectionContent('badge', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}

              {selectedSection.content_json?.title !== undefined && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400">Heading Title</label>
                  <input
                    type="text"
                    value={selectedSection.content_json.title || ''}
                    onChange={(e) => handleUpdateSectionContent('title', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}

              {selectedSection.content_json?.subtitle !== undefined && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400">Subtitle / Description</label>
                  <textarea
                    rows={3}
                    value={selectedSection.content_json.subtitle || ''}
                    onChange={(e) => handleUpdateSectionContent('subtitle', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>
              )}

              {selectedSection.content_json?.text !== undefined && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400">Announcement Text</label>
                  <input
                    type="text"
                    value={selectedSection.content_json.text || ''}
                    onChange={(e) => handleUpdateSectionContent('text', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}

              {selectedSection.content_json?.cta_primary_text !== undefined && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400">Primary Button Text</label>
                  <input
                    type="text"
                    value={selectedSection.content_json.cta_primary_text || ''}
                    onChange={(e) => handleUpdateSectionContent('cta_primary_text', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}

              {selectedSection.content_json?.cta_text !== undefined && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400">Action Button Text</label>
                  <input
                    type="text"
                    value={selectedSection.content_json.cta_text || ''}
                    onChange={(e) => handleUpdateSectionContent('cta_text', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}

              {/* STYLING & COLORS */}
              <div className="pt-4 border-t border-zinc-800 space-y-3">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Appearance</span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-400">Background Color</label>
                    <input
                      type="text"
                      value={selectedSection.settings_json?.bg_color || ''}
                      onChange={(e) => handleUpdateSectionSetting('bg_color', e.target.value)}
                      placeholder="#09090b"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-400">Text Color</label>
                    <input
                      type="text"
                      value={selectedSection.settings_json?.text_color || ''}
                      onChange={(e) => handleUpdateSectionSetting('text_color', e.target.value)}
                      placeholder="#f4f4f5"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REVISIONS & SNAPSHOT HISTORY */}
          {activeTab === 'revisions' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Create New Snapshot</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={revisionNameInput}
                    onChange={(e) => setRevisionNameInput(e.target.value)}
                    placeholder="e.g., Summer Royal Campaign Drop"
                    className="flex-1 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={handleCreateSnapshot}
                    disabled={isCreatingRevision || !revisionNameInput.trim()}
                    className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-all disabled:opacity-50"
                  >
                    Save
                  </button>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Revision History ({pageRevisions.length})
                </span>

                {pageRevisions.length === 0 ? (
                  <p className="text-xs text-zinc-500 italic">No snapshots yet. Publish or save a snapshot to create one.</p>
                ) : (
                  <div className="space-y-2">
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
                            className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-amber-400 text-[11px] font-semibold transition-colors flex items-center gap-1"
                          >
                            <RotateCcw className="w-3 h-3" /> Restore
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: SUPABASE SQL CONSOLE */}
          {activeTab === 'sql' && (
            <div className="flex-1 overflow-y-auto p-4">
              <SupabaseSqlEditor />
            </div>
          )}
        </aside>

        {/* RIGHT PREVIEW CANVAS */}
        <main className="flex-1 bg-zinc-950 overflow-y-auto p-4 sm:p-8 flex flex-col items-center">
          <div className="w-full flex items-center justify-between pb-4 max-w-7xl">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Visual Studio Canvas ({deviceMode.toUpperCase()})</span>
            </div>
            <button
              onClick={() => setCurrentView('home')}
              className="text-xs text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>View Public Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className={`transition-all duration-300 ${previewWidthClass} bg-zinc-950 overflow-hidden shadow-2xl border border-zinc-800/80`}>
            {activePageRecord.sections.map((section) => (
              <PageSectionRenderer
                key={section.id}
                section={section}
                isSelected={selectedSectionId === section.id}
                onSelectSection={(sec) => {
                  setSelectedSectionId(sec.id);
                  setActiveTab('style');
                }}
              />
            ))}
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
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200"
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
