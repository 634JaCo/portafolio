# Portfolio de Diseñador Gráfico Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Build a static, scroll-driven portfolio site where an 8-second video pans the user from a back-view to a front-view as they scroll, revealing a kinetic-typography service menu that opens full-screen category panels.

**Architecture:** Pure static HTML/CSS/vanilla JS, no build step, no framework, no npm dependencies at runtime. GSAP + ScrollTrigger loaded via CDN drive the scroll-linked video scrubbing and reveal animations. Pure-logic helpers (`scroll-utils.js`, `router.js`, `categories-data.js`) are written as isomorphic scripts (work as browser globals via `<script>` tags AND as CommonJS modules) so they can be unit-tested with Node's built-in test runner (`node --test`) without adding any dependency. DOM/animation code in `main.js` is verified manually in-browser since it needs a real DOM and GSAP.

**Tech Stack:** HTML5, CSS3, vanilla JS (ES2020), GSAP 3.12.5 + ScrollTrigger (CDN), Node.js built-in test runner (`node:test`, `node:assert/strict`) for pure-logic unit tests only.

**Reference spec:** `docs/superpowers/specs/2026-08-09-portfolio-diseno-grafico-design.md`

---

## File Structure

```
portfolio-diseñador/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── categories-data.js     # 5 services + their project data (isomorphic module)
│   ├── scroll-utils.js        # pure math: clamp, mapProgressToTime (isomorphic module)
│   ├── router.js              # pure hash parsing/building (isomorphic module)
│   ├── main.js                # DOM wiring, GSAP ScrollTrigger, panel open/close
│   └── tests/
│       ├── categories-data.test.js
│       ├── scroll-utils.test.js
│       └── router.test.js
└── assets/
    ├── video/
    │   └── hero-pan.mp4       # copied from "design portfolio/animacion portfolio hero.mp4"
    └── img/
        └── placeholder.svg    # generic fallback image for missing project photos
```

---

### Task 1: Project scaffold and video asset

**Files:**
- Create: `index.html` (minimal skeleton, filled in Task 5)
- Create: `css/style.css` (empty, filled in Task 6)
- Create: `assets/video/hero-pan.mp4` (copy)
- Create: `assets/img/placeholder.svg`

- [x] **Step 1: Create the folder structure and copy the hero video**

Run:
```bash
cd "portfolio-diseñador"
mkdir -p css js/tests assets/video assets/img
cp "../design portfolio/animacion portfolio hero.mp4" "assets/video/hero-pan.mp4"
```

Expected: `assets/video/hero-pan.mp4` exists and is ~2.3MB (same size as the source file).

- [x] **Step 2: Create the generic placeholder image**

Create `assets/img/placeholder.svg`:

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="#d9d6d0"/>
  <text x="400" y="300" font-family="Helvetica, Arial, sans-serif" font-size="28"
        fill="#8a867e" text-anchor="middle" dominant-baseline="middle">
    IMAGEN PENDIENTE
  </text>
</svg>
```

- [x] **Step 3: Create empty entry files so later tasks have a target**

Create `index.html` with just:
```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Portfolio — Diseño Gráfico</title>
</head>
<body>
</body>
</html>
```

Create `css/style.css` with just:
```css
/* filled in Task 6 */
```

- [x] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: scaffold project structure and add hero video asset"
```

---

### Task 2: Category data module

**Files:**
- Create: `js/categories-data.js`
- Test: `js/tests/categories-data.test.js`

- [x] **Step 1: Write the failing test**

Create `js/tests/categories-data.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const CATEGORIES = require('../categories-data.js');

test('exports an array of exactly 5 categories', () => {
  assert.equal(Array.isArray(CATEGORIES), true);
  assert.equal(CATEGORIES.length, 5);
});

test('category ids are unique and match the expected slugs', () => {
  const ids = CATEGORIES.map((c) => c.id);
  const expected = ['branding', 'content-creator', 'b2b-design', 'web-design', 'ai-creator'];
  assert.deepEqual(ids.slice().sort(), expected.slice().sort());
  assert.equal(new Set(ids).size, ids.length);
});

test('every category has the required shape', () => {
  for (const category of CATEGORIES) {
    assert.equal(typeof category.id, 'string');
    assert.equal(typeof category.label, 'string');
    assert.equal(typeof category.title, 'string');
    assert.equal(typeof category.description, 'string');
    assert.equal(typeof category.featuredImage, 'string');
    assert.equal(Array.isArray(category.projects), true);
    assert.equal(category.projects.length, 4);
    for (const project of category.projects) {
      assert.equal(typeof project.title, 'string');
      assert.equal(typeof project.image, 'string');
    }
    assert.equal(Array.isArray(category.largeBlocks), true);
    assert.equal(category.largeBlocks.length, 2);
    for (const block of category.largeBlocks) {
      assert.equal(typeof block.title, 'string');
      assert.equal(typeof block.image, 'string');
    }
  }
});
```

