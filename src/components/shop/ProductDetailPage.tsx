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
  Gift,
  ThumbsUp,
  MessageSquare,
  Award,
  Layers
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
    showToast,
    reviews: allReviews,
    addProductReview,
    currentUser,
    isUserLoggedIn,
    openAuthModalWithAction
  } = useStore();

  const product = products.find(p => p.id === selectedProductId) || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );
  const [selectedPackaging, setSelectedPackaging] = useState<PackagingOption>(packagingOptions[0]);
  const [quantity, setQuantity] = useState(1);
  const [showPersonalizer, setShowPersonalizer] = useState(product.isPersonalizable ?? false);

  // Review submission state
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewName, setNewReviewName] = useState(currentUser?.name || '');
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [likedReviews, setLikedReviews] = useState<Record<string, number>>({});

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const inWishlist = isInWishlist(product.id);

  // Filter reviews for this specific product
  const productReviews = allReviews.filter(r => r.productId === product.id);
  const totalReviewsCount = productReviews.length;
  const avgRating = totalReviewsCount > 0
    ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviewsCount).toFixed(1)
    : product.rating.toFixed(1);

  // Rating distribution calculation
  const getRatingCount = (star: number) => productReviews.filter(r => Math.round(r.rating) === star).length;
  const getRatingPercentage = (star: number) => totalReviewsCount > 0 ? (getRatingCount(star) / totalReviewsCount) * 100 : star === 5 ? 85 : 15;

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

  const handleLikeReview = (reviewId: string) => {
    setLikedReviews(prev => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1
    }));
    showToast('Marked as helpful review.');
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    const authorName = newReviewName.trim() || currentUser?.name || 'Verified Harconxs Buyer';
    if (!newReviewText.trim()) {
      showToast('Please write a review comment.');
      return;
    }

    addProductReview({
      productId: product.id,
      userName: authorName,
      rating: newReviewRating,
      title: newReviewTitle.trim() || 'Exceptional craftsmanship & luxury finish',
      comment: newReviewText.trim(),
      verified: isUserLoggedIn
    });

    setNewReviewTitle('');
    setNewReviewText('');
    if (!currentUser) setNewReviewName('');
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

        {/* Customer Reviews & Rating System Section */}
        <div className="pt-12 border-t border-zinc-800 space-y-8">
          
          {/* Header & Rating Breakdown Banner */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Score summary (4 cols) */}
              <div className="lg:col-span-4 text-center lg:text-left space-y-2 border-b lg:border-b-0 lg:border-r border-zinc-800 pb-6 lg:pb-0 lg:pr-8">
                <span className="text-[11px] uppercase tracking-widest font-mono text-amber-400 block font-bold">
                  Verified Atelier Ratings
                </span>
                <div className="flex items-baseline justify-center lg:justify-start gap-2">
                  <span className="text-5xl font-serif font-bold text-zinc-100">{avgRating}</span>
                  <span className="text-sm font-mono text-zinc-500">/ 5.0</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.round(Number(avgRating)) ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-zinc-400">
                  Based on {totalReviewsCount} authentic reviews with verified purchase certificates
                </p>
              </div>

              {/* Middle Breakdown Bars (5 cols) */}
              <div className="lg:col-span-5 space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const pct = getRatingPercentage(star);
                  const count = getRatingCount(star);
                  return (
                    <div key={star} className="flex items-center gap-3 text-xs">
                      <span className="font-mono text-zinc-400 w-12 flex items-center gap-1">
                        <span>{star}</span>
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      </span>
                      <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="font-mono text-zinc-500 text-[11px] w-8 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>

              {/* Right CTA / Quality Guarantee (3 cols) */}
              <div className="lg:col-span-3 text-center lg:text-right space-y-2 bg-zinc-950/60 p-4 rounded-2xl border border-zinc-800">
                <div className="flex items-center justify-center lg:justify-end gap-1.5 text-emerald-400 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>100% Verified Buyers</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Only customers with confirmed order numbers can leave stamped verification badges.
                </p>
              </div>

            </div>
          </div>

          {/* Reviews List and Review Submission Form */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Reviews Feed (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200">
                  Customer Reviews ({productReviews.length})
                </h3>
              </div>

              {productReviews.length === 0 ? (
                <div className="p-8 text-center bg-zinc-900/30 border border-zinc-800/60 rounded-2xl space-y-2">
                  <MessageSquare className="w-8 h-8 text-zinc-600 mx-auto" />
                  <p className="text-xs text-zinc-400">Be the first to review this handcrafted HARCONXS piece!</p>
                </div>
              ) : (
                productReviews.map((rev) => (
                  <div key={rev.id} className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 space-y-3 shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 font-bold text-xs flex items-center justify-center">
                          {rev.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-zinc-200 text-xs">{rev.userName}</p>
                          <span className="text-[10px] text-zinc-500 font-mono">{rev.date}</span>
                        </div>
                      </div>

                      {rev.verified && (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified Buyer
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'}`}
                        />
                      ))}
                      {rev.title && (
                        <span className="text-xs font-bold text-zinc-200 ml-2">{rev.title}</span>
                      )}
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed font-sans">{rev.comment}</p>

                    {rev.images && rev.images.length > 0 && (
                      <div className="flex items-center gap-2 pt-1">
                        {rev.images.map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt="Customer upload"
                            className="w-16 h-16 rounded-lg object-cover border border-zinc-800"
                          />
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-[11px] text-zinc-500">
                      <span>Helpful review?</span>
                      <button
                        onClick={() => handleLikeReview(rev.id)}
                        className="flex items-center gap-1 text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{(rev.likes || 0) + (likedReviews[rev.id] || 0)} Helpful</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Write a review form (5 cols) */}
            <div className="lg:col-span-5 bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 space-y-4 h-fit shadow-xl">
              <div className="space-y-1">
                <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-100 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Write a Product Review</span>
                </h4>
                <p className="text-xs text-zinc-400">Share your unboxing thoughts and laser engraving rating.</p>
              </div>

              <form onSubmit={handleAddReview} className="space-y-4 text-xs">
                
                {/* Interactive Star Rating Selector */}
                <div>
                  <label className="text-zinc-300 block mb-1.5 font-medium">Overall Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewReviewRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-1 cursor-pointer transition-transform hover:scale-110"
                        aria-label={`${star} star rating`}
                      >
                        <Star
                          className={`w-6 h-6 ${
                            (hoverRating !== null ? star <= hoverRating : star <= newReviewRating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-zinc-700'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="font-mono text-xs font-bold text-amber-300 ml-2">
                      {hoverRating !== null ? hoverRating : newReviewRating} / 5
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-zinc-300 block mb-1 font-medium">Review Title / Headline</label>
                  <input
                    type="text"
                    value={newReviewTitle}
                    onChange={(e) => setNewReviewTitle(e.target.value)}
                    placeholder="e.g. Stunning coordinates precision and luxury packaging"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-100 outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-zinc-300 block mb-1 font-medium">Your Name / Order Name</label>
                  <input
                    type="text"
                    value={newReviewName}
                    onChange={(e) => setNewReviewName(e.target.value)}
                    placeholder={currentUser ? currentUser.name : 'e.g. Ananya Sharma'}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-100 outline-none focus:border-amber-400 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="text-zinc-300 block mb-1 font-medium">Detailed Feedback & Craftsmanship</label>
                  <textarea
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    rows={4}
                    placeholder="How was the engraving precision, weight, packaging box, and delivery speed?"
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-100 outline-none focus:border-amber-400 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/10 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-zinc-950" />
                  <span>Publish Product Review</span>
                </button>
              </form>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
