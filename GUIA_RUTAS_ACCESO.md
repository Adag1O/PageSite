# 🌐 Guía de Rutas y Acceso - Sistema de Subdominios

## 📍 **Rutas Funcionando**

### **URLs de Desarrollo:**
```
http://localhost:4321/                    → /src/pages/index.astro (Página principal)
http://localhost:4321/Demos/              → /src/pages/Demos/index.astro (Índice demos)
http://demo.localhost:4321/               → /src/pages/Demos/index.astro (Subdominio)
http://demo.localhost:4321/LinkTree       → /src/pages/Demos/LinkTree.astro (Demo)
```

### **URLs de Producción:**
```
https://yourdomain.com/                   → Página principal
https://yourdomain.com/Demos/             → Índice de demos
https://demo.yourdomain.com/              → Índice de demos (subdominio)
https://demo.yourdomain.com/LinkTree      → Demo LinkTree (subdominio)
```

---

## 🚀 **Cómo Acceder en Desarrollo**

### **Método Rápido (Recomendado):**
```bash
# Configurar hosts y ejecutar servidor automáticamente
chmod +x setup-and-run.sh
./setup-and-run.sh
```

### **Método Manual:**

1. **Configurar archivo hosts:**
   ```bash
   sudo nano /etc/hosts
   ```
   Agregar esta línea:
   ```
   127.0.0.1 demo.localhost
   ```

2. **Iniciar servidor:**
   ```bash
   npm run dev:subdomain
   ```

3. **Probar las rutas:**
   - `http://localhost:4321/` → Sitio principal (`/src/pages/index.astro`)
   - `http://localhost:4321/Demos/` → Demos directamente (`/src/pages/Demos/index.astro`)
   - `http://demo.localhost:4321/` → Subdominio demo (`/src/pages/Demos/index.astro`)
   - `http://demo.localhost:4321/LinkTree` → Demo LinkTree (`/src/pages/Demos/LinkTree.astro`)

### **Método 2: Configurar Hosts Local**
1. Edita el archivo hosts:
   ```bash
   sudo nano /etc/hosts
   ```

2. Agrega estas líneas:
   ```
   127.0.0.1   localhost
   127.0.0.1   demo.localhost
   127.0.0.1   yourdomain.local
   127.0.0.1   demo.yourdomain.local
   ```

3. Ejecuta:
   ```bash
   npm run dev:subdomain
   ```

4. Accede a:
   - `http://yourdomain.local:4321/` → `/src/pages/index.astro`
   - `http://demo.yourdomain.local:4321/` → `/src/pages/Demos/index.astro`
   - `http://demo.yourdomain.local:4321/LinkTree` → `/src/pages/Demos/LinkTree.astro`

---

## 🌍 **Configuración en Producción**

### **1. Configurar DNS**
En tu proveedor de DNS (Cloudflare, GoDaddy, etc.):

```dns
# Registro A o CNAME para dominio principal
yourdomain.com      A/CNAME    tu-servidor-netlify

# Registro CNAME para subdominio
demo                CNAME      yourdomain.com
# o
demo                CNAME      tu-sitio.netlify.app
```

### **2. Configurar Netlify**
1. En `netlify.toml`, reemplaza `yourdomain.com` con tu dominio real:
   ```toml
   [[redirects]]
     from = "https://demo.tudominio.com/*"
     to = "https://tudominio.com/Demos/:splat"
     status = 200
     force = true
   ```

2. En Netlify Dashboard:
   - Ve a Site Settings → Domain Management
   - Agrega `demo.tudominio.com` como dominio personalizado

---

## 🛠️ **Comandos de Desarrollo**

```bash
# Desarrollo normal
npm run dev

# Desarrollo con soporte de subdominios
npm run dev:subdomain

# Construcción para producción
npm run build

# Vista previa de producción
npm run preview
```

---

## 🔗 **Estructura de URLs**

### **Mapeo Automático**
| URL de Entrada | URL Real Servida | Archivo Servido | Descripción |
|----------------|------------------|-----------------|-------------|
| `demo.tudominio.com/` | `/Demos/` | `/src/pages/Demos/index.astro` | Índice de demos |
| `demo.tudominio.com/LinkTree` | `/Demos/LinkTree` | `/src/pages/Demos/LinkTree.astro` | Demo específico |
| `tudominio.com/Demos/` | `/Demos/` | `/src/pages/Demos/index.astro` | Acceso directo |

### **Mapeo de Desarrollo**
| URL Local | Archivo Servido | Descripción |
|-----------|-----------------|-------------|
| `http://demo.localhost:4321/` | `/src/pages/Demos/index.astro` | Índice de demos |
| `http://demo.localhost:4321/LinkTree` | `/src/pages/Demos/LinkTree.astro` | Demo LinkTree |
| `http://localhost:4321/Demos/` | `/src/pages/Demos/index.astro` | Acceso directo a demos |
| `http://localhost:4321/Demos/LinkTree` | `/src/pages/Demos/LinkTree.astro` | Demo directo |

