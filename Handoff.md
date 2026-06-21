# Handoff — adagio-web

## Goal

Make `demo.adagi0.com` (and `www.demo.adagi0.com`) work as a clean subdomain alias for the Demos section of `adagi0.com`.

- Navigating to `demo.adagi0.com/LinkTree` should render `/Demos/LinkTree` with the URL bar unchanged.
- All static assets (CSS, JS, images) must load correctly — no MIME-type errors.
- Each demo page should be fully functional: Lotería (Cartas + Tablero), Kiosk, LinkTree, Video, Wedding.
- Clicking "Demos" in the main site navbar goes to the demo subdomain.
- Clicking any demo card in the portfolio goes to the subdomain URL.

---

## Current State

**Partially working. The subdomain routing and HTML patching are implemented but the CSS MIME error (`text/html` instead of `text/css`) is still reported in production.**

| Item | Status |
|---|---|
| `bar.astro` — Demos nav link → subdomain | ✅ Done |
| `Portafolio.astro` — demo card links → subdomain | ✅ Done |
| `middleware.ts` — path rewrite + HTML asset patching | ✅ Done (deployed) |
| `_redirects` — safety-net 302s for static assets | ✅ Done |
| `netlify.toml` — 200 proxy rules removed | ✅ Done |
| CSS MIME error resolved in production | ❌ Still failing |
| `Loteria/index.astro` landing page | ✅ Created, not yet committed |
| `www.demo.adagi0.com` subdomain detection | ✅ Fixed in middleware |
| Rewrite loop on `/` | ✅ Fixed |

---

## Files in Flight

### Not yet committed
- `src/pages/Demos/Loteria/index.astro` — new landing page for the Lotería demo (role picker: Cantador / Jugador)

### Recently committed (last deploy `3958e93`)
- `src/middleware.ts`
- `netlify.toml`
- `public/_redirects`

---

## Files Changed (this session)

| File | What changed |
|---|---|
| `src/middleware.ts` | Complete rewrite: async handler, subdomain detection for any segment (handles `www.demo`), path rewrite to `/Demos/X`, HTML body patching to replace `/_astro/` with absolute `https://adagi0.com/_astro/` URLs, loop-break when `targetPathname === pathname` |
| `src/components/bar.astro` | Computes `demoBase` from `Host` header; "Demos" nav link points to `http://demo.localhost:4321` (dev) or `https://demo.adagi0.com` (prod) |
| `src/components/Portafolio.astro` | Same `demoBase` computation; all 4 demo card URLs updated to use subdomain |
| `netlify.toml` | Removed all `[[redirects]]` with `https://` in `from` (not supported in netlify.toml); removed 200 proxy rules; kept only `[[headers]]` |
| `public/_redirects` | Removed 200 proxy rule for `demo.adagi0.com/*`; kept only safety-net 302s for `/_astro/`, `/Cards/`, `/background/`, `/uploads/`, `/favicon.*` |
| `src/pages/Demos/Loteria/index.astro` | New file — lobby landing page linking to Cartas and Tablero |
| `src/pages/Demos/Kiosk.astro` | Full rewrite: product marketing landing page with embedded kiosk simulator, features, models (10"–32"), add-ons, integrations, pricing, contact |
| `src/layouts/DemoLayout.astro` | Created: shared layout for all demo pages |
| `src/pages/Demos/Loteria/Cartas.astro` | Created: card caller (cantador) view with shuffle, auto-advance, history |
| `src/pages/Demos/Loteria/Tablero.astro` | Created: 4×4 player board with frijolito marking and win detection |

---

## Failed Attempts

### 1. `NODE_ENV === 'production'` check in middleware
- **What**: Used `process.env.NODE_ENV === 'production'` to gate the 302 redirect and HTML patching.
- **Why it failed**: Netlify does not guarantee `NODE_ENV='production'` in the SSR function runtime. The block never executed.
- **Fix**: Changed to `!isLocalhost` (derived from `hostname`).

