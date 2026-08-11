(function () {
  const ABOUT_ID = 'sobre-mi';

  // Hero interaction mode — flip this one constant to switch, nothing else to touch.
  // 'scroll-scrub'  (default) — current/proven behavior: scroll position maps directly
  //                              to video frame (setupHeroScrub), menu reveals over the
  //                              last 15% of the pinned scroll range.
  // 'play-through'  (experimental) — a single scroll/wheel/key gesture plays the video
  //                              start-to-finish on its own; the menu reveals once
  //                              playback ends (setupHeroPlayThrough). Scroll is locked
  //                              for the duration of playback so the user can't scroll
  //                              past it mid-animation.
  const HERO_INTERACTION_MODE = 'play-through';

  // Resting rotation shared by every menu item, matching .menu-item in css/style.css so
  // the whole list leans uniformly instead of each item tilting differently. Shared by
  // both hero modes below.
  const MENU_ITEM_REST_ROTATION = -4;

  // Whether the 'play-through' hero mode's one-shot video playback has already been
  // triggered (by a scroll/wheel/key gesture or by jumping straight to it via a hash
  // deep-link) — shared between setupHeroPlayThrough and jumpHeroToEnd so a leftover
  // scroll/wheel listener can't replay the intro after the video has already resolved.
  let heroPlaybackStarted = false;

  function renderServiceMenu() {
    const list = document.getElementById('service-menu-list');
    list.innerHTML = '';

    const entries = [
      { id: ABOUT_ID, label: 'Sobre mí' },
      ...CATEGORIES.map((category) => ({ id: category.id, label: category.label })),
    ];

    entries.forEach((entry) => {
      const li = document.createElement('li');
      li.className = 'menu-item';
      li.dataset.categoryId = entry.id;

      const link = document.createElement('a');
      link.href = Router.buildHashForCategory(entry.id);

      const arrow = document.createElement('span');
      arrow.className = 'arrow';
      arrow.textContent = '→';

      const label = document.createElement('span');
      label.textContent = entry.label;

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
          if (itemProgress < 1) {
            item.style.transform = `rotate(${MENU_ITEM_REST_ROTATION}deg) translateX(${(1 - itemProgress) * -24}px)`;
            item.style.opacity = String(itemProgress);
          } else {
            item.style.transform = '';
            item.style.opacity = '';
          }
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

  // Experimental alternative to setupHeroScrub — see HERO_INTERACTION_MODE above.
  // Scroll is locked until the video finishes playing on its own; the first scroll/wheel/
  // key gesture (allowed because the video is muted, so autoplay restrictions don't apply)
  // kicks off playback, and the menu reveals via a GSAP timeline once it ends, instead of
  // being driven by scroll progress.
  function setupHeroPlayThrough() {
    const video = document.getElementById('hero-video');
    const cta = document.getElementById('cta-button');
    const menu = document.getElementById('service-menu');
    const menuItems = Array.from(document.querySelectorAll('.menu-item'));

    document.body.classList.add('hero-mode-playthrough');
    lockScroll();

    function startPlayback() {
      if (heroPlaybackStarted) return;
      heroPlaybackStarted = true;
      gsap.to(cta, { opacity: 0, duration: 0.3 });
      cta.style.pointerEvents = 'none';
      video.play();
    }

    function onScrollIntent(event) {
      if (heroPlaybackStarted) return;
      event.preventDefault();
      startPlayback();
    }

    window.addEventListener('wheel', onScrollIntent, { passive: false });
    window.addEventListener('touchmove', onScrollIntent, { passive: false });
    window.addEventListener('keydown', (event) => {
      if (['ArrowDown', 'PageDown', ' '].includes(event.key)) onScrollIntent(event);
    });

    video.addEventListener('ended', () => {
      unlockScroll();
      revealMenuAnimated(menu, menuItems);
    });
  }

  function lockScroll() {
    document.documentElement.classList.add('scroll-locked');
    document.body.classList.add('scroll-locked');
  }

  function unlockScroll() {
    document.documentElement.classList.remove('scroll-locked');
    document.body.classList.remove('scroll-locked');
  }

  // Staggered menu entrance driven by a GSAP timeline instead of scroll progress — used
  // by the 'play-through' hero mode once the video finishes.
  function revealMenuAnimated(menu, menuItems) {
    menu.classList.add('is-visible');
    gsap.to(menu, { opacity: 1, duration: 0.3 });

    menuItems.forEach((item, index) => {
      gsap.fromTo(
        item,
        { opacity: 0, x: -24, rotation: MENU_ITEM_REST_ROTATION },
        {
          opacity: 1,
          x: 0,
          rotation: MENU_ITEM_REST_ROTATION,
          duration: 0.45,
          ease: 'power2.out',
          delay: index * 0.1,
          onComplete: () => gsap.set(item, { clearProps: 'transform,opacity' }),
        }
      );
    });
  }

  // Instantly-settled equivalent of revealMenuAnimated, used when deep-linking straight
  // to a category/about hash in 'play-through' mode — no video playback to wait for.
  function revealMenuInstant(menu, menuItems) {
    menu.classList.add('is-visible');
    gsap.set(menu, { opacity: 1 });
    menuItems.forEach((item) => gsap.set(item, { clearProps: 'transform,opacity' }));
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

  function slideInPanel(panel) {
    panel.hidden = false;
    gsap.fromTo(panel, { xPercent: 100 }, { xPercent: 0, duration: 0.5, ease: 'power2.out' });
  }

  function slideOutPanel(panel) {
    gsap.to(panel, {
      xPercent: 100,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        panel.hidden = true;
      },
    });
  }

  function openCategoryPanel(id) {
    const category = findCategory(id);
    if (!category) return;

    renderCategoryPanel(category);
    slideInPanel(document.getElementById('category-panel'));
  }

  function closeCategoryPanel() {
    slideOutPanel(document.getElementById('category-panel'));
  }

  function openAboutPanel() {
    slideInPanel(document.getElementById('about-panel'));
  }

  function closeAboutPanel() {
    slideOutPanel(document.getElementById('about-panel'));
  }

  function closeAllPanels() {
    closeCategoryPanel();
    closeAboutPanel();
  }

  function setupPanelInteractions() {
    document.getElementById('service-menu-list').addEventListener('click', (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (!link) return;
      event.preventDefault();
      const id = link.getAttribute('href').replace(/^#/, '');
      history.pushState(null, '', Router.buildHashForCategory(id));
      if (id === ABOUT_ID) {
        openAboutPanel();
      } else {
        openCategoryPanel(id);
      }
    });

    document.getElementById('panel-close').addEventListener('click', () => {
      history.pushState(null, '', location.pathname + location.search);
      closeCategoryPanel();
    });

    document.getElementById('about-panel-close').addEventListener('click', () => {
      history.pushState(null, '', location.pathname + location.search);
      closeAboutPanel();
    });
  }

  function jumpHeroToEnd() {
    if (HERO_INTERACTION_MODE === 'play-through') {
      heroPlaybackStarted = true;
      const video = document.getElementById('hero-video');
      if (video.duration) video.currentTime = video.duration;
      unlockScroll();
      const cta = document.getElementById('cta-button');
      gsap.set(cta, { opacity: 0 });
      cta.style.pointerEvents = 'none';
      revealMenuInstant(
        document.getElementById('service-menu'),
        Array.from(document.querySelectorAll('.menu-item'))
      );
      return;
    }

    const spacer = document.getElementById('hero-pin-spacer');
    const trigger = ScrollTrigger.getById('hero-scrub') || ScrollTrigger.getAll()
      .find((st) => st.trigger === spacer);
    if (trigger) {
      trigger.scroll(trigger.end);
      ScrollTrigger.update();
    }
  }

  function handleHashChange() {
    const validIds = [ABOUT_ID, ...CATEGORIES.map((category) => category.id)];
    const id = Router.parseCategoryFromHash(location.hash, validIds);

    closeAllPanels();

    if (id === ABOUT_ID) {
      jumpHeroToEnd();
      openAboutPanel();
    } else if (id) {
      jumpHeroToEnd();
      openCategoryPanel(id);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderServiceMenu();
    if (HERO_INTERACTION_MODE === 'play-through') {
      setupHeroPlayThrough();
    } else {
      setupHeroScrub();
    }
    setupPanelInteractions();
    window.addEventListener('popstate', handleHashChange);
    handleHashChange();
  });
})();
