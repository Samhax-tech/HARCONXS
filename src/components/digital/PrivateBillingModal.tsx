import React, { useState } from 'react';
import { BotPanelService } from '../../types';
import { useStore } from '../../context/StoreContext';
import { X, ShieldCheck, CreditCard, Check, Zap, ExternalLink, Key, RefreshCw, Clock } from 'lucide-react';

interface Props {
  service: BotPanelService;
  selectedPlanId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const PrivateBillingModal: React.FC<Props> = ({ service, selectedPlanId, isOpen, onClose }) => {
  const { formatPrice, showToast, user } = useStore();

  const [activeTab, setActiveTab] = useState<'checkout' | 'invoices' | 'tokens'>('checkout');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  if (!isOpen) return null;

  const plan = service.plans.find(p => p.id === selectedPlanId) || service.plans[0];
  const price = billingCycle === 'yearly' ? plan.price * 10 : plan.price; // 2 months free on yearly

  const handleSubscribe = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSubscribed(true);
      showToast(`Subscription activated for ${service.name}!`);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header - Mimicking the Private Billing Portal */}
        <div className="p-6 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-950/60 border border-sky-800/60 text-sky-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-zinc-100">{service.name}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-950 text-sky-300 border border-sky-800">
                  Private Billing Engine
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">Secure automated cloud provisioning & license keys</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-200 p-1.5 rounded-lg hover:bg-zinc-900 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 border-b border-zinc-800 bg-zinc-950 text-xs">
          <button
            onClick={() => setActiveTab('checkout')}
            className={`py-3 px-4 font-semibold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'checkout' ? 'border-sky-400 text-sky-300' : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Plan & Provisioning
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`py-3 px-4 font-semibold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'invoices' ? 'border-sky-400 text-sky-300' : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Billing & Invoices
          </button>
          <button
            onClick={() => setActiveTab('tokens')}
            className={`py-3 px-4 font-semibold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'tokens' ? 'border-sky-400 text-sky-300' : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Panel Webhooks & API
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-zinc-300">
          
          {activeTab === 'checkout' && (
            <div className="space-y-5">
              
              {/* Plan Summary Box */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-zinc-100 text-sm">{plan.name} Tier</h4>
                    <span className="text-zinc-400 text-[11px]">{service.platform} Cloud Panel Dedicated Instance</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-zinc-100 font-mono">{formatPrice(price)}</span>
                    <span className="text-zinc-500 block text-[10px]">/ {billingCycle === 'yearly' ? 'year (2 mo free)' : 'month'}</span>
                  </div>
                </div>

                {/* Features List */}
                <div className="pt-3 border-t border-zinc-800/80 space-y-2">
                  <span className="font-semibold text-zinc-200 text-[11px] uppercase tracking-wider block">Included Cloud Modules:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-zinc-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Billing Cycle Switch */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="font-medium text-zinc-200">Billing Interval</span>
                <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-3 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                      billingCycle === 'monthly' ? 'bg-zinc-800 text-white' : 'text-zinc-400'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-3 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                      billingCycle === 'yearly' ? 'bg-sky-500 text-zinc-950' : 'text-zinc-400'
                    }`}
                  >
                    Annual (Save 20%)
                  </button>
                </div>
              </div>

              {/* Action */}
              {isSubscribed ? (
                <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <Check className="w-5 h-5 text-emerald-400" />
                    <span>Panel Provisioned Successfully!</span>
                  </div>
                  <p className="text-xs text-emerald-200 leading-relaxed">
                    Your credentials have been dispatched to <strong>{user.email}</strong>. You can now access your private bot dashboard or copy your secret webhook tokens.
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleSubscribe}
                  disabled={isProcessing}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-300 hover:to-sky-400 text-zinc-950 font-bold text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{isProcessing ? 'Provisioning Cloud Node...' : `Activate Subscription • ${formatPrice(price)}`}</span>
                </button>
              )}

            </div>
          )}

          {activeTab === 'invoices' && (
            <div className="space-y-3">
              <span className="font-semibold text-zinc-300 text-xs block">Recent Cloud Invoices</span>
              <div className="border border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-800 bg-zinc-900/40">
                <div className="p-3.5 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-zinc-100">INV-2026-8940</p>
                    <span className="text-[11px] text-zinc-500">August 16, 2026 • Stripe Auto-debit</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-zinc-200">{formatPrice(plan.price)}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                      PAID
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tokens' && (
            <div className="space-y-4">
              <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-100 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    Live Webhook Secret
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">Auto-rotates in 30 days</span>
                </div>
                <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 font-mono text-[11px] text-sky-400 select-all">
                  whsec_live_948a10f829bb409d21e89f
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
