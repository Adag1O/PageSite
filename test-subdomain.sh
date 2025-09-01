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
    exit 1
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

# Probar subdomain
echo ""
echo "3. Probando subdominio..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "http://demo.localhost:4321/")
if [ "$RESPONSE" = "200" ]; then
    echo "   ✅ demo.localhost:4321/ funciona correctamente"
else
    echo "   ❌ demo.localhost:4321/ devuelve código: $RESPONSE"
fi

# Probar demo específico
echo ""
echo "4. Probando demo específico..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "http://demo.localhost:4321/LinkTree")
if [ "$RESPONSE" = "200" ]; then
    echo "   ✅ demo.localhost:4321/LinkTree funciona correctamente"
else
    echo "   ❌ demo.localhost:4321/LinkTree devuelve código: $RESPONSE"
fi

echo ""
echo "🎉 ¡Pruebas completadas!"
echo ""
echo "📋 URLs para probar en el navegador:"
echo "   → http://localhost:4321/"
echo "   → http://localhost:4321/Demos/"
echo "   → http://demo.localhost:4321/"
echo "   → http://demo.localhost:4321/LinkTree"
