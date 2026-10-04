export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  /** Lista separada por comas. Se mantiene como string para futuros filtros/categorías. */
  tags: string;
  stock: number;
  image: string;
};

/** Datos necesarios para crear o actualizar un producto (el id lo asigna el backend). */
export type ProductInput = Omit<Product, 'id'>;

export type StockLevel = 'available' | 'low' | 'out';
