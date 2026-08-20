/**
 * HARCONXS Private API - Multi-Client Bot Integration Service
 * Standardized bridge for Telegram, Discord, WhatsApp, and WordPress clients.
 *
 * All clients communicate exclusively via the private HARCONXS API:
 *   [Telegram Bot]   \
 *   [Discord Bot]     \ ---> [HARCONXS Private API /api/v1/*] ---> [Central Supabase Data Source]
 *   [WhatsApp Bot]    /
 *   [WordPress Sync] /
 */

import { handleApiV1Request, ApiResponsePayload } from './apiCoreService';

export interface BotClientConfig {
  botType: 'telegram' | 'discord' | 'whatsapp' | 'wordpress';
  apiKey: string;
  apiBaseUrl?: string;
  botToken?: string;
  channelId?: string;
}

export interface BotOrderTrackingResult {
  verified: boolean;
  orderNumber?: string;
  customerMasked?: string;
  status?: string;
  carrier?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
  items?: Array<{ productName: string; quantity: number; customization?: string | null }>;
  currentMilestone?: { status: string; note: string; timestamp: string };
  errorMessage?: string;
}

export interface BotSupportTicketResult {
  success: boolean;
  ticketNumber?: string;
  message?: string;
  errorMessage?: string;
}

export interface BotChatResult {
  reply: string;
  contextSources: string[];
  suggestedFollowUps?: string[];
  requiresHumanHandover?: boolean;
}

export interface BotProductSearchResult {
  total: number;
  products: Array<{
    id: string;
    name: string;
    sku: string;
    price: number;
    category: string;
    shortDescription: string;
    inStock: boolean;
    images: string[];
    url: string;
  }>;
}

export interface BotFaqResult {
  category: string;
  items: Array<{
    question: string;
    answer: string;
    category: string;
  }>;
}

/**
 * Universal HARCONXS Client SDK for Bots & Extensions
 */
export class HarconxsBotClient {
  private botType: 'telegram' | 'discord' | 'whatsapp' | 'wordpress';
  private apiKey: string;
  private apiBaseUrl: string;

  constructor(config: BotClientConfig) {
    this.botType = config.botType;
    this.apiKey = config.apiKey;
    this.apiBaseUrl = config.apiBaseUrl || '';
  }

  private async executeRequest(
    method: 'GET' | 'POST',
    path: string,
    query?: Record<string, string>,
    body?: any
  ): Promise<ApiResponsePayload> {
    const authHeader = `Bearer ${this.apiKey}`;
    
    // Execute request through HARCONXS API core handler
    return await handleApiV1Request({
      method,
      path: path.startsWith('/api/v1') ? path : `/api/v1${path}`,
      headers: {
        'authorization': authHeader,
        'content-type': 'application/json',
        'x-client-platform': this.botType
      },
      query,
      body,
      userAgent: `HARCONXS-${this.botType.toUpperCase()}-Bot/1.0`
    });
  }

  /**
   * 1. Search Atelier Catalog
   */
  async searchProducts(query: string, category?: string, limit = 5): Promise<BotProductSearchResult> {
    const queryParams: Record<string, string> = { q: query, limit: String(limit) };
    if (category && category !== 'All') {
      queryParams.category = category;
    }

    const res = await this.executeRequest('GET', '/products', queryParams);
    
    if (res.status === 200 && res.body?.data) {
      const items = Array.isArray(res.body.data) ? res.body.data : [res.body.data];
      return {
        total: res.body.meta?.total || items.length,
        products: items.map((p: any) => ({
          id: p.id,
          name: p.name,
          sku: p.sku,
          price: p.price,
          category: p.category,
          shortDescription: p.shortDescription || p.description || '',
          inStock: p.inStock !== false,
          images: p.images || [],
          url: `https://harconxsshop.com/product/${p.slug || p.id}`
        }))
      };
    }

    return { total: 0, products: [] };
  }

  /**
   * 2. Query Atelier FAQs & Policies
   */
  async getFaqs(category?: string): Promise<BotFaqResult> {
    const queryParams: Record<string, string> = {};
    if (category) queryParams.category = category;

    const res = await this.executeRequest('GET', '/faq', queryParams);
    
    if (res.status === 200 && res.body?.data) {
      const items = Array.isArray(res.body.data) ? res.body.data : [];
      return {
        category: category || 'All Categories',
        items: items.map((f: any) => ({
          question: f.question,
          answer: f.answer,
          category: f.category
        }))
      };
    }

    return { category: category || 'General', items: [] };
  }

