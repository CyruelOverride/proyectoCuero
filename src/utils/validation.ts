import type { Customer, ProductInput } from '@/types';

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_ALLOWED_CHARS = /^\+?[\d\s()-]+$/;

export const LIMITS = {
  nameMax: 80,
  descriptionMax: 600,
  tagsMax: 160,
  notesMax: 500,
  priceMax: 100_000_000,
  stockMax: 100_000,
} as const;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function phoneDigits(value: string): string {
  return value.replace(/\D/g, '');
}

/** Acepta formatos como "+54 9 11 2345-6789" o "011 4567 8900" (8 a 15 dígitos). */
export function isValidPhone(value: string): boolean {
  const trimmed = value.trim();
  if (!PHONE_ALLOWED_CHARS.test(trimmed)) return false;
  const digits = phoneDigits(trimmed);
  return digits.length >= 8 && digits.length <= 15;
}

export function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function hasErrors<T>(errors: FieldErrors<T>): boolean {
  return Object.values(errors).some(Boolean);
}

export function validateCustomer(customer: Customer): FieldErrors<Customer> {
  const errors: FieldErrors<Customer> = {};
  const required = (value: string) => value.trim().length > 0;

  if (!required(customer.firstName)) errors.firstName = 'Ingresá tu nombre.';
  else if (customer.firstName.trim().length < 2) errors.firstName = 'El nombre es demasiado corto.';

  if (!required(customer.lastName)) errors.lastName = 'Ingresá tu apellido.';
  else if (customer.lastName.trim().length < 2) errors.lastName = 'El apellido es demasiado corto.';

  if (!required(customer.phone)) errors.phone = 'Ingresá un teléfono de contacto.';
  else if (!isValidPhone(customer.phone))
    errors.phone = 'Ingresá un teléfono válido (entre 8 y 15 dígitos, con código de área).';

  if (!required(customer.email)) errors.email = 'Ingresá tu email.';
  else if (!isValidEmail(customer.email)) errors.email = 'Ingresá un email válido.';

  if (!required(customer.address)) errors.address = 'Ingresá la dirección de entrega.';
  else if (customer.address.trim().length < 5) errors.address = 'La dirección parece incompleta.';

  if (!required(customer.city)) errors.city = 'Ingresá tu ciudad.';

  if ((customer.notes ?? '').length > LIMITS.notesMax)
    errors.notes = `Las observaciones no pueden superar los ${LIMITS.notesMax} caracteres.`;

  return errors;
}

export function validateProduct(product: ProductInput): FieldErrors<ProductInput> {
  const errors: FieldErrors<ProductInput> = {};

  const name = product.name.trim();
  if (!name) errors.name = 'El nombre es obligatorio.';
  else if (name.length < 3) errors.name = 'El nombre debe tener al menos 3 caracteres.';
  else if (name.length > LIMITS.nameMax)
    errors.name = `El nombre no puede superar los ${LIMITS.nameMax} caracteres.`;

  if (!Number.isFinite(product.price)) errors.price = 'Ingresá un precio válido.';
  else if (product.price <= 0) errors.price = 'El precio debe ser mayor a 0.';
  else if (product.price > LIMITS.priceMax) errors.price = 'El precio ingresado es demasiado alto.';

  const description = product.description.trim();
  if (!description) errors.description = 'La descripción es obligatoria.';
  else if (description.length < 10) errors.description = 'La descripción es demasiado corta.';
  else if (description.length > LIMITS.descriptionMax)
    errors.description = `La descripción no puede superar los ${LIMITS.descriptionMax} caracteres.`;

  if (!product.tags.trim()) errors.tags = 'Agregá al menos una etiqueta.';
  else if (product.tags.length > LIMITS.tagsMax) errors.tags = 'Las etiquetas son demasiado largas.';

  if (!Number.isInteger(product.stock)) errors.stock = 'El stock debe ser un número entero.';
  else if (product.stock < 0) errors.stock = 'El stock no puede ser negativo.';
  else if (product.stock > LIMITS.stockMax) errors.stock = 'El stock ingresado es demasiado alto.';

  if (!product.image.trim()) errors.image = 'La URL de la imagen es obligatoria.';
  else if (!isValidUrl(product.image.trim())) errors.image = 'Ingresá una URL válida (http o https).';

  return errors;
}

/** Entero positivo dentro de [min, max]. Útil para cantidades. */
export function clampQuantity(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(Math.trunc(value), min), max);
}
