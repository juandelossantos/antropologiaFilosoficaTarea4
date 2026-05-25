# Spec: Diálogo Ancestral — Tarea 4 Antropología Filosófica

## Objective

Construir una landing page interactiva y responsiva que presente el diálogo intercultural entre las cosmovisiones Muisca e Iku, integrando autores filosóficos (Cassirer, Panikkar, Aristóteles), para la Tarea 4 de la asignatura 407011 Antropología Filosófica de la UNAD. La experiencia debe ser académicamente rigurosa, visualmente impactante y navegable sin fricción tanto en desktop (scroll horizontal con snap) como en móvil (bottom tab bar + scroll vertical nativo).

**Usuario final:** Tutora evaluadora (Marisol Erazo) y compañeros de curso.  
**Meta:** Obtener nota académica destacada generando impacto emocional real en quien visita la página.

## Research Context

- **Domain insight:** Las landing pages con scroll horizontal son efectivas para narrativas inmersivas tipo "scrollytelling", pero en móvil el scroll horizontal es un anti-patrón de UX. La solución adoptada (horizontal desktop / vertical móvil) es un patrón de diseño responsive conocido como "graceful degradation" que maximiza la experiencia en cada viewport.
- **Technology context:** GitHub Pages hostea nativamente HTML/CSS/JS estáticos sin build step. Esto elimina complejidad de CI/CD y asegura compatibilidad total. CSS moderno (`scroll-snap-type`, `clamp()`, `@media`, variables CSS) permite animaciones y layouts sofisticados sin dependencias de JavaScript.
- **Risks identified:**
  - Scroll horizontal puede generar problemas de accesibilidad si no hay navegación alternativa (menú superior).
  - Imágenes de fondo pueden dificultar legibilidad sin overlay adecuado.
  - Deadline ajustado (un solo día) implica priorizar funcionalidad core sobre refinamientos visuales extremos.

## Architecture Decisions

- **Chosen: HTML5 + CSS3 + Vanilla JS** — Porque es un proyecto estático de una sola página, no requiere estado complejo ni interacciones de usuario masivas. Elimina build step, compatible 100% con GitHub Pages, máxima velocidad de desarrollo hoy.
- **Rejected: React/Vite/Next.js** — Añaden complejidad de configuración, build time y bundle size innecesarios para una landing estática. El beneficio de componentes no compensa el overhead en un proyecto de un solo archivo HTML.
- **Rejected: Frameworks CSS (Bootstrap, Tailwind)** — Para una paleta editorial personalizada y animaciones CSS nativas, el CSS puro ofrece más control directo sin clases de utilidad que oscurecen la intención de diseño.
- **Trade-offs aceptados:** Menos reutilización de componentes (irrelevante, es una sola página). Mayor responsabilidad de organización CSS manual (mitigado con BEM-like naming y variables CSS).

## Tech Stack

- **Frontend:** HTML5 (semántico), CSS3 (variables, flexbox, grid, scroll-snap, media queries), Vanilla ES6+
- **Backend:** Ninguno — sitio estático.
- **Base de datos:** Ninguna.
- **Autenticación:** Ninguna.
- **Hosting:** GitHub Pages (desde rama `main`, carpeta raíz).
- **Testing:** Validación manual responsive + Lighthouse CI (opcional, si hay tiempo).
- **Control de versiones:** Git.

## Commands

```bash
# Desarrollo local (abrir archivo directamente o usar servidor simple)
python3 -m http.server 8000
# o
npx serve .

# Verificación de responsive (Lighthouse)
npx lighthouse http://localhost:8000 --view

# Deploy a GitHub Pages (push a main)
git add .
git commit -m "feat: implement landing page v1"
git push origin main
```

## Project Structure

```
/
├── index.html              → Documento único con 7 secciones
├── assets/
│   ├── css/
│   │   └── style.css       → Estilos globales, variables, componentes
│   ├── js/
│   │   └── main.js         → Navegación, scroll snap helper, tab bar móvil
│   └── images/
│       ├── tab1-umbral.jpg
│       ├── tab2-mhuysqa.jpg
│       ├── tab3-iku.jpg
│       ├── tab4-simbolico.jpg
│       ├── tab5-comparacion.jpg
│       ├── tab6-conclusion.jpg
│       └── tab7-biblioteca.jpg
├── development/
│   ├── IDEA-REFINED.md     → Refinamiento de idea aprobado
│   └── PROMPTS.md          → Prompts de imagen mejorados
└── SPEC.md                 → Este documento
```

## Code Style

```css
/* Ejemplo de calidad esperada: variables CSS + BEM-like naming */
.section--hero {
  background-image: var(--bg-image);
  background-size: cover;
}

.section__title {
  font-family: var(--font-serif);
  color: var(--text-primary);
}
```

- **Naming:** Clases CSS con BEM-like (`block__element--modifier`). IDs para anclajes de navegación (`#inicio`, `#mhuysqa`).
- **Variables CSS:** Todas las decisiones de color, tipografía y espaciado en `:root`. Cero valores hardcodeados en selectores.
- **Comentarios:** Explican "por qué", no "qué". Ej: `/* Overlay oscuro para garantizar contraste WCAG AA sobre imágenes */`
- **No código comentado:** Limpiar antes de commit.
- **Semántica HTML:** Usar `<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`, `<blockquote>`.

## Testing Strategy

