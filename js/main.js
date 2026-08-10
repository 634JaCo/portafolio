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

    // Per-item rotation (deg), matching nth-child(1..5) in css/style.css. This array is
    // now the single source of truth for per-item tilt: onUpdate below overwrites each
    // item's inline `transform` every tick (to drive the translateX slide-in), which
    // would otherwise silently discard any rotation set via CSS. Previously this tilt
    // was duplicated as `.menu-item:nth-child(n) { transform: rotate(...) }` rules in
    // css/style.css (Task 7); those rules were removed since an inline style always
    // wins over a stylesheet rule, so they could never actually take effect once this
    // code runs.
    const MENU_ITEM_ROTATIONS = [-2, -1, 0, 1, 2];
    const VIDEO_FRAME_RATE = 24;
    const FRAME_DURATION = 1 / VIDEO_FRAME_RATE;

    gsap.registerPlugin(ScrollTrigger);

    // Seeking video.currentTime is decoupled from ScrollTrigger's onUpdate (which can
    // fire faster than the display refresh rate on fast trackpad/wheel input) and instead
    // applied once per rendered frame via gsap.ticker, snapped to the source video's own
    // frame boundaries. Redundant seeks to a frame already applied are skipped entirely.
    let latestProgress = 0;
    let lastAppliedFrame = -1;

    ScrollTrigger.create({
      id: 'hero-scrub',
      trigger: '#hero-pin-spacer',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        latestProgress = self.progress;

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
          const rotation = MENU_ITEM_ROTATIONS[index] || 0;
          item.style.transform = `rotate(${rotation}deg) translateX(${(1 - itemProgress) * 24}px)`;
          item.style.opacity = itemProgress < 1 ? String(0.35 * itemProgress) : '';
        });
      },
    });

    gsap.ticker.add(() => {
      if (!video.duration || Number.isNaN(video.duration)) return;
      const time = ScrollUtils.mapProgressToTime(latestProgress, video.duration);
      const frame = Math.round(time / FRAME_DURATION);
      if (frame !== lastAppliedFrame) {
        video.currentTime = frame * FRAME_DURATION;
        lastAppliedFrame = frame;
      }
    });

    ScrollTrigger.addEventListener('refreshInit', () => {
      video.currentTime = 0;
      lastAppliedFrame = -1;
    });

    window.addEventListener('resize', () => ScrollTrigger.refresh());
  }

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
      const wrapper = document.createElement('div');
      wrapper.className = 'large-block';

      const img = document.createElement('img');
      setImageWithFallback(img, block.image, block.title);

      const label = document.createElement('span');
      label.className = 'large-block-label';
      label.textContent = block.title;

      wrapper.appendChild(img);
      wrapper.appendChild(label);
      blocksEl.appendChild(wrapper);
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

  document.addEventListener('DOMContentLoaded', () => {
    renderServiceMenu();
    setupHeroScrub();
    setupPanelInteractions();
    window.addEventListener('popstate', handleHashChange);
    handleHashChange();
  });
})();
