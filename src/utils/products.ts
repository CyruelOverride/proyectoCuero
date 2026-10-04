import type { Product, StockLevel } from '@/types';

export const LOW_STOCK_THRESHOLD = 3;

/** Convierte el string de tags ("a, b, c") en una lista normalizada. */
export function parseTags(tags: string): string[] {
  return tags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function normalizeTags(tags: string): string {
  return parseTags(tags.toLowerCase()).join(', ');
}

export type TagOption = {
  tag: string;
  count: number;
};

/** Cantidad de productos que tiene cada uno de los tags indicados (en el mismo orden). */
export function getTagOptions(products: Product[], tags: readonly string[]): TagOption[] {
  return tags.map((tag) => ({
    tag,
    count: products.filter((product) => productHasTag(product, tag)).length,
  }));
}

export function productHasTag(product: Product, tag: string): boolean {
  const target = tag.trim().toLowerCase();
  return parseTags(product.tags.toLowerCase()).includes(target);
}

export function getStockLevel(stock: number): StockLevel {
  if (stock <= 0) return 'out';
  if (stock <= LOW_STOCK_THRESHOLD) return 'low';
  return 'available';
}
