/**
 * HARCONXS Billing Redirection & Safe Cross-Domain Authentication Utilities
 * 
 * NOTE: The bot-panel marketplace in HARCONXS is a catalogue/marketing interface.
 * The actual billing, checkout, and subscriptions are handled securely by:
 * https://billingharconxs.vercel.app/
 * 
 * SECURITY MANDATE:
 * 1. The billing application must NOT receive passwords through redirects.
 * 2. Do not place access tokens, JWTs, or sensitive credentials in query parameters.
 * 3. Never expose Supabase service-role keys.
 * 4. Do not trust user IDs received from query parameters.
 * 5. The billing application must independently verify the authenticated user before showing private billing information.
 * 6. Uses Shared Supabase Auth project OR Ephemeral Single-Use 60s Handoff Tickets.
 */

import { createBillingHandoffTicket, verifyAndRedeemBillingHandoffTicket } from '../services/apiCoreService';

export interface BillingRedirectParams {
  productId?: string;
  planId?: string;
  slug?: string;
  billingCycle?: 'monthly' | 'yearly' | 'lifetime' | string;
  source?: string;
  userContext?: {
    userId?: string;
    userEmail?: string;
    userName?: string;
    userRole?: string;
  };
}

export interface BillingHandoffResult {
  url: string;
  ticketId?: string;
  expiresInSeconds?: number;
  isEphemeralTicket: boolean;
}

/**
 * Returns the configured billing portal base URL
 */
export function getBillingBaseUrl(): string {
  const envUrl = import.meta.env.VITE_BILLING_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/+$/, '');
  }
  return 'https://billingharconxs.vercel.app';
}

/**
 * Constructs a safe, sanitized billing redirection URL without exposing any secrets or raw user IDs.
 */
export function buildSafeBillingUrl(params: BillingRedirectParams): string {
  const base = getBillingBaseUrl();
  const url = new URL(base);

  // Safely append only authorized, non-sensitive parameters
  if (params.productId) {
    url.searchParams.set('productId', params.productId.trim());
  }
  if (params.planId) {
    url.searchParams.set('planId', params.planId.trim());
  }
  if (params.slug) {
    url.searchParams.set('slug', params.slug.trim());
  }
  if (params.billingCycle) {
    url.searchParams.set('cycle', params.billingCycle.trim());
  }
  
  // Set origin source tracking
  url.searchParams.set('source', params.source || 'harconxs_shop');

  return url.toString();
}

/**
 * Generates a secure cross-application handoff URL.
 * If user context is provided, an ephemeral 60-second single-use ticket is generated.
 * Otherwise, a clean catalog intent URL is returned.
 */
export async function generateSecureBillingHandoff(
  params: BillingRedirectParams
): Promise<BillingHandoffResult> {
  const base = getBillingBaseUrl();
  const url = new URL(base);

  // Append safe non-sensitive catalog descriptors
  if (params.productId) url.searchParams.set('productId', params.productId.trim());
  if (params.planId) url.searchParams.set('planId', params.planId.trim());
  if (params.slug) url.searchParams.set('slug', params.slug.trim());
  if (params.billingCycle) url.searchParams.set('cycle', params.billingCycle.trim());
  url.searchParams.set('source', params.source || 'harconxs_shop');

  // If user is authenticated in HARCONXS, issue a single-use 60s ephemeral handoff ticket
  if (params.userContext?.userId && params.userContext?.userEmail) {
    try {
      const ticket = await createBillingHandoffTicket({
        userId: params.userContext.userId,
        userEmail: params.userContext.userEmail,
        userName: params.userContext.userName || 'HARCONXS Patron',
        userRole: params.userContext.userRole,
        planId: params.planId,
        productId: params.productId,
        slug: params.slug,
        billingCycle: params.billingCycle,
        source: params.source || 'harconxs_shop'
      });

      url.searchParams.set('handoff_ticket', ticket.ticketId);

      return {
        url: url.toString(),
        ticketId: ticket.ticketId,
        expiresInSeconds: ticket.expiresInSeconds,
        isEphemeralTicket: true
      };
    } catch {
      // Fallback to clean catalog URL if ticket generation fails
      return {
        url: url.toString(),
        isEphemeralTicket: false
      };
    }
  }

  return {
    url: url.toString(),
    isEphemeralTicket: false
  };
}

/**
 * Safely redirects the client to the external billing portal in a new tab
 */
export async function redirectToBillingPortal(params: BillingRedirectParams): Promise<void> {
  const handoff = await generateSecureBillingHandoff(params);
  window.open(handoff.url, '_blank', 'noopener,noreferrer');
}

/**
 * Verification helper for the Billing side: verifies and redeems a single-use handoff ticket
 */
export async function redeemBillingHandoffTicket(ticketId: string) {
  return await verifyAndRedeemBillingHandoffTicket(ticketId);
}

