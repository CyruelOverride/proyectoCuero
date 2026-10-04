export type ApiErrorCode =
  | 'NOT_FOUND'
  | 'VALIDATION'
  | 'INSUFFICIENT_STOCK'
  | 'UNAUTHORIZED'
  | 'UNKNOWN';

/**
 * Error normalizado de la capa de servicios. Una implementación HTTP real
 * debería mapear las respuestas del backend a esta misma forma.
 */
export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly fieldErrors?: Record<string, string>;

  constructor(code: ApiErrorCode, message: string, fieldErrors?: Record<string, string>) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';
