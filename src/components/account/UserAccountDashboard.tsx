import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { OrderTrackingView } from '../tracking/OrderTrackingView';
import { Order, CustomOrder } from '../../types';

// Modular Sections
import { ProfileSection } from './sections/ProfileSection';
import { OrdersSection } from './sections/OrdersSection';
import { OrderDetailView } from './sections/OrderDetailView';
import { WishlistSection } from './sections/WishlistSection';
import { AddressesSection } from './sections/AddressesSection';
import { ReviewsSection } from './sections/ReviewsSection';
import { CustomOrdersSection } from './sections/CustomOrdersSection';
import { CustomOrderDetailView } from './sections/CustomOrderDetailView';
import { CoupleWebsitesSection } from './sections/CoupleWebsitesSection';
import { SupportTicketsSection } from './sections/SupportTicketsSection';
import { NotificationsSection } from './sections/NotificationsSection';
import { SettingsSection } from './sections/SettingsSection';

import {
  User,
  Package,
  Heart,
  MapPin,
  Star,
  Sparkles,
  Globe,
  LifeBuoy,
  Bell,
  Settings,
  LogOut,
  Truck,
  FileText,
  CreditCard,
  CheckCircle2,
  RefreshCw,
  X,
  Printer,
  Download,
  ShieldCheck
} from 'lucide-react';

export type AccountTabKey =
  | 'profile'
  | 'orders'
  | 'order_detail'
  | 'wishlist'
  | 'addresses'
  | 'reviews'
  | 'custom_orders'
  | 'custom_order_detail'
  | 'couple_websites'
  | 'support'
  | 'notifications'
  | 'settings';

