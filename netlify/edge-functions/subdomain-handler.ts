// If running locally, use the npm package:
import type { Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const hostname = url.hostname;
  
  // No procesar assets estáticos (CSS, JS, imágenes, etc.)
  if (url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
    return;
  }
  
  // Detectar subdominio, manejando www también
  const parts = hostname.split('.');
  let subdomain = null;
  
  if (parts.length > 2) {
    // Si tiene www, tomar el segundo elemento
    if (parts[0] === 'www' && parts.length > 3) {
      subdomain = parts[1];
    } else if (parts[0] !== 'www') {
      subdomain = parts[0];
    }
  }
  
  console.log(`[Edge Function] Hostname: ${hostname}, Subdomain: ${subdomain}, Path: ${url.pathname}`);
  
  // Si es subdominio demo o demos y no está en /Demos/
  if ((subdomain === 'demo' || subdomain === 'demos') && !url.pathname.startsWith('/Demos/')) {
    let targetPath;
    if (url.pathname === '/') {
      targetPath = '/Demos/';
    } else {
      // Eliminar cualquier slash inicial para evitar duplicación
      const cleanPath = url.pathname.startsWith('/') ? url.pathname.substring(1) : url.pathname;
      targetPath = `/Demos/${cleanPath}`;
    }
    
    // Crear nueva URL apuntando al dominio principal
    const newUrl = new URL(targetPath, 'https://adagi0.com');
    newUrl.search = url.search;
    
    console.log(`[Edge Function] Rewriting from ${url.href} to: ${newUrl.href}`);
    
    // Hacer fetch interno al path correcto en el dominio principal
    return await context.rewrite(newUrl);
  }
  
  // Continuar normalmente si no es subdominio demo/demos
  return;
};
