import { useEffect } from 'react';

const BRAND = 'Mare Estilo Artesanías';

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${BRAND}` : `${BRAND} — Marroquinería artesanal`;
  }, [title]);
}
