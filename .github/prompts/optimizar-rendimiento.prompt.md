---
description: 'Analiza y optimiza el rendimiento del portfolio (Core Web Vitals, lazy loading, assets)'
tools: ['codebase', 'editFiles', 'runCommands']
---

# Skill: Optimizar Rendimiento

Analiza el proyecto Astro portfolio de Jesus Velez enfocándote en **Core Web Vitals** y rendimiento general.

## Checklist de análisis

### LCP (Largest Contentful Paint)
- [ ] Imágenes del hero con `loading="eager"` y `fetchpriority="high"`
- [ ] Fuentes con `font-display: swap` y preload de `onest-variable`
- [ ] Eliminar render-blocking scripts

### CLS (Cumulative Layout Shift)
- [ ] Dimensiones explícitas `width` y `height` en todas las `<img>`
- [ ] Reservar espacio para fuentes antes de cargar (`size-adjust`)
- [ ] Evitar inserción dinámica de contenido sobre el fold

### INP / FID (Interactividad)
- [ ] Componentes React con `client:visible` en lugar de `client:load` donde sea posible
- [ ] Dividir bundle de `Skill.tsx` si supera 50 KB
- [ ] Lazy-load de íconos en `Icons.tsx` (tree shaking)

### Assets
- [ ] Usar `<Image />` de `astro:assets` en lugar de `<img>` raw
- [ ] Convertir imágenes a formato WebP/AVIF
- [ ] Comprimir SVG icons en `Icons.tsx`
- [ ] Revisar que `tailwind.config.mjs` tenga `content` correcto para purgar CSS

### Astro-específico
- [ ] Verificar que `output: 'static'` esté activo en `astro.config.mjs`
- [ ] Revisar si alguna página usa `prerender = false` innecesariamente
- [ ] Activar compresión en Netlify (`netlify.toml`)

## Instrucciones de ejecución

1. Lee los archivos clave: `astro.config.mjs`, `netlify.toml`, `src/layouts/Layout.astro`, `src/pages/index.astro`
2. Identifica los 3 problemas de rendimiento más críticos
3. Implementa las correcciones directamente en los archivos afectados
4. Explica el impacto esperado en métricas (LCP, CLS, INP)

**Paleta de colores**: `#51E4B8` (primary), `#21554E` (dark), `#000` (bg)  
**No romper** el diseño visual ni la funcionalidad del subdominio detection en `middleware.ts`
