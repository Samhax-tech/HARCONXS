import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { PageSection, PageRecord, PageRevision, PageSectionType } from '../../types';
import { PageSectionRenderer } from './PageSectionRenderer';
import { PreviewCanvas, DeviceMode } from './editor/PreviewCanvas';
import { SectionInspector } from './editor/SectionInspector';
import { AddSectionModal } from './editor/AddSectionModal';
import { RevisionsModal } from './editor/RevisionsModal';
import { PageSeoModal } from './editor/PageSeoModal';
import { CreatePageModal } from './editor/CreatePageModal';
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
  Globe,
  Sliders,
  FileText,
  ExternalLink,
  ChevronRight,
  GripVertical,
  Maximize2
} from 'lucide-react';
import { SECTION_TYPE_METADATA } from '../../data/defaultPageData';

type LeftSidebarTab = 'pages' | 'sections';

export const VisualPageEditor: React.FC = () => {
  const {
    allPages,
    fetchAllPagesList,
    createPage,
    updatePageMetadata,
    duplicatePage,
    deletePage,
    activePageRecord,
    setActivePageRecord,
    updateActivePageRecord,
    savePageDraft,
    publishPage,
    pageRevisions,
    fetchPageRevisionsList,
    createPageRevisionSnapshot,
    restorePageRevisionSnapshot,
    deletePageSectionItem,
    refetchPageConfig,
    isAdminAuthenticated,
    setIsAdminLoginModalOpen,
    setCurrentView,
    showToast
  } = useStore();

  // Layout & Navigation State
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [leftTab, setLeftTab] = useState<LeftSidebarTab>('sections');
  const [isPreviewOnly, setIsPreviewOnly] = useState<boolean>(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  // Modals
  const [showAddSectionModal, setShowAddSectionModal] = useState<boolean>(false);
  const [showRevisionsModal, setShowRevisionsModal] = useState<boolean>(false);
  const [showSeoModal, setShowSeoModal] = useState<boolean>(false);
  const [showCreatePageModal, setShowCreatePageModal] = useState<boolean>(false);

  // Persistence Loading State
  const [isSavingDraft, setIsSavingDraft] = useState<boolean>(false);
  const [isPublishingLive, setIsPublishingLive] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  // Drag and Drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Initialize pages list and active section on mount
  useEffect(() => {
    fetchAllPagesList();
  }, []);

  useEffect(() => {
    if (activePageRecord?.sections?.length > 0 && !selectedSectionId) {
      setSelectedSectionId(activePageRecord.sections[0].id);
    }
  }, [activePageRecord, selectedSectionId]);

  useEffect(() => {
    if (activePageRecord?.id) {
      fetchPageRevisionsList(activePageRecord.id);
    }
  }, [activePageRecord?.id]);

  const selectedSection = activePageRecord?.sections?.find(s => s.id === selectedSectionId) || null;

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
              className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs transition-colors cursor-pointer"
            >
              Return to Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Section Operations
  const handleAddSection = (sectionType: PageSectionType) => {
    const meta = (SECTION_TYPE_METADATA as any)[sectionType] || {
      label: sectionType,
      defaultContent: {}
    };

    const newSection: PageSection = {
      id: `sec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      pageId: activePageRecord.id,
      sectionType,
      sortOrder: activePageRecord.sections.length,
      isHidden: false,
      settings: {
        paddingTop: 'lg',
        paddingBottom: 'lg',
        backgroundColor: '#09090b',
        textColor: '#fafafa',
        containerWidth: 'wide'
      },
      content: { ...meta.defaultContent }
    };

    updateActivePageRecord(prev => ({
      ...prev,
      sections: [...prev.sections, newSection],
      updatedAt: new Date().toISOString()
    }));

    setSelectedSectionId(newSection.id);
    setHasUnsavedChanges(true);
    showToast(`Added ${meta.label || sectionType} section.`);
  };

  const handleUpdateSection = (updatedSection: PageSection) => {
    updateActivePageRecord(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === updatedSection.id ? updatedSection : s),
      updatedAt: new Date().toISOString()
    }));
    setHasUnsavedChanges(true);
  };

  const handleDuplicateSection = (section: PageSection) => {
    const duplicated: PageSection = {
      ...section,
      id: `sec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      sortOrder: section.sortOrder + 1,
      content: JSON.parse(JSON.stringify(section.content || {})),
      settings: JSON.parse(JSON.stringify(section.settings || {}))
    };

    const curIndex = activePageRecord.sections.findIndex(s => s.id === section.id);
    const updatedSections = [...activePageRecord.sections];
    updatedSections.splice(curIndex + 1, 0, duplicated);

    updateActivePageRecord(prev => ({
      ...prev,
      sections: updatedSections.map((sec, idx) => ({ ...sec, sortOrder: idx })),
      updatedAt: new Date().toISOString()
    }));

    setSelectedSectionId(duplicated.id);
    setHasUnsavedChanges(true);
    showToast('Section duplicated.');
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!window.confirm('Are you sure you want to remove this section?')) return;
    await deletePageSectionItem(sectionId);
    if (selectedSectionId === sectionId) {
      const remaining = activePageRecord.sections.filter(s => s.id !== sectionId);
      setSelectedSectionId(remaining.length > 0 ? remaining[0].id : null);
    }
    setHasUnsavedChanges(true);
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= activePageRecord.sections.length) return;

    const updatedSections = [...activePageRecord.sections];
    const [moved] = updatedSections.splice(index, 1);
    updatedSections.splice(targetIndex, 0, moved);

    updateActivePageRecord(prev => ({
      ...prev,
      sections: updatedSections.map((sec, idx) => ({ ...sec, sortOrder: idx })),
      updatedAt: new Date().toISOString()
    }));
    setHasUnsavedChanges(true);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const updated = [...activePageRecord.sections];
    const [moved] = updated.splice(draggedIndex, 1);
    updated.splice(index, 0, moved);

    setDraggedIndex(index);
    updateActivePageRecord(prev => ({
      ...prev,
      sections: updated.map((sec, idx) => ({ ...sec, sortOrder: idx }))
    }));
    setHasUnsavedChanges(true);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Page Operations
  const handleSelectPage = async (page: PageRecord) => {
    if (hasUnsavedChanges) {
      if (!window.confirm('You have unsaved changes. Switch page anyway?')) return;
    }
    await refetchPageConfig(page.id || page.slug);
    setSelectedSectionId(null);
    setHasUnsavedChanges(false);
  };

  const handleDuplicatePage = async (page: PageRecord) => {
    const newTitle = prompt('Enter title for duplicated page:', `${page.title} (Copy)`);
    if (!newTitle) return;
    const newSlug = prompt('Enter URL slug:', `${page.slug}-copy`);
    if (!newSlug) return;

    await duplicatePage(page.id, newTitle.trim(), newSlug.trim().toLowerCase());
  };

  const handleDeletePage = async (page: PageRecord) => {
    if (page.slug === 'home' || page.id === 'page_home') {
      alert('The primary Home storefront page cannot be deleted.');
      return;
    }
    if (!window.confirm(`Are you sure you want to permanently delete page "${page.title}"?`)) {
      return;
    }
    await deletePage(page.id);
  };

  // Persistence Actions
  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    try {
      const res = await savePageDraft(activePageRecord);
      if (res.success) {
        setHasUnsavedChanges(false);
      }
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handlePublishLive = async () => {
    setIsPublishingLive(true);
    try {
      const res = await publishPage(activePageRecord);
      if (res.success) {
        setHasUnsavedChanges(false);
      }
    } finally {
      setIsPublishingLive(false);
    }
  };

  return (
    <div id="visual-page-editor-container" className="h-screen w-screen bg-zinc-950 text-zinc-100 flex flex-col overflow-hidden select-none">
      {/* ================================================================ */}
      {/* 1. TOP TOOLBAR */}
      {/* ================================================================ */}
      <header id="editor-top-toolbar" className="h-14 bg-zinc-950 border-b border-zinc-800/90 px-4 flex items-center justify-between gap-4 shrink-0 z-30">
        {/* Left: Brand & Page Switcher */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('admin')}
            title="Back to Admin Dashboard"
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="h-4 w-[1px] bg-zinc-800" />

          {/* Active Page Selector */}
          <div className="flex items-center gap-2">
            <select
              value={activePageRecord.id}
              onChange={(e) => {
                const target = allPages.find(p => p.id === e.target.value);
                if (target) handleSelectPage(target);
              }}
              className="bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-400 cursor-pointer max-w-[200px] truncate"
            >
              {allPages.map(page => (
                <option key={page.id} value={page.id}>
                  {page.title} (/{page.slug})
                </option>
              ))}
            </select>

            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold border ${
              activePageRecord.status === 'published'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}>
              {activePageRecord.status || 'draft'}
            </span>

            {hasUnsavedChanges && (
              <span className="text-[11px] text-amber-400/90 italic animate-pulse">
                • Unsaved edits
              </span>
            )}
          </div>
        </div>

        {/* Center: Device Viewport Switcher & Clean Preview Toggle */}
        <div className="flex items-center gap-1 bg-zinc-900/80 p-1 rounded-xl border border-zinc-800/80">
          <button
            onClick={() => setDeviceMode('desktop')}
            title="Desktop Mode (1440px reference)"
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              deviceMode === 'desktop'
                ? 'bg-zinc-800 text-amber-400 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeviceMode('tablet')}
            title="Tablet Mode (768px reference)"
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              deviceMode === 'tablet'
                ? 'bg-zinc-800 text-amber-400 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeviceMode('mobile')}
            title="Mobile Mode (375px reference)"
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              deviceMode === 'mobile'
                ? 'bg-zinc-800 text-amber-400 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
          </button>

          <div className="h-3.5 w-[1px] bg-zinc-800 mx-0.5" />

          <button
            onClick={() => setIsPreviewOnly(!isPreviewOnly)}
            title={isPreviewOnly ? 'Exit Pure Preview' : 'Pure Preview (Hide Outlines)'}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              isPreviewOnly
                ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isPreviewOnly ? 'Editing' : 'Preview'}</span>
          </button>
        </div>

        {/* Right: Modals & Real Persistence Actions */}
        <div className="flex items-center gap-2">
          {/* Revisions Button */}
          <button
            onClick={() => setShowRevisionsModal(true)}
            title="Revision Snapshots & History"
            className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Revisions ({pageRevisions.length})</span>
          </button>

          {/* Page SEO / Settings Button */}
          <button
            onClick={() => setShowSeoModal(true)}
            title="Page SEO & Metadata"
            className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Page SEO</span>
          </button>

          <div className="h-4 w-[1px] bg-zinc-800" />

          {/* Save Draft Button */}
          <button
            disabled={isSavingDraft}
            onClick={handleSaveDraft}
            className="px-4 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSavingDraft ? 'Saving...' : 'Save Draft'}</span>
          </button>

          {/* Publish Live Button */}
          <button
            disabled={isPublishingLive}
            onClick={handlePublishLive}
            className="px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isPublishingLive ? 'Publishing...' : 'Publish Live'}</span>
          </button>
        </div>
      </header>

      {/* ================================================================ */}
      {/* 2. MAIN WORKSPACE (LEFT TREE | CENTER CANVAS | RIGHT INSPECTOR) */}
      {/* ================================================================ */}
      <div className="flex-1 flex overflow-hidden">
        {/* -------------------------------------------------------------- */}
        {/* LEFT SIDEBAR: Pages / Sections Tree */}
        {/* -------------------------------------------------------------- */}
        {!isPreviewOnly && (
          <aside className="w-72 bg-zinc-950 border-r border-zinc-800/80 flex flex-col shrink-0">
            {/* Tab Selector */}
            <div className="p-3 border-b border-zinc-800/80 grid grid-cols-2 gap-1.5 shrink-0">
              <button
                onClick={() => setLeftTab('sections')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  leftTab === 'sections'
                    ? 'bg-zinc-800 text-amber-400 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Sections</span>
              </button>
              <button
                onClick={() => setLeftTab('pages')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  leftTab === 'pages'
                    ? 'bg-zinc-800 text-amber-400 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Pages</span>
              </button>
            </div>

            {/* SECTIONS TREE TAB */}
            {leftTab === 'sections' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-3 border-b border-zinc-800/80 flex items-center justify-between shrink-0">
                  <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                    {activePageRecord.sections.length} Sections
                  </span>
                  <button
                    onClick={() => setShowAddSectionModal(true)}
                    className="px-2.5 py-1 rounded-lg bg-amber-400 text-zinc-950 font-bold text-xs hover:bg-amber-300 transition-colors flex items-center gap-1 cursor-pointer shadow-sm shadow-amber-500/20"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Section</span>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
                  {activePageRecord.sections.map((section, idx) => {
                    const isSelected = section.id === selectedSectionId;
                    const meta = (SECTION_TYPE_METADATA as any)[section.sectionType] || { label: section.sectionType };

                    return (
                      <div
                        key={section.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, idx)}
                        onDragOver={(e) => handleDragOver(e, idx)}
                        onDragEnd={handleDragEnd}
                        onClick={() => setSelectedSectionId(section.id)}
                        className={`group p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500/50 text-amber-300 shadow-sm'
                            : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900'
                        } ${section.isHidden ? 'opacity-50' : ''}`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <GripVertical className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 shrink-0 cursor-grab" />
                          <div className="min-w-0">
                            <h4 className="text-xs font-semibold truncate">
                              {meta.label || section.sectionType}
                            </h4>
                            <span className="text-[10px] text-zinc-500 font-mono block truncate">
                              {section.sectionType}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            title="Move Up"
                            disabled={idx === 0}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveSection(idx, 'up');
                            }}
                            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 disabled:opacity-30 cursor-pointer"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            title="Move Down"
                            disabled={idx === activePageRecord.sections.length - 1}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveSection(idx, 'down');
                            }}
                            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 disabled:opacity-30 cursor-pointer"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            title={section.isHidden ? 'Unhide' : 'Hide'}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateSection({ ...section, isHidden: !section.isHidden });
                            }}
                            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                          >
                            {section.isHidden ? <EyeOff className="w-3.5 h-3.5 text-rose-400" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {activePageRecord.sections.length === 0 && (
                    <div className="py-12 text-center text-zinc-500 space-y-3 p-4">
                      <Layers className="w-8 h-8 mx-auto text-zinc-600 opacity-60" />
                      <p className="text-xs">No sections added yet.</p>
                      <button
                        onClick={() => setShowAddSectionModal(true)}
                        className="px-3 py-1.5 rounded-xl bg-amber-400 text-zinc-950 font-bold text-xs"
                      >
                        + Add First Section
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PAGES LIST TAB */}
            {leftTab === 'pages' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-3 border-b border-zinc-800/80 flex items-center justify-between shrink-0">
                  <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                    {allPages.length} Dynamic Pages
                  </span>
                  <button
                    onClick={() => setShowCreatePageModal(true)}
                    className="px-2.5 py-1 rounded-lg bg-amber-400 text-zinc-950 font-bold text-xs hover:bg-amber-300 transition-colors flex items-center gap-1 cursor-pointer shadow-sm shadow-amber-500/20"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Page</span>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
                  {allPages.map((page) => {
                    const isActive = page.id === activePageRecord.id;

                    return (
                      <div
                        key={page.id}
                        onClick={() => handleSelectPage(page)}
                        className={`group p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                          isActive
                            ? 'bg-amber-500/10 border-amber-500/50 text-amber-300 shadow-sm'
                            : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-semibold truncate">{page.title}</h4>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 uppercase">
                              {page.status}
                            </span>
                          </div>
                          <span className="text-[11px] text-zinc-500 font-mono block truncate mt-0.5">
                            /{page.slug}
                          </span>
                        </div>

                        {/* Page Quick Actions */}
                        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            title="Duplicate Page"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicatePage(page);
                            }}
                            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          {page.slug !== 'home' && page.id !== 'page_home' && (
                            <button
                              title="Delete Page"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePage(page);
                              }}
                              className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </aside>
        )}

        {/* -------------------------------------------------------------- */}
        {/* CENTER: Isolated Preview Canvas (1440px / 768px / 375px) */}
        {/* -------------------------------------------------------------- */}
        <PreviewCanvas
          pageRecord={activePageRecord}
          selectedSectionId={selectedSectionId}
          onSelectSection={(sec) => {
            if (!isPreviewOnly) {
              setSelectedSectionId(sec.id);
            }
          }}
          isPreviewOnly={isPreviewOnly}
          deviceMode={deviceMode}
          onChangeDeviceMode={setDeviceMode}
          onAddFirstSection={() => setShowAddSectionModal(true)}
        />

        {/* -------------------------------------------------------------- */}
        {/* RIGHT SIDEBAR: Inspector Panel */}
        {/* -------------------------------------------------------------- */}
        {!isPreviewOnly && (
          <aside className="w-80 bg-zinc-950 shrink-0">
            <SectionInspector
              section={selectedSection}
              onUpdateSection={handleUpdateSection}
              onDuplicateSection={handleDuplicateSection}
              onDeleteSection={handleDeleteSection}
            />
          </aside>
        )}
      </div>

      {/* ================================================================ */}
      {/* 3. MODALS */}
      {/* ================================================================ */}
      <AddSectionModal
        isOpen={showAddSectionModal}
        onClose={() => setShowAddSectionModal(false)}
        onAddSection={handleAddSection}
      />

      <RevisionsModal
        isOpen={showRevisionsModal}
        onClose={() => setShowRevisionsModal(false)}
        pageRecord={activePageRecord}
        revisions={pageRevisions}
        onCreateSnapshot={async (name) => {
          return await createPageRevisionSnapshot(activePageRecord.id, name, activePageRecord);
        }}
        onRestoreSnapshot={async (rev) => {
          return await restorePageRevisionSnapshot(rev);
        }}
      />

      <PageSeoModal
        isOpen={showSeoModal}
        onClose={() => setShowSeoModal(false)}
        pageRecord={activePageRecord}
        onUpdateMetadata={async (updates) => {
          await updatePageMetadata(activePageRecord.id, updates);
        }}
      />

      <CreatePageModal
        isOpen={showCreatePageModal}
        onClose={() => setShowCreatePageModal(false)}
        onCreatePage={async (pageData) => {
          await createPage(pageData);
        }}
      />
    </div>
  );
};
