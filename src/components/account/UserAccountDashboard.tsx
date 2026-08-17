import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  User,
  Package,
  Heart,
  Globe,
  DollarSign,
  Gift,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Clock,
  Sparkles,
  Copy,
  ExternalLink,
  ShoppingBag,
  LogOut,
  MapPin,
  MessageSquare,
  Lock,
  Mail,
  RefreshCw,
  Database,
  Search
} from 'lucide-react';
import { OrderTrackingView } from '../tracking/OrderTrackingView';
import { EmailNotificationCenter } from './EmailNotificationCenter';

export const UserAccountDashboard: React.FC = () => {
  const {
    currentUser,
    isUserLoggedIn,
    openAuthModalWithAction,
    userLogout,
    orders,
    customOrders,
    coupleWebsites,
    wishlist,
    products,
    formatPrice,
    addToCart,
    toggleWishlist,
    setCurrentView,
    setSelectedProductId,
    tickets,
    redeemLoyaltyPoints,
    showToast,
    emailNotifications,
    supabaseStatus,
    syncDatabase,
    selectedTrackingOrderId,
    setSelectedTrackingOrderId
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'tracking' | 'orders' | 'emails' | 'custom' | 'websites' | 'wishlist' | 'affiliate' | 'loyalty' | 'support'
  >('tracking');

  const [hasCopiedAffiliate, setHasCopiedAffiliate] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

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
              Sign in or create your free HARCONXS member account to track laser engraved orders in real time, inspect dispatched email receipts, and manage couple sanctuaries.
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
  const userOrders = orders.filter(o => o.customerId === currentUser.id || o.customerEmail === currentUser.email || orders.length <= 4);

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
            { id: 'emails', label: `Emails & Receipts (${emailNotifications.length})`, icon: Mail },
            { id: 'orders', label: `Order History (${userOrders.length})`, icon: Package },
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'custom', label: `Custom Engravings (${customOrders.length})`, icon: Sparkles },
            { id: 'websites', label: `Couple Sanctuaries (${coupleWebsites.length})`, icon: Globe },
            { id: 'wishlist', label: `Wishlist (${wishlist.length})`, icon: Heart },
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

        {/* 2. EMAIL NOTIFICATIONS TAB */}
        {activeTab === 'emails' && (
          <div className="space-y-6">
            <EmailNotificationCenter />
          </div>
        )}

        {/* 3. ORDERS HISTORY TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif font-bold text-zinc-100">All Order Purchases</h2>
              <button
                onClick={() => setActiveTab('tracking')}
                className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Open Live Tracking Stepper</span>
              </button>
            </div>

            {userOrders.length === 0 ? (
              <div className="p-12 text-center bg-zinc-900/30 rounded-2xl border border-zinc-800 space-y-3">
                <Package className="w-8 h-8 text-zinc-600 mx-auto" />
                <p className="text-sm font-semibold text-zinc-300">No orders placed yet</p>
                <button
                  onClick={() => setCurrentView('catalog')}
                  className="px-4 py-2 bg-amber-500 text-zinc-950 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {userOrders.map((ord) => (
                  <div key={ord.id} className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 text-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                      <div>
                        <span className="font-mono text-base font-bold text-zinc-100">{ord.orderNumber}</span>
                        <p className="text-[11px] text-zinc-400">Placed on {new Date(ord.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded-full font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
                          {ord.status}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedTrackingOrderId(ord.id);
                            setActiveTab('tracking');
                          }}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Track Package</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80">
                          <div className="flex items-center gap-3">
                            <img src={item.product.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover bg-zinc-900" />
                            <div>
                              <p className="font-semibold text-zinc-200">{item.product.name} (x{item.quantity})</p>
                              {item.personalization?.names && (
                                <p className="text-[10px] text-rose-400">Engraving: {item.personalization.names}</p>
                              )}
                            </div>
                          </div>
                          <span className="font-mono font-bold text-amber-400">
                            {formatPrice((item.customPrice ?? item.variant?.price ?? item.product.price) * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-2 text-[11px] text-zinc-400 border-t border-zinc-800/60">
                      <span>Carrier: <strong className="text-zinc-300">{ord.carrier}</strong> • Tracking AWB: <strong className="text-zinc-300 font-mono">{ord.trackingNumber}</strong></span>
                      <span className="font-mono text-sm font-bold text-white">Total: {formatPrice(ord.total)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div
                onClick={() => setCurrentView('catalog')}
                className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-amber-500/50 cursor-pointer transition-all space-y-1.5"
              >
                <ShoppingBag className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-zinc-100">Explore Catalog</h3>
                <p className="text-xs text-zinc-400">Discover couple jewelry, laser keepsakes & tech accessories.</p>
              </div>

              <div
                onClick={() => setCurrentView('couple-builder')}
                className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-rose-500/50 cursor-pointer transition-all space-y-1.5"
              >
                <Globe className="w-5 h-5 text-rose-400" />
                <h3 className="font-bold text-sm text-zinc-100">Build Couple Sanctuary</h3>
                <p className="text-xs text-zinc-400">Launch a lifetime cloud memory site with music and timers.</p>
              </div>

              <div
                onClick={() => setCurrentView('custom-builder')}
                className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-amber-500/50 cursor-pointer transition-all space-y-1.5"
              >
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-zinc-100">Custom Order Brief</h3>
                <p className="text-xs text-zinc-400">Commission bespoke artisan laser engraving.</p>
              </div>
            </div>

            {/* Saved Address & Details */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 space-y-4">
              <h3 className="font-serif font-bold text-sm text-zinc-100 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Default Delivery Destination</span>
              </h3>
              {currentUser.addresses[0] ? (
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-1 text-zinc-300">
                  <p className="font-bold text-white">{currentUser.addresses[0].fullName} ({currentUser.addresses[0].phone || currentUser.phone})</p>
                  <p>{currentUser.addresses[0].street}, {currentUser.addresses[0].city}, {currentUser.addresses[0].state} - {currentUser.addresses[0].zip}</p>
                  <p className="text-[11px] text-zinc-500">{currentUser.addresses[0].country}</p>
                </div>
              ) : (
                <p className="text-xs text-zinc-400">No saved address yet.</p>
              )}
            </div>
          </div>
        )}

        {/* 5. WISHLIST TAB */}
        {activeTab === 'wishlist' && (
          <div className="space-y-6">
            <h2 className="text-lg font-serif font-bold text-zinc-100">Saved Wishlist ({wishlistProducts.length})</h2>
            {wishlistProducts.length === 0 ? (
              <div className="p-12 text-center bg-zinc-900/30 rounded-2xl border border-zinc-800">
                <Heart className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                <p className="text-xs text-zinc-400">Your wishlist is empty.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {wishlistProducts.map(p => (
                  <div key={p.id} className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 space-y-3">
                    <img src={p.images[0]} alt="" className="w-full aspect-square rounded-xl object-cover bg-zinc-950" />
                    <div>
                      <h4 className="font-bold text-xs text-white line-clamp-1">{p.name}</h4>
                      <p className="font-mono text-sm font-bold text-amber-400 mt-0.5">{formatPrice(p.price)}</p>
                    </div>
                    <button
                      onClick={() => addToCart(p, 1)}
                      className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Add to Bag
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 6. AFFILIATE TAB */}
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

        {/* 7. LOYALTY TAB */}
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

        {/* 8. SUPPORT TICKETS TAB */}
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
