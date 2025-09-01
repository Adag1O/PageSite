#!/bin/bash

echo "🔧 CONFIGURANDO HOSTS PARA SUBDOMINIOS"
echo "======================================"

# Configurar hosts para desarrollo con subdominios
echo "Configurando hosts para desarrollo..."
if ! grep -q "demo.localhost" /etc/hosts; then
    sudo bash -c 'echo "127.0.0.1 demo.localhost" >> /etc/hosts'
    echo "✓ Agregado demo.localhost a /etc/hosts"
else
    echo "✓ demo.localhost ya está en /etc/hosts"
fi

if ! grep -q "demos.localhost" /etc/hosts; then
    sudo bash -c 'echo "127.0.0.1 demos.localhost" >> /etc/hosts'
    echo "✓ Agregado demos.localhost a /etc/hosts"
else
    echo "✓ demos.localhost ya está en /etc/hosts"
fi

echo ""
echo "🚀 INICIANDO SERVIDOR CON SOPORTE DE SUBDOMINIOS"
echo "==============================================="

# Iniciar servidor
echo "Ejecutando: npm run dev:subdomain"
echo ""
echo "📋 URLs disponibles después del inicio:"
echo "  ✓ http://localhost:4321/                 → Sitio principal"
echo "  ✓ http://localhost:4321/Demos/           → Demos directos"
echo "  ✓ http://demo.localhost:4321/            → Subdominio demo"
echo "  ✓ http://demo.localhost:4321/LinkTree    → Demo LinkTree"
echo ""

npm run dev:subdomain
