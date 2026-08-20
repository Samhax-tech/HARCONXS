import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Key,
  Layers,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  Server,
  Zap,
  Terminal,
  RefreshCw,
  Globe,
  Database,
  UserCheck,
  CreditCard,
  Code2,
  Sparkles
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { getBillingBaseUrl, buildSafeBillingUrl, generateSecureBillingHandoff, redeemBillingHandoffTicket } from '../../utils/billingUtils';
import { createBillingHandoffTicket, verifyAndRedeemBillingHandoffTicket } from '../../services/apiCoreService';

export const BillingAuthArchitectureGuide: React.FC = () => {
  const { currentUser, showToast } = useStore();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<'nextjs' | 'express' | 'react' | 'curl'>('nextjs');

  // Interactive Test Simulator State
  const [simUserId, setSimUserId] = useState(currentUser?.id || 'usr_patron_88210');
  const [simUserEmail, setSimUserEmail] = useState(currentUser?.email || 'admin@hamza.harconxs.com');
  const [simUserName, setSimUserName] = useState(currentUser?.name || 'HARCONXS Master Admin');
  const [simUserRole, setSimUserRole] = useState('super_admin');
  const [simProductId, setSimProductId] = useState('bot_tg_vip');
  const [simPlanId, setSimPlanId] = useState('plan_tg_vip_monthly');
  const [simSlug, setSimSlug] = useState('telegram-vip-gateway');
  const [simBillingCycle, setSimBillingCycle] = useState('monthly');

  const [generatedResult, setGeneratedResult] = useState<{
    ticketId?: string;
    url: string;
    expiresInSeconds?: number;
    timestamp: string;
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Redemption Simulator State
  const [redeemTicketInput, setRedeemTicketInput] = useState('');
  const [redeemResult, setRedeemResult] = useState<any>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);

  const billingUrl = getBillingBaseUrl();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    showToast(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Generate Handoff Ticket in simulator
  const handleSimulateGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const handoff = await generateSecureBillingHandoff({
        productId: simProductId,
        planId: simPlanId,
        slug: simSlug,
        billingCycle: simBillingCycle,
        source: 'harconxs_shop',
        userContext: {
          userId: simUserId,
          userEmail: simUserEmail,
          userName: simUserName,
          userRole: simUserRole
        }
      });

      setGeneratedResult({
        ticketId: handoff.ticketId,
        url: handoff.url,
        expiresInSeconds: handoff.expiresInSeconds,
        timestamp: new Date().toLocaleTimeString()
      });

      if (handoff.ticketId) {
        setRedeemTicketInput(handoff.ticketId);
      }
      showToast('Secure handoff ticket generated!');
    } catch (err: any) {
      showToast(err.message || 'Error generating ticket');
    } finally {
      setIsGenerating(false);
    }
  };

  // Simulate Billing Side Redemption
  const handleSimulateRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!redeemTicketInput.trim()) {
      showToast('Please enter a ticket ID to redeem');
      return;
    }
    setIsRedeeming(true);
    setRedeemResult(null);
    try {
      const res = await redeemBillingHandoffTicket(redeemTicketInput.trim());
      setRedeemResult(res);
      if (res.valid) {
        showToast('Ticket successfully redeemed & burned!');
      } else {
        showToast(res.message || 'Ticket verification failed');
      }
    } catch (err: any) {
      setRedeemResult({ valid: false, message: err.message });
    } finally {
      setIsRedeeming(false);
    }
  };

  const getCodeSnippet = () => {
    if (selectedLanguage === 'nextjs') {
      return `// ==============================================================================
// BILLING APP (Next.js / TypeScript) - pages/index.tsx or app/page.tsx
// Deployment Domain: https://billingharconxs.vercel.app
// Shared Supabase Project: Uses same VITE_SUPABASE_URL & ANON KEY
// ==============================================================================
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const HARCONXS_API_URL = process.env.HARCONXS_API_URL || 'https://harconxs.vercel.app/api/v1';
const HARCONXS_BILLING_API_KEY = process.env.HARCONXS_BILLING_API_KEY; // 'hx_live_bil_...'

export default function BillingHandoffHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [verifiedUser, setVerifiedUser] = useState<any>(null);
  const [catalogContext, setCatalogContext] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    async function verifyAndInitialize() {
      const ticket = searchParams.get('handoff_ticket');
      const productId = searchParams.get('productId');
      const planId = searchParams.get('planId');
      const slug = searchParams.get('slug');

      // 1. STRATEGY A: Ephemeral Single-Use Ticket Exchange (Instant & Zero Leakage)
      if (ticket) {
        try {
          const res = await fetch(\`\${HARCONXS_API_URL}/auth/verify-ticket\`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': \`Bearer \${HARCONXS_BILLING_API_KEY}\`
            },
            body: JSON.stringify({ ticket })
          });
          const data = await res.json();

          if (data.valid && data.user) {
            // Securely verified without credentials in URL!
            setVerifiedUser(data.user);
            setCatalogContext(data.context || { productId, planId, slug });
            setLoading(false);
            
            // Clean the ticket from URL bar to prevent replay confusion
            window.history.replaceState({}, document.title, window.location.pathname + \`?productId=\${productId || ''}&planId=\${planId || ''}\`);
            return;
          }
        } catch (err) {
          console.warn('Ticket exchange error, checking Supabase session fallback...');
        }
      }

      // 2. STRATEGY B: Shared Supabase Project Session Verification
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session?.user) {
        // Independently verified with Supabase Auth
        setVerifiedUser({
          id: sessionData.session.user.id,
          email: sessionData.session.user.email,
          role: sessionData.session.user.app_metadata?.role || 'customer'
        });
        setCatalogContext({ productId, planId, slug });
        setLoading(false);
        return;
      }

      // 3. Fallback: Prompt user to authenticate directly via Supabase Auth
      setCatalogContext({ productId, planId, slug });
      setLoading(false);
    }

    verifyAndInitialize();
  }, [searchParams]);

  if (loading) return <div>Securing session with HARCONXS...</div>;

  return (
    <div>
      {verifiedUser ? (
        <div>
          <h2>Welcome, {verifiedUser.name || verifiedUser.email}</h2>
          <p>Verified User ID: {verifiedUser.id}</p>
          <p>Selected Plan: {catalogContext?.planId}</p>
          {/* Proceed to checkout / subscriptions */}
        </div>
      ) : (
        <div>
          <h2>Sign In to HARCONXS Billing</h2>
          <p>Please sign in with your HARCONXS account credentials to continue.</p>
        </div>
      )}
    </div>
  );
}`;
    } else if (selectedLanguage === 'express') {
      return `// ==============================================================================
// BILLING BACKEND (Node.js / Express Middleware)
// Server-Side Verification of HARCONXS Ephemeral Handoff Tickets
// ==============================================================================
import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

const HARCONXS_API_URL = process.env.HARCONXS_API_URL || 'https://harconxs.vercel.app/api/v1';
const HARCONXS_BILLING_API_KEY = process.env.HARCONXS_BILLING_API_KEY;

// Independent ticket verification route
app.post('/api/billing/exchange-ticket', async (req, res) => {
  const { ticket } = req.body;

  if (!ticket) {
    return res.status(400).json({ error: 'Missing handoff_ticket parameter.' });
  }

  try {
    const response = await fetch(\`\${HARCONXS_API_URL}/auth/verify-ticket\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${HARCONXS_BILLING_API_KEY}\`
      },
      body: JSON.stringify({ ticket })
    });

    const data = await response.json();
    
    if (!response.ok || !data.valid) {
      return res.status(401).json({
        error: data.error?.message || 'Invalid or expired handoff ticket. Please authenticate.'
      });
    }

    // Attach verified user to session / JWT
    req.session.user = data.user;
    req.session.billingContext = data.context;

    return res.json({
      success: true,
      user: data.user,
      context: data.context
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to communicate with HARCONXS Auth API' });
  }
});`;
    } else if (selectedLanguage === 'react') {
      return `// ==============================================================================
// CLIENT-SIDE CROSS-DOMAIN REDIRECTION BUTTON (HARCONXS SHOP)
// Triggers Ephemeral 60-Second Ticket & Zero-Leakage Redirect
// ==============================================================================
import { redirectToBillingPortal } from '@/utils/billingUtils';
import { useStore } from '@/context/StoreContext';

export function CheckoutWithBillingButton({ productId, planId, slug }) {
  const { user } = useStore();

  const handleContinue = async () => {
    // Generates single-use 60s ticket if user is logged in
    // NEVER appends passwords, JWTs or secrets to the URL
    await redirectToBillingPortal({
      productId,
      planId,
      slug,
      billingCycle: 'monthly',
      source: 'harconxs_shop',
      userContext: user ? {
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
        userRole: user.role
      } : undefined
    });
  };

  return (
    <button onClick={handleContinue} className="btn-billing">
      Continue to Billing Portal
    </button>
  );
}`;
    } else {
      return `# ==============================================================================
# CLI / cURL: Verify and Redeem Ephemeral Handoff Ticket
# ==============================================================================
curl -X POST https://harconxs.vercel.app/api/v1/auth/verify-ticket \\
  -H "Authorization: Bearer hx_live_bil_4e00112233445566778899fa" \\
  -H "Content-Type: application/json" \\
  -d '{
    "ticket": "hxtkt_7a8f9c2d1e0b4a6c8e9f1a2b"
  }'

# Response:
# {
#   "success": true,
#   "valid": true,
#   "message": "Handoff ticket successfully verified and consumed.",
#   "user": {
#     "id": "usr_88210",
#     "email": "admin@hamza.harconxs.com",
#     "name": "HARCONXS Master Admin",
#     "role": "super_admin"
#   },
#   "context": {
#     "productId": "bot_tg_vip",
#     "planId": "plan_tg_vip_monthly",
#     "slug": "telegram-vip-gateway",
#     "billingCycle": "monthly",
#     "source": "harconxs_shop"
#   }
# }`;
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 bg-gradient-to-br from-zinc-900 via-zinc-950 to-sky-950/40 border border-sky-900/30 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[10px] font-mono font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Cross-Domain Auth Protocol v1.4
              </span>
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold rounded-full">
                Zero Token Leakage
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-zinc-100 tracking-tight">
              HARCONXS SHOP ↔ Billing Portal Authentication Architecture
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
              Secure cross-application handoff protocol between <span className="text-zinc-200 font-mono">harconxs.vercel.app</span> and <span className="text-sky-300 font-mono">billingharconxs.vercel.app</span> using Shared Supabase Auth and Ephemeral Single-Use Exchange Tickets.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={billingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-zinc-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-sky-500/20"
            >
              <Globe className="w-4 h-4" />
              <span>Open Billing Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Security Mandates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-2">
          <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-zinc-200">No Passwords in Redirects</h4>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            The billing portal NEVER receives passwords or sensitive credentials through URL redirects or query parameters.
          </p>
        </div>

        <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Key className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-zinc-200">No JWTs in URLs</h4>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Long-lived access tokens, refresh tokens, and service-role keys are strictly forbidden in URL query parameters.
          </p>
        </div>

        <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-2">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-zinc-200">Single-Use 60s Tickets</h4>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Ephemeral handoff tickets expire in 60 seconds and are immediately burned upon redemption, preventing replay attacks.
          </p>
        </div>

        <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <UserCheck className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-zinc-200">Independent Verification</h4>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            The billing application independently verifies the identity with Supabase or HARCONXS API before showing private billing details.
          </p>
        </div>
      </div>

      {/* Admin Testing Credentials Notice */}
      <div className="p-5 bg-amber-950/30 border border-amber-800/40 rounded-2xl space-y-3">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
            System Administrator Test Credentials
          </h3>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed">
          Use these administrative credentials to test full-stack Supabase authentication and privileged cross-domain billing management:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3 bg-zinc-950/80 border border-zinc-800 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] text-zinc-500 block uppercase font-mono">Username</span>
              <span className="text-xs font-mono font-bold text-zinc-200">HARCONXS</span>
            </div>
            <button
              onClick={() => copyToClipboard('HARCONXS', 'Admin Username')}
              className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded cursor-pointer"
            >
              {copiedKey === 'Admin Username' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="p-3 bg-zinc-950/80 border border-zinc-800 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] text-zinc-500 block uppercase font-mono">Admin Email</span>
              <span className="text-xs font-mono font-bold text-zinc-200">admin@hamza.harconxs.com</span>
            </div>
            <button
              onClick={() => copyToClipboard('admin@hamza.harconxs.com', 'Admin Email')}
              className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded cursor-pointer"
            >
              {copiedKey === 'Admin Email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="p-3 bg-zinc-950/80 border border-zinc-800 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] text-zinc-500 block uppercase font-mono">Authentication Identity Source</span>
              <span className="text-xs font-mono font-bold text-amber-300">Supabase Auth (Role: super_admin)</span>
            </div>
            <div className="px-2 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono rounded">
              Verified RBAC
            </div>
          </div>
        </div>
      </div>

      {/* Visual Sequence Flow Diagram */}
      <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-3xl space-y-4">
        <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
          <Layers className="w-4 h-4 text-sky-400" />
          <span>Cross-Domain Handoff Sequence Flow</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative pt-2">
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-center space-y-2">
            <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 text-xs font-bold mx-auto flex items-center justify-center">1</span>
            <h5 className="text-xs font-bold text-zinc-200">User on HARCONXS</h5>
            <p className="text-[10px] text-zinc-400">Authenticated via Supabase Auth on Shop</p>
          </div>

          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-center space-y-2">
            <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 text-xs font-bold mx-auto flex items-center justify-center">2</span>
            <h5 className="text-xs font-bold text-zinc-200">Click Billing</h5>
            <p className="text-[10px] text-zinc-400">Backend issues ephemeral 60s ticket</p>
          </div>

          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-center space-y-2">
            <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 text-xs font-bold mx-auto flex items-center justify-center">3</span>
            <h5 className="text-xs font-bold text-zinc-200">Clean Redirect</h5>
            <p className="text-[10px] text-zinc-400">URL has only ?ticket=... & planId (no tokens)</p>
          </div>

          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-center space-y-2">
            <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 text-xs font-bold mx-auto flex items-center justify-center">4</span>
            <h5 className="text-xs font-bold text-zinc-200">Verify & Burn</h5>
            <p className="text-[10px] text-zinc-400">Billing redeems ticket via API key</p>
          </div>

          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-center space-y-2">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold mx-auto flex items-center justify-center">5</span>
            <h5 className="text-xs font-bold text-zinc-200">Checkout & Panel</h5>
            <p className="text-[10px] text-zinc-400">Session verified, panel provisioned</p>
          </div>
        </div>
      </div>

      {/* Interactive Simulator: Generate & Redeem */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Handoff Generator Simulator */}
        <div className="p-6 bg-zinc-900/70 border border-zinc-800 rounded-3xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-bold text-zinc-100">Live Handoff Generator</h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800">
              HARCONXS SHOP Client
            </span>
          </div>

          <form onSubmit={handleSimulateGenerate} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-zinc-400 block mb-1">User ID</label>
                <input
                  type="text"
                  value={simUserId}
                  onChange={(e) => setSimUserId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-zinc-200 font-mono"
                  required
                />
              </div>
              <div>
                <label className="text-zinc-400 block mb-1">User Email</label>
                <input
                  type="email"
                  value={simUserEmail}
                  onChange={(e) => setSimUserEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-zinc-200 font-mono"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-zinc-400 block mb-1">Product ID</label>
                <input
                  type="text"
                  value={simProductId}
                  onChange={(e) => setSimProductId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-zinc-200 font-mono"
                />
              </div>
              <div>
                <label className="text-zinc-400 block mb-1">Plan ID</label>
                <input
                  type="text"
                  value={simPlanId}
                  onChange={(e) => setSimPlanId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-zinc-200 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-2.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-zinc-950 font-bold rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2 shadow-md"
            >
              {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
              <span>Generate Secure Handoff URL</span>
            </button>
          </form>

          {generatedResult && (
            <div className="p-3.5 bg-zinc-950 border border-sky-900/40 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-sky-400">Generated Sanitized URL:</span>
                <span className="text-zinc-500 font-mono">Expires in {generatedResult.expiresInSeconds}s</span>
              </div>
              <div className="p-2 bg-zinc-900 rounded-lg text-zinc-300 font-mono text-[10px] break-all select-all border border-zinc-800">
                {generatedResult.url}
              </div>
              {generatedResult.ticketId && (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-zinc-400 font-mono">Ticket: {generatedResult.ticketId}</span>
                  <a
                    href={generatedResult.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-sky-400 hover:underline flex items-center gap-1 font-bold"
                  >
                    <span>Test Open</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Ticket Redemption Simulator */}
        <div className="p-6 bg-zinc-900/70 border border-zinc-800 rounded-3xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-zinc-100">Live Ticket Redemption</h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800">
              Billing App Server
            </span>
          </div>

          <form onSubmit={handleSimulateRedeem} className="space-y-3 text-xs">
            <div>
              <label className="text-zinc-400 block mb-1">Incoming Handoff Ticket</label>
              <input
                type="text"
                value={redeemTicketInput}
                onChange={(e) => setRedeemTicketInput(e.target.value)}
                placeholder="hxtkt_..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 font-mono"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isRedeeming || !redeemTicketInput.trim()}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-zinc-950 font-bold rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2 shadow-md"
            >
              {isRedeeming ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
              <span>Verify & Burn Ticket (POST /api/v1/auth/verify-ticket)</span>
            </button>
          </form>

          {redeemResult && (
            <div className={`p-3.5 rounded-2xl space-y-2 text-xs border ${
              redeemResult.valid ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300' : 'bg-rose-950/30 border-rose-800/40 text-rose-300'
            }`}>
              <div className="flex items-center gap-1.5 font-bold">
                {redeemResult.valid ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
                <span>{redeemResult.valid ? 'Identity Verified & Ticket Burned' : 'Verification Failed'}</span>
              </div>
              <p className="text-[11px] text-zinc-300">{redeemResult.message}</p>
              {redeemResult.user && (
                <div className="p-2 bg-zinc-950/80 rounded-lg text-zinc-200 font-mono text-[10px] space-y-1">
                  <div>User ID: <span className="text-sky-300">{redeemResult.user.id}</span></div>
                  <div>Email: <span className="text-amber-300">{redeemResult.user.email}</span></div>
                  <div>Role: <span className="text-emerald-300">{redeemResult.user.role}</span></div>
                  <div>Plan ID: <span className="text-zinc-400">{redeemResult.context?.planId}</span></div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Code Snippets & Implementation Examples */}
      <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-zinc-100">Billing Side Implementation Guides</h3>
          </div>

          <div className="flex gap-1.5 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setSelectedLanguage('nextjs')}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition-all cursor-pointer ${
                selectedLanguage === 'nextjs' ? 'bg-sky-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Next.js
            </button>
            <button
              onClick={() => setSelectedLanguage('express')}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition-all cursor-pointer ${
                selectedLanguage === 'express' ? 'bg-sky-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Express (Node)
            </button>
            <button
              onClick={() => setSelectedLanguage('react')}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition-all cursor-pointer ${
                selectedLanguage === 'react' ? 'bg-sky-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              React Shop
            </button>
            <button
              onClick={() => setSelectedLanguage('curl')}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition-all cursor-pointer ${
                selectedLanguage === 'curl' ? 'bg-sky-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              cURL
            </button>
          </div>
        </div>

        <div className="relative">
          <pre className="p-4 bg-zinc-900/90 border border-zinc-800 rounded-2xl overflow-x-auto text-[11px] font-mono text-zinc-300 leading-relaxed max-h-96">
            {getCodeSnippet()}
          </pre>
          <button
            onClick={() => copyToClipboard(getCodeSnippet(), 'Implementation Code')}
            className="absolute top-3 right-3 px-3 py-1.5 bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 text-xs font-mono rounded-lg border border-zinc-700 flex items-center gap-1.5 cursor-pointer shadow"
          >
            {copiedKey === 'Implementation Code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'Implementation Code' ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
