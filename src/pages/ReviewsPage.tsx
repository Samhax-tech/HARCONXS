import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Star, CheckCircle2, ThumbsUp, Heart, Sparkles, MessageSquare, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ReviewsPage: React.FC = () => {
  const { reviews, products, addProductReview, currentUser, isUserLoggedIn, openAuthModalWithAction, showToast } = useStore();
  const [selectedStar, setSelectedStar] = useState<number | 'all'>('all');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  // New review form state
  const [selectedProdId, setSelectedProdId] = useState(products[0]?.id || '');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [name, setName] = useState(currentUser?.name || '');

  const filteredReviews = reviews.filter(r => {
    if (selectedStar !== 'all' && Math.round(r.rating) !== selectedStar) return false;
    return true;
  });

  const avgRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)).toFixed(1);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      showToast('Please write a review message.');
      return;
    }

    addProductReview({
      productId: selectedProdId,
      userName: name.trim() || (currentUser?.name || 'Verified Customer'),
      rating,
      title: title.trim() || 'Exemplary Craftsmanship',
      comment: comment.trim(),
      verifiedPurchase: true
    });

    setIsWriteModalOpen(false);
    setTitle('');
    setComment('');
  };

  return (
    <div className="bg-zinc-950 min-h-screen py-10 text-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <Breadcrumbs items={[{ label: 'Community' }, { label: 'Customer Reviews' }]} />

        {/* Header with Stats */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-mono text-amber-400 uppercase">Verified Buyers</span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              Atelier Testimonials & Experiences
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
              Authentic feedback from couples, gift givers, and luxury patrons across India and worldwide.
            </p>
          </div>

          <div className="flex items-center gap-6 bg-zinc-950 p-6 rounded-2xl border border-zinc-800 shrink-0">
            <div className="text-center">
              <p className="text-4xl font-serif font-bold text-amber-400">{avgRating}</p>
              <div className="flex items-center justify-center gap-1 text-amber-400 text-xs mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-[10px] text-zinc-500 font-mono mt-1">{reviews.length} Verified Reviews</p>
            </div>

            <button
              onClick={() => setIsWriteModalOpen(true)}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/10 flex items-center gap-2 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Write Review</span>
            </button>
          </div>
        </div>

        {/* Filter Star Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedStar('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedStar === 'all'
                ? 'bg-amber-500 text-zinc-950 font-bold'
                : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
            }`}
          >
            All Ratings ({reviews.length})
          </button>
          {[5, 4, 3, 2, 1].map(stars => {
            const count = reviews.filter(r => Math.round(r.rating) === stars).length;
            return (
              <button
                key={stars}
                onClick={() => setSelectedStar(stars)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedStar === stars
                    ? 'bg-amber-500 text-zinc-950 font-bold'
                    : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                }`}
              >
                <span>{stars} Stars</span>
                <span className="text-[11px] opacity-70">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => {
            const product = products.find(p => p.id === rev.productId);

            return (
              <div
                key={rev.id}
                className="bg-zinc-900/50 border border-zinc-800/80 rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:border-zinc-700 transition-colors shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center font-mono">
                        {rev.userName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-zinc-200">{rev.userName}</p>
                        {rev.verified && (
                          <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                            <CheckCircle2 className="w-3 h-3" /> Verified Order
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'}`}
                        />
                      ))}
                    </div>
                  </div>

                  {product && (
                    <Link
                      to={`/product/${product.slug || product.id}`}
                      className="inline-flex items-center gap-1 text-[11px] text-amber-400/90 hover:text-amber-300 font-mono bg-zinc-950 px-2 py-0.5 rounded-md border border-zinc-800/80 truncate max-w-full"
                    >
                      <span>Item: {product.name}</span>
                    </Link>
                  )}

                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-zinc-100">{rev.title}</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans">{rev.comment}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-500">
                  <span>{new Date(rev.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3 text-zinc-500" />
                    <span>{rev.likes} helpful</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal: Write Review */}
        {isWriteModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-serif font-bold text-white">Share Your Review</h3>
                <button onClick={() => setIsWriteModalOpen(false)} className="text-zinc-400 hover:text-zinc-200">✕</button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Select Piece</label>
                  <select
                    value={selectedProdId}
                    onChange={(e) => setSelectedProdId(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Rating</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 text-amber-400 cursor-pointer"
                      >
                        <Star className={`w-5 h-5 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Your Name / Handle</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aryan S."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Review Headline</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Flawless laser engraving and velvet box"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Review Experience</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    placeholder="Describe how the gift was received, metal finish, or shipping speed..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white resize-none"
                    required
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsWriteModalOpen(false)}
                    className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
