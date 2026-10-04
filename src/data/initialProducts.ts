import type { Product } from '@/types';

const unsplash = (photoId: string) =>
  `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=1000&q=80`;

/** Catálogo semilla: se carga solo si todavía no existen productos almacenados. */
export const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Billetera Clásica Vaqueta',
    price: 38500,
    description:
      'Billetera bifold confeccionada en vaqueta curtida al vegetal, con seis ranuras para tarjetas, compartimiento para billetes y costura a mano con hilo encerado. Desarrolla una pátina única con el uso.',
    tags: 'billeteras, accesorios',
    stock: 14,
    image: unsplash('1627123424574-724758594e93'),
  },
  {
    id: '2',
    name: 'Cinturón Suela Hebilla Níquel',
    price: 32900,
    description:
      'Cinturón de 3,5 cm de ancho cortado en una sola pieza de suela de 4 mm. Hebilla de níquel cepillado intercambiable y cantos teñidos y pulidos a mano. Disponible en talles del 85 al 110.',
    tags: 'cinturones, accesorios',
    stock: 22,
    image: unsplash('1624222247344-550fb60583dc'),
  },
  {
    id: '3',
    name: 'Cartera Bandolera Cognac',
    price: 89900,
    description:
      'Cartera de líneas limpias en cuero vacuno color cognac, con tapa imantada, bolsillo interior con cierre y correa regulable para usar cruzada o al hombro. Forrería de algodón crudo.',
    tags: 'carteras',
    stock: 3,
    image: unsplash('1600857062241-98e5dba7f214'),
  },
  {
    id: '4',
    name: 'Portadocumentos Ejecutivo',
    price: 124000,
    description:
      'Portadocumentos de cuero engrasado con compartimiento acolchado para notebook de hasta 14", organizador interno y doble manija con refuerzo. Pensado para el uso diario en la oficina o en viaje.',
    tags: 'bolsos',
    stock: 8,
    image: unsplash('1608731267464-c0c889c2ff92'),
  },
  {
    id: '5',
    name: 'Bolso Mensajero Vintage',
    price: 109500,
    description:
      'Bolso mensajero en cuero crazy horse con dos hebillas frontales, bolsillo trasero de acceso rápido y correa ancha con hombrera. Su acabado envejecido gana carácter con cada uso.',
    tags: 'bolsos',
    stock: 0,
    image: unsplash('1473188588951-666fce8e7c68'),
  },
  {
    id: '6',
    name: 'Mochila Urbana Terracota',
    price: 132000,
    description:
      'Mochila de cuero flor entera en tono terracota, con bolsillo frontal con cierre, espalda reforzada y capacidad para notebook de 13". Herrajes de bronce y base protegida contra el desgaste.',
    tags: 'bolsos',
    stock: 6,
    image: unsplash('1622560480605-d83c853bc5c3'),
  },
];
