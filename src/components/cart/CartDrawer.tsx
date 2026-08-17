import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Gift, Sparkles, ShieldCheck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
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
    setCurrentView,
    showToast
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  if (!isCartOpen) return null;

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

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
  };

  const freeShippingThreshold = 75;
  const progressToFreeShipping = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-end">
      <div className="bg-zinc-950 border-l border-zinc-800 w-full max-w-md h-full flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-zinc-100">Your Shopping Bag</h2>
            <span className="text-xs text-zinc-500 font-mono">({cart.reduce((a, b) => a + b.quantity, 0)})</span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-900 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free shipping progress */}
        <div className="px-5 py-3 bg-zinc-900/60 border-b border-zinc-800 text-xs">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-zinc-400">
              {cartSubtotal >= freeShippingThreshold
                ? '🎉 You unlocked Free Express Shipping!'
                : `Add ${formatPrice(freeShippingThreshold - cartSubtotal)} more for Free Shipping`}
            </span>
            <span className="font-mono text-zinc-300 font-bold">{Math.round(progressToFreeShipping)}%</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-500"
              style={{ width: `${progressToFreeShipping}%` }}
            />
          </div>
        </div>

        {/* Cart items list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {cart.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <ShoppingBag className="w-10 h-10 text-zinc-600 mx-auto" />
              <p className="font-bold text-zinc-300">Your bag is empty</p>
              <p className="text-zinc-500 text-xs max-w-xs mx-auto">
                Explore our fine jewelry, personalized couple boxes, or digital bot panels.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setCurrentView('catalog');
                }}
                className="mt-2 px-4 py-2 bg-zinc-100 text-zinc-950 font-bold text-xs rounded-xl hover:bg-white transition-colors cursor-pointer"
              >
                Browse Storefront
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const unitPrice = item.customPrice ?? item.variant?.price ?? item.product.price;

              return (
                <div key={item.id} className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-start gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-xl object-cover bg-zinc-950 shrink-0"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-semibold text-zinc-200 truncate">{item.product.name}</h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-zinc-500 hover:text-rose-400 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.variant && (
                        <p className="text-[11px] text-zinc-400">Style: {item.variant.name}</p>
                      )}

                      {item.packaging && item.packaging.price > 0 && (
                        <p className="text-[11px] text-amber-400 flex items-center gap-1">
                          <Gift className="w-3 h-3" />
                          <span>{item.packaging.name} (+{formatPrice(item.packaging.price)})</span>
                        </p>
                      )}

                      {item.personalization?.names && (
                        <div className="mt-1 p-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[10px] text-rose-300 font-mono">
                          Engraved: "{item.personalization.names}" • {item.personalization.date}
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-zinc-800/60">
                        <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-0.5 text-zinc-400 hover:text-white"
                          >
                            -
                          </button>
                          <span className="font-mono px-2 text-zinc-200 font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-0.5 text-zinc-400 hover:text-white"
                          >
                            +
                          </button>
                        </div>
                        
                        <span className="font-bold text-zinc-100 font-mono text-sm">
                          {formatPrice(unitPrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer & Totals */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-zinc-800 bg-zinc-900/60 space-y-4 text-xs">
            
            {/* Promo Code Input */}
            <form onSubmit={handleApplyCoupon} className="space-y-1">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Discount code (e.g. WELCOME15)"
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 placeholder-zinc-500 uppercase font-mono text-xs outline-none focus:border-zinc-600"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {couponError && <p className="text-[11px] text-rose-400">{couponError}</p>}
              {appliedCoupon && (
                <div className="flex items-center justify-between text-[11px] text-emerald-400 bg-emerald-950/40 p-2 rounded-lg border border-emerald-800/50">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    Code {appliedCoupon.code} active
                  </span>
                  <button onClick={removeCoupon} className="text-zinc-400 hover:text-zinc-200 underline">
                    Remove
                  </button>
                </div>
              )}
            </form>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-zinc-400 text-xs">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-zinc-200">{formatPrice(cartSubtotal)}</span>
              </div>
              {cartPackagingTotal > 0 && (
                <div className="flex items-center justify-between">
                  <span>Luxury Packaging</span>
                  <span className="font-mono text-zinc-200">+{formatPrice(cartPackagingTotal)}</span>
                </div>
              )}
              {cartDiscount > 0 && (
                <div className="flex items-center justify-between text-emerald-400">
                  <span>Discount</span>
                  <span className="font-mono">-{formatPrice(cartDiscount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span className="font-mono text-zinc-200">
                  {cartShipping === 0 ? 'FREE' : formatPrice(cartShipping)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Estimated Tax</span>
                <span className="font-mono text-zinc-200">{formatPrice(cartTax)}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-sm font-bold text-zinc-100">
                <span>Total Amount</span>
                <span className="font-mono text-base text-amber-400">{formatPrice(cartTotal)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-bold text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <span>Proceed to Secure Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
