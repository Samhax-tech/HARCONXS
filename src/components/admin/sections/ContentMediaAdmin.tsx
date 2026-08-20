import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Upload, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  ExternalLink, 
  Search, 
  Filter, 
  Sparkles, 
  Eye, 
  Layers, 
  FolderOpen,
  FileText
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { enforceServerSidePermission } from '../../../services/adminAuthService';

export interface MediaAsset {
  id: string;
  title: string;
  url: string;
  category: 'products' | 'banners' | 'atelier' | 'couple_sites' | 'icons';
  altText: string;
  fileSizeKb: number;
  dimensions?: string;
  uploadedAt: string;
}

const DEFAULT_MEDIA_ASSETS: MediaAsset[] = [
  {
    id: 'med-1',
    title: 'Eternal Bond Sovereign Ring Set',
    url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
    category: 'products',
    altText: 'Gold and diamond promise rings displayed on black velvet',
    fileSizeKb: 245,
    dimensions: '1920 x 1080',
    uploadedAt: '2026-02-18'
  },
  {
    id: 'med-2',
    title: 'Heritage Atelier Workshop & Craftsmanship',
    url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80',
    category: 'atelier',
    altText: 'Artisan hand-engraving gold sovereign band with microscope',
    fileSizeKb: 412,
    dimensions: '2400 x 1600',
    uploadedAt: '2026-02-15'
  },
  {
    id: 'med-3',
    title: 'Royal Velvet Music Keepsake Box',
    url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80',
    category: 'products',
    altText: 'Handmade burgundy velvet music box with golden chime lock',
    fileSizeKb: 188,
    dimensions: '1600 x 1200',
    uploadedAt: '2026-02-14'
  },
  {
    id: 'med-4',
    title: 'Celestial Constellation Couple Template Hero',
    url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&auto=format&fit=crop&q=80',
    category: 'couple_sites',
    altText: 'Starry night sky celestial theme for bespoke wedding website',
    fileSizeKb: 380,
    dimensions: '2048 x 1152',
    uploadedAt: '2026-02-12'
  },
  {
    id: 'med-5',
    title: 'Harconxs Sovereign Gold Hallmark Certificate',
    url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&auto=format&fit=crop&q=80',
    category: 'banners',
    altText: 'BIS Hallmark 916 gold authentication wax seal stamp',
    fileSizeKb: 195,
    dimensions: '1200 x 800',
    uploadedAt: '2026-02-10'
  },
  {
    id: 'med-6',
    title: 'Titanium Magnetic Couple Pendants',
    url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80',
    category: 'products',
    altText: 'Two interlocking titanium and rose gold magnetic love pendants',
    fileSizeKb: 260,
    dimensions: '1800 x 1200',
    uploadedAt: '2026-02-08'
  }
];