- [x] **Step 2: Run the test to verify it fails**

Run: `node --test js/tests/categories-data.test.js`
Expected: FAIL — `Cannot find module '../categories-data.js'`

- [x] **Step 3: Write the implementation**

Create `js/categories-data.js`:

```js
(function (global) {
  function makeCategory(id, label, description) {
    return {
      id,
      label,
      title: label,
      description,
      featuredImage: `assets/img/${id}-featured.jpg`,
      projects: [1, 2, 3, 4].map((n) => ({
        title: `Proyecto ${label} ${n}`,
        image: `assets/img/${id}-${n}.jpg`,
      })),
      largeBlocks: [
        { title: 'Trabajo reciente', image: `assets/img/${id}-large-1.jpg` },
        { title: 'Cliente destacado', image: `assets/img/${id}-large-2.jpg` },
      ],
    };
  }

  const CATEGORIES = [
    makeCategory('branding', 'Branding', 'Identidad visual completa: logo, paleta, tipografía y sistema de marca. [Texto de ejemplo — reemplázalo con tu propia descripción.]'),
    makeCategory('content-creator', 'Content Creator', 'Producción de contenido para redes y campañas: dirección de arte, edición y guion. [Texto de ejemplo — reemplázalo con tu propia descripción.]'),
    makeCategory('b2b-design', 'B2B Design', 'Diseño para negocios: presentaciones, pitch decks, material comercial. [Texto de ejemplo — reemplázalo con tu propia descripción.]'),
    makeCategory('web-design', 'Web Design', 'Diseño y desarrollo de sitios web e interfaces digitales. [Texto de ejemplo — reemplázalo con tu propia descripción.]'),
    makeCategory('ai-creator', 'AI Creator', 'Producción visual asistida por IA: imagen, video y assets generativos. [Texto de ejemplo — reemplázalo con tu propia descripción.]'),
  ];

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = CATEGORIES;
  } else {
    global.CATEGORIES = CATEGORIES;
  }
})(typeof window !== 'undefined' ? window : globalThis);
```

- [x] **Step 4: Run the test to verify it passes**

Run: `node --test js/tests/categories-data.test.js`
Expected: PASS — 3 tests, 0 failures

- [x] **Step 5: Commit**

```bash
git add js/categories-data.js js/tests/categories-data.test.js
git commit -m "feat: add category data module with placeholder content"
```

---

### Task 3: Scroll math utilities

**Files:**
- Create: `js/scroll-utils.js`
- Test: `js/tests/scroll-utils.test.js`

- [x] **Step 1: Write the failing test**

Create `js/tests/scroll-utils.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const { clamp, mapProgressToTime } = require('../scroll-utils.js');

test('clamp keeps values within bounds', () => {
  assert.equal(clamp(0.5, 0, 1), 0.5);
  assert.equal(clamp(-1, 0, 1), 0);
  assert.equal(clamp(2, 0, 1), 1);
});

test('mapProgressToTime scales progress by duration', () => {
  assert.equal(mapProgressToTime(0, 8), 0);
  assert.equal(mapProgressToTime(1, 8), 8);
  assert.equal(mapProgressToTime(0.5, 8), 4);
});

test('mapProgressToTime clamps out-of-range progress', () => {
  assert.equal(mapProgressToTime(-0.2, 8), 0);
  assert.equal(mapProgressToTime(1.5, 8), 8);
});
```

- [x] **Step 2: Run the test to verify it fails**

Run: `node --test js/tests/scroll-utils.test.js`
Expected: FAIL — `Cannot find module '../scroll-utils.js'`

- [x] **Step 3: Write the implementation**

Create `js/scroll-utils.js`:

