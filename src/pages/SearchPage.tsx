import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Product, CategoryType } from '../types';
import { Search, ShoppingBag, Heart, Star, Sparkles, Filter, ArrowRight, Tag } from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceSort, setPriceSort] = useState<string>('relevance');

  const { products, formatPrice, addToCart, toggleWishlist, isInWishlist, showToast } = useStore();

  useEffect(() => {
    const q = searchParams.get('q') || '';
    setQuery(q);
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    } else {
      setSearchParams({});
    }
  };

  const searchResults = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return products;

    return products.filter((p) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.shortDescription.toLowerCase().includes(q) || p.fullDescription.toLowerCase().includes(q);
      const matchCategory = p.category.toLowerCase().includes(q);
      const matchTag = p.tags.some(t => t.toLowerCase().includes(q));
      const matchSku = p.sku.toLowerCase().includes(q);

      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }

      return matchName || matchDesc || matchCategory || matchTag || matchSku;
    }).sort((a, b) => {
      if (priceSort === 'price-low') return a.price - b.price;
      if (priceSort === 'price-high') return b.price - a.price;
      if (priceSort === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [products, query, selectedCategory, priceSort]);

  return (
    <div className="bg-zinc-950 min-h-screen py-8 text-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <Breadcrumbs items={[{ label: 'Search' }, { label: query ? `"${query}"` : 'All Products' }]} />

        {/* Search Header Banner */}
        <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
          <div className="max-w-2xl">
            <span className="text-xs font-mono text-amber-400 uppercase">Search Atelier Catalog</span>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white mt-1">
              Find Your Bespoke Creation
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Search by product name, materials, metal type, occasion, SKU, or personalization options.
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-2xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Infinity bracelet, titanium watch, couple locket..."
                className="w-full bg-zinc-950 border border-zinc-700/80 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm rounded-2xl cursor-pointer transition-colors shadow-lg shadow-amber-500/10"
            >
              Search
            </button>
          </form>

          {/* Quick search suggestions */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-zinc-400">
            <span className="text-zinc-500">Trending keywords:</span>
            {['Infinity Bracelet', 'Rose Gold', 'Couple Website', 'Titanium Watch', 'Soundwave', 'Laser Engraved'].map((term) => (
              <button
                key={term}
                onClick={() => {
                  setQuery(term);
                  setSearchParams({ q: term });
                }}
                className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-amber-400 hover:border-amber-500/40 transition-colors cursor-pointer text-[11px]"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Results Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <p className="text-xs text-zinc-400">
            Found <span className="font-bold text-white">{searchResults.length}</span> results {query && <span>for "<span className="text-amber-400 font-medium">{query}</span>"</span>}
          </p>

          <div className="flex items-center gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="all">All Departments</option>
              <option value="couples">Couples</option>
              <option value="men">Men's</option>
              <option value="women">Women's</option>
              <option value="unisex">Unisex</option>
              <option value="custom">Custom Commissions</option>
              <option value="digital">Digital & Websites</option>
            </select>

            <select
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="relevance">Sort: Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Results Grid */}
        {searchResults.length === 0 ? (
          <div className="py-16 text-center bg-zinc-900/30 rounded-3xl border border-zinc-800 p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
              <Search className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-serif font-bold text-white">No exact matches found</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                We couldn't find products matching your search. Try different keywords or commission a bespoke custom creation.
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => {
                  setQuery('');
                  setSearchParams({});
                }}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs rounded-xl font-medium"
              >
                Clear Search
              </button>
              <Link
                to="/custom-products"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs rounded-xl font-bold"
              >
                Request Custom Order
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {searchResults.map((product) => (
              <div
                key={product.id}
                className="group bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-square overflow-hidden bg-zinc-950">
                  <Link to={`/product/${product.slug || product.id}`}>
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-2.5 right-2.5 p-2 rounded-xl bg-zinc-950/70 hover:bg-zinc-900 text-zinc-300 hover:text-rose-400 backdrop-blur-md border border-zinc-800/60 transition-colors z-10 cursor-pointer"
                    title="Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span className="capitalize font-mono text-[11px] text-amber-400/80">{product.category}</span>
                      <div className="flex items-center gap-1 text-amber-400 font-semibold text-[11px]">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{product.rating}</span>
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
                    <span className="text-base font-bold text-amber-400 font-mono">
                      {formatPrice(product.price)}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          addToCart(product, undefined, 1);
                          showToast(`Added ${product.name} to cart.`);
                        }}
                        className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold text-xs rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                      <Link
                        to={`/product/${product.slug || product.id}`}
                        className="p-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl transition-colors"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
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
