import React, { useState, useEffect } from 'react';
import { BotPanelService } from '../../../types';
import {
  Terminal,
  Send,
  Shield,
  MessageSquare,
  Globe,
  Play,
  RotateCw,
  Square,
  Cpu,
  HardDrive,
  Activity,
  CheckCircle2,
  AlertCircle,
  Copy,
  Layers,
  Zap,
  Lock,
  ExternalLink
} from 'lucide-react';

interface Props {
  service: BotPanelService;
}

export const BotPanelDemoEmulator: React.FC<Props> = ({ service }) => {
  const demoType = service.interactiveDemoType || 'broadcast';

  // --- Telegram / Broadcaster State ---
  const [broadcastMessage, setBroadcastMessage] = useState(
    '🔥 [VIP ACCESS] New titanium collection drop & custom engraving slots open! Tap below to claim.'
  );
  const [selectedChannel, setSelectedChannel] = useState('#harconxs-vip-members (4,820 Subs)');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastLogs, setBroadcastLogs] = useState<string[]>([]);
  const [hasBroadcasted, setHasBroadcasted] = useState(false);

  // --- Discord Ticket & Mod State ---
  const [ticketSubject, setTicketSubject] = useState('Order delivery tracking inquiry for order #HX-90821');
  const [ticketCategory, setTicketCategory] = useState<'Order Logistics' | 'Custom Atelier' | 'VIP Gating'>('Order Logistics');
  const [activeTicket, setActiveTicket] = useState<{ id: string; user: string; status: string; messages: { author: string; role: string; text: string; time: string }[] } | null>(null);
  const [newStaffReply, setNewStaffReply] = useState('');

  // --- WordPress Bridge State ---
  const [wpOrderNumber, setWpOrderNumber] = useState('HX-90821');
  const [wpEmail, setWpEmail] = useState('patron@harconxs.com');
  const [wpTrackingResult, setWpTrackingResult] = useState<any | null>(null);
  const [isWpSearching, setIsWpSearching] = useState(false);

  // --- Pterodactyl Console State ---
  const [serverStatus, setServerStatus] = useState<'running' | 'stopping' | 'offline'>('running');
  const [consoleOutput, setConsoleOutput] = useState<string[]>([
    '[Pterodactyl Daemon]: Server container node-01 booted successfully.',
    '[Runtime]: Node.js v20.12.0 LTS initializing environment.',
    '[HARCONXS Core]: Connected to central Supabase real-time gateway.',
    '[Socket]: Listening on 0.0.0.0:3000 (PID 4108).',
    '[Ready]: Bot event listeners registered. 0 dropped packets.'
  ]);
  const [cpuUsage, setCpuUsage] = useState(18);
  const [ramUsage, setRamUsage] = useState(384);
  const [cmdInput, setCmdInput] = useState('');

  // Auto-pulse console meters
  useEffect(() => {
    if (serverStatus !== 'running') return;
    const interval = setInterval(() => {
      setCpuUsage(prev => Math.min(95, Math.max(8, prev + Math.floor(Math.random() * 9 - 4))));
      setRamUsage(prev => Math.min(1024, Math.max(256, prev + Math.floor(Math.random() * 20 - 10))));
    }, 2500);
    return () => clearInterval(interval);
  }, [serverStatus]);

  // Handlers
  const handleRunBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    setIsBroadcasting(true);
    setTimeout(() => {
      setIsBroadcasting(false);
      setHasBroadcasted(true);
      setBroadcastLogs(prev => [
        `[${new Date().toLocaleTimeString()}] 200 OK -> Broadcast queued to ${selectedChannel}`,
        `[${new Date().toLocaleTimeString()}] Payload delivered in 118ms via HARCONXS Cloud Webhook Node`,
        ...prev.slice(0, 5)
      ]);
    }, 700);
  };

  const handleCreateDiscordTicket = () => {
    setActiveTicket({
      id: `ticket-${Math.floor(1000 + Math.random() * 9000)}`,
      user: 'Sarah_Atelier#4920',
      status: 'Open',
      messages: [
        {
          author: 'Sarah_Atelier',
          role: 'Patron',
          text: `Hi support team! I need an update on: "${ticketSubject}" (Category: ${ticketCategory}).`,
          time: 'Just now'
        },
        {
          author: 'HARCONXS-Bot',
          role: 'Automated Bot',
          text: '✅ Ticket filed into central Supabase database. An artisan specialist has been alerted.',
          time: 'Just now'
        }
      ]
    });
  };

  const handleStaffReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffReply.trim() || !activeTicket) return;
    setActiveTicket({
      ...activeTicket,
      messages: [
        ...activeTicket.messages,
        {
          author: 'Staff_Dev',
          role: 'Support Lead',
          text: newStaffReply,
          time: 'Just now'
        }
      ]
    });
    setNewStaffReply('');
  };

  const handleWpTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setIsWpSearching(true);
    setTimeout(() => {
      setIsWpSearching(false);
      setWpTrackingResult({
        orderNumber: wpOrderNumber || 'HX-90821',
        status: 'In Production (Laser Engraving)',
        carrier: 'FedEx Express Courier',
        trackingNumber: 'HX-FEDEX-99824102',
        estimatedDelivery: '3 business days',
        items: 'Titanium Celestial Star Map Music Box'
      });
    }, 600);
  };

  const handleServerAction = (action: 'start' | 'restart' | 'stop') => {
    if (action === 'stop') {
      setServerStatus('stopping');
      setConsoleOutput(prev => [...prev, `[Daemon]: SIGTERM signal received. Shutting down container...`]);
      setTimeout(() => {
        setServerStatus('offline');
        setConsoleOutput(prev => [...prev, `[Daemon]: Server container stopped.`]);
        setCpuUsage(0);
        setRamUsage(0);
      }, 800);
    } else if (action === 'start') {
      setServerStatus('running');
      setConsoleOutput(prev => [...prev, `[Daemon]: Booting Pterodactyl Docker container...`, `[Runtime]: Starting process...`]);
      setCpuUsage(15);
      setRamUsage(320);
    } else if (action === 'restart') {
      setConsoleOutput(prev => [...prev, `[Daemon]: Restarting container instance...`]);
      setTimeout(() => {
        setConsoleOutput(prev => [...prev, `[Runtime]: Reboot complete. Bot reconnected.`]);
      }, 500);
    }
  };

  const handleConsoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmdInput.trim()) return;
    const cmd = cmdInput.trim();
    setConsoleOutput(prev => [...prev, `$ ${cmd}`, `[Response]: Executed '${cmd}' successfully.`]);
    setCmdInput('');
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
      {/* Emulator Header */}
      <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <div className="h-4 w-px bg-zinc-700 mx-1" />
          <span className="text-xs font-mono font-bold text-zinc-200 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-sky-400" />
            HARCONXS Interactive Live Sandbox
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-800 text-[10px] font-mono font-bold text-emerald-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Cloud Engine Ready
          </span>
          <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline">
            Node: eu-de-fra01
          </span>
        </div>
      </div>

      {/* Emulator Body by Type */}
      <div className="p-6">
        {/* 1. Telegram Broadcaster / VIP Gate Emulator */}
        {demoType === 'broadcast' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Control Form */}
            <div className="lg:col-span-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">Target VIP Channel / Group</label>
                <select
                  value={selectedChannel}
                  onChange={(e) => setSelectedChannel(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-200 outline-none focus:border-sky-500"
                >
                  <option>#harconxs-vip-members (4,820 Subs)</option>
                  <option>#crypto-trade-signals (1,940 Subs)</option>
                  <option>#atelier-custom-drops (620 Subs)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">Broadcast Message & Rich Embed</label>
                <textarea
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  rows={3}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 outline-none focus:border-sky-500 resize-none font-sans"
                  placeholder="Type broadcast text..."
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-zinc-400">Inline Button: [ Claim VIP Access ]</span>
                <button
                  onClick={handleRunBroadcast}
                  disabled={isBroadcasting}
                  className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-zinc-950 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-all shadow-lg active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isBroadcasting ? 'Broadcasting...' : 'Dispatch Live Broadcast'}</span>
                </button>
              </div>

              {/* Logs */}
              {broadcastLogs.length > 0 && (
                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl space-y-1 font-mono text-[10px] text-emerald-400">
                  {broadcastLogs.map((log, i) => (
                    <div key={i}>{log}</div>
                  ))}
                </div>
              )}
            </div>

            {/* Simulated Telegram Chat Bubble Preview */}
            <div className="lg:col-span-6 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-[11px] text-zinc-400">
                  <span className="font-semibold text-zinc-200">Telegram Channel Live View</span>
                  <span className="text-emerald-400 font-mono">4,820 Members</span>
                </div>

                <div className="bg-[#182533] border border-sky-900/40 rounded-2xl p-4 shadow-xl space-y-3 max-w-sm ml-auto">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center text-zinc-950 font-bold text-xs">
                      HX
                    </div>
                    <div>
                      <div className="text-xs font-bold text-sky-300">HARCONXS VIP Bot</div>
                      <div className="text-[10px] text-zinc-400">bot • automated</div>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-100 leading-relaxed whitespace-pre-wrap">
                    {broadcastMessage || 'Broadcast message will appear here...'}
                  </p>

                  <div className="pt-2">
                    <button className="w-full py-2 bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-200 text-xs font-semibold rounded-xl text-center transition-colors">
                      💎 Claim VIP Pass & Catalog (20% Off)
                    </button>
                  </div>
                  <div className="text-right text-[10px] text-zinc-400 font-mono">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Delivered
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between">
                <span>Webhook Delivery: <strong>Sub-150ms</strong></span>
                <span className="text-sky-400">Zero Socket Drops</span>
              </div>
            </div>
          </div>
        )}

        {/* 2. Discord Moderation & Ticket Simulator */}
        {demoType === 'moderation' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Ticket Creator Form */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-3">
                  <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                    <Shield className="w-4 h-4 text-indigo-400" />
                    Discord Support Ticket Panel
                  </h4>

                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-400 font-medium">Category</label>
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value as any)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 outline-none"
                    >
                      <option>Order Logistics</option>
                      <option>Custom Atelier</option>
                      <option>VIP Gating</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-400 font-medium">Subject / Inquiry</label>
                    <input
                      type="text"
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 outline-none"
                    />
                  </div>

                  <button
                    onClick={handleCreateDiscordTicket}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer"
                  >
                    📩 Open Simulated Support Ticket
                  </button>
                </div>
              </div>

              {/* Discord Thread Box */}
              <div className="lg:col-span-7 bg-[#2b2d31] border border-zinc-700/60 rounded-2xl p-4 text-zinc-200 space-y-4 font-sans">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-700/60 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-indigo-300"># ticket-9042</span>
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-300 font-mono">
                      {activeTicket ? activeTicket.status : 'Ready to spawn'}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400">HARCONXS Ticket Transcripts Engine</span>
                </div>

                <div className="space-y-3 min-h-[160px] max-h-[220px] overflow-y-auto">
                  {activeTicket ? (
                    activeTicket.messages.map((msg, i) => (
                      <div key={i} className="flex items-start gap-3 text-xs">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          msg.role === 'Automated Bot' ? 'bg-indigo-500 text-white' : 'bg-zinc-700 text-zinc-200'
                        }`}>
                          {msg.author[0]}
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs">{msg.author}</span>
                            <span className="text-[10px] text-zinc-400">{msg.time}</span>
                          </div>
                          <p className="text-zinc-300 leading-relaxed">{msg.text}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-xs text-zinc-400">
                      Click "Open Simulated Support Ticket" on the left to test the automated Discord ticket flow.
                    </div>
                  )}
                </div>

                {activeTicket && (
                  <form onSubmit={handleStaffReply} className="flex gap-2 pt-2 border-t border-zinc-700/60">
                    <input
                      type="text"
                      value={newStaffReply}
                      onChange={(e) => setNewStaffReply(e.target.value)}
                      placeholder="Reply as staff member..."
                      className="flex-1 bg-[#1e1f22] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl"
                    >
                      Reply
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 3. WordPress Bridge & Shortcode Simulator */}
        {demoType === 'wordpress_bridge' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-bold text-zinc-200">WordPress Shortcode Simulator</h4>
                </div>
                <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl font-mono text-[11px] text-sky-400">
                  [harconxs_order_tracker title="Track Package"]
                </div>

                <form onSubmit={handleWpTrack} className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-400 font-medium">Order Number</label>
                    <input
                      type="text"
                      value={wpOrderNumber}
                      onChange={(e) => setWpOrderNumber(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-400 font-medium">Patron Email</label>
                    <input
                      type="email"
                      value={wpEmail}
                      onChange={(e) => setWpEmail(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isWpSearching}
                    className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg transition-all"
                  >
                    {isWpSearching ? 'Querying Central API...' : 'Search Order via WordPress AJAX'}
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-4">
              <span className="text-xs font-bold text-zinc-300 block uppercase tracking-wider">
                WordPress Frontend Rendered Output
              </span>

              {wpTrackingResult ? (
                <div className="p-4 bg-zinc-950 border border-emerald-800/60 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="text-xs font-bold text-zinc-100 font-mono">{wpTrackingResult.orderNumber}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                      {wpTrackingResult.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-zinc-300">
                    <div>
                      <span className="text-zinc-500 block text-[10px]">Carrier</span>
                      <span>{wpTrackingResult.carrier}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px]">Tracking Number</span>
                      <span className="font-mono text-sky-400">{wpTrackingResult.trackingNumber}</span>
                    </div>
                  </div>
                  <div className="p-2.5 bg-zinc-900 rounded-xl text-[11px] text-zinc-300">
                    Item: <strong>{wpTrackingResult.items}</strong> • ETA: {wpTrackingResult.estimatedDelivery}
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-xs text-zinc-400">
                  Enter an order number on the left to test real-time WordPress AJAX order lookup.
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. Pterodactyl Server Console & Cloud Monitor */}
        {demoType === 'hosting_pterodactyl' && (
          <div className="space-y-4">
            {/* Top Metric Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-1">
                <span className="text-[10px] text-zinc-500 font-semibold uppercase flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-sky-400" />
                  State
                </span>
                <span className={`text-xs font-bold font-mono ${serverStatus === 'running' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {serverStatus.toUpperCase()}
                </span>
              </div>

              <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-1">
                <span className="text-[10px] text-zinc-500 font-semibold uppercase flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-amber-400" />
                  CPU Load
                </span>
                <span className="text-xs font-bold font-mono text-zinc-100">{cpuUsage}%</span>
              </div>

              <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-1">
                <span className="text-[10px] text-zinc-500 font-semibold uppercase flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
                  Memory (RAM)
                </span>
                <span className="text-xs font-bold font-mono text-zinc-100">{ramUsage} MB / 2048 MB</span>
              </div>

              <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-1">
                <span className="text-[10px] text-zinc-500 font-semibold uppercase flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  DDoS Shield
                </span>
                <span className="text-xs font-bold font-mono text-emerald-400">Protected (12 Tbps)</span>
              </div>
            </div>

            {/* Power Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleServerAction('start')}
                disabled={serverStatus === 'running'}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" /> Start
              </button>
              <button
                onClick={() => handleServerAction('restart')}
                disabled={serverStatus !== 'running'}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" /> Restart
              </button>
              <button
                onClick={() => handleServerAction('stop')}
                disabled={serverStatus === 'offline'}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Square className="w-3.5 h-3.5" /> Stop
              </button>
            </div>

            {/* Live Terminal Output */}
            <div className="bg-black/90 border border-zinc-800 rounded-2xl p-4 font-mono text-xs text-zinc-300 space-y-2">
              <div className="h-44 overflow-y-auto space-y-1 scrollbar-thin">
                {consoleOutput.map((line, i) => (
                  <div key={i} className="leading-relaxed">
                    <span className="text-zinc-600">[{new Date().toLocaleTimeString()}]</span> {line}
                  </div>
                ))}
              </div>

              <form onSubmit={handleConsoleSubmit} className="flex gap-2 pt-2 border-t border-zinc-800">
                <span className="text-emerald-400 font-bold">$</span>
                <input
                  type="text"
                  value={cmdInput}
                  onChange={(e) => setCmdInput(e.target.value)}
                  placeholder="Enter command (e.g. status, npm list, reload)..."
                  className="flex-1 bg-transparent text-xs text-white outline-none"
                />
              </form>
            </div>
          </div>
        )}

        {/* 5. Custom Architecture Builder */}
        {demoType === 'custom_builder' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-2">
              <h4 className="font-bold text-zinc-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-400" />
                1. Workflow Briefing
              </h4>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                Define your exact API triggers, database queries, and custom business logic.
              </p>
            </div>
            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-2">
              <h4 className="font-bold text-zinc-100 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-400" />
                2. Container Node Build
              </h4>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                We provision dedicated Pterodactyl Docker containers with guaranteed RAM and CPU.
              </p>
            </div>
            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-2">
              <h4 className="font-bold text-zinc-100 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                3. CI/CD & Ownership
              </h4>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                Full source code ownership transferred with 24/7 priority SLA monitoring.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
