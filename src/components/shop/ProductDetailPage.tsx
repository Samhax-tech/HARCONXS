import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductVariant, PackagingOption, PersonalizationConfig } from '../../types';
import { PersonalizedProductBuilder } from '../personalizer/PersonalizedProductBuilder';
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Share2,
  Gift
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const {
    selectedProductId,
    products,
    packagingOptions,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setCurrentView,
    showToast
  } = useStore();

  const product = products.find(p => p.id === selectedProductId) || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );
  const [selectedPackaging, setSelectedPackaging] = useState<PackagingOption>(packagingOptions[0]);
  const [quantity, setQuantity] = useState(1);
  const [showPersonalizer, setShowPersonalizer] = useState(product.isPersonalizable ?? false);

  // Reviews state
  const [reviews, setReviews] = useState([
    {
      id: 'rev-1',
      author: 'Evelyn V.',
      rating: 5,
      date: 'August 12, 2026',
      comment: 'Absolutely blown away by the packaging and quality. The laser engraving is crisp and deep.',
      verified: true
    },
    {
      id: 'rev-2',
      author: 'David L.',
      rating: 5,
      date: 'July 28, 2026',
      comment: 'Super fast international shipping. Received in a velvet lined box that made my gift reveal special.',
      verified: true
    }
  ]);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');

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

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewText.trim()) return;

    setReviews(prev => [
      {
        id: `rev-${Date.now()}`,
        author: newReviewName,
        rating: newReviewRating,
        date: 'Today',
        comment: newReviewText,
        verified: true
      },
      ...prev
    ]);
    setNewReviewName('');
    setNewReviewText('');
    showToast('Thank you! Review published successfully.');
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
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-xl">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md border transition-colors cursor-pointer ${
                  inWishlist ? 'bg-rose-950/80 border-rose-600 text-rose-400' : 'bg-zinc-950/70 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                className="absolute top-4 left-4 p-2.5 rounded-full bg-zinc-950/70 backdrop-blur-md border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title="Share link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      activeImageIndex === idx ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover bg-zinc-900" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right 6 cols: Details & Buy Section */}
          <div className="lg:col-span-6 space-y-6">
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest">{product.sku}</span>
                <span className="text-zinc-600">•</span>
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">{product.brand}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-100">{product.name}</h1>

              {/* Rating & Reviews count */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 text-amber-400 text-xs">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                  <span className="font-bold ml-1 text-zinc-200">{product.rating}</span>
                </div>
                <span className="text-zinc-500 text-xs">({product.reviewCount} customer reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-3xl font-bold text-zinc-100 font-sans">{formatPrice(currentPrice)}</span>
                {product.compareAtPrice && (
                  <span className="text-base text-zinc-500 line-through">{formatPrice(product.compareAtPrice)}</span>
                )}
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                  In Stock ({product.inventory} units available)
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {product.fullDescription}
            </p>

            {/* Variants Picker if available */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <label className="text-xs font-semibold text-zinc-200">Select Style / Material Variant:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        selectedVariant?.id === v.id
                          ? 'bg-zinc-900 border-amber-400/80 ring-1 ring-amber-400/30 text-white'
                          : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <p className="font-semibold text-zinc-200">{v.name}</p>
                      <p className="font-mono text-zinc-400 text-[11px] mt-0.5">{formatPrice(v.price)}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Packaging Picker if not in personalization mode */}
            {!product.isPersonalizable && (
              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-amber-400" />
                  <span>Complimentary Packaging:</span>
                </label>
                <select
                  value={selectedPackaging.id}
                  onChange={(e) => {
                    const found = packagingOptions.find(p => p.id === e.target.value);
                    if (found) setSelectedPackaging(found);
                  }}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 outline-none cursor-pointer"
                >
                  {packagingOptions.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.price === 0 ? 'FREE' : `+${formatPrice(p.price)}`})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Quantity & Action */}
            {!product.isPersonalizable && (
              <div className="flex items-center gap-4 pt-4 border-t border-zinc-800">
                <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-zinc-400 hover:text-zinc-100 font-bold px-2 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-mono text-sm font-semibold text-zinc-100 px-3">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-zinc-400 hover:text-zinc-100 font-bold px-2 cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddRegularToCart}
                  className="flex-1 bg-zinc-100 hover:bg-white text-zinc-950 font-bold py-3 px-6 rounded-xl text-xs sm:text-sm transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag • {formatPrice(currentPrice * quantity)}</span>
                </button>
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-800/80 text-[11px] text-zinc-400">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Express Courier</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Laser Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Easy Exchanges</span>
              </div>
            </div>

          </div>
        </div>

        {/* Embedded Personalization Builder if product is personalizable */}
        {product.isPersonalizable && (
          <div className="pt-8 border-t border-zinc-800">
            <PersonalizedProductBuilder
              product={product}
              selectedPackaging={selectedPackaging}
              onPackagingChange={setSelectedPackaging}
              onAddToCart={handleAddPersonalizedToCart}
            />
          </div>
        )}

        {/* Customer Reviews & Form Section */}
        <div className="pt-10 border-t border-zinc-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-serif font-bold text-zinc-100">Customer Reviews & Atelier Ratings</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Real verified purchases and unboxing feedback</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Reviews List (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-zinc-200 text-xs">{rev.author}</p>
                      {rev.verified && (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/50">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-zinc-500">{rev.date}</span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed font-sans">{rev.comment}</p>
                </div>
              ))}
            </div>

            {/* Write a review form (4 cols) */}
            <div className="lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-4 h-fit">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">Share Your Experience</h4>
              <form onSubmit={handleAddReview} className="space-y-3 text-xs">
                <div>
                  <label className="text-zinc-400 block mb-1">Your Name</label>
                  <input
                    type="text"
                    value={newReviewName}
                    onChange={(e) => setNewReviewName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-100 outline-none focus:border-zinc-600"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">Rating</label>
                  <select
                    value={newReviewRating}
                    onChange={(e) => setNewReviewRating(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-100 outline-none cursor-pointer"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5/5 Exceptional)</option>
                    <option value={4}>⭐⭐⭐⭐ (4/5 Great)</option>
                    <option value={3}>⭐⭐⭐ (3/5 Good)</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">Review</label>
                  <textarea
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    rows={3}
                    placeholder="How was the craftsmanship and packaging?"
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-100 outline-none focus:border-zinc-600 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-zinc-100 hover:bg-white text-zinc-950 font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Submit Review
                </button>
              </form>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
