---
description: 'Optimiza SEO técnico y structured data del portfolio'
tools: ['codebase', 'editFiles']
---

# Skill: Optimizar SEO

Optimiza el SEO técnico del portfolio de Jesus Velez (`jesusvelez.xyz`).

## Estado actual del SEO

El proyecto ya tiene:
- ✅ Meta tags básicos en `Layout.astro` (title, description, keywords)
- ✅ Open Graph y Twitter Card
- ✅ Canonical URLs
- ✅ `robots.txt` en `public/`
- ✅ `sitemap.xml.ts` dinámico
- ✅ `site.webmanifest`
- ⚠️ Sin JSON-LD structured data
- ⚠️ Sin breadcrumbs en blog posts
- ⚠️ Sin schema de `BlogPosting` en posts MDX

## Mejoras a implementar

### 1. JSON-LD Structured Data
Agregar en `Layout.astro` (página principal):
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Jesus Velez Soto",
  "url": "https://jesusvelez.xyz",
  "jobTitle": "Full-Stack Software Engineer",
  "sameAs": ["https://github.com/ChuyDev", "https://linkedin.com/in/jesus-velez-soto-28ab11156/"]
}
```

### 2. Schema BlogPosting para Posts MDX
Agregar en `PostLayout.astro`:
```json
{
  "@type": "BlogPosting",
  "headline": "<title>",
  "author": { "@type": "Person", "name": "Jesus Velez" },
  "datePublished": "<date>",
  "description": "<description>"
}
```

### 3. Meta Tags faltantes
- `<meta name="generator" content="Astro">` (ya lo agrega Astro automáticamente)
- `<meta name="category" content="technology">` en el blog
- `<link rel="alternate" type="application/rss+xml">` si se implementa RSS

### 4. Sitemap
- Verificar que `sitemap.xml.ts` incluye todos los posts del blog
- Agregar `lastmod` con fecha real de modificación
- Prioridades: `1.0` para index, `0.8` para about, `0.7` para posts

### 5. Performance SEO
- Verificar que `robots.txt` permite indexación correcta
- `preconnect` a fonts en `<head>` de `Layout.astro`

## Instrucciones de ejecución

1. Lee `src/layouts/Layout.astro` y `src/layouts/PostLayout.astro`
2. Lee `src/pages/sitemap.xml.ts` para entender la generación actual
3. Implementa JSON-LD en los layouts correspondientes
4. Verifica que no haya duplicados de meta tags

**URL canónica**: `https://jesusvelez.xyz`  
**Blog URL**: `https://blog.jesusvelez.xyz`  
**NO** sobreescribir los meta tags existentes, solo complementar con structured data
