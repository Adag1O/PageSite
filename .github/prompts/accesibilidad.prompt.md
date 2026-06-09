---
description: 'Audita y mejora la accesibilidad del portfolio (WCAG 2.1 AA)'
tools: ['codebase', 'editFiles']
---

# Skill: Accesibilidad (WCAG 2.1 AA)

Audita y mejora la accesibilidad del portfolio de Jesus Velez según estándares **WCAG 2.1 nivel AA**.

## Checklist de auditoría

### 1. Contraste de Color (WCAG 1.4.3)
- [ ] Ratio mínimo **4.5:1** para texto normal, **3:1** para texto grande (>18px)
- [ ] Verificar `#51E4B8` sobre `#000` → ratio: ~10:1 ✅
- [ ] Verificar texto `#e5e7eb` sobre `#0a0a0a` → ~15:1 ✅
- [ ] Alertar si algún texto claro sobre fondo teal no cumple el ratio

### 2. Navegación por Teclado (WCAG 2.1.1)
- [ ] Todos los elementos interactivos accesibles con Tab/Enter/Space
- [ ] Focus visible (`focus:ring-2 focus:ring-[#51E4B8]`) en todos los botones y links
- [ ] Menú móvil (`#mobile-menu` en `index.astro`) navegable con teclado y Escape para cerrar
- [ ] `Skill.tsx` tabs accesibles con flechas del teclado (`role="tablist"`, `role="tab"`)

### 3. Atributos ARIA
- [ ] `aria-label` en botones que solo tienen íconos (hamburger menu, close button)
- [ ] `aria-expanded` en botones que abren/cierran paneles
- [ ] `aria-current="page"` en NavItem activo
- [ ] `role="tablist"` / `role="tab"` / `role="tabpanel"` en `Skill.tsx`

### 4. Imágenes y Media (WCAG 1.1.1)
- [ ] Atributo `alt` descriptivo en todas las imágenes (no vacío a menos que sean decorativas)
- [ ] Imágenes decorativas con `alt=""` y `role="presentation"`
- [ ] Íconos SVG con `aria-hidden="true"` si son decorativos

### 5. Semántica HTML (WCAG 1.3.1)
- [ ] Un solo `<h1>` por página
- [ ] Jerarquía de headings correcta (H1 → H2 → H3, sin saltos)
- [ ] `<nav>` con `aria-label` único por página
- [ ] `<main>` envolviendo el contenido principal
- [ ] `<footer>` en el layout global

### 6. Formularios (si aplica)
- [ ] `<label>` asociado a cada `<input>` con `htmlFor`
- [ ] Mensajes de error descriptivos

### 7. Movimiento (WCAG 2.3.3)
- [ ] Respetar `prefers-reduced-motion` para animaciones en `global.css`

## Corrección de `prefers-reduced-motion` en `global.css`

Si no existe, agregar:
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Instrucciones de ejecución

1. Lee `src/pages/index.astro`, `src/layouts/Layout.astro`, `src/components/Items/Skill.tsx`
2. Identifica los 3 problemas de accesibilidad más críticos
3. Implementa correcciones directamente con Tailwind / atributos HTML/ARIA
4. Priorizar: teclado > contraste > ARIA > semántica

**Stack**: Astro + React + Tailwind CSS v4  
**Target**: WCAG 2.1 Nivel AA  
**NO** cambiar el diseño visual — solo mejoras de accesibilidad semántica
