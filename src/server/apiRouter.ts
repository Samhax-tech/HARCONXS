import express, { Request, Response, NextFunction } from 'express';
import { handleApiV1Request, ApiRequestOptions, sanitizeLogData } from '../services/apiCoreService';
import {
  getLiveSitemapXml,
  generateRobotsTxt,
  getLiveMerchantFeedXml,
  generateGoogleMerchantCenterFeedTsv,
  DEFAULT_SITE_URL
} from '../services/seoService';
import { fetchProductsFromSupabase } from '../services/supabaseService';
import { INITIAL_PRODUCTS } from '../data/initialData';

import { executeServerEmailDispatch, generateEmailForNotification } from './emailDispatcher';
import { recordEmailLogInSupabase } from '../services/supabaseService';

export const apiRouter = express.Router();

// Middleware: Parse JSON bodies safely
apiRouter.use(express.json({ limit: '10mb' }));
apiRouter.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware: Safe Request Logger & CORS for internal applications
apiRouter.use((req: Request, res: Response, next: NextFunction) => {
  // Disallow unauthorized cross-origin scraping while permitting internal authorized tool callers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-HARCONXS-API-KEY, X-Request-ID');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

/**
 * Server-Side Notification & Email Dispatch Endpoints
 * All private email credentials remain securely on the server
 */
apiRouter.post(['/api/v1/notifications/email-dispatch', '/api/v1/emails/send', '/v1/notifications/email-dispatch'], async (req: Request, res: Response) => {
  try {
    const { type, recipientEmail, recipientName, subject, data, userId } = req.body || {};

    if (!type || !recipientEmail) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: "type" and "recipientEmail" are mandatory.'
      });
    }

    const payload = {
      type,
      recipientEmail,
      recipientName: recipientName || recipientEmail.split('@')[0],
      subject,
      data: data || {},
      userId
    };

    const result = await executeServerEmailDispatch(payload);

    // Save to Supabase email_logs asynchronously if service is available
    try {
      await recordEmailLogInSupabase({
        id: result.emailId,
        type: result.type as any,
        recipientEmail: result.recipientEmail,
        recipientName: result.recipientName,
        subject: result.subject,
        previewSnippet: result.previewSnippet,
        htmlContent: result.htmlContent,
        sentAt: result.sentAt,
        status: result.status,
        orderNumber: result.orderNumber,
        trackingNumber: result.trackingNumber,
        carrier: result.carrier,
        metadata: result.metadata
      });
    } catch (dbErr) {
      console.warn('[NotificationApi] Supabase log fallback notice:', dbErr);
    }

    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Server error while dispatching transactional notification.'
    });
  }
});