  /**
   * 3. Secure Order Verification & Status Lookup
   * Protects customer privacy by requiring Order # and Matching Email / Phone
   */
  async verifyAndTrackOrder(orderNumber: string, emailOrPhone: string): Promise<BotOrderTrackingResult> {
    const res = await this.executeRequest('POST', '/orders/verify-lookup', undefined, {
      orderNumber,
      customerEmail: emailOrPhone.includes('@') ? emailOrPhone : undefined,
      phone: !emailOrPhone.includes('@') ? emailOrPhone : undefined
    });

    if (res.status === 200 && res.body?.success && res.body.data) {
      const data = res.body.data;
      return {
        verified: true,
        orderNumber: data.orderNumber,
        customerMasked: data.customerMasked,
        status: data.status,
        carrier: data.carrier,
        trackingNumber: data.trackingNumber,
        trackingUrl: data.trackingUrl,
        estimatedDelivery: data.estimatedDelivery,
        items: data.items,
        currentMilestone: data.currentMilestone
      };
    }

    const errMsg = res.body?.error?.message || 'Unable to verify order. Please check the order number and email/phone provided.';
    return {
      verified: false,
      errorMessage: errMsg
    };
  }

  /**
   * 4. Dispatch Support Ticket directly to Central Supabase
   */
  async createSupportTicket(
    customerName: string,
    customerEmail: string,
    subject: string,
    message: string,
    category = 'Bot Inquiries'
  ): Promise<BotSupportTicketResult> {
    const platformLabel = this.botType === 'telegram'
      ? 'Telegram Support Bot'
      : this.botType === 'discord'
      ? 'Discord Support Bot'
      : this.botType === 'whatsapp'
      ? 'WhatsApp Support Bot'
      : 'WordPress Integration';

    const res = await this.executeRequest('POST', '/support/tickets', undefined, {
      customerName,
      customerEmail,
      subject,
      message,
      category,
      platform: platformLabel
    });

    if (res.status === 200 && res.body?.success) {
      return {
        success: true,
        ticketNumber: res.body.data?.ticketNumber,
        message: 'Your inquiry has been escalated to the HARCONXS Concierge team. We will reply to your email shortly.'
      };
    }

    return {
      success: false,
      errorMessage: res.body?.error?.message || 'Failed to file support ticket. Please try again later.'
    };
  }

  /**
   * 5. Grounded AI Support Conversation
   * Routes query to the private /api/v1/chat endpoint without exposing AI keys
   */
  async askAiAssistant(
    message: string,
    conversationHistory?: Array<{ sender: 'user' | 'bot'; text: string }>
  ): Promise<BotChatResult> {
    const res = await this.executeRequest('POST', '/chat', undefined, {
      message,
      conversationHistory: (conversationHistory || []).map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }))
    });

    if (res.status === 200 && res.body?.data) {
      const data = res.body.data;
      return {
        reply: data.reply || 'I am happy to assist you with HARCONXS jewelry, orders, and services.',
        contextSources: data.contextSources || ['HARCONXS Knowledge Base'],
        suggestedFollowUps: data.suggestedQuestions || [],
        requiresHumanHandover: Boolean(data.requiresHumanHandover)
      };
    }

    return {
      reply: 'Our artisan concierge is available to help. Feel free to ask about products, shipping, returns, or couple websites.',
      contextSources: ['System Defaults'],
      requiresHumanHandover: false
    };
  }
}

/**
 * Convenience factories for standard clients
 */
export function createTelegramBotClient(apiKey?: string): HarconxsBotClient {
  return new HarconxsBotClient({
    botType: 'telegram',
    apiKey: apiKey || 'hx_live_tel_9b32c018a441cd88e0'
  });
}

export function createDiscordBotClient(apiKey?: string): HarconxsBotClient {
  return new HarconxsBotClient({
    botType: 'discord',
    apiKey: apiKey || 'hx_live_dsc_3c4819ef0129ad77fc'
  });
}

export function createWhatsAppBotClient(apiKey?: string): HarconxsBotClient {
  return new HarconxsBotClient({
    botType: 'whatsapp',
    apiKey: apiKey || 'hx_live_wsp_5a77ab924e33d018cc'
  });
}

export function createWordPressClient(apiKey?: string): HarconxsBotClient {
  return new HarconxsBotClient({
    botType: 'wordpress',
    apiKey: apiKey || 'hx_live_wp_8e22cd33bb44fa7701'
  });
}
