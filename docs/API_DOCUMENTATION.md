# HARCONXS — Developer API Reference (v1.4.0)

HARCONXS provides a high-performance RESTful API engine for internal systems, Telegram & Discord bots, third-party ERP integrations, and mobile applications.

---

## 1. Base URL & Authentication

- **Base Endpoint**: `https://harconxs.com/api/v1`
- **Authentication**: Pass your API Key in the request header:
  ```http
  Authorization: Bearer hx_live_sec_your_api_key
  ```
  or
  ```http
  X-HARCONXS-API-KEY: hx_live_sec_your_api_key
  ```

---

## 2. Rate Limits & Headers

- **Rate Limit Window**: 100 requests per minute per IP/token.
- **Response Headers**:
  - `X-RateLimit-Limit`: Maximum requests per window (default: 100).
  - `X-RateLimit-Remaining`: Remaining request quota.
  - `X-RateLimit-Reset`: Unix timestamp when quota resets.
  - `X-HARCONXS-Engine`: `v1.4.0-sovereign`

---

## 3. Core API Endpoints

### 🛒 Catalog & Products
- `GET /api/v1/products` — Retrieve active product catalog with filters (`category`, `price_min`, `price_max`, `tag`, `sort`).
- `GET /api/v1/products/:slug` — Retrieve single product details, variants, packaging, and reviews.
- `GET /api/v1/categories` — Retrieve all categories and taxonomy tree.

### 📦 Orders & Tracking
- `GET /api/v1/orders` — List orders for authenticated user or all orders (if admin scope).
- `GET /api/v1/orders/:orderNumber` — Retrieve full order detail, tracking milestones, and tax breakdown.
- `POST /api/v1/orders` — Programmatically create a pending order.
- `GET /api/v1/tracking/:trackingNumber` — Retrieve live courier waypoint status (BlueDart, Delhivery, FedEx).

### 💎 Bespoke Commissions (#CO)
- `POST /api/v1/custom-orders` — Submit new bespoke CAD / vector design brief.
- `GET /api/v1/custom-orders/:requestNumber` — Retrieve quote status, 3D proof renders, and discussion logs.
- `POST /api/v1/custom-orders/:requestNumber/messages` — Post patron or artisan message to commission ticket.

### 📧 Transactional Notifications & Emails
- `POST /api/v1/notifications/email-dispatch` — Trigger server-side transactional email (Order Confirmation, Tracking, Verification, Invoice).
- `POST /api/v1/notifications/preview-template` — Generate and preview compiled HTML email template.
- `GET /api/v1/notifications/templates` — List all 16 supported transactional trigger events.

### 🔍 SEO, Feeds & Discovery
- `GET /sitemap.xml` — Live dynamic XML sitemap of all active products, categories, pages, and guides.
- `GET /robots.txt` — Automated search engine crawler directives.
- `GET /feeds/google-merchant.xml` — Google Merchant Center RSS 2.0 XML product feed.
- `GET /feeds/google-merchant.tsv` — Google Merchant Center TSV spreadsheet export.

---

## 4. Error Responses

All API errors return standardized JSON envelopes:
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing X-HARCONXS-API-KEY header.",
    "status": 401
  }
}
```
Common Error Codes:
- `400 BAD_REQUEST`: Missing mandatory body fields or invalid format.
- `401 UNAUTHORIZED`: Invalid API key or token.
- `403 FORBIDDEN`: Insufficient role permission for requested resource.
- `404 NOT_FOUND`: Resource or endpoint does not exist.
- `429 TOO_MANY_REQUESTS`: Rate limit exceeded.
- `500 INTERNAL_SERVER_ERROR`: Unhandled exception on server.
