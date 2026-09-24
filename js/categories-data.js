(function (global) {
  const CATEGORIES = [
    {
      id: 'branding',
      label: 'Branding',
      title: 'Branding',
      description: 'Full visual identity systems — logo, color, typography, and brand guidelines — built for food, fashion, ed-tech, and environmental clients.',
      featuredImage: 'assets/img/branding-featured.jpg',
      projects: [
        { title: 'Blacklistcrab', image: 'assets/img/branding-1.jpg' },
        { title: 'Burguer Coli', image: 'assets/img/branding-2.jpg' },
        { title: 'Easy SAP', image: 'assets/img/branding-3.jpg' },
        { title: 'Proyecto Gecko', image: 'assets/img/branding-4.jpg' },
      ],
      largeBlocks: [
        { title: 'Dr. Augura — Brand Book', image: 'assets/img/branding-large-1.jpg' },
        { title: 'ÁV Consultoría', image: 'assets/img/branding-large-2.jpg' },
      ],
    },
    {
      id: 'content-creator',
      label: 'Content Creator',
      title: 'Content Creator',
      description: 'Event campaigns, sports content, and social media production for clubs, federations, and local brands.',
      featuredImage: 'assets/img/content-creator-featured.jpg',
      projects: [
        { title: 'Festival de Artes Marciales', image: 'assets/img/content-creator-1.jpg' },
        { title: 'Campeonato Suramericano — Cartagena', image: 'assets/img/content-creator-2.jpg' },
        { title: 'Santo Domingo 2026', image: 'assets/img/content-creator-3.jpg' },
        { title: 'Café Samaria', image: 'assets/img/content-creator-4.jpg' },
      ],
      largeBlocks: [
        { title: 'Athlete Video Series', image: 'assets/img/content-creator-large-1.jpg' },
        { title: "Jarro's Rooftop", image: 'assets/img/content-creator-large-2.jpg' },
      ],
    },
    {
      id: 'b2b-design',
      label: 'B2B Design',
      title: 'B2B Design',
      description: 'Catalogs, brochures, and corporate collateral for insurance, retail, and sports-equipment clients.',
      featuredImage: 'assets/img/b2b-design-featured.jpg',
      projects: [
        { title: 'Nacional de Licores — Catalog', image: 'assets/img/b2b-design-1.jpg' },
        { title: 'FODESA — Brochure', image: 'assets/img/b2b-design-2.jpg' },
        { title: 'EA TKD — Equipment Catalog', image: 'assets/img/b2b-design-3.jpg' },
        { title: 'Dr. Augura × Colmena ARL', image: 'assets/img/b2b-design-4.jpg' },
      ],
      largeBlocks: [
        { title: 'Dr. Augura — ID Badge', image: 'assets/img/b2b-design-large-1.jpg' },
        { title: 'Renshot — Franchise Proposal', image: 'assets/img/b2b-design-large-2.jpg' },
      ],
    },
    {
      id: 'web-design',
      label: 'Web Design',
      title: 'Web Design',
      description: 'Website design and front-end builds for e-commerce, real estate, and insurance clients.',
      featuredImage: 'assets/img/web-design-featured.jpg',
      projects: [
        { title: 'EducaTKD — Live Site', image: 'assets/img/web-design-1.jpg' },
        { title: 'Naska Grupo Inmobiliario', image: 'assets/img/web-design-2.jpg' },
        { title: 'Dr. Augura — Concept A', image: 'assets/img/web-design-3.jpg' },
        { title: 'Dr. Augura — Concept B', image: 'assets/img/web-design-4.jpg' },
      ],
      largeBlocks: [
        { title: 'EducaTKD — Product Section', image: 'assets/img/web-design-large-1.jpg' },
        { title: 'Naska — Listings Grid', image: 'assets/img/web-design-large-2.jpg' },
      ],
    },
    {
      id: 'ai-creator',
      label: 'AI Creator',
      title: 'AI Creator',
      description: 'AI-assisted photography, video, and motion content for fashion, sports, and personal brands.',
      featuredImage: 'assets/img/ai-creator-featured.jpg',
      projects: [
        { title: 'Marcus Veil', image: 'assets/img/ai-creator-1.jpg' },
        { title: "EA TKD AI Campaign — Men's", image: 'assets/img/ai-creator-2.jpg' },
        { title: "EA TKD AI Campaign — Women's", image: 'assets/img/ai-creator-3.jpg' },
        { title: 'Abstract — Brand Intro', image: 'assets/img/ai-creator-4.jpg' },
      ],
      largeBlocks: [
        { title: 'Abstract — Logo Reveal', image: 'assets/img/ai-creator-large-1.jpg' },
        { title: 'Abstract — Streetwear', image: 'assets/img/ai-creator-large-2.jpg' },
      ],
    },
  ];

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = CATEGORIES;
  } else {
    global.CATEGORIES = CATEGORIES;
  }
})(typeof window !== 'undefined' ? window : globalThis);
