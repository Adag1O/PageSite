---
description: 'Crea un nuevo blog post MDX con el formato correcto del portfolio'
tools: ['codebase', 'editFiles']
---

# Skill: Nuevo Blog Post

Crea un nuevo post para el blog técnico de Jesus Velez en `src/content/posts/`.

## Schema obligatorio del frontmatter

```yaml
---
title: "Título claro y descriptivo del post"
date: YYYY-MM-DD
description: "Descripción SEO de 150-160 caracteres que resume el contenido del post"
author: "Jesus Velez"
tags: ["tag1", "tag2", "tag3"]
---
```

## Convenciones de nombre de archivo
- `kebab-case` descriptivo: `nombre-del-tema-principal.mdx`
- Sin espacios ni caracteres especiales
- Máx. 5-6 palabras en el nombre

## Tags disponibles y recomendados

| Categoría | Tags sugeridos |
|-----------|---------------|
| Embebidos | `esp32`, `stm32`, `raspberry-pi`, `zephyr`, `rtos`, `linux-embebido` |
| Web Frontend | `astro`, `react`, `nextjs`, `tailwind`, `typescript` |
| Web Backend | `java`, `spring-boot`, `nodejs`, `go`, `rest-api` |
| DevOps | `docker`, `netlify`, `aws`, `nginx`, `ci-cd` |
| Herramientas | `vscode`, `git`, `linux`, `bash` |

## Estructura recomendada del post

```mdx
---
title: "..."
date: YYYY-MM-DD
description: "..."
author: "Jesus Velez"
tags: [...]
---

## Introducción

Breve contexto del problema o tema a tratar (2-3 párrafos).

## Prerequisitos

Lista de lo que el lector necesita saber o tener instalado.

## [Sección Principal 1]

Contenido técnico con ejemplos de código.

## [Sección Principal 2]

## Conclusión

Resumen de lo aprendido y próximos pasos.
```

## Estilo de escritura

- Tono: **técnico pero accesible** — no condescendiente
- Primera persona cuando sea relevante (experiencia personal)
- Bloques de código con el lenguaje especificado (\`\`\`bash, \`\`\`typescript, etc.)
- Imágenes: si las hay, van en `public/` y se referencian con ruta absoluta `/imagen.png`
- La UI del blog usa estilos de `src/styles/blog.css`

## Instrucciones de ejecución

1. Lee algunos posts existentes en `src/content/posts/` para entender el estilo
2. Usa el schema de `src/content/config.ts` para validar el frontmatter
3. Crea el archivo en `src/content/posts/nombre-del-post.mdx`
4. El post aparecerá automáticamente en la lista de `/DevBlog`

**Idioma por defecto**: Español, a menos que el usuario especifique inglés  
**Fecha**: Usar la fecha actual si no se especifica
