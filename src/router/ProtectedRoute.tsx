import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { LoadingState } from '@/components/ui';
import { useAuthStore } from '@/store';

/** Protege rutas administrativas: sin sesión válida redirige a /login conservando el destino. */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isHydrated) {
    return <LoadingState message="Verificando sesión..." className="min-h-svh" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
