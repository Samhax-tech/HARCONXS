import React, { useState } from 'react';
import { InAppNotificationCenter } from '../InAppNotificationCenter';
import { EmailNotificationCenter } from '../EmailNotificationCenter';
import { useStore } from '../../../context/StoreContext';
import {
  Bell,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Sparkles,
  Inbox,
  Send
} from 'lucide-react';

export const NotificationsSection: React.FC = () => {
  const { showToast } = useStore();

  const [activeSubTab, setActiveSubTab] = useState<'in_app' | 'email_logs' | 'preferences'>('in_app');
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [shippingTracking, setShippingTracking] = useState(true);
  const [artisanMessages, setArtisanMessages] = useState(true);
  const [newsletter, setNewsletter] = useState(false);

  const handleSavePreferences = () => {
    showToast('Notification preferences updated.');
  };

  return (
    <div className="space-y-6">
      {/* Sub navigation bar for notification center */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('in_app')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeSubTab === 'in_app'
              ? 'bg-amber-500 text-zinc-950 shadow'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
          }`}
        >
          <Inbox className="w-3.5 h-3.5" />
          <span>In-App Notifications</span>
        </button>

        <button
          onClick={() => setActiveSubTab('email_logs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeSubTab === 'email_logs'
              ? 'bg-amber-500 text-zinc-950 shadow'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Dispatched Email Logs</span>
        </button>

        <button
          onClick={() => setActiveSubTab('preferences')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeSubTab === 'preferences'
              ? 'bg-amber-500 text-zinc-950 shadow'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Channel Preferences</span>
        </button>
      </div>

      {activeSubTab === 'in_app' && (
        <InAppNotificationCenter standalone={true} />
      )}

      {activeSubTab === 'email_logs' && (
        <EmailNotificationCenter standalone={true} />
      )}

      {activeSubTab === 'preferences' && (
        /* Notification Preferences Card */
        <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
            <Sliders className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-zinc-100">Delivery & Dispatch Preferences</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 cursor-pointer hover:border-zinc-700 transition">
              <input
                type="checkbox"
                checked={orderAlerts}
                onChange={e => setOrderAlerts(e.target.checked)}
                className="mt-0.5 rounded border-zinc-700 text-amber-500 focus:ring-amber-500 bg-zinc-900"
              />
              <div>
                <span className="font-semibold text-zinc-200 block">Order Confirmations & Invoices</span>
                <p className="text-zinc-500 text-[11px] mt-0.5">Receive immediate digital tax invoice and payment receipts</p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 cursor-pointer hover:border-zinc-700 transition">
              <input
                type="checkbox"
                checked={shippingTracking}
                onChange={e => setShippingTracking(e.target.checked)}
                className="mt-0.5 rounded border-zinc-700 text-amber-500 focus:ring-amber-500 bg-zinc-900"
              />
              <div>
                <span className="font-semibold text-zinc-200 block">Carrier Logistics & Out for Delivery</span>
                <p className="text-zinc-500 text-[11px] mt-0.5">Live tracking milestones and dispatch notices</p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 cursor-pointer hover:border-zinc-700 transition">
              <input
                type="checkbox"
                checked={artisanMessages}
                onChange={e => setArtisanMessages(e.target.checked)}
                className="mt-0.5 rounded border-zinc-700 text-amber-500 focus:ring-amber-500 bg-zinc-900"
              />
              <div>
                <span className="font-semibold text-zinc-200 block">Artisan CAD Proofs & Quotes</span>
                <p className="text-zinc-500 text-[11px] mt-0.5">Instant alerts when an artisan posts a design proof or message</p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 cursor-pointer hover:border-zinc-700 transition">
              <input
                type="checkbox"
                checked={newsletter}
                onChange={e => setNewsletter(e.target.checked)}
                className="mt-0.5 rounded border-zinc-700 text-amber-500 focus:ring-amber-500 bg-zinc-900"
              />
              <div>
                <span className="font-semibold text-zinc-200 block">Atelier Private Previews & Drops</span>
                <p className="text-zinc-500 text-[11px] mt-0.5">Curated seasonal lookbooks and VIP promotional privileges</p>
              </div>
            </label>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSavePreferences}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition cursor-pointer"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
