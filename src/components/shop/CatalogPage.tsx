import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, CategoryType, ProductBadge } from '../../types';
import { Search, Filter, SlidersHorizontal, Star, Heart, Sparkles, ShoppingBag, ArrowUpDown, LayoutGrid, List } from 'lucide-react';

export const CatalogPage: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setSelectedProductId,
    setCurrentView
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBadge, setSelectedBadge] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories: { id: CategoryType | 'all'; label: string }[] = [
    { id: 'all', label: 'All Collections' },
    { id: 'couples', label: 'Couples & Engravings' },
    { id: 'men', label: "Men's Collection" },
    { id: 'women', label: "Women's Atelier" },
    { id: 'unisex', label: 'Unisex & EDC' },
    { id: 'digital', label: 'Couple Websites' },
    { id: 'bot-panels', label: 'Bot Panels' },
    { id: 'custom', label: 'Custom Commission' },
  ];

  const badges: { id: string; label: string }[] = [
    { id: 'all', label: 'All Badges' },
    { id: 'Best Seller', label: 'Best Sellers' },
    { id: 'Personalized', label: 'Personalizable' },
    { id: 'Trending', label: 'Trending' },
    { id: 'Sale', label: 'On Sale' },
    { id: 'Digital', label: 'Digital' },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Badge filter
      if (selectedBadge !== 'all' && !product.badges.includes(selectedBadge as ProductBadge)) {
        return false;
      }

      // Price filter
      if (priceRange === 'under-50' && product.price >= 50) return false;
      if (priceRange === '50-100' && (product.price < 50 || product.price > 100)) return false;
      if (priceRange === '100-200' && (product.price < 100 || product.price > 200)) return false;
      if (priceRange === 'over-200' && product.price <= 200) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = product.name.toLowerCase().includes(q);
        const matchDesc = product.shortDescription.toLowerCase().includes(q);
        const matchTag = product.tags.some(t => t.toLowerCase().includes(q));
        if (!matchName && !matchDesc && !matchTag) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, selectedCategory, selectedBadge, priceRange, searchQuery, sortBy]);

  const handleProductClick = (product: Product) => {
    setSelectedProductId(product.id);
    setCurrentView('product-detail');
  };

  return (
    <div className="bg-zinc-950 min-h-screen py-8 text-zinc-200 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Page Header */}
        <div className="border-b border-zinc-800/80 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">HARCONXS Catalog</span>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-zinc-100 mt-1 capitalize">
              {selectedCategory === 'all' ? 'All Collections & Sanctuaries' : `${selectedCategory} Department`}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Showing {filteredProducts.length} handcrafted physical and digital creations
            </p>
          </div>

          {/* Search bar inside catalog */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keywords, tags, style..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-100 placeholder-zinc-500 outline-none focus:border-zinc-600"
            />
          </div>
        </div>

        {/* Category Filter Pills (1-row horizontal scroll) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-zinc-100 text-zinc-950 font-semibold'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Filters & Sorting Bar */}
        <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Badges and Price Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-zinc-400 flex items-center gap-1 font-medium">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filter:
            </span>

            {/* Badges Select */}
            <select
              value={selectedBadge}
              onChange={(e) => setSelectedBadge(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
            >
              {badges.map(b => (
                <option key={b.id} value={b.id}>{b.label}</option>
              ))}
            </select>

            {/* Price range */}
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
            >
              <option value="all">Any Price</option>
              <option value="under-50">Under $50</option>
              <option value="50-100">$50 to $100</option>
              <option value="100-200">$100 to $200</option>
              <option value="over-200">Over $200</option>
            </select>

            {(selectedBadge !== 'all' || priceRange !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedBadge('all');
                  setPriceRange('all');
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="text-[11px] text-amber-400 hover:underline px-2 py-1"
              >
                Reset filters
              </button>
            )}
          </div>

          {/* Sort & View Mode */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Grid / List switcher */}
            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Listing */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/30 rounded-2xl border border-zinc-800/80 p-8">
            <ShoppingBag className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-zinc-300">No products match your active filters</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
              Try adjusting your price range, clearing the search keyword, or requesting a custom fabricated order.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedBadge('all');
                setPriceRange('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-zinc-100 text-zinc-950 font-semibold text-xs hover:bg-white transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
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
        ) : (
          /* List View */
          <div className="space-y-4">
            {filteredProducts.map((product) => {
              const inWishlist = isInWishlist(product.id);

              return (
                <div
                  key={product.id}
                  className="bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-5 transition-all"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    onClick={() => handleProductClick(product)}
                    className="w-full sm:w-36 h-36 object-cover rounded-xl bg-zinc-950 cursor-pointer shrink-0"
                  />

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-amber-400 text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="font-semibold">{product.rating}</span>
                      </div>
                      <span className="text-zinc-500 text-xs">• {product.sku}</span>
                    </div>

                    <h3
                      onClick={() => handleProductClick(product)}
                      className="text-base font-bold text-zinc-100 hover:text-amber-300 transition-colors cursor-pointer"
                    >
                      {product.name}
                    </h3>

                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {product.fullDescription}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {product.badges.map(b => (
                        <span key={b} className="px-2 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-300 font-medium">
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto shrink-0 gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-800">
                    <div className="text-left sm:text-right">
                      <span className="text-lg font-bold text-zinc-100">{formatPrice(product.price)}</span>
                      {product.compareAtPrice && (
                        <p className="text-xs text-zinc-500 line-through">{formatPrice(product.compareAtPrice)}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                          inWishlist ? 'bg-rose-950/80 border-rose-600 text-rose-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                        }`}
                      >
                        <Heart className="w-4 h-4" />
                      </button>

                      {product.isPersonalizable ? (
                        <button
                          onClick={() => handleProductClick(product)}
                          className="px-4 py-2 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-700/60 text-rose-300 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Personalize</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => addToCart(product, 1)}
                          className="px-4 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Bag</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
