import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductVariant, PackagingOption, PersonalizationConfig } from '../../types';
import { PersonalizedProductBuilder } from '../personalizer/PersonalizedProductBuilder';
import { ProductReviewsSection } from '../reviews/ProductReviewsSection';
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  Share2,
  Gift,
  Layers
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const {
    selectedProductId,
    products,
    reviews,
    packagingOptions,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setCurrentView,
    showToast
  } = useStore();

  const product = products.find(p => p.id === selectedProductId) || products[0];

  const productReviews = (reviews || []).filter(r => r.productId === product.id && r.status !== 'rejected' && r.status !== 'hidden');
  const totalReviewsCount = productReviews.length > 0 ? productReviews.length : (product.reviewCount || 0);
  const avgRating = productReviews.length > 0
    ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
    : (product.rating || 5.0).toFixed(1);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );
  const [selectedPackaging, setSelectedPackaging] = useState<PackagingOption>(packagingOptions[0]);
  const [quantity, setQuantity] = useState(1);
  const [showPersonalizer, setShowPersonalizer] = useState(product.isPersonalizable ?? false);

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const inWishlist = isInWishlist(product.id);

  const handleAddRegularToCart = () => {
    addToCart(product, quantity, selectedVariant?.id, selectedPackaging);
  };

  const handleAddPersonalizedToCart = (personalization: PersonalizationConfig) => {
    addToCart(product, quantity, selectedVariant?.id, selectedPackaging, personalization);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!');
    }
  };

  return (
    <div className="bg-zinc-950 min-h-screen py-8 text-zinc-200 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back Button */}
        <button
          onClick={() => setCurrentView('catalog')}
          className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>

        {/* Top Product Presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left 6 cols: Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {/* Wishlist Floating Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md border transition-all cursor-pointer shadow-lg ${
                  inWishlist 
                    ? 'bg-rose-950/90 border-rose-500 text-rose-400 scale-105' 
                    : 'bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:text-rose-400 hover:border-rose-800'
                }`}
                title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                aria-label="Wishlist toggle"
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                className="absolute top-4 left-4 p-3 rounded-full bg-zinc-950/80 backdrop-blur-md border border-zinc-800 text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer shadow-lg"
                title="Share link"
                aria-label="Share product"
              >
                <Share2 className="w-5 h-5" />
              </button>

              {/* Verified Atelier Badge */}
              <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1 bg-zinc-950/80 backdrop-blur-md border border-zinc-800 rounded-full text-[11px] font-mono text-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>HARCONXS Atelier Masterpiece</span>
              </div>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      activeImageIndex === idx ? 'border-amber-400 ring-2 ring-amber-400/20 scale-105' : 'border-zinc-800 hover:border-zinc-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover bg-zinc-900" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right 6 cols: Details & Purchase Actions */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Category / Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-900 text-zinc-300 border border-zinc-800">
                {product.category}
              </span>
              {product.badges?.map(badge => (
                <span key={badge} className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  {badge}
                </span>
              ))}
              {product.isPersonalizable && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-rose-400" />
                  Personalizable
                </span>
              )}
            </div>

            {/* Title & Rating */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-100">
                {product.name}
              </h1>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.round(Number(avgRating)) ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'}`}
                    />
                  ))}
                  <span className="text-xs font-mono font-bold text-zinc-200 ml-1.5">{avgRating}</span>
                </div>
                <span className="text-zinc-500 text-xs">•</span>
                <span className="text-xs text-zinc-400 font-mono">
                  {totalReviewsCount} {totalReviewsCount === 1 ? 'Customer Review' : 'Verified Reviews'}
                </span>
              </div>
            </div>

            {/* Price Presentation (Exclusive INR) */}
            <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl flex items-baseline gap-3">
              <span className="text-3xl font-bold font-mono text-zinc-100">
                {formatPrice(currentPrice)}
              </span>
              {product.compareAtPrice && (
                <span className="text-sm font-mono text-zinc-500 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
              <span className="ml-auto text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-0.5 rounded-full font-mono">
                All India Free Delivery Included
              </span>
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
              {product.fullDescription || product.shortDescription}
            </p>

            {/* Variants Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                  Select Edition / Style:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                        selectedVariant?.id === variant.id
                          ? 'border-amber-400 bg-amber-500/10 text-amber-300 shadow-md'
                          : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                      }`}
                    >
                      <span>{variant.name}</span>
                      <span className="font-mono text-zinc-500 ml-1.5">({formatPrice(variant.price)})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Packaging Option Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5 text-amber-400" />
                <span>Presentation Packaging:</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {packagingOptions.slice(0, 4).map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPackaging(pkg)}
                    className={`p-2.5 rounded-xl text-left border text-xs transition-all cursor-pointer ${
                      selectedPackaging.id === pkg.id
                        ? 'border-amber-400 bg-amber-500/10 text-amber-200'
                        : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="font-semibold text-zinc-200 text-[11px] truncate">{pkg.name}</div>
                    <div className="font-mono text-[10px] text-zinc-400">
                      {pkg.price > 0 ? `+${formatPrice(pkg.price)}` : 'Complimentary'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Personalization Toggle Banner if Applicable */}
            {product.isPersonalizable && (
              <div className="p-4 bg-gradient-to-r from-rose-950/40 to-amber-950/30 border border-rose-800/40 rounded-2xl flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                    Artisan Laser Engraving Available
                  </span>
                  <p className="text-[11px] text-zinc-400">
                    Customize names, dates, roman numerals, or message coordinates.
                  </p>
                </div>
                <button
                  onClick={() => setShowPersonalizer(!showPersonalizer)}
                  className="px-3.5 py-1.5 bg-rose-500 hover:bg-rose-400 text-zinc-950 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap"
                >
                  {showPersonalizer ? 'Hide Studio' : 'Open Customizer'}
                </button>
              </div>
            )}

            {/* Regular Add To Bag / Buy Button */}
            {!showPersonalizer && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1 text-xs">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 text-zinc-400 hover:text-zinc-100 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-2 font-mono font-bold text-zinc-100">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1 text-zinc-400 hover:text-zinc-100 cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddRegularToCart}
                    className="flex-1 py-3.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Shopping Bag • {formatPrice(currentPrice * quantity)}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Atelier Assurance Highlights */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-800/80 text-[11px] text-zinc-400">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Express 48h Dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Genuine Silver/Gold</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>7-Day Replacement</span>
              </div>
            </div>

          </div>
        </div>

        {/* Live Personalizer Studio Component (If Open) */}
        {showPersonalizer && (
          <div className="pt-6">
            <PersonalizedProductBuilder
              product={product}
              selectedPackaging={selectedPackaging}
              onPackagingChange={setSelectedPackaging}
              onAddToCart={handleAddPersonalizedToCart}
            />
          </div>
        )}

        {/* Complete Verified Customer Reviews Section */}
        <ProductReviewsSection product={product} />

      </div>
    </div>
  );
};
