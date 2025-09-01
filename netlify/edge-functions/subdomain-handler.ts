import { Context } from "https://edge.netlify.com/";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const hostname = url.hostname;
  
  // Detectar subdominio
  const parts = hostname.split('.');
  const subdomain = parts.length > 2 ? parts[0] : null;
  
  console.log(`[Edge Function] Hostname: ${hostname}, Subdomain: ${subdomain}, Path: ${url.pathname}`);
  
  // Si es subdominio demo o demos y no está en /Demos/
  if ((subdomain === 'demo' || subdomain === 'demos') && !url.pathname.startsWith('/Demos/')) {
    const targetPath = url.pathname === '/' ? '/Demos/' : `/Demos${url.pathname}`;
    
    // Reescribir la URL internamente
    const newUrl = new URL(targetPath, url.origin);
    newUrl.search = url.search;
    
    console.log(`[Edge Function] Rewriting to: ${newUrl.pathname}`);
    
    // Hacer fetch interno al path correcto
    return await context.rewrite(newUrl);
  }
  
  // Continuar normalmente si no es subdominio demo/demos
  return;
};
