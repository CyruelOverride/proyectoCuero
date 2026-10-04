import { readJson, STORAGE_KEYS, writeJson } from '@/services/storage/storage';
import {
  ApiError,
  ORDER_STATUSES,
  type CreateOrderInput,
  type Customer,
  type Order,
  type OrderItem,
  type OrderStatus,
} from '@/types';
import { generateOrderId } from '@/utils/id';
import { hasErrors, validateCustomer } from '@/utils/validation';
import { simulateRequest } from './httpClient';
import { notificationService } from './notificationService';
import { productRepository } from './productService';

// ----- "Base de datos" local -------------------------------------------------

function loadOrders(): Order[] {
  return readJson<Order[]>(STORAGE_KEYS.orders, []);
}

function saveOrders(orders: Order[]): void {
  writeJson(STORAGE_KEYS.orders, orders);
}

function findOrderOrThrow(orders: Order[], id: string): Order {
  const order = orders.find((item) => item.id === id);
  if (!order) throw new ApiError('NOT_FOUND', 'Pedido no encontrado.');
  return order;
}

const byNewestFirst = (a: Order, b: Order) => b.createdAt.localeCompare(a.createdAt);

function sanitizeCustomer(customer: Customer): Customer {
  const sanitized: Customer = {
    firstName: customer.firstName.trim(),
    lastName: customer.lastName.trim(),
    phone: customer.phone.trim(),
    email: customer.email.trim().toLowerCase(),
    address: customer.address.trim(),
    city: customer.city.trim(),
    notes: customer.notes?.trim() || undefined,
  };
  const errors = validateCustomer(sanitized);
  if (hasErrors(errors)) {
    throw new ApiError('VALIDATION', 'Revisá tus datos de contacto.', errors as Record<string, string>);
  }
  return sanitized;
}

/**
 * Resuelve precios y nombres desde el catálogo (nunca desde el cliente),
 * valida cantidades y stock, y devuelve los items + el catálogo con stock descontado.
 */
function buildOrderItems(requested: CreateOrderInput['items']) {
  if (requested.length === 0) {
    throw new ApiError('VALIDATION', 'El pedido no tiene productos.');
  }

  const products = productRepository.findAll();
  const quantities = new Map<string, number>();
  for (const { productId, quantity } of requested) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new ApiError('VALIDATION', 'Las cantidades del pedido no son válidas.');
    }
    quantities.set(productId, (quantities.get(productId) ?? 0) + quantity);
  }

  const items: OrderItem[] = [];
  for (const [productId, quantity] of quantities) {
    const product = products.find((item) => item.id === productId);
    if (!product) {
      throw new ApiError('NOT_FOUND', 'Uno de los productos de tu carrito ya no está disponible.');
    }
    if (product.stock < quantity) {
      throw new ApiError(
        'INSUFFICIENT_STOCK',
        product.stock === 0
          ? `"${product.name}" se encuentra sin stock.`
          : `Stock insuficiente para "${product.name}". Disponibles: ${product.stock}.`,
      );
    }
    items.push({
      productId,
      productName: product.name,
      price: product.price,
      quantity,
      subtotal: product.price * quantity,
    });
  }

  const updatedProducts = products.map((product) => {
    const quantity = quantities.get(product.id);
    return quantity ? { ...product, stock: product.stock - quantity } : product;
  });

  return { items, updatedProducts };
}

// ----- API pública -----------------------------------------------------------

export const orderService = {
  getOrders(): Promise<Order[]> {
    return simulateRequest(() => loadOrders().sort(byNewestFirst));
  },

  getOrderById(id: string): Promise<Order> {
    return simulateRequest(() => findOrderOrThrow(loadOrders(), id));
  },

  async createOrder(input: CreateOrderInput): Promise<Order> {
    const order = await simulateRequest(
      () => {
        const customer = sanitizeCustomer(input.customer);
        const { items, updatedProducts } = buildOrderItems(input.items);
        const newOrder: Order = {
          id: generateOrderId(),
          customer,
          items,
          total: items.reduce((sum, item) => sum + item.subtotal, 0),
          status: 'Nuevo',
          createdAt: new Date().toISOString(),
        };
        // En un backend real esto ocurriría dentro de una transacción.
        productRepository.saveAll(updatedProducts);
        saveOrders([newOrder, ...loadOrders()]);
        return newOrder;
      },
      { delay: 900 },
    );

    await notificationService.notifyAdminNewOrder(order);
    return order;
  },

  updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    return simulateRequest(() => {
      if (!ORDER_STATUSES.includes(status)) {
        throw new ApiError('VALIDATION', 'El estado seleccionado no es válido.');
      }
      const orders = loadOrders();
      const updated: Order = { ...findOrderOrThrow(orders, id), status };
      saveOrders(orders.map((order) => (order.id === id ? updated : order)));
      return updated;
    });
  },
};

export type OrderService = typeof orderService;
