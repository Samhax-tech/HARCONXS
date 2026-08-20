# HARCONXS — Billing & Payment Gateway Integration

HARCONXS features a robust multi-gateway billing architecture supporting domestic and global payments, digital bot panel subscriptions, custom invoice generation, and refunds.

---

## 1. Supported Gateways & Payment Methods

| Gateway | Supported Methods | Target Regions | Environment Variables |
|---|---|---|---|
| **Razorpay** | UPI (GPay, PhonePe, Paytm), Netbanking, Credit/Debit Cards, EMI, PayLater | India (INR) | `VITE_RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` |
| **Cashfree** | Instant UPI QR, Netbanking, Credit/Debit Cards | India (INR) | `VITE_CASHFREE_APP_ID`, `CASHFREE_SECRET_KEY` |
| **Stripe** | Visa, MasterCard, Amex, Apple Pay, Google Pay | Global (USD, EUR, GBP, AUD) | `VITE_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY` |
| **Direct UPI QR** | Dynamic QR generation with reference payload | India (INR) | Zero transaction fees |
| **Store Credit** | Instant balance redemption from returns or referrals | Global | Handled in-database via `profiles.store_credit` |

---

## 2. Razorpay Checkout Flow

1. **Client Order Creation**:
   The frontend requests an order token from the serverless API.
2. **Launch Modal**:
   The browser opens Razorpay's high-security modal.
3. **Signature Verification**:
   When payment succeeds, Razorpay returns `razorpay_payment_id`, `razorpay_order_id`, and `razorpay_signature`.
   The server verifies:
   ```ts
   const expectedSignature = crypto
     .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
     .update(`${orderId}|${paymentId}`)
     .digest('hex');
   ```
4. **Order Confirmation & Invoicing**:
   The order status updates to `paid`, inventory is deducted, a GST invoice record is inserted into `billing_invoices`, and a confirmation email is dispatched.

---

## 3. GST & Tax Calculation

HARCONXS includes an automated tax calculation engine:
- **Jewelry & Precious Metals**: 3% GST (HSN 7113/7117)
- **Stainless Steel / Titanium Artifacts**: 18% GST (HSN 7326)
- **Custom Laser Services**: 18% GST (SAC 9988)
- **Digital Sanctuaries & Bot Subscriptions**: 18% GST (SAC 9983)

Invoices include:
- Registered GSTIN
- Sequential invoice number (`INV-2026-XXXX`)
- Tax breakdown (CGST + SGST for intra-state or IGST for inter-state)
- QR code verification and downloadable PDF format

---

## 4. Refund Management (RMA)

1. Patrons request returns through **Account > Orders > Request Return (RMA)**.
2. Store Managers inspect the returned artifact or verify damage report.
3. Upon approval in **Admin > Orders > Returns & RMAs**, the system:
   - Initiates an automated refund via the original gateway (Razorpay/Stripe API).
   - Or credits the customer's wallet (`store_credit`) immediately.
   - Logs the refund in `refunds` and sends a confirmation email.
