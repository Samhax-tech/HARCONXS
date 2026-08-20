# HARCONXS — Production Deployment Guide (Vercel & Cloud Run)

This document provides complete instructions for deploying HARCONXS to **Vercel** as well as standalone Node.js and Docker environments.

---

## 1. Vercel Deployment (Recommended)

### Automatic Git Integration
1. Push your codebase to GitHub, GitLab, or Bitbucket.
2. In [Vercel Dashboard](https://vercel.com/dashboard), click **Add New... > Project**.
3. Select your repository and import it.
4. **Project Settings**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. **Environment Variables**: Add all required variables from `.env.example` (see section below).
6. Click **Deploy**.

### Routing Architecture on Vercel
Vercel reads [`vercel.json`](../vercel.json):
- **Serverless API**: Requests matching `/api/(.*)`, `/sitemap.xml`, `/robots.txt`, and `/feeds/(.*)` are routed to `/api/index.ts`.
- **SPA Fallback**: All client-side storefront paths (`/shop`, `/product/:slug`, `/checkout`, `/admin`, etc.) route cleanly to `index.html`.
- **Security Headers**: Injected automatically by Vercel's edge network:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: SAMEORIGIN`
  - `X-XSS-Protection: 1; mode=block`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`

---

## 2. Environment Variables Checklist for Vercel

Ensure the following variables are configured under **Vercel Project Settings > Environment Variables**:

| Variable Name | Required | Description | Example / Format |
|---|---|---|---|
| `VITE_SITE_URL` | Yes | Canonical domain of the storefront | `https://harconxs.com` |
| `VITE_SUPABASE_URL` | Yes | Supabase project endpoint | `https://xxxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Yes | Public Supabase anon key | `eyJhbGciOiJIUz...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-only Supabase admin key | `eyJhbGciOiJIUz...` |
| `GEMINI_API_KEY` | Yes | Google AI Studio key for concierge & assistant | `AIzaSy...` |
| `HARCONXS_API_KEY` | Optional | Internal microservices API key | `hx_live_sec_...` |
| `VITE_RAZORPAY_KEY_ID` | Optional | Razorpay public key ID | `rzp_live_...` |
| `RAZORPAY_KEY_SECRET` | Optional | Razorpay server secret | `rzp_sec_...` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Optional | Stripe public key | `pk_live_...` |
| `STRIPE_SECRET_KEY` | Optional | Stripe server secret key | `sk_live_...` |
| `RESEND_API_KEY` | Optional | Resend transactional email key | `re_...` |
| `NOTIFICATION_FROM_EMAIL` | Optional | From email address | `concierge@harconxs.com` |

---

## 3. Custom Domain & DNS Setup

To attach your custom apex and subdomain (e.g. `harconxs.com` and `www.harconxs.com`):
1. In Vercel, navigate to **Settings > Domains**.
2. Add `harconxs.com` and `www.harconxs.com`.
3. Update your DNS registrar (Cloudflare, GoDaddy, Namecheap, Route53):
   - **A Record**: `@` $\rightarrow$ `76.76.21.21`
   - **CNAME Record**: `www` $\rightarrow$ `cname.vercel-dns.com`
4. Vercel provisions SSL certificates via Let's Encrypt automatically.

---

## 4. Verification Post-Deployment

Run these checks after deploying:
1. **Storefront & Catalog**: Visit `https://your-domain.com/shop` and verify products load.
2. **SEO Feeds**:
   - `https://your-domain.com/sitemap.xml` $\rightarrow$ returns valid XML sitemap.
   - `https://your-domain.com/robots.txt` $\rightarrow$ returns compliant robots indexing rules.
   - `https://your-domain.com/feeds/google-merchant.xml` $\rightarrow$ returns Google Merchant RSS XML.
3. **Authentication**: Test login / registration using Supabase Auth.
4. **Checkout**: Place a test order to verify payment redirection and email confirmation dispatch.
5. **404 Handling**: Visit `https://your-domain.com/non-existent-path` to verify the branded 404 page.