### 2. Wildcard subdomain in `_redirects` (`https://*.adagi0.com/_astro/*`)
- **What**: Used wildcard subdomain matching to redirect `/_astro/` requests from any subdomain to main domain.
- **Why it failed**: Empirically, `https://*.adagi0.com/_astro/*` does not match before `https://demo.adagi0.com/*` in Netlify's rule evaluation. The 200 proxy rule for `/*` captured `/_astro/` requests first.
- **Fix**: Changed to specific `https://demo.adagi0.com/_astro/*`.

### 3. 200 cross-domain proxy (`demo.adagi0.com/*` → `https://adagi0.com/Demos/:splat`)
- **What**: Used a Netlify 200 proxy rule so the URL bar stays on `demo.adagi0.com` while content is fetched from `adagi0.com/Demos/`.
- **Why it failed**: A cross-domain 200 proxy changes the `Host` header from `demo.adagi0.com` to `adagi0.com` before the SSR function runs. The middleware sees `hostname = 'adagi0.com'`, so `isDemoSubdomain = false`, and HTML patching never runs. The browser then requests `/_astro/global.css` relative to `demo.adagi0.com`, which SSR can't serve, returning HTML → MIME error.
- **Fix**: Removed the 200 proxy entirely. `demo.adagi0.com` must be a **Netlify domain alias** (configured in Netlify dashboard → Domain management). With a domain alias, requests arrive at the SSR function with `Host: demo.adagi0.com` unchanged, and the middleware handles all path rewriting.

### 4. Full-URL `[[redirects]]` in `netlify.toml`
- **What**: Added `from = "https://demo.adagi0.com/*"` rules inside `netlify.toml`.
- **Why it failed**: Netlify's `[[redirects]]` table does not support full URLs (with hostname) in the `from` field — only `_redirects` file does. The rules were silently ignored.
- **Fix**: Removed all full-URL redirect rules from `netlify.toml`; all subdomain redirect rules live in `public/_redirects` only.

### 5. Infinite rewrite loop
- **What**: `context.rewrite()` in Astro re-enters the middleware. When `demo.adagi0.com/` was rewritten to `/Demos/`, the middleware ran again with `pathname = '/Demos/'`, which triggered another `context.rewrite('/Demos/')` → infinite loop → "Loop Detected" error.
- **Fix**: Added a `needsRewrite` check: if `targetPathname === pathname`, call `next()` instead of `context.rewrite()`.

---

## Next Steps

### Critical
1. **Verify `demo.adagi0.com` is configured as a domain alias** in Netlify dashboard (not just via `_redirects`). Go to: Netlify → Site → Domain management → Add domain alias → `demo.adagi0.com`. Without this, the domain alias approach won't work and the CSS MIME error will persist.

2. **Commit `Loteria/index.astro`**:
   ```bash
   git add src/pages/Demos/Loteria/index.astro
   git commit -m "feat: add Loteria landing page with cantador/jugador role picker"
   git push
   ```

3. **Confirm CSS MIME error is resolved** after the latest deploy (`3958e93`). If the error still appears, the most likely cause is #1 above — the domain alias is not configured and a proxy rule (from some source) is still changing the `Host` header.

### If CSS error persists after alias is confirmed
- Add a temporary diagnostic response in middleware: for any request where `isDemoSubdomain && isStaticPath`, return `new Response(JSON.stringify({ hostname, isDemoSubdomain, pathname }), { headers: { 'content-type': 'application/json' } })`. Deploy, then visit `demo.adagi0.com/_astro/test` to confirm what `hostname` the function receives. If it returns `adagi0.com`, the Host header is still being changed — there's another redirect rule somewhere overriding the alias.

### Nice to have
- Add more cards to Lotería (currently only 20 of 54 standard cards have images in `/public/Cards/`).
- Add a "Lotería" entry to `Portafolio.astro` demo cards so users can discover it from the main site.
- Add multiplayer sync to Lotería (WebSocket or polling so Tablero auto-marks when Cartas advances).
