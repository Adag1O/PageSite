---
description: 'Mejora o actualiza el contenido del portfolio (textos, proyectos, experiencia)'
tools: ['codebase', 'editFiles']
---

# Skill: Mejorar Contenido

Actualiza y mejora el contenido del portfolio de **Jesus Velez Soto** (ChuyDev).

## Contexto del Autor

- **Nombre**: Jesus Velez Soto (alias: ChuyDev)
- **Rol**: Ingeniero de Software Full-Stack, 3+ años de experiencia
- **URL**: `jesusvelez.xyz` / `blog.jesusvelez.xyz`

## Experiencia Laboral Actual

| Empresa | Rol | Período | Stack |
|---------|-----|---------|-------|
| Tata Consultancy Services | Java Fullstack Engineer | Dic 2025–Presente | Java, Spring Boot, Datadog, JUnit, Mockito |
| AdagIO | Freelance Fullstack & Embedded Dev | Dic 2024–Presente | Astro, Next.js, Shopify, WordPress, Linux embebido |
| Continental R&D Guadalajara | Software Engineer | Jun 2024 | TBC/BMC, Unit Tests, DB integration |
| Continental R&D Guadalajara | SW Engineer Trainee | Abr 2022 | Software Validation & Unit Tests |

## Skills por Categoría

- **Microcontrollers**: ESP32, STM32, ATtiny85, Raspberry Pi, Microchip, NXP, TI
- **Languages**: C, C++, TypeScript, JavaScript, Java, Go, C#, Bash, GraphQL
- **Frameworks**: React, Next.js, Astro, Angular, Spring Boot, Flutter, Qt, LVGL, Tailwind
- **Tools**: Docker, GitHub, AWS, Nginx, Figma, Shopify, WordPress, Android, Windows, macOS

## Áreas de contenido a mejorar

### 1. Copywriting del Hero (`src/pages/index.astro`)
- Headline que capture atención en < 5 segundos
- Propuesta de valor clara: qué hace Jesus y qué problema resuelve
- CTA (Call to Action) relevante (contacto, ver proyectos)

### 2. Sección de Proyectos (`src/components/Containers/Proyects.astro`)
- Descripción del impacto de cada proyecto (no solo el qué, sino el por qué)
- Stack tecnológico visible con iconos
- Links a demo / GitHub (si existen)

### 3. Sección de Experiencia (`src/components/Containers/Experience.astro`)
- Bullets de logros cuantificables cuando sea posible (ej: "Migré X servicios reduciendo tiempo de build en Y%")
- Orden cronológico inverso (más reciente primero) — ya está correcto

### 4. Página About (`src/pages/about.astro`)
- Historia personal concisa y auténtica
- Intereses fuera del trabajo (humaniza el perfil)
- Foto de perfil con descripción `alt` apropiada

### 5. Bio Meta / SEO copy
- `description` en `Layout.astro` debe ser 150-160 chars
- `keywords` relevantes sin keyword stuffing

## Instrucciones de ejecución

1. Lee el archivo relevante para el área de mejora solicitada
2. Propón mejoras concretas de copy manteniendo el tono profesional pero cercano
3. Implementa los cambios directamente
4. Los textos de UI pueden estar en **español o inglés** según el contexto de la página
