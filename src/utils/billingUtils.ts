/**
 * HARCONXS Billing Redirection & Safe Query Parameter Utilities
 * 
 * NOTE: The bot-panel marketplace in HARCONXS is a catalogue/marketing interface.
 * The actual billing, checkout, and subscriptions are handled securely by:
 * https://billingharconxs.vercel.app/
 * 
 * SECURITY MANDATE:
 * Only pass non-sensitive query parameters (e.g. productId, planId, slug, cycle, source).
 * NEVER append passwords, API keys, Supabase service role keys, or payment secrets.
 */

export interface BillingRedirectParams {
  productId?: string;
  planId?: string;
  slug?: string;
  billingCycle?: 'monthly' | 'yearly' | 'lifetime' | string;
  source?: string;
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
 * Constructs a safe, sanitized billing redirection URL
 */
export function buildSafeBillingUrl(params: BillingRedirectParams): string {
  const base = getBillingBaseUrl();
  const url = new URL(base);

  // Safely append only authorized, non-sensitive parameters
  if (params.productId) {
    url.searchParams.set('productId', encodeURIComponent(params.productId.trim()));
  }
  if (params.planId) {
    url.searchParams.set('planId', encodeURIComponent(params.planId.trim()));
  }
  if (params.slug) {
    url.searchParams.set('slug', encodeURIComponent(params.slug.trim()));
  }
  if (params.billingCycle) {
    url.searchParams.set('cycle', encodeURIComponent(params.billingCycle.trim()));
  }
  
  // Set origin source tracking
  url.searchParams.set('source', params.source || 'harconxs_shop');

  return url.toString();
}

/**
 * Safely redirects the client to the external billing portal in a new tab
 */
export function redirectToBillingPortal(params: BillingRedirectParams): void {
  const targetUrl = buildSafeBillingUrl(params);
  window.open(targetUrl, '_blank', 'noopener,noreferrer');
}
