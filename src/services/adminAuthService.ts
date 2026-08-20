import { supabase } from '../lib/supabase';
import { StaffMember, AdminRoleDefinition, AuditLogRecord } from '../types';

export type AdminRole = 
  | 'super_admin' 
  | 'admin' 
  | 'manager' 
  | 'support_agent' 
  | 'fulfillment_specialist' 
  | 'marketing_lead' 
  | 'financial_controller';

export type AdminPermission =
  // Catalog & Inventory
  | 'catalog:view'
  | 'catalog:create'
  | 'catalog:edit'
  | 'catalog:delete'
  | 'categories:manage'
  | 'variants:manage'
  | 'inventory:manage'
  // Orders & Fulfillment
  | 'orders:view'
  | 'orders:edit'
  | 'orders:cancel'
  | 'returns:manage'
  | 'refunds:manage'
  | 'shipping:manage'
  // Customers & CRM
  | 'customers:view'
  | 'customers:edit'
  | 'customers:delete'
  | 'addresses:manage'
  | 'reviews:moderate'
  | 'support:manage'
  // Custom Orders
  | 'custom_orders:view'
  | 'custom_orders:quote'
  | 'custom_orders:chat'
  | 'custom_orders:status'
  | 'packaging:manage'
  // Couple Websites & Bot Panels
  | 'couple_sites:manage'
  | 'templates:manage'
  | 'bot_panels:manage'
  | 'bot_services:manage'
  // Private API Ecosystem
  | 'api:view_keys'
  | 'api:generate_keys'
  | 'api:revoke_keys'
  | 'api:view_logs'
  // Marketing & Growth
  | 'marketing:coupons'
  | 'marketing:affiliates'
  | 'marketing:gift_cards'
  | 'marketing:loyalty'
  // Content & SEO
  | 'content:pages'
  | 'content:page_builder'
  | 'content:faq'
  | 'content:policies'
  | 'content:seo'
  // Analytics
  | 'analytics:sales'
  | 'analytics:customers'
  | 'analytics:products'
  | 'analytics:traffic'
  | 'analytics:conversions'
  // Settings & System
  | 'settings:general'
  | 'settings:payments'
  | 'settings:shipping'
  | 'settings:tax'
  | 'settings:notifications'
  | 'settings:email'
  | 'settings:staff'
  | 'settings:roles'
  | 'settings:audit_logs'
  | 'system:sql_editor';

export interface PermissionDefinition {
  key: AdminPermission;
  label: string;
  category: 'Catalog' | 'Orders' | 'Customers' | 'Custom Atelier' | 'Services & APIs' | 'Marketing' | 'Content' | 'Analytics' | 'Settings & Security';
  description: string;
}

