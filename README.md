# HARCONXS — Luxury Jewelry Atelier & Digital Ecosystem

> **HARCONXS** is an enterprise-grade luxury e-commerce platform, bespoke commission atelier (#CO), couple digital sanctuary generator, and bot panel infrastructure designed for global patrons.

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Ready-black?style=flat&logo=vercel)](https://vercel.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%26%20Auth-3ECF8E?style=flat&logo=supabase)](https://supabase.com)

---

## 🏛️ Architecture Overview

- **Frontend Core**: React 18 + Vite SPA with high-contrast luxury typography, fluid motion transitions, responsive mobile cards, and zero layout shift.
- **Backend & Serverless Engine**: Express API router (`/src/server/apiRouter.ts` + `/api/index.ts`) optimized for Vercel Serverless Functions and Node.js containers.
- **Database & Auth**: PostgreSQL 15+ hosted on Supabase with Row Level Security (RLS), ACID transaction support, and trigger-based audit logging.
- **Artificial Intelligence**: Google Gemini API integration for artisan assistant recommendations, policy drafting, and live concierge support.
- **Payment & Invoicing**: Unified checkout supporting Razorpay (UPI, Netbanking, Cards, EMI), Cashfree, Stripe, and automated GST/VAT tax invoice generation.
- **Logistics**: Deep carrier tracking integration with BlueDart, Delhivery, and Shiprocket with real-time waypoint milestones and customer notifications.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js 18+ or 20+
- npm, pnpm, or bun

### 2. Clone & Install
```bash
# Clone the repository
git clone https://github.com/harconxs/harconxs-atelier.git
cd harconxs-atelier

# Install dependencies
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your Supabase credentials, Google Gemini API key, and payment gateway keys. (See [`.env.example`](./.env.example) for documentation).

### 4. Initialize Database
Run the complete SQL schema from [`supabase-schema.sql`](./supabase-schema.sql) in your Supabase SQL Editor.

### 5. Run Development Server
```bash
# Start local server on http://localhost:3000
npm run dev
```

### 6. Build for Production
```bash
npm run build
npm run lint
```

---

## 🌐 Production Deployment on Vercel

HARCONXS is fully prepared for one-click deployment to Vercel:

1. Push code to your Git repository (GitHub / GitLab / Bitbucket).
2. Import project in the [Vercel Dashboard](https://vercel.com/new).
3. Set **Framework Preset** to `Vite`.
4. Configure the environment variables from `.env.example` in **Project Settings > Environment Variables**.
5. Click **Deploy**. Vercel will automatically build the static bundle and provision the `/api` serverless routing defined in [`vercel.json`](./vercel.json).

For detailed steps, custom domains, and headers, see [Deployment Guide](./docs/DEPLOYMENT.md).

---

## 📚 Technical Documentation

- 🚀 [**Production Deployment Guide**](./docs/DEPLOYMENT.md) — Vercel, Node, Docker, Headers & DNS.
- 🗄️ [**Supabase Setup & Migrations**](./docs/SUPABASE_SETUP.md) — Schema, RLS policies, Auth triggers, and storage buckets.
- 🔌 [**REST API Documentation**](./docs/API_DOCUMENTATION.md) — Endpoints, authentication, rate limits, and webhooks.
- 💳 [**Billing & Payment Integration**](./docs/BILLING_INTEGRATION.md) — Razorpay, Cashfree, Stripe, UPI QR, and GST compliance.

---

## 🛡️ Security & Privacy
- **Row Level Security (RLS)**: Enforced across all 28 tables.
- **Server Secret Isolation**: Private API keys and gateway secrets remain on the server and are never exposed to browser bundles.
- **Strict Headers**: HSTS, CSP, X-Frame-Options (`SAMEORIGIN`), X-Content-Type-Options (`nosniff`), and Permissions-Policy configured in `vercel.json`.

---

## ⚖️ License & Proprietary Rights
© 2026 HARCONXS Atelier. All rights reserved.
