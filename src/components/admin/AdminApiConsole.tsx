import React, { useState } from 'react';
import {
  KeyRound,
  Shield,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Trash2,
  Copy,
  Send,
  Code2,
  Terminal,
  Activity,
  Zap,
  Server,
  Lock,
  ExternalLink,
  Search,
  Filter,
  Check,
  Bot
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import {
  INITIAL_API_CLIENTS,
  SYSTEM_API_SCOPES,
  handleApiV1Request,
  createInternalApiKey,
  rotateInternalApiKey,
  revokeApiKey as revokeInternalApiKey,
  getStoredApiKeys,
  getApiUsageLogs
} from '../../services/apiCoreService';
import { ApiKeyRecord, ApiScopeId, ApiUsageLog } from '../../types';
import { BotApiIntegrationsGuide } from './BotApiIntegrationsGuide';

export const AdminApiConsole: React.FC = () => {
  const { showToast } = useStore();

  // Local state for keys & telemetry
  const [keysList, setKeysList] = useState<ApiKeyRecord[]>(() => getStoredApiKeys());
  const [usageLogs, setUsageLogs] = useState<ApiUsageLog[]>(() => getApiUsageLogs());
  const [activeTab, setActiveTab] = useState<'bots' | 'tester' | 'keys' | 'clients' | 'logs'>('bots');

  // Key creation state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string>('HARCONXS-TELEGRAM');
  const [keyName, setKeyName] = useState('');
  const [selectedScopes, setSelectedScopes] = useState<ApiScopeId[]>([
    'products:read',
    'search:query',
    'chat:interact',
    'support:write',
    'knowledge:read',
    'system:health'
  ]);
  const [rateLimitPerHour, setRateLimitPerHour] = useState<number>(3600);
  const [expiresInDays, setExpiresInDays] = useState<number>(365);
  const [oneTimeRawKey, setOneTimeRawKey] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Live Console Tester state
  const [testEndpoint, setTestEndpoint] = useState<string>('/api/v1/chat');
  const [testMethod, setTestMethod] = useState<'GET' | 'POST'>('POST');
  const [testHeadersJson, setTestHeadersJson] = useState<string>('{}');
  const [testBodyJson, setTestBodyJson] = useState<string>(
    JSON.stringify(
      {
        message: 'Do you have couple gift boxes under 2500 with custom laser engraving?',
        context: {
          client: 'HARCONXS-TELEGRAM',
          userId: 'tg-user-9821'
        }
      },
      null,
      2
    )
  );
  const [selectedAuthKeyId, setSelectedAuthKeyId] = useState<string>(keysList[0]?.id || '');
  const [customKeyToken, setCustomKeyToken] = useState<string>('');
  const [isLoadingTest, setIsLoadingTest] = useState(false);
  const [testResponse, setTestResponse] = useState<any>(null);
  const [testLatency, setTestLatency] = useState<number | null>(null);
  const [testStatusCode, setTestStatusCode] = useState<number | null>(null);

  // Quick Preset Selector for Live Tester
  const endpointPresets = [
    {
      label: 'System Health Check',
      path: '/api/v1/health',
      method: 'GET' as const,
      body: ''
    },
    {
      label: 'AI Grounded Chat (Telegram/Discord)',
      path: '/api/v1/chat',
      method: 'POST' as const,
      body: JSON.stringify(
        {
          message: 'Can you create a custom couple website with love countdown and music?',
          context: { client: 'HARCONXS-TELEGRAM' }
        },
        null,
        2
      )
    },
    {
      label: 'Product Catalog Query',
      path: '/api/v1/products',
      method: 'GET' as const,
      body: ''
    },
    {
      label: 'Multi-Criteria Search',
      path: '/api/v1/search?q=couple&category=couples&maxPrice=5000',
      method: 'GET' as const,
      body: ''
    },
    {
      label: 'Atelier Knowledge Base (FAQs & Policies)',
      path: '/api/v1/knowledge',
      method: 'GET' as const,
      body: ''
    },
    {
      label: 'Submit Support Ticket (Discord Bot)',
      path: '/api/v1/support/tickets',
      method: 'POST' as const,
      body: JSON.stringify(
        {
          subject: 'Discord Bot Inquiry: Custom Woodwork Engraving',
          category: 'Custom Order',
          message: 'Client on Discord is asking for titanium inlay on oak gift box.',
          customerName: 'Discord Moderator @Alex',
          customerEmail: 'alex.support@discord.internal'
        },
        null,
        2
      )
    }
  ];

  const handleApplyPreset = (preset: typeof endpointPresets[0]) => {
    setTestEndpoint(preset.path);
    setTestMethod(preset.method);
    if (preset.body) {
      setTestBodyJson(preset.body);
    } else {
      setTestBodyJson('');
    }
  };

  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) {
      showToast('Please provide a descriptive identifier for this key.');
      return;
    }

    const { rawKey, keyRecord } = await createInternalApiKey({
      clientId: selectedClientId,
      name: keyName.trim(),
      scopes: selectedScopes,
      rateLimit: rateLimitPerHour,
      expiresInDays: expiresInDays > 0 ? expiresInDays : undefined
    });

    setKeysList(getStoredApiKeys());
    setOneTimeRawKey(rawKey);
    setKeyName('');
    showToast(`Service key generated for ${selectedClientId}.`);
  };

  const handleRotateKey = async (keyId: string) => {
    if (!confirm('Rotating this key will generate a new secret token and reset the previous token. Proceed?')) {
      return;
    }
    const res = await rotateInternalApiKey(keyId);
    if (res) {
      setKeysList(getStoredApiKeys());
      setOneTimeRawKey(res.rawKey);
      showToast('Key successfully rotated. Copy new token now.');
    }
  };

  const handleRevokeKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to permanently revoke this API key? Internal services using it will be blocked.')) {
      return;
    }
    await revokeInternalApiKey(keyId);
    setKeysList(getStoredApiKeys());
    showToast('API Key revoked.');
  };

  const toggleScope = (scopeId: ApiScopeId) => {
    setSelectedScopes(prev =>
      prev.includes(scopeId) ? prev.filter(s => s !== scopeId) : [...prev, scopeId]
    );
  };

  const handleExecuteLiveTest = async () => {
    setIsLoadingTest(true);
    setTestResponse(null);
    setTestStatusCode(null);
    const startTime = performance.now();

    try {
      let headers: Record<string, string> = {};
      try {
        if (testHeadersJson.trim()) {
          headers = JSON.parse(testHeadersJson);
        }
      } catch {
        // ignore malformed headers
      }

      // Determine Key to supply
      let apiKeyToUse = customKeyToken.trim();
      if (!apiKeyToUse && selectedAuthKeyId) {
        const found = keysList.find(k => k.id === selectedAuthKeyId);
        if (found) {
          // If we don't have raw token, we pass header if available
          apiKeyToUse = oneTimeRawKey || 'hx_live_mock_internal_key';
        }
      }

      if (apiKeyToUse) {
        headers['x-harconxs-api-key'] = apiKeyToUse;
      }

      let parsedBody: any = undefined;
      if (testMethod === 'POST' && testBodyJson.trim()) {
        try {
          parsedBody = JSON.parse(testBodyJson);
        } catch {
          parsedBody = { raw: testBodyJson };
        }
      }

      // Extract query from path if provided
      let cleanPath = testEndpoint;
      const queryParams: Record<string, string> = {};
      if (testEndpoint.includes('?')) {
        const [p, q] = testEndpoint.split('?');
        cleanPath = p;
        const searchParams = new URLSearchParams(q);
        searchParams.forEach((val, k) => {
          queryParams[k] = val;
        });
      }

      const res = await handleApiV1Request({
        method: testMethod,
        path: cleanPath,
        query: queryParams,
        headers,
        body: parsedBody,
        ip: '127.0.0.1 (Admin Console)',
        userAgent: 'HARCONXS-Admin-Interactive-Tester/v1.4'
      });

      const elapsed = Math.round(performance.now() - startTime);
      setTestLatency(elapsed);
      setTestStatusCode(res.status);
      setTestResponse(res.body);

      // Refresh logs
      setUsageLogs(getApiUsageLogs());
    } catch (err: any) {
      const elapsed = Math.round(performance.now() - startTime);
      setTestLatency(elapsed);
      setTestStatusCode(500);
      setTestResponse({
        error: {
          code: 'CLIENT_EXECUTION_ERROR',
          message: err?.message || 'Error executing request via internal dispatcher'
        }
      });
    } finally {
      setIsLoadingTest(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-serif font-bold text-zinc-100">Private HARCONXS API Infrastructure</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-800/80 text-amber-300 font-mono text-[10px]">
              Internal Only • Zero Public Ingestion
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            High-performance, secure REST serverless infrastructure powering HARCONXS Web AI, Telegram Support Bot,
            Discord Bot, WordPress Sync, and Internal Operations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-400/20 flex items-center gap-2 cursor-pointer transition-all"
          >
            <KeyRound className="w-4 h-4" />
            <span>Generate Internal Key</span>
          </button>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
        <button
          onClick={() => setActiveTab('bots')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'bots'
              ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/10'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Support Bots & API Docs (Telegram, Discord, WhatsApp, WordPress)</span>
        </button>

        <button
          onClick={() => setActiveTab('tester')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'tester'
              ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/10'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Interactive Live API Console</span>
        </button>

        <button
          onClick={() => setActiveTab('keys')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'keys'
              ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/10'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Active Service Keys ({keysList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('clients')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'clients'
              ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/10'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>Internal Clients ({INITIAL_API_CLIENTS.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'logs'
              ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/10'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Safe Telemetry & Audit Logs ({usageLogs.length})</span>
        </button>
      </div>

      {/* ONE-TIME GENERATED RAW KEY BANNER */}
      {oneTimeRawKey && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-700/60 rounded-2xl space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>New Secret API Key Generated! Copy it now (never stored plaintext, shown only once):</span>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono">SHA-256 Hashed on Server</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={oneTimeRawKey}
              className="flex-1 bg-zinc-950 border border-emerald-800/80 rounded-xl p-2.5 text-xs font-mono text-emerald-400 outline-none select-all"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(oneTimeRawKey);
                setIsCopied(true);
                showToast('API Key copied to clipboard.');
                setTimeout(() => setIsCopied(false), 2000);
              }}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{isCopied ? 'Copied' : 'Copy Key'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 0. MULTI-CLIENT BOT INTEGRATIONS & API DOCUMENTATION */}
      {activeTab === 'bots' && <BotApiIntegrationsGuide />}

      {/* 1. INTERACTIVE LIVE TESTER TAB */}
      {activeTab === 'tester' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Preset buttons & Request Configuration */}
          <div className="lg:col-span-6 space-y-4">
            {/* Quick Presets */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 space-y-2.5">
              <span className="text-[11px] font-mono uppercase text-zinc-400 font-bold block">
                Quick Endpoint Presets
              </span>
              <div className="flex flex-wrap gap-1.5">
                {endpointPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="px-2.5 py-1 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-lg text-[11px] font-mono cursor-pointer transition-all hover:border-amber-400"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Request Builder */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h4 className="font-bold text-zinc-100 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-amber-400" />
                  <span>Request Dispatcher</span>
                </h4>
                <span className="text-[10px] font-mono text-zinc-500">Vercel Route Handler</span>
              </div>

              {/* Method & Endpoint Input */}
              <div className="flex gap-2">
                <select
                  value={testMethod}
                  onChange={(e) => setTestMethod(e.target.value as any)}
                  className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-amber-400 outline-none"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                </select>
                <input
                  type="text"
                  value={testEndpoint}
                  onChange={(e) => setTestEndpoint(e.target.value)}
                  placeholder="/api/v1/..."
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs font-mono text-zinc-100 outline-none focus:border-amber-400"
                />
              </div>

              {/* Authentication Credentials */}
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-semibold block text-[11px]">Authentication Service Token</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <select
                    value={selectedAuthKeyId}
                    onChange={(e) => setSelectedAuthKeyId(e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs font-mono text-zinc-300 outline-none"
                  >
                    <option value="">-- Use Stored Key Context --</option>
                    {keysList.map(k => (
                      <option key={k.id} value={k.id}>
                        {k.clientId} ({k.name})
                      </option>
                    ))}
                  </select>
                  <input
                    type="password"
                    value={customKeyToken}
                    onChange={(e) => setCustomKeyToken(e.target.value)}
                    placeholder="Or paste custom secret key..."
                    className="bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs font-mono text-zinc-300 outline-none"
                  />
                </div>
              </div>

              {/* JSON Body editor if POST */}
              {testMethod === 'POST' && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-zinc-400 font-semibold block text-[11px]">JSON Payload</label>
                    <span className="text-[10px] font-mono text-zinc-500">application/json</span>
                  </div>
                  <textarea
                    rows={8}
                    value={testBodyJson}
                    onChange={(e) => setTestBodyJson(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs font-mono text-emerald-400 outline-none focus:border-amber-400"
                    placeholder="{\n  &quot;key&quot;: &quot;value&quot;\n}"
                  />
                </div>
              )}

              {/* Execute Button */}
              <button
                type="button"
                onClick={handleExecuteLiveTest}
                disabled={isLoadingTest}
                className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {isLoadingTest ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Executing Request...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Execute Live API Request</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Live Output & Response Inspector */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-3 min-h-[460px] flex flex-col">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <h4 className="font-bold text-zinc-100 text-xs">Response Payload & Headers</h4>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  {testStatusCode && (
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold ${
                        testStatusCode >= 200 && testStatusCode < 300
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : testStatusCode === 401 || testStatusCode === 403
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}
                    >
                      HTTP {testStatusCode}
                    </span>
                  )}
                  {testLatency !== null && (
                    <span className="text-[11px] text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded-lg border border-zinc-800">
                      {testLatency}ms
                    </span>
                  )}
                </div>
              </div>

              {/* Payload View */}
              <div className="flex-1 bg-zinc-950 border border-zinc-800/90 rounded-xl p-4 overflow-auto font-mono text-xs text-zinc-200">
                {testResponse ? (
                  <pre className="text-[11px] leading-relaxed text-emerald-400 whitespace-pre-wrap">
                    {JSON.stringify(testResponse, null, 2)}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-600 text-center py-12">
                    <Terminal className="w-8 h-8 mb-2 opacity-40 text-zinc-500" />
                    <p className="text-xs">No active response payload.</p>
                    <p className="text-[10px] text-zinc-600 mt-1">Select an endpoint preset and click Execute.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ACTIVE SERVICE KEYS TAB */}
      {activeTab === 'keys' && (
        <div className="space-y-4">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h4 className="font-bold text-zinc-100 text-sm">Internal Service Token Registry</h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Cryptographically hashed keys for internal service authentication and rate limit enforcement.
                </p>
              </div>
              <span className="text-xs font-mono text-amber-400 bg-amber-950/60 px-3 py-1 rounded-xl border border-amber-800/80">
                {keysList.filter(k => k.status === 'active').length} Active Tokens
              </span>
            </div>

            <div className="space-y-3">
              {keysList.map(k => (
                <div
                  key={k.id}
                  className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4.5 space-y-3 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-sm text-zinc-100">{k.name}</span>
                        <span className="px-2 py-0.5 rounded-lg bg-zinc-900 border border-zinc-800 font-mono text-[10px] text-amber-400 font-semibold">
                          {k.clientId}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                            k.status === 'active'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}
                        >
                          {k.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="font-mono text-[11px] text-zinc-500">
                        Prefix: <span className="text-zinc-300">{k.prefix}</span> • Created:{' '}
                        {new Date(k.createdAt).toLocaleDateString()} • Last Used: {k.lastUsed}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {k.status === 'active' && (
                        <>
                          <button
                            onClick={() => handleRotateKey(k.id)}
                            className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-colors"
                            title="Rotate this key"
                          >
                            <RotateCw className="w-3 h-3 text-amber-400" />
                            <span>Rotate Key</span>
                          </button>
                          <button
                            onClick={() => handleRevokeKey(k.id)}
                            className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/80 rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-colors"
                            title="Permanently revoke"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Revoke</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Scopes Badges */}
                  <div className="pt-2 border-t border-zinc-900 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-mono uppercase text-zinc-500 mr-1">Permitted Scopes:</span>
                    {k.permissions.map((scope, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-300"
                      >
                        {scope}
                      </span>
                    ))}
                  </div>

                  {/* Rate Limit & Request Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-zinc-900 text-[11px] text-zinc-400 font-mono">
                    <div>
                      Rate Limit: <span className="text-zinc-200">{k.rateLimit} req/hr</span>
                    </div>
                    <div>
                      Total Invocations: <span className="text-amber-400">{k.requestCount || 0}</span>
                    </div>
                    <div>
                      Expires:{' '}
                      <span className="text-zinc-200">
                        {k.expiresAt ? new Date(k.expiresAt).toLocaleDateString() : 'Never'}
                      </span>
                    </div>
                    <div>
                      Security: <span className="text-emerald-400">SHA-256 Hashed</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. INTERNAL CLIENTS OVERVIEW */}
      {activeTab === 'clients' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INITIAL_API_CLIENTS.map(client => (
            <div key={client.id} className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-mono font-bold text-xs">
                    {client.id.substring(0, 3)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-zinc-100">{client.name}</h4>
                    <span className="font-mono text-[10px] text-amber-400">{client.id}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 font-mono text-[10px] border border-emerald-800">
                  {client.status || (client.isActive ? 'Active' : 'Inactive')}
                </span>
              </div>

              <p className="text-xs text-zinc-400">{client.description}</p>

              <div className="space-y-1.5 pt-2 border-t border-zinc-800 text-xs">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Default Allowed Scopes:</span>
                <div className="flex flex-wrap gap-1">
                  {(client.allowedScopes || client.defaultScopes || []).map(scope => (
                    <span key={scope} className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-[10px] font-mono text-zinc-300">
                      {scope}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. TELEMETRY & SAFE AUDIT LOGS */}
      {activeTab === 'logs' && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div>
              <h4 className="font-bold text-zinc-100 text-sm">Real-time Telemetry & Audit Stream</h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                Masked, sanitized logs of internal requests. No credentials, tokens, or private secrets are logged.
              </p>
            </div>
            <button
              onClick={() => setUsageLogs(getApiUsageLogs())}
              className="px-3 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
            >
              <RotateCw className="w-3 h-3 text-amber-400" />
              <span>Refresh Logs</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 text-zinc-400 uppercase font-mono text-[10px] border-b border-zinc-800">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Request ID</th>
                  <th className="p-3">Client / Key</th>
                  <th className="p-3">Endpoint</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80 font-mono">
                {usageLogs.slice(0, 20).map(log => (
                  <tr key={log.id} className="hover:bg-zinc-800/30">
                    <td className="p-3 text-zinc-400 text-[11px]">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="p-3 text-zinc-500 text-[10px]">{log.requestId.substring(0, 16)}...</td>
                    <td className="p-3 text-amber-300 font-semibold">{log.clientId || 'HARCONXS-WEB'}</td>
                    <td className="p-3 text-zinc-200">{log.endpoint}</td>
                    <td className="p-3">
                      <span className="px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-[10px] text-zinc-300 font-bold">
                        {log.method}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          log.statusCode >= 200 && log.statusCode < 300
                            ? 'bg-emerald-950 text-emerald-400'
                            : 'bg-rose-950 text-rose-400'
                        }`}
                      >
                        {log.statusCode}
                      </span>
                    </td>
                    <td className="p-3 text-zinc-400">{log.responseTimeMs}ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE API KEY MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-400" />
                <h3 className="font-serif font-bold text-zinc-100 text-sm">Issue Internal Service Key</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-200 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerateKey} className="space-y-4 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1 font-semibold">Target Internal Client</label>
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 font-mono outline-none focus:border-amber-400"
                >
                  {INITIAL_API_CLIENTS.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1 font-semibold">Key Identifier / Integration Name</label>
                <input
                  type="text"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  placeholder="e.g. Telegram Support Bot Engine Production"
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1 font-semibold">Rate Limit (Req/Hour)</label>
                  <input
                    type="number"
                    value={rateLimitPerHour}
                    onChange={(e) => setRateLimitPerHour(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1 font-semibold">Valid Period (Days)</label>
                  <input
                    type="number"
                    value={expiresInDays}
                    onChange={(e) => setExpiresInDays(Number(e.target.value))}
                    placeholder="365 (0 for never)"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 font-mono outline-none"
                  />
                </div>
              </div>

              {/* Scopes Checkboxes */}
              <div className="space-y-1.5">
                <label className="text-zinc-400 block font-semibold">Authorized Scopes</label>
                <div className="max-h-40 overflow-y-auto space-y-1 bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800">
                  {SYSTEM_API_SCOPES.map(scope => {
                    const isChecked = selectedScopes.includes(scope.id);
                    return (
                      <label
                        key={scope.id}
                        className="flex items-center gap-2 p-1 rounded hover:bg-zinc-800 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleScope(scope.id)}
                          className="rounded border-zinc-700 bg-zinc-950 text-amber-400"
                        />
                        <span className="font-mono text-[11px] text-zinc-200">{scope.id}</span>
                        <span className="text-[10px] text-zinc-500 truncate">({scope.description})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 py-2.5 bg-zinc-900 text-zinc-400 rounded-xl font-bold cursor-pointer hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold rounded-xl cursor-pointer shadow-lg shadow-amber-400/20"
                >
                  Generate Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApiConsole;
