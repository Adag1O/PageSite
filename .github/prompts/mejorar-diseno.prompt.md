---
description: 'Mejora el diseño visual, animaciones y responsividad del portfolio'
tools: ['codebase', 'editFiles']
---

# Skill: Mejorar Diseño

Mejora el diseño visual del portfolio de Jesus Velez manteniendo la identidad de marca.

## Identidad Visual

| Token | Valor | Uso |
|-------|-------|-----|
| Primary | `#51E4B8` | Acento teal — botones, highlights, bordes activos |
| Dark Teal | `#21554E` | Gradientes, badges de tecnologías |
| Background | `#000` / `#0a0a0a` | Fondo oscuro principal |
| Text | `#ffffff` / `#e5e7eb` | Texto principal / secundario |

## Áreas de mejora por prioridad

### 1. Responsividad Mobile-First
- Verificar breakpoints `sm:`, `md:`, `lg:` en todos los componentes
- Menú móvil (`mobile-menu` en `index.astro`) — revisar transiciones
- Texto legible en pantallas < 375px (sin overflow horizontal)

### 2. Animaciones y Transiciones
- Agregar animaciones de entrada para secciones (scroll-triggered con `IntersectionObserver`)
- Hover states consistentes en cards de proyectos y experiencia
- Micro-interacciones en botones y links con `transition-all duration-300`
- Usar `@keyframes` en `global.css` para animaciones reutilizables

### 3. Cards y Componentes
- `ExperienceItem.astro` — mejorar jerarquía visual (fecha, empresa, título)
- `ProyectItem.astro` — añadir efecto hover con elevación (shadow + scale)
- `Skill.tsx` — mejorar tabs con indicador animado deslizable

### 4. Tipografía
- Jerarquía clara: H1 → H2 → H3 → body con escala modular
- Fuente: **Onest Variable** ya instalada (`@fontsource-variable/onest`)
- Line-height y letter-spacing optimizados para legibilidad

### 5. Consistencia Visual
- Revisar espaciado entre secciones (múltiplos de 8px)
- Bordes y radios consistentes (`rounded-xl` como estándar)
- Gradients sutiles en fondos de sección para profundidad

## Instrucciones de ejecución

1. Lee `src/pages/index.astro`, `src/components/Items/`, `src/styles/global.css`
2. Identifica el mayor problema de diseño actual
3. Implementa la mejora usando **Tailwind v4** utilitarios (no crear CSS custom salvo en `global.css`)
4. Asegúrate de que funcione tanto en mobile como en desktop

**Stack de estilos**: Tailwind CSS v4 via `@tailwindcss/vite` — NO usar `tailwind.config.mjs` para temas  
**NO** cambiar la paleta de colores principal sin permiso explícito
