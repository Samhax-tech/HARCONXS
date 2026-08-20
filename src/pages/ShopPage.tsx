import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Product, CategoryType, ProductBadge } from '../types';
import { Search, Filter, SlidersHorizontal, Star, Heart, Sparkles, ShoppingBag, ArrowUpDown, LayoutGrid, List, ArrowRight, Tag, RefreshCw } from 'lucide-react';
import { Breadcrumbs, BreadcrumbItem } from '../components/common/Breadcrumbs';
import { Analytics } from '../services/analyticsService';

interface ShopPageProps {
  categoryOverride?: CategoryType | 'all';
  filterOverride?: 'deals' | 'best-sellers' | 'new-arrivals' | 'all';
}

export const ShopPage: React.FC<ShopPageProps> = ({ categoryOverride, filterOverride }) => {
  const {
    products,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setSelectedProductId,
    showToast
  } = useStore();

  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams<{ category?: string }>();

  // Determine active category from prop, route params or URL path
  const activeCategory: CategoryType | 'all' = useMemo(() => {
    if (categoryOverride) return categoryOverride;
    if (location.pathname.includes('/shop/men')) return 'men';
    if (location.pathname.includes('/shop/women')) return 'women';
    if (location.pathname.includes('/shop/unisex')) return 'unisex';
    if (location.pathname.includes('/shop/couples')) return 'couples';
    if (location.pathname.includes('/shop/custom')) return 'custom';
    if (location.pathname.includes('/shop/digital')) return 'digital';
    if (params.category) return params.category as CategoryType;
    return 'all';
  }, [categoryOverride, location.pathname, params.category]);

  // Determine filter override
  const activeFilter = useMemo(() => {
    if (filterOverride) return filterOverride;
    if (location.pathname === '/deals') return 'deals';
    if (location.pathname === '/best-sellers') return 'best-sellers';
    if (location.pathname === '/new-arrivals') return 'new-arrivals';
    return 'all';
  }, [filterOverride, location.pathname]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBadge, setSelectedBadge] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    Analytics.trackCategoryView(activeCategory);
  }, [activeCategory]);

  const categories: { id: CategoryType | 'all'; label: string; path: string }[] = [
    { id: 'all', label: 'All Collections', path: '/shop' },
    { id: 'couples', label: 'Couples & Engravings', path: '/shop/couples' },
    { id: 'men', label: "Men's Collection", path: '/shop/men' },
    { id: 'women', label: "Women's Atelier", path: '/shop/women' },
    { id: 'unisex', label: 'Unisex & EDC', path: '/shop/unisex' },
    { id: 'digital', label: 'Couple Websites', path: '/shop/digital' },
    { id: 'custom', label: 'Custom Commission', path: '/shop/custom' },
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
      if (activeCategory !== 'all' && product.category !== activeCategory) {
        return false;
      }

      // Page Filter override (e.g. deals, best-sellers, new-arrivals)
      if (activeFilter === 'deals' && (!product.compareAtPrice || product.compareAtPrice <= product.price)) {
        return false;
      }
      if (activeFilter === 'best-sellers' && !product.badges.includes('Best Seller') && product.rating < 4.8) {
        return false;
      }
      if (activeFilter === 'new-arrivals' && !product.badges.includes('New') && !product.badges.includes('Trending')) {
        return false;
      }

      // Badge filter
      if (selectedBadge !== 'all' && !product.badges.includes(selectedBadge as ProductBadge)) {
        return false;
      }

      // Price filter (INR)
      if (priceRange === 'under-2000' && product.price >= 2000) return false;
      if (priceRange === '2000-5000' && (product.price < 2000 || product.price > 5000)) return false;
      if (priceRange === '5000-10000' && (product.price < 5000 || product.price > 10000)) return false;
      if (priceRange === 'over-10000' && product.price <= 10000) return false;

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
  }, [products, activeCategory, activeFilter, selectedBadge, priceRange, searchQuery, sortBy]);

  const pageTitle = useMemo(() => {
    if (activeFilter === 'deals') return 'Special Deals & Offers';
    if (activeFilter === 'best-sellers') return 'Best Sellers Collection';
    if (activeFilter === 'new-arrivals') return 'New Arrivals & Atelier Drops';
    if (activeCategory === 'all') return 'All Collections & Sanctuaries';
    if (activeCategory === 'couples') return 'Couples & Personalized Gifts';
    if (activeCategory === 'men') return "Men's Collection & Timepieces";
    if (activeCategory === 'women') return "Women's Atelier & Jewelry";
    if (activeCategory === 'unisex') return 'Unisex Carry Gear & Accessories';
    if (activeCategory === 'digital') return 'Digital Services & Couple Portals';
    if (activeCategory === 'custom') return 'Bespoke Custom Commissions';
    return `${activeCategory} Collection`;
  }, [activeCategory, activeFilter]);

  const breadcrumbItems: BreadcrumbItem[] = useMemo(() => {
    const items: BreadcrumbItem[] = [{ label: 'Shop', view: 'catalog' }];
    if (activeCategory !== 'all') {
      items.push({ label: activeCategory.toUpperCase(), category: activeCategory });
    }
    if (activeFilter !== 'all') {
      items.push({ label: activeFilter.replace('-', ' ').toUpperCase() });
    }
    return items;
  }, [activeCategory, activeFilter]);

  return (
    <div className="bg-zinc-950 min-h-screen py-8 text-zinc-200 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Breadcrumbs for SEO and Navigation */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* Page Header */}
        <div className="border-b border-zinc-800/80 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">HARCONXS Catalog</span>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-zinc-100 mt-1 capitalize">
              {pageTitle}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Showing {filteredProducts.length} handcrafted physical and digital creations
            </p>
          </div>

          {/* Direct Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat.id && activeFilter === 'all';
              return (
                <Link
                  key={cat.id}
                  to={cat.path}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-zinc-950 font-bold shadow-lg shadow-amber-500/10'
                      : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
                  }`}
                >
                  {cat.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-4 space-y-4 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* Search within catalog */}
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, material, tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-200"
                >
                  ×
                </button>
              )}
            </div>

            {/* Badge Filter */}
            <div>
              <select
                value={selectedBadge}
                onChange={(e) => setSelectedBadge(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {badges.map((b) => (
                  <option key={b.id} value={b.id} className="bg-zinc-900 text-zinc-200">
                    {b.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Filter (INR) */}
            <div>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="all" className="bg-zinc-900 text-zinc-200">All Price Ranges</option>
                <option value="under-2000" className="bg-zinc-900 text-zinc-200">Under ₹2,000</option>
                <option value="2000-5000" className="bg-zinc-900 text-zinc-200">₹2,000 - ₹5,000</option>
                <option value="5000-10000" className="bg-zinc-900 text-zinc-200">₹5,000 - ₹10,000</option>
                <option value="over-10000" className="bg-zinc-900 text-zinc-200">Over ₹10,000</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="featured" className="bg-zinc-900 text-zinc-200">Featured Atelier Picks</option>
                <option value="price-low" className="bg-zinc-900 text-zinc-200">Price: Low to High</option>
                <option value="price-high" className="bg-zinc-900 text-zinc-200">Price: High to Low</option>
                <option value="rating" className="bg-zinc-900 text-zinc-200">Highest Rated</option>
                <option value="newest" className="bg-zinc-900 text-zinc-200">Newest Creations</option>
              </select>

              {/* View Toggle */}
              <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl p-1 shrink-0">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1 rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'grid' ? 'bg-zinc-800 text-amber-400' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1 rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'list' ? 'bg-zinc-800 text-amber-400' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Listing */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900/40 rounded-3xl border border-zinc-800 p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-serif font-bold text-zinc-100">No items match your filter criteria</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Try widening your price range, clearing search terms, or explore our custom commissions atelier.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedBadge('all');
                  setPriceRange('all');
                  setSortBy('featured');
                }}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs rounded-xl font-medium cursor-pointer transition-colors"
              >
                Clear All Filters
              </button>
              <Link
                to="/custom-products"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs rounded-xl font-bold cursor-pointer transition-colors"
              >
                Request Custom Piece
              </Link>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all flex flex-col justify-between hover:shadow-2xl hover:shadow-amber-500/5"
              >
                <div className="relative aspect-square overflow-hidden bg-zinc-950">
                  <Link to={`/product/${product.slug || product.id}`}>
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  {/* Badge Pills */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
                    {product.badges.slice(0, 2).map((b, idx) => (
                      <span
                        key={idx}
                        className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md shadow-md ${
                          b === 'Best Seller'
                            ? 'bg-amber-500 text-zinc-950'
                            : b === 'Sale'
                            ? 'bg-rose-500 text-white'
                            : b === 'Personalized'
                            ? 'bg-purple-600 text-white'
                            : 'bg-zinc-800 text-zinc-200'
                        }`}
                      >
                        {b}
                      </span>
                    ))}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-2.5 right-2.5 p-2 rounded-xl bg-zinc-950/70 hover:bg-zinc-900 text-zinc-300 hover:text-rose-400 backdrop-blur-md border border-zinc-800/60 transition-colors z-10 cursor-pointer"
                    title="Toggle Wishlist"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isInWishlist(product.id) ? 'fill-rose-500 text-rose-500' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span className="capitalize font-mono text-[11px] text-amber-400/80">{product.category}</span>
                      <div className="flex items-center gap-1 text-amber-400 font-semibold text-[11px]">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{product.rating}</span>
                        <span className="text-zinc-500">({product.reviewCount})</span>
                      </div>
                    </div>

                    <Link
                      to={`/product/${product.slug || product.id}`}
                      className="block font-serif font-bold text-zinc-100 text-sm hover:text-amber-400 transition-colors line-clamp-1"
                    >
                      {product.name}
                    </Link>

                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {product.shortDescription}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-bold text-amber-400 font-mono">
                          {formatPrice(product.price)}
                        </span>
                        {product.compareAtPrice && product.compareAtPrice > product.price && (
                          <span className="text-[11px] text-zinc-500 line-through font-mono">
                            {formatPrice(product.compareAtPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          addToCart(product, 1);
                          showToast(`Added ${product.name} to cart.`);
                        }}
                        className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold text-xs rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                        title="Add to Shopping Bag"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Add</span>
                      </button>
                      <Link
                        to={`/product/${product.slug || product.id}`}
                        className="p-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl transition-colors"
                        title="View Details & Personalize"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List Mode */
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 hover:border-amber-500/40 transition-colors"
              >
                <div className="w-full sm:w-44 h-40 rounded-xl overflow-hidden bg-zinc-950 shrink-0 relative">
                  <Link to={`/product/${product.slug || product.id}`}>
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                </div>

                <div className="flex-1 space-y-2 w-full">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-amber-400 uppercase">{product.category}</span>
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{product.rating}</span>
                      <span className="text-zinc-500">({product.reviewCount} reviews)</span>
                    </div>
                  </div>

                  <Link
                    to={`/product/${product.slug || product.id}`}
                    className="font-serif font-bold text-base text-zinc-100 hover:text-amber-400 transition-colors block"
                  >
                    {product.name}
                  </Link>

                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {product.fullDescription}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {product.tags.slice(0, 4).map((tag, i) => (
                      <span key={i} className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-md font-mono">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="sm:border-l sm:border-zinc-800 sm:pl-6 flex flex-col items-end justify-between w-full sm:w-48 gap-3">
                  <div className="text-right">
                    <span className="text-lg font-bold text-amber-400 font-mono">
                      {formatPrice(product.price)}
                    </span>
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <p className="text-xs text-zinc-500 line-through font-mono">
                        {formatPrice(product.compareAtPrice)}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 w-full">
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl cursor-pointer transition-colors"
                      title="Wishlist"
                    >
                      <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                    <button
                      onClick={() => {
                        addToCart(product, 1);
                        showToast(`Added ${product.name} to bag.`);
                      }}
                      className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Bag</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