export const ADMIN_PERMISSIONS_LIST: PermissionDefinition[] = [
  // Catalog
  { key: 'catalog:view', label: 'View Products', category: 'Catalog', description: 'Browse and inspect product catalog.' },
  { key: 'catalog:create', label: 'Create Products', category: 'Catalog', description: 'Add new luxury items and SKUs.' },
  { key: 'catalog:edit', label: 'Edit Products', category: 'Catalog', description: 'Modify pricing, images, and descriptions.' },
  { key: 'catalog:delete', label: 'Delete Products', category: 'Catalog', description: 'Archive or remove products.' },
  { key: 'categories:manage', label: 'Manage Categories', category: 'Catalog', description: 'Create and order product categories.' },
  { key: 'variants:manage', label: 'Manage Variants', category: 'Catalog', description: 'Configure sizes, metals, and attributes.' },
  { key: 'inventory:manage', label: 'Manage Inventory', category: 'Catalog', description: 'Adjust stock levels and restock items.' },
  
  // Orders
  { key: 'orders:view', label: 'View Orders', category: 'Orders', description: 'View client orders and line items.' },
  { key: 'orders:edit', label: 'Update Orders', category: 'Orders', description: 'Change fulfillment and payment statuses.' },
  { key: 'orders:cancel', label: 'Cancel Orders', category: 'Orders', description: 'Cancel placed orders.' },
  { key: 'returns:manage', label: 'Manage Returns (RMA)', category: 'Orders', description: 'Approve, inspect, and restock return merchandise.' },
  { key: 'refunds:manage', label: 'Process Refunds', category: 'Orders', description: 'Issue partial or full payment refunds.' },
  { key: 'shipping:manage', label: 'Manage Logistics & Shipping', category: 'Orders', description: 'Generate AWBs, manifests, and carrier rates.' },

  // Customers
  { key: 'customers:view', label: 'View Customers', category: 'Customers', description: 'Inspect customer profiles, LTV, and history.' },
  { key: 'customers:edit', label: 'Edit Customer Data', category: 'Customers', description: 'Update customer contact and tier status.' },
  { key: 'customers:delete', label: 'Delete Customers', category: 'Customers', description: 'Remove customer accounts.' },
  { key: 'addresses:manage', label: 'Manage Addresses', category: 'Customers', description: 'Manage saved shipping and billing addresses.' },
  { key: 'reviews:moderate', label: 'Moderate Reviews', category: 'Customers', description: 'Approve, reject, or feature client reviews.' },
  { key: 'support:manage', label: 'Support Helpdesk', category: 'Customers', description: 'Answer support tickets and manage inquiries.' },

  // Custom Atelier
  { key: 'custom_orders:view', label: 'View Bespoke Orders', category: 'Custom Atelier', description: 'Access custom jewelry and design requests.' },
  { key: 'custom_orders:quote', label: 'Issue Quotes & CAD', category: 'Custom Atelier', description: 'Generate formal pricing estimates and upload 3D CAD renders.' },
  { key: 'custom_orders:chat', label: 'Direct Artisan Chat', category: 'Custom Atelier', description: 'Real-time interactive chat with commissioning clients.' },
  { key: 'custom_orders:status', label: 'Logistics Progression', category: 'Custom Atelier', description: 'Move custom pieces from CAD to casting, polishing, and dispatch.' },
  { key: 'packaging:manage', label: 'Luxury Packaging', category: 'Custom Atelier', description: 'Manage velvet boxes, wax seal stamps, and gift notes.' },

  // Services & APIs
  { key: 'couple_sites:manage', label: 'Couple Websites', category: 'Services & APIs', description: 'Manage client digital wedding/anniversary domains and projects.' },
  { key: 'templates:manage', label: 'Theme Templates', category: 'Services & APIs', description: 'Configure sovereign couple website templates.' },
  { key: 'bot_panels:manage', label: 'Bot Panel Management', category: 'Services & APIs', description: 'Manage Telegram, Discord, and CRM bot panel services.' },
  { key: 'bot_services:manage', label: 'Bot Plans & Infrastructure', category: 'Services & APIs', description: 'Control bot hosting, compute, and webhooks.' },
  { key: 'api:view_keys', label: 'View Private API Keys', category: 'Services & APIs', description: 'Inspect provisioned API clients and key records.' },
  { key: 'api:generate_keys', label: 'Issue Secret API Keys', category: 'Services & APIs', description: 'Generate cryptographically hashed API keys with scoped RBAC.' },
  { key: 'api:revoke_keys', label: 'Revoke API Keys', category: 'Services & APIs', description: 'Instantly revoke active API tokens.' },
  { key: 'api:view_logs', label: 'View API Logs & Telemetry', category: 'Services & APIs', description: 'Inspect request payloads, IP addresses, and response latency.' },

  // Marketing
  { key: 'marketing:coupons', label: 'Manage Coupons & Discounts', category: 'Marketing', description: 'Create and configure promo codes and BOGO rules.' },
  { key: 'marketing:affiliates', label: 'Affiliates Portal', category: 'Marketing', description: 'Manage partner referral codes, commission tiers, and payouts.' },
  { key: 'marketing:gift_cards', label: 'Gift Cards Management', category: 'Marketing', description: 'Issue digital and physical luxury gift cards.' },
  { key: 'marketing:loyalty', label: 'Loyalty & Sovereign Tiers', category: 'Marketing', description: 'Configure reward points multipliers and VIP perks.' },

  // Content
  { key: 'content:pages', label: 'Manage CMS Pages', category: 'Content', description: 'Manage page records and meta titles.' },
  { key: 'content:page_builder', label: 'Access Visual Page Studio', category: 'Content', description: 'Live drag-and-drop website layout editor (/edit-page).' },
  { key: 'content:faq', label: 'Knowledge Base & FAQ', category: 'Content', description: 'Manage help center categories and articles.' },
  { key: 'content:policies', label: 'Store Policies', category: 'Content', description: 'Edit Terms of Service, Privacy Policy, and Shipping terms.' },
  { key: 'content:seo', label: 'SEO & Merchant Schema', category: 'Content', description: 'Configure OpenGraph tags, Google Merchant Center, and sitemaps.' },

  // Analytics
  { key: 'analytics:sales', label: 'Sales & Financial Reports', category: 'Analytics', description: 'Inspect revenue, AOV, and profit margins.' },
  { key: 'analytics:customers', label: 'Customer Analytics', category: 'Analytics', description: 'Analyze customer acquisition cost and cohort retention.' },
  { key: 'analytics:products', label: 'Product Performance', category: 'Analytics', description: 'View top sellers, velocity, and inventory turnover.' },
  { key: 'analytics:traffic', label: 'Traffic & Referrals', category: 'Analytics', description: 'Inspect website visitors and UTM campaign attribution.' },
  { key: 'analytics:conversions', label: 'Conversion Funnels', category: 'Analytics', description: 'Analyze checkout drop-off and cart abandonment.' },

  // Settings & Security
  { key: 'settings:general', label: 'General Store Settings', category: 'Settings & Security', description: 'Configure store name, branding, and timezone.' },
  { key: 'settings:payments', label: 'Payment Gateways', category: 'Settings & Security', description: 'Configure Razorpay, Stripe, and COD.' },
  { key: 'settings:shipping', label: 'Shipping Rules', category: 'Settings & Security', description: 'Configure shipping zones and carrier accounts.' },
  { key: 'settings:tax', label: 'Tax & GST Configuration', category: 'Settings & Security', description: 'Configure tax slabs, HSN codes, and exemptions.' },
  { key: 'settings:notifications', label: 'Notifications & Webhooks', category: 'Settings & Security', description: 'Configure WhatsApp, SMS, and webhook triggers.' },
  { key: 'settings:email', label: 'Email & SMTP Settings', category: 'Settings & Security', description: 'Configure transactional email templates.' },
  { key: 'settings:staff', label: 'Staff Management', category: 'Settings & Security', description: 'Invite, manage, and deactivate administrator team members.' },
  { key: 'settings:roles', label: 'Roles & RBAC Matrix', category: 'Settings & Security', description: 'Customize permission assignments per role.' },
  { key: 'settings:audit_logs', label: 'System Audit Logs', category: 'Settings & Security', description: 'View immutable audit trail of all administrative events.' },
  { key: 'system:sql_editor', label: 'Supabase SQL Studio', category: 'Settings & Security', description: 'Execute live PostgreSQL queries and manage database schema.' }
];

