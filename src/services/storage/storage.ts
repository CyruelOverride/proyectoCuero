/**
 * Adaptador de persistencia local. Es el ÚNICO módulo de la aplicación que
 * accede a `localStorage`; los servicios lo usan como si fuese su "base de datos".
 * Al migrar a un backend real, los servicios dejarán de depender de este archivo.
 */

export const STORAGE_KEYS = {
  products: 'cueros:products',
  catalogVersion: 'cueros:catalog-version',
  orders: 'cueros:orders',
  session: 'cueros:session',
  notifications: 'cueros:notifications',
  cart: 'cueros:cart',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

function getStorage(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
}

export function hasItem(key: string): boolean {
  return getStorage()?.getItem(key) != null;
}

export function readJson<T>(key: string, fallback: T): T {
  const raw = getStorage()?.getItem(key);
  if (raw == null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    console.warn(`[storage] Valor corrupto en "${key}", se usa el valor por defecto.`);
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T): void {
  getStorage()?.setItem(key, JSON.stringify(value));
}

export function removeItem(key: string): void {
  getStorage()?.removeItem(key);
}

/** Interfaz compatible con `createJSONStorage` de zustand (persistencia del carrito). */
export const rawStorage = {
  getItem: (key: string) => getStorage()?.getItem(key) ?? null,
  setItem: (key: string, value: string) => getStorage()?.setItem(key, value),
  removeItem: (key: string) => getStorage()?.removeItem(key),
};
