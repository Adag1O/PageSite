import { defineMiddleware } from 'astro:middleware';

/**
 * SUBDOMAIN ROUTING + ASSET URL REWRITING
 *
 * Why this exists
 * ───────────────
 * demo.adagi0.com is a Netlify domain alias.  Netlify's CDN does NOT serve
 * /_astro/* static files for alias domains — all requests go through the SSR
 * function, which has no page route for /_astro/... and returns a 404 HTML
 * page.  The browser then gets text/html where it expected text/css → MIME
 * mismatch → page renders unstyled.
 *
 * Fix (two layers)
 * ────────────────
 * 1. Static-asset requests from demo subdomain → 302 to main domain (CDN).
 * 2. HTML pages served on demo subdomain → rewrite /_astro/ references to
 *    absolute URLs on the main domain so the browser never requests assets
 *    from the alias domain in the first place.
 *
 * NOTE: We deliberately avoid process.env.NODE_ENV checks because Netlify
 * does not guarantee NODE_ENV='production' in function runtime.  Instead we
 * check !isLocalhost (production proxy) vs isLocalhost (dev server).
 */

const STATIC_PREFIXES = ['/_astro/', '/Cards/', '/background/', '/uploads/'];
const ASSET_EXT       = /\.(css|js|mjs|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|avif|webp|map)$/i;

function isStaticPath(pathname: string): boolean {
  return STATIC_PREFIXES.some(p => pathname.startsWith(p)) ||
         pathname.startsWith('/favicon') ||
         ASSET_EXT.test(pathname);
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { request } = context;
  const url      = new URL(request.url);
  const hostname = url.hostname;          // no port  e.g. demo.adagi0.com
  const host     = url.host;             // with port e.g. demo.localhost:4321
  const pathname = url.pathname;

  // ── Environment ───────────────────────────────────────────────────────────
  const isLocalhost = hostname === 'localhost' || hostname.endsWith('.localhost');

  // ── Dev: /admin → /admin/index.html ──────────────────────────────────────
  if (isLocalhost && (pathname === '/admin' || pathname === '/admin/')) {
    return Response.redirect(new URL('/admin/index.html', url.origin), 302);
  }

  // ── Subdomain detection ───────────────────────────────────────────────────
  const parts = hostname.split('.');
  // demo.localhost  → ['demo','localhost']       → subdomain = 'demo'
  // demo.adagi0.com → ['demo','adagi0','com']    → subdomain = 'demo'
  // adagi0.com      → ['adagi0','com']           → subdomain = null
  // localhost       → ['localhost']              → subdomain = null
  const subdomain: string | null =
    isLocalhost
      ? (parts.length > 1 ? parts[0] : null)
      : (parts.length > 2 ? parts[0] : null);

  const isDemoSubdomain =
    subdomain === 'demo'  || subdomain === 'demos' ||
    subdomain === 'Demo'  || subdomain === 'Demos';

  context.locals.subdomain       = subdomain;
  context.locals.isDemoSubdomain = isDemoSubdomain;

  // ── Static assets ─────────────────────────────────────────────────────────
  if (isStaticPath(pathname)) {
    // On production alias domains the CDN won't serve /_astro/ files, so we
    // redirect the browser to fetch them from the main domain CDN instead.
    // On localhost the dev server serves assets for any hostname → skip.
    if (isDemoSubdomain && !isLocalhost) {
      const mainHost = host.replace(/^[^.]+\./, ''); // demo.adagi0.com → adagi0.com
      return Response.redirect(
        `${url.protocol}//${mainHost}${pathname}${url.search}`,
        302
      );
    }
    return next();
  }

  // ── Demo subdomain: rewrite page path + patch HTML ────────────────────────
  if (isDemoSubdomain) {
    // /LinkTree → /Demos/LinkTree  (don't double-prefix if already under /Demos/)
    const targetPathname =
      pathname.startsWith('/Demos/') || pathname === '/Demos'
        ? pathname
        : pathname === '/'
          ? '/Demos/'
          : `/Demos${pathname}`;

    // If already at the correct /Demos/... path (e.g. after context.rewrite
    // re-enters the middleware), use next() to avoid an infinite rewrite loop.
    const needsRewrite = targetPathname !== pathname;

    const rewriteUrl = new URL(targetPathname, url.origin);
    rewriteUrl.search = url.search;

    const response = needsRewrite
      ? await context.rewrite(
          new Request(rewriteUrl, {
            method:  request.method,
            headers: request.headers,
            body:    request.body,
          })
        )
      : await next();

    // Patch HTML asset URLs so the browser requests /_astro/* from the main
    // domain CDN, not from the alias domain that can't serve them.
    // Only needed outside localhost (dev server serves assets everywhere).
    if (!isLocalhost) {
      const ct = response.headers.get('content-type') ?? '';
      if (ct.includes('text/html')) {
        const mainOrigin = `${url.protocol}//${host.replace(/^[^.]+\./, '')}`;
        let html = await response.text();

        html = html
          // <link href="/_astro/...">  <script src="/_astro/...">
          .replace(/(href|src)="\/_astro\//g,    `$1="${mainOrigin}/_astro/`)
          .replace(/(href|src)='\/\_astro\//g,   `$1='${mainOrigin}/_astro/`)
          // CSS url() references
          .replace(/url\(\/_astro\//g,           `url(${mainOrigin}/_astro/`)
          // Public-folder assets
          .replace(/(href|src)="\/Cards\//g,     `$1="${mainOrigin}/Cards/`)
          .replace(/(href|src)="\/background\//g,`$1="${mainOrigin}/background/`)
          .replace(/(href|src)="\/uploads\//g,   `$1="${mainOrigin}/uploads/`)
          // favicon
          .replace(/(href|src)="\/favicon\./g,   `$1="${mainOrigin}/favicon.`);

        const headers = new Headers(response.headers);
        headers.delete('content-length'); // size changed after rewrite
        return new Response(html, { status: response.status, headers });
      }
    }

    return response;
  }

  // ── Safety-net: /Demos/Demos/... ──────────────────────────────────────────
  // If a link inside a demo page hard-codes /Demos/X and the user is on the
  // demo subdomain, Netlify's 200 proxy turns it into /Demos/Demos/X.
  // Silently rewrite back to /Demos/X.
  if (pathname.startsWith('/Demos/Demos/') || pathname === '/Demos/Demos') {
    const fixed = pathname.replace(/^\/Demos/, '');
    return context.rewrite(
      new Request(new URL(fixed, url.origin), {
        method:  request.method,
        headers: request.headers,
        body:    request.body,
      })
    );
  }

  // ── Main domain pass-through ──────────────────────────────────────────────
  return next();
});
