import { readJson, STORAGE_KEYS, writeJson } from '@/services/storage/storage';
import type { Order } from '@/types';
import { generateId } from '@/utils/id';

export type AdminNotification = {
  id: string;
  type: 'new-order';
  orderId: string;
  message: string;
  createdAt: string;
  read: boolean;
};

/**
 * Canal de entrega de notificaciones. Para integrar email, WhatsApp Business,
 * push, WebSocket o un sistema de notificaciones del backend basta con crear
 * otra implementación de esta interfaz y registrarla en `channels`.
 */
export interface NotificationChannel {
  readonly name: string;
  send(notification: AdminNotification): Promise<void>;
}

const MAX_STORED_NOTIFICATIONS = 100;

/** Implementación actual: registra en consola y guarda un historial local. */
const localNotificationChannel: NotificationChannel = {
  name: 'local',
  async send(notification) {
    console.info(`[notificaciones] ${notification.message}`);
    const stored = readJson<AdminNotification[]>(STORAGE_KEYS.notifications, []);
    writeJson(STORAGE_KEYS.notifications, [notification, ...stored].slice(0, MAX_STORED_NOTIFICATIONS));
  },
};

const channels: NotificationChannel[] = [localNotificationChannel];

export const notificationService = {
  /** Una falla al notificar nunca debe impedir que el pedido se registre. */
  async notifyAdminNewOrder(order: Order): Promise<void> {
    const notification: AdminNotification = {
      id: generateId(),
      type: 'new-order',
      orderId: order.id,
      message: `Nuevo pedido ${order.id} de ${order.customer.firstName} ${order.customer.lastName}.`,
      createdAt: new Date().toISOString(),
      read: false,
    };

    const results = await Promise.allSettled(channels.map((channel) => channel.send(notification)));
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.warn(`[notificaciones] Falló el canal "${channels[index]?.name}"`, result.reason);
      }
    });
  },
};
