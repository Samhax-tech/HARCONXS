import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CategoryType } from '../../types';
import { ArrowUpRight } from 'lucide-react';

interface CategoryCard {
  id: CategoryType;
  title: string;
  subtitle: string;
  image: string;
  itemCount: string;
  badge?: string;
}

interface CategoryGridProps {
  content?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    categories?: {
      id: string;
      name: string;
      subtitle: string;
      image: string;
      link?: string;
      itemCount: string;
      badge?: string;
    }[];
  };
}

const DEFAULT_CATEGORIES: CategoryCard[] = [
  {
    id: 'couples',
    title: 'Couples & Matching',
    subtitle: 'Coordinates bracelets, acrylic song plaques, anniversary boxes',
    image: 'https://images.unsplash.com/photo-1611591475841-e40889c20a1f?w=800&auto=format&fit=crop&q=80',
    itemCount: '24 Pieces',
    badge: 'Trending'
  },
  {
    id: 'men',
    title: "Men's Collection",
    subtitle: 'Automatic chronographs, leather EDC, titanium cuff links',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
    itemCount: '18 Pieces'
  },
  {
    id: 'women',
    title: "Women's Atelier",
    subtitle: '18K opal pendants, diamond huggies, velvet jewelry pouches',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',
    itemCount: '20 Pieces'
  },
  {
    id: 'unisex',
    title: 'Unisex & Modular Carry',
    subtitle: 'Waterproof slings, tactile brass keyrings, minimalist wallets',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    itemCount: '15 Pieces'
  }
];

export const CategoryGrid: React.FC<CategoryGridProps> = ({ content }) => {
  const { setSelectedCategory, setCurrentView } = useStore();

  const handleSelect = (categoryId: string) => {
    if (categoryId === 'digital' || categoryId === 'couples-site') {
      setCurrentView('couple-builder');
    } else {
      setSelectedCategory(categoryId as CategoryType);
      setCurrentView('catalog');
    }
  };

  const categories = content?.categories && content.categories.length > 0 
    ? content.categories 
    : DEFAULT_CATEGORIES.map(c => ({
        id: c.id,
        name: c.title,
        subtitle: c.subtitle,
        image: c.image,
        itemCount: c.itemCount,
        badge: c.badge
      }));

  return (
    <section id="sec-categories" className="py-16 sm:py-24 bg-zinc-950 border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 font-mono">
              {content?.badge || 'Curated Departments'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-zinc-100 mt-1">
              {content?.title || 'Engineered For Every Meaningful Connection'}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl font-sans">
              {content?.subtitle || 'Explore our specialized departments from fine jewelry to private digital portals.'}
            </p>
          </div>
          <button
            onClick={() => { setSelectedCategory('all'); setCurrentView('catalog'); }}
            className="text-xs sm:text-sm font-semibold text-zinc-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>View all collections</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Categories Grid (2x2 on tablet/desktop or 4 columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleSelect(cat.id)}
              className="group relative h-72 sm:h-80 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 cursor-pointer shadow-lg hover:border-zinc-700 transition-all flex flex-col justify-end p-5"
            >
              {/* Background image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-65 group-hover:opacity-80"
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />

              {/* Top Badge if any */}
              {cat.badge && (
                <div className="absolute top-4 left-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-950/80 text-amber-300 border border-amber-500/40 backdrop-blur-md">
                    {cat.badge}
                  </span>
                </div>
              )}

              {/* Content bottom */}
              <div className="relative z-10 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-zinc-400">{cat.itemCount}</span>
                  <div className="w-7 h-7 rounded-full bg-zinc-900/80 border border-zinc-700 flex items-center justify-center text-zinc-200 group-hover:bg-white group-hover:text-zinc-950 transition-colors">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-zinc-100 group-hover:text-white">
                  {cat.name}
                </h3>
                <p className="text-xs text-zinc-300 line-clamp-1">
                  {cat.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
