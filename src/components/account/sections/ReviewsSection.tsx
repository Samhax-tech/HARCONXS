import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { ProductReview, Product } from '../../../types';
import {
  Star,
  MessageSquare,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  ThumbsUp,
  Image as ImageIcon,
  ShoppingBag,
  X
} from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const {
    currentUser,
    reviews,
    products,
    orders,
    addProductReview,
    updateProductReview,
    deleteProductReview,
    formatPrice,
    showToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<'my_reviews' | 'awaiting_reviews'>('my_reviews');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  // Form fields
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const [title, setTitle] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');

  if (!currentUser) return null;

  // Filter reviews submitted by current user
  const userReviews = reviews.filter(r =>
    (r.userId && r.userId === currentUser.id) ||
    (r.userEmail && r.userEmail.toLowerCase() === currentUser.email.toLowerCase()) ||
    (r.userName && r.userName.toLowerCase() === currentUser.name.toLowerCase())
  );

  // Delivered items from user's orders that haven't been reviewed
  const userOrders = orders.filter(o =>
    o.customerId === currentUser.id ||
    (o.customerEmail && o.customerEmail.toLowerCase() === currentUser.email.toLowerCase())
  );

  const purchasedProductsMap = new Map<string, { product: Product | null; orderId: string; title: string; image: string }>();

  userOrders.forEach(ord => {
    ord.items.forEach(it => {
      const pid = it.product?.id || it.id;
      const matchedProd = it.product || products.find(p => p.id === pid) || null;
      if (!userReviews.some(r => r.productId === pid)) {
        purchasedProductsMap.set(pid, {
          product: matchedProd,
          orderId: ord.id,
          title: it.product?.name || 'Patron Commission Piece',
          image: it.product?.images?.[0] || '/images/default.jpg'
        });
      }
    });
  });

  const awaitingReviews = Array.from(purchasedProductsMap.entries()).map(([productId, data]) => ({
    productId,
    ...data
  }));

  const handleOpenWriteReview = (productId: string, orderId?: string) => {
    setEditingReviewId(null);
    setSelectedProductId(productId);
    setSelectedOrderId(orderId || '');
    setRating(5);
    setTitle('');
    setComment('');
    setImageUrl('');
    setIsModalOpen(true);
  };

  const handleOpenEditReview = (rev: ProductReview) => {
    setEditingReviewId(rev.id);
    setSelectedProductId(rev.productId);
    setSelectedOrderId(rev.orderId || '');
    setRating(rev.rating);
    setTitle(rev.title);
    setComment(rev.comment || rev.review || '');
    setImageUrl(rev.images?.[0] || rev.customerImages?.[0] || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) {
      showToast('Please select a product.');
      return;
    }

    if (editingReviewId) {
      await updateProductReview(editingReviewId, {
        rating,
        title,
        comment,
        review: comment,
        images: imageUrl ? [imageUrl] : [],
        customerImages: imageUrl ? [imageUrl] : []
      });
      showToast('Review updated successfully.');
    } else {
      await addProductReview({
        productId: selectedProductId,
        orderId: selectedOrderId || undefined,
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        rating,
        title,
        comment,
        review: comment,
        verified: true,
        verifiedPurchase: true,
        images: imageUrl ? [imageUrl] : [],
        customerImages: imageUrl ? [imageUrl] : [],
        status: 'approved'
      });
      showToast('Thank you! Your verified review has been published.');
    }

    setIsModalOpen(false);
  };

  const handleDelete = async (reviewId: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      await deleteProductReview(reviewId);
      showToast('Review deleted.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-zinc-100 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400/20" />
            Reviews & Customer Feedback
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Share your experiences on HARCONXS craftsmanship and verified purchases.
          </p>
        </div>

        {products.length > 0 && (
          <button
            onClick={() => handleOpenWriteReview(products[0]?.id || '')}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-zinc-950 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Write a Review
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('my_reviews')}
          className={`px-4 py-2 rounded-xl font-medium transition ${
            activeTab === 'my_reviews'
              ? 'bg-amber-500 text-zinc-950 font-semibold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          My Published Reviews ({userReviews.length})
        </button>
        <button
          onClick={() => setActiveTab('awaiting_reviews')}
          className={`px-4 py-2 rounded-xl font-medium transition ${
            activeTab === 'awaiting_reviews'
              ? 'bg-amber-500 text-zinc-950 font-semibold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Awaiting Your Review ({awaitingReviews.length})
        </button>
      </div>

      {/* My Published Reviews Tab */}
      {activeTab === 'my_reviews' && (
        <>
          {userReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {userReviews.map(rev => {
                const prod = products.find(p => p.id === rev.productId);
                return (
                  <div
                    key={rev.id}
                    className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition flex flex-col justify-between"
                  >
                    <div>
                      {/* Product Header */}
                      <div className="flex items-center gap-3 pb-3 border-b border-zinc-800/80 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-zinc-800 overflow-hidden flex-shrink-0 border border-zinc-700">
                          <img
                            src={prod?.images[0] || '/images/default.jpg'}
                            alt={prod?.name || 'Product'}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-zinc-200 truncate">{prod?.name || 'HARCONXS Product'}</h4>
                          <span className="text-[11px] text-zinc-500">
                            {new Date(rev.date || rev.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditReview(rev)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
                            title="Edit Review"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(rev.id)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition"
                            title="Delete Review"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Rating & Verified Badge */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1 text-amber-400">
                          {[1, 2, 3, 4, 5].map(st => (
                            <Star
                              key={st}
                              className={`w-3.5 h-3.5 ${st <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'}`}
                            />
                          ))}
                        </div>
                        {rev.verified && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" /> Verified Purchase
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <h5 className="text-sm font-semibold text-zinc-100 mt-1">{rev.title}</h5>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{rev.comment || rev.review}</p>

                      {/* Attached images */}
                      {(rev.images?.length || rev.customerImages?.length) ? (
                        <div className="flex gap-2 mt-3">
                          {(rev.images || rev.customerImages || []).map((img, i) => (
                            <div key={i} className="w-12 h-12 rounded-lg bg-zinc-800 overflow-hidden border border-zinc-700">
                              <img src={img} alt="Customer upload" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    <div className="pt-4 border-t border-zinc-800/80 mt-4 flex items-center justify-between text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3 text-zinc-400" /> {rev.helpfulVotes || rev.likes || 0} found helpful
                      </span>
                      <span className="capitalize text-zinc-400 text-[11px]">{rev.status || 'Approved'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-zinc-900/40 border border-dashed border-zinc-800">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-zinc-600" />
              <h3 className="text-sm font-semibold text-zinc-200">No reviews published yet</h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                Once you review products from your orders, your verified feedback will be displayed here.
              </p>
            </div>
          )}
        </>
      )}

      {/* Awaiting Reviews Tab */}
      {activeTab === 'awaiting_reviews' && (
        <>
          {awaitingReviews.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {awaitingReviews.map(item => (
                <div
                  key={item.productId}
                  className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-zinc-800 overflow-hidden border border-zinc-700 flex-shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-zinc-200 line-clamp-1">{item.title}</h4>
                      <p className="text-[11px] text-zinc-500 mt-0.5">Purchased in past order</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenWriteReview(item.productId, item.orderId)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-zinc-950 transition whitespace-nowrap"
                  >
                    <Star className="w-3.5 h-3.5" /> Rate & Review
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-zinc-900/40 border border-dashed border-zinc-800">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-emerald-500/40" />
              <h3 className="text-sm font-semibold text-zinc-200">You are all caught up!</h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                You have reviewed all delivered items from your orders. Thank you for your feedback!
              </p>
            </div>
          )}
        </>
      )}

      {/* Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" />
                {editingReviewId ? 'Edit Your Review' : 'Write Product Review'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1.5 font-medium">Select Product *</label>
                <select
                  value={selectedProductId}
                  onChange={e => setSelectedProductId(e.target.value)}
                  required
                  disabled={Boolean(editingReviewId)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="">Select a product...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({formatPrice(p.price)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Star Rating Selector */}
              <div>
                <label className="block text-zinc-400 mb-1.5 font-medium">Overall Rating *</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(st => (
                    <button
                      type="button"
                      key={st}
                      onClick={() => setRating(st)}
                      className="p-1.5 text-zinc-600 hover:text-amber-400 transition"
                    >
                      <Star
                        className={`w-6 h-6 ${st <= rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'}`}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-amber-300 font-semibold ml-2">{rating} out of 5 Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Review Headline / Summary *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Masterpiece craftsmanship, exceeded expectations!"
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Detailed Feedback *</label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Describe material feel, design execution, packaging presentation..."
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Photo Attachment URL (Optional)</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-zinc-950 transition"
                >
                  {editingReviewId ? 'Save Changes' : 'Publish Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
