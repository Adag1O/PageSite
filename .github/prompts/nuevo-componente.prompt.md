---
description: 'Crea un nuevo componente Astro o React para el portfolio'
tools: ['codebase', 'editFiles']
---

# Skill: Nuevo Componente

Crea un nuevo componente para el portfolio de Jesus Velez siguiendo las convenciones del proyecto.

## Decisión: ¿Astro o React?

| Criterio | Usar `.astro` | Usar `.tsx` |
|----------|--------------|------------|
| Interactividad | Sin estado/eventos | Con estado, hooks, eventos |
| Directiva Astro | — | `client:load` o `client:visible` |
| Ejemplos existentes | `NavItem`, `ExperienceItem`, `Logo` | `Skill`, `Tags` |
| Hidratación | No (HTML puro) | Sí (isla React) |

**Regla general**: Si el componente necesita `useState`, `useEffect` o event handlers → `.tsx`. Si es solo presentacional → `.astro`.

## Plantilla Componente Astro

```astro
---
interface Props {
  title: string;
  description?: string;
  // ... más props con tipos estrictos
}

const { title, description = "valor por defecto" } = Astro.props;
---

<div class="...clases de Tailwind...">
  <h2>{title}</h2>
  {description && <p>{description}</p>}
</div>
```

## Plantilla Componente React TSX

```tsx
import { useState } from "react";

interface Props {
  initialValue: string;
  onAction?: (value: string) => void;
}

export default function MiComponente({ initialValue, onAction }: Props) {
  const [value, setValue] = useState(initialValue);

  return (
    <div className="...clases de Tailwind...">
      {/* contenido */}
    </div>
  );
}
```

## Convenciones de código

- **Nombres**: PascalCase para archivos y componentes (`MiComponente.astro`)
- **Props**: Interfaz TypeScript siempre definida, sin `any`
- **Estilos**: Tailwind CSS v4 utilitarios. Paleta: `#51E4B8` primary, `#000` bg
- **Accesibilidad**: `aria-label` en botones sin texto visible, `alt` en imágenes, roles HTML5 semánticos
- **Íconos**: Importar de `src/components/Tools/Icons.tsx`, agregar nuevos allí si no existen

## Ubicación de archivos

| Tipo | Carpeta |
|------|---------|
| Componente contenedor (sección de página) | `src/components/Containers/` |
| Componente item/tarjeta | `src/components/Items/` |
| Componente global (nav, footer, logo) | `src/components/Global/` |
| Utilitario/helper visual | `src/components/` |
| Íconos SVG | `src/components/Tools/Icons.tsx` |

## Instrucciones de ejecución

1. Determina si el componente necesita interactividad → Astro vs React
2. Lee componentes similares existentes para mantener consistencia visual
3. Crea el archivo en la carpeta correcta con el nombre en PascalCase
4. Si es un React component, asegúrate de que quien lo use añada `client:visible` o `client:load`
5. Asegúrate de tipar todas las props

**Paleta**: `#51E4B8` (primary teal), `#21554E` (dark teal), `#000`/`#0a0a0a` (bg), `#fff` (text)  
**NO** crear clases CSS custom — solo Tailwind utilitarios (salvo `global.css` / `blog.css`)
