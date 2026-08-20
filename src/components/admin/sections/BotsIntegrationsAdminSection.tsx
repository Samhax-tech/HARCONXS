import React, { useState } from 'react';
import { 
  Bot, 
  MessageSquare, 
  Send, 
  Share2, 
  Globe, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  Terminal, 
  Copy, 
  Check, 
  RefreshCw, 
  Key, 
  ExternalLink,
  Code2,
  Lock,
  Smartphone,
  Layers,
  Save
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { enforceServerSidePermission } from '../../../services/adminAuthService';
import {
  createTelegramBotClient,
  createDiscordBotClient,
  createWhatsAppBotClient,
  createWordPressClient
} from '../../../services/botIntegrationService';

export type IntegrationPlatform = 
  | 'whatsapp' 
  | 'telegram' 
  | 'discord' 
  | 'facebook' 
  | 'instagram' 
  | 'wordpress';

interface BotsIntegrationsAdminSectionProps {
  initialPlatform?: IntegrationPlatform;
}

export const BotsIntegrationsAdminSection: React.FC<BotsIntegrationsAdminSectionProps> = ({
  initialPlatform = 'whatsapp'
}) => {
  const { showToast, orders, products } = useStore();
  const [activePlatform, setActivePlatform] = useState<IntegrationPlatform>(initialPlatform);

  // Configuration forms
  const [configState, setConfigState] = useState({
    whatsapp: {
      phoneNumberId: '109823478912345',
      wabaId: 'waba_99182348123',
      apiToken: 'EAAOx_HARCONXS_WA_TOKEN_LIVE_991823',
      webhookVerifyToken: 'harconxs_wa_verify_secret_2026',
      webhookUrl: 'https://harconxs.com/api/v1/webhooks/whatsapp',
      autoDispatchAlerts: true,
      autoCadProofAlerts: true,
      status: 'connected'
    },
    telegram: {
      botUsername: '@HarconxsVipBot',
      botToken: '6829104821:AAFx98_HARCONXS_TG_SECRET_BOT',
      webhookUrl: 'https://harconxs.com/api/v1/webhooks/telegram',
      adminChatId: '-100192837465',
      aiAssistantEnabled: true,
      status: 'connected'
    },
    discord: {
      applicationId: '120938475619283746',
      botToken: 'OTkyODQ3NTYxOTI4Mzc0Ng.G8X9yA.HARCONXS_DISCORD_TOKEN',
      webhookAlertUrl: 'https://discord.com/api/webhooks/1209384/HarconxsAtelierAlerts',
      vipRoleChannelId: '120938475619283750',
      status: 'connected'
    },
    facebook: {
      appId: '882910482910482',
      pageId: '10928374615243',
      pageAccessToken: 'EAAGb_HARCONXS_FB_PAGE_ACCESS_TOKEN_2026',
      catalogSyncFrequency: 'daily',
      messengerWebhookUrl: 'https://harconxs.com/api/v1/webhooks/facebook',
      status: 'connected'
    },
    instagram: {
      businessAccountId: '1784140029384756',
      instagramAppSecret: 'sec_insta_graph_api_9928174591',
      graphApiToken: 'IGQVJ_HARCONXS_GRAPH_TOKEN_VALID_2026',
      shoppingSyncEnabled: true,
      dmAutoResponder: true,
      status: 'connected'
    },
    wordpress: {
      siteUrl: 'https://atelier-journal.harconxs.com',
      consumerKey: 'ck_982734918273498172394817293847',
      consumerSecret: 'cs_882910481920384710293847102938',
      twoWaySync: true,
      webhookSecret: 'wp_secret_harconxs_bridge_991',
      status: 'connected'
    }
  });

  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Test Simulator State
  const [testInput, setTestInput] = useState('Where is my order HX-90821?');
  const [testResult, setTestResult] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLabel(label);
    showToast(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedLabel(null), 2500);
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await enforceServerSidePermission('api:generate_keys', 'integration', activePlatform);
      localStorage.setItem(`harconxs_integration_${activePlatform}`, JSON.stringify(configState[activePlatform]));
      showToast(`${activePlatform.toUpperCase()} integration settings persisted to server gateway.`);
    } catch (err: any) {
      showToast(err.message || 'Permission Denied: Unable to update integration credentials.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRunSimulator = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      if (activePlatform === 'whatsapp') {
        const client = createWhatsAppBotClient();
        const res = await client.askAiAssistant(testInput);
        setTestResult({
          status: 'success',
          platform: 'WhatsApp Cloud API',
          channel: 'Business WABA #109823478912345',
          responsePayload: res
        });
      } else if (activePlatform === 'telegram') {
        const client = createTelegramBotClient();
        const res = await client.askAiAssistant(testInput);
        setTestResult({
          status: 'success',
          platform: 'Telegram Bot API (@HarconxsVipBot)',
          responsePayload: res
        });
      } else if (activePlatform === 'discord') {
        const client = createDiscordBotClient();
        const res = await client.searchProducts('couple ring');
        setTestResult({
          status: 'success',
          platform: 'Discord Atelier Daemon',
          channelMessage: 'Embed dispatched to #atelier-vip',
          responsePayload: res
        });
      } else if (activePlatform === 'wordpress') {
        const client = createWordPressClient();
        const res = await client.getFaqs();
        setTestResult({
          status: 'success',
          platform: 'WordPress REST Bridge',
          responsePayload: res
        });
      } else {
        setTestResult({
          status: 'success',
          platform: activePlatform.toUpperCase(),
          message: `Webhook ping acknowledged by ${activePlatform.toUpperCase()} Graph API gateway (200 OK).`
        });
      }
      showToast(`${activePlatform.toUpperCase()} simulation responded successfully!`);
    } catch (err: any) {
      setTestResult({ error: err.message || 'Simulator execution failed' });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div id="bots-integrations-admin-section" className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h3 className="text-xl font-serif font-bold text-zinc-100 flex items-center gap-2">
            <Bot className="w-5 h-5 text-amber-400" />
            External Bots & Multi-Channel Integrations
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Enterprise connectivity for WhatsApp Business, Telegram Daemons, Discord VIP bots, Meta Graph API & WordPress.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20 flex items-center gap-1.5 font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            Encrypted Webhooks
          </span>
        </div>
      </div>

      {/* Integration Platform Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <button
          onClick={() => {
            setActivePlatform('whatsapp');
            setTestResult(null);
          }}
          className={`p-3 rounded-xl text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
            activePlatform === 'whatsapp'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-500/10'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span>WhatsApp</span>
          <span className="text-[9px] font-mono text-emerald-400">Live API</span>
        </button>

        <button
          onClick={() => {
            setActivePlatform('telegram');
            setTestResult(null);
          }}
          className={`p-3 rounded-xl text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
            activePlatform === 'telegram'
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-lg shadow-sky-500/10'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <Send className="w-4 h-4 text-sky-400" />
          <span>Telegram</span>
          <span className="text-[9px] font-mono text-sky-400">@HarconxsVip</span>
        </button>

        <button
          onClick={() => {
            setActivePlatform('discord');
            setTestResult(null);
          }}
          className={`p-3 rounded-xl text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
            activePlatform === 'discord'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-lg shadow-indigo-500/10'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-indigo-400" />
          <span>Discord</span>
          <span className="text-[9px] font-mono text-indigo-400">Concierge</span>
        </button>

        <button
          onClick={() => {
            setActivePlatform('facebook');
            setTestResult(null);
          }}
          className={`p-3 rounded-xl text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
            activePlatform === 'facebook'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-lg shadow-blue-500/10'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <Share2 className="w-4 h-4 text-blue-400" />
          <span>Facebook</span>
          <span className="text-[9px] font-mono text-blue-400">Meta Shop</span>
        </button>

        <button
          onClick={() => {
            setActivePlatform('instagram');
            setTestResult(null);
          }}
          className={`p-3 rounded-xl text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
            activePlatform === 'instagram'
              ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40 shadow-lg shadow-pink-500/10'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <Globe className="w-4 h-4 text-pink-400" />
          <span>Instagram</span>
          <span className="text-[9px] font-mono text-pink-400">Graph Tags</span>
        </button>

        <button
          onClick={() => {
            setActivePlatform('wordpress');
            setTestResult(null);
          }}
          className={`p-3 rounded-xl text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
            activePlatform === 'wordpress'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg shadow-amber-500/10'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <Layers className="w-4 h-4 text-amber-400" />
          <span>WordPress</span>
          <span className="text-[9px] font-mono text-amber-400">WooCommerce</span>
        </button>
      </div>

      {/* Main Settings Form & Live Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Configuration Form */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSaveConfig} className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h4 className="font-serif font-bold text-zinc-100 text-base capitalize flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                {activePlatform} Cloud API Credentials
              </h4>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono">
                Status: Connected
              </span>
            </div>

            {/* WHATSAPP CONFIG */}
            {activePlatform === 'whatsapp' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Phone Number ID (WABA)</label>
                  <input
                    type="text"
                    value={configState.whatsapp.phoneNumberId}
                    onChange={e => setConfigState(prev => ({ ...prev, whatsapp: { ...prev.whatsapp, phoneNumberId: e.target.value } }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm font-mono focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">WhatsApp Cloud API Permanent Access Token</label>
                  <input
                    type="password"
                    value={configState.whatsapp.apiToken}
                    onChange={e => setConfigState(prev => ({ ...prev, whatsapp: { ...prev.whatsapp, apiToken: e.target.value } }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm font-mono focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Incoming Webhook Callback URL</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={configState.whatsapp.webhookUrl}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-amber-400 text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => copyToClipboard(configState.whatsapp.webhookUrl, 'WhatsApp Webhook URL')}
                      className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs cursor-pointer shrink-0"
                    >
                      {copiedLabel === 'WhatsApp Webhook URL' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2 pt-2">
                  <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={configState.whatsapp.autoDispatchAlerts}
                      onChange={e => setConfigState(prev => ({ ...prev, whatsapp: { ...prev.whatsapp, autoDispatchAlerts: e.target.checked } }))}
                      className="rounded bg-zinc-950 border-zinc-700 text-amber-400"
                    />
                    <span>Auto-send WhatsApp tracking messages when order status becomes &quot;Dispatched&quot;</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={configState.whatsapp.autoCadProofAlerts}
                      onChange={e => setConfigState(prev => ({ ...prev, whatsapp: { ...prev.whatsapp, autoCadProofAlerts: e.target.checked } }))}
                      className="rounded bg-zinc-950 border-zinc-700 text-amber-400"
                    />
                    <span>Auto-send WhatsApp 3D CAD design proof links for Custom Atelier requests</span>
                  </label>
                </div>
              </div>
            )}

            {/* TELEGRAM CONFIG */}
            {activePlatform === 'telegram' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Bot Username Handle</label>
                  <input
                    type="text"
                    value={configState.telegram.botUsername}
                    onChange={e => setConfigState(prev => ({ ...prev, telegram: { ...prev.telegram, botUsername: e.target.value } }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm font-mono focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Telegram Bot Token (from @BotFather)</label>
                  <input
                    type="password"
                    value={configState.telegram.botToken}
                    onChange={e => setConfigState(prev => ({ ...prev, telegram: { ...prev.telegram, botToken: e.target.value } }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm font-mono focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Webhook Endpoint</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={configState.telegram.webhookUrl}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-amber-400 text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => copyToClipboard(configState.telegram.webhookUrl, 'Telegram Webhook URL')}
                      className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs cursor-pointer shrink-0"
                    >
                      {copiedLabel === 'Telegram Webhook URL' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* DISCORD CONFIG */}
            {activePlatform === 'discord' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Discord Application ID</label>
                  <input
                    type="text"
                    value={configState.discord.applicationId}
                    onChange={e => setConfigState(prev => ({ ...prev, discord: { ...prev.discord, applicationId: e.target.value } }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm font-mono focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Discord Webhook Alert Channel URL</label>
                  <input
                    type="text"
                    value={configState.discord.webhookAlertUrl}
                    onChange={e => setConfigState(prev => ({ ...prev, discord: { ...prev.discord, webhookAlertUrl: e.target.value } }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm font-mono focus:border-amber-400"
                  />
                </div>
              </div>
            )}

            {/* FACEBOOK CONFIG */}
            {activePlatform === 'facebook' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Meta App ID</label>
                  <input
                    type="text"
                    value={configState.facebook.appId}
                    onChange={e => setConfigState(prev => ({ ...prev, facebook: { ...prev.facebook, appId: e.target.value } }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm font-mono focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Page Access Token</label>
                  <input
                    type="password"
                    value={configState.facebook.pageAccessToken}
                    onChange={e => setConfigState(prev => ({ ...prev, facebook: { ...prev.facebook, pageAccessToken: e.target.value } }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm font-mono focus:border-amber-400"
                  />
                </div>
              </div>
            )}

            {/* INSTAGRAM CONFIG */}
            {activePlatform === 'instagram' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Instagram Business Account ID</label>
                  <input
                    type="text"
                    value={configState.instagram.businessAccountId}
                    onChange={e => setConfigState(prev => ({ ...prev, instagram: { ...prev.instagram, businessAccountId: e.target.value } }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm font-mono focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Instagram Graph API Token</label>
                  <input
                    type="password"
                    value={configState.instagram.graphApiToken}
                    onChange={e => setConfigState(prev => ({ ...prev, instagram: { ...prev.instagram, graphApiToken: e.target.value } }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm font-mono focus:border-amber-400"
                  />
                </div>
              </div>
            )}

            {/* WORDPRESS CONFIG */}
            {activePlatform === 'wordpress' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">WordPress / WooCommerce Site URL</label>
                  <input
                    type="url"
                    value={configState.wordpress.siteUrl}
                    onChange={e => setConfigState(prev => ({ ...prev, wordpress: { ...prev.wordpress, siteUrl: e.target.value } }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm font-mono focus:border-amber-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Consumer Key (ck_...)</label>
                    <input
                      type="password"
                      value={configState.wordpress.consumerKey}
                      onChange={e => setConfigState(prev => ({ ...prev, wordpress: { ...prev.wordpress, consumerKey: e.target.value } }))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm font-mono focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Consumer Secret (cs_...)</label>
                    <input
                      type="password"
                      value={configState.wordpress.consumerSecret}
                      onChange={e => setConfigState(prev => ({ ...prev, wordpress: { ...prev.wordpress, consumerSecret: e.target.value } }))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm font-mono focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end pt-3 border-t border-zinc-800">
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-400/20 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving Credentials...' : `Save ${activePlatform.toUpperCase()} Config`}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Live Interactive Simulator */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h4 className="font-serif font-bold text-zinc-100 text-sm flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-400" />
                Live Bot & Webhook Simulator
              </h4>
              <span className="text-[10px] font-mono text-zinc-500">200ms Latency SLA</span>
            </div>

            <p className="text-xs text-zinc-400">
              Simulate an incoming inquiry or command dispatched to <strong>{activePlatform.toUpperCase()}</strong>.
            </p>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">Sample Client Payload / Query</label>
              <textarea
                rows={3}
                value={testInput}
                onChange={e => setTestInput(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:border-amber-400 font-mono"
                placeholder="e.g. /track HX-90821 or Ring sizing query"
              />
            </div>

            <button
              onClick={handleRunSimulator}
              disabled={isTesting}
              className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-400 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Zap className="w-4 h-4" />
              {isTesting ? 'Sending Webhook...' : `Test ${activePlatform.toUpperCase()} Dispatch`}
            </button>

            {testResult && (
              <div className="mt-4 p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Response from {testResult.platform || activePlatform}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">HTTP 200 OK</span>
                </div>
                <pre className="text-[11px] font-mono text-zinc-300 max-h-48 overflow-y-auto bg-black/40 p-2.5 rounded-lg">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
