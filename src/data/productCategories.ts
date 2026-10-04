/**
 * Categorías generales usadas por el filtro de la tienda. Un producto pertenece a
 * una categoría cuando su campo `tags` la incluye (ej. "bolsos, accesorios").
 */
export const PRODUCT_CATEGORIES = ['billeteras', 'cinturones', 'carteras', 'bolsos', 'accesorios'] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export function isProductCategory(value: string): value is ProductCategory {
  return (PRODUCT_CATEGORIES as readonly string[]).includes(value);
}
