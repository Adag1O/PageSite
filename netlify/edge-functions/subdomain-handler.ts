import { Context } from "https://edge.netlify.com/";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const hostname = url.hostname;
  
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
      targetPath = `/Demos${url.pathname}`;
    }
    
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
