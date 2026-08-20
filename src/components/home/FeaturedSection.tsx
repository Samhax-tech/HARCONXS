import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { Star, Heart, Sparkles, ArrowRight, ShoppingBag } from 'lucide-react';

interface FeaturedSectionProps {
  content?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    filterCategory?: string;
    itemLimit?: number;
    viewAllLink?: string;
  };
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({ content }) => {
  const {
    products,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setSelectedProductId,
    setCurrentView,
    setSelectedCategory
  } = useStore();

  const [activeTab, setActiveTab] = useState<'all' | 'couples' | 'men' | 'women'>('all');

  const limit = content?.itemLimit || 4;

  const filteredProducts = products.filter(p => {
    if (activeTab === 'all') return true;
    return p.category === activeTab;
  }).slice(0, limit);

  const handleProductClick = (product: Product) => {
    setSelectedProductId(product.id);
    setCurrentView('product-detail');
  };

  return (
    <section id="sec-featured-products" className="py-16 sm:py-24 bg-zinc-950 border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 font-mono">
              {content?.badge || 'Atelier Spotlight'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-zinc-100 mt-1">
              {content?.title || 'Featured Masterpieces & Bestsellers'}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl font-sans">
              {content?.subtitle || 'Handcrafted with hypoallergenic titanium, 18K gold finishes, and museum-grade laser precision.'}
            </p>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-xl overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-zinc-800 text-zinc-100 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All Pieces
            </button>
            <button
              onClick={() => setActiveTab('couples')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'couples'
                  ? 'bg-zinc-800 text-zinc-100 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Couples
            </button>
            <button
              onClick={() => setActiveTab('men')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'men'
                  ? 'bg-zinc-800 text-zinc-100 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Men's
            </button>
            <button
              onClick={() => setActiveTab('women')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'women'
                  ? 'bg-zinc-800 text-zinc-100 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Women's
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const inWishlist = isInWishlist(product.id);

            return (
              <div
                key={product.id}
                className="group bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-4 flex flex-col transition-all shadow-md"
              >
                {/* 1:1 Square Image Box */}
                <div 
                  onClick={() => handleProductClick(product)}
                  className="relative aspect-square rounded-xl overflow-hidden bg-zinc-950 mb-3.5 cursor-pointer"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md border transition-colors cursor-pointer ${
                      inWishlist
                        ? 'bg-rose-950/80 border-rose-600 text-rose-400'
                        : 'bg-zinc-950/70 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                    title="Toggle Wishlist"
                  >
                    <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-rose-500' : ''}`} />
                  </button>

                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                    {product.badges.slice(0, 2).map((badge) => (
                      <span
                        key={badge}
                        className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-950/80 text-zinc-200 border border-zinc-800 backdrop-blur-md"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Info Container */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-amber-400 text-xs mb-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span className="font-semibold">{product.rating}</span>
                      <span className="text-zinc-500 text-[11px]">({product.reviewCount})</span>
                    </div>

                    <h3
                      onClick={() => handleProductClick(product)}
                      className="text-sm font-semibold text-zinc-100 group-hover:text-amber-300 transition-colors line-clamp-1 cursor-pointer"
                    >
                      {product.name}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                      {product.shortDescription}
                    </p>
                  </div>

                  {/* Price & Action Row */}
                  <div className="pt-4 mt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-bold text-zinc-100">{formatPrice(product.price)}</span>
                        {product.compareAtPrice && (
                          <span className="text-xs text-zinc-500 line-through">{formatPrice(product.compareAtPrice)}</span>
                        )}
                      </div>
                    </div>

                    {product.isPersonalizable ? (
                      <button
                        onClick={() => handleProductClick(product)}
                        className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>Personalize</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => addToCart(product, 1)}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Add to Bag</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Link to Full Catalog */}
        <div className="mt-10 text-center">
          <button
            onClick={() => {
              setSelectedCategory('all');
              setCurrentView('catalog');
            }}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700 px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            <span>View All Atelier Collections</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
