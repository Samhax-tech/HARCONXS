import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Trash2, ShoppingBag, ArrowRight, Tag, Gift, Sparkles, ShieldCheck, Truck, Plus, Minus, ArrowLeft } from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartPackagingTotal,
    cartDiscount,
    cartShipping,
    cartTax,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    formatPrice,
    showToast
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponInput('');
      showToast(res.message);
    } else {
      setCouponError(res.message);
    }
  };

  const freeShippingThreshold = 2500;
  const progressToFreeShipping = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  if (cart.length === 0) {
    return (
      <div className="bg-zinc-950 min-h-[80vh] py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full text-center space-y-6 bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-serif font-bold text-white">Your Shopping Bag is Empty</h1>
            <p className="text-xs text-zinc-400">
              Explore our handcrafted physical keepsakes, couple website builders, and custom commissions.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/shop"
              className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold rounded-xl transition-all shadow-lg shadow-amber-500/10"
            >
              Explore All Collections
            </Link>
            <Link
              to="/custom-products"
              className="px-5 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-xl transition-colors"
            >
              Commission Bespoke Piece
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 min-h-screen py-8 text-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <Breadcrumbs items={[{ label: 'Shop', view: 'catalog' }, { label: 'Shopping Bag' }]} />

        <div className="border-b border-zinc-800 pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white">Your Atelier Bag</h1>
            <p className="text-xs text-zinc-400 mt-1">Review your selections, custom engravings, and luxury packaging</p>
          </div>

          <button
            onClick={clearCart}
            className="text-xs text-zinc-500 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Bag</span>
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-300 font-medium flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-amber-400" />
              {cartSubtotal >= freeShippingThreshold ? (
                <span className="text-emerald-400 font-bold">You qualify for Complimentary Express Courier!</span>
              ) : (
                <span>Add {formatPrice(freeShippingThreshold - cartSubtotal)} more for Free Express Delivery</span>
              )}
            </span>
            <span className="font-mono text-zinc-400">{Math.round(progressToFreeShipping)}%</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 transition-all duration-500 rounded-full"
              style={{ width: `${progressToFreeShipping}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start gap-4 hover:border-zinc-700 transition-colors"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover bg-zinc-950 shrink-0"
                />

                <div className="flex-1 min-w-0 space-y-2 w-full">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        to={`/product/${item.product.slug || item.product.id}`}
                        className="text-sm font-bold font-serif text-white hover:text-amber-400 transition-colors line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      {item.variant && (
                        <p className="text-xs text-amber-400/90 font-mono">
                          Style: {item.variant.name}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-zinc-500 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Personalization Details */}
                  {item.personalization && (
                    <div className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-800/80 text-[11px] text-zinc-300 space-y-1">
                      <p className="text-amber-400 font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Laser Engraving Specs
                      </p>
                      {item.personalization.names && <p>Names: <span className="text-white">{item.personalization.names}</span></p>}
                      {item.personalization.date && <p>Anniversary: <span className="text-white">{item.personalization.date}</span></p>}
                      {item.personalization.message && <p>Secret Inscription: <span className="text-white italic">"{item.personalization.message}"</span></p>}
                    </div>
                  )}

                  {/* Packaging */}
                  {item.packaging && (
                    <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                      <Gift className="w-3 h-3 text-amber-400" />
                      <span>{item.packaging.name} ({item.packaging.price === 0 ? 'Free' : `+${formatPrice(item.packaging.price)}`})</span>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between">
                    <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl p-0.5">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-zinc-400 hover:text-white"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold font-mono text-zinc-200">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-zinc-400 hover:text-white"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-sm font-bold font-mono text-amber-400">
                      {formatPrice((item.customPrice || (item.variant ? item.variant.price : item.product.price) + (item.packaging?.price || 0)) * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Column */}
          <div className="space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-5 shadow-2xl">
              <h2 className="text-base font-serif font-bold text-white">Order Summary</h2>

              {/* Coupon Form */}
              <div>
                {appliedCoupon ? (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-amber-300">
                      <Tag className="w-3.5 h-3.5 text-amber-400" />
                      <span className="font-mono font-bold">{appliedCoupon.code}</span>
                      <span className="text-zinc-400">(-{appliedCoupon.type === 'percentage' ? `${appliedCoupon.value}%` : formatPrice(appliedCoupon.value)})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-zinc-500 hover:text-rose-400"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="Coupon code (e.g. WELCOME15)"
                        className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 uppercase font-mono focus:outline-none focus:border-amber-500"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[11px] text-rose-400">{couponError}</p>
                    )}
                  </form>
                )}
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-2.5 text-xs text-zinc-400 border-t border-zinc-800 pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-zinc-200">{formatPrice(cartSubtotal)}</span>
                </div>
                {cartPackagingTotal > 0 && (
                  <div className="flex justify-between">
                    <span>Luxury Keepsake Packaging</span>
                    <span className="font-mono text-zinc-200">{formatPrice(cartPackagingTotal)}</span>
                  </div>
                )}
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount Code Savings</span>
                    <span className="font-mono">-{formatPrice(cartDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Courier (India)</span>
                  <span className="font-mono text-zinc-200">
                    {cartShipping === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : formatPrice(cartShipping)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GST / Taxes (Included)</span>
                  <span className="font-mono text-zinc-200">{formatPrice(cartTax)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white border-t border-zinc-800 pt-3">
                  <span>Estimated Total</span>
                  <span className="font-mono text-amber-400">{formatPrice(cartTotal)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 cursor-pointer transition-all uppercase tracking-wider"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-2xl text-[11px] text-zinc-400 space-y-2">
              <div className="flex items-center gap-2 text-zinc-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>256-bit Encrypted Checkout with UPI & Cards</span>
              </div>
              <p className="text-zinc-500">
                All bespoke custom pieces undergo rigorous quality inspection and laser calibration before dispatch.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
