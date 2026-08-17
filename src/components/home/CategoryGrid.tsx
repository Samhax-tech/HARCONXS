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

const CATEGORIES: CategoryCard[] = [
  {
    id: 'couples',
    title: 'Couples & Matching',
    subtitle: 'Coordinates bracelets, acrylic song plaques, anniversary boxes',
    image: 'https://images.unsplash.com/photo-1611591475841-e40889c20a1f?w=800&auto=format&fit=crop&q=80',
    itemCount: '24 Items',
    badge: 'Trending'
  },
  {
    id: 'men',
    title: "Men's Collection",
    subtitle: 'Automatic chronographs, leather EDC, titanium cuff links',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
    itemCount: '18 Items'
  },
  {
    id: 'women',
    title: "Women's Atelier",
    subtitle: '18K opal pendants, diamond huggies, velvet jewelry pouches',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',
    itemCount: '20 Items'
  },
  {
    id: 'unisex',
    title: 'Unisex & Modular Carry',
    subtitle: 'Waterproof slings, tactile brass keyrings, minimalist wallets',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    itemCount: '15 Items'
  },
  {
    id: 'digital',
    title: 'Couple Websites & Digital',
    subtitle: 'Interactive love timelines, music sync, dedicated subdomains',
    image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&auto=format&fit=crop&q=80',
    itemCount: '4 Templates',
    badge: 'Popular'
  },
  {
    id: 'bot-panels',
    title: 'Bot Panels & Automation',
    subtitle: 'Turnkey Telegram, Discord & WhatsApp management suites',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    itemCount: '3 Cloud Suites'
  }
];

export const CategoryGrid: React.FC = () => {
  const { setSelectedCategory, setCurrentView } = useStore();

  const handleSelect = (category: CategoryType) => {
    setSelectedCategory(category);
    if (category === 'digital') {
      setCurrentView('couple-builder');
    } else if (category === 'bot-panels') {
      setCurrentView('bot-panels');
    } else {
      setCurrentView('catalog');
    }
  };

  return (
    <section className="py-14 bg-zinc-950 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Curated Departments</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-100 mt-1">
              Engineered For Every Connection
            </h2>
          </div>
          <button
            onClick={() => { setSelectedCategory('all'); setCurrentView('catalog'); }}
            className="text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>View all collections</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleSelect(cat.id)}
              className="group relative h-64 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 cursor-pointer shadow-lg hover:border-zinc-700 transition-all"
            >
              {/* Background image */}
              <img
                src={cat.image}
                alt={cat.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60 group-hover:opacity-75"
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />

              {/* Top Badge if any */}
              {cat.badge && (
                <div className="absolute top-4 left-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-950/80 text-amber-300 border border-amber-500/40 backdrop-blur-md">
                    {cat.badge}
                  </span>
                </div>
              )}

              {/* Content bottom */}
              <div className="absolute bottom-0 inset-x-0 p-5 flex flex-col justify-end">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-zinc-400 font-medium">{cat.itemCount}</span>
                  <div className="w-7 h-7 rounded-full bg-zinc-900/80 border border-zinc-700 flex items-center justify-center text-zinc-200 group-hover:bg-white group-hover:text-zinc-950 transition-colors">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-zinc-100 group-hover:text-white mt-1">{cat.title}</h3>
                <p className="text-xs text-zinc-300 line-clamp-1 mt-0.5">{cat.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
