import { useEffect } from 'react';
import { selectNewOrdersCount, useOrderStore } from '@/store';

/** Pedidos para el panel administrativo; se solicitan al montar. */
export function useOrders() {
  const orders = useOrderStore((state) => state.orders);
  const status = useOrderStore((state) => state.status);
  const error = useOrderStore((state) => state.error);
  const newOrdersCount = useOrderStore(selectNewOrdersCount);
  const fetchOrders = useOrderStore((state) => state.fetchOrders);

  useEffect(() => {
    if (status === 'idle') void fetchOrders();
  }, [status, fetchOrders]);

  return {
    orders,
    newOrdersCount,
    error,
    isLoading: status === 'idle' || (status === 'loading' && orders.length === 0),
    isError: status === 'error',
    refetch: fetchOrders,
  };
}
