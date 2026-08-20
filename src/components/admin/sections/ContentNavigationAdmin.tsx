import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  ArrowUp, 
  ArrowDown, 
  ExternalLink, 
  Link as LinkIcon, 
  Save, 
  Layers, 
  Globe, 
  RotateCcw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { enforceServerSidePermission } from '../../../services/adminAuthService';

export interface NavItem {
  id: string;
  label: string;
  url: string;
  target?: '_self' | '_blank';
  isHighlighted?: boolean;
  category?: 'primary' | 'secondary' | 'footer';
  order: number;
}

const DEFAULT_HEADER_NAV: NavItem[] = [
  { id: 'nav-1', label: 'Sanctuary Shop', url: '/shop', target: '_self', order: 1, category: 'primary' },
  { id: 'nav-2', label: 'Couples Collection', url: '/shop?category=couples', target: '_self', order: 2, category: 'primary' },
  { id: 'nav-3', label: 'Custom Atelier', url: '/custom-atelier', target: '_self', order: 3, category: 'primary', isHighlighted: true },
  { id: 'nav-4', label: 'Couple Websites', url: '/couple-websites', target: '_self', order: 4, category: 'primary' },
  { id: 'nav-5', label: 'Heritage & Story', url: '/heritage', target: '_self', order: 5, category: 'primary' },
  { id: 'nav-6', label: 'VIP Bot Concierge', url: '/bots', target: '_self', order: 6, category: 'primary' }
];

const DEFAULT_FOOTER_NAV: NavItem[] = [
  { id: 'foot-1', label: 'Track Order', url: '/track-order', target: '_self', order: 1, category: 'footer' },
  { id: 'foot-2', label: 'Bespoke Ring Fitting', url: '/custom-atelier', target: '_self', order: 2, category: 'footer' },
  { id: 'foot-3', label: 'Shipping & Delivery', url: '/policies/shipping', target: '_self', order: 3, category: 'footer' },
  { id: 'foot-4', label: 'Returns & Exchange', url: '/policies/returns', target: '_self', order: 4, category: 'footer' },
  { id: 'foot-5', label: 'Privacy & Terms', url: '/policies/privacy', target: '_self', order: 5, category: 'footer' },
  { id: 'foot-6', label: 'Private API Docs', url: '/api-docs', target: '_self', order: 6, category: 'footer' }
];