```js
(function (global) {
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function mapProgressToTime(progress, duration) {
    return clamp(progress, 0, 1) * duration;
  }

  const ScrollUtils = { clamp, mapProgressToTime };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScrollUtils;
  } else {
    global.ScrollUtils = ScrollUtils;
  }
})(typeof window !== 'undefined' ? window : globalThis);
```

- [x] **Step 4: Run the test to verify it passes**

Run: `node --test js/tests/scroll-utils.test.js`
Expected: PASS — 3 tests, 0 failures

- [x] **Step 5: Commit**

```bash
git add js/scroll-utils.js js/tests/scroll-utils.test.js
git commit -m "feat: add pure scroll-to-video-time mapping utility"
```

---

### Task 4: Hash router utilities

**Files:**
- Create: `js/router.js`
- Test: `js/tests/router.test.js`

- [x] **Step 1: Write the failing test**

Create `js/tests/router.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const { parseCategoryFromHash, buildHashForCategory } = require('../router.js');

const VALID_IDS = ['branding', 'content-creator', 'b2b-design', 'web-design', 'ai-creator'];

test('parseCategoryFromHash returns the id when valid', () => {
  assert.equal(parseCategoryFromHash('#branding', VALID_IDS), 'branding');
  assert.equal(parseCategoryFromHash('web-design', VALID_IDS), 'web-design');
});

test('parseCategoryFromHash returns null for empty or unknown hash', () => {
  assert.equal(parseCategoryFromHash('', VALID_IDS), null);
  assert.equal(parseCategoryFromHash('#', VALID_IDS), null);
  assert.equal(parseCategoryFromHash('#not-a-category', VALID_IDS), null);
});

test('buildHashForCategory prefixes the id with #', () => {
  assert.equal(buildHashForCategory('branding'), '#branding');
});
```

- [x] **Step 2: Run the test to verify it fails**

Run: `node --test js/tests/router.test.js`
Expected: FAIL — `Cannot find module '../router.js'`

- [x] **Step 3: Write the implementation**

Create `js/router.js`:

```js
(function (global) {
  function parseCategoryFromHash(hash, validIds) {
    const id = (hash || '').replace(/^#/, '').trim();
    if (!id) return null;
    return validIds.includes(id) ? id : null;
  }

  function buildHashForCategory(id) {
    return '#' + id;
  }

  const Router = { parseCategoryFromHash, buildHashForCategory };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Router;
  } else {
    global.Router = Router;
  }
})(typeof window !== 'undefined' ? window : globalThis);
```

- [x] **Step 4: Run the test to verify it passes**

Run: `node --test js/tests/router.test.js`
Expected: PASS — 3 tests, 0 failures

- [x] **Step 5: Run the full test suite together**

Run: `node --test js/tests/`
Expected: PASS — 9 tests total (3 files × 3 tests), 0 failures

- [x] **Step 6: Commit**

```bash
git add js/router.js js/tests/router.test.js
git commit -m "feat: add hash routing utilities for category deep-linking"
```

---

### Task 5: HTML skeleton and design tokens

**Files:**
- Modify: `index.html`
- Modify: `css/style.css`

- [x] **Step 1: Write the full HTML skeleton**

Replace `index.html`:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Portfolio — Diseño Gráfico</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

  <section id="hero">
    <div id="hero-pin-spacer">
      <div id="hero-sticky">
        <video id="hero-video" src="assets/video/hero-pan.mp4" muted playsinline preload="auto"></video>

        <button id="cta-button" type="button">Conocer portafolio ↓</button>

        <nav id="service-menu" aria-label="Servicios">
          <ul id="service-menu-list"></ul>
        </nav>
      </div>
    </div>
  </section>

  <section id="about">
    <h2>Sobre mí</h2>
    <p>[Bio de ejemplo — reemplaza este texto con tu propia presentación como diseñador.]</p>
    <p class="contact">
      <a href="mailto:tucorreo@ejemplo.com">tucorreo@ejemplo.com</a>
      · <a href="#">Instagram</a>
      · <a href="#">LinkedIn</a>
    </p>
  </section>

  <div id="category-panel" class="category-panel" hidden>
    <button id="panel-close" type="button">← volver</button>
    <div class="panel-header">
      <div class="panel-featured-image">
        <img id="panel-featured-img" src="" alt="">
      </div>
      <div class="panel-intro">
        <p class="panel-label" id="panel-label"></p>
        <h2 id="panel-title"></h2>
        <p id="panel-description"></p>
      </div>
    </div>
    <div class="panel-projects" id="panel-projects"></div>
    <div class="panel-large-blocks" id="panel-large-blocks"></div>
  </div>

  <script src="js/categories-data.js"></script>
  <script src="js/scroll-utils.js"></script>
  <script src="js/router.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
