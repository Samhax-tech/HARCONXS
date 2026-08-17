import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Key, Plus, Trash2, Copy, Check, ShieldCheck, Terminal, AlertTriangle } from 'lucide-react';

export const ApiKeyDashboard: React.FC = () => {
  const { apiKeys, createApiKey, revokeApiKey, showToast } = useStore();

  const [newKeyName, setNewKeyName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(['orders.read', 'bot.broadcast']);
  const [generatedSecret, setGeneratedSecret] = useState<string | null>(null);
  const [hasCopied, setHasCopied] = useState(false);

  // Playground simulation state
  const [testEndpoint, setTestEndpoint] = useState('/api/v1/orders/track');
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const availablePermissions = [
    { id: 'orders.read', label: 'orders.read - Read order status & tracking' },
    { id: 'bot.broadcast', label: 'bot.broadcast - Dispatch Telegram & Discord alerts' },
    { id: 'bot.verify_member', label: 'bot.verify_member - Validate VIP guild subscriptions' },
    { id: 'custom_orders.manage', label: 'custom_orders.manage - Sync custom project briefs' },
    { id: 'webhooks.manage', label: 'webhooks.manage - Create and rotate event webhooks' },
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const { secretKey } = createApiKey(newKeyName, selectedPermissions);
    setGeneratedSecret(secretKey);
    setNewKeyName('');
    showToast('API Key generated! Copy the secret now.');
  };

  const handleCopySecret = () => {
    if (generatedSecret) {
      navigator.clipboard.writeText(generatedSecret);
      setHasCopied(true);
      showToast('API secret key copied to clipboard.');
      setTimeout(() => setHasCopied(false), 3000);
    }
  };

  const handleTestApi = () => {
    setIsTesting(true);
    setTimeout(() => {
      setIsTesting(false);
      setTestResponse(JSON.stringify({
        status: 200,
        success: true,
        authenticated_as: "Hamza Shahid (Live Atelier)",
        rate_limit_remaining: 119,
        data: {
          endpoint: testEndpoint,
          timestamp: new Date().toISOString(),
          active_orders_count: 3,
          sync_mode: "real-time-webhook"
        }
      }, null, 2));
    }, 600);
  };

  const togglePermission = (permId: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permId) ? prev.filter(p => p !== permId) : [...prev, permId]
    );
  };

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Key className="w-5 h-5 text-amber-400" />
            Developer API & Integration Keys
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Authenticate external Discord bots, Telegram webhooks, and custom web applications.
          </p>
        </div>
      </div>

      {/* Secret One-Time Reveal Modal Banner if newly created */}
      {generatedSecret && (
        <div className="bg-amber-950/50 border border-amber-500/80 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Copy Your Secret Key Now (It will never be shown again!)</span>
          </div>
          
          <div className="flex items-center gap-2 bg-zinc-950 p-3 rounded-xl border border-amber-500/50">
            <code className="font-mono text-xs text-amber-300 flex-1 truncate">{generatedSecret}</code>
            <button
              onClick={handleCopySecret}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              {hasCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{hasCopied ? 'Copied' : 'Copy Key'}</span>
            </button>
          </div>

          <p className="text-[11px] text-zinc-400">
            Keep this key secret. Never expose it in client-side browser code or public GitHub repositories.
          </p>
        </div>
      )}

      {/* API Keys Table */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <span className="font-semibold text-xs text-zinc-200 uppercase tracking-wider">Active API Keys</span>
          <span className="text-xs text-zinc-500">{apiKeys.length} issued</span>
        </div>

        <div className="divide-y divide-zinc-800 text-xs">
          {apiKeys.map((key) => (
            <div key={key.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-900/40 transition-colors">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-zinc-100">{key.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    key.status === 'active' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}>
                    {key.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1 font-mono text-[11px] text-zinc-400">
                  <span>{key.prefix}</span>
                  <span>•</span>
                  <span>Rate: {key.rateLimit} req/min</span>
                  <span>•</span>
                  <span>Last used: {key.lastUsed}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {key.permissions.map(p => (
                    <span key={p} className="px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded text-[10px] font-mono">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {key.status === 'active' && (
                <button
                  onClick={() => revokeApiKey(key.id)}
                  className="px-3 py-1.5 bg-zinc-900 hover:bg-rose-950 text-zinc-400 hover:text-rose-300 border border-zinc-800 hover:border-rose-800 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Revoke Key</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Generate New Key Form */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-4">
        <h4 className="font-bold text-zinc-200 text-xs uppercase tracking-wider flex items-center gap-2">
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Create New Scoped API Key</span>
        </h4>

        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <label className="text-zinc-300 block mb-1 font-medium">Application or Key Name</label>
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="e.g. My Telegram Bot Production Server"
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 outline-none focus:border-zinc-600"
            />
          </div>

          <div>
            <label className="text-zinc-300 block mb-2 font-medium">Scoped Permissions:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {availablePermissions.map(p => {
                const checked = selectedPermissions.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePermission(p.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                      checked ? 'bg-zinc-800 border-amber-500/70 text-white' : 'bg-zinc-950/60 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${checked ? 'bg-amber-400 border-amber-400 text-zinc-950' : 'border-zinc-700'}`}>
                      {checked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                    <span className="font-mono text-[11px] truncate">{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 font-bold rounded-xl transition-colors cursor-pointer"
          >
            Generate Secret API Key
          </button>
        </form>
      </div>

      {/* Interactive API Playground & Testing */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-bold text-xs text-zinc-200 uppercase tracking-wider flex items-center gap-2">
            <Terminal className="w-4 h-4 text-sky-400" />
            <span>Interactive API Sandbox & Docs</span>
          </span>
          <span className="text-[10px] text-emerald-400 font-mono">Status: 200 OK Live</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs flex-1">
            <span className="font-mono text-emerald-400 font-bold mr-2">GET</span>
            <input
              type="text"
              value={testEndpoint}
              onChange={(e) => setTestEndpoint(e.target.value)}
              className="bg-transparent text-zinc-200 outline-none flex-1 font-mono text-xs"
            />
          </div>
          <button
            type="button"
            onClick={handleTestApi}
            disabled={isTesting}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-zinc-950 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            {isTesting ? 'Dispatching...' : 'Send Request'}
          </button>
        </div>

        {testResponse && (
          <pre className="bg-zinc-900/80 p-4 rounded-xl border border-zinc-800 font-mono text-[11px] text-zinc-300 overflow-x-auto">
            {testResponse}
          </pre>
        )}
      </div>

    </div>
  );
};