export const ContentNavigationAdmin: React.FC = () => {
  const { showToast } = useStore();
  const [activeMenuType, setActiveMenuType] = useState<'header' | 'footer'>('header');

  const [headerLinks, setHeaderLinks] = useState<NavItem[]>(() => {
    const saved = localStorage.getItem('harconxs_nav_header');
    return saved ? JSON.parse(saved) : DEFAULT_HEADER_NAV;
  });

  const [footerLinks, setFooterLinks] = useState<NavItem[]>(() => {
    const saved = localStorage.getItem('harconxs_nav_footer');
    return saved ? JSON.parse(saved) : DEFAULT_FOOTER_NAV;
  });

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formLabel, setFormLabel] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formTarget, setFormTarget] = useState<'_self' | '_blank'>('_self');
  const [formHighlighted, setFormHighlighted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const currentLinks = activeMenuType === 'header' ? headerLinks : footerLinks;
  const setCurrentLinks = activeMenuType === 'header' ? setHeaderLinks : setFooterLinks;

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormLabel('');
    setFormUrl('/');
    setFormTarget('_self');
    setFormHighlighted(false);
    setIsAdding(true);
  };

  const handleOpenEdit = (item: NavItem) => {
    setEditingId(item.id);
    setFormLabel(item.label);
    setFormUrl(item.url);
    setFormTarget(item.target || '_self');
    setFormHighlighted(!!item.isHighlighted);
    setIsAdding(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formLabel.trim() || !formUrl.trim()) {
      showToast('Please enter both navigation label and URL.');
      return;
    }

    if (editingId) {
      setCurrentLinks(prev => prev.map(item => 
        item.id === editingId 
          ? { ...item, label: formLabel.trim(), url: formUrl.trim(), target: formTarget, isHighlighted: formHighlighted }
          : item
      ));
      showToast('Navigation link updated.');
    } else {
      const newItem: NavItem = {
        id: `nav-${Date.now()}`,
        label: formLabel.trim(),
        url: formUrl.trim(),
        target: formTarget,
        isHighlighted: formHighlighted,
        category: activeMenuType === 'header' ? 'primary' : 'footer',
        order: currentLinks.length + 1
      };
      setCurrentLinks(prev => [...prev, newItem]);
      showToast('New navigation link added.');
    }

    setIsAdding(false);
    setEditingId(null);
  };

  const handleDeleteItem = (id: string) => {
    setCurrentLinks(prev => prev.filter(item => item.id !== id));
    showToast('Navigation link removed.');
  };

  const handleMoveOrder = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentLinks.length) return;

    const updated = [...currentLinks];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // Reassign order
    const reordered = updated.map((item, idx) => ({ ...item, order: idx + 1 }));
    setCurrentLinks(reordered);
  };

  const handlePersistNavigation = async () => {
    setIsSaving(true);
    try {
      await enforceServerSidePermission('content:pages', 'navigation', activeMenuType);
      if (activeMenuType === 'header') {
        localStorage.setItem('harconxs_nav_header', JSON.stringify(headerLinks));
      } else {
        localStorage.setItem('harconxs_nav_footer', JSON.stringify(footerLinks));
      }
      showToast(`${activeMenuType === 'header' ? 'Header Navigation' : 'Footer Navigation'} published and persisted successfully.`);
    } catch (err: any) {
      showToast(err.message || 'Permission Denied: Unable to save navigation settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = () => {
    if (activeMenuType === 'header') {
      setHeaderLinks(DEFAULT_HEADER_NAV);
      localStorage.removeItem('harconxs_nav_header');
    } else {
      setFooterLinks(DEFAULT_FOOTER_NAV);
      localStorage.removeItem('harconxs_nav_footer');
    }
    showToast(`Reset ${activeMenuType} navigation to factory default layout.`);
  };

  return (
    <div id="content-navigation-admin" className="space-y-6">
      {/* Top Header & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h3 className="text-xl font-serif font-bold text-zinc-100 flex items-center gap-2">
            <Menu className="w-5 h-5 text-amber-400" />
            Storefront Navigation Architecture
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Configure top menu headers, dropdown categories, footer columns, and bespoke highlight badges.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDefaults}
            className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reset to default menu links"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            onClick={handlePersistNavigation}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-400/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {isSaving ? 'Saving...' : 'Save & Publish Navigation'}
          </button>
        </div>
      </div>

      {/* Menu Switcher Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActiveMenuType('header');
              setIsAdding(false);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
              activeMenuType === 'header'
                ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/20 font-bold'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <Globe className="w-4 h-4" />
            Header Primary Menu ({headerLinks.length})
          </button>
          <button
            onClick={() => {
              setActiveMenuType('footer');
              setIsAdding(false);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
              activeMenuType === 'footer'
                ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/20 font-bold'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            Footer Sitemap & Legal ({footerLinks.length})
          </button>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Navigation Link
        </button>
      </div>

      {/* Add / Edit Form Drawer */}
      {isAdding && (
        <form onSubmit={handleSaveItem} className="p-5 rounded-2xl bg-zinc-900/90 border border-amber-500/30 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h4 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-amber-400" />
              {editingId ? 'Edit Navigation Item' : `Add Link to ${activeMenuType === 'header' ? 'Header' : 'Footer'}`}
            </h4>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Display Label *</label>
              <input
                type="text"
                required
                placeholder="e.g. Couples Sanctuary"
                value={formLabel}
                onChange={e => setFormLabel(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Target URL Path *</label>
              <input
                type="text"
                required
                placeholder="e.g. /shop?category=couples or https://..."
                value={formUrl}
                onChange={e => setFormUrl(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:border-amber-400 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Link Target Window</label>
              <select
                value={formTarget}
                onChange={e => setFormTarget(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:border-amber-400 cursor-pointer"
              >
                <option value="_self">Same Tab (_self)</option>
                <option value="_blank">New Tab (_blank)</option>
              </select>
            </div>
            <div className="flex items-center gap-2 pt-6">
              <label className="relative flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formHighlighted}
                  onChange={e => setFormHighlighted(e.target.checked)}
                  className="rounded bg-zinc-950 border-zinc-700 text-amber-400 focus:ring-amber-400"
                />
                <span>Highlight with Gold Accent Pill</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-400 text-xs font-medium hover:text-zinc-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-400 text-zinc-950 font-bold text-xs shadow-md shadow-amber-400/20"
            >
              {editingId ? 'Update Link' : 'Add to Menu'}
            </button>
          </div>
        </form>
      )}

      {/* Navigation Items List Table */}
      <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <span>Active Menu Structure ({currentLinks.length} items configured)</span>
          <span className="text-[11px] font-mono text-zinc-500">Reorder with arrows or edit in-line</span>
        </div>

        <div className="divide-y divide-zinc-800">
          {currentLinks.map((item, index) => (
            <div
              key={item.id}
              className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-800/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-zinc-500">
                  <button
                    onClick={() => handleMoveOrder(index, 'up')}
                    disabled={index === 0}
                    className="p-1 rounded hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-30 cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMoveOrder(index, 'down')}
                    disabled={index === currentLinks.length - 1}
                    className="p-1 rounded hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-30 cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className="w-6 h-6 rounded-md bg-zinc-800 text-zinc-400 text-xs font-mono flex items-center justify-center font-bold">
                  {index + 1}
                </span>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-zinc-100">{item.label}</span>
                    {item.isHighlighted && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                        Highlighted
                      </span>
                    )}
                    {item.target === '_blank' && (
                      <span className="text-[10px] text-zinc-500 flex items-center gap-0.5">
                        <ExternalLink className="w-3 h-3" /> New Tab
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-amber-400/80">{item.url}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-amber-400 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="p-2 rounded-lg bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 text-xs transition-colors cursor-pointer"
                  title="Remove link"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {currentLinks.length === 0 && (
            <div className="p-8 text-center text-zinc-500 text-sm">
              No navigation links added yet. Click &quot;Add Navigation Link&quot; to build this menu.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
