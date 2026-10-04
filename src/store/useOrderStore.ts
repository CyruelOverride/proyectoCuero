import { create } from 'zustand';
import { orderService } from '@/services/api';
import type { CreateOrderInput, Order, OrderStatus, RequestStatus } from '@/types';
import { getErrorMessage } from '@/utils/errors';
import { useProductStore } from './useProductStore';

type OrderState = {
  orders: Order[];
  status: RequestStatus;
  error: string | null;
  fetchOrders: () => Promise<void>;
  fetchOrderById: (id: string) => Promise<Order>;
  createOrder: (input: CreateOrderInput) => Promise<Order>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<Order>;
};

function upsert(orders: Order[], order: Order): Order[] {
  return orders.some((item) => item.id === order.id)
    ? orders.map((item) => (item.id === order.id ? order : item))
    : [order, ...orders];
}

export const useOrderStore = create<OrderState>()((set) => ({
  orders: [],
  status: 'idle',
  error: null,

  fetchOrders: async () => {
    set({ status: 'loading', error: null });
    try {
      const orders = await orderService.getOrders();
      set({ orders, status: 'success' });
    } catch (error) {
      set({ status: 'error', error: getErrorMessage(error, 'Error al cargar los pedidos.') });
    }
  },

  fetchOrderById: async (id) => {
    const order = await orderService.getOrderById(id);
    set((state) => ({ orders: upsert(state.orders, order) }));
    return order;
  },

  createOrder: async (input) => {
    try {
      const order = await orderService.createOrder(input);
      set((state) => ({ orders: upsert(state.orders, order) }));
      return order;
    } finally {
      // El pedido descuenta stock en el "servidor" y, si falla por stock, el
      // catálogo local puede estar desactualizado: en ambos casos se refresca.
      void useProductStore.getState().fetchProducts();
    }
  },

  updateOrderStatus: async (id, status) => {
    const order = await orderService.updateOrderStatus(id, status);
    set((state) => ({ orders: upsert(state.orders, order) }));
    return order;
  },
}));

export const selectNewOrdersCount = (state: Pick<OrderState, 'orders'>) =>
  state.orders.filter((order) => order.status === 'Nuevo').length;

export const selectOrderById = (id: string | undefined) => (state: Pick<OrderState, 'orders'>) =>
  id ? state.orders.find((order) => order.id === id) : undefined;
