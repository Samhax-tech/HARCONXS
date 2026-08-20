import React, { useState } from 'react';
import { PageSection } from '../../../types';
import { SECTION_TYPE_METADATA } from '../../../data/defaultPageData';
import { 
  Type, 
  Palette, 
  Layout, 
  Smartphone, 
  Sliders, 
  Trash2, 
  Copy, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ChevronRight,
  Plus,
  X
} from 'lucide-react';

interface SectionInspectorProps {
  section: PageSection | null;
  onUpdateSection: (updated: PageSection) => void;
  onDuplicateSection: (section: PageSection) => void;
  onDeleteSection: (sectionId: string) => void;
  onClose?: () => void;
}

type InspectorTab = 'content' | 'typography' | 'styling' | 'spacing' | 'responsive';

export const SectionInspector: React.FC<SectionInspectorProps> = ({
  section,
  onUpdateSection,
  onDuplicateSection,
  onDeleteSection,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<InspectorTab>('content');

  if (!section) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center text-zinc-500">
        <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-3 text-zinc-400">
          <Sliders className="w-6 h-6" />
        </div>
        <p className="text-sm font-medium text-zinc-300">No Section Selected</p>
        <p className="text-xs text-zinc-500 max-w-xs mt-1">
          Select any section on the canvas or left tree to inspect and adjust its content, styling, typography, and responsive rules.
        </p>
      </div>
    );
  }

  const meta = (SECTION_TYPE_METADATA as any)[section.sectionType] || {
    label: section.sectionType,
    category: 'custom',
    description: 'Custom site block'
  };

  const content = section.content || {};
  const settings = section.settings || {};

  const handleContentChange = (key: string, value: any) => {
    onUpdateSection({
      ...section,
      content: {
        ...content,
        [key]: value
      }
    });
  };

  const handleSettingsChange = (key: string, value: any) => {
    onUpdateSection({
      ...section,
      settings: {
        ...settings,
        [key]: value
      }
    });
  };

  const toggleHidden = () => {
    onUpdateSection({
      ...section,
      isHidden: !section.isHidden
    });
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-zinc-200 border-l border-zinc-800/80">
      {/* Top Header */}
      <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-xs text-zinc-100 truncate">
              {meta.label || section.sectionType}
            </h3>
            <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider block truncate">
              ID: {section.id.slice(0, 14)}...
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            title={section.isHidden ? 'Show Section' : 'Hide Section'}
            onClick={toggleHidden}
            className={`p-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
              section.isHidden
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {section.isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
          <button
            title="Duplicate Section"
            onClick={() => onDuplicateSection(section)}
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs cursor-pointer transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            title="Delete Section"
            onClick={() => onDeleteSection(section.id)}
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-rose-400 text-xs cursor-pointer transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs cursor-pointer ml-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center border-b border-zinc-800/80 px-2 py-1 gap-1 shrink-0 overflow-x-auto text-[11px] font-medium">
        <button
          onClick={() => setActiveTab('content')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === 'content'
              ? 'bg-zinc-800 text-amber-400 font-semibold'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
          }`}
        >
          <Sliders className="w-3 h-3" />
          <span>Content</span>
        </button>
        <button
          onClick={() => setActiveTab('typography')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === 'typography'
              ? 'bg-zinc-800 text-amber-400 font-semibold'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
          }`}
        >
          <Type className="w-3 h-3" />
          <span>Typography</span>
        </button>
        <button
          onClick={() => setActiveTab('styling')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === 'styling'
              ? 'bg-zinc-800 text-amber-400 font-semibold'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
          }`}
        >
          <Palette className="w-3 h-3" />
          <span>Colors</span>
        </button>
        <button
          onClick={() => setActiveTab('spacing')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === 'spacing'
              ? 'bg-zinc-800 text-amber-400 font-semibold'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
          }`}
        >
          <Layout className="w-3 h-3" />
          <span>Spacing</span>
        </button>
        <button
          onClick={() => setActiveTab('responsive')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === 'responsive'
              ? 'bg-zinc-800 text-amber-400 font-semibold'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
          }`}
        >
          <Smartphone className="w-3 h-3" />
          <span>Rules</span>
        </button>
      </div>

      {/* Main Inspector Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
        {/* ================================================================ */}
        {/* 1. CONTENT TAB */}
        {/* ================================================================ */}
        {activeTab === 'content' && (
          <div className="space-y-4">
            {/* Common Eyebrow / Tag */}
            {(content.eyebrow !== undefined || section.sectionType === 'hero' || section.sectionType === 'banners') && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-zinc-400">Eyebrow / Badge Text</label>
                <input
                  type="text"
                  value={content.eyebrow || content.badge || ''}
                  onChange={(e) => handleContentChange('eyebrow', e.target.value)}
                  placeholder="e.g. Curated Collection 2026"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-400"
                />
              </div>
            )}

            {/* Common Title */}
            {content.title !== undefined || section.sectionType !== 'announcement_bar' ? (
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-zinc-400">Primary Headline</label>
                <input
                  type="text"
                  value={content.title || ''}
                  onChange={(e) => handleContentChange('title', e.target.value)}
                  placeholder="Section headline..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-400"
                />
              </div>
            ) : null}

            {/* Announcement Message */}
            {section.sectionType === 'announcement_bar' && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-zinc-400">Marquee Message</label>
                <textarea
                  rows={2}
                  value={content.message || content.text || ''}
                  onChange={(e) => handleContentChange('message', e.target.value)}
                  placeholder="Promotional banner text..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-400 leading-relaxed"
                />
              </div>
            )}

            {/* Subtitle / Description */}
            {(content.subtitle !== undefined || content.description !== undefined || section.sectionType === 'hero' || section.sectionType === 'newsletter') && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-zinc-400">Subtitle / Description</label>
                <textarea
                  rows={3}
                  value={content.subtitle || content.description || ''}
                  onChange={(e) => handleContentChange('subtitle', e.target.value)}
                  placeholder="Detailed context or description..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-400 leading-relaxed"
                />
              </div>
            )}

            {/* Primary CTA Button */}
            {(content.primaryBtnText !== undefined || section.sectionType === 'hero' || section.sectionType === 'cta') && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-zinc-400">Primary Button</label>
                  <input
                    type="text"
                    value={content.primaryBtnText || content.buttonText || ''}
                    onChange={(e) => handleContentChange('primaryBtnText', e.target.value)}
                    placeholder="e.g. Shop Now"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-zinc-400">Link URL</label>
                  <input
                    type="text"
                    value={content.primaryBtnLink || content.linkUrl || ''}
                    onChange={(e) => handleContentChange('primaryBtnLink', e.target.value)}
                    placeholder="/shop"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            )}

            {/* Secondary CTA Button */}
            {(content.secondaryBtnText !== undefined || section.sectionType === 'hero' || section.sectionType === 'cta') && (
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-zinc-400">Secondary Button</label>
                  <input
                    type="text"
                    value={content.secondaryBtnText || ''}
                    onChange={(e) => handleContentChange('secondaryBtnText', e.target.value)}
                    placeholder="e.g. Custom Orders"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-zinc-400">Link URL</label>
                  <input
                    type="text"
                    value={content.secondaryBtnLink || ''}
                    onChange={(e) => handleContentChange('secondaryBtnLink', e.target.value)}
                    placeholder="/custom-products"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            )}

            {/* Background / Hero Banner Image URL */}
            {(content.bannerImage !== undefined || content.imageUrl !== undefined || section.sectionType === 'hero' || section.sectionType === 'banners') && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-zinc-400">Visual Image / Banner Asset URL</label>
                <input
                  type="text"
                  value={content.bannerImage || content.imageUrl || ''}
                  onChange={(e) => handleContentChange('bannerImage', e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-400 font-mono text-[11px]"
                />
                {(content.bannerImage || content.imageUrl) && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-zinc-800 aspect-video bg-zinc-900">
                    <img 
                      src={content.bannerImage || content.imageUrl} 
                      alt="Banner Preview" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Footer Specific */}
            {section.sectionType === 'footer' && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-zinc-400">Brand Name</label>
                  <input
                    type="text"
                    value={content.brandName || ''}
                    onChange={(e) => handleContentChange('brandName', e.target.value)}
                    placeholder="HARCONXS"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-zinc-400">Support Concierge Email</label>
                  <input
                    type="text"
                    value={content.supportEmail || ''}
                    onChange={(e) => handleContentChange('supportEmail', e.target.value)}
                    placeholder="concierge@harconxs.com"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================ */}
        {/* 2. TYPOGRAPHY TAB */}
        {/* ================================================================ */}
        {activeTab === 'typography' && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-400">Headline Font Scale</label>
              <div className="grid grid-cols-3 gap-2">
                {['normal', 'large', 'display'].map((scale) => (
                  <button
                    key={scale}
                    onClick={() => handleSettingsChange('titleScale', scale)}
                    className={`py-2 px-3 rounded-xl border text-xs capitalize cursor-pointer transition-colors ${
                      (settings.titleScale || 'large') === scale
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 font-semibold'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {scale}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-400">Text Alignment</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'left', label: 'Left' },
                  { key: 'center', label: 'Center' },
                  { key: 'right', label: 'Right' }
                ].map((align) => (
                  <button
                    key={align.key}
                    onClick={() => handleSettingsChange('alignment', align.key)}
                    className={`py-2 px-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                      (settings.alignment || 'center') === align.key
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 font-semibold'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {align.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-400">Title Font Family Style</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'serif', label: 'Luxury Serif' },
                  { key: 'sans', label: 'Modern Sans' }
                ].map((font) => (
                  <button
                    key={font.key}
                    onClick={() => handleSettingsChange('fontStyle', font.key)}
                    className={`py-2 px-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                      (settings.fontStyle || 'serif') === font.key
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 font-semibold'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {font.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* 3. STYLING & COLORS TAB */}
        {/* ================================================================ */}
        {activeTab === 'styling' && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-400">Section Background Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.backgroundColor || '#09090b'}
                  onChange={(e) => handleSettingsChange('backgroundColor', e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-zinc-900 border border-zinc-800 p-0.5 shrink-0"
                />
                <input
                  type="text"
                  value={settings.backgroundColor || '#09090b'}
                  onChange={(e) => handleSettingsChange('backgroundColor', e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 font-mono text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-400">Text Foreground Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.textColor || '#fafafa'}
                  onChange={(e) => handleSettingsChange('textColor', e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-zinc-900 border border-zinc-800 p-0.5 shrink-0"
                />
                <input
                  type="text"
                  value={settings.textColor || '#fafafa'}
                  onChange={(e) => handleSettingsChange('textColor', e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 font-mono text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-400">Preset Theme Tones</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Deep Obsidian', bg: '#09090b', text: '#fafafa' },
                  { label: 'Warm Charcoal', bg: '#18181b', text: '#f4f4f5' },
                  { label: 'Sovereign Amber', bg: '#451a03', text: '#fef3c7' }
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      handleSettingsChange('backgroundColor', preset.bg);
                      handleSettingsChange('textColor', preset.text);
                    }}
                    className="p-2.5 rounded-xl border border-zinc-800 hover:border-zinc-700 text-left transition-colors cursor-pointer"
                  >
                    <div className="w-full h-4 rounded mb-1.5 border border-zinc-700/50" style={{ backgroundColor: preset.bg }} />
                    <span className="text-[10px] text-zinc-400 font-medium block truncate">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* 4. SPACING TAB */}
        {/* ================================================================ */}
        {activeTab === 'spacing' && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-400">Top Padding</label>
              <div className="grid grid-cols-4 gap-1.5">
                {['none', 'sm', 'md', 'lg', 'xl', '2xl'].map((pad) => (
                  <button
                    key={pad}
                    onClick={() => handleSettingsChange('paddingTop', pad)}
                    className={`py-2 rounded-xl border text-xs capitalize cursor-pointer transition-colors ${
                      (settings.paddingTop || 'lg') === pad
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 font-semibold'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {pad}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-400">Bottom Padding</label>
              <div className="grid grid-cols-4 gap-1.5">
                {['none', 'sm', 'md', 'lg', 'xl', '2xl'].map((pad) => (
                  <button
                    key={pad}
                    onClick={() => handleSettingsChange('paddingBottom', pad)}
                    className={`py-2 rounded-xl border text-xs capitalize cursor-pointer transition-colors ${
                      (settings.paddingBottom || 'lg') === pad
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 font-semibold'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {pad}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-400">Container Width</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'narrow', label: 'Narrow (max-w-4xl)' },
                  { key: 'contained', label: 'Contained (max-w-6xl)' },
                  { key: 'wide', label: 'Wide (max-w-7xl)' },
                  { key: 'full', label: 'Full Width (100%)' }
                ].map((w) => (
                  <button
                    key={w.key}
                    onClick={() => handleSettingsChange('containerWidth', w.key)}
                    className={`py-2 px-3 rounded-xl border text-xs cursor-pointer transition-colors text-left truncate ${
                      (settings.containerWidth || 'wide') === w.key
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 font-semibold'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* 5. RESPONSIVE BEHAVIOR TAB */}
        {/* ================================================================ */}
        {activeTab === 'responsive' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <h4 className="text-xs font-semibold text-zinc-200">Device Visibility Controls</h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Control which viewport breakpoints display this section in live production.
              </p>

              <div className="space-y-2 pt-1">
                <label className="flex items-center justify-between p-2 rounded-xl bg-zinc-900 border border-zinc-800 cursor-pointer">
                  <span className="text-xs text-zinc-300">Hide on Mobile devices (&lt;640px)</span>
                  <input
                    type="checkbox"
                    checked={Boolean(settings.hideOnMobile)}
                    onChange={(e) => handleSettingsChange('hideOnMobile', e.target.checked)}
                    className="rounded accent-amber-500"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-xl bg-zinc-900 border border-zinc-800 cursor-pointer">
                  <span className="text-xs text-zinc-300">Hide on Tablets (640px - 1024px)</span>
                  <input
                    type="checkbox"
                    checked={Boolean(settings.hideOnTablet)}
                    onChange={(e) => handleSettingsChange('hideOnTablet', e.target.checked)}
                    className="rounded accent-amber-500"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-xl bg-zinc-900 border border-zinc-800 cursor-pointer">
                  <span className="text-xs text-zinc-300">Hide on Desktop monitors (&gt;1024px)</span>
                  <input
                    type="checkbox"
                    checked={Boolean(settings.hideOnDesktop)}
                    onChange={(e) => handleSettingsChange('hideOnDesktop', e.target.checked)}
                    className="rounded accent-amber-500"
                  />
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