### **Redirecciones Automáticas**
- Si accedes a `demo.tudominio.com/algo` → se sirve desde `/Demos/algo`
- Los enlaces se ajustan automáticamente según el contexto

---

## 🧪 **Probar el Sistema**

### **Test Local:**
```bash
# Terminal 1: Ejecutar servidor
npm run dev:subdomain

# Terminal 2: Probar con curl
curl -H "Host: demo.localhost" http://localhost:4321/
curl -H "Host: localhost" http://localhost:4321/Demos/
```

### **Test con Navegador:**
1. Abre `http://localhost:4321/` → Sitio principal (`/src/pages/index.astro`)
2. Abre `http://localhost:4321/Demos/` → Demos directos (`/src/pages/Demos/index.astro`)
3. Configura hosts y prueba:
   - `http://demo.localhost:4321/` → `/src/pages/Demos/index.astro`
   - `http://demo.localhost:4321/LinkTree` → `/src/pages/Demos/LinkTree.astro`

---

## 🔧 **Resolución de Problemas**

### **Error: "Subdomain no funciona"**
1. **Verificar hosts:**
   ```bash
   cat /etc/hosts | grep demo
   # Debe mostrar: 127.0.0.1 demo.localhost
   ```

2. **Verificar servidor:**
   ```bash
   npm run dev:subdomain
   # Debe mostrar: Local: http://localhost:4321/
   #               Network: http://0.0.0.0:4321/
   ```

3. **Probar conectividad:**
   ```bash
   curl -v "http://demo.localhost:4321/"
   # Debe devolver contenido HTML de /src/pages/Demos/index.astro
   ```

### **Error: "404 Not Found"**
- Asegúrate de que existe `/src/pages/Demos/index.astro`
- Verifica que existe `/src/pages/Demos/LinkTree.astro`
- Reinicia el servidor: `Ctrl+C` y luego `npm run dev:subdomain`

### **Error: "Cannot resolve host demo.localhost"**
1. **Verificar DNS local:**
   ```bash
   nslookup demo.localhost
   # Debe resolver a 127.0.0.1
   ```

2. **Limpiar cache DNS:**
   ```bash
   # En macOS:
   sudo dscacheutil -flushcache
   
   # En Linux:
   sudo systemctl restart systemd-resolved
   ```

### **Error: "Connection refused"**
- Verifica que el puerto 4321 no esté siendo usado:
  ```bash
  lsof -i :4321
  ```
- Usa un puerto diferente:
  ```bash
  astro dev --host 0.0.0.0 --port 3000
  ```

---

## 📝 **Agregar Nuevas Demos**

1. Crear archivo en `/src/pages/Demos/NuevoDemo.astro`
2. Agregar entrada en `/src/pages/Demos/index.astro`:
   ```javascript
   const demoRoutes = [
       // ...existing demos...
       {
           name: "Nuevo Demo",
           path: "/NuevoDemo",
           description: "Descripción del demo",
           category: "Categoría"
       }
   ];
   ```
3. La nueva demo estará disponible en:
   - `tudominio.com/Demos/NuevoDemo`
   - `demo.tudominio.com/NuevoDemo`

---

## 🎯 **URLs de Ejemplo Completas**

### **Desarrollo:**
- `http://localhost:4321/` → Sitio principal
- `http://localhost:4321/Demos/` → Índice demos
- `http://demo.localhost:4321/` → Subdominio demos

### **Producción:**
- `https://adagi0.com/` → Sitio principal
- `https://adagi0.com/Demos/` → Acceso directo a demos
- `https://demo.adagi0.com/` → Subdominio dedicado

---

## ⚡ **INICIO RÁPIDO**

### **Para desarrolladores impacientes:**
```bash
# 1. Configurar y ejecutar todo de una vez
./setup-and-run.sh

# 2. Probar que todo funcione
./test-subdomain.sh

# 3. Abrir en navegador:
#    http://demo.localhost:4321/
#    http://demo.localhost:4321/LinkTree
```

### **Si algo no funciona:**
1. **Verificar que demo.localhost esté en hosts:**
   ```bash
   grep demo.localhost /etc/hosts
   # Debe mostrar: 127.0.0.1 demo.localhost
   ```

2. **Agregar manualmente si no existe:**
   ```bash
   echo '127.0.0.1 demo.localhost' | sudo tee -a /etc/hosts
   ```

3. **Iniciar servidor con subdominios:**
   ```bash
   npm run dev:subdomain
   ```

4. **Probar en terminal:**
   ```bash
   curl "http://demo.localhost:4321/"
   # Debe devolver HTML de la página de demos
   ```

### **Archivos creados/modificados:**
- ✅ `/src/middleware.ts` - Manejo de subdominios
- ✅ `/astro.config.mjs` - Configuración del servidor
- ✅ `/netlify.toml` - Configuración de producción
- ✅ `/src/env.d.ts` - Tipos TypeScript
- ✅ `setup-and-run.sh` - Script de configuración automática
- ✅ `test-subdomain.sh` - Script de pruebas
