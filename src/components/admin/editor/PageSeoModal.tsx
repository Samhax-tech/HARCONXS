import React, { useState } from 'react';
import { PageRecord } from '../../../types';
import { X, Globe, Save, Check } from 'lucide-react';

interface PageSeoModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageRecord: PageRecord;
  onUpdateMetadata: (updates: Partial<PageRecord>) => Promise<void>;
}

export const PageSeoModal: React.FC<PageSeoModalProps> = ({
  isOpen,
  onClose,
  pageRecord,
  onUpdateMetadata
}) => {
  const [title, setTitle] = useState(pageRecord.title);
  const [slug, setSlug] = useState(pageRecord.slug);
  const [status, setStatus] = useState(pageRecord.status || 'draft');
  const [description, setDescription] = useState(pageRecord.meta?.description || '');
  const [keywords, setKeywords] = useState(pageRecord.meta?.keywords || '');
  const [ogImage, setOgImage] = useState(pageRecord.meta?.ogImage || '');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onUpdateMetadata({
        title,
        slug,
        status: status as any,
        meta: {
          ...pageRecord.meta,
          description,
          keywords,
          ogImage
        }
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800/80 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-zinc-100">
                Page Settings & SEO
              </h2>
              <p className="text-xs text-zinc-400">
                Configure URL slugs, search engine snippets & social sharing cards.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-zinc-400">Page Navigation Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-400">URL Route Slug</label>
              <div className="flex items-center px-3 rounded-xl bg-zinc-900 border border-zinc-800 focus-within:border-amber-400">
                <span className="text-zinc-500 font-mono text-[11px]">/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                  required
                  className="w-full py-2.5 px-1 bg-transparent text-xs text-zinc-100 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-400">Publish Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="draft">Draft Mode</option>
                <option value="published">Published Live</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-zinc-400">Meta Description (SEO & Social)</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Concise summary for Google search engine results..."
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-400 leading-relaxed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-zinc-400">SEO Keywords (Comma Separated)</label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="jewelry, custom gifts, couple websites, luxury..."
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-zinc-400">Open Graph Social Image (URL)</label>
            <input
              type="text"
              value={ogImage}
              onChange={(e) => setOgImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-400 font-mono text-[11px]"
            />
          </div>

          <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-zinc-100 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-amber-400 text-zinc-950 font-bold text-xs hover:bg-amber-300 disabled:opacity-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
