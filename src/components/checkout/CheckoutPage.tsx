import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';
import {
  ShieldCheck,
  CreditCard,
  Lock,
  ArrowLeft,
  CheckCircle2,
  Gift,
  Truck,
  Calendar,
  Sparkles,
  UserCheck,
  QrCode,
  Smartphone,
  Banknote,
  AlertCircle,
  Building2,
  RefreshCw,
  Check,
  Info
} from 'lucide-react';
import { ServerPriceBreakdown } from '../../services/supabaseService';
import { Analytics } from '../../services/analyticsService';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartPackagingTotal,
    cartDiscount,
    cartShipping,
    cartTax,
    cartTotal,
    appliedCoupon,
    currency,
    formatPrice,
    createOrder,
    placeServerVerifiedOrder,
    calculateServerOrderQuote,
    setCurrentView,
    currentUser,
    isUserLoggedIn,
    openAuthModalWithAction,
    showToast
  } = useStore();

  // Form State
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 ');
  const [street, setStreet] = useState(currentUser?.addresses[0]?.street || '');
  const [city, setCity] = useState(currentUser?.addresses[0]?.city || 'Bangalore');
  const [state, setState] = useState(currentUser?.addresses[0]?.state || 'Karnataka');
  const [zip, setZip] = useState(currentUser?.addresses[0]?.zip || '560038');
  const [country, setCountry] = useState('India');
  
  const [shippingCarrier, setShippingCarrier] = useState<'BlueDart Priority' | 'Delhivery Air' | 'DTDC Express'>('BlueDart Priority');
  const [giftNote, setGiftNote] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('2026-08-20');
  
  // Payment Options
  const [paymentType, setPaymentType] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [upiId, setUpiId] = useState('hamza@oksbi');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  // Server Price Verification State
  const [serverQuote, setServerQuote] = useState<ServerPriceBreakdown | null>(null);
  const [isVerifyingQuote, setIsVerifyingQuote] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Keep state in sync if user logs in mid-flow
  useEffect(() => {
    if (currentUser) {
      setFullName(prev => prev || currentUser.name);
      setEmail(prev => prev || currentUser.email);
      setPhone(prev => (prev === '+91 ' || !prev) ? currentUser.phone : prev);
      if (currentUser.addresses[0]) {
        setStreet(prev => prev || currentUser.addresses[0].street);
        setCity(prev => prev || currentUser.addresses[0].city);
        setState(prev => prev || currentUser.addresses[0].state);
        setZip(prev => prev || currentUser.addresses[0].zip);
      }
    }
  }, [currentUser]);

  // Track checkout started on mount
  useEffect(() => {
    if (cart.length > 0) {
      Analytics.trackCheckoutStarted({
        itemsCount: cart.length,
        totalValue: cartTotal,
        hasPersonalizedItems: cart.some(i => Boolean(i.personalization)),
        currency: 'INR'
      });
    }
  }, []);

  // Server quote re-calculation on cart or coupon changes
  useEffect(() => {
    let isCancelled = false;

    async function fetchServerQuote() {
      if (cart.length === 0) return;
      setIsVerifyingQuote(true);
      setQuoteError(null);
      try {
        const quote = await calculateServerOrderQuote({
          items: cart,
          couponCode: appliedCoupon?.code,
          carrier: 'BlueDart Priority'
        });
        if (!isCancelled) {
          setServerQuote(quote);
        }
      } catch (err: any) {
        if (!isCancelled) {
          setQuoteError(err?.message || 'Server price validation failed');
        }
      } finally {
        if (!isCancelled) {
          setIsVerifyingQuote(false);
        }
      }
    }

    fetchServerQuote();
    return () => {
      isCancelled = true;
    };
  }, [cart, appliedCoupon, paymentType]);

  if (cart.length === 0 && !confirmedOrder) {
    return (
      <div className="bg-zinc-950 min-h-screen py-20 text-zinc-200 text-center space-y-4 px-4">
        <h2 className="text-xl font-bold font-serif">Your Bag is Empty</h2>
        <p className="text-xs text-zinc-400">Add physical pieces, couple websites, or digital panels to checkout.</p>
        <button
          onClick={() => setCurrentView('catalog')}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl cursor-pointer transition-colors"
        >
          Explore Creations
        </button>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError(null);

    if (!isUserLoggedIn) {
      showToast('Please create or log into your account before completing your purchase.');
      openAuthModalWithAction(() => {
        showToast('Account verified! Proceed to checkout.');
      });
      return;
    }

    if (!fullName.trim() || !email.trim() || !street.trim() || !zip.trim()) {
      showToast('Please complete all required shipping fields.');
      return;
    }

    setIsPlacingOrder(true);

    try {
      const paymentMethodMap = {
        upi: 'paypal' as const,
        card: 'card' as const,
        netbanking: 'card' as const,
        cod: 'cod' as const
      };

      const result = await placeServerVerifiedOrder({
        customerId: currentUser ? currentUser.id : 'user-anon',
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        items: cart,
        couponCode: appliedCoupon?.code,
        paymentMethod: paymentMethodMap[paymentType],
        shippingAddress: {
          fullName,
          street,
          city,
          state,
          zip,
          country
        },
        carrier: shippingCarrier,
        giftNote: giftNote || undefined,
        deliveryDate: deliveryDate || undefined
      });

      if (result.success && result.order) {
        setConfirmedOrder(result.order);
      } else {
        setCheckoutError(result.error || 'Checkout failed. Please review stock or details.');
      }
    } catch (err: any) {
      setCheckoutError(err?.message || 'An unexpected error occurred during order placement.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // ORDER CONFIRMATION SCREEN
  if (confirmedOrder) {
    return (
      <div className="bg-zinc-950 min-h-screen py-16 text-zinc-200 border-b border-zinc-800">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-400 flex items-center justify-center mx-auto shadow-2xl">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
              Payment Confirmed • Verified Atelier Order
            </span>
            <h1 className="text-3xl font-serif font-bold text-zinc-100">Thank You For Your Order!</h1>
            <p className="text-xs text-zinc-400">
              We have sent full confirmation details and digital certificates to <strong className="text-zinc-200">{confirmedOrder.customerEmail}</strong>.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 text-left space-y-6 shadow-xl text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-4">
              <div>
                <span className="text-zinc-500 uppercase tracking-wider text-[10px] block">Order Tracking Reference</span>
                <span className="font-mono text-base font-bold text-zinc-100">{confirmedOrder.orderNumber}</span>
              </div>
              <div className="sm:text-right">
                <span className="text-zinc-500 uppercase tracking-wider text-[10px] block">Carrier & Status</span>
                <span className="font-semibold text-emerald-400">{confirmedOrder.carrier} • {confirmedOrder.status}</span>
              </div>
            </div>

            {/* Items list */}
            <div className="space-y-3">
              <span className="font-bold text-zinc-300 uppercase tracking-wider text-[11px] block">Ordered Creations</span>
              {confirmedOrder.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                  <div className="flex items-center gap-3">
                    <img src={item.product.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover bg-zinc-900" />
                    <div>
                      <p className="font-semibold text-zinc-100">{item.product.name} (x{item.quantity})</p>
                      {item.personalization?.names && (
                        <p className="text-[10px] text-rose-300 font-mono">Engraving: {item.personalization.names}</p>
                      )}
                    </div>
                  </div>
                  <span className="font-mono font-bold text-zinc-100">
                    {formatPrice((item.customPrice ?? item.variant?.price ?? item.product.price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Shipping Address Recap */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1 text-zinc-300">
              <span className="text-[10px] font-mono uppercase text-zinc-500 block">Delivery Address</span>
              <p className="font-bold text-white">{confirmedOrder.shippingAddress.fullName} ({confirmedOrder.customerPhone})</p>
              <p>{confirmedOrder.shippingAddress.street}, {confirmedOrder.shippingAddress.city}, {confirmedOrder.shippingAddress.state} - {confirmedOrder.shippingAddress.zip}</p>
              <p className="text-[11px] text-zinc-400">Carrier: {confirmedOrder.carrier} • Tracking #{confirmedOrder.trackingNumber}</p>
            </div>

            {/* Total breakdown */}
            <div className="border-t border-zinc-800 pt-4 flex justify-between items-center text-sm">
              <span className="font-bold text-zinc-300">Total Paid</span>
              <span className="font-mono text-xl font-bold text-amber-400">{formatPrice(confirmedOrder.total)}</span>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => setCurrentView('account')}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/10 cursor-pointer"
            >
              Track in Member Portal
            </button>
            <button
              onClick={() => setCurrentView('catalog')}
              className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-bold text-xs rounded-xl cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>

        </div>
      </div>
    );
  }

  const effectiveTotal = serverQuote ? serverQuote.total : cartTotal;
  const effectiveSubtotal = serverQuote ? serverQuote.subtotal : cartSubtotal;
  const effectiveDiscount = serverQuote ? serverQuote.discount : cartDiscount;
  const effectivePackaging = serverQuote ? serverQuote.packagingFee : cartPackagingTotal;
  const effectiveShipping = serverQuote ? serverQuote.shippingFee : cartShipping;
  const effectiveTax = serverQuote ? serverQuote.tax : cartTax;

  return (
    <div className="bg-zinc-950 min-h-screen py-10 px-4 sm:px-6 lg:px-8 text-zinc-200">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-6 border-b border-zinc-800 mb-8">
          <button
            onClick={() => setCurrentView('catalog')}
            className="flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to bag</span>
          </button>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-amber-400 bg-amber-950/40 border border-amber-800/40 px-3 py-1 rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Server Price Guard Active</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <Lock className="w-4 h-4" />
              <span>256-Bit SSL Encrypted</span>
            </div>
          </div>
        </div>

        {/* Server Validation or Checkout Error Alert */}
        {checkoutError && (
          <div className="mb-6 p-4 bg-rose-950/50 border border-rose-600/60 rounded-2xl flex items-center gap-3 text-xs text-rose-200">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <div className="flex-1">
              <strong className="block font-bold">Checkout Verification Notice</strong>
              <span>{checkoutError}</span>
            </div>
          </div>
        )}

        {/* MANDATORY USER AUTHENTICATION BANNER */}
        {!isUserLoggedIn ? (
          <div className="mb-8 p-5 bg-gradient-to-r from-amber-950/40 via-zinc-900 to-amber-950/20 border border-amber-500/50 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/40 shrink-0">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-100">Account Registration Required Before Purchase</h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Sign in or create your free member profile to receive instant tracking updates, warranty certificates & 150 loyalty points.
                </p>
              </div>
            </div>
            <button
              onClick={() => openAuthModalWithAction()}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/10 whitespace-nowrap cursor-pointer transition-all shrink-0"
            >
              Sign In / Register in 1-Click
            </button>
          </div>
        ) : (
          <div className="mb-8 p-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5 text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Signed in as <strong className="text-white">{currentUser?.name}</strong> ({currentUser?.email})</span>
            </div>
            <span className="text-[11px] text-amber-400 font-mono font-semibold">
              ⭐ {currentUser?.loyaltyPoints} Loyalty Points Available
            </span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT 7 COLS: SHIPPING & PAYMENT */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. CONTACT & SHIPPING ADDRESS */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-sm font-bold font-serif uppercase tracking-wider text-zinc-100 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-400" />
                  <span>1. Delivery & Contact Details</span>
                </h3>
                <span className="text-[11px] text-zinc-400">All India Delivery</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-zinc-400 mb-1 uppercase font-semibold">Recipient Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Aanya Sharma"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-400 mb-1 uppercase font-semibold">Email Address (For Tax Receipt & Tracking) *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aanya@example.com"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-400 mb-1 uppercase font-semibold">Contact Phone (For Courier Delivery OTP) *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 transition-colors font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-400 mb-1 uppercase font-semibold">Pincode *</label>
                  <input
                    type="text"
                    required
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    placeholder="560038"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 transition-colors font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-zinc-400 mb-1 uppercase font-semibold">Street Address, Apartment / Villa *</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="e.g. 402, Prestige Hermitage, 12th Main Road, Indiranagar"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-400 mb-1 uppercase font-semibold">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Bangalore"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-400 mb-1 uppercase font-semibold">State *</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Karnataka"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* 2. SHIPPING CARRIER & SURPRISE DELIVERY OPTIONS */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-sm font-bold font-serif uppercase tracking-wider text-zinc-100 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-rose-400" />
                  <span>2. Logistics Carrier & Gifting Options</span>
                </h3>
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] text-zinc-400 mb-1 uppercase font-semibold">Select Insured Courier Partner</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'BlueDart Priority', time: '2-3 Business Days', tag: 'Fastest & Recommended' },
                    { id: 'Delhivery Air', time: '3-4 Business Days', tag: 'Air Cargo' },
                    { id: 'DTDC Express', time: '4-5 Business Days', tag: 'Standard' }
                  ].map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setShippingCarrier(c.id as any)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        shippingCarrier === c.id
                          ? 'border-amber-500 bg-amber-500/10 text-zinc-100 shadow-md'
                          : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-zinc-200">{c.id}</span>
                        {shippingCarrier === c.id && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </div>
                      <p className="text-[10px] text-zinc-400 mt-1">{c.time}</p>
                      <span className="text-[9px] text-amber-400/80 font-mono mt-1 block">{c.tag}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-[10px] text-zinc-400 mb-1 uppercase font-semibold flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5 text-rose-400" />
                    <span>Complimentary Handwritten Gift Note</span>
                  </label>
                  <textarea
                    rows={2}
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    placeholder="e.g. Happy Anniversary to my love. Here's to forever!"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-400 mb-1 uppercase font-semibold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Requested Delivery Date</span>
                  </label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 transition-colors font-mono cursor-pointer"
                  />
                  <p className="text-[10px] text-zinc-500 mt-1">We will coordinate dispatch timing with the courier accordingly.</p>
                </div>
              </div>
            </div>

            {/* 3. PAYMENT METHOD (AUTHORITATIVE GATEWAY ROUTING) */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-sm font-bold font-serif uppercase tracking-wider text-zinc-100 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span>3. Secure Payment Gateway</span>
                </h3>
                <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>PCI-DSS Tier-1</span>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'upi', name: 'UPI / QR', icon: QrCode, desc: 'GPay, PhonePe, Paytm' },
                  { id: 'card', name: 'Debit / Credit', icon: CreditCard, desc: 'Visa, Master, RuPay' },
                  { id: 'netbanking', name: 'NetBanking', icon: Building2, desc: 'All Indian Banks' },
                  { id: 'cod', name: 'Cash on Delivery', icon: Banknote, desc: 'Pay at Doorstep' }
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = paymentType === item.id;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setPaymentType(item.id as any)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/10 text-zinc-100 shadow-md'
                          : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-zinc-400'}`} />
                        {isSelected && <Check className="w-3 h-3 text-amber-400" />}
                      </div>
                      <span className="font-semibold text-xs block text-zinc-200">{item.name}</span>
                      <span className="text-[9px] text-zinc-500 block">{item.desc}</span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Payment Fields */}
              {paymentType === 'upi' && (
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-300 font-semibold flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-emerald-400" />
                      <span>Instant UPI Payment</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-md font-mono">
                      0% Gateway Fee
                    </span>
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-400 mb-1 uppercase font-semibold">Virtual Payment Address (VPA / UPI ID)</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@oksbi / username@okaxis"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                  <p className="text-[10px] text-zinc-400 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>A secure authorization mandate will be sent directly to your UPI app.</span>
                  </p>
                </div>
              )}

              {paymentType === 'card' && (
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <div>
                    <label className="block text-[10px] text-zinc-400 mb-1 uppercase font-semibold">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4242 4242 4242 4242"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1 uppercase font-semibold">Expires (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExp}
                        onChange={(e) => setCardExp(e.target.value)}
                        placeholder="12/28"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1 uppercase font-semibold">Security CVC / CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="•••"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentType === 'netbanking' && (
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <label className="block text-[10px] text-zinc-400 mb-1 uppercase font-semibold">Select Bank</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="State Bank of India">State Bank of India (SBI)</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                    <option value="Punjab National Bank">Punjab National Bank</option>
                  </select>
                </div>
              )}

              {paymentType === 'cod' && (
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 space-y-1">
                  <p className="font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Cash on Delivery Available</span>
                  </p>
                  <p className="text-[11px] text-zinc-400">
                    Pay securely in cash or UPI QR directly to the BlueDart / Delhivery courier agent upon doorstep package arrival.
                  </p>
                </div>
              )}

            </div>

          </div>

          {/* RIGHT 5 COLS: BAG SUMMARY & PLACE ORDER BUTTON */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-5 sticky top-24">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-sm font-bold font-serif uppercase tracking-wider text-zinc-100">
                  Order Summary ({cart.length} item{cart.length > 1 ? 's' : ''})
                </h3>
                {isVerifyingQuote && (
                  <span className="flex items-center gap-1 text-[10px] text-amber-400 font-mono">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Verifying...</span>
                  </span>
                )}
              </div>

              {/* Items preview */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs gap-2">
                    <div className="flex items-center gap-2.5">
                      <img src={item.product.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover bg-zinc-950" />
                      <div>
                        <p className="font-semibold text-zinc-200 line-clamp-1">{item.product.name}</p>
                        <p className="text-[10px] text-zinc-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-zinc-100 whitespace-nowrap">
                      {formatPrice((item.customPrice ?? item.variant?.price ?? item.product.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calculation math */}
              <div className="border-t border-zinc-800 pt-3 space-y-2 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Bag Subtotal</span>
                  <span className="font-mono text-zinc-200">{formatPrice(effectiveSubtotal)}</span>
                </div>

                {effectivePackaging > 0 && (
                  <div className="flex justify-between text-zinc-400">
                    <span>Custom Packaging</span>
                    <span className="font-mono text-zinc-200">+{formatPrice(effectivePackaging)}</span>
                  </div>
                )}

                {effectiveDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Promo Discount {appliedCoupon ? `(${appliedCoupon.code})` : ''}</span>
                    <span className="font-mono">-{formatPrice(effectiveDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-zinc-400">
                  <span>Logistics & Express Shipping</span>
                  <span className="font-mono text-emerald-400">
                    {effectiveShipping === 0 ? 'FREE' : formatPrice(effectiveShipping)}
                  </span>
                </div>

                <div className="flex justify-between text-zinc-400">
                  <span>Taxes & GST (5%)</span>
                  <span className="font-mono text-zinc-200">{formatPrice(effectiveTax)}</span>
                </div>

                <div className="border-t border-zinc-800 pt-3 flex justify-between items-baseline">
                  <span className="font-bold text-sm text-zinc-100">Total Amount</span>
                  <span className="font-mono text-2xl font-bold text-amber-400">
                    {formatPrice(effectiveTotal)}
                  </span>
                </div>
              </div>

              {/* Main Submit Button */}
              <button
                type="submit"
                disabled={isPlacingOrder}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm rounded-xl shadow-xl shadow-amber-500/10 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isPlacingOrder ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying inventory & creating order...</span>
                  </span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>
                      {isUserLoggedIn
                        ? `Authorize & Pay ${formatPrice(effectiveTotal)}`
                        : 'Sign In to Authorize & Pay'}
                    </span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-400 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero-risk guarantee • 30-day returns on non-custom items</span>
              </div>

            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
