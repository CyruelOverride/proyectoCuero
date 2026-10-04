import { useEffect } from 'react';
import { AppRouter } from '@/router/AppRouter';
import { useAuthStore } from '@/store';

export default function App() {
  const hydrateSession = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    void hydrateSession();
  }, [hydrateSession]);

  return <AppRouter />;
}
