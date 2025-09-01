#!/bin/bash

# Deploy script para Netlify con configuración de subdominios
echo "🚀 CONFIGURANDO DEPLOY PARA NETLIFY"
echo "====================================="

# 1. Build the project
echo "1. Building project..."
npm run build

# 2. Verificar archivos de redirección
echo ""
echo "2. Verificando archivos de redirección..."

if [ -f "public/_redirects" ]; then
    echo "   ✅ public/_redirects existe"
    echo "   📄 Contenido:"
    head -5 public/_redirects
else
    echo "   ❌ public/_redirects NO encontrado"
fi

if [ -f "netlify.toml" ]; then
    echo "   ✅ netlify.toml existe"
    echo "   📄 Edge functions configuradas:"
    grep -A 2 "edge_functions" netlify.toml || echo "   ⚠️  No edge functions encontradas"
else
    echo "   ❌ netlify.toml NO encontrado"
fi

if [ -f "netlify/functions/subdomain-redirect.js" ]; then
    echo "   ✅ Netlify function existe"
else
    echo "   ❌ Netlify function NO encontrada"
fi

if [ -f "netlify/edge-functions/subdomain-handler.ts" ]; then
    echo "   ✅ Edge function existe"
else
    echo "   ❌ Edge function NO encontrada"
fi

# 3. Verificar estructura dist
echo ""
echo "3. Verificando estructura de build..."
if [ -d "dist" ]; then
    echo "   ✅ Carpeta dist existe"
    if [ -d "dist/Demos" ]; then
        echo "   ✅ dist/Demos existe"
        ls -la dist/Demos/ | head -5
    else
        echo "   ❌ dist/Demos NO encontrada"
    fi
else
    echo "   ❌ Carpeta dist NO existe - ejecutar npm run build primero"
fi

echo ""
echo "🎯 RUTAS QUE DEBERÍAN FUNCIONAR TRAS EL DEPLOY:"
echo "   → https://demos.adagi0.com/"
echo "   → https://demos.adagi0.com/LinkTree"
echo "   → https://demo.adagi0.com/"  
echo "   → https://demo.adagi0.com/LinkTree"
echo ""
echo "✨ Ready for Netlify deploy!"
