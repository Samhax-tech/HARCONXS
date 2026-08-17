-- ==============================================================================
-- HARCONXS SHOP & ATELIER — SUPABASE POSTGRESQL DATABASE SCHEMA
-- Version: 2.4 (Production Architecture)
-- Compatible with Supabase Database, Auth, and Row-Level Security (RLS)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES & USERS TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    loyalty_points INTEGER DEFAULT 150,
    store_credit NUMERIC(10, 2) DEFAULT 0.00,
    is_affiliate BOOLEAN DEFAULT false,
    affiliate_code TEXT UNIQUE,
    affiliate_commission_earned NUMERIC(10, 2) DEFAULT 0.00,
    addresses JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    sku TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_description TEXT,
    full_description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    compare_at_price NUMERIC(10, 2),
    cost NUMERIC(10, 2) DEFAULT 0.00,
    inventory INTEGER DEFAULT 100,
    category TEXT NOT NULL,
    subcategory TEXT,
    tags TEXT[] DEFAULT '{}',
    badges TEXT[] DEFAULT '{}',
    brand TEXT DEFAULT 'HARCONXS',
    product_type TEXT DEFAULT 'physical',
    images TEXT[] NOT NULL,
    variants JSONB DEFAULT '[]'::jsonb,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    review_count INTEGER DEFAULT 0,
    is_personalizable BOOLEAN DEFAULT false,
    personalization_fields JSONB,
    weight TEXT,
    dimensions TEXT,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    customer_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    subtotal NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) DEFAULT 0.00,
    packaging_fee NUMERIC(10, 2) DEFAULT 0.00,
    shipping_fee NUMERIC(10, 2) DEFAULT 0.00,
    tax NUMERIC(10, 2) DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT NOT NULL DEFAULT 'Paid',
    payment_method TEXT NOT NULL DEFAULT 'card',
    payment_status TEXT NOT NULL DEFAULT 'paid',
    shipping_address JSONB NOT NULL,
    tracking_number TEXT,
    carrier TEXT DEFAULT 'BlueDart Express',
    tracking_url TEXT,
    gift_note TEXT,
    timeline JSONB DEFAULT '[]'::jsonb,
    risk_level TEXT DEFAULT 'LOW',
    data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC(10, 2) NOT NULL,
    variant_info JSONB,
    packaging_info JSONB,
    personalization_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. ORDER TRACKING CHECKPOINTS
CREATE TABLE IF NOT EXISTS public.order_tracking_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. CUSTOM BESPOKE ORDERS
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
    uploaded_files TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'Submitted',
    quote JSONB,
    messages JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. COUPLE SANCTUARY WEBSITES
CREATE TABLE IF NOT EXISTS public.couple_websites (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    subdomain TEXT UNIQUE NOT NULL,
    template_id TEXT NOT NULL,
    partner1_name TEXT NOT NULL,
    partner2_name TEXT NOT NULL,
    anniversary_date TEXT,
    our_story_title TEXT,
    our_story_text TEXT,
    hero_tagline TEXT,
    primary_color TEXT DEFAULT '#f43f5e',
    font_style TEXT DEFAULT 'Playfair',
    photos TEXT[] DEFAULT '{}',
    memories JSONB DEFAULT '[]'::jsonb,
    guestbook JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'active',
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- 8. EMAIL NOTIFICATIONS & DISPATCH LOGS
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
    metadata JSONB,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. SUPPORT TICKETS
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
    messages JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.couple_websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Products are publicly readable
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public products are viewable by everyone." 
    ON public.products FOR SELECT USING (true);

-- Customers can view their own orders
CREATE POLICY "Users can view their own orders." 
    ON public.orders FOR SELECT 
    USING (auth.uid()::text = customer_id OR customer_email = auth.jwt() ->> 'email');

-- Customers can view their own email notifications
CREATE POLICY "Users can view their own email logs." 
    ON public.email_logs FOR SELECT 
    USING (recipient_email = auth.jwt() ->> 'email');

-- Indexes for lightning fast lookups
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_tracking_number ON public.orders(tracking_number);
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON public.email_logs(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_order_number ON public.email_logs(order_number);
