#!/bin/bash

echo "🧪 PRUEBA RÁPIDA DE SUBDOMINIOS"
echo "==============================="

# Verificar hosts
echo "1. Verificando configuración de hosts..."
if grep -q "demo.localhost" /etc/hosts 2>/dev/null; then
    echo "   ✅ demo.localhost configurado correctamente"
else
    echo "   ❌ demo.localhost NO configurado"
    echo "   💡 Ejecuta: echo '127.0.0.1 demo.localhost' | sudo tee -a /etc/hosts"
fi

if grep -q "demos.localhost" /etc/hosts 2>/dev/null; then
    echo "   ✅ demos.localhost configurado correctamente"
else
    echo "   ❌ demos.localhost NO configurado"
    echo "   💡 Ejecuta: echo '127.0.0.1 demos.localhost' | sudo tee -a /etc/hosts"
fi

# Verificar si el servidor está corriendo
echo ""
echo "2. Verificando servidor..."
if curl -s -o /dev/null -w "%{http_code}" "http://localhost:4321/" | grep -q "200"; then
    echo "   ✅ Servidor corriendo en puerto 4321"
else
    echo "   ❌ Servidor NO está corriendo"
    echo "   💡 Ejecuta: npm run dev:subdomain"
    exit 1
fi

# Probar subdomain demo
echo ""
echo "3. Probando subdominio demo..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "http://demo.localhost:4321/")
if [ "$RESPONSE" = "200" ]; then
    echo "   ✅ demo.localhost:4321/ funciona correctamente"
else
    echo "   ❌ demo.localhost:4321/ devuelve código: $RESPONSE"
fi

# Probar subdomain demos
echo ""
echo "4. Probando subdominio demos..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "http://demos.localhost:4321/")
if [ "$RESPONSE" = "200" ]; then
    echo "   ✅ demos.localhost:4321/ funciona correctamente"
else
    echo "   ❌ demos.localhost:4321/ devuelve código: $RESPONSE"
fi

# Probar demo específico (LinkTree)
echo ""
echo "5. Probando demos específicos..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "http://demo.localhost:4321/LinkTree")
if [ "$RESPONSE" = "200" ]; then
    echo "   ✅ demo.localhost:4321/LinkTree funciona correctamente"
else
    echo "   ❌ demo.localhost:4321/LinkTree devuelve código: $RESPONSE"
fi

RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "http://demos.localhost:4321/LinkTree")
if [ "$RESPONSE" = "200" ]; then
    echo "   ✅ demos.localhost:4321/LinkTree funciona correctamente"
else
    echo "   ❌ demos.localhost:4321/LinkTree devuelve código: $RESPONSE"
fi

echo ""
echo "🎉 ¡Pruebas completadas!"
echo ""
echo "📋 URLs para probar en el navegador:"
echo "   → http://localhost:4321/"
echo "   → http://localhost:4321/Demos/"
echo "   → http://demo.localhost:4321/"
echo "   → http://demo.localhost:4321/LinkTree"
echo "   → http://demos.localhost:4321/"
echo "   → http://demos.localhost:4321/LinkTree"