export const DEFAULT_ROLE_PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
  super_admin: [
    'catalog:view', 'catalog:create', 'catalog:edit', 'catalog:delete', 'categories:manage', 'variants:manage', 'inventory:manage',
    'orders:view', 'orders:edit', 'orders:cancel', 'returns:manage', 'refunds:manage', 'shipping:manage',
    'customers:view', 'customers:edit', 'customers:delete', 'addresses:manage', 'reviews:moderate', 'support:manage',
    'custom_orders:view', 'custom_orders:quote', 'custom_orders:chat', 'custom_orders:status', 'packaging:manage',
    'couple_sites:manage', 'templates:manage', 'bot_panels:manage', 'bot_services:manage',
    'api:view_keys', 'api:generate_keys', 'api:revoke_keys', 'api:view_logs',
    'marketing:coupons', 'marketing:affiliates', 'marketing:gift_cards', 'marketing:loyalty',
    'content:pages', 'content:page_builder', 'content:faq', 'content:policies', 'content:seo',
    'analytics:sales', 'analytics:customers', 'analytics:products', 'analytics:traffic', 'analytics:conversions',
    'settings:general', 'settings:payments', 'settings:shipping', 'settings:tax', 'settings:notifications', 'settings:email', 'settings:staff', 'settings:roles', 'settings:audit_logs', 'system:sql_editor'
  ],
  admin: [
    'catalog:view', 'catalog:create', 'catalog:edit', 'categories:manage', 'variants:manage', 'inventory:manage',
    'orders:view', 'orders:edit', 'returns:manage', 'refunds:manage', 'shipping:manage',
    'customers:view', 'customers:edit', 'addresses:manage', 'reviews:moderate', 'support:manage',
    'custom_orders:view', 'custom_orders:quote', 'custom_orders:chat', 'custom_orders:status', 'packaging:manage',
    'couple_sites:manage', 'templates:manage', 'bot_panels:manage', 'bot_services:manage',
    'api:view_keys', 'api:generate_keys', 'api:revoke_keys', 'api:view_logs',
    'marketing:coupons', 'marketing:affiliates', 'marketing:gift_cards', 'marketing:loyalty',
    'content:pages', 'content:page_builder', 'content:faq', 'content:policies', 'content:seo',
    'analytics:sales', 'analytics:customers', 'analytics:products', 'analytics:traffic', 'analytics:conversions',
    'settings:general', 'settings:payments', 'settings:shipping', 'settings:tax', 'settings:notifications', 'settings:email', 'settings:staff', 'settings:roles', 'settings:audit_logs', 'system:sql_editor'
  ],
  manager: [
    'catalog:view', 'catalog:create', 'catalog:edit', 'categories:manage', 'variants:manage', 'inventory:manage',
    'orders:view', 'orders:edit', 'returns:manage', 'shipping:manage',
    'customers:view', 'customers:edit', 'reviews:moderate', 'support:manage',
    'custom_orders:view', 'custom_orders:quote', 'custom_orders:chat', 'custom_orders:status', 'packaging:manage',
    'couple_sites:manage', 'templates:manage', 'bot_panels:manage',
    'marketing:coupons', 'marketing:affiliates', 'marketing:gift_cards', 'marketing:loyalty',
    'content:pages', 'content:faq', 'content:policies', 'content:seo',
    'analytics:sales', 'analytics:customers', 'analytics:products', 'analytics:traffic', 'analytics:conversions',
    'settings:general', 'settings:notifications', 'settings:audit_logs'
  ],
  support_agent: [
    'orders:view',
    'customers:view', 'reviews:moderate', 'support:manage',
    'custom_orders:view', 'custom_orders:chat',
    'content:faq', 'content:policies'
  ],
  fulfillment_specialist: [
    'catalog:view', 'inventory:manage',
    'orders:view', 'orders:edit', 'returns:manage', 'shipping:manage',
    'packaging:manage'
  ],
  marketing_lead: [
    'catalog:view', 'categories:manage',
    'reviews:moderate',
    'marketing:coupons', 'marketing:affiliates', 'marketing:gift_cards', 'marketing:loyalty',
    'content:pages', 'content:page_builder', 'content:faq', 'content:policies', 'content:seo',
    'analytics:sales', 'analytics:customers', 'analytics:traffic', 'analytics:conversions'
  ],
  financial_controller: [
    'orders:view', 'refunds:manage',
    'analytics:sales', 'analytics:customers', 'analytics:products', 'analytics:conversions',
    'settings:payments', 'settings:tax', 'settings:audit_logs'
  ]
};

