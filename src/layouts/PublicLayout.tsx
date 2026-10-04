import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Footer, Header } from '@/components/layout';
import { useCartStore, useProductStore } from '@/store';

export function PublicLayout() {
  const products = useProductStore((state) => state.products);
  const productsStatus = useProductStore((state) => state.status);
  const syncWithProducts = useCartStore((state) => state.syncWithProducts);

  // Mantiene precios y stock del carrito alineados con el catálogo más reciente.
  useEffect(() => {
    if (productsStatus === 'success') syncWithProducts(products);
  }, [products, productsStatus, syncWithProducts]);

  return (
    <div className="flex min-h-svh flex-col">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-ivory"
      >
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
