import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '@/types';
import { getErrorMessage } from '@/utils/errors';

type AsyncState = {
  isLoading: boolean;
  error: string | null;
  errorCode: ApiError['code'] | null;
};

/**
 * Envuelve una acción asíncrona (normalmente de un store) y expone su estado de
 * carga y un mensaje de error amigable. `run` devuelve el resultado o `undefined`
 * si falló, para que el llamador pueda reaccionar sin try/catch.
 */
export function useAsync<Args extends unknown[], Result>(
  action: (...args: Args) => Promise<Result>,
  fallbackMessage: string,
) {
  const [state, setState] = useState<AsyncState>({ isLoading: false, error: null, errorCode: null });
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const run = useCallback(
    async (...args: Args): Promise<Result | undefined> => {
      setState({ isLoading: true, error: null, errorCode: null });
      try {
        const result = await action(...args);
        if (isMounted.current) setState({ isLoading: false, error: null, errorCode: null });
        return result;
      } catch (error) {
        if (isMounted.current) {
          setState({
            isLoading: false,
            error: getErrorMessage(error, fallbackMessage),
            errorCode: error instanceof ApiError ? error.code : 'UNKNOWN',
          });
        }
        return undefined;
      }
    },
    [action, fallbackMessage],
  );

  const reset = useCallback(() => setState({ isLoading: false, error: null, errorCode: null }), []);

  return { ...state, run, reset };
}
