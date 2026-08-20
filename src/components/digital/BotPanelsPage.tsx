import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { BotPanelService } from '../../types';
import { PrivateBillingModal } from './PrivateBillingModal';
import { Bot, Send, Shield, MessageSquare, Check, Sparkles, Zap, Terminal, ExternalLink } from 'lucide-react';
import { Analytics } from '../../services/analyticsService';

export const BotPanelsPage: React.FC = () => {
  const { botPanelServices, formatPrice, setCurrentView } = useStore();

  const [selectedService, setSelectedService] = useState<BotPanelService>(botPanelServices[0]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>(selectedService.plans[1]?.id || selectedService.plans[0].id);
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);

  // Live interactive sandbox tester
  const [testBroadcastText, setTestBroadcastText] = useState('🚨 Special Flash Release: Coordinates matching titanium set is live!');
  const [broadcastOutput, setBroadcastOutput] = useState<string | null>(null);
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // Track bot panel view
  React.useEffect(() => {
    if (selectedService) {
      Analytics.trackBotPanelViewed({
        botId: selectedService.id,
        botName: selectedService.name,
        plan: selectedPlanId
      });
    }
  }, [selectedService]);

  const handleSelectService = (service: BotPanelService) => {
    setSelectedService(service);
    setSelectedPlanId(service.plans[1]?.id || service.plans[0].id);
  };

  const handleSimulateBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBroadcasting(true);
    setTimeout(() => {
      setIsBroadcasting(false);
      setBroadcastOutput(`[SUCCESS 200 OK] Dispatched webhook broadcast to 4,820 VIP channel subscribers in 142ms via HARCONXS Cloud Gateway.`);
    }, 800);
  };

  return (
    <div className="bg-zinc-950 min-h-screen py-10 text-zinc-200 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-950/60 border border-sky-800/60 text-sky-300 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-sky-400" />
            <span>HARCONXS Cloud Bot Infrastructure</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-zinc-100">
            Bot Panels & Automation Suites
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
            Turnkey management portals for Telegram, Discord, and WhatsApp. Monetize VIP channels, automate moderation, schedule broadcasts, and sync with custom webhook APIs.
          </p>
        </div>

        {/* Platform Selection Tabs */}
        <div className="flex items-center justify-center gap-3 overflow-x-auto no-scrollbar py-1">
          {botPanelServices.map((svc) => (
            <button
              key={svc.id}
              onClick={() => handleSelectService(svc)}
              className={`px-5 py-2.5 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                selectedService.id === svc.id
                  ? 'bg-zinc-900 border-sky-400/80 text-white ring-1 ring-sky-400/30 shadow-lg'
                  : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {svc.platform === 'Telegram' && <Send className="w-4 h-4 text-sky-400" />}
              {svc.platform === 'Discord' && <Shield className="w-4 h-4 text-indigo-400" />}
              {svc.platform === 'WhatsApp' && <MessageSquare className="w-4 h-4 text-emerald-400" />}
              <span>{svc.name}</span>
            </button>
          ))}
        </div>

        {/* MAIN SERVICE HERO & PLANS MATRIX */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-zinc-800 pb-8">
            <div className="max-w-2xl space-y-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-950 text-sky-300 border border-sky-800 uppercase tracking-wider">
                {selectedService.platform} High-Performance Cloud Instance
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-100">{selectedService.name}</h2>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">{selectedService.fullDesc}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => setIsBillingModalOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-300 hover:to-sky-400 text-zinc-950 font-bold text-xs sm:text-sm rounded-xl shadow-xl flex items-center gap-2 cursor-pointer transition-all"
              >
                <Zap className="w-4 h-4" />
                <span>Launch Panel & Billing</span>
              </button>
            </div>
          </div>

          {/* Pricing Tier Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {selectedService.plans.map((plan) => {
              const isSelected = selectedPlanId === plan.id;

              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`p-6 rounded-2xl border flex flex-col justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-900 border-sky-400 shadow-2xl ring-1 ring-sky-400/40'
                      : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-zinc-100 text-sm">{plan.name}</h3>
                      {plan.isPopular && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-950 text-sky-300 border border-sky-800">
                          RECOMMENDED
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-zinc-100 font-mono">{formatPrice(plan.price)}</span>
                      <span className="text-xs text-zinc-500">/{plan.billingPeriod}</span>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-zinc-800 text-xs">
                      {plan.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-zinc-300">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlanId(plan.id);
                      setIsBillingModalOpen(true);
                    }}
                    className={`mt-6 w-full py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-sky-400 hover:bg-sky-300 text-zinc-950 shadow-md'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                    }`}
                  >
                    Select {plan.name}
                  </button>
                </div>
              );
            })}
          </div>

          {/* INTERACTIVE BROADCAST & WEBHOOK SANDBOX */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-sky-400" />
                <h3 className="font-bold text-xs text-zinc-200 uppercase tracking-wider">Live Cloud Broadcast Sandbox</h3>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">Simulated Channel ID: #vip-harconxs</span>
            </div>

            <form onSubmit={handleSimulateBroadcast} className="space-y-3 text-xs">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={testBroadcastText}
                  onChange={(e) => setTestBroadcastText(e.target.value)}
                  placeholder="Enter message to broadcast across simulated bot webhook..."
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 outline-none focus:border-zinc-600"
                />
                <button
                  type="submit"
                  disabled={isBroadcasting}
                  className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-zinc-950 font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isBroadcasting ? 'Broadcasting...' : 'Test Broadcast'}
                </button>
              </div>
            </form>

            {broadcastOutput && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl font-mono text-[11px] text-emerald-300">
                {broadcastOutput}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Private Panel Billing Modal */}
      <PrivateBillingModal
        service={selectedService}
        selectedPlanId={selectedPlanId}
        isOpen={isBillingModalOpen}
        onClose={() => setIsBillingModalOpen(false)}
      />

    </div>
  );
};
