import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AdminSidebar, Logo } from '@/components/layout';
import { CountBadge } from '@/components/ui';
import { selectNewOrdersCount, useOrderStore } from '@/store';

export function AdminLayout() {
  const fetchOrders = useOrderStore((state) => state.fetchOrders);
  const newOrdersCount = useOrderStore(selectNewOrdersCount);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();

  // Al entrar al panel se refrescan los pedidos para reflejar compras recientes.
  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  const [lastPath, setLastPath] = useState(location.pathname);
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname);
    setIsDrawerOpen(false);
  }

  return (
    <div className="min-h-svh bg-[#f3efe8]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 lg:block">
        <AdminSidebar />
      </aside>

      {/* Barra superior mobile */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-ivory/10 bg-espresso px-4 lg:hidden">
        <Logo to="/admin" tone="light" size="sm" />
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="relative inline-flex size-10 items-center justify-center rounded-full text-ivory hover:bg-ivory/10"
          aria-label="Abrir menú de administración"
          aria-expanded={isDrawerOpen}
        >
          <Menu className="size-5" />
          <CountBadge count={newOrdersCount} className="absolute -top-0.5 -right-0.5" />
        </button>
      </header>

      {isDrawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Menú de administración">
          <div className="absolute inset-0 animate-fade-in bg-ink/60" onClick={() => setIsDrawerOpen(false)} aria-hidden />
          <div className="relative h-full w-72 max-w-[85%] animate-fade-in shadow-2xl">
            <AdminSidebar onNavigate={() => setIsDrawerOpen(false)} />
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="absolute top-5 right-3 rounded-full p-2 text-ivory/60 hover:bg-ivory/10 hover:text-ivory"
              aria-label="Cerrar menú"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>
      )}

      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

