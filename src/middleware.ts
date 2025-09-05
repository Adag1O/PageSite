import { defineMiddleware } from 'astro:middleware';

/**
 * SISTEMA DE RUTAS Y SUBDOMINIOS
 * 
 * DESARROLLO:
 * - demo.localhost:4321/            → /src/pages/Demos/index.astro
 * - demos.localhost:4321/           → /src/pages/Demos/index.astro
 * - demo.localhost:4321/LinkTree    → /src/pages/Demos/LinkTree.astro
 * - demos.localhost:4321/LinkTree   → /src/pages/Demos/LinkTree.astro
 * 
 * PRODUCCIÓN:
 * - demo.adagi0.com/                → /src/pages/Demos/index.astro
 * - demos.adagi0.com/               → /src/pages/Demos/index.astro
 * - demos.adagi0.com/LinkTree       → /src/pages/Demos/LinkTree.astro
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
  
  // Verificar si es subdominio de demos (demo, demos, Demo, Demos)
  const isDemoSubdomain = subdomain === 'demo' || subdomain === 'demos' || 
                          subdomain === 'Demo' || subdomain === 'Demos';
  
  // No procesar assets estáticos (CSS, JS, imágenes, etc.) - incluyendo _astro
  if (url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/) || 
      url.pathname.startsWith('/_astro/') ||
      url.pathname.startsWith('/favicon')) {
    console.log(`[Middleware] Skipping asset: ${url.pathname}`);
    return next();
  }
  
  // Solo procesar en desarrollo y si es subdominio demo/demos
  if (process.env.NODE_ENV !== 'production' && isDemoSubdomain && !url.pathname.startsWith('/Demos/')) {
    const demoPath = url.pathname === '/' ? '/Demos/' : `/Demos${url.pathname}`;
    
    console.log(`[Middleware] Dev rewrite to: ${demoPath}`);
    
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
  }
  
  // Agregar información del subdominio a locals
  context.locals.subdomain = subdomain;
  context.locals.isDemoSubdomain = isDemoSubdomain;
  
  return next();
});