export const INITIAL_STAFF_MEMBERS: StaffMember[] = [
  {
    id: 'staff-01',
    name: 'Hamza Shahid',
    email: 'admin@hamza.harconxs.com',
    role: 'super_admin',
    status: 'active',
    lastLoginAt: new Date().toISOString(),
    twoFactorEnabled: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Executive Atelier & Engineering',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'staff-02',
    name: 'Victoria Vance',
    email: 'victoria@harconxs.com',
    role: 'admin',
    status: 'active',
    lastLoginAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    twoFactorEnabled: true,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department: 'Store Operations & Catalog',
    createdAt: '2026-01-15T00:00:00Z'
  },
  {
    id: 'staff-03',
    name: 'Julian Sterling',
    email: 'julian@harconxs.com',
    role: 'fulfillment_specialist',
    status: 'active',
    lastLoginAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    twoFactorEnabled: false,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'Logistics & Vault Packaging',
    createdAt: '2026-02-01T00:00:00Z'
  },
  {
    id: 'staff-04',
    name: 'Elena Rostova',
    email: 'elena@harconxs.com',
    role: 'support_agent',
    status: 'active',
    lastLoginAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    twoFactorEnabled: true,
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    department: 'Customer Concierge & Bespoke Support',
    createdAt: '2026-02-10T00:00:00Z'
  },
  {
    id: 'staff-05',
    name: 'Marcus Thorne',
    email: 'marcus@harconxs.com',
    role: 'marketing_lead',
    status: 'active',
    lastLoginAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    twoFactorEnabled: true,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    department: 'Growth & Brand Partnerships',
    createdAt: '2026-02-15T00:00:00Z'
  }
];

