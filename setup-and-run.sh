#!/bin/bash

echo "🔧 CONFIGURANDO HOSTS PARA SUBDOMINIOS"
echo "======================================"

# Verificar si ya existe la entrada
if grep -q "demo.localhost" /etc/hosts; then
    echo "✅ demo.localhost ya está configurado en /etc/hosts"
else
    echo "📝 Agregando demo.localhost a /etc/hosts..."
    echo "127.0.0.1 demo.localhost" | sudo tee -a /etc/hosts
    echo "✅ demo.localhost agregado exitosamente"
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
