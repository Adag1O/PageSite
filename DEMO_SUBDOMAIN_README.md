# Demo Subdomain Setup

This project now supports subdomain routing for demos using Netlify.

## Setup

### Development
1. The middleware handles subdomain routing locally
2. Use `demo.localhost:4321` to test subdomain functionality
3. All demo routes are in `/src/pages/Demos/`

### Production (Netlify)
1. Configure your domain in `netlify.toml` (replace `yourdomain.com`)
2. Set up DNS: 
   - Add CNAME record: `demo` → `your-site.netlify.app`
   - Or A record pointing to your server
3. The edge function handles subdomain routing at CDN level

## How it works

1. **Edge Function**: `netlify/edge-functions/subdomain-handler.ts` intercepts requests
2. **Middleware**: `src/middleware.ts` handles server-side routing
3. **Demo Routes**: All demo pages in `/src/pages/Demos/` folder

### URL Mapping
- `https://demo.yourdomain.com/` → `/Demos/`
- `https://demo.yourdomain.com/LinkTree` → `/Demos/LinkTree`
- `https://yourdomain.com/Demos/` → Works directly

## Adding New Demos

1. Create new `.astro` file in `/src/pages/Demos/`
2. Add entry to `demoRoutes` array in `/src/pages/Demos/index.astro`
3. Demo will be automatically available on both main domain and subdomain