```

- [x] **Step 2: Write base CSS reset and design tokens**

Replace `css/style.css`:

```css
:root {
  --color-bg: #f2f0ec;
  --color-ink: #171614;
  --color-muted: #8a867e;
  --color-panel-bg: #f2f0ec;
  --font-sans: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  font-family: var(--font-sans);
  color: var(--color-ink);
  background: var(--color-bg);
}

h1, h2, h3, p {
  margin: 0;
}

button {
  font-family: inherit;
  cursor: pointer;
}

a {
  color: inherit;
}
```

- [x] **Step 3: Manually verify**

Open `index.html` directly in a browser (double-click the file, or `start index.html` on Windows).
Expected: blank page loads with no console errors (menu list and panel are empty/hidden — that's expected, they're filled in later tasks). Open DevTools console and confirm no red errors.

- [x] **Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "feat: add HTML skeleton and base design tokens"
```

---

### Task 6: Hero layout (video, CTA, pin spacer)

**Files:**
- Modify: `css/style.css`

- [x] **Step 1: Add hero CSS**

Append to `css/style.css`:

```css
#hero-pin-spacer {
  height: 250vh;
  position: relative;
}

#hero-sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #111;
}

#hero-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

#cta-button {
  position: absolute;
  top: 8%;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 22px;
  border: 1px solid #fff;
  border-radius: 24px;
  background: transparent;
  color: #fff;
  font-size: 13px;
  letter-spacing: 1px;
  text-transform: uppercase;
  z-index: 2;
}

#service-menu {
  position: absolute;
  right: 6%;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  opacity: 0;
  pointer-events: none;
}

#service-menu.is-visible {
  pointer-events: auto;
}

#service-menu-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: right;
}
```

- [x] **Step 2: Manually verify**

