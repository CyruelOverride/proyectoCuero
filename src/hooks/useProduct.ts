import { useEffect } from 'react';
import { selectProductById, useProductStore } from '@/store';
import { useAsync } from './useAsync';

/**
 * Obtiene un producto por id. Si ya está en el store se muestra al instante
 * mientras se revalida contra el servicio (stock actualizado).
 */
export function useProduct(id: string | undefined) {
  const cached = useProductStore(selectProductById(id));
  const fetchProductById = useProductStore((state) => state.fetchProductById);
  const { run, isLoading, error, errorCode } = useAsync(fetchProductById, 'No pudimos cargar el producto.');

  useEffect(() => {
    if (id) void run(id);
  }, [id, run]);

  return {
    product: cached,
    // Antes del primer resultado (sin caché ni error) también se considera "cargando".
    isLoading: !cached && (isLoading || !error),
    error: cached ? null : error,
    isNotFound: !cached && errorCode === 'NOT_FOUND',
    retry: () => (id ? run(id) : undefined),
  };
}
