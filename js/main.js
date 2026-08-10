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
          const rotation = MENU_ITEM_ROTATIONS[index] || 0;
          item.style.transform = `rotate(${rotation}deg) translateX(${(1 - itemProgress) * 24}px)`;
        });
      },
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderServiceMenu();
    setupHeroScrub();
  });
})();