export const ContentMediaAdmin: React.FC = () => {
  const { showToast } = useStore();

  const [assets, setAssets] = useState<MediaAsset[]>(() => {
    const saved = localStorage.getItem('harconxs_media_assets');
    return saved ? JSON.parse(saved) : DEFAULT_MEDIA_ASSETS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Upload/Add Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newCategory, setNewCategory] = useState<MediaAsset['category']>('products');
  const [newAltText, setNewAltText] = useState('');
  const [newDimensions, setNewDimensions] = useState('1920 x 1080');

  // Preview lightbox
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);

  const filteredAssets = assets
    .filter(a => !searchQuery || a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.altText.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(a => categoryFilter === 'all' || a.category === categoryFilter);

  const copyCdnUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast('Asset CDN URL copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) {
      showToast('Please provide an asset title and a valid image URL.');
      return;
    }

    try {
      await enforceServerSidePermission('content:page_builder', 'media_asset', 'new');
      const newAsset: MediaAsset = {
        id: `med-${Date.now()}`,
        title: newTitle.trim(),
        url: newUrl.trim(),
        category: newCategory,
        altText: newAltText.trim() || newTitle.trim(),
        fileSizeKb: Math.floor(150 + Math.random() * 300),
        dimensions: newDimensions.trim() || '1920 x 1080',
        uploadedAt: new Date().toISOString().split('T')[0]
      };

      const updated = [newAsset, ...assets];
      setAssets(updated);
      localStorage.setItem('harconxs_media_assets', JSON.stringify(updated));
      showToast('New media asset registered in CDN library.');
      setIsAddModalOpen(false);
      setNewTitle('');
      setNewUrl('');
      setNewAltText('');
    } catch (err: any) {
      showToast(err.message || 'Permission Denied: Unable to upload media.');
    }
  };

  const handleDeleteMedia = async (id: string, title: string) => {
    const confirm = window.confirm(`Permanently remove image asset "${title}" from Media Library?`);
    if (!confirm) return;

    try {
      await enforceServerSidePermission('content:page_builder', 'media_asset', id);
      const updated = assets.filter(a => a.id !== id);
      setAssets(updated);
      localStorage.setItem('harconxs_media_assets', JSON.stringify(updated));
      showToast(`Asset "${title}" removed.`);
    } catch (err: any) {
      showToast(err.message || 'Permission Denied: Unable to delete media.');
    }
  };

  return (
    <div id="content-media-admin" className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h3 className="text-xl font-serif font-bold text-zinc-100 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-amber-400" />
            Media Asset Manager & CDN Vault
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Central visual storage for product photography, lookbooks, banners, wedding presets, and CAD proofs.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-400/20 transition-all cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          Add Media Asset
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search media by title or alt text..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-zinc-500" />
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="all">All Asset Categories ({assets.length})</option>
            <option value="products">Jewelry Products</option>
            <option value="banners">Storefront Banners</option>
            <option value="atelier">Atelier & Heritage</option>
            <option value="couple_sites">Couple Website Presets</option>
            <option value="icons">Badges & Hallmarks</option>
          </select>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredAssets.map(asset => (
          <div
            key={asset.id}
            className="group rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden flex flex-col justify-between hover:border-zinc-700 transition-all"
          >
            <div className="relative aspect-video bg-zinc-950 overflow-hidden">
              <img
                src={asset.url}
                alt={asset.altText}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                <button
                  onClick={() => setPreviewAsset(asset)}
                  className="p-1.5 rounded-lg bg-zinc-900/90 text-zinc-200 hover:text-amber-400 text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" /> Preview
                </button>
                <button
                  onClick={() => copyCdnUrl(asset.url, asset.id)}
                  className="p-1.5 rounded-lg bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1 cursor-pointer shadow-md"
                >
                  {copiedId === asset.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === asset.id ? 'Copied' : 'Copy URL'}
                </button>
              </div>
            </div>

            <div className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-semibold text-zinc-100 text-sm line-clamp-1" title={asset.title}>
                  {asset.title}
                </h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-amber-400 capitalize shrink-0">
                  {asset.category.replace('_', ' ')}
                </span>
              </div>

              <p className="text-[11px] text-zinc-400 line-clamp-1" title={asset.altText}>
                {asset.altText}
              </p>

              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-2 border-t border-zinc-800">
                <span>{asset.dimensions || '1920x1080'} • {asset.fileSizeKb} KB</span>
                <button
                  onClick={() => handleDeleteMedia(asset.id, asset.title)}
                  className="text-zinc-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
                  title="Delete media"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Media Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-serif font-bold text-zinc-100 flex items-center gap-2">
              <Upload className="w-5 h-5 text-amber-400" />
              Register New Media Asset
            </h3>

            <form onSubmit={handleAddMedia} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Asset Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Celestial Orbit Lookbook Shot"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Public CDN / Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={newUrl}
                  onChange={e => setNewUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:border-amber-400 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs focus:border-amber-400 cursor-pointer"
                  >
                    <option value="products">Jewelry Products</option>
                    <option value="banners">Storefront Banners</option>
                    <option value="atelier">Atelier & Heritage</option>
                    <option value="couple_sites">Couple Web Presets</option>
                    <option value="icons">Badges & Hallmarks</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Dimensions</label>
                  <input
                    type="text"
                    placeholder="1920 x 1080"
                    value={newDimensions}
                    onChange={e => setNewDimensions(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Accessibility Alt Text</label>
                <input
                  type="text"
                  placeholder="Detailed description of visual content..."
                  value={newAltText}
                  onChange={e => setNewAltText(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-400 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-400 text-zinc-950 font-bold text-xs shadow-md shadow-amber-400/20 cursor-pointer"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Preview Modal */}
      {previewAsset && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-3xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-serif font-bold text-zinc-100">{previewAsset.title}</h3>
                <p className="text-xs font-mono text-amber-400">{previewAsset.dimensions} • {previewAsset.fileSizeKb} KB</p>
              </div>
              <button
                onClick={() => setPreviewAsset(null)}
                className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden max-h-[60vh] flex items-center justify-center bg-black">
              <img src={previewAsset.url} alt={previewAsset.altText} className="max-h-[60vh] w-auto object-contain" />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-zinc-400 font-mono truncate max-w-md">{previewAsset.url}</span>
              <button
                onClick={() => copyCdnUrl(previewAsset.url, previewAsset.id)}
                className="px-4 py-2 rounded-xl bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy CDN Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
