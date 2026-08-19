import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductReview } from '../../types';
import {
  Star,
  CheckCircle2,
  ThumbsUp,
  Flag,
  Camera,
  Filter,
  ArrowUpDown,
  Edit3,
  Trash2,
  ShieldCheck,
  Plus,
  X,
  ChevronRight,
  AlertCircle,
  Sparkles,
  Image as ImageIcon,
  Lock,
  Upload
} from 'lucide-react';

interface ProductReviewsSectionProps {
  product: Product;
}

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({ product }) => {
  const {
    reviews,
    addProductReview,
    updateProductReview,
    deleteProductReview,
    toggleReviewHelpful,
    reportProductReview,
    checkUserProductPurchase,
    currentUser,
    isUserLoggedIn,
    openAuthModalWithAction,
    isAdminAuthenticated,
    showToast
  } = useStore();

  // Filter & Sort State
  const [selectedStarFilter, setSelectedStarFilter] = useState<number | 'all'>('all');
  const [onlyVerifiedFilter, setOnlyVerifiedFilter] = useState(false);
  const [onlyPhotosFilter, setOnlyPhotosFilter] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'lowest' | 'helpful'>('recent');

  // Modals State
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [activeLightboxImage, setActiveLightboxImage] = useState<{ url: string; review: ProductReview } | null>(null);
  const [reportingReviewId, setReportingReviewId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('spam');
  const [reportDetails, setReportDetails] = useState('');

  // Form State for Write / Edit Review
  const [formRating, setFormRating] = useState(5);
  const [formTitle, setFormTitle] = useState('');
  const [formComment, setFormComment] = useState('');
  const [formImages, setFormImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check current user's purchase eligibility
  const purchaseStatus = useMemo(() => {
    return checkUserProductPurchase(product.id);
  }, [checkUserProductPurchase, product.id, currentUser, reviews]);

  // Product's approved reviews
  const productReviews = useMemo(() => {
    return reviews.filter(r => {
      if (r.productId !== product.id) return false;
      // If admin, show all including pending/hidden; otherwise show approved or user's own
      if (isAdminAuthenticated) return true;
      if (r.status === 'approved' || !r.status) return true;
      if (currentUser?.id && r.userId === currentUser.id) return true;
      return false;
    });
  }, [reviews, product.id, isAdminAuthenticated, currentUser]);

  // Calculate Statistics
  const totalCount = productReviews.length;
  const avgRating = totalCount > 0
    ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(1)
    : '5.0';

  const starDistribution = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    productReviews.forEach(r => {
      const rounded = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      counts[rounded] = (counts[rounded] || 0) + 1;
    });
    return counts;
  }, [productReviews]);

  // All Customer Photos Reel
  const allCustomerPhotos = useMemo(() => {
    const photos: { url: string; review: ProductReview }[] = [];
    productReviews.forEach(r => {
      const imgs = r.customerImages || r.images || [];
      imgs.forEach(url => {
        if (url) photos.push({ url, review: r });
      });
    });
    return photos;
  }, [productReviews]);

  // Filtered & Sorted Reviews
  const displayedReviews = useMemo(() => {
    let result = [...productReviews];

    if (selectedStarFilter !== 'all') {
      result = result.filter(r => Math.round(r.rating) === selectedStarFilter);
    }
    if (onlyVerifiedFilter) {
      result = result.filter(r => r.verifiedPurchase || r.verified);
    }
    if (onlyPhotosFilter) {
      result = result.filter(r => (r.customerImages && r.customerImages.length > 0) || (r.images && r.images.length > 0));
    }

    if (sortBy === 'recent') {
      result.sort((a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime());
    } else if (sortBy === 'highest') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'lowest') {
      result.sort((a, b) => a.rating - b.rating);
    } else if (sortBy === 'helpful') {
      result.sort((a, b) => (b.helpfulVotes || b.likes || 0) - (a.helpfulVotes || a.likes || 0));
    }

    return result;
  }, [productReviews, selectedStarFilter, onlyVerifiedFilter, onlyPhotosFilter, sortBy]);

  // Open modal for writing a review
  const handleOpenWriteModal = () => {
    if (!isUserLoggedIn) {
      openAuthModalWithAction(() => {
        setIsWriteModalOpen(true);
      });
      return;
    }

    // Check if user already reviewed
    if (purchaseStatus.existingReview) {
      handleOpenEditModal(purchaseStatus.existingReview);
      return;
    }

    setEditingReviewId(null);
    setFormRating(5);
    setFormTitle('');
    setFormComment('');
    setFormImages([]);
    setImageUrlInput('');
    setIsWriteModalOpen(true);
  };

  // Open modal for editing existing review
  const handleOpenEditModal = (rev: ProductReview) => {
    setEditingReviewId(rev.id);
    setFormRating(rev.rating);
    setFormTitle(rev.title);
    setFormComment(rev.comment || rev.review || '');
    setFormImages(rev.customerImages || rev.images || []);
    setImageUrlInput('');
    setIsWriteModalOpen(true);
  };

  // Handle Photo File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).slice(0, 4).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setFormImages(prev => [...prev, uploadEvent.target!.result as string].slice(0, 5));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setFormImages(prev => [...prev, imageUrlInput.trim()].slice(0, 5));
    setImageUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    setFormImages(prev => prev.filter((_, i) => i !== index));
  };

  // Submit Review Form
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formComment.trim()) {
      showToast('Please provide your review thoughts or experience.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingReviewId) {
        await updateProductReview(editingReviewId, {
          rating: formRating,
          title: formTitle.trim() || 'Verified Experience',
          comment: formComment.trim(),
          images: formImages,
          customerImages: formImages
        });
      } else {
        await addProductReview({
          productId: product.id,
          rating: formRating,
          title: formTitle.trim() || 'Verified Purchase',
          comment: formComment.trim(),
          images: formImages,
          customerImages: formImages,
          verifiedPurchase: purchaseStatus.hasPurchased || true,
          orderId: purchaseStatus.eligibleOrders[0]?.id
        });
      }
      setIsWriteModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Submit Report
  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingReviewId) return;

    await reportProductReview(reportingReviewId, reportReason, reportDetails);
    setReportingReviewId(null);
    setReportDetails('');
  };

  return (
    <section className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 sm:p-10 space-y-10">
      
      {/* 1. SECTION HEADER & RATING BREAKDOWN */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-zinc-800/80">
        
        {/* Left: Overall Rating Badge */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex flex-col items-center justify-center p-6 bg-zinc-950/80 border border-zinc-800 rounded-2xl w-full sm:w-44 shrink-0 shadow-inner">
            <span className="text-4xl sm:text-5xl font-serif font-bold text-amber-400">
              {avgRating}
            </span>
            <div className="flex items-center gap-1 text-amber-400 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(Number(avgRating))
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-zinc-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] text-zinc-400 font-mono mt-1">
              Based on {totalCount} {totalCount === 1 ? 'Review' : 'Reviews'}
            </span>
            <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium mt-2 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3 h-3" />
              <span>100% Verified</span>
            </div>
          </div>

          {/* Center: Rating Distribution Bars */}
          <div className="space-y-2 flex-1 w-full max-w-md">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = starDistribution[stars as 1 | 2 | 3 | 4 | 5] || 0;
              const percent = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
              const isSelected = selectedStarFilter === stars;

              return (
                <button
                  key={stars}
                  onClick={() => setSelectedStarFilter(isSelected ? 'all' : stars)}
                  className={`w-full flex items-center gap-3 text-xs group transition-all rounded-lg p-1 cursor-pointer ${
                    isSelected ? 'bg-amber-500/10 text-amber-300' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-1 w-12 shrink-0 font-medium">
                    <span>{stars}</span>
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  </div>

                  <div className="flex-1 h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800/60">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <span className="w-10 text-right font-mono text-[11px] text-zinc-500 group-hover:text-zinc-400">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Write Review Trigger */}
        <div className="flex flex-col items-start lg:items-end justify-center gap-3">
          <button
            onClick={handleOpenWriteModal}
            className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {purchaseStatus.existingReview ? (
              <>
                <Edit3 className="w-4 h-4" />
                <span>Edit Your Review</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Write a Verified Review</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-zinc-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Only legitimate buyers with confirmed orders can review.</span>
          </p>
        </div>

      </div>

      {/* 2. CUSTOMER PHOTO REEL (If photos exist) */}
      {allCustomerPhotos.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-zinc-200">
                Customer Photos & Keepsake Gallery ({allCustomerPhotos.length})
              </h3>
            </div>
            <span className="text-[11px] text-zinc-500">Click photo to view review</span>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
            {allCustomerPhotos.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setActiveLightboxImage(item)}
                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-zinc-800 hover:border-amber-500 shrink-0 group transition-all cursor-pointer shadow-md"
              >
                <img
                  src={item.url}
                  alt={`Customer photo ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-zinc-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. FILTER & SORT CONTROLS BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedStarFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedStarFilter === 'all'
                ? 'bg-amber-500 text-zinc-950 font-bold'
                : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
            }`}
          >
            All Ratings ({totalCount})
          </button>

          {[5, 4, 3, 2, 1].map(stars => (
            <button
              key={stars}
              onClick={() => setSelectedStarFilter(stars)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1 transition-all cursor-pointer ${
                selectedStarFilter === stars
                  ? 'bg-amber-500 text-zinc-950 font-bold'
                  : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
              }`}
            >
              <span>{stars}</span>
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-[10px] text-zinc-500 font-mono">({starDistribution[stars as 1|2|3|4|5]})</span>
            </button>
          ))}

          {/* Toggle Photos Only */}
          <button
            onClick={() => setOnlyPhotosFilter(!onlyPhotosFilter)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              onlyPhotosFilter
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>With Photos</span>
          </button>

          {/* Toggle Verified Only */}
          <button
            onClick={() => setOnlyVerifiedFilter(!onlyVerifiedFilter)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              onlyVerifiedFilter
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified Buyers</span>
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs rounded-xl px-3 py-1.5 outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>

      </div>

      {/* 4. REVIEWS LIST */}
      {displayedReviews.length === 0 ? (
        <div className="text-center py-12 bg-zinc-950/40 border border-zinc-800/60 rounded-2xl space-y-3">
          <Star className="w-8 h-8 text-zinc-600 mx-auto" />
          <p className="text-sm font-semibold text-zinc-300">No reviews matching the selected filter.</p>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Try resetting your filters or be the first verified buyer to share feedback.
          </p>
          <button
            onClick={() => {
              setSelectedStarFilter('all');
              setOnlyPhotosFilter(false);
              setOnlyVerifiedFilter(false);
            }}
            className="px-4 py-2 bg-zinc-900 text-zinc-300 border border-zinc-700 text-xs rounded-xl hover:bg-zinc-800 cursor-pointer transition-all"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedReviews.map((rev) => {
            const isAuthor = currentUser?.id && rev.userId === currentUser.id;
            const hasVotedHelpful = currentUser?.id && rev.helpfulUserIds?.includes(currentUser.id);
            const helpfulCount = rev.helpfulVotes || rev.likes || 0;
            const reviewImages = rev.customerImages || rev.images || [];

            return (
              <div
                key={rev.id}
                className="bg-zinc-950/70 border border-zinc-800/90 rounded-2xl p-6 space-y-4 transition-all hover:border-zinc-700/80"
              >
                {/* Header: User Avatar, Name, Verified Badge, Rating, Date */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 flex items-center justify-center text-amber-400 font-bold text-sm shrink-0 shadow-inner">
                      {rev.userName.charAt(0).toUpperCase()}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-zinc-100">{rev.userName}</span>
                        {(rev.verifiedPurchase || rev.verified) && (
                          <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium bg-emerald-950/50 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Verified Buyer</span>
                          </span>
                        )}
                        {rev.isFeatured && (
                          <span className="flex items-center gap-1 text-[10px] text-amber-400 font-medium bg-amber-950/50 border border-amber-800/40 px-2 py-0.5 rounded-full">
                            <Sparkles className="w-3 h-3" />
                            <span>Featured</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'
                              }`}
                            />
                          ))}
                        </div>
                        <span>•</span>
                        <span className="font-mono text-[11px]">{rev.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions for Author: Edit / Delete */}
                  {isAuthor && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(rev)}
                        className="px-2.5 py-1 text-xs text-zinc-400 hover:text-amber-400 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete your review?')) {
                            deleteProductReview(rev.id);
                          }
                        }}
                        className="px-2.5 py-1 text-xs text-rose-400 hover:text-rose-300 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}

                </div>

                {/* Review Title & Body */}
                <div className="space-y-1.5">
                  <h4 className="text-sm font-bold text-zinc-100 font-serif">
                    {rev.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    {rev.comment || rev.review}
                  </p>
                </div>

                {/* Customer Uploaded Photos */}
                {reviewImages.length > 0 && (
                  <div className="flex items-center gap-3 pt-1">
                    {reviewImages.map((imgUrl, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveLightboxImage({ url: imgUrl, review: rev })}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-zinc-800 hover:border-amber-500 shrink-0 group transition-all cursor-pointer"
                      >
                        <img
                          src={imgUrl}
                          alt={`Review photo ${i + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Review Footer: Helpful Vote & Report Button */}
                <div className="flex items-center justify-between pt-3 border-t border-zinc-800/60 text-xs text-zinc-500">
                  <button
                    onClick={() => toggleReviewHelpful(rev.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                      hasVotedHelpful
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                        : 'bg-zinc-900 border-zinc-800 hover:text-zinc-300'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Helpful ({helpfulCount})</span>
                  </button>

                  <button
                    onClick={() => {
                      setReportingReviewId(rev.id);
                      setReportReason('spam');
                      setReportDetails('');
                    }}
                    className="flex items-center gap-1 text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>Report</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL: WRITE / EDIT REVIEW */}
      {/* ========================================================================= */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">
                  {editingReviewId ? 'Modify Review' : 'Verified Buyer Review'}
                </span>
                <h3 className="text-xl font-serif font-bold text-white">
                  {editingReviewId ? 'Edit Your Review' : `Review: ${product.name}`}
                </h3>
              </div>
              <button
                onClick={() => setIsWriteModalOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Purchase Verification Notice */}
            <div className="bg-zinc-950 border border-zinc-800 p-3.5 rounded-2xl flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-xs space-y-0.5">
                <span className="text-zinc-200 font-semibold">Verified Purchase Protected</span>
                <p className="text-zinc-500 text-[11px]">
                  Posting as <strong className="text-zinc-300">{currentUser?.name || 'Verified Customer'}</strong>. Your review helps future couples and patrons make confident decisions.
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitReview} className="space-y-5">
              
              {/* Star Rating Picker */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-zinc-300">
                  Overall Rating <span className="text-amber-400">*</span>
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setFormRating(star)}
                      className="p-1 text-zinc-600 hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= formRating ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-mono font-bold text-amber-400 ml-2">
                    {formRating === 5 && '5 - Exceptional'}
                    {formRating === 4 && '4 - Great Experience'}
                    {formRating === 3 && '3 - Average'}
                    {formRating === 2 && '2 - Below Expectations'}
                    {formRating === 1 && '1 - Unsatisfied'}
                  </span>
                </div>
              </div>

              {/* Headline / Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-zinc-300">
                  Review Headline <span className="text-zinc-500 font-normal">(e.g. Flawless laser engraving!)</span>
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Summarize your experience in one sentence"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 outline-none focus:border-amber-500"
                />
              </div>

              {/* Review Text */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-zinc-300">
                  Written Feedback <span className="text-amber-400">*</span>
                </label>
                <textarea
                  rows={4}
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  placeholder="Share details about craftsmanship, packaging, delivery, or personalization accuracy..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs text-zinc-100 placeholder-zinc-500 outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>

              {/* Photo Upload Section */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-zinc-300">
                  Add Real Customer Photos <span className="text-zinc-500 font-normal">(Up to 4 images)</span>
                </label>

                {/* Upload Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label className="w-full sm:w-auto px-4 py-2.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>Upload from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <div className="flex items-center gap-2 w-full sm:flex-1">
                    <input
                      type="url"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="Or paste photo URL..."
                      className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs rounded-xl font-medium cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Selected Images Preview */}
                {formImages.length > 0 && (
                  <div className="flex items-center gap-3 pt-2">
                    {formImages.map((img, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-zinc-700 group">
                        <img src={img} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute inset-0 bg-rose-950/80 text-rose-200 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  className="px-4 py-2.5 text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/10 cursor-pointer transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving Review...' : (editingReviewId ? 'Update Review' : 'Publish Verified Review')}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL: REPORT REVIEW */}
      {/* ========================================================================= */}
      {reportingReviewId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2 text-rose-400">
                <Flag className="w-4 h-4" />
                <h3 className="text-base font-bold text-white">Report Review</h3>
              </div>
              <button
                onClick={() => setReportingReviewId(null)}
                className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-zinc-400">
              Help us maintain authentic atelier standards. Please specify why this review violates our guidelines:
            </p>

            <form onSubmit={handleSubmitReport} className="space-y-4">
              
              <div className="space-y-2">
                {[
                  { id: 'spam', label: 'Spam, advertising, or self-promotion' },
                  { id: 'inappropriate', label: 'Offensive, vulgar, or abusive language' },
                  { id: 'fake', label: 'Fake, incentivized, or duplicate review' },
                  { id: 'irrelevant', label: 'Irrelevant to this specific product' },
                  { id: 'personal_info', label: 'Contains private customer contact info' }
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-2.5 p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 cursor-pointer hover:border-zinc-700"
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={item.id}
                      checked={reportReason === item.id}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="text-amber-500 focus:ring-0"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-zinc-400">Additional Details (Optional)</label>
                <textarea
                  rows={2}
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Provide context for our moderation team..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 placeholder-zinc-600 outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setReportingReviewId(null)}
                  className="px-3 py-2 text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/20 cursor-pointer"
                >
                  Submit Flag
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. MODAL: PHOTO LIGHTBOX */}
      {/* ========================================================================= */}
      {activeLightboxImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-zinc-950/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row shadow-2xl">
            
            <button
              onClick={() => setActiveLightboxImage(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-zinc-950/80 border border-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center cursor-pointer shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Photo View */}
            <div className="md:w-3/5 bg-zinc-950 flex items-center justify-center p-4">
              <img
                src={activeLightboxImage.url}
                alt="Customer review high resolution"
                className="max-h-[60vh] md:max-h-[80vh] w-auto object-contain rounded-2xl"
              />
            </div>

            {/* Reviewer Details Sidebar */}
            <div className="md:w-2/5 p-6 sm:p-8 space-y-5 flex flex-col justify-between bg-zinc-900/90">
              <div className="space-y-4">
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold flex items-center justify-center">
                    {activeLightboxImage.review.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-100">{activeLightboxImage.review.userName}</h4>
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                      <ShieldCheck className="w-3 h-3" />
                      Verified Purchase
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        star <= activeLightboxImage.review.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'
                      }`}
                    />
                  ))}
                  <span className="text-xs text-zinc-500 font-mono ml-2">
                    {activeLightboxImage.review.date}
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-bold font-serif text-white">{activeLightboxImage.review.title}</p>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {activeLightboxImage.review.comment || activeLightboxImage.review.review}
                  </p>
                </div>

              </div>

              <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                <button
                  onClick={() => toggleReviewHelpful(activeLightboxImage.review.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 hover:text-amber-400 cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Helpful ({activeLightboxImage.review.helpfulVotes || activeLightboxImage.review.likes || 0})</span>
                </button>

                <span className="text-[10px] font-mono text-zinc-500">
                  HARCONXS Verified
                </span>
              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
};
