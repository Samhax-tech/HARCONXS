import React, { useState } from 'react';
import {
  Star,
  CheckCircle2,
  XCircle,
  EyeOff,
  Sparkles,
  Trash2,
  AlertTriangle,
  Search,
  Filter,
  MessageSquare,
  Image as ImageIcon,
  Check,
  ShieldCheck,
  RotateCcw,
  ExternalLink,
  Edit3
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductReview } from '../../types';

export const AdminReviewsModeration: React.FC = () => {
  const { reviews, products, moderateReview, showToast } = useStore();

  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved' | 'reported' | 'featured' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [selectedReviewForNotes, setSelectedReviewForNotes] = useState<ProductReview | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');

  // Map product names for display
  const getProductInfo = (productId: string) => {
    const p = products.find(prod => prod.id === productId);
    return {
      name: p?.name || 'HARCONXS Bespoke Craft',
      image: p?.images[0] || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=300'
    };
  };

  // Metrics
  const totalCount = reviews.length;
  const pendingCount = reviews.filter(r => r.status === 'pending').length;
  const approvedCount = reviews.filter(r => r.status === 'approved' || !r.status).length;
  const reportedCount = reviews.filter(r => r.reported || (r.reportCount && r.reportCount > 0)).length;
  const featuredCount = reviews.filter(r => r.isFeatured).length;
  const avgRating = totalCount > 0
    ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / totalCount).toFixed(1)
    : '5.0';

  // Filter logic
  const filteredReviews = reviews.filter(r => {
    // Status filter
    if (activeFilter === 'pending' && r.status !== 'pending') return false;
    if (activeFilter === 'approved' && r.status !== 'approved' && r.status !== undefined) return false;
    if (activeFilter === 'reported' && !r.reported && !(r.reportCount && r.reportCount > 0)) return false;
    if (activeFilter === 'featured' && !r.isFeatured) return false;
    if (activeFilter === 'rejected' && r.status !== 'rejected') return false;

    // Rating filter
    if (ratingFilter !== 'all' && r.rating !== ratingFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const pInfo = getProductInfo(r.productId);
      const matchText = (r.comment || r.review || '').toLowerCase();
      const matchTitle = (r.title || '').toLowerCase();
      const matchUser = (r.userName || '').toLowerCase();
      const matchProd = pInfo.name.toLowerCase();
      return matchText.includes(q) || matchTitle.includes(q) || matchUser.includes(q) || matchProd.includes(q);
    }

    return true;
  });

  const handleAction = async (reviewId: string, action: 'approve' | 'reject' | 'hide' | 'feature' | 'delete', notes?: string) => {
    const success = await moderateReview(reviewId, action, notes);
    if (success) {
      const labels: Record<string, string> = {
        approve: 'Review approved and published to product page.',
        reject: 'Review rejected.',
        hide: 'Review hidden from storefront.',
        feature: 'Review marked as Featured Spotlight.',
        delete: 'Review removed permanently.'
      };
      showToast(labels[action] || 'Moderation action applied.');
    }
  };

  const handleSaveNotes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReviewForNotes) return;
    await moderateReview(selectedReviewForNotes.id, 'approve', adminNoteInput.trim());
    setSelectedReviewForNotes(null);
    setAdminNoteInput('');
    showToast('Internal moderation note saved.');
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-serif font-bold text-zinc-100">Customer Reviews & Testimonial Moderation</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-800/80 text-amber-300 font-mono text-[10px]">
              Atelier Quality Guard
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            Audit, verify, and moderate patron testimonials. Ensure genuine buyer proof, inspect customer-uploaded
            engraving photographs, and highlight featured patron stories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-3.5 py-2 rounded-xl text-xs font-mono">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="font-bold text-zinc-100">{avgRating} / 5.0</span>
            <span className="text-zinc-500">({totalCount} Reviews)</span>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <button
          onClick={() => setActiveFilter('all')}
          className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
            activeFilter === 'all'
              ? 'bg-amber-400/10 border-amber-400 text-amber-300'
              : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
          }`}
        >
          <span className="text-[10px] font-mono uppercase block">Total Reviews</span>
          <p className="text-xl font-bold font-serif text-zinc-100 mt-0.5">{totalCount}</p>
        </button>

        <button
          onClick={() => setActiveFilter('pending')}
          className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
            activeFilter === 'pending'
              ? 'bg-amber-400/10 border-amber-400 text-amber-300'
              : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
          }`}
        >
          <span className="text-[10px] font-mono uppercase block flex items-center gap-1 text-amber-400">
            <span>Pending Review</span>
            {pendingCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            )}
          </span>
          <p className="text-xl font-bold font-serif text-amber-400 mt-0.5">{pendingCount}</p>
        </button>

        <button
          onClick={() => setActiveFilter('approved')}
          className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
            activeFilter === 'approved'
              ? 'bg-emerald-400/10 border-emerald-400 text-emerald-300'
              : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
          }`}
        >
          <span className="text-[10px] font-mono uppercase block text-emerald-400">Approved Public</span>
          <p className="text-xl font-bold font-serif text-emerald-400 mt-0.5">{approvedCount}</p>
        </button>

        <button
          onClick={() => setActiveFilter('reported')}
          className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
            activeFilter === 'reported'
              ? 'bg-rose-400/10 border-rose-400 text-rose-300'
              : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
          }`}
        >
          <span className="text-[10px] font-mono uppercase block text-rose-400 flex items-center gap-1">
            <span>Flagged / Reports</span>
            {reportedCount > 0 && <AlertTriangle className="w-3 h-3 text-rose-400" />}
          </span>
          <p className="text-xl font-bold font-serif text-rose-400 mt-0.5">{reportedCount}</p>
        </button>

        <button
          onClick={() => setActiveFilter('featured')}
          className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
            activeFilter === 'featured'
              ? 'bg-purple-400/10 border-purple-400 text-purple-300'
              : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
          }`}
        >
          <span className="text-[10px] font-mono uppercase block text-purple-400">Featured Spotlight</span>
          <p className="text-xl font-bold font-serif text-purple-300 mt-0.5">{featuredCount}</p>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between text-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by patron name, product title, keywords..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-zinc-100 outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-300 outline-none font-mono text-xs cursor-pointer"
          >
            <option value="all">All Star Ratings</option>
            <option value={5}>5 Stars (Exceptional)</option>
            <option value={4}>4 Stars (Very Good)</option>
            <option value={3}>3 Stars (Average)</option>
            <option value={2}>2 Stars (Below Expectation)</option>
            <option value={1}>1 Star (Critical)</option>
          </select>

          <span className="text-zinc-500 font-mono text-[11px] whitespace-nowrap">
            Showing {filteredReviews.length} of {reviews.length}
          </span>
        </div>
      </div>

      {/* Reviews Stream */}
      <div className="space-y-3.5">
        {filteredReviews.length === 0 ? (
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-12 text-center text-zinc-500">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40 text-zinc-400" />
            <p className="text-sm font-semibold text-zinc-300">No reviews found matching the current filters.</p>
            <p className="text-xs text-zinc-500 mt-1">Try switching tabs or resetting the search query.</p>
          </div>
        ) : (
          filteredReviews.map((rev) => {
            const pInfo = getProductInfo(rev.productId);
            const isApproved = rev.status === 'approved' || (!rev.status && !rev.reported);
            const isPending = rev.status === 'pending';
            const isRejected = rev.status === 'rejected';
            const isHidden = rev.status === 'hidden';
            const hasImages = (rev.images && rev.images.length > 0) || (rev.customerImages && rev.customerImages.length > 0);
            const reviewImages = rev.images || rev.customerImages || [];

            return (
              <div
                key={rev.id}
                className={`bg-zinc-950 border rounded-2xl p-5 space-y-4 text-xs transition-all ${
                  rev.reported
                    ? 'border-rose-800/80 bg-rose-950/10'
                    : isPending
                    ? 'border-amber-500/60 bg-amber-950/10'
                    : rev.isFeatured
                    ? 'border-purple-600/60'
                    : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {/* Header Row: Product, Patron & Rating */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-900 pb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={pInfo.image}
                      alt={pInfo.name}
                      className="w-11 h-11 rounded-xl object-cover bg-zinc-900 border border-zinc-800 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-zinc-100">{pInfo.name}</span>
                        {rev.isFeatured && (
                          <span className="px-2 py-0.5 rounded-full bg-purple-950 border border-purple-800 text-purple-300 font-mono text-[10px] flex items-center gap-1 font-bold">
                            <Sparkles className="w-3 h-3 text-purple-400" />
                            <span>Featured</span>
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 flex items-center gap-1.5 mt-0.5">
                        <span className="font-semibold text-zinc-200">{rev.userName}</span>
                        {rev.verifiedPurchase !== false && (
                          <span className="text-emerald-400 font-mono text-[10px] flex items-center gap-0.5 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-800">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Verified Buyer</span>
                          </span>
                        )}
                        <span className="text-zinc-600">•</span>
                        <span className="text-zinc-500 font-mono">
                          {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : rev.date}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Rating Stars & Status Badge */}
                  <div className="flex items-center gap-3 self-start sm:self-center">
                    <div className="flex items-center gap-0.5 bg-zinc-900 px-2.5 py-1 rounded-xl border border-zinc-800">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-zinc-700'
                          }`}
                        />
                      ))}
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-xl font-mono text-[10px] font-bold ${
                        isPending
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : isApproved
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : isRejected
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                      }`}
                    >
                      {rev.status ? rev.status.toUpperCase() : 'APPROVED'}
                    </span>
                  </div>
                </div>

                {/* Review Text Body */}
                <div className="space-y-1.5">
                  {rev.title && (
                    <h5 className="font-bold text-zinc-100 text-sm">{rev.title}</h5>
                  )}
                  <p className="text-zinc-300 leading-relaxed">{rev.comment || rev.review}</p>
                </div>

                {/* Patron Attached Photographs */}
                {hasImages && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] uppercase font-mono text-zinc-500 flex items-center gap-1">
                      <ImageIcon className="w-3 h-3 text-amber-400" />
                      <span>Patron Photos ({reviewImages.length})</span>
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {reviewImages.map((imgUrl, imgIdx) => (
                        <a
                          key={imgIdx}
                          href={imgUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="relative group block w-16 h-16 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900"
                        >
                          <img src={imgUrl} alt="Review" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[9px] font-bold transition-opacity">
                            View
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Flagged Reason Note if reported */}
                {rev.reported && (
                  <div className="p-3 bg-rose-950/40 border border-rose-800/80 rounded-xl flex items-center gap-2 text-rose-300 text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <div>
                      <span className="font-bold">Flagged for Audit: </span>
                      <span>{rev.reportReason || 'Customer or system flagged for review inspection.'}</span>
                    </div>
                  </div>
                )}

                {/* Admin Internal Note if present */}
                {rev.adminNotes && (
                  <div className="p-2.5 bg-zinc-900/80 border border-zinc-800 rounded-xl text-[11px] text-zinc-400 font-mono">
                    <span className="text-amber-400 font-semibold">Moderation Audit Note: </span>
                    <span>{rev.adminNotes}</span>
                  </div>
                )}

                {/* Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-zinc-900">
                  <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-mono">
                    <span>Helpful votes: {rev.helpfulVotes || rev.likes || 0}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Approve button */}
                    {!isApproved && (
                      <button
                        onClick={() => handleAction(rev.id, 'approve')}
                        className="px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve & Publish</span>
                      </button>
                    )}

                    {/* Feature Spotlight */}
                    <button
                      onClick={() => handleAction(rev.id, 'feature')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors border ${
                        rev.isFeatured
                          ? 'bg-purple-950 text-purple-300 border-purple-800'
                          : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-750'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <span>{rev.isFeatured ? 'Featured Spotlight' : 'Spotlight'}</span>
                    </button>

                    {/* Hide */}
                    {!isHidden && isApproved && (
                      <button
                        onClick={() => handleAction(rev.id, 'hide')}
                        className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                        title="Hide from public storefront"
                      >
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hide</span>
                      </button>
                    )}

                    {/* Reject */}
                    {!isRejected && (
                      <button
                        onClick={() => handleAction(rev.id, 'reject')}
                        className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/80 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    )}

                    {/* Add Internal Notes */}
                    <button
                      onClick={() => {
                        setSelectedReviewForNotes(rev);
                        setAdminNoteInput(rev.adminNotes || '');
                      }}
                      className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 rounded-xl cursor-pointer"
                      title="Add moderation note"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Permanently */}
                    <button
                      onClick={() => {
                        if (confirm('Permanently delete this review record?')) {
                          handleAction(rev.id, 'delete');
                        }
                      }}
                      className="p-1.5 bg-zinc-900 hover:bg-rose-950 text-zinc-400 hover:text-rose-400 border border-zinc-800 rounded-xl cursor-pointer transition-colors"
                      title="Delete review"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Internal Note Modal */}
      {selectedReviewForNotes && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h4 className="font-serif font-bold text-zinc-100 text-sm">Internal Moderation Audit Note</h4>
              <button
                onClick={() => setSelectedReviewForNotes(null)}
                className="text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNotes} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Audit Notes & Inspection Comments</label>
                <textarea
                  rows={4}
                  value={adminNoteInput}
                  onChange={(e) => setAdminNoteInput(e.target.value)}
                  placeholder="e.g. Verified order #HX-10492. Laser photo authentic. High quality review."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-zinc-100 outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedReviewForNotes(null)}
                  className="flex-1 py-2.5 bg-zinc-900 text-zinc-400 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold rounded-xl cursor-pointer shadow-md"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviewsModeration;
