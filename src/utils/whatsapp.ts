import type { Order } from '@/types';
import { formatCurrency, formatOrderId } from './format';
import { phoneDigits } from './validation';

/** Prefijo internacional usado cuando el teléfono no incluye código de país. */
const DEFAULT_COUNTRY_CODE = '54';

/**
 * Normaliza un teléfono a formato internacional sin símbolos, como lo requiere wa.me.
 * Ej: "011 15 2345-6789" → "5491123456789" (heurística simple para Argentina).
 */
export function toWhatsAppNumber(phone: string): string {
  const raw = phone.trim();
  let digits = phoneDigits(raw);

  if (raw.startsWith('+') || digits.startsWith(DEFAULT_COUNTRY_CODE)) return digits;

  digits = digits.replace(/^0/, '');
  // Celulares argentinos: se elimina el "15" local y se antepone el 9.
  const withoutLocalPrefix = digits.replace(/^(\d{2,4})15(\d{6,8})$/, '$1$2');
  return `${DEFAULT_COUNTRY_CODE}9${withoutLocalPrefix}`;
}

export function buildOrderWhatsAppMessage(order: Order): string {
  return [
    `Hola ${order.customer.firstName}, te escribimos de Mare Estilo Artesanías.`,
    `Recibimos tu pedido ${formatOrderId(order.id)} por un total de ${formatCurrency(order.total)}.`,
    'Queremos coordinar con vos el pago y la entrega. ¿Cuándo te queda cómodo?',
  ].join('\n');
}

export function buildWhatsAppLink(phone: string, message?: string): string {
  const base = `https://wa.me/${toWhatsAppNumber(phone)}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