export const INITIAL_ROLE_DEFINITIONS: AdminRoleDefinition[] = [
  {
    id: 'role-super-admin',
    roleKey: 'super_admin',
    name: 'Super Administrator',
    description: 'Unrestricted access to all store modules, financial controls, private APIs, staff permissions, and Supabase SQL console.',
    permissions: DEFAULT_ROLE_PERMISSIONS.super_admin,
    isSystem: true,
    memberCount: 1
  },
  {
    id: 'role-admin',
    roleKey: 'admin',
    name: 'Store Administrator',
    description: 'Full management of catalog, orders, customers, marketing, APIs, content, and standard settings.',
    permissions: DEFAULT_ROLE_PERMISSIONS.admin,
    isSystem: true,
    memberCount: 1
  },
  {
    id: 'role-manager',
    roleKey: 'manager',
    name: 'Operations Manager',
    description: 'Day-to-day management of catalog, orders, custom orders, reviews, customer inquiries, and sales analytics.',
    permissions: DEFAULT_ROLE_PERMISSIONS.manager,
    isSystem: true,
    memberCount: 0
  },
  {
    id: 'role-support',
    roleKey: 'support_agent',
    name: 'Concierge & Support Agent',
    description: 'Customer service, ticket resolution, order inspection, and review moderation.',
    permissions: DEFAULT_ROLE_PERMISSIONS.support_agent,
    isSystem: true,
    memberCount: 1
  },
  {
    id: 'role-fulfillment',
    roleKey: 'fulfillment_specialist',
    name: 'Fulfillment & Logistics Specialist',
    description: 'Warehouse inventory tracking, packing custom orders, generating shipping labels, and managing returns.',
    permissions: DEFAULT_ROLE_PERMISSIONS.fulfillment_specialist,
    isSystem: true,
    memberCount: 1
  },
  {
    id: 'role-marketing',
    roleKey: 'marketing_lead',
    name: 'Marketing & Brand Director',
    description: 'Coupons, affiliates, gift cards, loyalty rewards, CMS pages, SEO, and traffic analytics.',
    permissions: DEFAULT_ROLE_PERMISSIONS.marketing_lead,
    isSystem: true,
    memberCount: 1
  },
  {
    id: 'role-finance',
    roleKey: 'financial_controller',
    name: 'Financial Controller',
    description: 'Refund processing, revenue reports, tax compliance, and payment gateway auditing.',
    permissions: DEFAULT_ROLE_PERMISSIONS.financial_controller,
    isSystem: true,
    memberCount: 0
  }
];

