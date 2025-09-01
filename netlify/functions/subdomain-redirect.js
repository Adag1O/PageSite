// Netlify Function for handling subdomain redirects
// This runs on Netlify Functions for server-side redirect logic

exports.handler = async (event, context) => {
  const { headers, path } = event;
  const host = headers.host || headers.Host;
  
  console.log(`[Netlify Function] Host: ${host}, Path: ${path}`);
  
  // Check if it's a subdomain request
  const subdomain = host.split('.')[0];
  
  if (subdomain === 'demo' || subdomain === 'demos') {
    // Redirect to main domain with /Demos/ prefix
    const targetPath = path === '/' ? '/Demos/' : `/Demos${path}`;
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
