import React, { useState } from 'react';
import { PageSectionType } from '../../../types';
import { SECTION_TYPE_METADATA } from '../../../data/defaultPageData';
import { 
  X, 
  Sparkles, 
  Megaphone, 
  Tag, 
  Grid, 
  Heart, 
  Gift, 
  Headphones, 
  ShieldCheck, 
  ArrowRightCircle, 
  Star, 
  HelpCircle, 
  Mail, 
  Layers,
  Bot
} from 'lucide-react';

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSection: (sectionType: PageSectionType) => void;
}

const CATEGORY_TABS = [
  { key: 'all', label: 'All Sections' },
  { key: 'header', label: 'Header & Banners' },
  { key: 'hero', label: 'Hero & Display' },
  { key: 'ecommerce', label: 'Products & Shop' },
  { key: 'bespoke', label: 'Bespoke & Keepsakes' },
  { key: 'social', label: 'Reviews & Trust' },
  { key: 'footer', label: 'Footer' }
] as const;

export const AddSectionModal: React.FC<AddSectionModalProps> = ({
  isOpen,
  onClose,
  onAddSection
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const sectionEntries = Object.entries(SECTION_TYPE_METADATA).filter(([key, meta]) => {
    if (selectedCategory !== 'all' && meta.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        meta.label.toLowerCase().includes(q) ||
        meta.description.toLowerCase().includes(q) ||
        key.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Megaphone': return <Megaphone className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      case 'Tag': return <Tag className="w-5 h-5" />;
      case 'Grid': return <Grid className="w-5 h-5" />;
      case 'Heart': return <Heart className="w-5 h-5" />;
      case 'Gift': return <Gift className="w-5 h-5" />;
      case 'Headphones': return <Headphones className="w-5 h-5" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5" />;
      case 'ArrowRightCircle': return <ArrowRightCircle className="w-5 h-5" />;
      case 'Star': return <Star className="w-5 h-5" />;
      case 'HelpCircle': return <HelpCircle className="w-5 h-5" />;
      case 'Mail': return <Mail className="w-5 h-5" />;
      case 'Bot': return <Bot className="w-5 h-5" />;
      default: return <Layers className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800/80 flex items-center justify-between gap-4 shrink-0">
          <div>
            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-mono font-semibold uppercase tracking-wider border border-amber-500/20">
              Section Library
            </span>
            <h2 className="text-xl font-serif font-bold text-zinc-100 mt-2">
              Add Section to Page
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Select an artisanal component block to append to your active page layout.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-4 border-b border-zinc-800/80 space-y-3 shrink-0 bg-zinc-900/40">
          <input
            type="text"
            placeholder="Search sections (e.g. hero, reviews, couples, banners)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
          />

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedCategory(tab.key)}
                className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === tab.key
                    ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of Sections */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {sectionEntries.map(([typeKey, meta]) => (
            <div
              key={typeKey}
              onClick={() => {
                onAddSection(typeKey as PageSectionType);
                onClose();
              }}
              className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/90 hover:border-amber-500/50 hover:bg-zinc-900 transition-all cursor-pointer flex flex-col justify-between group space-y-3"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  {getIcon(meta.iconName)}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-zinc-100 group-hover:text-amber-400 transition-colors">
                    {meta.label}
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed line-clamp-2">
                    {meta.description}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
                <span className="font-mono uppercase">{typeKey}</span>
                <span className="font-semibold text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  + Insert Section
                </span>
              </div>
            </div>
          ))}

          {sectionEntries.length === 0 && (
            <div className="col-span-full py-12 text-center text-zinc-500 text-xs">
              No section components match your search criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
