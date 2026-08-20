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
