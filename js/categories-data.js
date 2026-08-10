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
