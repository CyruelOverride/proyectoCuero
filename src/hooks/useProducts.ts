import { useEffect } from 'react';
import { useProductStore } from '@/store';

/**
 * Expone el catálogo y lo solicita al servicio la primera vez que se necesita.
 * `refetch` permite reintentar ante un error.
 */
export function useProducts() {
  const products = useProductStore((state) => state.products);
  const status = useProductStore((state) => state.status);
  const error = useProductStore((state) => state.error);
  const fetchProducts = useProductStore((state) => state.fetchProducts);

  useEffect(() => {
    if (status === 'idle') void fetchProducts();
  }, [status, fetchProducts]);

  return {
    products,
    error,
    // Solo se considera "cargando" si todavía no hay datos para mostrar.
    isLoading: status === 'idle' || (status === 'loading' && products.length === 0),
    isError: status === 'error',
    refetch: fetchProducts,
  };
}
