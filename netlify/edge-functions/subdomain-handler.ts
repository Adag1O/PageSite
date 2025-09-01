export default async (request: Request, context: any) => {
  const url = new URL(request.url);
  const hostname = url.hostname;
  
  // Extract subdomain
  const parts = hostname.split('.');
  const subdomain = parts.length > 2 ? parts[0] : null;
  
  // Handle demo subdomain
  if (subdomain === 'demo' || subdomain === 'Demo') {
    // Rewrite URL to point to /Demos/ folder
    const newPath = url.pathname === '/' ? '/Demos/' : `/Demos${url.pathname}`;
    const newUrl = new URL(newPath, url.origin);
    newUrl.search = url.search;
    newUrl.hash = url.hash;
    
    // Create a new request with the rewritten URL
    const newRequest = new Request(newUrl.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });
    
    // Forward to the main site with rewritten path
    return context.next(newRequest);
  }
  
  // For main domain, continue normally
  return context.next();
};
