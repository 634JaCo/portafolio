# Portfolio de Diseñador Gráfico

Sitio estático (sin build step). Para verlo localmente, sirve la carpeta con cualquier servidor
estático — abrirlo directamente como `file://` puede bloquear la reproducción del video en
algunos navegadores:

```bash
npx http-server .
# o
python -m http.server 8080
```

Luego abre `http://localhost:8080`.

## Reemplazar contenido de ejemplo

- **Video del hero:** `assets/video/hero-pan.mp4` — reemplázalo por otro archivo con el mismo
  nombre y relación de aspecto para actualizarlo sin tocar código.
- **Textos y proyectos de cada categoría:** edita el array en `js/categories-data.js`. Cada
  categoría tiene `description`, 4 `projects` y 2 `largeBlocks`, cada uno con su propio `image`.
- **Imágenes de proyectos:** coloca los archivos en `assets/img/` con el nombre que indica cada
  entrada en `categories-data.js` (ej. `assets/img/branding-1.jpg`). Mientras una imagen no
  exista, se muestra automáticamente `assets/img/placeholder.svg`.
- **Bio y contacto:** edita el texto directamente en la sección `#about` de `index.html`.

## Navegación por categoría

Cada categoría es enlazable vía hash (`/#branding`, `/#web-design`, etc.) usando
`history.pushState`. Cargar la página directamente en una de esas URLs salta el scrub del video
al final y abre el panel correspondiente sin necesidad de hacer scroll primero.

## Tests

Los módulos de lógica pura (`categories-data.js`, `scroll-utils.js`, `router.js`) tienen tests
con el test runner nativo de Node — no requieren instalar dependencias:

```bash
node --test js/tests/*.test.js
```
