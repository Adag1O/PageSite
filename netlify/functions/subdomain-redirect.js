// Netlify Function for handling subdomain redirects
// This runs on Netlify Functions for server-side redirect logic

exports.handler = async (event, context) => {
  const { headers, path } = event;
  const host = headers.host || headers.Host;
  
  console.log(`[Netlify Function] Host: ${host}, Path: ${path}`);
  
  // Check if it's a subdomain request, handling www as well
  const parts = host.split('.');
  let subdomain = null;
  
  if (parts.length > 2) {
    // Si tiene www, tomar el segundo elemento
    if (parts[0] === 'www' && parts.length > 3) {
      subdomain = parts[1];
    } else if (parts[0] !== 'www') {
      subdomain = parts[0];
    }
  }
  
  if (subdomain === 'demo' || subdomain === 'demos') {
    // Redirect to main domain with /Demos/ prefix
    // Evitar duplicar /Demos/ si ya está en el path
    let targetPath;
    if (path.startsWith('/Demos/')) {
      // Ya tiene /Demos/, usar el path tal como está
      targetPath = path;
    } else if (path === '/') {
      // Es la raíz, agregar /Demos/
      targetPath = '/Demos/';
    } else {
      // Es una ruta específica, agregar /Demos antes
      targetPath = `/Demos${path}`;
    }
    
    const targetUrl = `https://adagi0.com${targetPath}`;
    
    console.log(`[Netlify Function] Redirecting to: ${targetUrl}`);
    
    return {
      statusCode: 200,
      headers: {
        'Location': targetUrl,
        'Content-Type': 'text/html'
      },
      body: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta http-equiv="refresh" content="0; url=${targetUrl}">
          <title>Redirecting...</title>
        </head>
        <body>
          <p>Redirecting to <a href="${targetUrl}">${targetUrl}</a></p>
          <script>window.location.href = "${targetUrl}";</script>
        </body>
        </html>
      `
    };
  }
  
  // Not a subdomain, continue normally
  return {
    statusCode: 404,
    body: 'Not found'
  };
};
