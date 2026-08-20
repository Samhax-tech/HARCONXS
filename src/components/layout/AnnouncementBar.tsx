import React from 'react';
import { Sparkles, ShieldCheck, Truck, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AnnouncementBar: React.FC = () => {
  const { setCurrentView, setSelectedCategory } = useStore();

  return (
    <aside aria-label="Announcements and promotions" className="bg-zinc-950 text-zinc-300 text-xs py-2 px-3 sm:px-4 border-b border-zinc-800/80 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 min-w-0">
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-0.5 min-w-0 max-w-full">
          <div className="flex items-center gap-1.5 whitespace-nowrap text-zinc-300 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Use code <span className="font-mono text-amber-300 font-semibold">WELCOME15</span> for 15% off first order</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 whitespace-nowrap text-zinc-400 shrink-0">
            <Truck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Free Express Worldwide Shipping on orders over $75</span>
          </div>
          <div className="hidden lg:flex items-center gap-1.5 whitespace-nowrap text-zinc-400 shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span>Bespoke Handcrafted & Digital Sanctuary Guarantee</span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-auto">
          <button
            onClick={() => {
              setSelectedCategory('couples');
              setCurrentView('catalog');
            }}
            className="flex items-center gap-1 text-rose-300 hover:text-rose-200 transition-colors text-xs font-medium cursor-pointer"
          >
            <span>Explore Couple Gifts</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </aside>
  );
};
