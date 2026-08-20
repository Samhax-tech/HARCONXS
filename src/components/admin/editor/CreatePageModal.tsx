import React, { useState } from 'react';
import { PageRecord } from '../../../types';
import { X, Plus, FileText, Sparkles, Layers } from 'lucide-react';

interface CreatePageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePage: (pageData: Partial<PageRecord>) => Promise<void>;
}

export const CreatePageModal: React.FC<CreatePageModalProps> = ({
  isOpen,
  onClose,
  onCreatePage
}) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [template, setTemplate] = useState<'standard' | 'blank' | 'landing'>('standard');
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slug || slug === title.toLowerCase().replace(/[^a-z0-9]/g, '-')) {
      setSlug(val.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) return;

    setIsCreating(true);
    try {
      await onCreatePage({
        title: title.trim(),
        slug: slug.trim().toLowerCase(),
        status: 'draft',
        meta: {
          description: `${title.trim()} at HARCONXS Atelier.`,
          keywords: 'HARCONXS, luxury, bespoke',
          ogImage: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=1200&auto=format&fit=crop&q=80'
        }
      });
      onClose();
      setTitle('');
      setSlug('');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800/80 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-zinc-100">
                Create New Page
              </h2>
              <p className="text-xs text-zinc-400">
                Add a new dynamic route to the HARCONXS CMS.
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
            <label className="text-[11px] font-medium text-zinc-400">Page Title</label>
            <input
              type="text"
              placeholder="e.g. VIP Concierge Lounge, Artisan Story..."
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              autoFocus
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-zinc-400">URL Route Slug</label>
            <div className="flex items-center px-3 rounded-xl bg-zinc-900 border border-zinc-800 focus-within:border-amber-400">
              <span className="text-zinc-500 font-mono text-[11px]">/</span>
              <input
                type="text"
                placeholder="vip-concierge"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                required
                className="w-full py-2.5 px-1 bg-transparent text-xs text-zinc-100 focus:outline-none font-mono"
              />
            </div>
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
              disabled={isCreating || !title.trim() || !slug.trim()}
              className="px-6 py-2.5 rounded-xl bg-amber-400 text-zinc-950 font-bold text-xs hover:bg-amber-300 disabled:opacity-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>{isCreating ? 'Creating...' : 'Create Page'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
