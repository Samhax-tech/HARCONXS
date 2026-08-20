import React, { useState } from 'react';
import { 
  Bot, 
  Search, 
  Server, 
  Terminal, 
  Activity, 
  ShieldCheck, 
  Power, 
  Play, 
  Pause, 
  CheckCircle2, 
  Clock, 
  Zap,
  RotateCcw
} from 'lucide-react';
import { enforceServerSidePermission } from '../../../services/adminAuthService';
import { useStore } from '../../../context/StoreContext';

interface BotPanelsAdminSectionProps {
  subSection: 'bot-plans' | 'bot-services';
  onNavigateSubSection: (sec: 'bot-plans' | 'bot-services') => void;
}

export const BotPanelsAdminSection: React.FC<BotPanelsAdminSectionProps> = ({
  subSection,
  onNavigateSubSection
}) => {
  const { showToast } = useStore();

  const [plans, setPlans] = useState([
    {
      id: 'plan-1',
      name: 'Starter E-commerce Assistant',
      platform: 'Telegram & Discord',
      priceMonthly: 1999,
      features: ['Catalog Search & Browsing', 'Order Status Tracking', 'Instant Payment Links', 'Up to 500 Daily Queries'],
      activeSubscribers: 12
    },
    {
      id: 'plan-2',
      name: 'Sovereign VIP Concierge Bot',
      platform: 'Telegram, WhatsApp & Discord',
      priceMonthly: 4999,
      features: ['Real-time Flash Sale Broadcasts', 'Custom CAD Upload Handlers', 'Private Client Ring Fitting AI', 'Unlimited Queries & Webhooks'],
      activeSubscribers: 28
    },
    {
      id: 'plan-3',
      name: 'Enterprise Atelier Daemon',
      platform: 'Multi-Channel High-Availability',
      priceMonthly: 9999,
      features: ['Dedicated Kubernetes Pod', 'Custom LLM Fine-tuning', 'Direct ERP/Inventory Webhooks', 'Zero-Latency SLA (99.99%)'],
      activeSubscribers: 6
    }
  ]);

  const [services, setServices] = useState([
    {
      id: 'bot-01',
      name: 'Harconxs VIP Telegram Daemon',
      botUsername: '@HarconxsVipBot',
      clusterNode: 'asia-south1-pod-04',
      status: 'active',
      uptime: '99.98%',
      todayCommands: 1420,
      webhookLatencyMs: 42,
      lastHeartbeat: '2 seconds ago'
    },
    {
      id: 'bot-02',
      name: 'Artisan Concierge Discord Bot',
      botUsername: 'HarconxsAtelier#0001',
      clusterNode: 'asia-south1-pod-02',
      status: 'active',
      uptime: '100%',
      todayCommands: 680,
      webhookLatencyMs: 38,
      lastHeartbeat: '5 seconds ago'
    },
    {
      id: 'bot-03',
      name: 'Flash Drops WhatsApp Dispatcher',
      botUsername: 'WA Business ID: 91982000000',
      clusterNode: 'asia-south1-pod-07',
      status: 'paused',
      uptime: '98.5%',
      todayCommands: 0,
      webhookLatencyMs: 0,
      lastHeartbeat: 'Paused by admin'
    }
  ]);

  const handleToggleBot = async (botId: string, currentStatus: string) => {
    try {
      await enforceServerSidePermission('bot_services:manage', 'bot_daemon', botId);
      const nextStatus = currentStatus === 'active' ? 'paused' : 'active';
      setServices(prev => prev.map(b => b.id === botId ? { ...b, status: nextStatus, lastHeartbeat: nextStatus === 'active' ? 'Just restarted' : 'Paused by admin' } : b));
      showToast(`Bot Daemon status changed to ${nextStatus.toUpperCase()}.`);
    } catch (err: any) {
      showToast(err.message || 'Permission Denied: Bot infrastructure management requires admin role.');
    }
  };

  return (
    <div id="bot-panels-admin-section" className="space-y-6">
      {/* Sub-navigation */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2">
          <button
            id="tab-bot-plans"
            onClick={() => onNavigateSubSection('bot-plans')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              subSection === 'bot-plans' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <Bot className="w-4 h-4" />
            Bot Plans ({plans.length})
          </button>
          <button
            id="tab-bot-services"
            onClick={() => onNavigateSubSection('bot-services')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              subSection === 'bot-services' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <Server className="w-4 h-4" />
            Live Bot Services ({services.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Server RBAC Protected
          </span>
        </div>
      </div>

      {/* 1. BOT PLANS */}
      {subSection === 'bot-plans' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-400">
              Subscription tiers for Harconxs automated messaging, broadcast bots, and VIP concierge panels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map(plan => (
              <div key={plan.id} className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-amber-400 font-bold">{plan.platform}</span>
                    <span className="text-xs text-zinc-500">{plan.activeSubscribers} clients</span>
                  </div>
                  <h4 className="font-serif font-bold text-zinc-100 text-lg">{plan.name}</h4>
                  <div className="text-2xl font-serif font-bold text-zinc-100 mt-2">
                    ₹{plan.priceMonthly.toLocaleString()}<span className="text-xs text-zinc-400 font-normal"> / month</span>
                  </div>

                  <div className="space-y-2 mt-4 text-xs text-zinc-300">
                    {plan.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800">
                  <span className="px-3 py-1.5 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-medium block text-center">
                    Plan Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. LIVE BOT SERVICES */}
      {subSection === 'bot-services' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-400">
              Real-time monitoring of automated daemons, webhook latency, and daily command throughput.
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Bot Daemon</th>
                  <th className="py-3 px-4">Handle / ID</th>
                  <th className="py-3 px-4">Cluster Pod</th>
                  <th className="py-3 px-4">Latency & SLA</th>
                  <th className="py-3 px-4">Today Commands</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Power Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {services.map(srv => (
                  <tr key={srv.id} className="hover:bg-zinc-800/40">
                    <td className="py-3 px-4 font-medium text-zinc-100">{srv.name}</td>
                    <td className="py-3 px-4 font-mono text-xs text-amber-400">{srv.botUsername}</td>
                    <td className="py-3 px-4 font-mono text-xs text-zinc-400">{srv.clusterNode}</td>
                    <td className="py-3 px-4 font-mono text-xs">
                      <div className="text-emerald-400">{srv.webhookLatencyMs}ms latency</div>
                      <div className="text-zinc-500">{srv.uptime} uptime</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-zinc-100">{srv.todayCommands.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-mono uppercase ${
                        srv.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {srv.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggleBot(srv.id, srv.status)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                          srv.status === 'active' ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {srv.status === 'active' ? 'Pause' : 'Start'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
