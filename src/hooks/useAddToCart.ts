import { useCallback } from 'react';
import { toast, useCartStore } from '@/store';
import type { Product } from '@/types';

/** Agrega al carrito mostrando feedback visual. Devuelve `true` si se agregó. */
export function useAddToCart() {
  const addItem = useCartStore((state) => state.addItem);

  return useCallback(
    (product: Product, quantity = 1) => {
      const result = addItem(product, quantity);
      if (result.ok) {
        toast.success(
          'Agregado al carrito',
          `${quantity} × ${product.name}`,
        );
      } else {
        toast.error('No se pudo agregar', result.message);
      }
      return result.ok;
    },
    [addItem],
  );
}
