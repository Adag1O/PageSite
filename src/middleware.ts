import { defineMiddleware } from 'astro:middleware';

/**
 * SISTEMA DE RUTAS Y SUBDOMINIOS
 *
 * DESARROLLO:
 * - demo.localhost:4321/            → /src/pages/Demos/index.astro
 * - demo.localhost:4321/LinkTree    → /src/pages/Demos/LinkTree.astro
 *
 * PRODUCCIÓN:
 * - demo.adagi0.com/                → /src/pages/Demos/index.astro
 * - demo.adagi0.com/LinkTree        → /src/pages/Demos/LinkTree.astro
 *
 * ASSETS en subdominio (producción):
 * - demo.adagi0.com/_astro/*.css  → 302 → adagi0.com/_astro/*.css
 *   (Netlify SSR no sirve archivos estáticos para subdominios alias;
 *    los redirigimos al dominio principal donde el CDN sí los tiene)
 */

// Extensions considered static assets
const STATIC_EXT = /\.(css|js|mjs|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|avif|webp|map)$/i;

export const onRequest = defineMiddleware((context, next) => {
  const { request } = context;
  const url = new URL(request.url);
  const hostname = url.hostname;
  const pathname = url.pathname;

  // ── Dev only: /admin → /admin/index.html ─────────────────────────────────
  if (process.env.NODE_ENV !== 'production' &&
      (pathname === '/admin' || pathname === '/admin/')) {
    return Response.redirect(new URL('/admin/index.html', url.origin), 302);
  }

  // ── Detect subdomain ──────────────────────────────────────────────────────
  const parts = hostname.split('.');
  // "demo.localhost" → subdomain = "demo"  |  "localhost" → null
  const isLocalhost = hostname === 'localhost' || hostname.endsWith('.localhost');
  const subdomain =
    isLocalhost
      ? parts.length > 1 ? parts[0] : null          // demo.localhost
      : parts.length > 2 ? parts[0] : null;          // demo.adagi0.com

  const isDemoSubdomain =
    subdomain === 'demo' || subdomain === 'demos' ||
    subdomain === 'Demo' || subdomain === 'Demos';

  // ── Static assets ─────────────────────────────────────────────────────────
  const isStaticAsset =
    pathname.startsWith('/_astro/') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/Cards/') ||
    pathname.startsWith('/background/') ||
    pathname.startsWith('/uploads/') ||
    STATIC_EXT.test(pathname);

  if (isStaticAsset) {
    if (isDemoSubdomain && process.env.NODE_ENV === 'production') {
      // In production the demo subdomain is a Netlify domain alias; its CDN
      // does NOT have the _astro static files. Redirect the browser to fetch
      // them from the main domain where the CDN does have them.
      const mainDomain = hostname.replace(/^[^.]+\./, ''); // demo.adagi0.com → adagi0.com
      const assetUrl = `${url.protocol}//${mainDomain}${pathname}${url.search}`;
      return Response.redirect(assetUrl, 302);
    }
    // Dev or main domain: let the SSR/static layer handle it normally
    return next();
  }

  // ── Demo subdomain page rewrite ───────────────────────────────────────────
  if (isDemoSubdomain && !pathname.startsWith('/Demos/')) {
    const demoPath = pathname === '/' ? '/Demos/' : `/Demos${pathname}`;

    const newUrl = new URL(demoPath, url.origin);
    newUrl.search = url.search;

    context.locals.subdomain = subdomain;
    context.locals.isDemoSubdomain = true;

    return context.rewrite(new Request(newUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    }));
  }

  // ── Pass through ──────────────────────────────────────────────────────────
  context.locals.subdomain = subdomain;
  context.locals.isDemoSubdomain = isDemoSubdomain;

  return next();
});
