import { ApiError } from '@/types';

type SimulateOptions = {
  /** Latencia simulada en milisegundos. Por defecto un valor aleatorio entre 250 y 600 ms. */
  delay?: number;
};

const randomLatency = () => 250 + Math.round(Math.random() * 350);

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Simula una llamada HTTP: aplica latencia, ejecuta el "handler del servidor" y
 * normaliza cualquier error inesperado a `ApiError`. Devuelve copias de los datos
 * para que el estado del cliente nunca comparta referencias con la "base de datos".
 *
 * Al conectar un backend real, este módulo se reemplaza por un cliente fetch/axios
 * que exponga la misma semántica (Promise<T> que rechaza con ApiError).
 */
export async function simulateRequest<T>(
  handler: () => T,
  { delay = randomLatency() }: SimulateOptions = {},
): Promise<T> {
  await wait(delay);
  try {
    return structuredClone(handler());
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error('[api] Error inesperado', error);
    throw new ApiError('UNKNOWN', 'Ocurrió un error inesperado. Intentá nuevamente.');
  }
}
