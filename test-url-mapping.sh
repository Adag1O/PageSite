#!/bin/bash

# Test de mapeo de URLs para subdominios
echo "🧪 TESTING URL MAPPING LOGIC"
echo "============================="

echo "📝 Expected mappings:"
echo "   www.demo.adagi0.com/         → adagi0.com/Demos/"
echo "   www.demo.adagi0.com/Wedding  → adagi0.com/Demos/Wedding"
echo "   www.demo.adagi0.com/LinkTree → adagi0.com/Demos/LinkTree"
echo "   demo.adagi0.com/Wedding      → adagi0.com/Demos/Wedding"
echo "   demos.adagi0.com/Wedding     → adagi0.com/Demos/Wedding"
echo ""

# Test the logic using Node.js
node -e "
// Simulate the subdomain detection and path mapping
function testUrlMapping(hostname, pathname) {
  const parts = hostname.split('.');
  let subdomain = null;
  
  if (parts.length > 2) {
    if (parts[0] === 'www' && parts.length > 3) {
      subdomain = parts[1];
    } else if (parts[0] !== 'www') {
      subdomain = parts[0];
    }
  }
  
  if (subdomain === 'demo' || subdomain === 'demos') {
    let targetPath;
    if (pathname.startsWith('/Demos/')) {
      targetPath = pathname;
    } else if (pathname === '/') {
      targetPath = '/Demos/';
    } else {
      targetPath = \`/Demos\${pathname}\`;
    }
    return \`https://adagi0.com\${targetPath}\`;
  }
  return 'No redirect';
}

// Test cases
const tests = [
  ['www.demo.adagi0.com', '/'],
  ['www.demo.adagi0.com', '/Wedding'],
  ['www.demo.adagi0.com', '/LinkTree'],
  ['demo.adagi0.com', '/Wedding'],
  ['demos.adagi0.com', '/Wedding'],
  ['www.demos.adagi0.com', '/Wedding']
];

console.log('🔍 Testing URL mapping logic:');
tests.forEach(([hostname, pathname]) => {
  const result = testUrlMapping(hostname, pathname);
  console.log(\`   \${hostname}\${pathname} → \${result}\`);
});
"

echo ""
echo "✅ Logic verification complete!"
