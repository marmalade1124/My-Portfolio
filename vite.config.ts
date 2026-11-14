import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { readFile } from 'node:fs/promises';
import { PROJECTS } from './src/lib/data';
import { WRITING, writingPath } from './src/lib/editorial-writing';
import { editorialPath } from './src/lib/editorial-language';

const pages = new Set(['/', '/about', '/media', ...PROJECTS.map(project => `/work/${project.id}`), ...WRITING.map(article => writingPath(article.slug))]);

function missingPage(url: string, accept?: string) {
  const pathname = new URL(url, 'http://localhost').pathname.replace(/\/+$/, '') || '/';
  return accept?.includes('text/html') && !path.extname(pathname) && !pages.has(editorialPath(pathname));
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'portfolio-not-found',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          const url = req.url ?? '/';
          if (!missingPage(url, req.headers.accept)) return next();
          try {
            const template = await readFile(path.join(server.config.root, 'index.html'), 'utf8');
            const html = await server.transformIndexHtml(url, template.replace('</head>', '<meta name="robots" content="noindex"></head>'));
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }).end(html);
          } catch (error) { next(error); }
        });
      },
      configurePreviewServer(server) {
        server.middlewares.use(async (req, res, next) => {
          const url = new URL(req.url ?? '/', 'http://localhost');
          if (url.pathname !== '/' && url.pathname.endsWith('/') && pages.has(editorialPath(url.pathname.replace(/\/+$/, '')))) {
            res.writeHead(308, { Location: url.pathname.replace(/\/+$/, '') + url.search }).end();
            return;
          }
          if (!missingPage(req.url ?? '/', req.headers.accept)) return next();
          try {
            const html = await readFile(path.resolve(server.config.root, server.config.build.outDir, '404.html'), 'utf8');
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }).end(html);
          } catch (error) { next(error); }
        });
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
