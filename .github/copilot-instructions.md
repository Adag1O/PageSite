# Copilot Agent — Portfolio Jesus Velez

## Descripción del Proyecto
Portfolio personal y blog técnico de **Jesus Velez Soto** (alias ChuyDev), Ingeniero de Software Full-Stack con 3+ años de experiencia.  
URL de producción: `jesusvelez.xyz`  
Desplegado en **Netlify** con subdominio de blog en `blog.jesusvelez.xyz`.

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | **Astro 5** (`output: 'static'`) |
| UI | **React 19** (componentes interactivos) + `.astro` (estáticos) |
| Estilos | **Tailwind CSS v4** vía plugin `@tailwindcss/vite` |
| Contenido | **MDX** con Astro Content Collections |
| Tipografía | **Onest Variable** (`@fontsource-variable/onest`) |
| Adapter | `@astrojs/netlify` |
| Lenguaje | **TypeScript** estricto |
| Deploy | **Netlify** (CI/CD desde GitHub) |

---

## Estructura de Archivos

```
src/
├── components/
│   ├── Global/Logo.astro
│   ├── NavItem.astro
│   ├── LinkInline.astro
│   ├── Containers/
│   │   ├── Experience.astro   ← datos hardcoded de experiencia laboral
│   │   └── Proyects.astro     ← datos hardcoded de proyectos
│   └── Items/
│       ├── ExperienceItem.astro
│       ├── ProyectItem.astro
│       ├── Skill.tsx          ← tabs de skills (React)
│       └── Tags.tsx
│   └── Tools/
│       └── Icons.tsx          ← todos los SVG icons del proyecto
├── content/
│   ├── config.ts              ← schema: title, date, description, author, tags
│   └── posts/*.mdx            ← posts del blog técnico
├── layouts/
│   ├── Layout.astro           ← layout global con SEO completo
│   ├── BlogLayout.astro
│   └── PostLayout.astro
├── pages/
│   ├── index.astro            ← landing page principal
│   ├── about.astro
│   ├── DevBlog.astro
│   ├── sitemap.xml.ts
│   └── Blog/
│       ├── [slug].astro
│       └── Posts.astro
└── styles/
    ├── global.css
    └── blog.css
```

---

## Paleta de Colores Principal

| Token | Valor | Uso |
|-------|-------|-----|
| Primary | `#51E4B8` | Acento principal (teal/verde) |
| Dark Teal | `#21554E` | Fondo de gradientes y badges |
| Background | `#000` / `#0a0a0a` | Fondo oscuro |
| Text | `#ffffff` / `#e5e7eb` | Texto principal |

---

## Reglas y Convenciones de Código

### General
- **Idioma del código**: Inglés (variables, funciones, props). Los textos de UI pueden estar en español o inglés según la página.
- **Componentes estáticos** → `.astro`; **Componentes interactivos** → `.tsx` con directiva `client:load` o `client:visible`.
- Usar **Tailwind v4** utilitarios directamente. No crear clases CSS custom salvo en `global.css` o `blog.css`.
- Siempre mantener **accesibilidad**: atributos `aria-*`, `alt` en imágenes, roles semánticos HTML5.
- Exports de íconos en `src/components/Tools/Icons.tsx` — agregar aquí nuevos SVG icons.

### Astro
- Props con interfaz TypeScript en el frontmatter (`---`).
- Usar `Astro.props` desestructurado.
- Para datos estáticos de secciones (Experience, Projects), los arrays van en el frontmatter del componente Containers.
- `export const prerender = false` solo cuando se usa `Astro.locals` (middleware de subdominios).

### React / TSX
- Componentes funcionales con TypeScript estricto.
- Hooks estándar de React 19.
- No usar `any` — tipar todo correctamente.

### MDX Blog Posts
Schema obligatorio de frontmatter:
```yaml
---
title: "Título del post"
date: YYYY-MM-DD
description: "Descripción SEO (150-160 chars)"
author: "Jesus Velez"
tags: ["tag1", "tag2"]
---
```

---

## Experiencia Laboral Actual (para contexto de contenido)
- **Tata Consultancy Services** — Java Fullstack Engineer (Dic 2025–Presente): Java, Spring Boot, Datadog, JUnit, Mockito
- **AdagIO** — Freelance Fullstack & Embedded Developer (Dic 2024–Presente): Web apps, dispositivos embebidos Linux, Shopify, WordPress, Astro, Next.js
- **Continental R&D Guadalajara** — Software Engineer (Jun 2024): TBC/BMC modules, pruebas unitarias, integración de DB
- **Continental R&D Guadalajara** — SW Engineer Trainee (Abr 2022): Software Validation & Unit Tests

## Skills por Categoría (para contexto de contenido)
- **Microcontrollers**: ESP32, STM32, ATtiny85, Raspberry Pi, Microchip, NXP, TI
- **Languages**: C, C++, TypeScript, JavaScript, Java, Go, C#, Bash, GraphQL
- **Frameworks**: React, Next.js, Astro, Angular, Spring Boot, Flutter, Qt, LVGL, Tailwind
- **Tools**: Docker, GitHub, AWS, Nginx, Figma, Shopify, WordPress, Android, Windows, macOS

---

## Prioridades de Mejora

Cuando el usuario pida mejoras, seguir este orden de prioridades:
1. **Rendimiento**: Core Web Vitals (LCP, CLS, FID/INP), lazy loading, compresión de assets
2. **SEO**: Structured data (JSON-LD), canonical URLs, sitemap, meta tags
3. **Accesibilidad**: WCAG 2.1 AA, contraste, navegación por teclado
4. **Diseño**: Consistencia visual, animaciones, responsividad mobile-first
5. **Contenido**: Actualización de posts, nuevas secciones, copywriting

---

## Comandos del Proyecto

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Compilar para producción (astro check + astro build)
npm run preview  # Preview del build
```

---

## Notas Importantes
- El proyecto usa subdominio detection via `src/middleware.ts` (`Astro.locals.subdomain`).
- Los archivos `public/_redirects` manejan las redirecciones de Netlify.
- El `sitemap.xml.ts` genera el sitemap dinámicamente.
- Tailwind v4 **no usa** `tailwind.config.mjs` de la misma forma que v3 — la config está en el plugin de Vite y CSS.
- Al agregar animaciones, preferir `@keyframes` en `global.css` o clases de Tailwind.
