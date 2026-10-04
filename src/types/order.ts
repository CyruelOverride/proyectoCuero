export const ORDER_STATUSES = [
  'Nuevo',
  'Confirmado',
  'En proceso',
  'Cancelado',
  'Rechazado',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type Customer = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  notes?: string;
};

export type OrderItem = {
  productId: string;
  /** Snapshot del nombre al momento de la compra. */
  productName: string;
  /** Snapshot del precio unitario al momento de la compra. */
  price: number;
  quantity: number;
  subtotal: number;
};

export type Order = {
  id: string;
  customer: Customer;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
};

/** Payload que envía el cliente: el servidor resuelve precios, nombres y total. */
export type CreateOrderInput = {
  customer: Customer;
  items: { productId: string; quantity: number }[];
};
