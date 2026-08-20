import React, { useState } from 'react';
import {
  Bot,
  MessageSquare,
  Globe,
  Share2,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Send,
  Search,
  Package,
  HelpCircle,
  Headphones,
  Sparkles,
  Terminal,
  ExternalLink,
  Zap,
  Lock,
  ArrowRight,
  Database,
  Layers,
  Code2
} from 'lucide-react';
import {
  HarconxsBotClient,
  createTelegramBotClient,
  createDiscordBotClient,
  createWhatsAppBotClient,
  createWordPressClient
} from '../../services/botIntegrationService';
import { useStore } from '../../context/StoreContext';

type ActiveBotClientType = 'telegram' | 'discord' | 'whatsapp' | 'wordpress';

export const BotApiIntegrationsGuide: React.FC = () => {
  const { showToast, products, orders } = useStore();

  const [activeClient, setActiveClient] = useState<ActiveBotClientType>('telegram');
  const [selectedLanguage, setSelectedLanguage] = useState<'nodejs' | 'python' | 'curl' | 'php'>('nodejs');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Interactive Live Simulator state
  const [simAction, setSimAction] = useState<'chat' | 'search' | 'track' | 'faq' | 'support'>('chat');
  const [simInputMessage, setSimInputMessage] = useState('Where is order HX-88210? My email is priya.sharma@example.com');
  const [simQuery, setSimQuery] = useState('couple');
  const [simOrderNumber, setSimOrderNumber] = useState(orders[0]?.orderNumber || 'HX-88210');
  const [simEmailOrPhone, setSimEmailOrPhone] = useState(orders[0]?.customerEmail || 'priya.sharma@example.com');
  const [simFaqCategory, setSimFaqCategory] = useState('All');
  const [simTicketSubject, setSimTicketSubject] = useState('Urgent: Ring Sizing Query for Custom Couple Band');
  const [simTicketMessage, setSimTicketMessage] = useState('Can the gold couple ring be resized to size 7 prior to wedding dispatch?');
  const [simTicketEmail, setSimTicketEmail] = useState('patron@example.com');

  const [simLoading, setSimLoading] = useState(false);
  const [simResult, setSimResult] = useState<any>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(label);
    showToast(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  // Run live simulation using the selected bot client SDK
  const handleRunSimulation = async () => {
    setSimLoading(true);
    setSimResult(null);

    const client =
      activeClient === 'telegram'
        ? createTelegramBotClient()
        : activeClient === 'discord'
        ? createDiscordBotClient()
        : activeClient === 'whatsapp'
        ? createWhatsAppBotClient()
        : createWordPressClient();

    try {
      if (simAction === 'chat') {
        const res = await client.askAiAssistant(simInputMessage);
        setSimResult(res);
      } else if (simAction === 'search') {
        const res = await client.searchProducts(simQuery);
        setSimResult(res);
      } else if (simAction === 'track') {
        const res = await client.verifyAndTrackOrder(simOrderNumber, simEmailOrPhone);
        setSimResult(res);
      } else if (simAction === 'faq') {
        const res = await client.getFaqs(simFaqCategory === 'All' ? undefined : simFaqCategory);
        setSimResult(res);
      } else if (simAction === 'support') {
        const res = await client.createSupportTicket(
          'Bot Inquirer',
          simTicketEmail,
          simTicketSubject,
          simTicketMessage,
          'Atelier Jewelry Query'
        );
        setSimResult(res);
      }
    } catch (err: any) {
      setSimResult({ error: err.message || 'Simulation execution failed' });
    } finally {
      setSimLoading(false);
    }
  };

  // Code snippets by Client & Language
  const getCodeSnippet = () => {
    if (activeClient === 'telegram') {
      if (selectedLanguage === 'nodejs') {
        return `// ==============================================================================
// HARCONXS Telegram Support Bot (Telegraf / Node.js)
// Single Central API endpoint: https://harconxsshop.com/api/v1
// ==============================================================================
import { Telegraf } from 'telegraf';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const HARCONXS_API_URL = process.env.HARCONXS_API_URL || 'https://harconxsshop.com/api/v1';
const HARCONXS_API_KEY = process.env.HARCONXS_API_KEY; // 'hx_live_tel_...'

async function callHarconxsApi(endpoint, method = 'GET', body = null) {
  const res = await fetch(\`\${HARCONXS_API_URL}\${endpoint}\`, {
    method,
    headers: {
      'Authorization': \`Bearer \${HARCONXS_API_KEY}\`,
      'Content-Type': 'application/json',
      'X-Client-Platform': 'telegram'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  return await res.json();
}

// 1. /start command
bot.start((ctx) => {
  ctx.reply(
    '✨ Welcome to HARCONXS Artisan Concierge!\\n\\n' +
    'Commands:\\n' +
    '🔍 /catalog <query> - Search handcrafted products\\n' +
    '📦 /track <order#> <email> - Track your order securely\\n' +
    '❓ /faq - View atelier policies & shipping info\\n' +
    '💬 Send any question to chat with our AI Concierge!'
  );
});

// 2. /catalog command: Search Products
bot.command('catalog', async (ctx) => {
  const query = ctx.message.text.split(' ').slice(1).join(' ') || 'all';
  const data = await callHarconxsApi(\`/products?q=\${encodeURIComponent(query)}&limit=5\`);
  
  if (!data.data || data.data.length === 0) {
    return ctx.reply('No matching products found.');
  }

  const list = data.data.map(p => \`💎 *\${p.name}*\\n💰 ₹\${p.price} • SKU: \${p.sku}\\n🔗 https://harconxsshop.com/product/\${p.slug || p.id}\`).join('\\n\\n');
  ctx.replyWithMarkdown(\`*Found \${data.data.length} atelier items:*\\n\\n\${list}\`);
});

// 3. /track command: Safe Order Verification
bot.command('track', async (ctx) => {
  const args = ctx.message.text.split(' ').slice(1);
  if (args.length < 2) {
    return ctx.reply('Usage: /track <order_number> <email_or_phone>\\nExample: /track HX-88210 priya@example.com');
  }
  const [orderNumber, emailOrPhone] = args;
  
  const result = await callHarconxsApi('/orders/verify-lookup', 'POST', {
    orderNumber,
    customerEmail: emailOrPhone.includes('@') ? emailOrPhone : undefined,
    phone: !emailOrPhone.includes('@') ? emailOrPhone : undefined
  });

  if (!result.success || !result.data) {
    return ctx.reply(result.error?.message || 'Order verification failed. Please confirm order number and email.');
  }

  const o = result.data;
  ctx.replyWithMarkdown(
    \`📦 *Order Status: \${o.orderNumber}*\\n\` +
    \`👤 Patron: \${o.customerMasked}\\n\` +
    \`🚚 Carrier: \${o.carrier} (\${o.trackingNumber})\\n\` +
    \`📍 Status: *\${o.status}*\\n\` +
    \`⏳ Est. Delivery: \${o.estimatedDelivery}\\n\\n\` +
    \`🔗 [Track Live](\${o.trackingUrl})\`
  );
});

// 4. Grounded AI Support for Natural Conversation
bot.on('text', async (ctx) => {
  if (ctx.message.text.startsWith('/')) return;
  
  const chatRes = await callHarconxsApi('/chat', 'POST', {
    message: ctx.message.text,
    clientContext: { platform: 'telegram', userId: String(ctx.from.id) }
  });

  if (chatRes.data?.reply) {
    ctx.reply(chatRes.data.reply);
  } else {
    ctx.reply('Our atelier team is reviewing your message.');
  }
});

bot.launch();`;
      }
      if (selectedLanguage === 'python') {
        return `# ==============================================================================
# HARCONXS Telegram Support Bot (Python / python-telegram-bot)
# ==============================================================================
import os, requests
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, MessageHandler, filters, ContextTypes

API_BASE = os.getenv("HARCONXS_API_URL", "https://harconxsshop.com/api/v1")
API_KEY = os.getenv("HARCONXS_API_KEY")

HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
    "X-Client-Platform": "telegram"
}

async def track_order(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if len(context.args) < 2:
        await update.message.reply_text("Usage: /track <order_number> <email>")
        return
    
    order_no, email = context.args[0], context.args[1]
    res = requests.post(f"{API_BASE}/orders/verify-lookup", json={
        "orderNumber": order_no,
        "customerEmail": email
    }, headers=HEADERS).json()

    if res.get("success"):
        d = res["data"]
        await update.message.reply_markdown(
            f"📦 *Order {d['orderNumber']}*\\nStatus: *{d['status']}*\\nCarrier: {d['carrier']} ({d['trackingNumber']})\\nEst. Delivery: {d['estimatedDelivery']}"
        )
    else:
        await update.message.reply_text(res.get("error", {}).get("message", "Order not found."))

async def ai_chat(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_msg = update.message.text
    res = requests.post(f"{API_BASE}/chat", json={"message": user_msg}, headers=HEADERS).json()
    reply = res.get("data", {}).get("reply", "I am happy to assist you.")
    await update.message.reply_text(reply)

app = ApplicationBuilder().token(os.getenv("TELEGRAM_BOT_TOKEN")).build()
app.add_handler(CommandHandler("track", track_order))
app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, ai_chat))
app.run_polling()`;
      }
    }

    if (activeClient === 'discord') {
      return `// ==============================================================================
// HARCONXS Discord Support Bot (Discord.js v14)
// Slash commands: /catalog, /track, /faq, /support, /ask
// ==============================================================================
import { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder } from 'discord.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
const HARCONXS_API_URL = process.env.HARCONXS_API_URL || 'https://harconxsshop.com/api/v1';
const HARCONXS_API_KEY = process.env.HARCONXS_API_KEY; // 'hx_live_dsc_...'

async function callHarconxsApi(endpoint, method = 'GET', body = null) {
  const res = await fetch(\`\${HARCONXS_API_URL}\${endpoint}\`, {
    method,
    headers: {
      'Authorization': \`Bearer \${HARCONXS_API_KEY}\`,
      'Content-Type': 'application/json',
      'X-Client-Platform': 'discord'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  return await res.json();
}

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  // 1. /track command: Safe Patron Order Lookup
  if (interaction.commandName === 'track') {
    await interaction.deferReply({ ephemeral: true });
    const orderNo = interaction.options.getString('order_number');
    const emailOrPhone = interaction.options.getString('email_or_phone');

    const result = await callHarconxsApi('/orders/verify-lookup', 'POST', {
      orderNumber: orderNo,
      customerEmail: emailOrPhone.includes('@') ? emailOrPhone : undefined,
      phone: !emailOrPhone.includes('@') ? emailOrPhone : undefined
    });

    if (!result.success || !result.data) {
      return interaction.editReply({ content: \`❌ \${result.error?.message || 'Order verification failed.'}\` });
    }

    const o = result.data;
    const embed = new EmbedBuilder()
      .setTitle(\`📦 Order Status: \${o.orderNumber}\`)
      .setColor(0xd97706)
      .addFields(
        { name: 'Patron', value: o.customerMasked, inline: true },
        { name: 'Status', value: \`**\${o.status}**\`, inline: true },
        { name: 'Estimated Delivery', value: o.estimatedDelivery, inline: true },
        { name: 'Carrier & Tracking', value: \`\${o.carrier} (\${o.trackingNumber})\` }
      )
      .setURL(o.trackingUrl);

    await interaction.editReply({ embeds: [embed] });
  }

  // 2. /ask command: Grounded AI Concierge
  if (interaction.commandName === 'ask') {
    await interaction.deferReply();
    const query = interaction.options.getString('question');

    const chatRes = await callHarconxsApi('/chat', 'POST', { message: query });
    const reply = chatRes.data?.reply || 'Our atelier team will assist you shortly.';

    await interaction.editReply({ content: reply });
  }

  // 3. /support command: File Ticket to Central Supabase
  if (interaction.commandName === 'support') {
    await interaction.deferReply({ ephemeral: true });
    const email = interaction.options.getString('email');
    const subject = interaction.options.getString('subject');
    const msg = interaction.options.getString('message');

    const ticketRes = await callHarconxsApi('/support/tickets', 'POST', {
      customerEmail: email,
      customerName: interaction.user.username,
      subject,
      message: msg,
      platform: 'Discord Support Bot'
    });

    if (ticketRes.success) {
      await interaction.editReply({
        content: \`✅ Support Ticket **\${ticketRes.data.ticketNumber}** created! Our team will follow up via \${email}.\`
      });
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);`;
    }

    if (activeClient === 'whatsapp') {
      return `// ==============================================================================
// HARCONXS WhatsApp Support Bot (Meta Cloud API / Express Webhook)
// Safe Verification & Central Supabase Ticketing
// ==============================================================================
import express from 'express';
const app = express();
app.use(express.json());

const HARCONXS_API_URL = process.env.HARCONXS_API_URL || 'https://harconxsshop.com/api/v1';
const HARCONXS_API_KEY = process.env.HARCONXS_API_KEY; // 'hx_live_wsp_...'

async function callHarconxsApi(endpoint, method = 'GET', body = null) {
  const res = await fetch(\`\${HARCONXS_API_URL}\${endpoint}\`, {
    method,
    headers: {
      'Authorization': \`Bearer \${HARCONXS_API_KEY}\`,
      'Content-Type': 'application/json',
      'X-Client-Platform': 'whatsapp'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  return await res.json();
}

// Meta Webhook Entry Point
app.post('/webhook/whatsapp', async (req, res) => {
  res.sendStatus(200);
  const entry = req.body.entry?.[0];
  const change = entry?.changes?.[0]?.value;
  const message = change?.messages?.[0];
  if (!message || !message.text) return;

  const senderPhone = message.from;
  const text = message.text.body.trim();

  // 1. Order Tracking Check (e.g. "Track HX-88210")
  if (/^track\\s+/i.test(text)) {
    const orderNumber = text.replace(/^track\\s+/i, '').trim();
    const orderRes = await callHarconxsApi('/orders/verify-lookup', 'POST', {
      orderNumber,
      phone: senderPhone
    });

    if (orderRes.success && orderRes.data) {
      await sendWhatsAppText(senderPhone, 
        \`📦 *Order Status: \${orderRes.data.orderNumber}*\\n\` +
        \`Status: \${orderRes.data.status}\\n\` +
        \`Carrier: \${orderRes.data.carrier} (\${orderRes.data.trackingNumber})\\n\` +
        \`Est. Delivery: \${orderRes.data.estimatedDelivery}\`
      );
      return;
    }
  }

  // 2. Natural AI Concierge Conversation
  const aiRes = await callHarconxsApi('/chat', 'POST', {
    message: text,
    clientContext: { platform: 'whatsapp', phone: senderPhone }
  });

  await sendWhatsAppText(senderPhone, aiRes.data?.reply || 'Welcome to HARCONXS. How may we assist you?');
});

async function sendWhatsAppText(toPhone, bodyText) {
  await fetch(\`https://graph.facebook.com/v19.0/\${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages\`, {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${process.env.WHATSAPP_SYSTEM_TOKEN}\`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: toPhone,
      type: 'text',
      text: { body: bodyText }
    })
  });
}

app.listen(process.env.PORT || 4000);`;
    }

    if (activeClient === 'wordpress') {
      return `<?php
/**
 * HARCONXS WordPress / WooCommerce Support Bridge
 * Plugin Name: HARCONXS Support & Catalog Bridge
 * Description: Connects WordPress to Central HARCONXS Supabase API for AI Support, Catalog Sync & Safe Order Tracking.
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) exit;

class Harconxs_Support_Bridge {
    private $api_url = 'https://harconxsshop.com/api/v1';
    private $api_key = 'hx_live_wp_8e22cd33bb44fa7701'; // Get from Admin > API Keys

    public function __construct() {
        add_shortcode('harconxs_order_tracker', array($this, 'render_order_tracker_shortcode'));
        add_shortcode('harconxs_support_widget', array($this, 'render_support_widget_shortcode'));
        add_action('wp_ajax_harconxs_track_order', array($this, 'ajax_track_order'));
        add_action('wp_ajax_nopriv_harconxs_track_order', array($this, 'ajax_track_order'));
    }

    private function api_request($endpoint, $method = 'GET', $body = null) {
        $args = array(
            'method'  => $method,
            'headers' => array(
                'Authorization' => 'Bearer ' . $this->api_key,
                'Content-Type'  => 'application/json',
                'X-Client-Platform' => 'wordpress'
            ),
            'timeout' => 15
        );
        if ($body) {
            $args['body'] = wp_json_encode($body);
        }
        $response = wp_remote_request($this->api_url . $endpoint, $args);
        if (is_wp_error($response)) return false;
        return json_decode(wp_remote_retrieve_body($response), true);
    }

    // Shortcode: [harconxs_order_tracker]
    public function render_order_tracker_shortcode() {
        ob_start(); ?>
        <div class="harconxs-tracker-box" style="border: 1px solid #d4af37; padding: 20px; border-radius: 12px;">
            <h3>Track Your HARCONXS Order</h3>
            <form id="hx-tracker-form">
                <p><input type="text" id="hx-order-no" placeholder="Order # (e.g. HX-88210)" required style="width:100%;" /></p>
                <p><input type="email" id="hx-order-email" placeholder="Billing Email Address" required style="width:100%;" /></p>
                <button type="submit" style="background:#111; color:#fff; padding:10px 20px; border-radius:8px;">Check Status</button>
            </form>
            <div id="hx-tracker-output" style="margin-top: 15px;"></div>
        </div>
        <?php
        return ob_get_clean();
    }

    public function ajax_track_order() {
        $order_no = sanitize_text_field($_POST['orderNumber']);
        $email    = sanitize_email($_POST['customerEmail']);

        $res = $this->api_request('/orders/verify-lookup', 'POST', array(
            'orderNumber'   => $order_no,
            'customerEmail' => $email
        ));

        wp_send_json($res);
    }
}

new Harconxs_Support_Bridge();`;
    }

    return `curl -X POST https://harconxsshop.com/api/v1/orders/verify-lookup \\
  -H "Authorization: Bearer hx_live_tel_9b32c018a441cd88e0" \\
  -H "Content-Type: application/json" \\
  -d '{"orderNumber": "HX-88210", "customerEmail": "priya.sharma@example.com"}'`;
  };

  return (
    <div className="space-y-6">
      {/* Header & Architecture Banner */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-amber-500/30 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Centralized Multi-Client Architecture</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-400 font-mono text-[10px] font-bold">
                Central Supabase Synced
              </span>
            </div>
            <h3 className="font-serif text-xl font-bold text-zinc-100">
              HARCONXS Support Bot Ecosystem & Private API Bridge
            </h3>
            <p className="text-xs text-zinc-300 max-w-2xl leading-relaxed">
              All support bots (<strong className="text-amber-300">Telegram, Discord, WhatsApp, WordPress</strong>) utilize the single secure HARCONXS Private API. No separate or divergent databases are created; all catalog items, safe order lookups, and support tickets connect to the central Supabase data source.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-3 text-center min-w-[120px]">
              <span className="text-[10px] font-mono uppercase text-zinc-500 block">Active Clients</span>
              <span className="text-base font-bold font-mono text-amber-400">4 Platforms</span>
            </div>
            <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-3 text-center min-w-[120px]">
              <span className="text-[10px] font-mono uppercase text-zinc-500 block">Security Scopes</span>
              <span className="text-base font-bold font-mono text-emerald-400">8 Validated</span>
            </div>
          </div>
        </div>

        {/* Visual Architecture Pipeline */}
        <div className="mt-5 pt-4 border-t border-zinc-800/80 grid grid-cols-1 sm:grid-cols-4 gap-3 text-center text-xs">
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-2.5 flex items-center justify-center gap-2">
            <Bot className="w-4 h-4 text-sky-400" />
            <span className="font-semibold text-zinc-200">Telegram Bot</span>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-2.5 flex items-center justify-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-zinc-200">Discord Bot</span>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-2.5 flex items-center justify-center gap-2">
            <Share2 className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-zinc-200">WhatsApp Bot</span>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-2.5 flex items-center justify-center gap-2">
            <Globe className="w-4 h-4 text-blue-400" />
            <span className="font-semibold text-zinc-200">WordPress Bridge</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Client Selector & Interactive Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Client Selector & Scope Matrix */}
        <div className="lg:col-span-5 space-y-5">
          {/* Client Platform Selector */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-3">
            <span className="text-[11px] font-mono uppercase text-zinc-400 font-bold block">
              Select Client Platform
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setActiveClient('telegram')}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  activeClient === 'telegram'
                    ? 'bg-sky-950/50 border-sky-500 text-sky-200 font-bold shadow-lg shadow-sky-900/20'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Bot className="w-4 h-4 text-sky-400" />
                  <span className="text-xs">Telegram Bot</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">client_telegram</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveClient('discord')}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  activeClient === 'discord'
                    ? 'bg-indigo-950/50 border-indigo-500 text-indigo-200 font-bold shadow-lg shadow-indigo-900/20'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs">Discord Bot</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">client_discord</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveClient('whatsapp')}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  activeClient === 'whatsapp'
                    ? 'bg-emerald-950/50 border-emerald-500 text-emerald-200 font-bold shadow-lg shadow-emerald-900/20'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Share2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs">WhatsApp Bot</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">client_whatsapp</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveClient('wordpress')}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  activeClient === 'wordpress'
                    ? 'bg-amber-950/50 border-amber-500 text-amber-200 font-bold shadow-lg shadow-amber-900/20'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Globe className="w-4 h-4 text-amber-400" />
                  <span className="text-xs">WordPress Bridge</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">client_wordpress</span>
              </button>
            </div>
          </div>

          {/* Scope Enforcement & Safe Capabilities Checklist */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
              <h4 className="font-bold text-zinc-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Scopes for {activeClient.toUpperCase()}</span>
              </h4>
              <span className="text-[10px] font-mono text-emerald-400">100% Enforced</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-2 text-zinc-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono font-bold text-amber-300">products:read</span>
                  <p className="text-[11px] text-zinc-400">Real-time atelier catalog search, inventory availability & pricing.</p>
                </div>
              </div>

              <div className="flex items-start gap-2 text-zinc-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono font-bold text-amber-300">orders:read</span>
                  <p className="text-[11px] text-zinc-400">
                    Safe patron order lookup via <code className="text-zinc-200">/orders/verify-lookup</code>. Requires matching Order # + Email/Phone. Sensitive credit details and foreign accounts are completely shielded.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 text-zinc-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono font-bold text-amber-300">faq:read & knowledge:read</span>
                  <p className="text-[11px] text-zinc-400">Shipping rates, custom couple websites, bot services, return policy, and gift packaging.</p>
                </div>
              </div>

              <div className="flex items-start gap-2 text-zinc-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono font-bold text-amber-300">support:write</span>
                  <p className="text-[11px] text-zinc-400">Dispatches support tickets directly into Central Supabase ticketing table.</p>
                </div>
              </div>

              <div className="flex items-start gap-2 text-zinc-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono font-bold text-amber-300">chat:use</span>
                  <p className="text-[11px] text-zinc-400">Grounded AI conversational engine without exposing master AI API keys to the bots.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Bot Live Simulator */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h4 className="font-bold text-zinc-100 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-amber-400" />
                  <span>Live Bot Request Simulator ({activeClient.toUpperCase()})</span>
                </h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Test actual bot interactions against the private HARCONXS API in real-time.
                </p>
              </div>

              <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                {(['chat', 'search', 'track', 'faq', 'support'] as const).map(action => (
                  <button
                    key={action}
                    type="button"
                    onClick={() => {
                      setSimAction(action);
                      setSimResult(null);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono cursor-pointer transition-all ${
                      simAction === action
                        ? 'bg-amber-400 text-zinc-950 font-bold'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {action.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Action-Specific Inputs */}
            {simAction === 'chat' && (
              <div className="space-y-2">
                <label className="text-zinc-400 font-semibold block text-[11px]">
                  Patron Message / Query (AI Grounded Support):
                </label>
                <textarea
                  rows={3}
                  value={simInputMessage}
                  onChange={(e) => setSimInputMessage(e.target.value)}
                  placeholder="e.g. Do you offer express delivery for wedding rings?"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 outline-none focus:border-amber-400 font-mono"
                />
              </div>
            )}

            {simAction === 'search' && (
              <div className="space-y-2">
                <label className="text-zinc-400 font-semibold block text-[11px]">
                  Catalog Search Keyword / Category:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={simQuery}
                    onChange={(e) => setSimQuery(e.target.value)}
                    placeholder="e.g. couple, gold, ring, box"
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 font-mono outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            )}

            {simAction === 'track' && (
              <div className="space-y-2">
                <label className="text-zinc-400 font-semibold block text-[11px]">
                  Safe Order Status Lookup (Requires Matching Email/Phone):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-zinc-500 font-mono block mb-1">Order #</span>
                    <input
                      type="text"
                      value={simOrderNumber}
                      onChange={(e) => setSimOrderNumber(e.target.value)}
                      placeholder="e.g. HX-88210"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 font-mono outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 font-mono block mb-1">Matching Patron Email / Phone</span>
                    <input
                      type="text"
                      value={simEmailOrPhone}
                      onChange={(e) => setSimEmailOrPhone(e.target.value)}
                      placeholder="e.g. priya.sharma@example.com"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 font-mono outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {simAction === 'faq' && (
              <div className="space-y-2">
                <label className="text-zinc-400 font-semibold block text-[11px]">
                  FAQ Knowledge Category:
                </label>
                <select
                  value={simFaqCategory}
                  onChange={(e) => setSimFaqCategory(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 font-mono outline-none"
                >
                  <option value="All">All Categories</option>
                  <option value="Shipping & Delivery">Shipping & Delivery</option>
                  <option value="Packaging & Unboxing">Packaging & Unboxing</option>
                  <option value="Custom Orders">Custom Orders</option>
                  <option value="Couple Websites">Couple Websites</option>
                  <option value="Bot Panel Hosting">Bot Panel Hosting</option>
                </select>
              </div>
            )}

            {simAction === 'support' && (
              <div className="space-y-2">
                <label className="text-zinc-400 font-semibold block text-[11px]">
                  Dispatch Ticket to Central Supabase:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="email"
                    value={simTicketEmail}
                    onChange={(e) => setSimTicketEmail(e.target.value)}
                    placeholder="Customer Email"
                    className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 font-mono outline-none"
                  />
                  <input
                    type="text"
                    value={simTicketSubject}
                    onChange={(e) => setSimTicketSubject(e.target.value)}
                    placeholder="Subject"
                    className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 font-mono outline-none"
                  />
                </div>
                <textarea
                  rows={2}
                  value={simTicketMessage}
                  onChange={(e) => setSimTicketMessage(e.target.value)}
                  placeholder="Ticket message"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100 font-mono outline-none"
                />
              </div>
            )}

            <button
              type="button"
              disabled={simLoading}
              onClick={handleRunSimulation}
              className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-400/20 disabled:opacity-50"
            >
              {simLoading ? (
                <>
                  <Zap className="w-4 h-4 animate-spin" />
                  <span>Executing Private API Call...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Simulate {activeClient.toUpperCase()} Request</span>
                </>
              )}
            </button>

            {/* Simulation Response Output */}
            {simResult && (
              <div className="mt-4 pt-3 border-t border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase text-emerald-400 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>API Response Payload ({activeClient})</span>
                  </span>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(simResult, null, 2), 'Response JSON')}
                    className="text-[10px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 cursor-pointer font-mono"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy JSON</span>
                  </button>
                </div>

                <pre className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 text-[11px] font-mono text-zinc-200 max-h-60 overflow-y-auto leading-relaxed">
                  {JSON.stringify(simResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Code Snippets & Implementation Guide */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
          <div>
            <h4 className="font-bold text-zinc-100 text-sm flex items-center gap-2">
              <Code2 className="w-4 h-4 text-amber-400" />
              <span>Implementation Blueprint & Ready-to-Run Code</span>
            </h4>
            <p className="text-xs text-zinc-400 mt-0.5">
              Copy this standard client connector directly into your {activeClient.toUpperCase()} bot repository.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
              {(['nodejs', 'python', 'curl', 'php'] as const).map(lang => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono cursor-pointer transition-all ${
                    selectedLanguage === lang
                      ? 'bg-amber-400 text-zinc-950 font-bold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              onClick={() => copyToClipboard(getCodeSnippet(), `${activeClient} ${selectedLanguage} snippet`)}
              className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-xl text-xs font-mono flex items-center gap-1.5 cursor-pointer"
            >
              {copiedSection?.includes(activeClient) ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection?.includes(activeClient) ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>
        </div>

        <pre className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-xs font-mono text-zinc-200 max-h-96 overflow-y-auto leading-relaxed">
          {getCodeSnippet()}
        </pre>
      </div>
    </div>
  );
};

export default BotApiIntegrationsGuide;
