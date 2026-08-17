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
  Building2
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartPackagingTotal,
    cartDiscount,
    cartShipping,
    cartTax,
    cartTotal,
    currency,
    formatPrice,
    createOrder,
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

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
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

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

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

    setTimeout(() => {
      const newOrder = createOrder({
        customerId: currentUser ? currentUser.id : 'user-anon',
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        items: cart,
        subtotal: cartSubtotal,
        discount: cartDiscount,
        packagingFee: cartPackagingTotal,
        shippingFee: cartShipping,
        tax: cartTax,
        total: cartTotal,
        currency,
        status: 'Paid',
        paymentMethod: paymentType === 'cod' ? 'cod' : (paymentType === 'upi' ? 'paypal' : 'card'),
        paymentStatus: paymentType === 'cod' ? 'pending' : 'paid',
        shippingAddress: {
          fullName,
          street,
          city,
          state,
          zip,
          country
        },
        trackingNumber: `BD-${Math.floor(10000000 + Math.random() * 90000000)}`,
        carrier: shippingCarrier,
        trackingUrl: 'https://bluedart.com/tracking',
        giftNote: giftNote || undefined,
        deliveryDate: deliveryDate || undefined,
        riskLevel: 'LOW'
      });

      setIsPlacingOrder(false);
      setConfirmedOrder(newOrder);
      showToast(`Order ${newOrder.orderNumber} placed successfully!`);
    }, 1200);
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
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <Lock className="w-4 h-4" />
            <span>256-Bit Bank Level SSL Encryption</span>
          </div>
        </div>

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
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-zinc-950 text-[10px] font-bold flex items-center justify-center">1</span>
                  <span>Delivery Address (India & Global)</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1 font-semibold">Full Name *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Recipient's Name"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1 font-semibold">Mobile Number *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="+91 98765 43210"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] text-zinc-400 mb-1 font-semibold">Email for Confirmation *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] text-zinc-400 mb-1 font-semibold">Street / Flat / Apartment / Landmark *</label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    required
                    placeholder="12th Cross, Indiranagar Near Metro"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1 font-semibold">City *</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    placeholder="Bangalore"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1 font-semibold">State *</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                    placeholder="Karnataka"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1 font-semibold">PIN Code / ZIP *</label>
                  <input
                    type="text"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    required
                    placeholder="560038"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1 font-semibold">Country</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-zinc-100 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="India">India 🇮🇳</option>
                    <option value="United States">United States 🇺🇸</option>
                    <option value="United Kingdom">United Kingdom 🇬🇧</option>
                    <option value="United Arab Emirates">United Arab Emirates 🇦🇪</option>
                    <option value="Canada">Canada 🇨🇦</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. INDIAN COURIER & LOGISTICS */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-sm font-bold font-serif uppercase tracking-wider text-zinc-100 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-zinc-950 text-[10px] font-bold flex items-center justify-center">2</span>
                  <span>Logistics Carrier</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setShippingCarrier('BlueDart Priority')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    shippingCarrier === 'BlueDart Priority'
                      ? 'bg-zinc-950 border-amber-500 ring-1 ring-amber-500/50'
                      : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <p className="font-bold text-white">BlueDart Priority</p>
                  <p className="text-[10px] text-zinc-400 mt-1">2-3 Business Days</p>
                  <p className="text-[10px] text-emerald-400 font-mono mt-0.5">Free with order</p>
                </button>

                <button
                  type="button"
                  onClick={() => setShippingCarrier('Delhivery Air')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    shippingCarrier === 'Delhivery Air'
                      ? 'bg-zinc-950 border-amber-500 ring-1 ring-amber-500/50'
                      : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <p className="font-bold text-white">Delhivery Air</p>
                  <p className="text-[10px] text-zinc-400 mt-1">Express Air Freight</p>
                  <p className="text-[10px] text-emerald-400 font-mono mt-0.5">Free with order</p>
                </button>

                <button
                  type="button"
                  onClick={() => setShippingCarrier('DTDC Express')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    shippingCarrier === 'DTDC Express'
                      ? 'bg-zinc-950 border-amber-500 ring-1 ring-amber-500/50'
                      : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <p className="font-bold text-white">DTDC Express</p>
                  <p className="text-[10px] text-zinc-400 mt-1">Pan-India Reach</p>
                  <p className="text-[10px] text-emerald-400 font-mono mt-0.5">Free with order</p>
                </button>
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1 font-semibold">Special Gift Message / Dispatch Note (Optional)</label>
                <input
                  type="text"
                  value={giftNote}
                  onChange={(e) => setGiftNote(e.target.value)}
                  placeholder="e.g. Please wrap in Valentine's Luxury box and don't include price tag"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* 3. INDIA PAYMENT GATEWAYS */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-sm font-bold font-serif uppercase tracking-wider text-zinc-100 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-zinc-950 text-[10px] font-bold flex items-center justify-center">3</span>
                  <span>Payment Gateway</span>
                </h3>
              </div>

              {/* Payment Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentType('upi')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    paymentType === 'upi'
                      ? 'bg-zinc-950 border-amber-500 text-amber-400 ring-1 ring-amber-500/50'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span className="text-xs font-bold">UPI / GPay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentType('card')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    paymentType === 'card'
                      ? 'bg-zinc-950 border-amber-500 text-amber-400 ring-1 ring-amber-500/50'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span className="text-xs font-bold">Card / RuPay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentType('netbanking')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    paymentType === 'netbanking'
                      ? 'bg-zinc-950 border-amber-500 text-amber-400 ring-1 ring-amber-500/50'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span className="text-xs font-bold">Net Banking</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentType('cod')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    paymentType === 'cod'
                      ? 'bg-zinc-950 border-amber-500 text-amber-400 ring-1 ring-amber-500/50'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Banknote className="w-4 h-4" />
                  <span className="text-xs font-bold">Cash on Delivery</span>
                </button>
              </div>

              {/* Dynamic Payment Input Section */}
              {paymentType === 'upi' && (
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-200">Instant UPI VPA or QR Scan</span>
                    <span className="text-[10px] text-emerald-400 font-mono">Zero Gateway Fee</span>
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-400 mb-1 uppercase font-semibold">
                      Enter UPI ID / VPA
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@oksbi / username@paytm"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-3 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                    <QrCode className="w-4 h-4 text-amber-400" />
                    <span>Supports Google Pay, PhonePe, Paytm, CRED, Amazon Pay UPI & BHIM</span>
                  </div>
                </div>
              )}

              {paymentType === 'card' && (
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <div>
                    <label className="block text-[10px] text-zinc-400 mb-1 uppercase font-semibold">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4242 •••• •••• 4242"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-3 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1 uppercase font-semibold">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExp}
                        onChange={(e) => setCardExp(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-3 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1 uppercase font-semibold">CVV</label>
                      <input
                        type="password"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="•••"
                        maxLength={4}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-3 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 font-mono"
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
              <h3 className="text-sm font-bold font-serif uppercase tracking-wider text-zinc-100 border-b border-zinc-800 pb-3">
                Order Summary ({cart.length} item{cart.length > 1 ? 's' : ''})
              </h3>

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
                  <span className="font-mono text-zinc-200">{formatPrice(cartSubtotal)}</span>
                </div>

                {cartPackagingTotal > 0 && (
                  <div className="flex justify-between text-zinc-400">
                    <span>Custom Packaging</span>
                    <span className="font-mono text-zinc-200">+{formatPrice(cartPackagingTotal)}</span>
                  </div>
                )}

                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Promo Discount</span>
                    <span className="font-mono">-{formatPrice(cartDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-zinc-400">
                  <span>Logistics & Express Shipping</span>
                  <span className="font-mono text-emerald-400">
                    {cartShipping === 0 ? 'FREE' : formatPrice(cartShipping)}
                  </span>
                </div>

                <div className="flex justify-between text-zinc-400">
                  <span>Taxes & GST (5%)</span>
                  <span className="font-mono text-zinc-200">{formatPrice(cartTax)}</span>
                </div>

                <div className="border-t border-zinc-800 pt-3 flex justify-between items-baseline">
                  <span className="font-bold text-sm text-zinc-100">Total Amount</span>
                  <span className="font-mono text-2xl font-bold text-amber-400">
                    {formatPrice(cartTotal)}
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
                  <span>Processing secure checkout...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>
                      {isUserLoggedIn
                        ? `Authorize & Pay ${formatPrice(cartTotal)}`
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
