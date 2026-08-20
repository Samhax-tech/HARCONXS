import React from 'react';
import { useStore } from '../../../context/StoreContext';
import {
  Heart,
  ShoppingBag,
  Trash2,
  ExternalLink,
  Star,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const WishlistSection: React.FC = () => {
  const {
    wishlist,
    products,
    formatPrice,
    addToCart,
    toggleWishlist,
    clearWishlist,
    showToast
  } = useStore();
  const navigate = useNavigate();

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  const handleMoveAllToBag = () => {
    wishlistProducts.forEach(prod => {
      addToCart(prod, 1);
    });
    showToast(`Added ${wishlistProducts.length} items to your shopping bag!`);
  };

  return (
    <div className="space-y-6">
      {/* Header & Batch Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-zinc-100 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20" />
            Curated Wishlist ({wishlist.length})
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Saved pieces and bespoke creations ready for reservation and purchase.
          </p>
        </div>

        {wishlistProducts.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              id="move-all-wishlist-btn"
              onClick={handleMoveAllToBag}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-zinc-950 transition shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Move All to Bag
            </button>
            <button
              id="clear-wishlist-btn"
              onClick={() => clearWishlist()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 border border-zinc-800 hover:border-zinc-700 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Product Cards Grid */}
      {wishlistProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {wishlistProducts.map(product => (
            <div
              key={product.id}
              id={`wishlist-card-${product.id}`}
              className="group rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 overflow-hidden transition flex flex-col justify-between"
            >
              <div>
                {/* Image Container */}
                <div className="relative aspect-square w-full bg-zinc-950 overflow-hidden">
                  <img
                    src={product.images[0] || '/images/default.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-zinc-950/80 text-rose-500 hover:text-rose-400 backdrop-blur-md border border-zinc-700/60 shadow-lg transition"
                    title="Remove from wishlist"
                  >
                    <Heart className="w-4 h-4 fill-rose-500" />
                  </button>

                  <div className="absolute bottom-3 left-3 flex gap-1.5">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-zinc-950/80 text-zinc-200 backdrop-blur-md border border-zinc-700/50">
                      {product.category}
                    </span>
                    {product.inventory > 0 ? (
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 backdrop-blur-md border border-emerald-800/50 flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" /> In Stock
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-rose-950/80 text-rose-300 backdrop-blur-md border border-rose-800/50">
                        Craft on Order
                      </span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-1 text-amber-400 text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{product.rating.toFixed(1)}</span>
                    <span className="text-zinc-500">({product.reviewCount || 1})</span>
                  </div>

                  <h3
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="text-sm font-semibold text-zinc-100 hover:text-amber-400 transition cursor-pointer line-clamp-1"
                  >
                    {product.name}
                  </h3>

                  <p className="text-xs text-zinc-400 line-clamp-2">{product.shortDescription || product.fullDescription}</p>

                  <div className="pt-2 flex items-baseline gap-2">
                    <span className="font-mono text-base font-bold text-amber-300">{formatPrice(product.price)}</span>
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <span className="font-mono text-xs text-zinc-500 line-through">
                        {formatPrice(product.compareAtPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 flex gap-2">
                <button
                  id={`add-wishlist-to-cart-${product.id}`}
                  onClick={() => addToCart(product, 1)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-zinc-950 transition shadow-sm"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Add to Bag
                </button>
                <button
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition"
                  title="View Product"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-zinc-900/40 border border-dashed border-zinc-800">
          <Heart className="w-12 h-12 mx-auto mb-3 text-zinc-600" />
          <h3 className="text-sm font-semibold text-zinc-200">Your wishlist is empty</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto mb-4">
            Tap the heart icon on any bespoke piece or luxury accessory to save it to your wishlist.
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-zinc-950 transition"
          >
            Discover Catalog <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
