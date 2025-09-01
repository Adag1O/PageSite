import { defineMiddleware } from 'astro:middleware';

/**
 * SISTEMA DE RUTAS Y SUBDOMINIOS
 * 
 * DESARROLLO:
 * - demo.localhost:4321/            → /src/pages/Demos/index.astro
 * - demo.localhost:4321/LinkTree    → /src/pages/Demos/LinkTree.astro
 * 
 * PRODUCCIÓN:
 * - demo.yourdomain.com/            → /src/pages/Demos/index.astro
 * - demo.yourdomain.com/LinkTree    → /src/pages/Demos/LinkTree.astro
 */

export const onRequest = defineMiddleware((context, next) => {
  const { request } = context;
  const url = new URL(request.url);
  const hostname = url.hostname;
  
  console.log(`[Middleware] Request: ${url.href}`);
  console.log(`[Middleware] Hostname: ${hostname}`);
  console.log(`[Middleware] Pathname: ${url.pathname}`);
  
  // Extraer subdominio del hostname
  const parts = hostname.split('.');
  const subdomain = parts.length > 1 && parts[0] !== 'localhost' && parts[0] !== 'www' ? parts[0] : null;
  
  console.log(`[Middleware] Subdomain detected: ${subdomain}`);
  
  // Verificar si es subdominio demo
  const isDemoSubdomain = subdomain === 'demo';
  
  // Solo procesar si es subdominio demo y no estamos ya en /Demos/
  if (isDemoSubdomain && !url.pathname.startsWith('/Demos/')) {
    const demoPath = url.pathname === '/' ? '/Demos/' : `/Demos${url.pathname}`;
    
    console.log(`[Middleware] Redirecting to: ${demoPath}`);
    
    // En desarrollo estático, usar rewrite interno en lugar de redirect
    if (process.env.NODE_ENV !== 'production') {
      // Crear nueva URL con el path corregido
      const newUrl = new URL(demoPath, url.origin);
      newUrl.search = url.search;
      
      // Crear nuevo request con la URL reescrita
      const newRequest = new Request(newUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body
      });
      
      context.locals.subdomain = subdomain;
      context.locals.isDemoSubdomain = true;
      
      // Continuar con el request reescrito
      return context.rewrite(newRequest);
    } else {
      // En producción, usar redirect normal
      const newUrl = new URL(demoPath, url.origin);
      newUrl.search = url.search;
      return Response.redirect(newUrl.toString(), 302);
    }
  }
  
  // Agregar información del subdominio a locals
  context.locals.subdomain = subdomain;
  context.locals.isDemoSubdomain = isDemoSubdomain;
  
  return next();
});
