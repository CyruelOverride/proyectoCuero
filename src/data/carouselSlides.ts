export type CarouselSlide = {
  id: string;
  image: string;
  eyebrow: string;
  title: string;
  description: string;
};

const unsplash = (photoId: string) =>
  `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=1800&q=80`;

export const carouselSlides: CarouselSlide[] = [
  {
    id: 'messenger',
    image: unsplash('1473188588951-666fce8e7c68'),
    eyebrow: 'Colección Otoño',
    title: 'Cuero que cuenta tu historia',
    description: 'Piezas cortadas y cosidas a mano, pensadas para acompañarte durante años.',
  },
  {
    id: 'workday',
    image: unsplash('1608731267464-c0c889c2ff92'),
    eyebrow: 'Línea Ejecutiva',
    title: 'Para la jornada de trabajo',
    description: 'Portadocumentos y bolsos con espacio para tu notebook y todo lo esencial.',
  },
  {
    id: 'light',
    image: unsplash('1612902456551-333ac5afa26e'),
    eyebrow: 'Carteras',
    title: 'Líneas simples, detalles precisos',
    description: 'Diseños atemporales en cueros seleccionados, con herrajes de bronce y níquel.',
  },
  {
    id: 'outdoors',
    image: unsplash('1547949003-9792a18a2601'),
    eyebrow: 'Viaje',
    title: 'Hecho para salir',
    description: 'Mochilas y bolsos que resisten el uso diario y mejoran con el paso del tiempo.',
  },
  {
    id: 'details',
    image: unsplash('1624222247344-550fb60583dc'),
    eyebrow: 'Accesorios',
    title: 'El detalle hace la diferencia',
    description: 'Cinturones de suela de una sola pieza y cantos pulidos a mano.',
  },
];
