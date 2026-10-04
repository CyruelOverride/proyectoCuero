import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Lleva el scroll al inicio en cada navegación, o a la sección indicada por el
 * hash (ej. "/#coleccion"), esperando a que el elemento exista en el DOM.
 */
export function ScrollManager() {
  const { pathname, hash, key, state } = useLocation();
  // Navegaciones que solo cambian filtros (query params) conservan la posición.
  const preserveScroll = (state as { preserveScroll?: boolean } | null)?.preserveScroll === true;

  useEffect(() => {
    if (preserveScroll) return;
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    let attempts = 0;
    let timer: number | undefined;
    const tryScroll = () => {
      const element = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (attempts++ < 20) {
        timer = window.setTimeout(tryScroll, 50);
      }
    };
    tryScroll();
    return () => window.clearTimeout(timer);
  }, [pathname, hash, key, preserveScroll]);

  return null;
}
