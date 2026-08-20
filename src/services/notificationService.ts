/**
 * HARCONXS ATELIER & SANCTUARY
 * Universal In-App Notification & Server-Side Email Dispatch Engine
 */

import { AppNotification, NotificationType, NotificationCategory, EmailNotification } from '../types';
import {
  fetchNotificationsFromSupabase,
  upsertNotificationInSupabase,
  markNotificationReadInSupabase,
  markAllNotificationsReadInSupabase,
  deleteNotificationFromSupabase,
  recordEmailLogInSupabase
} from './supabaseService';

export interface TriggerNotificationParams {
  type: NotificationType;
  recipientEmail?: string;
  recipientName?: string;
  userId?: string;
  data?: Record<string, any>;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  customTitle?: string;
  customMessage?: string;
  actionUrl?: string;
  actionLabel?: string;
  actionView?: string;
}

export interface NotificationMetaInfo {
  category: NotificationCategory;
  defaultTitle: string;
  defaultMessage: string;
  iconName: string;
  badgeColor: string;
  accentColor: string;
  defaultActionUrl: string;
  defaultActionLabel: string;
  defaultActionView: string;
}

export function getNotificationMeta(type: NotificationType, data: Record<string, any> = {}): NotificationMetaInfo {
  switch (type) {
    case 'ACCOUNT_CREATED':
      return {
        category: 'account',
        defaultTitle: 'Welcome to HARCONXS Atelier',
        defaultMessage: `Your member account is active with +${data.loyaltyPoints || 150} Loyalty Points credited to your wallet!`,
        iconName: 'Sparkles',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        accentColor: 'text-amber-400',
        defaultActionUrl: '/account',
        defaultActionLabel: 'View Account',
        defaultActionView: 'profile'
      };

    case 'EMAIL_VERIFICATION':
      return {
        category: 'account',
        defaultTitle: 'Security: Verify Email Address',
        defaultMessage: `Use PIN code ${data.verificationCode || '849201'} to confirm your email address and secure your orders.`,
        iconName: 'ShieldCheck',
        badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        accentColor: 'text-blue-400',
        defaultActionUrl: '/account/profile',
        defaultActionLabel: 'Verify Security',
        defaultActionView: 'profile'
      };

    case 'ORDER_CREATED':
      return {
        category: 'orders',
        defaultTitle: `Order Received #${data.orderNumber || 'HX-98201'}`,
        defaultMessage: `Thank you for your order. Our artisans are reviewing your custom specifications.`,
        iconName: 'ShoppingBag',
        badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
        accentColor: 'text-indigo-400',
        defaultActionUrl: '/account/orders',
        defaultActionLabel: 'View Order',
        defaultActionView: 'orders'
      };

    case 'PAYMENT_SUCCESSFUL':
      return {
        category: 'orders',
        defaultTitle: `Payment Authorized for #${data.orderNumber || 'HX-98201'}`,
        defaultMessage: `Payment of ${data.amount ? '₹' + Number(data.amount).toLocaleString('en-IN') : '₹3,499'} settled successfully. Tax invoice generated.`,
        iconName: 'CreditCard',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        accentColor: 'text-emerald-400',
        defaultActionUrl: '/account/orders',
        defaultActionLabel: 'Download Invoice',
        defaultActionView: 'orders'
      };

    case 'ORDER_PROCESSING':
      return {
        category: 'orders',
        defaultTitle: `Crafting on Bench: #${data.orderNumber || 'HX-98201'}`,
        defaultMessage: `Your bespoke pieces are currently undergoing micron fiber laser engraving & QA inspection.`,
        iconName: 'Hammer',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        accentColor: 'text-amber-400',
        defaultActionUrl: '/account/orders',
        defaultActionLabel: 'Track Progress',
        defaultActionView: 'orders'
      };

    case 'ORDER_SHIPPED':
      return {
        category: 'orders',
        defaultTitle: `Dispatched: #${data.orderNumber || 'HX-98201'} via ${data.carrier || 'BlueDart'}`,
        defaultMessage: `Package is in transit. Air Waybill: ${data.trackingNumber || 'BD-84920194'}.`,
        iconName: 'Truck',
        badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
        accentColor: 'text-sky-400',
        defaultActionUrl: '/tracking',
        defaultActionLabel: 'Live Flight Radar',
        defaultActionView: 'tracking'
      };

    case 'ORDER_DELIVERED':
      return {
        category: 'orders',
        defaultTitle: `Delivered: #${data.orderNumber || 'HX-98201'}`,
        defaultMessage: `Your keepsake package has arrived! Leave a verified review to earn +50 Loyalty Points.`,
        iconName: 'PackageCheck',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        accentColor: 'text-emerald-400',
        defaultActionUrl: '/account/reviews',
        defaultActionLabel: 'Write Review (+50 Pts)',
        defaultActionView: 'reviews'
      };

    case 'REFUND_PROCESSED':
      return {
        category: 'orders',
        defaultTitle: `Refund Settled: ${data.amount ? '₹' + Number(data.amount).toLocaleString('en-IN') : '₹3,499'}`,
        defaultMessage: `Refund for Order #${data.orderNumber || 'HX-98201'} has been credited to your payment method (ARN: ${data.refundNumber || 'RFD-9021'}).`,
        iconName: 'RotateCcw',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        accentColor: 'text-rose-400',
        defaultActionUrl: '/account/orders',
        defaultActionLabel: 'View Order History',
        defaultActionView: 'orders'
      };

    case 'CUSTOM_ORDER_MESSAGE':
      return {
        category: 'custom',
        defaultTitle: `New Message on Custom Project #${data.requestNumber || 'REQ-4819'}`,
        defaultMessage: `${data.senderName || 'Master Artisan Julian'}: "${data.messageSnippet || 'I have updated the 3D CAD rendering for your approval.'}"`,
        iconName: 'MessageSquare',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        accentColor: 'text-amber-400',
        defaultActionUrl: '/account/custom-orders',
        defaultActionLabel: 'Reply to Artisan',
        defaultActionView: 'custom_orders'
      };

    case 'CUSTOM_QUOTE_ISSUED':
      return {
        category: 'custom',
        defaultTitle: `Bespoke Quote Ready: #${data.requestNumber || 'REQ-4819'}`,
        defaultMessage: `Official quote of ${data.amount ? '₹' + Number(data.amount).toLocaleString('en-IN') : '₹14,500'} is ready for your review. Turnaround: ${data.turnaroundDays || 5} days.`,
        iconName: 'Gem',
        badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        accentColor: 'text-purple-400',
        defaultActionUrl: '/account/custom-orders',
        defaultActionLabel: 'Review & Accept Quote',
        defaultActionView: 'custom_orders'
      };

    case 'QUOTE_ACCEPTED':
      return {
        category: 'custom',
        defaultTitle: `Commission Authorized: #${data.requestNumber || 'REQ-4819'}`,
        defaultMessage: `Your bespoke quote was accepted. Custom fabrication is scheduled on the master bench.`,
        iconName: 'CheckCircle2',
        badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        accentColor: 'text-purple-400',
        defaultActionUrl: '/account/custom-orders',
        defaultActionLabel: 'View Timeline Studio',
        defaultActionView: 'custom_orders'
      };

    case 'COUPLE_WEBSITE_PURCHASE':
      return {
        category: 'websites',
        defaultTitle: `Couple Sanctuary Provisioned`,
        defaultMessage: `Subdomain ${data.subdomain || 'hamza-sarah'}.harconxs.com is reserved. Build your romantic timeline!`,
        iconName: 'Heart',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        accentColor: 'text-rose-400',
        defaultActionUrl: '/account/couple-websites',
        defaultActionLabel: 'Open Sanctuary Studio',
        defaultActionView: 'couple_websites'
      };

    case 'WEBSITE_PUBLISHED':
      return {
        category: 'websites',
        defaultTitle: `Sanctuary Published Live!`,
        defaultMessage: `Your couple website is live worldwide at https://${data.subdomain || 'hamza-sarah'}.harconxs.com with global edge SSL.`,
        iconName: 'Globe',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        accentColor: 'text-emerald-400',
        defaultActionUrl: '/account/couple-websites',
        defaultActionLabel: 'Visit Live Sanctuary',
        defaultActionView: 'couple_websites'
      };

    case 'SUPPORT_REPLY':
      return {
        category: 'support',
        defaultTitle: `Support Reply on #${data.ticketNumber || 'TKT-8902'}`,
        defaultMessage: `${data.agentName || 'Atelier Concierge'}: "${data.replySnippet || 'We have updated your inquiry with resolution steps.'}"`,
        iconName: 'Headphones',
        badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        accentColor: 'text-blue-400',
        defaultActionUrl: '/account/support',
        defaultActionLabel: 'View Ticket Thread',
        defaultActionView: 'support'
      };

    case 'API_KEY_CREATED':
      return {
        category: 'security',
        defaultTitle: `Developer Token Issued ("${data.keyName || 'Production Bot'}")`,
        defaultMessage: `New API key created (${data.keyPrefix || 'hx_live_89a1'}...) with authorized scopes.`,
        iconName: 'KeyRound',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        accentColor: 'text-amber-400',
        defaultActionUrl: '/account/settings',
        defaultActionLabel: 'Audit API Tokens',
        defaultActionView: 'settings'
      };

    case 'API_KEY_REVOKED':
      return {
        category: 'security',
        defaultTitle: `API Key Deactivated ("${data.keyName || 'Production Bot'}")`,
        defaultMessage: `API key ${data.keyPrefix || 'hx_live_89a1'}... has been permanently revoked and purged.`,
        iconName: 'ShieldAlert',
        badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
        accentColor: 'text-red-400',
        defaultActionUrl: '/account/settings',
        defaultActionLabel: 'Manage Security',
        defaultActionView: 'settings'
      };

    default:
      return {
        category: 'account',
        defaultTitle: 'HARCONXS Notification',
        defaultMessage: 'You have a new update regarding your account or orders.',
        iconName: 'Bell',
        badgeColor: 'bg-zinc-800 text-zinc-300 border-zinc-700',
        accentColor: 'text-zinc-400',
        defaultActionUrl: '/account/notifications',
        defaultActionLabel: 'View Notification',
        defaultActionView: 'notifications'
      };
  }
}

