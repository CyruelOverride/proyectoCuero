const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function randomCode(length: number): string {
  const values = crypto.getRandomValues(new Uint32Array(length));
  return Array.from(values, (value) => ALPHABET[value % ALPHABET.length]).join('');
}

/** Identificador de pedido legible para el cliente, ej: "ORD-20261004-K3F9Q". */
export function generateOrderId(date = new Date()): string {
  const stamp = date.toISOString().slice(0, 10).replace(/-/g, '');
  return `ORD-${stamp}-${randomCode(5)}`;
}

export function generateId(): string {
  return crypto.randomUUID();
}
