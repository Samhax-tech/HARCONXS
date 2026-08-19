import express, { Request, Response, NextFunction } from 'express';
import { handleApiV1Request, ApiRequestOptions, sanitizeLogData } from '../services/apiCoreService';

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
