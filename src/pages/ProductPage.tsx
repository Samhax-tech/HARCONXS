import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ProductVariant, PackagingOption, PersonalizationConfig, Product } from '../types';
import { PersonalizedProductBuilder } from '../components/personalizer/PersonalizedProductBuilder';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
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
  Layers,
  ArrowRight,
  PackageSearch
} from 'lucide-react';

export const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const {
    products,
    packagingOptions,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    showToast,
    reviews: allReviews,
    addProductReview,
    currentUser,
    isUserLoggedIn,
    openAuthModalWithAction
  } = useStore();

  // Find product by slug or ID
  const product = useMemo(() => {
    if (!slug) return null;
    return products.find(p => p.slug === slug || p.id === slug) || null;
  }, [products, slug]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [selectedPackaging, setSelectedPackaging] = useState<PackagingOption>(packagingOptions[0] || {
    id: 'pkg-standard',
    name: 'Atelier Signature Box',
    description: 'Black textured matte gift box with gold foil seal',
    price: 0,
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&auto=format&fit=crop&q=80'
  });
  const [quantity, setQuantity] = useState(1);
  const [showPersonalizer, setShowPersonalizer] = useState(false);

  // Review submission state
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewName, setNewReviewName] = useState(currentUser?.name || '');
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [likedReviews, setLikedReviews] = useState<Record<string, number>>({});

  useEffect(() => {
    if (product) {
      if (product.variants && product.variants.length > 0) {
        setSelectedVariant(product.variants[0]);
      } else {
        setSelectedVariant(undefined);
      }
      setShowPersonalizer(Boolean(product.isPersonalizable));
      setActiveImageIndex(0);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-[80vh] bg-zinc-950 py-16 px-4 text-center">
        <div className="max-w-md mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto text-amber-400">
            <PackageSearch className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-serif font-bold text-white">Product Not Found</h1>
            <p className="text-xs text-zinc-400">
              The creation you are looking for may have been retired or moved to our bespoke archive.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/shop"
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold rounded-xl transition-colors"
            >
              Browse Catalog
            </Link>
            <Link
              to="/custom-products"
              className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-xl transition-colors"
            >
              Request Custom Build
            </Link>
          </div>
        </div>
      </div>
    );
  }

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

    addProductReview(product.id, {
      userName: authorName,
      rating: newReviewRating,
      title: newReviewTitle.trim() || 'Exceptional Atelier Craftsmanship',
      comment: newReviewText.trim(),
      verified: true
    });

    setNewReviewText('');
    setNewReviewTitle('');
  };

  // Structured Data Schema for SEO
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images,
    "description": product.fullDescription,
    "sku": product.sku,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "HARCONXS"
    },
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "INR",
      "price": currentPrice,
      "availability": product.inventory > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": avgRating,
      "reviewCount": totalReviewsCount || 1
    }
  };

  // Related products
  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.tags.some(t => product.tags.includes(t))))
    .slice(0, 4);

  return (
    <div className="bg-zinc-950 min-h-screen py-8 text-zinc-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Breadcrumbs
            items={[
              { label: 'Shop', view: 'catalog' },
              { label: product.category.toUpperCase(), category: product.category },
              { label: product.name }
            ]}
          />

          <div className="flex items-center gap-3">
            <Link
              to="/compare"
              className="text-xs text-zinc-400 hover:text-amber-400 transition-colors flex items-center gap-1 font-mono"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Compare Specs</span>
            </Link>
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors cursor-pointer"
              title="Share Link"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Product Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Left Column: Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {/* Wishlist floating toggle */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-4 right-4 p-3 rounded-2xl bg-zinc-950/80 backdrop-blur-md border border-zinc-800 text-zinc-300 hover:text-rose-500 transition-colors cursor-pointer"
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 pointer-events-none">
                {product.badges.map((b, i) => (
                  <span
                    key={i}
                    className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-lg shadow-lg ${
                      b === 'Best Seller'
                        ? 'bg-amber-500 text-zinc-950'
                        : b === 'Sale'
                        ? 'bg-rose-500 text-white'
                        : b === 'Personalized'
                        ? 'bg-purple-600 text-white'
                        : 'bg-zinc-900 text-zinc-200 border border-zinc-700'
                    }`}
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>

            {/* Thumbnail Carousel */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-amber-500 ring-2 ring-amber-500/20'
                        : 'border-zinc-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust highlights */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-zinc-900/40 border border-zinc-800/60 rounded-2xl text-center space-y-1">
                <Truck className="w-4 h-4 text-amber-400 mx-auto" />
                <p className="text-[11px] font-semibold text-zinc-200">Express India</p>
                <p className="text-[10px] text-zinc-500">2-4 Business Days</p>
              </div>
              <div className="p-3 bg-zinc-900/40 border border-zinc-800/60 rounded-2xl text-center space-y-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto" />
                <p className="text-[11px] font-semibold text-zinc-200">Authentic 316L/18K</p>
                <p className="text-[10px] text-zinc-500">Lifetime Warranty</p>
              </div>
              <div className="p-3 bg-zinc-900/40 border border-zinc-800/60 rounded-2xl text-center space-y-1">
                <RotateCcw className="w-4 h-4 text-sky-400 mx-auto" />
                <p className="text-[11px] font-semibold text-zinc-200">7-Day Exchange</p>
                <p className="text-[10px] text-zinc-500">Hassle-free process</p>
              </div>
            </div>
          </div>

          {/* Right Column: Details, Personalizer & Purchase */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">{product.category} atelier</span>
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold bg-amber-950/40 border border-amber-800/50 px-2.5 py-1 rounded-full">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{avgRating}</span>
                  <span className="text-zinc-500 font-normal">({totalReviewsCount} reviews)</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white leading-tight">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-amber-400">
                  {formatPrice(currentPrice)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > currentPrice && (
                  <span className="text-sm font-mono text-zinc-500 line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
                {product.compareAtPrice && (
                  <span className="text-xs text-rose-400 font-semibold bg-rose-950/50 border border-rose-800/50 px-2 py-0.5 rounded-md">
                    SAVE {Math.round(((product.compareAtPrice - currentPrice) / product.compareAtPrice) * 100)}%
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {product.fullDescription}
            </p>

            {/* Variants Selection */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  Select Style / Material Variant
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedVariant?.id === v.id
                          ? 'bg-amber-500/10 border-amber-500 text-white shadow-md shadow-amber-500/5'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <p className="text-xs font-semibold text-zinc-100 truncate">{v.name}</p>
                      <p className="text-[11px] font-mono text-amber-400 mt-0.5">{formatPrice(v.price)}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Packaging Selection */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-amber-400" />
                  <span>Keepsake Packaging</span>
                </label>
                <span className="text-[11px] text-zinc-400 font-mono">
                  {selectedPackaging.price === 0 ? 'Complimentary' : `+ ${formatPrice(selectedPackaging.price)}`}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {packagingOptions.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPackaging(pkg)}
                    className={`p-2.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                      selectedPackaging.id === pkg.id
                        ? 'bg-amber-500/10 border-amber-500 text-white'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <img src={pkg.image} alt={pkg.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-zinc-200 truncate">{pkg.name}</p>
                      <p className="text-[10px] text-zinc-500 truncate">{pkg.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Personalization Section / Toggle */}
            {product.isPersonalizable ? (
              <div className="pt-2">
                <PersonalizedProductBuilder
                  product={product}
                  onAddToCart={handleAddPersonalizedToCart}
                  formatPrice={formatPrice}
                />
              </div>
            ) : (
              <div className="space-y-4 pt-4 border-t border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-200 hover:bg-zinc-700 flex items-center justify-center font-bold text-sm cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-mono text-xs font-bold text-zinc-100">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-200 hover:bg-zinc-700 flex items-center justify-center font-bold text-sm cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddRegularToCart}
                    className="flex-1 py-3.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 cursor-pointer transition-all uppercase tracking-wider"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Shopping Bag • {formatPrice((currentPrice + selectedPackaging.price) * quantity)}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="pt-12 border-t border-zinc-800/80 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-amber-400 uppercase">Verified Atelier Feedback</span>
              <h2 className="text-2xl font-serif font-bold text-white mt-1">Customer Reviews & Testimonials</h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-2xl font-bold font-mono text-amber-400">{avgRating} / 5.0</p>
                <p className="text-xs text-zinc-500">Based on {totalReviewsCount} verified orders</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-4">
              {productReviews.length === 0 ? (
                <div className="p-8 bg-zinc-900/40 rounded-3xl border border-zinc-800 text-center space-y-2">
                  <p className="text-sm text-zinc-300 font-semibold">Be the first to review this atelier creation</p>
                  <p className="text-xs text-zinc-500">Share your thoughts on craftsmanship, packaging, and laser engraving.</p>
                </div>
              ) : (
                productReviews.map((rev) => (
                  <div key={rev.id} className="p-5 bg-zinc-900/50 border border-zinc-800/80 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center font-mono">
                          {rev.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-zinc-200">{rev.userName}</p>
                          {rev.verified && (
                            <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                              <CheckCircle2 className="w-3 h-3" /> Verified Buyer
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-amber-400 text-xs">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-bold text-zinc-100">{rev.title}</p>
                      <p className="text-xs text-zinc-400 leading-relaxed">{rev.comment}</p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
                      <span>{new Date(rev.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <button
                        onClick={() => handleLikeReview(rev.id)}
                        className="flex items-center gap-1 hover:text-zinc-300 transition-colors cursor-pointer"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>Helpful ({rev.likes + (likedReviews[rev.id] || 0)})</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Write a Review Form */}
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 space-y-4 h-fit">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200">Write a Review</h3>

              <form onSubmit={handleAddReview} className="space-y-3">
                <div className="space-y-1">
                  <label className="block text-xs text-zinc-400">Your Rating</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReviewRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-1 text-amber-400 cursor-pointer"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            (hoverRating || newReviewRating) >= star
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-zinc-700'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs text-zinc-400">Review Headline</label>
                  <input
                    type="text"
                    value={newReviewTitle}
                    onChange={(e) => setNewReviewTitle(e.target.value)}
                    placeholder="e.g. Stunning engraving and presentation"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs text-zinc-400">Detailed Review</label>
                  <textarea
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    rows={3}
                    placeholder="Describe the build quality, weight, finish, and packaging..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold rounded-xl cursor-pointer transition-all"
                >
                  Submit Verified Review
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Related Creations */}
        {relatedProducts.length > 0 && (
          <div className="pt-12 border-t border-zinc-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase">Complementary Creations</span>
                <h2 className="text-xl font-serif font-bold text-white">Frequently Paired Together</h2>
              </div>
              <Link to="/shop" className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1">
                <span>View Full Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  className="group bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden hover:border-amber-500/40 transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-square bg-zinc-950">
                    <Link to={`/product/${rel.slug || rel.id}`}>
                      <img src={rel.images[0]} alt={rel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </Link>
                  </div>
                  <div className="p-4 space-y-2">
                    <Link to={`/product/${rel.slug || rel.id}`} className="block text-xs font-bold font-serif text-zinc-100 hover:text-amber-400 truncate">
                      {rel.name}
                    </Link>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-amber-400">{formatPrice(rel.price)}</span>
                      <Link to={`/product/${rel.slug || rel.id}`} className="text-[11px] text-zinc-400 hover:text-white">
                        View Piece →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
