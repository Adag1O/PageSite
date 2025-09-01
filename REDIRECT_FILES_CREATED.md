# 📁 ARCHIVOS DE REDIRECCIÓN CREADOS

## ✅ Archivos creados/actualizados:

### 1. `public/_redirects`
- Maneja redirecciones client-side
- Configurado para demo.adagi0.com y demos.adagi0.com  
- Redirecciona a adagi0.com/Demos/*

### 2. `netlify/functions/subdomain-redirect.js`
- Función de Netlify para redirecciones server-side
- Backup en caso de que _redirects no funcione
- Maneja ambos subdominios (demo y demos)

### 3. `netlify.toml` (actualizado)
- Configuración principal de Netlify
- Redirecciones configuradas para producción
- Edge functions configuradas
- Backup function redirects agregadas

### 4. `netlify/edge-functions/subdomain-handler.ts` (existente)
- Edge function para procesamiento avanzado
- Ya configurada para ambos subdominios

### 5. `deploy-check.sh`
- Script para verificar configuración antes del deploy
- Chequea todos los archivos necesarios

## 🚀 Cómo usar:

### Para verificar configuración:
```bash
./deploy-check.sh
```

### Para deploy en Netlify:
1. Conecta el repositorio a Netlify
2. Los archivos de configuración están listos
3. Netlify detectará automáticamente:
   - `netlify.toml` para configuración
   - `public/_redirects` para redirecciones
   - Edge functions y Netlify functions

## 🌐 URLs que funcionarán:

**Desarrollo:**
- http://demos.localhost:4321/
- http://demo.localhost:4321/

**Producción (tras deploy):**
- https://demos.adagi0.com/ → https://adagi0.com/Demos/
- https://demo.adagi0.com/ → https://adagi0.com/Demos/
- https://demos.adagi0.com/LinkTree → https://adagi0.com/Demos/LinkTree
- https://demo.adagi0.com/LinkTree → https://adagi0.com/Demos/LinkTree

## ⚡ Múltiples capas de redirección:

1. **Edge Functions** (primera línea)
2. **_redirects file** (segundo nivel)  
3. **netlify.toml redirects** (tercer nivel)
4. **Netlify Functions** (backup)

Esto garantiza que los subdominios funcionen correctamente en todas las situaciones.
