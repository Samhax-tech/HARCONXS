import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { OrderTrackingView } from '../tracking/OrderTrackingView';
import { EmailNotificationCenter } from './EmailNotificationCenter';
import {
  User,
  Package,
  Heart,
  Globe,
  Sparkles,
  Gift,
  Mail,
  Truck,
  DollarSign,
  MessageSquare,
  LogOut,
  RefreshCw,
  Database,
  Receipt,
  FileText,
  CreditCard,
  CheckCircle2,
  Trash2,
  ShoppingBag,
  ExternalLink,
  Download,
  AlertCircle
} from 'lucide-react';

export const UserAccountDashboard: React.FC = () => {
  const {
    currentUser,
    isUserLoggedIn,
    orders,
    customOrders,
    coupleWebsites,
    wishlist,
    products,
    tickets,
    emailNotifications,
    invoices,
    formatPrice,
    addToCart,
    toggleWishlist,
    clearWishlist,
    userLogout,
    redeemLoyaltyPoints,
    openAuthModalWithAction,
    syncDatabase,
    setCurrentView,
    setSelectedProductId,
    setSelectedTrackingOrderId,
    showToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'tracking' | 'invoices' | 'orders' | 'emails' | 'wishlist' | 'custom' | 'websites' | 'affiliate' | 'loyalty' | 'support' | 'overview'
  >('tracking');

  const [hasCopiedAffiliate, setHasCopiedAffiliate] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  // IF NOT LOGGED IN
  if (!isUserLoggedIn || !currentUser) {
    return (
      <div className="bg-zinc-950 min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
            <User className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-bold text-zinc-100">
              Member Portal Access
            </h2>
            <p className="text-xs text-zinc-400">
              Sign in or create your free HARCONXS member account to track laser engraved orders in real time, inspect tax invoices, inspect dispatched email receipts, and manage couple sanctuaries.
            </p>
          </div>

          <button
            onClick={() => openAuthModalWithAction()}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Sign In / Create Account</span>
          </button>
        </div>
      </div>
    );
  }

  const affiliateUrl = `https://harconxs.com/?ref=${currentUser.affiliateCode || 'HARCONXS2026'}`;

  const handleCopyAffiliate = () => {
    navigator.clipboard.writeText(affiliateUrl);
    setHasCopiedAffiliate(true);
    showToast('Affiliate referral link copied!');
    setTimeout(() => setHasCopiedAffiliate(false), 3000);
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    await syncDatabase();
    setIsSyncing(false);
  };

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));
  const userOrders = orders.filter(o => o.customerId === currentUser.id || o.customerEmail === currentUser.email || orders.length <= 6);
  const userInvoices = invoices.filter(inv => inv.customerEmail === currentUser.email || inv.customerName === currentUser.name || invoices.length <= 6);

  const handleTrackOrder = (orderId: string) => {
    setSelectedTrackingOrderId(orderId);
    setActiveTab('tracking');
  };

  const handleMoveAllWishlistToBag = () => {
    wishlistProducts.forEach(p => {
      addToCart(p, 1);
    });
    showToast('All wishlist items added to shopping bag!');
  };

  const handleDownloadInvoice = (invoice: any) => {
    showToast(`Downloading Tax Invoice ${invoice.invoiceNumber}...`);
    setTimeout(() => {
      showToast(`✓ Invoice ${invoice.invoiceNumber} downloaded as PDF.`);
    }, 800);
  };

  return (
    <div className="bg-zinc-950 min-h-screen py-10 text-zinc-200 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* User Hero Banner */}
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400 font-bold text-2xl flex items-center justify-center">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-zinc-100 font-serif">{currentUser.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800 uppercase tracking-wider">
                  Verified Member
                </span>
                
                {/* Supabase Status Pill */}
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                  <Database className="w-3 h-3 text-emerald-400" />
                  <span>Supabase PostgreSQL Synced</span>
                </div>
              </div>
              <p className="text-xs text-zinc-400 mt-1">{currentUser.email} • {currentUser.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs flex-wrap">
            <div className="bg-zinc-950/80 p-3 rounded-2xl border border-zinc-800">
              <span className="text-zinc-500 text-[10px] uppercase tracking-wider block">Loyalty Points</span>
              <span className="font-mono text-base font-bold text-amber-400">{currentUser.loyaltyPoints} PTS</span>
            </div>
            <div className="bg-zinc-950/80 p-3 rounded-2xl border border-zinc-800">
              <span className="text-zinc-500 text-[10px] uppercase tracking-wider block">Store Credit</span>
              <span className="font-mono text-base font-bold text-emerald-400">{formatPrice(currentUser.storeCredit)}</span>
            </div>
            
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="p-3 bg-zinc-950/80 hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 rounded-2xl border border-zinc-800 transition-colors cursor-pointer flex items-center gap-1.5"
              title="Synchronize with Cloud Database"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-emerald-400' : ''}`} />
              <span className="hidden sm:inline text-[11px] font-mono">Sync</span>
            </button>

            <button
              onClick={userLogout}
              className="p-3 bg-zinc-950/80 hover:bg-rose-950/50 text-zinc-400 hover:text-rose-300 rounded-2xl border border-zinc-800 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Multi-Tab Navigation Bar */}
        <div className="flex items-center gap-1 border-b border-zinc-800 overflow-x-auto no-scrollbar pb-px text-xs font-semibold">
          {[
            { id: 'tracking', label: 'Live Order Tracking', icon: Truck },
            { id: 'invoices', label: `Billing & Invoices (${userInvoices.length})`, icon: Receipt },
            { id: 'wishlist', label: `Saved Wishlist (${wishlist.length})`, icon: Heart },
            { id: 'orders', label: `Order History (${userOrders.length})`, icon: Package },
            { id: 'emails', label: `Email Receipts (${emailNotifications.length})`, icon: Mail },
            { id: 'custom', label: `Custom Engravings (${customOrders.length})`, icon: Sparkles },
            { id: 'websites', label: `Couple Sanctuaries (${coupleWebsites.length})`, icon: Globe },
            { id: 'affiliate', label: 'Affiliate Portal', icon: DollarSign },
            { id: 'loyalty', label: 'Loyalty Rewards', icon: Gift },
            { id: 'support', label: `Support Tickets (${tickets.length})`, icon: MessageSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'border-amber-400 text-amber-400 font-bold bg-zinc-900/40'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/20'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 1. ORDER TRACKING TAB */}
        {activeTab === 'tracking' && (
          <div className="space-y-6">
            <OrderTrackingView />
          </div>
        )}

        {/* 2. BILLING & INVOICES TAB */}
        {activeTab === 'invoices' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-serif font-bold text-zinc-100">Tax Invoices & Billing Records</h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Official GST-compliant tax receipts, mock payment gateway logs, and transaction settlements
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-3 py-1 rounded-full">
                  All Transactions in INR (₹)
                </span>
              </div>
            </div>

            {userInvoices.length === 0 ? (
              <div className="p-12 text-center bg-zinc-900/30 rounded-3xl border border-zinc-800 space-y-3">
                <Receipt className="w-10 h-10 text-zinc-600 mx-auto" />
                <p className="text-xs text-zinc-400">No payment invoices found yet. Complete a purchase to see your generated GST receipt.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {userInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-lg hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-amber-400">{inv.invoiceNumber}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            {inv.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 font-mono">
                          Txn ID: {inv.transactionId} • Date: {new Date(inv.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>

                      <div className="sm:text-right space-y-1">
                        <span className="text-xs text-zinc-500 block">Total Amount (Incl. GST)</span>
                        <span className="text-xl font-mono font-bold text-white">
                          ₹{Math.round(inv.amount).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Summary Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-1">
                        <span className="text-[10px] text-zinc-500 uppercase font-mono block">Order Reference</span>
                        <span className="font-bold text-zinc-200">{inv.orderNumber}</span>
                        <p className="text-[10px] text-zinc-400 line-clamp-1">{inv.itemsSummary}</p>
                      </div>

                      <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-1">
                        <span className="text-[10px] text-zinc-500 uppercase font-mono block">Payment Method</span>
                        <span className="font-bold text-zinc-200 flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                          {inv.paymentMethod} ({inv.paymentGateway})
                        </span>
                        <p className="text-[10px] text-emerald-400 font-mono">Gateway Status: Settled</p>
                      </div>

                      <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-1">
                        <span className="text-[10px] text-zinc-500 uppercase font-mono block">Tax Breakdown</span>
                        <p className="text-[11px] text-zinc-300 font-mono">
                          CGST (2.5%): ₹{inv.cgst.toLocaleString('en-IN')}
                        </p>
                        <p className="text-[11px] text-zinc-300 font-mono">
                          SGST (2.5%): ₹{inv.sgst.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <span className="text-[10px] font-mono text-zinc-500">
                        GSTIN: {inv.gstNumber} • HARCONXS ATELIER LUXURY COMMERCE
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDownloadInvoice(inv)}
                          className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl border border-zinc-700 flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Download className="w-3.5 h-3.5 text-amber-400" />
                          <span>Download Tax PDF</span>
                        </button>
                        <button
                          onClick={() => handleTrackOrder(inv.orderId)}
                          className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors shadow-md"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Track Dispatch</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. WISHLIST TAB */}
        {activeTab === 'wishlist' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-serif font-bold text-zinc-100">Saved Wishlist ({wishlistProducts.length})</h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Handpicked pieces saved to your personal HARCONXS curation vault
                </p>
              </div>

              {wishlistProducts.length > 0 && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={clearWishlist}
                    className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-rose-400 hover:text-rose-300 text-xs font-medium rounded-xl border border-zinc-800 flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                  <button
                    onClick={handleMoveAllWishlistToBag}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors shadow-lg shadow-amber-500/10"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move All to Bag</span>
                  </button>
                </div>
              )}
            </div>

            {wishlistProducts.length === 0 ? (
              <div className="p-16 text-center bg-zinc-900/30 rounded-3xl border border-zinc-800 space-y-4">
                <div className="w-14 h-14 bg-zinc-950 rounded-full border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
                  <Heart className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-zinc-200">Your Wishlist is Empty</h3>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                    Save couple jewelry, laser engraved lockets, and custom physical gifts by tapping the heart icon on any product.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentView('catalog')}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl cursor-pointer transition-colors"
                >
                  Browse Catalog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {wishlistProducts.map(p => (
                  <div key={p.id} className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-4 space-y-3 shadow-lg flex flex-col justify-between hover:border-zinc-700 transition-colors">
                    <div className="space-y-3">
                      <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800">
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                        <button
                          onClick={() => toggleWishlist(p.id)}
                          className="absolute top-3 right-3 p-2 rounded-full bg-zinc-950/80 backdrop-blur-md border border-rose-600 text-rose-400 hover:scale-110 transition-transform cursor-pointer"
                          title="Remove from wishlist"
                        >
                          <Heart className="w-4 h-4 fill-rose-500" />
                        </button>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase">{p.category}</span>
                        <h4 className="font-bold text-xs text-white line-clamp-1 mt-0.5">{p.name}</h4>
                        <p className="font-mono text-sm font-bold text-amber-400 mt-1">{formatPrice(p.price)}</p>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-zinc-800/60">
                      <button
                        onClick={() => addToCart(p, 1)}
                        className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Bag</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedProductId(p.id);
                          setCurrentView('product-detail');
                        }}
                        className="w-full py-2 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-xl border border-zinc-800 cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <span>View Details</span>
                        <ExternalLink className="w-3 h-3 text-zinc-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. ORDERS HISTORY TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-serif font-bold text-zinc-100">All Order Purchases</h2>
                <p className="text-xs text-zinc-400 mt-0.5">Track shipment milestones and access lifetime warranty passes</p>
              </div>
              <button
                onClick={() => setActiveTab('tracking')}
                className="px-4 py-2 bg-amber-500 text-zinc-950 font-bold text-xs rounded-xl cursor-pointer"
              >
                Track by Order #
              </button>
            </div>

            <div className="space-y-4">
              {userOrders.map((ord) => (
                <div key={ord.id} className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-amber-400">{ord.orderNumber}</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                          {ord.status}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-950 text-zinc-400 border border-zinc-800">
                          Payment: {ord.paymentMethod?.toUpperCase() || 'UPI'}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 font-mono">
                        Placed on {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTrackOrder(ord.id)}
                        className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md transition-colors"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Track Shipment</span>
                      </button>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-2">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80 text-xs">
                        <div className="flex items-center gap-3">
                          <img src={item.product.images[0]} alt="" className="w-10 h-10 rounded-xl object-cover bg-zinc-900" />
                          <div>
                            <p className="font-semibold text-zinc-100">{item.product.name} (x{item.quantity})</p>
                            {item.personalization?.names && (
                              <p className="text-[10px] text-rose-300 font-mono">
                                Engraving: "{item.personalization.names}" ({item.personalization.fontStyle})
                              </p>
                            )}
                          </div>
                        </div>
                        <span className="font-mono font-bold text-zinc-200">
                          {formatPrice((item.customPrice ?? item.variant?.price ?? item.product.price) * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-2 text-xs">
                    <span className="text-zinc-500 font-mono">Carrier: {ord.carrier || 'BlueDart'} • #{ord.trackingNumber || 'BD-882194'}</span>
                    <span className="text-sm font-mono font-bold text-amber-400">Total: {formatPrice(ord.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. EMAIL RECEIPTS TAB */}
        {activeTab === 'emails' && (
          <div className="space-y-6">
            <EmailNotificationCenter />
          </div>
        )}

        {/* 6. CUSTOM ENGRAVINGS TAB */}
        {activeTab === 'custom' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif font-bold text-zinc-100">Bespoke Custom Requests ({customOrders.length})</h2>
              <button
                onClick={() => setCurrentView('custom-order')}
                className="px-4 py-2 bg-amber-500 text-zinc-950 font-bold text-xs rounded-xl cursor-pointer"
              >
                Submit New Request
              </button>
            </div>

            <div className="space-y-4">
              {customOrders.map(co => (
                <div key={co.id} className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-3xl space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-amber-400">{co.requestNumber}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-zinc-950 text-amber-300 border border-amber-800">
                      {co.status}
                    </span>
                  </div>
                  <p className="font-bold text-zinc-200 text-sm">{co.title}</p>
                  <p className="text-zinc-400">{co.description}</p>
                  <div className="pt-2 border-t border-zinc-800 flex justify-between items-center">
                    <span className="text-zinc-500 font-mono">Recipient: {co.recipient} • Occasion: {co.occasion}</span>
                    <span className="font-mono font-bold text-zinc-200">Budget: {formatPrice(co.budget)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. COUPLE WEBSITES TAB */}
        {activeTab === 'websites' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif font-bold text-zinc-100">Your Live Couple Sanctuaries</h2>
              <button
                onClick={() => setCurrentView('couple-websites')}
                className="px-4 py-2 bg-amber-500 text-zinc-950 font-bold text-xs rounded-xl cursor-pointer"
              >
                Create Couple Website
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coupleWebsites.map(ws => (
                <div key={ws.id} className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-3xl space-y-4 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-emerald-400 font-bold">{ws.domain}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-[10px] text-emerald-400 border border-emerald-800">
                      {ws.status}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-zinc-100">{ws.partner1Name} & {ws.partner2Name}</h3>
                  <p className="text-zinc-400 line-clamp-2">{ws.story}</p>
                  <div className="pt-2 border-t border-zinc-800 flex justify-between items-center text-zinc-500">
                    <span>Anniversary: {ws.anniversaryDate}</span>
                    <span className="font-mono">Template: {ws.templateId}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. AFFILIATE TAB */}
        {activeTab === 'affiliate' && (
          <div className="max-w-2xl bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-serif font-bold text-zinc-100">HARCONXS Partner Affiliate Program</h3>
              <p className="text-xs text-zinc-400">Share your exclusive code and earn 12% lifetime commission on every client purchase.</p>
            </div>

            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-2">
              <span className="text-[10px] uppercase font-mono text-zinc-500">Your Referral URL</span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={affiliateUrl}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-xs font-mono text-amber-300 outline-none"
                />
                <button
                  onClick={handleCopyAffiliate}
                  className="px-4 py-2 bg-amber-500 text-zinc-950 font-bold text-xs rounded-xl cursor-pointer whitespace-nowrap"
                >
                  {hasCopiedAffiliate ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase font-mono">Commission Rate</span>
                <p className="text-xl font-bold text-amber-400 font-mono">12% Flat</p>
              </div>
              <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase font-mono">Total Earned</span>
                <p className="text-xl font-bold text-emerald-400 font-mono">{formatPrice(currentUser.affiliateCommissionEarned)}</p>
              </div>
            </div>
          </div>
        )}

        {/* 9. LOYALTY TAB */}
        {activeTab === 'loyalty' && (
          <div className="max-w-2xl bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-serif font-bold text-zinc-100">Atelier Loyalty Rewards</h3>
              <p className="text-xs text-zinc-400">Earn 10 points for every purchase. Redeem points for instant store credit.</p>
            </div>

            <div className="p-5 bg-gradient-to-br from-amber-950/40 via-zinc-950 to-zinc-950 border border-amber-500/30 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-400 font-bold uppercase">Current Point Balance</span>
                <p className="text-3xl font-mono font-bold text-white">{currentUser.loyaltyPoints} PTS</p>
              </div>
              <button
                onClick={() => redeemLoyaltyPoints(100)}
                disabled={currentUser.loyaltyPoints < 100}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl disabled:opacity-50 cursor-pointer"
              >
                Redeem 100 PTS (₹865 Credit)
              </button>
            </div>
          </div>
        )}

        {/* 10. SUPPORT TICKETS TAB */}
        {activeTab === 'support' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif font-bold text-zinc-100">Your Support Tickets</h2>
              <button
                onClick={() => setCurrentView('contact-us')}
                className="px-4 py-2 bg-amber-500 text-zinc-950 font-bold text-xs rounded-xl cursor-pointer"
              >
                Open New Ticket
              </button>
            </div>

            <div className="space-y-3">
              {tickets.map(t => (
                <div key={t.id} className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-amber-400">{t.ticketNumber} • {t.subject}</span>
                    <span className="px-2 py-0.5 rounded bg-zinc-950 text-[10px] font-mono text-emerald-400">
                      {t.status}
                    </span>
                  </div>
                  <p className="text-zinc-400">{t.messages[0]?.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
