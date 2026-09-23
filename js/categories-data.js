(function (global) {
  function makeCategory(id, label, description) {
    return {
      id,
      label,
      title: label,
      description,
      featuredImage: `assets/img/${id}-featured.jpg`,
      projects: [1, 2, 3, 4].map((n) => ({
        title: `${label} Project ${n}`,
        image: `assets/img/${id}-${n}.jpg`,
      })),
      largeBlocks: [
        { title: 'Recent Work', image: `assets/img/${id}-large-1.jpg` },
        { title: 'Featured Client', image: `assets/img/${id}-large-2.jpg` },
      ],
    };
  }

  const CATEGORIES = [
    makeCategory('branding', 'Branding', 'Complete visual identity: logo, color palette, typography, and brand system. [Sample text — replace with your own description.]'),
    makeCategory('content-creator', 'Content Creator', 'Content production for social media and campaigns: art direction, editing, and scriptwriting. [Sample text — replace with your own description.]'),
    makeCategory('b2b-design', 'B2B Design', 'Design for business: presentations, pitch decks, commercial materials. [Sample text — replace with your own description.]'),
    makeCategory('web-design', 'Web Design', 'Design and development of websites and digital interfaces. [Sample text — replace with your own description.]'),
    makeCategory('ai-creator', 'AI Creator', 'AI-assisted visual production: image, video, and generative assets. [Sample text — replace with your own description.]'),
  ];

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = CATEGORIES;
  } else {
    global.CATEGORIES = CATEGORIES;
  }
})(typeof window !== 'undefined' ? window : globalThis);
