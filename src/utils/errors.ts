import { ApiError } from '@/types';

/**
 * Devuelve un mensaje apto para mostrar al usuario. Los errores inesperados
 * se registran en consola y se reemplazan por un texto genérico.
 */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message;
  console.error(error);
  return fallback;
}
