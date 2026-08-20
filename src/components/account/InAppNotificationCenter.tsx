import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import {
  AppNotification,
  NotificationType,
  NotificationCategory,
  NotificationPriority
} from '../../types';
import {
  Bell,
  BellRing,
  CheckCheck,
  Trash2,
  ExternalLink,
  Filter,
  CheckCircle2,
  Package,
  CreditCard,
  Truck,
  Sparkles,
  Heart,
  MessageSquare,
  Key,
  ShieldCheck,
  Mail,
  Send,
  AlertTriangle,
  Clock,
  Search,
  SlidersHorizontal,
  ChevronRight,
  RefreshCw,
  Info,
  Database
} from 'lucide-react';

interface InAppNotificationCenterProps {
  standalone?: boolean;
  onCloseTray?: () => void;
}

export const InAppNotificationCenter: React.FC<InAppNotificationCenterProps> = ({
  standalone = true,
  onCloseTray
}) => {
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    clearAllReadNotifications,
    dispatchNotification,
    currentUser,
    orders,
    customOrders,
    coupleWebsites,
    supabaseStatus,
    showToast
  } = useStore();

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'all' | 'orders' | 'custom' | 'couples' | 'security' | 'support'>('all');
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedEventType, setSimulatedEventType] = useState<NotificationType>('ORDER_CREATED');

  // Filtered notifications
  const filteredNotifications = notifications.filter(notif => {
    // Tab category filter
    if (activeTab === 'orders' && notif.category !== 'orders') return false;
    if (activeTab === 'custom' && notif.category !== 'custom_orders') return false;
    if (activeTab === 'couples' && notif.category !== 'couple_websites') return false;
    if (activeTab === 'security' && notif.category !== 'account_security') return false;
    if (activeTab === 'support' && notif.category !== 'support') return false;

    // Unread filter
    if (filterUnreadOnly && notif.isRead) return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = notif.title.toLowerCase().includes(q);
      const matchesMessage = notif.message.toLowerCase().includes(q);
      const matchesCategory = notif.category.toLowerCase().includes(q);
      if (!matchesTitle && !matchesMessage && !matchesCategory) return false;
    }

    return true;
  });

  const handleActionClick = (notif: AppNotification) => {
    if (!notif.isRead) {
      markNotificationAsRead(notif.id);
    }
    if (onCloseTray) {
      onCloseTray();
    }
    if (notif.actionUrl) {
      if (notif.actionUrl.startsWith('http')) {
        window.open(notif.actionUrl, '_blank', 'noopener,noreferrer');
      } else {
        navigate(notif.actionUrl);
      }
    }
  };

  const handleSimulateNotification = async () => {
    setIsSimulating(true);
    try {
      const sampleOrderId = orders[0]?.orderNumber || 'ORD-HX-98214';
      const sampleCustomReq = customOrders[0]?.requestNumber || 'CO-49201';
      const sampleCouple = coupleWebsites[0]?.subdomain || 'alina-karan';

      const dataMap: Record<NotificationType, any> = {
        ACCOUNT_CREATED: { loyaltyPoints: 150 },
        EMAIL_VERIFICATION: { verificationCode: '849201' },
        ORDER_CREATED: { orderNumber: sampleOrderId, total: 189.0, itemsCount: 2 },
        PAYMENT_SUCCESSFUL: { orderNumber: sampleOrderId, amount: 189.0, paymentMethod: 'UPI' },
        ORDER_PROCESSING: { orderNumber: sampleOrderId, status: 'Processing' },
        ORDER_SHIPPED: { orderNumber: sampleOrderId, carrier: 'BlueDart Express', trackingNumber: 'BD-99382109' },
        ORDER_DELIVERED: { orderNumber: sampleOrderId, carrier: 'BlueDart Express' },
        REFUND_PROCESSED: { orderNumber: sampleOrderId, refundAmount: 49.0, reason: 'Exchange adjustment' },
        CUSTOM_ORDER_MESSAGE: { requestNumber: sampleCustomReq, senderName: 'Master Artisan Anya', messagePreview: 'CAD rendering complete! Please inspect gemstones placement.' },
        CUSTOM_QUOTE_ISSUED: { requestNumber: sampleCustomReq, quoteAmount: 340.0, turnaroundDays: 7 },
        QUOTE_ACCEPTED: { requestNumber: sampleCustomReq, quoteAmount: 340.0 },
        COUPLE_WEBSITE_PURCHASE: { websiteTitle: 'Eternal Sanctuary', subdomain: sampleCouple, templateName: 'Luxe Champagne Gold' },
        WEBSITE_PUBLISHED: { websiteTitle: 'Eternal Sanctuary', subdomain: sampleCouple, liveUrl: `https://${sampleCouple}.harconxsshop.com` },
        SUPPORT_REPLY: { ticketNumber: 'TKT-84920', subject: 'Express Delivery Timeline', replyPreview: 'Our logistics team has prioritized your bespoke ring packaging.' },
        API_KEY_CREATED: { keyName: 'Mobile App Gateway', keyPrefix: 'hx_live_89a0b...', scopes: ['read:orders', 'write:custom_orders'] },
        API_KEY_REVOKED: { keyName: 'Legacy Bot Token', keyPrefix: 'hx_live_fa77e...' }
      };

      await dispatchNotification({
        type: simulatedEventType,
        userId: currentUser?.id,
        recipientEmail: currentUser?.email || 'customer@harconxs.com',
        recipientName: currentUser?.name || 'Valued Patron',
        data: dataMap[simulatedEventType] || {}
      });

      showToast(`Triggered event: ${simulatedEventType.replace(/_/g, ' ')}`);
    } catch (err: any) {
      showToast(`Notification error: ${err?.message || 'Failed to dispatch'}`);
    } finally {
      setIsSimulating(false);
    }
  };

  const getCategoryIcon = (category: NotificationCategory, type: NotificationType) => {
    switch (type) {
      case 'ACCOUNT_CREATED':
      case 'EMAIL_VERIFICATION':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'ORDER_CREATED':
      case 'PAYMENT_SUCCESSFUL':
        return <CreditCard className="w-4 h-4 text-amber-400" />;
      case 'ORDER_PROCESSING':
        return <Package className="w-4 h-4 text-blue-400" />;
      case 'ORDER_SHIPPED':
      case 'ORDER_DELIVERED':
        return <Truck className="w-4 h-4 text-teal-400" />;
      case 'REFUND_PROCESSED':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'CUSTOM_ORDER_MESSAGE':
      case 'CUSTOM_QUOTE_ISSUED':
      case 'QUOTE_ACCEPTED':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 'COUPLE_WEBSITE_PURCHASE':
      case 'WEBSITE_PUBLISHED':
        return <Heart className="w-4 h-4 text-rose-400" />;
      case 'SUPPORT_REPLY':
        return <MessageSquare className="w-4 h-4 text-cyan-400" />;
      case 'API_KEY_CREATED':
      case 'API_KEY_REVOKED':
        return <Key className="w-4 h-4 text-amber-400" />;
      default:
        return <Bell className="w-4 h-4 text-zinc-400" />;
    }
  };

  const getPriorityBadge = (priority?: NotificationPriority) => {
    if (priority === 'urgent') {
      return (
        <span className="px-1.5 py-0.5 text-[10px] font-bold rounded uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40">
          Urgent
        </span>
      );
    }
    if (priority === 'high') {
      return (
        <span className="px-1.5 py-0.5 text-[10px] font-bold rounded uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
          High
        </span>
      );
    }
    return null;
  };

  const formatTimestamp = (iso: string) => {
    try {
      const date = new Date(iso);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;

      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="relative p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <BellRing className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-zinc-950 text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-serif font-bold text-zinc-100">
                In-App Notification Center
              </h2>
              {unreadNotificationsCount > 0 ? (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {unreadNotificationsCount} new
                </span>
              ) : (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  All Caught Up
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 mt-0.5 flex items-center gap-2">
              <span>Synchronized with Supabase and server transactional email engine</span>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                <Database className="w-3 h-3" /> Live
              </span>
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {unreadNotificationsCount > 0 && (
            <button
              onClick={markAllNotificationsAsRead}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5 text-amber-400" />
              Mark All Read
            </button>
          )}

          {notifications.some(n => n.isRead) && (
            <button
              onClick={clearAllReadNotifications}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-800/80 hover:bg-rose-950/40 hover:text-rose-300 text-zinc-400 border border-zinc-700/80 hover:border-rose-800/60 transition cursor-pointer"
              title="Clear read notifications"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Read
            </button>
          )}
        </div>
      </div>

      {/* Interactive Trigger Simulator (Covers All 16 Events) */}
      <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/90 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Notification & Email Event Dispatch Simulator</span>
            <span className="text-[10px] text-zinc-500 font-mono">(16 Supported Flow Triggers)</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <select
            value={simulatedEventType}
            onChange={e => setSimulatedEventType(e.target.value as NotificationType)}
            className="flex-1 px-3 py-2 text-xs rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 focus:outline-none focus:border-amber-500"
          >
            <optgroup label="Authentication & Account">
              <option value="ACCOUNT_CREATED">1. Account Creation (Welcome & 150 Pts)</option>
              <option value="EMAIL_VERIFICATION">2. Email Verification Token</option>
            </optgroup>
            <optgroup label="E-Commerce & Orders">
              <option value="ORDER_CREATED">3. Order Created (Tax Invoice attached)</option>
              <option value="PAYMENT_SUCCESSFUL">4. Payment Successful (UPI/Card settlement)</option>
              <option value="ORDER_PROCESSING">5. Order Processing (Atelier bench)</option>
              <option value="ORDER_SHIPPED">6. Order Shipped (Carrier tracking waybill)</option>
              <option value="ORDER_DELIVERED">7. Order Delivered (Confirmation)</option>
              <option value="REFUND_PROCESSED">8. Refund Processed (Financial credit)</option>
            </optgroup>
            <optgroup label="Custom Orders & Atelier Commissions">
              <option value="CUSTOM_ORDER_MESSAGE">9. Custom Order Message (Artisan notes)</option>
              <option value="CUSTOM_QUOTE_ISSUED">10. Custom Quote Issued (Bespoke specs)</option>
              <option value="QUOTE_ACCEPTED">11. Quote Accepted (Reserved materials)</option>
            </optgroup>
            <optgroup label="Couple Sanctuary Websites">
              <option value="COUPLE_WEBSITE_PURCHASE">12. Couple Website Purchase</option>
              <option value="WEBSITE_PUBLISHED">13. Website Published (Live URL)</option>
            </optgroup>
            <optgroup label="Concierge & Developer Security">
              <option value="SUPPORT_REPLY">14. Support Ticket Reply (Resolution)</option>
              <option value="API_KEY_CREATED">15. API Key Created (Live token)</option>
              <option value="API_KEY_REVOKED">16. API Key Revoked (Security alert)</option>
            </optgroup>
          </select>

          <button
            onClick={handleSimulateNotification}
            disabled={isSimulating}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-zinc-950 transition disabled:opacity-50 cursor-pointer shrink-0"
          >
            {isSimulating ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>Dispatch Test Notification</span>
          </button>
        </div>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full text-xs font-medium scrollbar-none">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer ${
              activeTab === 'all'
                ? 'bg-amber-500 text-zinc-950 font-semibold shadow-sm'
                : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
            }`}
          >
            All Notifications ({notifications.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-amber-500 text-zinc-950 font-semibold shadow-sm'
                : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
            }`}
          >
            Orders & Shipping
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer ${
              activeTab === 'custom'
                ? 'bg-amber-500 text-zinc-950 font-semibold shadow-sm'
                : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
            }`}
          >
            Custom Orders
          </button>
          <button
            onClick={() => setActiveTab('couples')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer ${
              activeTab === 'couples'
                ? 'bg-amber-500 text-zinc-950 font-semibold shadow-sm'
                : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
            }`}
          >
            Sanctuary Websites
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer ${
              activeTab === 'security'
                ? 'bg-amber-500 text-zinc-950 font-semibold shadow-sm'
                : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
            }`}
          >
            Auth & Security
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer ${
              activeTab === 'support'
                ? 'bg-amber-500 text-zinc-950 font-semibold shadow-sm'
                : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
            }`}
          >
            Concierge Support
          </button>
        </div>

        {/* Right Filter & Search */}
        <div className="flex items-center gap-2">
          {/* Search box */}
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-xs"
              >
                ×
              </button>
            )}
          </div>

          {/* Unread toggle */}
          <button
            onClick={() => setFilterUnreadOnly(!filterUnreadOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
              filterUnreadOnly
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
            }`}
            title="Filter by unread notifications only"
          >
            <Filter className="w-3 h-3" />
            <span>Unread Only</span>
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-zinc-900/40 border border-dashed border-zinc-800">
            <div className="w-12 h-12 rounded-full bg-zinc-800/80 flex items-center justify-center mx-auto mb-3 text-zinc-500">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-300">No Notifications Found</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
              {filterUnreadOnly
                ? 'You have read all notifications in this view.'
                : 'No alerts match your search or filter parameters. Use the simulator above to dispatch a test notification.'}
            </p>
          </div>
        ) : (
          filteredNotifications.map(notif => {
            const isUnread = !notif.isRead;

            return (
              <div
                key={notif.id}
                className={`group relative p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
                  isUnread
                    ? 'bg-zinc-900/90 border-amber-500/30 hover:border-amber-500/50 shadow-lg shadow-black/40'
                    : 'bg-zinc-950/60 border-zinc-850 hover:border-zinc-750 opacity-90'
                }`}
              >
                {/* Unread Left Dot */}
                {isUnread && (
                  <div className="absolute left-2.5 top-5 w-2 h-2 rounded-full bg-amber-400 shadow-sm shadow-amber-400" />
                )}

                <div className="flex items-start justify-between gap-3 pl-2">
                  {/* Icon & Details */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div
                      className={`p-2.5 rounded-xl shrink-0 ${
                        isUnread
                          ? 'bg-zinc-800 border border-zinc-700 shadow-inner'
                          : 'bg-zinc-900 border border-zinc-800'
                      }`}
                    >
                      {getCategoryIcon(notif.category, notif.type)}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4
                          className={`text-sm font-semibold truncate ${
                            isUnread ? 'text-zinc-100 font-bold' : 'text-zinc-300'
                          }`}
                        >
                          {notif.title}
                        </h4>
                        {getPriorityBadge(notif.priority)}
                        <span className="text-[11px] text-zinc-500 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(notif.createdAt)}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-350 leading-relaxed break-words">
                        {notif.message}
                      </p>

                      {/* Dynamic Meta & Data pill tags */}
                      {notif.data && Object.keys(notif.data).length > 0 && (
                        <div className="flex items-center gap-2 pt-1 flex-wrap text-[11px] text-zinc-400">
                          {notif.data.orderNumber && (
                            <span className="px-2 py-0.5 rounded bg-zinc-800/80 border border-zinc-700/80 font-mono text-amber-300">
                              Order #{notif.data.orderNumber}
                            </span>
                          )}
                          {notif.data.requestNumber && (
                            <span className="px-2 py-0.5 rounded bg-zinc-800/80 border border-zinc-700/80 font-mono text-purple-300">
                              Atelier #{notif.data.requestNumber}
                            </span>
                          )}
                          {notif.data.trackingNumber && (
                            <span className="px-2 py-0.5 rounded bg-zinc-800/80 border border-zinc-700/80 font-mono text-teal-300">
                              AWB: {notif.data.trackingNumber}
                            </span>
                          )}
                          {notif.data.subdomain && (
                            <span className="px-2 py-0.5 rounded bg-zinc-800/80 border border-zinc-700/80 font-mono text-rose-300">
                              {notif.data.subdomain}.harconxsshop.com
                            </span>
                          )}
                          {notif.data.verificationCode && (
                            <span className="px-2 py-0.5 rounded bg-zinc-800/80 border border-zinc-700/80 font-mono text-emerald-300 font-bold">
                              Code: {notif.data.verificationCode}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Action CTA Button */}
                      {notif.actionUrl && (
                        <div className="pt-2">
                          <button
                            onClick={() => handleActionClick(notif)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition cursor-pointer"
                          >
                            <span>{notif.actionLabel || 'View Details'}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions (Mark as read / Delete) */}
                  <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition">
                    {isUnread && (
                      <button
                        onClick={() => markNotificationAsRead(notif.id)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 transition cursor-pointer"
                        title="Mark as read"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notif.id)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-950/40 transition cursor-pointer"
                      title="Delete notification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