export const UserAccountDashboard: React.FC = () => {
  const {
    currentUser,
    isUserLoggedIn,
    orders,
    customOrders,
    coupleWebsites,
    wishlist,
    reviews,
    tickets,
    emailNotifications,
    formatPrice,
    userLogout,
    openAuthModalWithAction,
    syncDatabase,
    showToast
  } = useStore();

  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [activeTab, setActiveTab] = useState<AccountTabKey>('profile');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedCustomOrderId, setSelectedCustomOrderId] = useState<string | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync active tab with URL
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/account/orders/') && id) {
      setActiveTab('order_detail');
      setSelectedOrderId(id);
    } else if (path.includes('/account/orders')) {
      setActiveTab('orders');
    } else if (path.includes('/account/wishlist')) {
      setActiveTab('wishlist');
    } else if (path.includes('/account/addresses')) {
      setActiveTab('addresses');
    } else if (path.includes('/account/reviews')) {
      setActiveTab('reviews');
    } else if (path.includes('/account/custom-orders/') && id) {
      setActiveTab('custom_order_detail');
      setSelectedCustomOrderId(id);
    } else if (path.includes('/account/custom-orders')) {
      setActiveTab('custom_orders');
    } else if (path.includes('/account/couple-websites')) {
      setActiveTab('couple_websites');
    } else if (path.includes('/account/support')) {
      setActiveTab('support');
    } else if (path.includes('/account/notifications')) {
      setActiveTab('notifications');
    } else if (path.includes('/account/settings')) {
      setActiveTab('settings');
    } else {
      setActiveTab('profile');
    }
  }, [location.pathname, id]);

  const handleTabChange = (tab: AccountTabKey) => {
    setActiveTab(tab);
    switch (tab) {
      case 'profile':
        navigate('/account/profile');
        break;
      case 'orders':
        navigate('/account/orders');
        break;
      case 'wishlist':
        navigate('/account/wishlist');
        break;
      case 'addresses':
        navigate('/account/addresses');
        break;
      case 'reviews':
        navigate('/account/reviews');
        break;
      case 'custom_orders':
        navigate('/account/custom-orders');
        break;
      case 'couple_websites':
        navigate('/account/couple-websites');
        break;
      case 'support':
        navigate('/account/support');
        break;
      case 'notifications':
        navigate('/account/notifications');
        break;
      case 'settings':
        navigate('/account/settings');
        break;
      default:
        navigate('/account');
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    await syncDatabase();
    setIsSyncing(false);
    showToast('Account synchronized with Supabase database.');
  };

  // IF NOT LOGGED IN
  if (!isUserLoggedIn || !currentUser) {
    return (
      <div className="bg-zinc-950 min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
            <User className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-bold text-zinc-100">Member Portal Access</h2>
            <p className="text-xs text-zinc-400">
              Sign in to your HARCONXS member account to track orders in real time, view tax invoices, manage custom commissions, and access couple sanctuaries.
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

  // Count user metrics
  const userOrdersCount = orders.filter(
    o => o.customerId === currentUser.id || (o.customerEmail && o.customerEmail.toLowerCase() === currentUser.email.toLowerCase())
  ).length;

  const userCustomOrdersCount = customOrders.filter(
    co => co.customerId === currentUser.id || (co.customerEmail && co.customerEmail.toLowerCase() === currentUser.email.toLowerCase())
  ).length;

  const userTicketsCount = tickets.filter(
    t => t.customerId === currentUser.id || (t.customerEmail && t.customerEmail.toLowerCase() === currentUser.email.toLowerCase())
  ).length;

  const navigationTabs: { key: AccountTabKey; label: string; icon: React.ComponentType<{ className?: string }>; count?: number }[] = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'orders', label: 'Orders', icon: Package, count: userOrdersCount },
    { key: 'wishlist', label: 'Wishlist', icon: Heart, count: wishlist.length },
    { key: 'addresses', label: 'Addresses', icon: MapPin, count: currentUser.addresses?.length || 0 },
    { key: 'reviews', label: 'Reviews', icon: Star },
    { key: 'custom_orders', label: 'Custom Orders', icon: Sparkles, count: userCustomOrdersCount },
    { key: 'couple_websites', label: 'Couple Websites', icon: Globe, count: coupleWebsites.length },
    { key: 'support', label: 'Support Tickets', icon: LifeBuoy, count: userTicketsCount },
    { key: 'notifications', label: 'Notifications', icon: Bell, count: emailNotifications.length },
    { key: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen pb-20">
      {/* Top Welcome Bar */}
      <div className="border-b border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 p-0.5 shadow-lg shadow-amber-500/10 flex-shrink-0">
                <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center text-amber-300 font-serif font-bold text-xl">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'H'}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl sm:text-2xl font-serif font-bold text-zinc-100">
                    {currentUser.name || 'Patron of the Atelier'}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {currentUser.loyaltyTier || 'Patron'} Tier
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">{currentUser.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-start md:self-auto">
              <button
                onClick={handleSync}
                disabled={isSyncing}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition"
                title="Sync with Supabase"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isSyncing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Sync Cloud</span>
              </button>

              <button
                onClick={() => userLogout()}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-zinc-900 hover:bg-rose-950/40 text-zinc-400 hover:text-rose-300 border border-zinc-800 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>

          {/* Horizontal Navigation Pills (Responsive Scrollable) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-6 -mb-px">
            {navigationTabs.map(tab => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.key ||
                (tab.key === 'orders' && activeTab === 'order_detail') ||
                (tab.key === 'custom_orders' && activeTab === 'custom_order_detail');

              return (
                <button
                  key={tab.key}
                  id={`account-tab-${tab.key}`}
                  onClick={() => handleTabChange(tab.key)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/10'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        isSelected ? 'bg-zinc-950 text-amber-400' : 'bg-zinc-800 text-zinc-300'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Render Tab Sections */}
        {activeTab === 'profile' && (
          <ProfileSection
            onNavigateTab={tab => handleTabChange(tab as AccountTabKey)}
            onViewOrder={orderId => {
              setSelectedOrderId(orderId);
              setActiveTab('order_detail');
              navigate(`/account/orders/${orderId}`);
            }}
          />
        )}

        {activeTab === 'orders' && (
          <OrdersSection
            onSelectOrder={orderId => {
              setSelectedOrderId(orderId);
              setActiveTab('order_detail');
              navigate(`/account/orders/${orderId}`);
            }}
            onTrackOrder={orderId => setTrackingOrderId(orderId)}
            onOpenInvoice={order => setSelectedInvoiceOrder(order)}
          />
        )}

        {activeTab === 'order_detail' && (
          <OrderDetailView
            orderId={selectedOrderId || id || ''}
            onBack={() => {
              setActiveTab('orders');
              navigate('/account/orders');
            }}
            onTrack={orderId => setTrackingOrderId(orderId)}
            onOpenInvoice={order => setSelectedInvoiceOrder(order)}
            onReviewProduct={() => {
              setActiveTab('reviews');
              navigate('/account/reviews');
            }}
          />
        )}

        {activeTab === 'wishlist' && <WishlistSection />}

        {activeTab === 'addresses' && <AddressesSection />}

        {activeTab === 'reviews' && <ReviewsSection />}

        {activeTab === 'custom_orders' && (
          <CustomOrdersSection
            onSelectCustomOrder={coId => {
              setSelectedCustomOrderId(coId);
              setActiveTab('custom_order_detail');
              navigate(`/account/custom-orders/${coId}`);
            }}
            onOpenNewCommissionModal={() => navigate('/custom-products')}
          />
        )}

        {activeTab === 'custom_order_detail' && (
          <CustomOrderDetailView
            customOrderId={selectedCustomOrderId || id || ''}
            onBack={() => {
              setActiveTab('custom_orders');
              navigate('/account/custom-orders');
            }}
          />
        )}

        {activeTab === 'couple_websites' && <CoupleWebsitesSection />}

        {activeTab === 'support' && <SupportTicketsSection />}

        {activeTab === 'notifications' && <NotificationsSection />}

        {activeTab === 'settings' && <SettingsSection />}
      </div>

      {/* Live Carrier Tracking Modal */}
      {trackingOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400" />
                Live Logistics Tracking
              </h3>
              <button
                onClick={() => setTrackingOrderId(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <OrderTrackingView initialOrderId={trackingOrderId} />
          </div>
        </div>
      )}

      {/* Official Tax Invoice Printable Viewer Modal */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-sm">
          <div className="w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-bold text-zinc-100">Tax Invoice / Receipt</h3>
                  <span className="text-xs text-zinc-400">Order #{selectedInvoiceOrder.orderNumber}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Invoice
                </button>
                <button
                  onClick={() => setSelectedInvoiceOrder(null)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Invoice Sheet */}
            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800/90 text-xs space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-serif font-bold text-amber-400 tracking-wider">HARCONXS</h2>
                  <p className="text-zinc-400 mt-1">Atelier of Luxury Laser Engraving & Bespoke Keepsakes</p>
                  <p className="text-zinc-500">GSTIN: 27AABCH1234F1Z8 • Mumbai, Maharashtra, India</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-zinc-200 font-bold block text-sm">
                    INV-{selectedInvoiceOrder.orderNumber}
                  </span>
                  <span className="text-zinc-500">
                    Date: {new Date(selectedInvoiceOrder.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-3 border-y border-zinc-800">
                <div>
                  <span className="text-zinc-500 block mb-1 font-semibold">BILLED & SHIPPED TO:</span>
                  <p className="font-bold text-zinc-200">
                    {selectedInvoiceOrder.shippingAddress?.fullName || selectedInvoiceOrder.customerName}
                  </p>
                  <p className="text-zinc-400">{selectedInvoiceOrder.shippingAddress?.street}</p>
                  <p className="text-zinc-400">
                    {selectedInvoiceOrder.shippingAddress?.city}, {selectedInvoiceOrder.shippingAddress?.state} {selectedInvoiceOrder.shippingAddress?.zip}
                  </p>
                  <p className="text-zinc-500">{selectedInvoiceOrder.shippingAddress?.phone || selectedInvoiceOrder.customerPhone}</p>
                </div>
                <div className="text-right">
                  <span className="text-zinc-500 block mb-1 font-semibold">PAYMENT METHOD:</span>
                  <p className="text-zinc-200 font-medium">Razorpay PG / Supabase Auth</p>
                  <span className="inline-block mt-2 px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    PAID IN FULL
                  </span>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left">
                <thead>
                  <tr className="text-zinc-500 border-b border-zinc-800 pb-2">
                    <th className="py-2 font-semibold">Item & Description</th>
                    <th className="py-2 font-semibold text-center">Qty</th>
                    <th className="py-2 font-semibold text-right">Unit Price</th>
                    <th className="py-2 font-semibold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-850">
                  {selectedInvoiceOrder.items.map((it, i) => (
                    <tr key={i} className="text-zinc-300">
                      <td className="py-2.5">
                        <span className="font-medium text-zinc-100">{it.product?.name || 'Atelier Item'}</span>
                        {it.personalization && (
                          <span className="block text-[10px] text-amber-400">
                            Inscription: "{it.personalization.names || it.personalization.message || 'Custom Engraving'}"
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 text-center font-mono">{it.quantity}</td>
                      <td className="py-2.5 text-right font-mono">{formatPrice(it.customPrice || it.product?.price || 0)}</td>
                      <td className="py-2.5 text-right font-mono text-zinc-100 font-semibold">
                        {formatPrice((it.customPrice || it.product?.price || 0) * it.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end pt-3 border-t border-zinc-800">
                <div className="w-64 space-y-1.5 text-xs text-zinc-400">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-mono text-zinc-200">{formatPrice(selectedInvoiceOrder.subtotal)}</span>
                  </div>
                  {selectedInvoiceOrder.packagingFee ? (
                    <div className="flex justify-between">
                      <span>Packaging:</span>
                      <span className="font-mono text-zinc-200">{formatPrice(selectedInvoiceOrder.packagingFee)}</span>
                    </div>
                  ) : null}
                  {selectedInvoiceOrder.discount ? (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount:</span>
                      <span className="font-mono">-{formatPrice(selectedInvoiceOrder.discount)}</span>
                    </div>
                  ) : null}
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span className="font-mono text-zinc-200">
                      {selectedInvoiceOrder.shippingFee === 0 ? 'FREE' : formatPrice(selectedInvoiceOrder.shippingFee)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (Included):</span>
                    <span className="font-mono text-zinc-200">{formatPrice(selectedInvoiceOrder.tax)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-zinc-100 text-sm border-t border-zinc-800 pt-2">
                    <span>Total Paid:</span>
                    <span className="font-mono text-amber-300">{formatPrice(selectedInvoiceOrder.total)}</span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-zinc-500 text-center pt-4 border-t border-zinc-800">
                This is a computer-generated tax invoice issued by HARCONXS Atelier.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
