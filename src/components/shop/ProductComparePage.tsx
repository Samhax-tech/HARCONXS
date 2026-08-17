import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { Breadcrumbs } from '../common/Breadcrumbs';
import {
  Sparkles,
  Check,
  X,
  Star,
  ShoppingBag,
  Heart,
  Plus,
  Trash2,
  Layers,
  ArrowRight,
  ShieldCheck,
  Truck,
  Eye
} from 'lucide-react';

export const ProductComparePage: React.FC = () => {
  const {
    products,
    comparisonProductIds,
    removeFromComparison,
    clearComparison,
    addToComparison,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setSelectedProductId,
    setCurrentView,
    showToast
  } = useStore();

  const comparedProducts = products.filter(p => comparisonProductIds.includes(p.id));
  const availableProductsToAdd = products.filter(p => !comparisonProductIds.includes(p.id));

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    showToast(`Added ${product.name} to bag!`);
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentView('product-detail');
  };

  return (
    <div className="bg-zinc-950 min-h-screen py-8 text-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Shop', view: 'catalog', category: 'all' },
            { label: 'Product Comparison' }
          ]}
        />

        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Side-by-Side Comparison Matrix</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-100">
              Compare Atelier Products
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Select up to 3 products to compare specs, prices, materials, reviews, and personalization features.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {comparedProducts.length > 0 && (
              <button
                onClick={clearComparison}
                className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-rose-400 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All ({comparedProducts.length})</span>
              </button>
            )}

            <button
              onClick={() => setCurrentView('catalog')}
              className="px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg"
            >
              <span>Back to Store</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Comparison Area */}
        {comparedProducts.length === 0 ? (
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-12 text-center space-y-6 max-w-xl mx-auto shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <Layers className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold font-serif text-zinc-100">No Products Selected For Comparison</h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Add up to 3 products from our catalog to compare laser engravings, dimensions, pricing, and buyer reviews side-by-side.
              </p>
            </div>

            <div className="pt-2">
              <p className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">Quick Add Popular Items</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {products.slice(0, 3).map(p => (
                  <button
                    key={p.id}
                    onClick={() => addToComparison(p.id)}
                    className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-left transition-colors cursor-pointer group"
                  >
                    <img src={p.images[0]} alt={p.name} className="w-full h-20 object-cover rounded-lg mb-2" />
                    <p className="text-xs font-medium text-zinc-200 line-clamp-1 group-hover:text-amber-400">{p.name}</p>
                    <p className="text-[11px] font-bold text-amber-400 mt-0.5">{formatPrice(p.price)}</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setCurrentView('catalog')}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Browse All Products</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Slot selector when < 3 products */}
            {comparedProducts.length < 3 && (
              <div className="bg-zinc-900/40 border border-dashed border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>You have {3 - comparedProducts.length} comparison slot{3 - comparedProducts.length > 1 ? 's' : ''} available.</span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0">
                  <span className="text-xs text-zinc-500 whitespace-nowrap">Add:</span>
                  {availableProductsToAdd.slice(0, 4).map(p => (
                    <button
                      key={p.id}
                      onClick={() => addToComparison(p.id)}
                      className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 rounded-lg text-xs text-zinc-300 hover:text-amber-300 whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span className="truncate max-w-[120px]">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Side-by-Side Comparison Grid Table */}
            <div className="overflow-x-auto pb-4">
              <div className="min-w-[760px] bg-zinc-900/70 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
                
                {/* Product Header Cards Row */}
                <div className="grid grid-cols-4 border-b border-zinc-800 divide-x divide-zinc-800 bg-zinc-950/60">
                  <div className="p-5 flex flex-col justify-end text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    <span>Atelier Feature Specs</span>
                  </div>

                  {comparedProducts.map(p => (
                    <div key={p.id} className="p-5 flex flex-col justify-between space-y-4 relative group">
                      <button
                        onClick={() => removeFromComparison(p.id)}
                        className="absolute top-3 right-3 p-1.5 rounded-full bg-zinc-900/80 hover:bg-rose-950 text-zinc-400 hover:text-rose-400 border border-zinc-800 transition-colors cursor-pointer"
                        title="Remove from comparison"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      <div className="space-y-3">
                        <div
                          onClick={() => handleSelectProduct(p.id)}
                          className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 cursor-pointer"
                        >
                          <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-semibold gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Details</span>
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block mb-1">
                            {p.category}
                          </span>
                          <h3
                            onClick={() => handleSelectProduct(p.id)}
                            className="text-sm font-bold text-zinc-100 hover:text-amber-400 cursor-pointer line-clamp-2"
                          >
                            {p.name}
                          </h3>
                        </div>

                        <div className="flex items-baseline gap-2">
                          <span className="text-base font-bold font-mono text-amber-400">
                            {formatPrice(p.price)}
                          </span>
                          {p.compareAtPrice && (
                            <span className="text-xs text-zinc-500 line-through font-mono">
                              {formatPrice(p.compareAtPrice)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex text-amber-400">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star
                                key={star}
                                className={`w-3.5 h-3.5 ${star <= Math.round(p.rating) ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'}`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-zinc-400">({p.rating.toFixed(1)})</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => handleAddToCart(p)}
                          className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Bag</span>
                        </button>
                        <button
                          onClick={() => toggleWishlist(p.id)}
                          className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                            isInWishlist(p.id)
                              ? 'bg-rose-950 border-rose-600 text-rose-400'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-rose-400'
                          }`}
                          title="Wishlist"
                        >
                          <Heart className={`w-4 h-4 ${isInWishlist(p.id) ? 'fill-rose-500' : ''}`} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Empty Slot Fillers */}
                  {Array.from({ length: 3 - comparedProducts.length }).map((_, idx) => (
                    <div key={idx} className="p-5 flex flex-col items-center justify-center text-center space-y-3 bg-zinc-950/20">
                      <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-600 flex items-center justify-center">
                        <Plus className="w-6 h-6" />
                      </div>
                      <p className="text-xs text-zinc-500">Empty Comparison Slot</p>
                      <button
                        onClick={() => setCurrentView('catalog')}
                        className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-amber-400 rounded-lg transition-colors cursor-pointer"
                      >
                        Add Product
                      </button>
                    </div>
                  ))}
                </div>

                {/* Row: Product Type */}
                <div className="grid grid-cols-4 border-b border-zinc-800/60 divide-x divide-zinc-800 text-xs py-3.5 px-0">
                  <div className="px-5 font-semibold text-zinc-400 flex items-center">Product Type</div>
                  {comparedProducts.map(p => (
                    <div key={p.id} className="px-5 text-zinc-200 flex items-center capitalize">
                      {p.productType.replace('_', ' ')}
                    </div>
                  ))}
                  {Array.from({ length: 3 - comparedProducts.length }).map((_, i) => (
                    <div key={i} className="px-5 text-zinc-600 flex items-center">-</div>
                  ))}
                </div>

                {/* Row: Personalization Available */}
                <div className="grid grid-cols-4 border-b border-zinc-800/60 divide-x divide-zinc-800 text-xs py-3.5 px-0 bg-zinc-950/30">
                  <div className="px-5 font-semibold text-zinc-400 flex items-center">Personalizable</div>
                  {comparedProducts.map(p => (
                    <div key={p.id} className="px-5 flex items-center">
                      {p.isPersonalizable ? (
                        <span className="inline-flex items-center gap-1 text-amber-400 font-medium bg-amber-950/40 border border-amber-800/50 px-2 py-0.5 rounded-full text-[11px]">
                          <Sparkles className="w-3 h-3" />
                          <span>Laser / Custom Engraved</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-zinc-500 text-[11px]">
                          <X className="w-3 h-3" />
                          <span>Standard Edition</span>
                        </span>
                      )}
                    </div>
                  ))}
                  {Array.from({ length: 3 - comparedProducts.length }).map((_, i) => (
                    <div key={i} className="px-5 text-zinc-600 flex items-center">-</div>
                  ))}
                </div>

                {/* Row: Available Variants */}
                <div className="grid grid-cols-4 border-b border-zinc-800/60 divide-x divide-zinc-800 text-xs py-3.5 px-0">
                  <div className="px-5 font-semibold text-zinc-400 flex items-center">Variants & Sizes</div>
                  {comparedProducts.map(p => (
                    <div key={p.id} className="px-5 text-zinc-300 flex items-center">
                      {p.variants && p.variants.length > 0 ? (
                        <span>{p.variants.length} options ({p.variants.map(v => v.name).join(', ')})</span>
                      ) : (
                        <span className="text-zinc-500">Single Universal Size</span>
                      )}
                    </div>
                  ))}
                  {Array.from({ length: 3 - comparedProducts.length }).map((_, i) => (
                    <div key={i} className="px-5 text-zinc-600 flex items-center">-</div>
                  ))}
                </div>

                {/* Row: Stock Status */}
                <div className="grid grid-cols-4 border-b border-zinc-800/60 divide-x divide-zinc-800 text-xs py-3.5 px-0 bg-zinc-950/30">
                  <div className="px-5 font-semibold text-zinc-400 flex items-center">Stock & Availability</div>
                  {comparedProducts.map(p => (
                    <div key={p.id} className="px-5 flex items-center">
                      {p.inventory > 10 ? (
                        <span className="text-emerald-400 font-medium flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>In Stock ({p.inventory} units)</span>
                        </span>
                      ) : p.inventory > 0 ? (
                        <span className="text-amber-400 font-medium">Low Stock ({p.inventory} left)</span>
                      ) : (
                        <span className="text-rose-400 font-medium">Backorder</span>
                      )}
                    </div>
                  ))}
                  {Array.from({ length: 3 - comparedProducts.length }).map((_, i) => (
                    <div key={i} className="px-5 text-zinc-600 flex items-center">-</div>
                  ))}
                </div>

                {/* Row: Dimensions & Weight */}
                <div className="grid grid-cols-4 border-b border-zinc-800/60 divide-x divide-zinc-800 text-xs py-3.5 px-0">
                  <div className="px-5 font-semibold text-zinc-400 flex items-center">Weight & Dimensions</div>
                  {comparedProducts.map(p => (
                    <div key={p.id} className="px-5 text-zinc-300 flex flex-col justify-center">
                      <span>{p.weight || '120g net weight'}</span>
                      <span className="text-zinc-500 text-[11px]">{p.dimensions || 'Universal luxury fit'}</span>
                    </div>
                  ))}
                  {Array.from({ length: 3 - comparedProducts.length }).map((_, i) => (
                    <div key={i} className="px-5 text-zinc-600 flex items-center">-</div>
                  ))}
                </div>

                {/* Row: Brand & SKU */}
                <div className="grid grid-cols-4 border-b border-zinc-800/60 divide-x divide-zinc-800 text-xs py-3.5 px-0 bg-zinc-950/30">
                  <div className="px-5 font-semibold text-zinc-400 flex items-center">Brand & SKU</div>
                  {comparedProducts.map(p => (
                    <div key={p.id} className="px-5 text-zinc-300 flex flex-col justify-center">
                      <span className="font-semibold text-zinc-200">{p.brand}</span>
                      <span className="font-mono text-zinc-500 text-[11px]">{p.sku}</span>
                    </div>
                  ))}
                  {Array.from({ length: 3 - comparedProducts.length }).map((_, i) => (
                    <div key={i} className="px-5 text-zinc-600 flex items-center">-</div>
                  ))}
                </div>

                {/* Row: Description Overview */}
                <div className="grid grid-cols-4 divide-x divide-zinc-800 text-xs py-4 px-0">
                  <div className="px-5 font-semibold text-zinc-400">Description</div>
                  {comparedProducts.map(p => (
                    <div key={p.id} className="px-5 text-zinc-400 leading-relaxed text-[11px]">
                      {p.shortDescription}
                    </div>
                  ))}
                  {Array.from({ length: 3 - comparedProducts.length }).map((_, i) => (
                    <div key={i} className="px-5 text-zinc-600">-</div>
                  ))}
                </div>

              </div>
            </div>

            {/* Bottom Trust Guarantee */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                <div className="text-xs">
                  <p className="font-semibold text-zinc-200">100% Genuine Atelier Guarantee</p>
                  <p className="text-zinc-400">All laser engravings calibrated with titanium precision.</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center gap-3">
                <Truck className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="text-xs">
                  <p className="font-semibold text-zinc-200">Express Pan-India Shipping</p>
                  <p className="text-zinc-400">Delivery in 2-4 business days via BlueDart & Delhivery.</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-rose-400 shrink-0" />
                <div className="text-xs">
                  <p className="font-semibold text-zinc-200">Complimentary Gift Packaging</p>
                  <p className="text-zinc-400">Standard eco-kraft or premium velvet capsules.</p>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