apiRouter.post(['/api/v1/notifications/preview-template', '/v1/notifications/preview-template'], (req: Request, res: Response) => {
  try {
    const { type, recipientEmail, recipientName, data } = req.body || {};
    const generated = generateEmailForNotification({
      type: type || 'ACCOUNT_CREATED',
      recipientEmail: recipientEmail || 'customer@example.com',
      recipientName: recipientName || 'Valued Patron',
      data: data || {}
    });
    return res.status(200).json({
      success: true,
      ...generated
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});

apiRouter.get(['/api/v1/notifications/templates', '/v1/notifications/templates'], (req: Request, res: Response) => {
  const supportedEvents = [
    { type: 'ACCOUNT_CREATED', category: 'account', label: 'Account Creation', description: 'Triggered when a new user registers on HARCONXS' },
    { type: 'EMAIL_VERIFICATION', category: 'account', label: 'Email Verification', description: 'Triggered to send 6-digit security verification PIN' },
    { type: 'ORDER_CREATED', category: 'orders', label: 'Order Created', description: 'Triggered immediately when an order is placed' },
    { type: 'PAYMENT_SUCCESSFUL', category: 'orders', label: 'Payment Successful', description: 'Triggered when payment is authorized & tax invoice generated' },
    { type: 'ORDER_PROCESSING', category: 'orders', label: 'Order Processing', description: 'Triggered when fiber laser engraving & bench fabrication starts' },
    { type: 'ORDER_SHIPPED', category: 'orders', label: 'Order Shipped', description: 'Triggered when package is handed to BlueDart / FedEx with AWB' },
    { type: 'ORDER_DELIVERED', category: 'orders', label: 'Order Delivered', description: 'Triggered when package delivery is confirmed' },
    { type: 'REFUND_PROCESSED', category: 'orders', label: 'Refund Processed', description: 'Triggered when finance approves and issues refund credit' },
    { type: 'CUSTOM_ORDER_MESSAGE', category: 'custom', label: 'Custom Order Message', description: 'Triggered when master artisan replies with CAD design proof' },
    { type: 'CUSTOM_QUOTE_ISSUED', category: 'custom', label: 'Custom Quote Issued', description: 'Triggered when official bespoke pricing quote is ready' },
    { type: 'QUOTE_ACCEPTED', category: 'custom', label: 'Quote Accepted', description: 'Triggered when patron approves bespoke quote & fabrication' },
    { type: 'COUPLE_WEBSITE_PURCHASE', category: 'websites', label: 'Couple Website Purchase', description: 'Triggered when couple sanctuary subdomain is provisioned' },
    { type: 'WEBSITE_PUBLISHED', category: 'websites', label: 'Website Published', description: 'Triggered when couple sanctuary goes live to the world' },
    { type: 'SUPPORT_REPLY', category: 'support', label: 'Support Reply', description: 'Triggered when customer concierge replies to a support ticket' },
    { type: 'API_KEY_CREATED', category: 'security', label: 'API Key Created', description: 'Triggered when new developer programmatic key is issued' },
    { type: 'API_KEY_REVOKED', category: 'security', label: 'API Key Revoked', description: 'Triggered when developer key is permanently invalidated' }
  ];

  res.status(200).json({
    success: true,
    totalSupported: supportedEvents.length,
    events: supportedEvents
  });
});

/**
 * 1. Production SEO: Sitemap.xml
 */
apiRouter.get(['/sitemap.xml', '/api/v1/seo/sitemap.xml', '/seo/sitemap.xml'], async (req: Request, res: Response) => {
  try {
    const origin = req.protocol + '://' + (req.get('host') || 'harconxs.com');
    const xml = await getLiveSitemapXml(origin);
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    return res.status(200).send(xml);
  } catch (err: any) {
    return res.status(500).type('text/plain').send('Error generating sitemap.xml');
  }
});

/**
 * 2. Production SEO: Robots.txt
 */
apiRouter.get(['/robots.txt', '/api/v1/seo/robots.txt', '/seo/robots.txt'], (req: Request, res: Response) => {
  const origin = req.protocol + '://' + (req.get('host') || 'harconxs.com');
  const txt = generateRobotsTxt(origin);
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  return res.status(200).send(txt);
});

/**
 * 3. Production Google Merchant Center Product Feed (XML / RSS 2.0)
 */
apiRouter.get(['/feeds/google-merchant.xml', '/api/v1/feeds/google-merchant.xml', '/api/v1/feeds/google-merchant'], async (req: Request, res: Response) => {
  try {
    const origin = req.protocol + '://' + (req.get('host') || 'harconxs.com');
    const feedXml = await getLiveMerchantFeedXml(origin);
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=1800, s-maxage=1800');
    return res.status(200).send(feedXml);
  } catch (err: any) {
    return res.status(500).type('text/plain').send('Error generating Google Merchant Center XML feed');
  }
});

/**
 * 4. Google Merchant Center Feed (TSV spreadsheet export)
 */
apiRouter.get(['/feeds/google-merchant.tsv', '/api/v1/feeds/google-merchant.tsv'], async (req: Request, res: Response) => {
  try {
    const origin = req.protocol + '://' + (req.get('host') || 'harconxs.com');
    const dbProducts = await fetchProductsFromSupabase();
    const prods = (dbProducts && dbProducts.length > 0) ? dbProducts : INITIAL_PRODUCTS;
    const tsv = generateGoogleMerchantCenterFeedTsv(prods, origin);
    res.setHeader('Content-Type', 'text/tab-separated-values; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="harconxs_merchant_feed.tsv"');
    return res.status(200).send(tsv);
  } catch (err: any) {
    return res.status(500).type('text/plain').send('Error generating Google Merchant Center TSV feed');
  }
});

/**
 * Universal Handler for all `/api/v1/*` routes
 */
apiRouter.all('/v1/*', async (req: Request, res: Response) => {
  try {
    const rawHeaders: Record<string, string> = {};
    for (const [key, value] of Object.entries(req.headers)) {
      if (value) {
        rawHeaders[key.toLowerCase()] = Array.isArray(value) ? value.join(', ') : value;
      }
    }

    const queryParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(req.query)) {
      if (v !== undefined) {
        queryParams[k] = String(v);
      }
    }

    const requestOptions: ApiRequestOptions = {
      method: req.method as any,
      path: req.path,
      query: queryParams,
      headers: rawHeaders,
      body: req.body,
      ip: req.ip || req.socket.remoteAddress || '127.0.0.1',
      userAgent: req.get('user-agent') || 'Node/Express Client'
    };

    const responsePayload = await handleApiV1Request(requestOptions);

    // Set HTTP response headers
    for (const [hKey, hVal] of Object.entries(responsePayload.headers)) {
      res.setHeader(hKey, hVal);
    }

    return res.status(responsePayload.status).json(responsePayload.body);
  } catch (err: any) {
    const safeError = sanitizeLogData({
      error: 'INTERNAL_SERVER_ERROR',
      message: err?.message || 'An unexpected internal error occurred on the HARCONXS API engine.'
    });

    return res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error processing API request.',
        details: safeError.message
      }
    });
  }
});

// Root API Index / Info
apiRouter.get('/', (req: Request, res: Response) => {
  res.json({
    service: 'HARCONXS Private Internal API Engine',
    version: 'v1.4.0',
    documentation: '/admin#api-keys',
    endpointsBase: '/api/v1',
    status: 'operational',
    internalClients: [
      'HARCONXS-WEB',
      'HARCONXS-TELEGRAM',
      'HARCONXS-DISCORD',
      'HARCONXS-WORDPRESS',
      'HARCONXS-ADMIN'
    ]
  });
});

export default apiRouter;
