# Portfolio de diseñador gráfico — sitio estático interactivo

**Fecha:** 2026-08-09
**Proyecto:** `portfolio-diseñador/`
**Estado:** Aprobado, pendiente de plan de implementación

## Resumen

Portfolio personal de diseñador gráfico. El sitio abre con el usuario sentado de espaldas en una banca; al hacer scroll, un video controlado por scroll ("scrub") gira la cámara 180° hasta mostrar la vista de frente. En ese punto aparece, animado por código, un menú de 5 servicios al costado. Al elegir un servicio se abre un panel a pantalla completa con la plantilla de proyectos de esa categoría.

Referencias visuales del usuario:
- Imágenes 1-2: estado inicial y final del hero (persona real, de espaldas → de frente), sentado en banca frente a una galería de pantallas.
- Imagen 3: estilo del menú de servicios — tipografía cinética, ítems inclinados, uno activo con flecha `→`.
- Imagen 4: plantilla general para mostrar proyectos de una categoría (hero dividido + grid de piezas + bloques grandes).

## Alcance

Sitio estático (HTML/CSS/JS vanilla + GSAP vía CDN), sin backend, sin build step. Navegación **híbrida**: todo vive en `index.html` como SPA, pero cada categoría es enlazable vía hash URL (`/#branding`) usando `history.pushState`/hashchange, sin recargar la página.

Fuera de alcance en esta fase: CMS, formulario de contacto funcional (backend), integración con Magnific/generación de imágenes IA, multi-idioma.

## Assets

- Video del hero: `design portfolio/animacion portfolio hero.mp4` (1280×720, h264, 24fps, 8s) — se copia a `assets/video/hero-pan.mp4`.
- Imágenes de proyectos por categoría: **placeholders** por ahora (recuadros con etiqueta descriptiva en las dimensiones finales), a reemplazar por el usuario sin tocar código.

## Estructura de archivos

```
portfolio-diseñador/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── main.js              # GSAP ScrollTrigger: scrub del hero, menú, panel de categorías, hash routing
│   └── categories-data.js   # array con los 5 servicios y sus proyectos
└── assets/
    ├── video/hero-pan.mp4
    └── img/                 # placeholders de proyectos e imágenes destacadas
```

## Comportamiento

### 1. Hero (scroll-scrub)

- El hero (`<video>` + botón CTA) queda `position: sticky` dentro de un contenedor de ~250vh (ajustable según duración percibida deseada).
- GSAP ScrollTrigger vincula el progreso del scroll dentro de ese tramo a `video.currentTime` (0 → 8s). El video nunca se reproduce solo: el scroll es lo único que avanza el frame.
- Botón "Conocer portafolio ↓" visible solo en el frame 0 (progreso ~0-5%), se desvanece con el primer scroll.
- Menú de servicios oculto (`opacity:0`, offset en X) hasta progreso ~85%; a partir de ahí hace fade + slide-in con stagger por ítem hasta completarse en 100%.
- Al llegar a progreso 100%, el pin se libera y el scroll continúa normal hacia la sección "Sobre mí / Contacto".

### 2. Menú de servicios (tipografía cinética)

Ítems: **Branding, Content Creator, B2B Design, Web Design, AI Creator**.

- Lista vertical con inclinación (`rotate`/`skewY`) leve y aleatoria por ítem, tamaño de fuente reducido y opacidad baja (~35%) en estado inactivo.
- Al hover/focus: el ítem se agranda, pasa a opacidad 100% y peso de fuente bold, se antepone una flecha `→`; los demás ítems bajan aún más su opacidad.
- Al click: dispara `openCategoryPanel(categoryId)` (ver sección 3) y actualiza el hash (`location.hash = '#branding'`).

### 3. Panel de categoría (overlay a pantalla completa)

- Plantilla única reutilizada por las 5 categorías, con datos desde `categories-data.js`.
- Estructura (basada en imagen 4):
  1. Bloque superior dividido: imagen destacada (izq) + título de categoría, descripción corta y botón "← volver" (der).
  2. Grid de 4 tarjetas "Proyecto" (placeholder de imagen + título).
  3. Dos bloques grandes inferiores (ej. "trabajo reciente" / "cliente destacado").
- Animación de entrada: slide-in desde la derecha o fade+scale (a definir en implementación, coherente con el resto del sitio); el hero queda atenuado (`backdrop`/opacity reducida) detrás.
- Cerrar: botón "← volver" revierte la animación y limpia el hash, regresando a la vista de frente con el menú visible (sin volver a reproducir el scrub del video).
- **Deep-linking:** si el sitio carga directamente con un hash (`/#branding`), el JS debe: (a) saltar el scrub del video directamente al frame final (de frente), (b) mostrar el menú ya visible, (c) abrir el panel correspondiente sin animación de entrada del scrub.

### 4. Datos de categorías

`categories-data.js` exporta un array de 5 objetos:

```js
{
  id: 'branding',
  label: 'Branding',
  title: '...',
  description: '...',
  featuredImage: 'assets/img/branding-featured.jpg',
  projects: [
    { title: 'Proyecto 1', image: 'assets/img/branding-1.jpg' },
    // x4
  ],
  largeBlocks: [
    { title: '...', image: '...' },
    { title: '...', image: '...' },
  ]
}
```

Todas las imágenes parten como placeholders con nombre de archivo predecible para que el usuario los reemplace directamente.

### 5. Sección "Sobre mí / Contacto"

Sección corta debajo del hero (visible tras liberar el scroll): bio breve (placeholder de texto) + datos de contacto (email/redes, placeholder). No incluye formulario funcional en esta fase.

### 6. Responsive (mobile, <768px)

- Tramo de scrub reducido (ej. 150-180vh en vez de 250vh) para no alargar excesivamente el scroll en pantallas pequeñas.
- Menú cinético cambia a lista vertical simple **sin inclinaciones** (por legibilidad), ubicada debajo del video en vez de superpuesta al costado.
- El panel de categoría ya es full-screen por diseño, por lo que no requiere cambios adicionales en mobile.

## Fuera de alcance / decisiones diferidas

- Generación de imágenes/video con IA (Magnific) — el MCP no está autorizado en esta sesión; se usará cuando el usuario lo conecte.
- Hosting/deploy final (GitHub Pages, Netlify, Vercel) — el sitio es 100% estático y no requiere build step, se puede decidir en cualquier momento sin cambios de código.
- Contenido real de proyectos por categoría — placeholders hasta que el usuario los provea.

## Testing / verificación manual

- El scrub del video se siente fluido y sincronizado con el scroll (probar con mouse wheel y trackpad).
- El botón CTA desaparece correctamente al iniciar el scroll.
- El menú aparece en el punto de progreso correcto, con la animación de stagger.
- Cada uno de los 5 botones abre el panel correcto con sus datos.
- El panel cierra correctamente y regresa al estado de frente (no repite el scrub).
- Cargar la página directamente en `/#web-design` (u otra categoría) abre ese panel de inmediato, sin necesidad de hacer scroll primero.
- Probar en viewport móvil (DevTools) que el menú se muestra apilado y sin inclinaciones, y que el scrub no se siente excesivamente largo.
