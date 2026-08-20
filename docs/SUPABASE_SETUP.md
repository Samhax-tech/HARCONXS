# HARCONXS — Supabase PostgreSQL & Auth Setup Guide

This guide walks through setting up the complete database schema, Row-Level Security (RLS) policies, triggers, and storage buckets for HARCONXS.

---

## 1. Create a Supabase Project

1. Sign in to [Supabase](https://app.supabase.com).
2. Click **New Project** and name it `harconxs-production`.
3. Choose a region closest to your primary customer base (e.g. `ap-south-1` Mumbai or `us-east-1`).
4. Note your **Project URL** and **API Keys** from **Project Settings > API**:
   - `anon` `public` key $\rightarrow$ `VITE_SUPABASE_ANON_KEY`
   - `service_role` `secret` key $\rightarrow$ `SUPABASE_SERVICE_ROLE_KEY`
   - `Project URL` $\rightarrow$ `VITE_SUPABASE_URL`

---

## 2. Execute the Database Migration Schema

HARCONXS includes a unified, production-tested SQL schema file in the repository root: [`supabase-schema.sql`](../supabase-schema.sql).

### Steps:
1. In the Supabase Dashboard, open the **SQL Editor** tab.
2. Click **New Query**.
3. Copy the entire contents of [`supabase-schema.sql`](../supabase-schema.sql) and paste it into the editor.
4. Click **Run**.

### Key Components Created:
- **Core Extensions**: `uuid-ossp`, `pgcrypto`.
- **RBAC Matrix**: `roles`, `permissions`, `role_permissions`.
- **Profiles & Auth Trigger**: Automatic user sync on `auth.users` creation with welcome loyalty points (150 pts).
- **Commerce & Catalog**: `products`, `product_variants`, `packaging_options`, `categories`, `carts`, `cart_items`, `orders`, `order_items`, `order_tracking_events`, `billing_invoices`.
- **Bespoke Atelier**: `custom_orders` (#CO workflow, vector uploads, quotation approvals, artisan CAD notes).
- **Couple Sanctuaries**: `couple_website_templates`, `couple_websites`.
- **Digital Infrastructure**: `bot_panel_services`, `bot_subscriptions`, `api_keys`.
- **CMS & Page Studio**: `pages`, `page_sections`, `page_revisions`.
- **Customer Care**: `reviews`, `support_tickets`, `knowledge_categories`, `knowledge_articles`, `faq_items`.
- **Audit & Email**: `email_logs`, `audit_logs`, `analytics_events`.

---

## 3. Row-Level Security (RLS) Verification

All tables have RLS enabled with granular isolation:
- **Public Tables**: `products`, `categories`, `packaging_options`, `couple_website_templates`, `reviews (approved)`, `policies`, `knowledge_articles`, `faq_items` allow `SELECT` for all users.
- **User Isolated Tables**: `profiles`, `orders`, `custom_orders`, `support_tickets`, `couple_websites`, `api_keys` allow access only if `auth.uid() = customer_id` or `auth.jwt() ->> 'email' = customer_email`.
- **Admin Access**: Super Administrators and Managers (verified via `public.is_admin(auth.uid())`) receive full access to modify all records and page content.

---

## 4. Supabase Storage Buckets

Navigate to **Storage** in the Supabase Dashboard and create the following buckets:

| Bucket Name | Visibility | Allowed MIME Types | Max Size |
|---|---|---|---|
| `product-media` | **Public** | `image/jpeg, image/png, image/webp, image/svg+xml` | 10 MB |
| `custom-order-assets` | **Private** | `image/*, application/pdf, .dxf, .svg, .ai, .step` | 50 MB |
| `couple-galleries` | **Public** | `image/jpeg, image/png, image/webp, audio/mpeg` | 25 MB |
| `invoices-pdf` | **Private** | `application/pdf` | 10 MB |

### Storage Security Policies:
In **Storage > Policies**, add:
- `product-media`: Allow public read access to all objects.
- `custom-order-assets`: Allow authenticated users to upload and read only files within their user ID folder (`auth.uid() = (storage.foldername(name))[1]`).

---

## 5. Seed Super Administrator Account

To grant your primary account Super Admin access:
```sql
UPDATE public.profiles
SET role = 'super_admin'
WHERE email = 'your-admin-email@harconxs.com';
```
This unlocks access to the `/admin` dashboard and the `/edit-page` Visual Page Studio.
