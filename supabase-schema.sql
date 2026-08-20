-- ==============================================================================
-- HARCONXS SHOP & BESPOKE ATELIER — PRODUCTION SUPABASE POSTGRESQL SCHEMA
-- Version: 3.0.0 (Comprehensive Enterprise Architecture)
-- Engineered for PostgreSQL 15+ / Supabase Auth / Row-Level Security (RLS)
-- ==============================================================================

-- 0. EXTENSIONS & HELPER FUNCTIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Automatic timestamp updater function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Helper function to check if user has admin role
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = user_id AND role IN ('super_admin', 'manager')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- 1. ACCESS CONTROL: ROLES & PERMISSIONS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.roles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.permissions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    module TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.role_permissions (
    role_id TEXT NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id TEXT NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- ==============================================================================
-- 2. USER PROFILES & ACCOUNTS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'customer' REFERENCES public.roles(id) ON DELETE SET DEFAULT,
    loyalty_points INTEGER DEFAULT 150 CHECK (loyalty_points >= 0),
    store_credit NUMERIC(12, 2) DEFAULT 0.00 CHECK (store_credit >= 0),
    is_affiliate BOOLEAN DEFAULT false,
    affiliate_code TEXT UNIQUE,
    affiliate_commission_earned NUMERIC(12, 2) DEFAULT 0.00,
    addresses JSONB DEFAULT '[]'::jsonb,
    preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-create profile trigger on auth.users sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, phone, role, loyalty_points)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        'customer',
        150
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = EXCLUDED.full_name;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 3. CATEGORIES & CATALOG STRUCTURE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    icon TEXT,
    parent_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 4. PRODUCTS, VARIANTS, IMAGES & PACKAGING
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    sku TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_description TEXT,
    full_description TEXT,
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    compare_at_price NUMERIC(12, 2),
    cost NUMERIC(12, 2) DEFAULT 0.00,
    inventory INTEGER DEFAULT 100 CHECK (inventory >= 0),
    category TEXT NOT NULL,
    subcategory TEXT,
    tags TEXT[] DEFAULT '{}',
    badges TEXT[] DEFAULT '{}',
    brand TEXT DEFAULT 'HARCONXS',
    product_type TEXT DEFAULT 'physical', -- 'physical', 'personalized', 'digital', 'custom_service'
    images TEXT[] NOT NULL DEFAULT '{}',
    rating NUMERIC(3, 2) DEFAULT 5.00 CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER DEFAULT 0,
    is_personalizable BOOLEAN DEFAULT false,
    personalization_fields JSONB,
    weight TEXT,
    dimensions TEXT,
    download_url TEXT,
    featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER set_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS public.product_variants (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    sku TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    size TEXT,
    color TEXT,
    material TEXT,
    price NUMERIC(12, 2) NOT NULL,
    compare_at_price NUMERIC(12, 2),
    cost NUMERIC(12, 2) DEFAULT 0.00,
    inventory INTEGER DEFAULT 50 CHECK (inventory >= 0),
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.packaging_options (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(12, 2) DEFAULT 0.00,
    image TEXT,
    is_popular BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 5. SUPPLIERS, WAREHOUSES & INVENTORY MOVEMENTS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.suppliers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    lead_time_days INTEGER DEFAULT 7,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id TEXT REFERENCES public.product_variants(id) ON DELETE SET NULL,
    change_type TEXT NOT NULL, -- 'restock', 'order_sale', 'damaged', 'adjustment', 'return'
    quantity_changed INTEGER NOT NULL,
    new_inventory_count INTEGER NOT NULL,
    reference_id TEXT, -- e.g. order_id
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 6. CARTS & ACTIVE SESSIONS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.carts (
    id TEXT PRIMARY KEY, -- e.g. user UUID or anonymous cart token
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'active', -- 'active', 'converted', 'abandoned'
    coupon_code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cart_items (
    id TEXT PRIMARY KEY,
    cart_id TEXT NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id TEXT REFERENCES public.product_variants(id) ON DELETE SET NULL,
    packaging_id TEXT REFERENCES public.packaging_options(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    custom_price NUMERIC(12, 2),
    personalization_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.wishlist_items (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, product_id)
);

-- ==============================================================================
-- 7. ORDERS, ITEMS, ADDRESSES & LOGISTICS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    customer_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
    discount NUMERIC(12, 2) DEFAULT 0.00,
    packaging_fee NUMERIC(12, 2) DEFAULT 0.00,
    shipping_fee NUMERIC(12, 2) DEFAULT 0.00,
    tax NUMERIC(12, 2) DEFAULT 0.00,
    total NUMERIC(12, 2) NOT NULL CHECK (total >= 0),
    currency TEXT DEFAULT 'INR',
    status TEXT NOT NULL DEFAULT 'Paid',
    payment_method TEXT NOT NULL DEFAULT 'card',
    payment_status TEXT NOT NULL DEFAULT 'paid',
    shipping_address JSONB NOT NULL,
    tracking_number TEXT,
    carrier TEXT DEFAULT 'BlueDart Express',
    tracking_url TEXT,
    gift_note TEXT,
    delivery_date TEXT,
    timeline JSONB DEFAULT '[]'::jsonb,
    risk_level TEXT DEFAULT 'LOW',
    raw_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER set_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price NUMERIC(12, 2) NOT NULL,
    variant_info JSONB,
    packaging_info JSONB,
    personalization_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_tracking_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 8. PAYMENTS, BILLING INVOICES & REFUNDS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.billing_invoices (
    id TEXT PRIMARY KEY,
    invoice_number TEXT UNIQUE NOT NULL,
    transaction_id TEXT NOT NULL,
    order_id TEXT REFERENCES public.orders(id) ON DELETE SET NULL,
    order_number TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    payment_method TEXT NOT NULL,
    payment_gateway TEXT DEFAULT 'Razorpay PG',
    status TEXT DEFAULT 'Paid',
    gst_number TEXT,
    cgst NUMERIC(12, 2) DEFAULT 0.00,
    sgst NUMERIC(12, 2) DEFAULT 0.00,
    items_summary TEXT,
    receipt_url TEXT,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.refunds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'processed', 'rejected'
    processed_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 9. CUSTOM BESPOKE ORDERS, QUOTES & ATELIER CHAT
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.custom_orders (
    id TEXT PRIMARY KEY,
    request_number TEXT UNIQUE NOT NULL,
    customer_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    recipient TEXT,
    relationship TEXT,
    occasion TEXT,
    budget_range TEXT,
    product_type TEXT,
    description TEXT NOT NULL,
    preferred_colors TEXT[] DEFAULT '{}',
    preferred_style TEXT,
    uploaded_files TEXT[] DEFAULT '{}',
    selected_packaging_id TEXT,
    target_delivery_date TEXT,
    status TEXT NOT NULL DEFAULT 'Submitted',
    quote JSONB,
    messages JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER set_custom_orders_updated_at
BEFORE UPDATE ON public.custom_orders
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 10. REVIEWS & COMMUNITY RATINGS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    rating NUMERIC(2, 1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT NOT NULL,
    comment TEXT NOT NULL,
    verified BOOLEAN DEFAULT true,
    likes INTEGER DEFAULT 0,
    images TEXT[] DEFAULT '{}',
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 11. SUPPORT TICKETS & MESSAGING
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.support_tickets (
    id TEXT PRIMARY KEY,
    ticket_number TEXT UNIQUE NOT NULL,
    customer_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    category TEXT NOT NULL,
    priority TEXT DEFAULT 'medium',
    status TEXT DEFAULT 'Open',
    assigned_to TEXT,
    messages JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER set_support_tickets_updated_at
BEFORE UPDATE ON public.support_tickets
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 12. COUPLE WEBSITES & TEMPLATES
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.couple_website_templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    theme_category TEXT NOT NULL,
    description TEXT,
    price NUMERIC(12, 2) NOT NULL,
    preview_image TEXT NOT NULL,
    demo_subdomain TEXT,
    features TEXT[] DEFAULT '{}',
    popular BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.couple_websites (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    subdomain TEXT UNIQUE NOT NULL,
    template_id TEXT NOT NULL REFERENCES public.couple_website_templates(id) ON DELETE RESTRICT,
    partner1_name TEXT NOT NULL,
    partner2_name TEXT NOT NULL,
    anniversary_date TEXT,
    our_story_title TEXT,
    our_story_text TEXT,
    hero_tagline TEXT,
    primary_color TEXT DEFAULT '#f43f5e',
    font_style TEXT DEFAULT 'Playfair',
    music_track TEXT,
    photos TEXT[] DEFAULT '{}',
    memories JSONB DEFAULT '[]'::jsonb,
    guestbook JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'active',
    custom_domain TEXT,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER set_couple_websites_updated_at
BEFORE UPDATE ON public.couple_websites
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 13. BOT PANELS, SUBSCRIPTIONS & API MANAGEMENT
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.bot_panel_services (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    platform TEXT NOT NULL,
    short_desc TEXT,
    full_desc TEXT,
    icon TEXT,
    badge TEXT,
    plans JSONB NOT NULL DEFAULT '[]'::jsonb,
    screenshots TEXT[] DEFAULT '{}',
    demo_url TEXT,
    docs_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.bot_subscriptions (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    service_id TEXT REFERENCES public.bot_panel_services(id) ON DELETE SET NULL,
    plan_id TEXT NOT NULL,
    status TEXT DEFAULT 'active', -- 'active', 'past_due', 'canceled'
    billing_period TEXT DEFAULT 'monthly',
    current_period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 13. INTERNAL API INFRASTRUCTURE (CLIENTS, SCOPES, HASHED KEYS & TELEMETRY)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.api_clients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    client_code TEXT UNIQUE NOT NULL, -- 'HARCONXS-WEB', 'HARCONXS-TELEGRAM', 'HARCONXS-DISCORD', 'HARCONXS-WORDPRESS', 'HARCONXS-ADMIN'
    client_type TEXT NOT NULL DEFAULT 'internal_bot', -- 'internal_bot', 'internal_app', 'admin_cli'
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    rate_limit_per_minute INTEGER DEFAULT 120,
    default_scopes TEXT[] DEFAULT '{"products:read", "faq:read", "chat:use"}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.api_key_scopes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL
);

INSERT INTO public.api_key_scopes (id, name, description, category) VALUES
('products:read', 'Read Products Catalog', 'Query products, variants, categories and live inventory', 'Catalog'),
('orders:read', 'Read Order Status & Tracking', 'Query order tracking milestones and delivery updates', 'Orders'),
('support:read', 'Read Support Tickets', 'Access customer support threads and knowledge tickets', 'Support & Chat'),
('support:write', 'Create Support Tickets & Replies', 'Submit customer tickets and bot response messages', 'Support & Chat'),
('chat:use', 'Access AI Support Intelligence', 'Send messages to HARCONXS grounded AI support engine', 'Support & Chat'),
('custom_orders:read', 'Read Custom Order Statuses', 'Query bespoke atelier custom order briefs and design proofs', 'Custom'),
('custom_orders:write', 'Submit Custom Order Briefs', 'Create custom gifting requests and attach references', 'Custom'),
('faq:read', 'Read Knowledge Base & Policies', 'Retrieve store FAQs, refund policy and shipping tariffs', 'Knowledge'),
('couple_websites:read', 'Read Couple Websites', 'Query romantic couple sanctuary templates and active projects', 'Knowledge'),
('bot_services:read', 'Read Bot Panel Catalog', 'Query available Telegram, Discord, and WordPress bot panel tiers', 'Knowledge'),
('admin:all', 'Root Administrative Access', 'Full internal unrestricted scope for administrative tooling', 'System')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.api_clients (id, name, client_code, client_type, description, is_active, rate_limit_per_minute, default_scopes) VALUES
('client_web', 'HARCONXS Web Platform', 'HARCONXS-WEB', 'internal_app', 'Official HARCONXS Web Storefront Client & Embedded AI Assistant', true, 180, '{"products:read", "orders:read", "support:read", "support:write", "chat:use", "custom_orders:read", "custom_orders:write", "faq:read", "couple_websites:read", "bot_services:read"}'),
('client_telegram', 'HARCONXS Telegram Support Bot', 'HARCONXS-TELEGRAM', 'internal_bot', 'Official Telegram Bot for Customer Inquiries, Order Tracking & Custom Gifting', true, 90, '{"products:read", "orders:read", "support:write", "chat:use", "custom_orders:read", "faq:read"}'),
('client_discord', 'HARCONXS Discord Community Bot', 'HARCONXS-DISCORD', 'internal_bot', 'Official Discord Bot for Community Support, VIP Drops & Atelier Updates', true, 90, '{"products:read", "orders:read", "support:write", "chat:use", "faq:read"}'),
('client_wordpress', 'HARCONXS WordPress Bridge Plugin', 'HARCONXS-WORDPRESS', 'internal_app', 'Official WordPress / WooCommerce Catalog Sync & Support Widget', true, 120, '{"products:read", "faq:read", "chat:use"}'),
('client_admin', 'HARCONXS Admin Internal CLI', 'HARCONXS-ADMIN', 'admin_cli', 'Master Administrative CLI & Automated Worker Tools', true, 300, '{"admin:all", "products:read", "orders:read", "support:read", "support:write", "chat:use", "custom_orders:read", "custom_orders:write", "faq:read"}')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.api_keys (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL REFERENCES public.api_clients(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    client_name TEXT NOT NULL,
    name TEXT NOT NULL,
    key_prefix TEXT NOT NULL, -- e.g. hx_live_tg_8f93... (first 14 chars for safe identification)
    key_hash TEXT NOT NULL UNIQUE, -- SHA-256 hash of secret key (never stored plaintext)
    scopes JSONB NOT NULL DEFAULT '["products:read", "faq:read", "chat:use"]'::jsonb,
    rate_limit INTEGER DEFAULT 120,
    usage_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired')),
    expires_at TIMESTAMP WITH TIME ZONE,
    last_used_at TIMESTAMP WITH TIME ZONE,
    last_ip TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    revoked_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.api_key_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id TEXT NOT NULL,
    key_id TEXT REFERENCES public.api_keys(id) ON DELETE SET NULL,
    client_id TEXT REFERENCES public.api_clients(id) ON DELETE SET NULL,
    client_name TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    method TEXT NOT NULL,
    status_code INTEGER NOT NULL,
    response_time_ms NUMERIC(8, 2) NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    scopes_used TEXT[],
    error_message TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 14. MARKETING: COUPONS, AFFILIATES, DISCOUNTS & LOYALTY
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.coupons (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL, -- 'percentage', 'fixed', 'free_shipping'
    value NUMERIC(12, 2) NOT NULL,
    min_order_value NUMERIC(12, 2) DEFAULT 0.00,
    max_usage INTEGER,
    current_usage INTEGER DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.affiliates (
    id TEXT PRIMARY KEY,
    user_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    referral_code TEXT UNIQUE NOT NULL,
    referral_link TEXT NOT NULL,
    commission_rate NUMERIC(5, 2) DEFAULT 10.00,
    clicks INTEGER DEFAULT 0,
    orders_count INTEGER DEFAULT 0,
    total_revenue NUMERIC(12, 2) DEFAULT 0.00,
    total_commission NUMERIC(12, 2) DEFAULT 0.00,
    pending_payout NUMERIC(12, 2) DEFAULT 0.00,
    paid_payout NUMERIC(12, 2) DEFAULT 0.00,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.loyalty_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    points_delta INTEGER NOT NULL,
    reason TEXT NOT NULL,
    reference_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 15. NOTIFICATIONS & EMAIL AUDIT DISPATCH LOGS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.email_logs (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    recipient_email TEXT NOT NULL,
    recipient_name TEXT NOT NULL,
    subject TEXT NOT NULL,
    preview_snippet TEXT,
    html_content TEXT NOT NULL,
    status TEXT DEFAULT 'delivered',
    order_number TEXT,
    tracking_number TEXT,
    carrier TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 16. LEGAL POLICIES & VERSIONING
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.policies (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    version TEXT NOT NULL DEFAULT '1.0',
    content TEXT NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.policy_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_id TEXT NOT NULL REFERENCES public.policies(id) ON DELETE CASCADE,
    version TEXT NOT NULL,
    content TEXT NOT NULL,
    changed_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 17. KNOWLEDGE BASE, CATEGORIES & FAQ MATRIX
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.knowledge_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT DEFAULT 'HelpCircle',
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.knowledge_articles (
    id TEXT PRIMARY KEY,
    category_id TEXT NOT NULL REFERENCES public.knowledge_categories(id) ON DELETE CASCADE,
    category_name TEXT,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    summary TEXT,
    content TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    views INTEGER DEFAULT 0,
    helpful_votes INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.faq_items (
    id TEXT PRIMARY KEY,
    category_id TEXT NOT NULL REFERENCES public.knowledge_categories(id) ON DELETE CASCADE,
    category_name TEXT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    order_index INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 18. ANALYTICS, AUDIT LOGS & ADMIN ACTIVITY
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name TEXT NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    anonymous_id TEXT,
    properties JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id TEXT NOT NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    old_value JSONB,
    new_value JSONB,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 18. STORE THEME CONFIG & SITE SETTINGS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 18B. PRIVATE WEBSITE EDITOR: PAGES, PAGE SECTIONS & REVISIONS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.pages (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    meta JSONB DEFAULT '{"description": "", "keywords": "", "ogImage": ""}'::jsonb,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.page_sections (
    id TEXT PRIMARY KEY,
    page_id TEXT NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
    section_type TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_hidden BOOLEAN NOT NULL DEFAULT false,
    settings_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    content_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.page_revisions (
    id TEXT PRIMARY KEY,
    page_id TEXT NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    revision_name TEXT NOT NULL,
    snapshot_data JSONB NOT NULL,
    created_by TEXT DEFAULT 'HARCONXS Super Administrator',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER set_pages_updated_at
BEFORE UPDATE ON public.pages
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_page_sections_updated_at
BEFORE UPDATE ON public.page_sections
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 19. INDEXES FOR LIGHTNING FAST QUERY PERFORMANCE
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured);

CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_tracking_number ON public.orders(tracking_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_custom_orders_request_number ON public.custom_orders(request_number);
CREATE INDEX IF NOT EXISTS idx_custom_orders_customer_id ON public.custom_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_custom_orders_status ON public.custom_orders(status);

CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_customer_id ON public.support_tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON public.support_tickets(status);

CREATE INDEX IF NOT EXISTS idx_couple_websites_subdomain ON public.couple_websites(subdomain);
CREATE INDEX IF NOT EXISTS idx_couple_websites_customer_id ON public.couple_websites(customer_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_client_id ON public.api_keys(client_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON public.api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON public.api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON public.email_logs(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_order_number ON public.email_logs(order_number);
CREATE INDEX IF NOT EXISTS idx_analytics_events_name ON public.analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON public.audit_logs(resource_type, resource_id);

CREATE INDEX IF NOT EXISTS idx_knowledge_articles_category ON public.knowledge_articles(category_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_articles_slug ON public.knowledge_articles(slug);
CREATE INDEX IF NOT EXISTS idx_faq_items_category ON public.faq_items(category_id);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON public.pages(slug);
CREATE INDEX IF NOT EXISTS idx_page_sections_page_id ON public.page_sections(page_id);
CREATE INDEX IF NOT EXISTS idx_page_sections_sort_order ON public.page_sections(sort_order);
CREATE INDEX IF NOT EXISTS idx_page_revisions_page_id ON public.page_revisions(page_id);

-- ==============================================================================
-- 20. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packaging_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.couple_website_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.couple_websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_panel_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ PERMISSIONS (Catalog, Templates, Policies, Active Packaging, Knowledge Base)
CREATE POLICY "Public Read: Products" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read: Variants" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "Public Read: Categories" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read: Packaging" ON public.packaging_options FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read: Couple Templates" ON public.couple_website_templates FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read: Bot Panels" ON public.bot_panel_services FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read: Approved Reviews" ON public.reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Public Read: Policies" ON public.policies FOR SELECT USING (true);
CREATE POLICY "Public Read: Active Coupons" ON public.coupons FOR SELECT USING (active = true);
CREATE POLICY "Public Read: Active Couple Websites" ON public.couple_websites FOR SELECT USING (status = 'active');
CREATE POLICY "Public Read: Site Settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public Read: Pages (Published)" ON public.pages FOR SELECT USING (status = 'published');
CREATE POLICY "Public Read: Page Sections (Published)" ON public.page_sections FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.pages WHERE pages.id = page_sections.page_id AND pages.status = 'published')
);
CREATE POLICY "Admin Full Access: Pages" ON public.pages FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admin Full Access: Page Sections" ON public.page_sections FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admin Full Access: Page Revisions" ON public.page_revisions FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Public Read: Knowledge Categories" ON public.knowledge_categories FOR SELECT USING (true);
CREATE POLICY "Public Read: Knowledge Articles" ON public.knowledge_articles FOR SELECT USING (true);
CREATE POLICY "Public Read: FAQ Items" ON public.faq_items FOR SELECT USING (true);

-- USER RESTRICTED PERMISSIONS (Profiles, Carts, Orders, Custom Orders, Tickets, API Keys)
CREATE POLICY "Users: Manage Own Profile" ON public.profiles FOR ALL 
    USING (auth.uid() = id) 
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users: View Own Orders" ON public.orders FOR SELECT 
    USING (auth.uid()::text = customer_id OR customer_email = auth.jwt() ->> 'email');

CREATE POLICY "Users: Insert Own Orders" ON public.orders FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Users: View Own Order Items" ON public.order_items FOR SELECT 
    USING (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND (orders.customer_id = auth.uid()::text OR orders.customer_email = auth.jwt() ->> 'email')));

CREATE POLICY "Users: View Own Invoices" ON public.billing_invoices FOR SELECT 
    USING (customer_email = auth.jwt() ->> 'email');

CREATE POLICY "Users: Manage Own Custom Orders" ON public.custom_orders FOR ALL 
    USING (customer_id = auth.uid()::text OR customer_email = auth.jwt() ->> 'email')
    WITH CHECK (customer_id = auth.uid()::text OR customer_email = auth.jwt() ->> 'email');

CREATE POLICY "Users: Manage Own Tickets" ON public.support_tickets FOR ALL 
    USING (customer_id = auth.uid()::text OR customer_email = auth.jwt() ->> 'email')
    WITH CHECK (customer_id = auth.uid()::text OR customer_email = auth.jwt() ->> 'email');

CREATE POLICY "Users: Manage Own Couple Websites" ON public.couple_websites FOR ALL 
    USING (customer_id = auth.uid()::text)
    WITH CHECK (customer_id = auth.uid()::text);

CREATE POLICY "Users: Manage Own API Keys" ON public.api_keys FOR ALL 
    USING (user_id = auth.uid() OR public.is_admin(auth.uid()))
    WITH CHECK (user_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Users: View Own Email Logs" ON public.email_logs FOR SELECT 
    USING (recipient_email = auth.jwt() ->> 'email');

CREATE POLICY "Users: Insert Reviews" ON public.reviews FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Public: Insert Analytics" ON public.analytics_events FOR INSERT 
    WITH CHECK (true);

-- SEED ESSENTIAL SYSTEM ROLES
INSERT INTO public.roles (id, name, description) VALUES 
('super_admin', 'Super Administrator', 'Full unconstrained platform control'),
('manager', 'Store Manager', 'Orders, inventory, customer management'),
('support_agent', 'Support Agent', 'Live chat, tickets and customer inquiry desk'),
('customer', 'Customer', 'Verified store customer and member')
ON CONFLICT (id) DO NOTHING;

-- SEED SYSTEM POLICIES
INSERT INTO public.policies (id, title, slug, version, content) VALUES
('pol-privacy', 'Privacy Policy', 'privacy', '2.4', 'HARCONXS Atelier complies with international privacy frameworks. We safeguard personal engraving details and payment security.'),
('pol-terms', 'Terms of Service', 'terms', '2.4', 'All bespoke laser customizations and digital sanctuary deployments are subject to our verified quality atelier guidelines.'),
('pol-refund', 'Refund & Returns Policy', 'refund', '2.4', 'Personalized laser-engraved items are created uniquely for you. Replacements are guaranteed if transit damage occurs.'),
('pol-shipping', 'Shipping & Delivery Policy', 'shipping', '2.4', 'Orders ship via priority logistics partners (BlueDart Express, Delhivery) across India within 2-4 business days.')
ON CONFLICT (id) DO NOTHING;

-- SEED KNOWLEDGE CATEGORIES
INSERT INTO public.knowledge_categories (id, name, slug, description, icon, display_order) VALUES
('kc-shipping', 'Shipping & Delivery', 'shipping-delivery', 'Dispatch timelines, domestic & worldwide courier partners, real-time live tracking, and tamper-proof insured packaging.', 'Truck', 1),
('kc-returns', 'Returns & Refunds', 'returns-refunds', '30-day money-back guarantee, non-customized product returns, damaged in transit replacements, and refund methods.', 'RotateCcw', 2),
('kc-custom', 'Custom & Personalized Orders', 'custom-orders', 'Laser engraving specs, 3D brief submission, custom quotation #CO workflows, design approvals, and master jewelers.', 'Sparkles', 3),
('kc-couple-sites', 'Couple Websites & Sanctuaries', 'couple-websites', 'Subdomains, anniversary live countdown timers, multimedia galleries, background audio tracks, guestbook moderation, and custom domains.', 'Heart', 4),
('kc-bots', 'Bot Panels & Digital Infrastructure', 'bot-panels', 'Telegram VIP gateways, Discord bot moderation dashboards, WhatsApp CRM automation, API rate limits, and private billing portals.', 'Bot', 5),
('kc-payments', 'Payments & Store Credit', 'payments-billing', 'UPI, Credit/Debit cards, NetBanking, Razorpay PG, Cashfree, GST invoices, discount promo codes, and loyalty reward redemption.', 'CreditCard', 6)
ON CONFLICT (id) DO NOTHING;

-- SEED KNOWLEDGE ARTICLES
INSERT INTO public.knowledge_articles (id, category_id, category_name, slug, title, summary, content, tags, views, helpful_votes, is_featured) VALUES
('ka-1', 'kc-shipping', 'Shipping & Delivery', 'delivery-times-and-rates', 'Standard and Express Delivery Timelines', 'Standard delivery takes 3-5 business days across domestic metros. Express courier arrives in 1-2 business days with full GPS tracking.', 'All HARCONXS orders are securely packed and dispatched from our primary fulfillment centers within 24 to 48 hours. Metro Cities: 2 to 4 business days. Express Guaranteed: 24 to 48 hours. Free shipping on orders over ₹1,500 ($50 USD).', ARRAY['shipping', 'delivery', 'tracking', 'express', 'free shipping'], 3420, 288, true),
('ka-2', 'kc-returns', 'Returns & Refunds', 'returns-and-refund-policy', '30-Day Return Window and Damaged Replacement Guarantee', 'Non-customized physical products are eligible for a 30-day hassle-free return. Personalized laser-engraved items are protected with a free replacement if defective or damaged.', 'Physical ready-made items can be returned within 30 days. Custom personalized creations damaged in transit or with transcription flaws receive a free immediate replacement or store credit.', ARRAY['returns', 'refunds', 'replacement', 'warranty', 'money back'], 2910, 215, true),
('ka-3', 'kc-custom', 'Custom & Personalized Orders', 'custom-brief-workflow', 'Submitting a Bespoke Brief (#CO) and 3D CAD Approval', 'Learn how to submit custom requests, receive fixed quotes, review 3D renders, and work with master jewelers.', 'Submit your vision with reference photos and vector specifications. Our atelier calculates a fixed quote (#CO) with a 3D proof within 24 hours. Once approved, fabrication commences.', ARRAY['custom', 'bespoke', 'brief', '3D proof', 'quote'], 1840, 162, true)
ON CONFLICT (id) DO NOTHING;

-- SEED FAQ ITEMS
INSERT INTO public.faq_items (id, category_id, category_name, question, answer, tags, order_index, is_featured) VALUES
('faq-1', 'kc-custom', 'Custom & Personalized Orders', 'How long does custom laser engraving take?', 'Custom laser engraving undergoes precision vector calibration within 24 to 48 business hours before packaging and dispatch.', ARRAY['engraving', 'custom', 'production time'], 1, true),
('faq-2', 'kc-shipping', 'Shipping & Delivery', 'What is the shipping timeframe and cost?', 'Standard shipping is free on orders above ₹1,500 ($50 USD). Priority couriers (BlueDart Express, Delhivery) deliver in 2-4 business days.', ARRAY['shipping', 'rates', 'free delivery'], 2, true),
('faq-3', 'kc-returns', 'Returns & Refunds', 'What is your policy on personalized item returns?', 'Because personalized pieces are crafted uniquely to your specifications, they cannot be returned for remorse. However, if transit damage or engraving transcription defects occur, we craft and ship a free replacement immediately.', ARRAY['returns', 'refunds', 'damage guarantee'], 3, true),
('faq-4', 'kc-couple-sites', 'Couple Websites & Sanctuaries', 'How do Couple Sanctuaries and subdomains work?', 'Upon selecting a template, your personalized sanctuary is provisioned on a dedicated subdomain (e.g. alex-and-sarah.harconxsshop.com) with live anniversary counters, photo galleries, background music, and a private customer dashboard.', ARRAY['couple website', 'sanctuary', 'subdomain', 'anniversary'], 4, true),
('faq-5', 'kc-bots', 'Bot Panels & Digital Infrastructure', 'What bot panel services and API access are provided?', 'We provide turnkey bot panel platforms for Telegram VIP access, Discord server moderation, WhatsApp business CRM, and RESTful API developer tokens with sub-50ms latency.', ARRAY['bot panels', 'telegram', 'discord', 'api'], 5, true)
ON CONFLICT (id) DO NOTHING;

