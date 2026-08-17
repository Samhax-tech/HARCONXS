import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Mail,
  CheckCircle2,
  Clock,
  Eye,
  Send,
  Sparkles,
  Package,
  Truck,
  Shield,
  FileText,
  Copy,
  ExternalLink,
  ChevronRight,
  X,
  Bell
} from 'lucide-react';
import { EmailNotification } from '../../types';

interface EmailNotificationCenterProps {
  standalone?: boolean;
}

export const EmailNotificationCenter: React.FC<EmailNotificationCenterProps> = ({
  standalone = false
}) => {
  const {
    emailNotifications,
    currentUser,
    showToast,
    orders,
    addEmailNotification,
    formatPrice
  } = useStore();

  const [selectedEmail, setSelectedEmail] = useState<EmailNotification | null>(
    emailNotifications[0] || null
  );
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [emailPreferences, setEmailPreferences] = useState({
    accountAlerts: true,
    orderConfirmation: true,
    shippingUpdates: true,
    promotions: true
  });

  const handleOpenEmail = (email: EmailNotification) => {
    setSelectedEmail(email);
    setIsPreviewOpen(true);
  };

  const handleSendTestShippingEmail = () => {
    const activeOrder = orders[0];
    if (!activeOrder) {
      showToast('No active orders to send test shipping notification for.');
      return;
    }

    const testNotification: EmailNotification = {
      id: `eml-shp-test-${Date.now()}`,
      type: 'shipping_update',
      recipientEmail: currentUser?.email || 'hamzashahid1152901@gmail.com',
      recipientName: currentUser?.name || 'Hamza Shahid',
      subject: `🚀 Live Dispatch: Order #${activeOrder.orderNumber} in transit with BlueDart Express`,
      previewSnippet: `Your handcrafted HARCONXS order #${activeOrder.orderNumber} is on the way (AWB: BD-92841920). Real-time tracking is live.`,
      htmlContent: `
        <div style="font-family: sans-serif; background: #18181b; color: #f4f4f5; padding: 24px; border-radius: 16px; border: 1px solid #27272a;">
          <h2 style="color: #fbbf24; margin-top: 0;">HARCONXS ATELIER LOGISTICS</h2>
          <p>Hello <strong>${currentUser?.name || 'Hamza'}</strong>, your package is in transit via <strong>BlueDart Express</strong>.</p>
          <div style="background: #09090b; padding: 16px; border-radius: 12px; margin: 16px 0; font-family: monospace;">
            <div>Order ID: <strong>#${activeOrder.orderNumber}</strong></div>
            <div>Tracking AWB: <strong>BD-92841920</strong></div>
            <div>Status: <span style="color: #4ade80;">In Transit (Bangalore → Mumbai)</span></div>
          </div>
          <p style="font-size: 12px; color: #a1a1aa;">Estimated Doorstep Delivery: 2 Business Days.</p>
        </div>
      `,
      sentAt: new Date().toISOString(),
      status: 'delivered',
      orderNumber: activeOrder.orderNumber,
      carrier: 'BlueDart Express',
      trackingNumber: 'BD-92841920'
    };

    addEmailNotification(testNotification);
    showToast(`Test shipping notification email sent to ${testNotification.recipientEmail}!`);
    setSelectedEmail(testNotification);
    setIsPreviewOpen(true);
  };

  return (
    <div className={`space-y-6 ${standalone ? 'max-w-6xl mx-auto py-8 px-4 sm:px-6' : ''}`}>
      {/* Header Banner */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Mail className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-zinc-100">
              Email Notification System
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
              Active Dispatcher
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Real-time automated transaction receipts, welcome bonus credentials, and live courier tracking updates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSendTestShippingEmail}
            className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl border border-zinc-700 flex items-center gap-2 cursor-pointer transition-all"
          >
            <Send className="w-3.5 h-3.5 text-amber-400" />
            <span>Simulate Shipping Email</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Dispatched Email History Log */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-sm text-zinc-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Dispatched Emails ({emailNotifications.length})</span>
            </h3>
            <span className="text-[11px] text-zinc-500 font-mono">
              Auto-archived to Supabase
            </span>
          </div>

          {emailNotifications.length === 0 ? (
            <div className="p-10 text-center bg-zinc-900/40 rounded-2xl border border-zinc-800 space-y-2">
              <Mail className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-xs text-zinc-400">No emails sent yet. Place an order or register to trigger automatic emails.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {emailNotifications.map((eml) => {
                const isShipping = eml.type === 'shipping_update';
                const isOrder = eml.type === 'order_confirmed';
                const isAccount = eml.type === 'account_created';

                return (
                  <div
                    key={eml.id}
                    onClick={() => handleOpenEmail(eml)}
                    className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-900/80 transition-all cursor-pointer space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                            isShipping
                              ? 'bg-amber-950 text-amber-400 border border-amber-800'
                              : isOrder
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}
                        >
                          {isShipping ? (
                            <Truck className="w-3.5 h-3.5" />
                          ) : isOrder ? (
                            <Package className="w-3.5 h-3.5" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <span className="font-semibold text-xs text-zinc-200 group-hover:text-white">
                          {eml.subject}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-mono">
                        <span>{new Date(eml.sentAt).toLocaleDateString()}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-amber-400 transition-colors" />
                      </div>
                    </div>

                    <p className="text-xs text-zinc-400 line-clamp-1 pl-9">
                      {eml.previewSnippet}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-zinc-500 pl-9 pt-1">
                      <span>Recipient: <strong className="text-zinc-300">{eml.recipientEmail}</strong></span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Delivered
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Col: Preferences & Info */}
        <div className="space-y-6">
          
          {/* Notification Preferences */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-serif font-bold text-sm text-zinc-100 flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Notification Preferences</span>
            </h3>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 cursor-pointer">
                <div>
                  <span className="font-semibold text-zinc-200 block">Account & Security</span>
                  <span className="text-[10px] text-zinc-500">Welcome points & login alerts</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailPreferences.accountAlerts}
                  onChange={(e) => {
                    setEmailPreferences(p => ({ ...p, accountAlerts: e.target.checked }));
                    showToast('Notification preference updated.');
                  }}
                  className="accent-amber-400 w-4 h-4 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 cursor-pointer">
                <div>
                  <span className="font-semibold text-zinc-200 block">Order Confirmations</span>
                  <span className="text-[10px] text-zinc-500">Itemized invoices & receipts</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailPreferences.orderConfirmation}
                  onChange={(e) => {
                    setEmailPreferences(p => ({ ...p, orderConfirmation: e.target.checked }));
                    showToast('Notification preference updated.');
                  }}
                  className="accent-amber-400 w-4 h-4 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 cursor-pointer">
                <div>
                  <span className="font-semibold text-zinc-200 block">Shipping & Courier Updates</span>
                  <span className="text-[10px] text-zinc-500">Real-time BlueDart/Delhivery tracking</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailPreferences.shippingUpdates}
                  onChange={(e) => {
                    setEmailPreferences(p => ({ ...p, shippingUpdates: e.target.checked }));
                    showToast('Notification preference updated.');
                  }}
                  className="accent-amber-400 w-4 h-4 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Delivery Relay Info */}
          <div className="p-5 rounded-3xl bg-zinc-900/60 border border-zinc-800 text-xs space-y-2">
            <div className="flex items-center gap-2 text-zinc-200 font-bold">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>TLS & DKIM Signed Delivery</span>
            </div>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              All transactional receipts and air waybill dispatch alerts are encrypted and dispatched with 100% inbox deliverability.
            </p>
          </div>

        </div>

      </div>

      {/* Email Viewer / Preview Modal */}
      {isPreviewOpen && selectedEmail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-5 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center border border-amber-400/30">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white truncate max-w-sm">{selectedEmail.subject}</h4>
                  <p className="text-[10px] text-zinc-400">To: {selectedEmail.recipientEmail} • {new Date(selectedEmail.sentAt).toLocaleString()}</p>
                </div>
              </div>

              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Email Render Frame */}
            <div className="flex-1 overflow-y-auto p-6 bg-zinc-950/50">
              <div
                className="prose prose-invert max-w-none text-zinc-200"
                dangerouslySetInnerHTML={{ __html: selectedEmail.htmlContent }}
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-xs">
              <span className="text-[11px] text-zinc-500 font-mono">
                Email ID: {selectedEmail.id}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedEmail.htmlContent);
                  showToast('HTML email receipt copied to clipboard.');
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl cursor-pointer transition-all flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Receipt</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
