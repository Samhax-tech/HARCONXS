import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Heart, Watch, Sparkles, User, Users, Globe, Terminal, ArrowRight, ShieldCheck } from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const CategoriesPage: React.FC = () => {
  const { products } = useStore();

  const categoryCards = [
    {
      id: 'couples',
      title: 'Couples & Keepsakes',
      path: '/shop/couples',
      desc: 'Matching infinity bracelets, coordinates lockets, soundwave bar necklaces, and anniversary heirlooms.',
      icon: Heart,
      color: 'from-rose-950/80 to-zinc-900',
      badge: 'Bestseller Sanctuary',
      image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&auto=format&fit=crop&q=80',
      subcategories: ['Coordinates Bracelets', 'Soundwave Necklaces', 'Laser Lockets', 'Couple Rings']
    },
    {
      id: 'men',
      title: "Men's Collection & EDC",
      path: '/shop/men',
      desc: 'Heavy titanium automatic timepieces, damascus money clips, engraved cufflinks, and leather goods.',
      icon: Watch,
      color: 'from-amber-950/80 to-zinc-900',
      badge: 'Precision Engineering',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
      subcategories: ['Automatic Watches', 'Damascus Clips', 'Engraved Cufflinks', 'Signet Rings']
    },
    {
      id: 'women',
      title: "Women's Atelier & Jewelry",
      path: '/shop/women',
      desc: '18K rose gold pendants, custom birthstone chains, luxury velvet keepsake chests, and fine aesthetics.',
      icon: Sparkles,
      color: 'from-purple-950/80 to-zinc-900',
      badge: 'Fine Atelier',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80',
      subcategories: ['Birthstone Pendants', 'Velvet Chests', 'Rose Gold Chains', 'Anklets']
    },
    {
      id: 'unisex',
      title: 'Unisex Carry & Tech EDC',
      path: '/shop/unisex',
      desc: 'Minimalist RFID carbon cardholders, aircraft aluminum key organizers, and luxury executive pens.',
      icon: Users,
      color: 'from-emerald-950/80 to-zinc-900',
      badge: 'Everyday Carry',
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80',
      subcategories: ['RFID Carbon Wallets', 'Aluminum Keybars', 'Rollerball Pens', 'Leather Pouches']
    },
    {
      id: 'custom',
      title: 'Bespoke Custom Orders',
      path: '/custom-products',
      desc: 'Submit custom 3D sketches, unique metal alloys, custom engravings, and dedicated jeweler assistance.',
      icon: Sparkles,
      color: 'from-amber-950/90 to-zinc-900',
      badge: 'Made to Order',
      image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&auto=format&fit=crop&q=80',
      subcategories: ['3D CAD Models', 'Laser Inscriptions', 'Heirloom Restoration', 'Corporate Gifts']
    },
    {
      id: 'digital',
      title: 'Couple Websites & Portals',
      path: '/couple-websites',
      desc: 'Permanent hosted web domains celebrating love stories, interactive photo timelines, and guestbooks.',
      icon: Globe,
      color: 'from-sky-950/80 to-zinc-900',
      badge: 'Cloud Romance',
      image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&auto=format&fit=crop&q=80',
      subcategories: ['Romantic Minimal', 'Anniversary Gold', 'Long Distance Map', 'Live Guestbooks']
    },
    {
      id: 'bot-panels',
      title: 'Bot Panels & Digital Services',
      path: '/bot-panels',
      desc: 'Automated Telegram bot management, Discord moderation hubs, and API integration dashboards.',
      icon: Terminal,
      color: 'from-indigo-950/80 to-zinc-900',
      badge: 'Cloud Automation',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
      subcategories: ['Telegram Bot Panel', 'Discord Gateway', 'WhatsApp Cloud API', 'WordPress Integrations']
    }
  ];

  return (
    <div className="bg-zinc-950 min-h-screen py-10 text-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <Breadcrumbs items={[{ label: 'Categories' }]} />

        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-400 font-mono">Departments Directory</span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-zinc-100">
            Explore All Collections
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Navigate through our handcrafted physical artifacts, custom commissions atelier, and digital memory vaults.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {categoryCards.map((card) => {
            const count = products.filter(p => p.category === card.id).length;
            const Icon = card.icon;

            return (
              <div
                key={card.id}
                className="group bg-zinc-900/60 border border-zinc-800/80 rounded-3xl overflow-hidden hover:border-amber-500/40 transition-all flex flex-col justify-between hover:shadow-2xl hover:shadow-amber-500/5"
              >
                <div className="relative h-48 overflow-hidden bg-zinc-950">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                  
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-zinc-950/80 text-amber-400 border border-zinc-800 backdrop-blur-md">
                      {card.badge}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 backdrop-blur-md">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-lg font-serif font-bold text-white group-hover:text-amber-300 transition-colors">
                        {card.title}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {card.desc}
                  </p>

                  <div className="space-y-3 pt-2">
                    <div className="flex flex-wrap gap-1.5">
                      {card.subcategories.map((sub, i) => (
                        <span key={i} className="text-[11px] bg-zinc-950 border border-zinc-800 text-zinc-400 px-2.5 py-1 rounded-lg">
                          {sub}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                      <span className="text-xs text-zinc-500 font-mono">
                        {count > 0 ? `${count} items available` : 'Bespoke Atelier'}
                      </span>
                      <Link
                        to={card.path}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                      >
                        <span>Explore Collection</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
