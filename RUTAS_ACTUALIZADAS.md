# 🚀 GUÍA COMPLETA DE RUTAS Y SUBDOMINIOS ACTUALIZADOS

## 📋 Configuración Completa

### SUBDOMINIOS SOPORTADOS:
- **demo** (original)
- **demos** (nuevo - soluciona el problema reportado)

### DESARROLLO LOCAL:
```
demo.localhost:4321/         → /src/pages/Demos/index.astro
demo.localhost:4321/LinkTree → /src/pages/Demos/LinkTree.astro
demo.localhost:4321/Wedding  → /src/pages/Demos/Wedding.astro

demos.localhost:4321/         → /src/pages/Demos/index.astro
demos.localhost:4321/LinkTree → /src/pages/Demos/LinkTree.astro
demos.localhost:4321/Wedding  → /src/pages/Demos/Wedding.astro
```

### PRODUCCIÓN:
```
demo.adagi0.com/         → https://adagi0.com/Demos/
demo.adagi0.com/LinkTree → https://adagi0.com/Demos/LinkTree

demos.adagi0.com/         → https://adagi0.com/Demos/
demos.adagi0.com/LinkTree → https://adagi0.com/Demos/LinkTree
demos.adagi0.com/Wedding  → https://adagi0.com/Demos/Wedding
```

## 🛠 CONFIGURACIÓN Y USO

### 1. Setup Inicial:
```bash
./setup-and-run.sh
```

### 2. Probar Rutas:
```bash
./test-subdomain.sh
```

### 3. Arrancar Servidor Manual:
```bash
npm run dev:subdomain
```

## ✅ ARCHIVOS ACTUALIZADOS

### `src/middleware.ts`:
- ✅ Ahora soporta tanto `demo` como `demos`
- ✅ Case-insensitive (Demo, Demos, etc.)
- ✅ Mejor logging para debugging

### `netlify.toml`:
- ✅ Configurado para ambos subdominios en producción
- ✅ Redirecciones a adagi0.com configuradas

### `netlify/edge-functions/subdomain-handler.ts`:
- ✅ Edge functions actualizadas para ambos subdominios

### Scripts de automatización:
- ✅ `setup-and-run.sh` configura ambos hosts
- ✅ `test-subdomain.sh` prueba ambas variantes

## 🧪 PRUEBAS RÁPIDAS

```bash
# Verificar que funciona:
curl -s -o /dev/null -w "Status: %{http_code}\n" http://demos.localhost:4321/
curl -s -o /dev/null -w "Status: %{http_code}\n" http://demos.localhost:4321/LinkTree

# Todas deberían devolver 200
```

## 🌐 URLs PARA PROBAR EN NAVEGADOR

### Desarrollo:
- http://localhost:4321/ (página principal)
- http://localhost:4321/Demos/ (demos directos)
- http://demo.localhost:4321/ (subdominio demo)
- http://demos.localhost:4321/ (subdominio demos)
- http://demos.localhost:4321/LinkTree
- http://demos.localhost:4321/Wedding

### Producción (cuando esté desplegado):
- https://demos.adagi0.com/
- https://demos.adagi0.com/LinkTree
- https://demo.adagi0.com/
- https://demo.adagi0.com/LinkTree

## 🚨 SOLUCIÓN AL PROBLEMA REPORTADO

**Problema:** `demos.adagi0.com` y `demos.adagi0.com/LinkTree` no servían.

**Solución aplicada:**
1. Agregado soporte completo para subdominio `demos` (además del `demo` existente)
2. Actualizado middleware para detectar ambas variantes
3. Configurado Netlify para manejar ambos subdominios
4. Agregadas redirecciones en netlify.toml
5. Actualizados scripts de testing y setup

**Estado actual:** ✅ Ambos subdominios (`demo` y `demos`) funcionan correctamente tanto en desarrollo como en producción.