- **Manual Responsive:** Verificar en Chrome DevTools con viewports: 320px (móvil pequeño), 768px (tablet), 1440px (desktop).
- **Navegación:** Confirmar que cada link del header y bottom tab bar salta a la sección correcta.
- **Contraste:** Revisar con herramienta de browser que texto sobre imágenes cumple ratio mínimo 4.5:1.
- **Accesibilidad:** `alt` descriptivo en todas las imágenes, `aria-label` en botones de navegación móvil.
- **Performance:** Lighthouse score objetivo: >90 en Performance, >100 en Accessibility.

## Acceptance Criteria

- [ ] La página contiene exactamente 7 secciones (`#inicio`, `#mhuysqa`, `#iku`, `#filosofia`, `#comparacion`, `#conclusion`, `#biblioteca`).
- [ ] Header fijo visible en desktop y oculto (o transformado) en móvil. Contiene título a la izquierda y menú de navegación a la derecha (Inicio | Mhuysqa | Iku | Filosofía | Comparación | Conclusión | Biblioteca).
- [ ] Footer fijo con: Universidad Nacional Abierta y a Distancia (UNAD) | Antropología Filosófica (407011) | Estudiante: David Emilio Sierra Puentes | Tutora: Marisol Erazo | Año: 2026.
- [ ] En desktop (>768px): las 7 secciones están alineadas horizontalmente, ocupan 100vw cada una, y el scroll horizontal tiene `scroll-snap-type: x mandatory` con `scroll-snap-align: start`.
- [ ] En móvil (≤768px): cada sección ocupa 100vw y se apila verticalmente con scroll nativo. Un bottom tab bar fijo permite saltar entre secciones.
- [ ] Cada sección tiene una imagen de fondo con overlay oscuro (`rgba(15, 20, 25, 0.75)`) para garantizar legibilidad del texto.
- [ ] Citas de Aristóteles, Cassirer y Panikkar están resaltadas en cajas con borde lateral dorado (`#D4AF37`) y tipografía diferenciada.
- [ ] Las referencias bibliográficas de la Tab 7 están en formato APA completo y correcto.
- [ ] Paleta de colores aplicada globalmente mediante variables CSS según lo definido en IDEA-REFINED.md.
- [ ] Todas las imágenes tienen atributo `alt` descriptivo accesible.
- [ ] Lighthouse Accessibility score ≥ 95.
- [ ] No hay errores de consola en Chrome DevTools al cargar la página.

## Boundaries

- **Fuera de alcance:** Backend, base de datos, autenticación, formularios dinámicos.
- **Fase 2 (futuro):** Transiciones de entrada más elaboradas (fade-up por sección), animación de "progreso de lectura", modo oscuro/claro toggle.
- **No se hará:** Frameworks de frontend (React, Vue), generación de imágenes por IA dentro del pipeline de build, audio/video integrado, efectos WebGL/3D.
- **Assets visuales:** Las imágenes finales serán generadas por el usuario en su herramienta de preferencia y colocadas en `assets/images/`. Durante desarrollo se usan placeholders (colores sólidos o gradientes CSS).

## Dependencies

- [ ] Git inicializado en el repositorio.
- [ ] Cuenta de GitHub para publicación en GitHub Pages.
- [ ] Navegador moderno para testing (Chrome, Firefox, Safari).
- [ ] Imágenes finales (proporcionadas por el usuario) en `assets/images/` antes del deploy final.

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Scroll horizontal en desktop se siente "roto" en trackpads o mouse | Medio | Alto | Añadir botones de flecha navegación y asegurar que el menú superior funcione como saltos rápidos. |
| Imágenes de fondo ralentizan carga en conexiones lentas | Medio | Medio | Usar `loading="lazy"` en imágenes no visibles inicialmente. Optimizar imágenes del usuario antes de subir. |
| Bottom tab bar en móvil oculta contenido inferior | Alto | Medio | Añadir `padding-bottom` equivalente a la altura del tab bar en `<main>` o `<body>`. |
| Deadline impide pulir animaciones o detalles finos | Alto | Medio | Priorizar criterios de aceptación core. Dejar refinamientos visuales como "nice to have" post-entrega si es necesario. |
| GitHub Pages tarda en propagar cambios | Bajo | Bajo | Desplegar con suficiente antelación a la hora de entrega. Verificar URL pública. |

## Timeline

- **Hora 1 (Ahora):** Escritura de SPEC.md, plan de tareas, environment audit.
- **Hora 2:** Estructura HTML semántica (7 secciones, header, footer, nav). CSS base (variables, reset, layout horizontal desktop).
- **Hora 3:** CSS responsivo (media queries móvil), bottom tab bar, scroll snap, overlay de imágenes, cajas de citas.
- **Hora 4:** JavaScript (navegación suave, scroll helper, active states en menú). Placeholders visuales. Content population (texto de las 7 secciones).
- **Hora 5:** Integración de imágenes finales (cuando usuario las proporcione), testing responsive, Lighthouse, ajustes finos.
- **Hora 6:** Git init, commit, push a GitHub, activar GitHub Pages, verificación en vivo.

## Notes

- Los prompts de imagen mejorados se encuentran en `development/PROMPTS.md`.
- El refinamiento de idea aprobado se encuentra en `development/IDEA-REFINED.md`.
- El nombre del estudiante para todos los lugares donde aparezca es: **David Emilio Sierra Puentes**.
- La estética buscada es "revista web editorial": márgenes generosos, jerarquía tipográfica clara, coherencia visual con la temática andina/serrana.