Reload `index.html` in the browser.
Expected: the hero fills the viewport with a black background (video won't play yet — no JS wiring until Task 8), the CTA button is visible centered near the top. Scrolling the page should move past a tall (250vh) hero section since the pin isn't wired up yet — that's expected, `position: sticky` alone doesn't pin without a taller ancestor, which `#hero-pin-spacer` provides. Confirm the button and black hero box render without layout errors.

- [x] **Step 3: Commit**

```bash
git add css/style.css
git commit -m "feat: add hero pin-spacer layout and CTA button styling"
```

---

### Task 7: Kinetic service menu (render + hover style)

**Files:**
- Modify: `css/style.css`
- Modify: `js/main.js` (create)

- [x] **Step 1: Add kinetic menu CSS**

Append to `css/style.css`:

```css
.menu-item {
  font-size: 15px;
  color: #fff;
  opacity: 0.35;
  cursor: pointer;
  transition: opacity 0.25s ease, font-size 0.25s ease, font-weight 0.25s ease;
  white-space: nowrap;
}

.menu-item a {
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-end;
}

.menu-item .arrow {
  opacity: 0;
  transition: opacity 0.25s ease;
}

.menu-item:hover,
.menu-item:focus-within {
  opacity: 1;
  font-size: 20px;
  font-weight: 700;
}

.menu-item:hover .arrow,
.menu-item:focus-within .arrow {
  opacity: 1;
}

/* leve inclinación aleatoria por ítem, fiel a la referencia visual */
.menu-item:nth-child(1) { transform: rotate(-2deg); }
.menu-item:nth-child(2) { transform: rotate(-1deg); }
.menu-item:nth-child(3) { transform: rotate(0deg); }
.menu-item:nth-child(4) { transform: rotate(1deg); }
.menu-item:nth-child(5) { transform: rotate(2deg); }
```

- [x] **Step 2: Create main.js and render the menu from category data**

Create `js/main.js`:

```js
(function () {
  function renderServiceMenu() {
    const list = document.getElementById('service-menu-list');
    list.innerHTML = '';

    CATEGORIES.forEach((category) => {
      const li = document.createElement('li');
      li.className = 'menu-item';
      li.dataset.categoryId = category.id;

      const link = document.createElement('a');
      link.href = Router.buildHashForCategory(category.id);

      const arrow = document.createElement('span');
      arrow.className = 'arrow';
      arrow.textContent = '→';

      const label = document.createElement('span');
      label.textContent = category.label;

      link.appendChild(arrow);
      link.appendChild(label);
      li.appendChild(link);
      list.appendChild(li);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderServiceMenu();
  });
})();
```

- [x] **Step 3: Manually verify**

Reload `index.html`. Menu won't be visible yet (`#service-menu` has `opacity: 0` until Task 8 wires the scroll reveal) — temporarily add `.is-visible { opacity: 1 !important; }` to DevTools' element inspector on `#service-menu`, or open DevTools console and run `document.getElementById('service-menu').style.opacity = 1`.
Expected: 5 items — Branding, Content Creator, B2B Design, Web Design, AI Creator — appear stacked on the right, each with a slight rotation. Hovering one enlarges it, makes it bold, and reveals the `→` arrow while the others stay dim.

- [x] **Step 4: Commit**

```bash
git add css/style.css js/main.js
git commit -m "feat: render kinetic service menu and add hover interaction"
```

---

### Task 8: Scroll-scrub the hero video with GSAP ScrollTrigger

**Files:**
- Modify: `js/main.js`

- [x] **Step 1: Add the ScrollTrigger setup**

In `js/main.js`, replace the whole file with:

```js
(function () {
  function renderServiceMenu() {
    const list = document.getElementById('service-menu-list');
    list.innerHTML = '';

    CATEGORIES.forEach((category) => {
      const li = document.createElement('li');
      li.className = 'menu-item';
      li.dataset.categoryId = category.id;

      const link = document.createElement('a');
      link.href = Router.buildHashForCategory(category.id);

      const arrow = document.createElement('span');
      arrow.className = 'arrow';
      arrow.textContent = '→';

      const label = document.createElement('span');
      label.textContent = category.label;

      link.appendChild(arrow);
      link.appendChild(label);
      li.appendChild(link);
      list.appendChild(li);
    });
  }

  function setupHeroScrub() {
    const video = document.getElementById('hero-video');
    const cta = document.getElementById('cta-button');
    const menu = document.getElementById('service-menu');
    const menuItems = Array.from(document.querySelectorAll('.menu-item'));

    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.create({
      trigger: '#hero-pin-spacer',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        if (video.duration && !Number.isNaN(video.duration)) {
          video.currentTime = ScrollUtils.mapProgressToTime(self.progress, video.duration);
        }

        // CTA fades out over the first 5% of the scrub
        const ctaOpacity = 1 - ScrollUtils.clamp(self.progress / 0.05, 0, 1);
        cta.style.opacity = ctaOpacity;
        cta.style.pointerEvents = ctaOpacity > 0.1 ? 'auto' : 'none';

        // Menu fades/slides in over the last 15% of the scrub, staggered per item
        const menuProgress = ScrollUtils.clamp((self.progress - 0.85) / 0.15, 0, 1);
        menu.classList.toggle('is-visible', menuProgress > 0);
        menu.style.opacity = menuProgress > 0 ? 1 : 0;

        menuItems.forEach((item, index) => {
          const itemStart = index * 0.08;
          const itemProgress = ScrollUtils.clamp((menuProgress - itemStart) / (1 - itemStart), 0, 1);
          item.style.opacity = String(0.35 * itemProgress + (item.matches(':hover') ? 0.65 * itemProgress : 0));
          item.style.transform = `translateX(${(1 - itemProgress) * 24}px)`;
        });
      },
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderServiceMenu();
    setupHeroScrub();
  });
})();
```

- [x] **Step 2: Manually verify**

Reload `index.html` (serve it via a local server if the browser blocks `<video>` on `file://` — run `npx http-server .` or Python's `python -m http.server` from the project root and open `http://localhost:8080`).

Expected:
- At the top of the page, the video shows the back-view frame and the CTA is fully visible.
- Scrolling down slowly advances the video frame-by-frame in sync with the scroll position (not autoplaying).
- The CTA fades out within the first few pixels of scroll.
- Around 85% through the pinned scroll range, the 5 menu items start fading/sliding in one after another; by 100% all 5 are at their dim resting opacity (0.35), ready to be hovered.
- After the pinned range ends, normal scrolling continues into the "Sobre mí" section.

- [x] **Step 3: Commit**

```bash
git add js/main.js
git commit -m "feat: wire GSAP ScrollTrigger to scrub hero video and reveal menu"
```

---

### Task 9: Category panel markup styling

**Files:**
- Modify: `css/style.css`

- [x] **Step 1: Add panel CSS**

Append to `css/style.css`:

```css
.category-panel {
  position: fixed;
  inset: 0;
  background: var(--color-panel-bg);
  z-index: 10;
  overflow-y: auto;
  padding: 32px 6%;
  transform: translateX(100%);
}

.category-panel[hidden] {
  display: none;
}

#panel-close {
  background: none;
  border: none;
  font-size: 13px;
  letter-spacing: 1px;
  margin-bottom: 24px;
}

.panel-header {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

.panel-featured-image img {
  width: 100%;
  height: 320px;
  object-fit: cover;
  display: block;
  background: #d9d6d0;
}

.panel-label {
  font-size: 11px;
  letter-spacing: 2px;
  color: var(--color-muted);
  text-transform: uppercase;
}

.panel-intro h2 {
  font-size: 32px;
  font-weight: 800;
  margin: 8px 0;
}

.panel-projects {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.panel-projects figure {
  margin: 0;
}

.panel-projects img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  background: #d9d6d0;
  display: block;
}

.panel-projects figcaption {
  font-size: 12px;
  margin-top: 6px;
  color: var(--color-muted);
}

.panel-large-blocks {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.panel-large-blocks img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  background: #d9d6d0;
  display: block;
}
```

- [x] **Step 2: Manually verify**

In DevTools, remove the `hidden` attribute from `#category-panel` on the live page.
Expected: a full-screen panel appears with the "← volver" button, an empty featured-image box, empty title/description, an empty 4-column project grid, and two empty large blocks below — all laid out without overlap. Re-add the `hidden` attribute afterward.

- [x] **Step 3: Commit**

```bash
git add css/style.css
git commit -m "feat: style the full-screen category panel layout"
```

---

### Task 10: Open/close the category panel from data

**Files:**
- Modify: `js/main.js`

- [x] **Step 1: Add panel rendering and open/close logic**

In `js/main.js`, add these functions inside the top-level IIFE (after `setupHeroScrub`, before the `DOMContentLoaded` listener):

```js
  function findCategory(id) {
    return CATEGORIES.find((category) => category.id === id) || null;
  }

  function setImageWithFallback(imgEl, src, alt) {
    imgEl.alt = alt;
    imgEl.onerror = () => {
      imgEl.onerror = null;
      imgEl.src = 'assets/img/placeholder.svg';
    };
    imgEl.src = src;
  }

  function renderCategoryPanel(category) {
    document.getElementById('panel-label').textContent = category.label;
    document.getElementById('panel-title').textContent = category.title;
    document.getElementById('panel-description').textContent = category.description;
    setImageWithFallback(
      document.getElementById('panel-featured-img'),
      category.featuredImage,
      category.title
    );

    const projectsEl = document.getElementById('panel-projects');
    projectsEl.innerHTML = '';
    category.projects.forEach((project) => {
      const figure = document.createElement('figure');
      const img = document.createElement('img');
      setImageWithFallback(img, project.image, project.title);
      const caption = document.createElement('figcaption');
      caption.textContent = project.title;
      figure.appendChild(img);
      figure.appendChild(caption);
      projectsEl.appendChild(figure);
    });

    const blocksEl = document.getElementById('panel-large-blocks');
    blocksEl.innerHTML = '';
    category.largeBlocks.forEach((block) => {
      const img = document.createElement('img');
      setImageWithFallback(img, block.image, block.title);
      blocksEl.appendChild(img);
    });
  }

  function openCategoryPanel(id) {
    const category = findCategory(id);
    if (!category) return;

    renderCategoryPanel(category);

    const panel = document.getElementById('category-panel');
    panel.hidden = false;
    gsap.fromTo(panel, { xPercent: 100 }, { xPercent: 0, duration: 0.5, ease: 'power2.out' });
  }

  function closeCategoryPanel() {
    const panel = document.getElementById('category-panel');
    gsap.to(panel, {
      xPercent: 100,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        panel.hidden = true;
      },
    });
  }

  function setupPanelInteractions() {
    document.getElementById('service-menu-list').addEventListener('click', (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (!link) return;
      event.preventDefault();
      const id = link.getAttribute('href').replace(/^#/, '');
      history.pushState(null, '', Router.buildHashForCategory(id));
      openCategoryPanel(id);
    });

    document.getElementById('panel-close').addEventListener('click', () => {
      history.pushState(null, '', location.pathname + location.search);
      closeCategoryPanel();
    });
  }
```

Then update the `DOMContentLoaded` listener at the bottom of the file to:

```js
  document.addEventListener('DOMContentLoaded', () => {
    renderServiceMenu();
    setupHeroScrub();
    setupPanelInteractions();
  });
```

Also replace the CSS transform-based hide with a GSAP-friendly initial state — in `css/style.css`, change the `.category-panel` rule's `transform: translateX(100%);` line to `transform: translateX(100%); will-change: transform;` (no functional change, just documents intent — skip if you prefer to leave it as-is, GSAP overrides inline styles regardless).

- [x] **Step 2: Manually verify**

Reload the page (via local server), scroll through the hero until the menu is visible, then click "Web Design".
Expected: the panel slides in from the right showing "Web Design" as the title, the placeholder description text, 4 project cards captioned "Proyecto Web Design 1"–"4" with the fallback placeholder image (since the real JPGs don't exist yet), and 2 large blocks with the fallback image. Click "← volver" — the panel slides back out and `hidden` is restored (check in DevTools). Repeat for all 5 categories to confirm each renders its own data.

- [x] **Step 3: Commit**

```bash
git add js/main.js css/style.css
git commit -m "feat: open and close category panel with data-driven content"
```

---

### Task 11: Hash deep-linking

**Files:**
- Modify: `js/main.js`

- [x] **Step 1: Add hash-driven open logic and popstate handling**

In `js/main.js`, add this function after `setupPanelInteractions`:

```js
  function jumpHeroToEnd() {
    const spacer = document.getElementById('hero-pin-spacer');
    const trigger = ScrollTrigger.getById('hero-scrub') || ScrollTrigger.getAll()
      .find((st) => st.trigger === spacer);
    if (trigger) {
      trigger.scroll(trigger.end);
      ScrollTrigger.update();
    }
  }

  function handleHashChange() {
    const validIds = CATEGORIES.map((category) => category.id);
    const id = Router.parseCategoryFromHash(location.hash, validIds);
    if (id) {
      jumpHeroToEnd();
      openCategoryPanel(id);
    } else {
      closeCategoryPanel();
    }
  }
```

Give the hero `ScrollTrigger.create(...)` call in `setupHeroScrub` an explicit id so `jumpHeroToEnd` can find it reliably — change:

```js
    ScrollTrigger.create({
      trigger: '#hero-pin-spacer',
```

to:

```js
    ScrollTrigger.create({
      id: 'hero-scrub',
      trigger: '#hero-pin-spacer',
```

Update `DOMContentLoaded` to check the initial hash and listen for future changes:

```js
  document.addEventListener('DOMContentLoaded', () => {
    renderServiceMenu();
    setupHeroScrub();
    setupPanelInteractions();
    window.addEventListener('popstate', handleHashChange);
    handleHashChange();
  });
```

- [x] **Step 2: Manually verify**

Serve the site locally, then load `http://localhost:8080/#branding` directly (paste it into the address bar as a fresh navigation, not a click from within the page).
Expected: the page loads with the hero already scrolled to the front-view frame (no back-view flash), the menu visible, and the "Branding" panel already open — all without the user scrolling first. Then click "← volver": the panel closes and the URL hash clears. Use the browser's back/forward buttons after opening a couple of different categories to confirm they open/close accordingly.

- [x] **Step 3: Commit**

```bash
git add js/main.js
git commit -m "feat: support direct-link deep linking to a category via URL hash"
```

---

### Task 12: Responsive layout (mobile menu + shorter scrub)

**Files:**
- Modify: `css/style.css`
- Modify: `js/main.js`

- [x] **Step 1: Add the mobile CSS override**

Append to `css/style.css`:

```css
@media (max-width: 768px) {
  #hero-pin-spacer {
    height: 160vh;
  }

  #service-menu {
    position: static;
    transform: none;
    margin-top: 16px;
    padding: 0 5%;
  }

  #service-menu-list {
    align-items: flex-start;
    text-align: left;
  }

  .menu-item {
    transform: none !important;
  }

  .menu-item a {
    justify-content: flex-start;
  }

  #hero-sticky {
    flex-direction: column;
    justify-content: flex-end;
    padding-bottom: 16px;
  }

  .panel-header {
    grid-template-columns: 1fr;
  }

  .panel-projects {
    grid-template-columns: repeat(2, 1fr);
  }

  .panel-large-blocks {
    grid-template-columns: 1fr;
  }
}
```

- [x] **Step 2: Make the pin-spacer height mirror the CSS breakpoint in JS**

The `ScrollTrigger` in `setupHeroScrub` already uses `end: 'bottom bottom'`, which reads `#hero-pin-spacer`'s actual rendered height — since that height now changes at the 768px breakpoint via CSS, no JS duplication of the `160vh`/`250vh` values is needed. Add a resize handler so ScrollTrigger recalculates when the viewport crosses the breakpoint (e.g. device rotation): in `setupHeroScrub`, after the `ScrollTrigger.create({...})` call, add:

```js
    ScrollTrigger.addEventListener('refreshInit', () => {
      video.currentTime = 0;
    });
```

and at the end of `setupHeroScrub` add:

```js
    window.addEventListener('resize', () => ScrollTrigger.refresh());
```

- [x] **Step 3: Manually verify**

Open DevTools' responsive/device mode at a width under 768px (e.g. 375px).
Expected: the hero's scrollable range is visibly shorter than on desktop, the service menu renders as a plain left-aligned stacked list below the video (no rotation/skew) once revealed, and opening a category panel shows a single-column header, a 2-column project grid, and stacked large blocks. Resize the viewport across the 768px boundary and confirm the page doesn't visually break or throw console errors.

- [x] **Step 4: Commit**

```bash
git add css/style.css js/main.js
git commit -m "feat: adapt hero scrub length and menu layout for mobile viewports"
```

---

### Task 13: About section polish and README

**Files:**
- Modify: `css/style.css`
- Create: `README.md`

- [x] **Step 1: Style the about section**

Append to `css/style.css`:

```css
#about {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  padding: 10% 8%;
  max-width: 720px;
}

#about h2 {
  font-size: 13px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--color-muted);
}

#about p {
  font-size: 20px;
  line-height: 1.5;
}

#about .contact {
  font-size: 14px;
  color: var(--color-muted);
}

#about .contact a {
  text-decoration: underline;
}
```

- [x] **Step 2: Write the README**

Create `README.md`:

```markdown
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

## Tests

Los módulos de lógica pura (`categories-data.js`, `scroll-utils.js`, `router.js`) tienen tests
con el test runner nativo de Node — no requieren instalar dependencias:

```bash
node --test js/tests/
```
```

- [x] **Step 3: Manually verify**

Reload the page and scroll to the "Sobre mí" section.
Expected: readable bio placeholder text and contact links, styled consistently with the rest of the page, no layout overflow.

- [x] **Step 4: Commit**

```bash
git add css/style.css README.md
git commit -m "docs: style about section and add README with setup/replacement instructions"
```

---

## Self-Review Notes

- **Spec coverage:** hero scroll-scrub (Task 8), CTA fade (Task 8), kinetic menu + hover (Task 7), menu reveal timing (Task 8), category panel template + open/close (Tasks 9–10), hash deep-linking (Task 11), responsive mobile menu/scrub (Task 12), about/contact section (Task 13), placeholder assets with graceful fallback (Task 1 + Task 10's `setImageWithFallback`) — all covered.
- **Placeholder scan:** no TBDs; all code blocks are complete and runnable as written.
- **Type/name consistency verified across tasks:** `CATEGORIES` (global from `categories-data.js`), `ScrollUtils.clamp`/`ScrollUtils.mapProgressToTime` (Task 3, used in Task 8), `Router.parseCategoryFromHash`/`Router.buildHashForCategory` (Task 4, used in Tasks 7 and 11), `findCategory`/`renderCategoryPanel`/`openCategoryPanel`/`closeCategoryPanel`/`setImageWithFallback` (all defined in Task 10, consumed as-named in Task 11) — no renames or mismatches.
