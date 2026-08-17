import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { Star, Heart, Sparkles, ArrowRight, ShoppingBag, CheckCircle2, Quote } from 'lucide-react';

export const FeaturedSection: React.FC = () => {
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

  const featuredProducts = products.filter(p => p.featured || p.badges.includes('Best Seller')).slice(0, 4);

  const handleProductClick = (product: Product) => {
    setSelectedProductId(product.id);
    setCurrentView('product-detail');
  };

  return (
    <section className="py-14 bg-zinc-950 border-b border-zinc-800 space-y-16">
      
      {/* 1. BEST SELLERS SPOTLIGHT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">Atelier Spotlight</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-100 mt-1">
              Best Sellers & Trending Creations
            </h2>
          </div>
          <button
            onClick={() => { setSelectedCategory('all'); setCurrentView('catalog'); }}
            className="text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Browse all products</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => {
            const inWishlist = isInWishlist(product.id);

            return (
              <div
                key={product.id}
                className="group bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-3.5 flex flex-col transition-all shadow-md"
              >
                {/* Image Box */}
                <div className="relative aspect-square rounded-xl overflow-hidden bg-zinc-950 mb-3 cursor-pointer">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    onClick={() => handleProductClick(product)}
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

                {/* Info */}
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
                        className="px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-700/60 text-rose-300 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
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
      </div>

      {/* 2. "CREATE SOMETHING SPECIAL" INTERACTIVE BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 p-8 sm:p-12 shadow-2xl">
          
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-800/60 text-amber-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Bespoke Commission & Quotation Engine</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-zinc-100 leading-tight">
              Have an idea you don't see anywhere else? We build it.
            </h2>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
              From custom engineered titanium jewelry, music boxes, holographic portraits, to bespoke Discord bot dashboards and wedding portals. Submit your brief, budget & reference files for a rapid atelier quote within 12 hours.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setCurrentView('custom-builder')}
                className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <span>Launch Custom Order Wizard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentView('custom-portal')}
                className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer"
              >
                View Active Custom Requests (#CO)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. REVIEWS & SOCIAL VERIFIED PROOF */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Verified Testimonials</span>
          <h2 className="text-2xl font-serif font-bold text-zinc-100 mt-1">Loved by Couples & Builders Worldwide</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed italic">
              "The coordinates matching titanium bracelets are gorgeous. The laser depth is so clean and the Midnight Velvet packaging made the anniversary reveal unforgettable!"
            </p>
            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-zinc-200">Sarah & Hamza M.</p>
                <p className="text-zinc-500 text-[11px]">San Francisco, CA</p>
              </div>
              <span className="flex items-center gap-1 text-emerald-400 text-[11px] font-medium">
                <CheckCircle2 className="w-3 h-3" />
                Verified Order
              </span>
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed italic">
              "Built our couple website in under 5 minutes. The relationship countdown and Spotify sync made my girlfriend cry happy tears. Highly recommend!"
            </p>
            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-zinc-200">Liam & Maya K.</p>
                <p className="text-zinc-500 text-[11px]">London, UK</p>
              </div>
              <span className="flex items-center gap-1 text-emerald-400 text-[11px] font-medium">
                <CheckCircle2 className="w-3 h-3" />
                Couple Sanctuary
              </span>
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed italic">
              "Their Telegram bot management panel transformed our VIP trading channel. Automated invite link expirations and webhooks run without a glitch."
            </p>
            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-zinc-200">Marcus T.</p>
                <p className="text-zinc-500 text-[11px]">Berlin, Germany</p>
              </div>
              <span className="flex items-center gap-1 text-emerald-400 text-[11px] font-medium">
                <CheckCircle2 className="w-3 h-3" />
                Cloud Panel Pro
              </span>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};
