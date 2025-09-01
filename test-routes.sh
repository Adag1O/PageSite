#!/bin/bash

# Script para probar todas las rutas del sistema de subdominios
# Uso: ./test-routes.sh

echo "🧪 PROBANDO SISTEMA DE RUTAS Y SUBDOMINIOS"
echo "=========================================="

# Configuración
PORT=4321
HOST="localhost"
DEMO_HOST="demo.localhost"

echo ""
echo "📋 RUTAS A PROBAR:"
echo "  ✓ http://$HOST:$PORT/ (Principal)"
echo "  ✓ http://$HOST:$PORT/Demos/ (Demos directos)"
echo "  ✓ http://$DEMO_HOST:$PORT/ (Subdominio demo)"
echo "  ✓ http://$DEMO_HOST:$PORT/LinkTree (Demo específico)"
echo ""

# Función para probar una URL
test_url() {
    local url=$1
    local description=$2
    echo -n "Probando $description... "
    
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200\|302"; then
        echo "✅ OK"
    else
        echo "❌ FALLO"
    fi
}

echo "🚀 INICIANDO PRUEBAS:"
echo ""

# Probar rutas principales
test_url "http://$HOST:$PORT/" "Página principal"
test_url "http://$HOST:$PORT/Demos/" "Índice de demos"

# Probar subdominio (requiere configuración de hosts)
echo ""
echo "🌐 PRUEBAS DE SUBDOMINIO:"
echo "   (Requiere: echo '127.0.0.1 demo.localhost' >> /etc/hosts)"

test_url "http://$DEMO_HOST:$PORT/" "Subdominio demo - índice"
test_url "http://$DEMO_HOST:$PORT/LinkTree" "Subdominio demo - LinkTree"

echo ""
echo "📝 COMANDOS ÚTILES:"
echo ""
echo "# Agregar hosts para pruebas locales:"
echo "sudo echo '127.0.0.1 demo.localhost' >> /etc/hosts"
echo ""
echo "# Iniciar servidor con soporte de subdominios:"
echo "npm run dev:subdomain"
echo ""
echo "# Probar con navegador:"
echo "open http://localhost:4321/"
echo "open http://demo.localhost:4321/"
echo ""

# Mostrar información de configuración actual
echo "⚙️  CONFIGURACIÓN ACTUAL:"
echo "   Puerto: $PORT"
echo "   Host principal: $HOST"
echo "   Host demo: $DEMO_HOST"
echo ""

# Verificar si el servidor está corriendo
if curl -s "http://$HOST:$PORT/" > /dev/null; then
    echo "✅ Servidor está corriendo en puerto $PORT"
else
    echo "⚠️  Servidor NO está corriendo. Ejecuta: npm run dev:subdomain"
fi
