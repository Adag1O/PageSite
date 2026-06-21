import { defineMiddleware } from 'astro:middleware';

/**
 * SUBDOMAIN ROUTING + ASSET URL REWRITING
 *
 * Problem in production:
 *   demo.adagi0.com/_astro/global.css → Netlify SSR returns HTML (no CDN coverage
 *   for the alias subdomain's static files) → browser blocks with MIME mismatch.
 *
 * Fix:
 *   For HTML responses served on the demo subdomain we rewrite every /_astro/,
 *   /Cards/, /background/, /uploads/ reference to an absolute URL on the main
 *   domain BEFORE the browser ever sees the page. The browser then requests
 *   those assets directly from adagi0.com where the CDN has them.
 *
 * Local dev (demo.localhost:4321):
 *   Rewrite pages from /DemoName → /Demos/DemoName as before (no HTML patching
 *   needed because localhost CDN serves assets on any hostname).
 */

const STATIC_PATH = /\/_astro\/|\/Cards\/|\/background\/|\/uploads\/|\/favicon\./;
const ASSET_EXT   = /\.(css|js|mjs|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|avif|webp|map)$/i;

export const onRequest = defineMiddleware(async (context, next) => {
  const { request } = context;
  const url      = new URL(request.url);
  const hostname = url.hostname;
  const pathname = url.pathname;

  // ── Dev: /admin → /admin/index.html ──────────────────────────────────────
  if (process.env.NODE_ENV !== 'production' &&
      (pathname === '/admin' || pathname === '/admin/')) {
    return Response.redirect(new URL('/admin/index.html', url.origin), 302);
  }

  // ── Detect subdomain ──────────────────────────────────────────────────────
  const parts       = hostname.split('.');
  const isLocalhost = hostname === 'localhost' || hostname.endsWith('.localhost');
  // demo.localhost → parts = ['demo','localhost']  → subdomain = 'demo'
  // demo.adagi0.com → parts = ['demo','adagi0','com'] → subdomain = 'demo'
  const subdomain =
    isLocalhost
      ? parts.length > 1 ? parts[0] : null
      : parts.length > 2 ? parts[0] : null;

  const isDemoSubdomain =
    subdomain === 'demo'  || subdomain === 'demos' ||
    subdomain === 'Demo'  || subdomain === 'Demos';

  context.locals.subdomain      = subdomain;
  context.locals.isDemoSubdomain = isDemoSubdomain;

  // ── Static assets ─────────────────────────────────────────────────────────
  // In dev both main domain and demo subdomain can serve /_astro/ fine.
  // In production on the demo subdomain we let the middleware pass the request
  // through; the HTML-patching step below ensures the browser never asks for
  // _astro/* on the subdomain in the first place (so this path is a safety net).
  const isStaticAsset = STATIC_PATH.test(pathname) || ASSET_EXT.test(pathname);

  if (isStaticAsset) {
    if (isDemoSubdomain && process.env.NODE_ENV === 'production') {
      // Safety-net 302: if somehow a browser still requests a static asset on
      // the demo subdomain, redirect to the main domain.
      const mainDomain = hostname.replace(/^[^.]+\./, '');
      return Response.redirect(
        `${url.protocol}//${mainDomain}${pathname}${url.search}`,
        302
      );
    }
    return next();
  }

  // ── Demo subdomain: rewrite page path ─────────────────────────────────────
  if (isDemoSubdomain) {
    let targetPathname = pathname;

    // Only rewrite if not already under /Demos/
    if (!pathname.startsWith('/Demos/') && pathname !== '/Demos') {
      targetPathname = pathname === '/' ? '/Demos/' : `/Demos${pathname}`;
    }

    const rewrittenUrl = new URL(targetPathname, url.origin);
    rewrittenUrl.search = url.search;

    const response = await context.rewrite(
      new Request(rewrittenUrl, {
        method:  request.method,
        headers: request.headers,
        body:    request.body,
      })
    );

    // ── PRODUCTION: patch HTML to use absolute asset URLs ─────────────────
    // This prevents the browser from ever requesting /_astro/* on the demo
    // subdomain.  We replace every relative /_astro/, /Cards/, /background/
    // reference in the HTML with the full main-domain URL.
    if (process.env.NODE_ENV === 'production') {
      const contentType = response.headers.get('content-type') ?? '';
      if (contentType.includes('text/html')) {
        const mainOrigin = `${url.protocol}//${hostname.replace(/^[^.]+\./, '')}`;
        let html = await response.text();

        // Patch src/href/url() references
        html = html
          .replace(/(src|href)="\/_astro\//g,   `$1="${mainOrigin}/_astro/`)
          .replace(/(src|href)='\/\_astro\//g,   `$1='${mainOrigin}/_astro/`)
          .replace(/url\(\/_astro\//g,           `url(${mainOrigin}/_astro/`)
          .replace(/(src|href)="\/Cards\//g,     `$1="${mainOrigin}/Cards/`)
          .replace(/(src|href)="\/background\//g,`$1="${mainOrigin}/background/`)
          .replace(/(src|href)="\/uploads\//g,   `$1="${mainOrigin}/uploads/`);

        const headers = new Headers(response.headers);
        headers.delete('content-length'); // length changed after patching

        return new Response(html, {
          status:  response.status,
          headers,
        });
      }
    }

    return response;
  }

  // ── Main domain: pass through ─────────────────────────────────────────────
  return next();
});
