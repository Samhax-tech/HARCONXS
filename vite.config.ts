import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

function expressApiPlugin(): Plugin {
  return {
    name: 'express-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (
          req.url &&
          (req.url.startsWith('/api') ||
            req.url.startsWith('/sitemap.xml') ||
            req.url.startsWith('/robots.txt') ||
            req.url.startsWith('/feeds/'))
        ) {
          try {
            const { apiRouter } = await import('./src/server/apiRouter');
            const originalUrl = req.url;
            if (req.url === '/api' || req.url === '/api/') {
              req.url = '/';
            } else if (req.url.startsWith('/api/')) {
              req.url = req.url.slice(4);
            }
            apiRouter(req as any, res as any, (err?: any) => {
              req.url = originalUrl;
              next(err);
            });
          } catch (err) {
            next(err);
          }
        } else {
          next();
        }
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), expressApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