/**
 * Universal Notification Dispatcher
 * 1. Creates an in-app notification in Supabase / state
 * 2. Triggers server-side email dispatch via secure POST /api/v1/notifications/email-dispatch
 */
export async function triggerNotification(
  params: TriggerNotificationParams
): Promise<{ notification: AppNotification; emailResult?: any }> {
  const meta = getNotificationMeta(params.type, params.data);
  const notifId = `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const now = new Date().toISOString();

  const title = params.customTitle || meta.defaultTitle;
  const message = params.customMessage || meta.defaultMessage;
  const actionUrl = params.actionUrl || meta.defaultActionUrl;
  const actionLabel = params.actionLabel || meta.defaultActionLabel;
  const actionView = params.actionView || meta.defaultActionView;

  const appNotification: AppNotification = {
    id: notifId,
    userId: params.userId,
    type: params.type,
    category: meta.category,
    title,
    message,
    data: params.data || {},
    isRead: false,
    readAt: null,
    createdAt: now,
    priority: params.priority || 'normal',
    actionUrl,
    actionLabel,
    actionView,
    emailSent: false
  };

  let emailResult: any = null;

  // If recipient email is supplied, dispatch transactional email through server
  if (params.recipientEmail) {
    try {
      const resp = await fetch('/api/v1/notifications/email-dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: params.type,
          recipientEmail: params.recipientEmail,
          recipientName: params.recipientName || params.recipientEmail.split('@')[0],
          subject: title,
          data: params.data || {},
          userId: params.userId
        })
      });

      if (resp.ok) {
        emailResult = await resp.json();
        appNotification.emailSent = true;
        appNotification.emailId = emailResult?.emailId;
      }
    } catch (err) {
      console.warn('[NotificationService] Server email dispatch network notice:', err);
    }
  }

  // Persist in-app notification to Supabase
  try {
    await upsertNotificationInSupabase(appNotification);
  } catch (err) {
    console.warn('[NotificationService] Supabase persistence notice:', err);
  }

  return { notification: appNotification, emailResult };
}

export {
  fetchNotificationsFromSupabase,
  upsertNotificationInSupabase,
  markNotificationReadInSupabase,
  markAllNotificationsReadInSupabase,
  deleteNotificationFromSupabase
};