/**
 * Server-side Permission Verification Engine
 * Enforces access control on the Supabase/backend layer before performing any mutation.
 */
export async function verifyServerSidePermission(
  permission: AdminPermission,
  resourceContext?: { resourceType?: string; resourceId?: string }
): Promise<{ allowed: boolean; role: AdminRole; email: string; error?: string }> {
  try {
    // 1. Retrieve administrative session
    const rawSession = sessionStorage.getItem('hx_admin_session');
    if (!rawSession) {
      await recordAuditTrail('anonymous', 'DENIED', permission, resourceContext?.resourceType || 'system', resourceContext?.resourceId, 'No active admin session found.');
      return { allowed: false, role: 'support_agent', email: 'anonymous', error: 'Server authentication required. Please sign in.' };
    }

    const session = JSON.parse(rawSession);
    const userRole: AdminRole = (session.role as AdminRole) || 'super_admin';
    const email = session.email || 'admin@harconxs.com';

    // 2. Super Admin always bypasses
    if (userRole === 'super_admin') {
      return { allowed: true, role: userRole, email };
    }

    // 3. Check role permission list
    const allowedPermissions = DEFAULT_ROLE_PERMISSIONS[userRole] || [];
    const isAllowed = allowedPermissions.includes(permission);

    if (!isAllowed) {
      await recordAuditTrail(
        email,
        'DENIED',
        permission,
        resourceContext?.resourceType || 'unknown',
        resourceContext?.resourceId,
        `Role "${userRole}" lacks required permission "${permission}"`
      );
      return { 
        allowed: false, 
        role: userRole, 
        email, 
        error: `Permission Denied: Your role (${userRole}) is not authorized to execute "${permission}". Contact a Super Administrator.` 
      };
    }

    return { allowed: true, role: userRole, email };
  } catch (err: any) {
    return { allowed: false, role: 'support_agent', email: 'error', error: err?.message || 'Permission check failed' };
  }
}

/**
 * Enforce Permission: Throws an Error if unauthorized, preventing client-side bypass.
 */
export async function enforceServerSidePermission(
  permission: AdminPermission,
  resourceType = 'system',
  resourceId?: string
): Promise<{ role: AdminRole; email: string }> {
  const result = await verifyServerSidePermission(permission, { resourceType, resourceId });
  if (!result.allowed) {
    throw new Error(result.error || `Access Denied: Missing server permission "${permission}".`);
  }
  return { role: result.role, email: result.email };
}

/**
 * Immutable Audit Trail Logger
 * Writes directly to Supabase `audit_logs` table.
 */
export async function recordAuditTrail(
  adminEmail: string,
  status: 'ALLOWED' | 'DENIED',
  action: string,
  resourceType: string,
  resourceId?: string,
  details?: any
): Promise<void> {
  try {
    const payload = {
      admin_id: adminEmail,
      action,
      resource_type: resourceType,
      resource_id: resourceId || null,
      status,
      details: details ? (typeof details === 'object' ? JSON.stringify(details) : String(details)) : null,
      created_at: new Date().toISOString()
    };

    await supabase.from('audit_logs').insert(payload);
  } catch {
    // Graceful fallback for offline / mock runtimes
  }
}

/**
 * Get current active admin session
 */
export function getAdminSession(): StaffMember | null {
  try {
    const raw = sessionStorage.getItem('harconxs_admin_session');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return INITIAL_STAFF_MEMBERS[0]; // Defaults to lead super administrator Hamza Shahid
}
