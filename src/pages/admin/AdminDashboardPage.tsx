import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Inbox, Package, TrendingUp, type LucideIcon } from 'lucide-react';
import { AdminPageHeader } from '@/components/layout';
import { OrderCard } from '@/components/orders';
import { ButtonLink, EmptyState, Skeleton } from '@/components/ui';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useOrders } from '@/hooks/useOrders';
import { useProducts } from '@/hooks/useProducts';
import { useAuthStore } from '@/store';
import { formatCurrency } from '@/utils/format';
import { getStockLevel } from '@/utils/products';

/**
 * Resumen del panel. Hoy calcula métricas simples en el cliente; a futuro puede
 * alimentarse de un endpoint de estadísticas del backend.
 */
export function AdminDashboardPage() {
  useDocumentTitle('Panel');
  const user = useAuthStore((state) => state.user);
  const { products, isLoading: productsLoading } = useProducts();
  const { orders, newOrdersCount, isLoading: ordersLoading } = useOrders();

  const confirmedRevenue = orders
    .filter((order) => order.status === 'Confirmado' || order.status === 'En proceso')
    .reduce((sum, order) => sum + order.total, 0);
  const lowStockProducts = products.filter((product) => getStockLevel(product.stock) !== 'available');
  const recentOrders = orders.slice(0, 5);

  const stats: { label: string; value: string; icon: LucideIcon; to: string; highlight?: boolean }[] = [
    { label: 'Pedidos nuevos', value: String(newOrdersCount), icon: Inbox, to: '/admin/orders', highlight: newOrdersCount > 0 },
    { label: 'Pedidos totales', value: String(orders.length), icon: TrendingUp, to: '/admin/orders' },
    { label: 'Ventas confirmadas', value: formatCurrency(confirmedRevenue), icon: TrendingUp, to: '/admin/orders' },
    { label: 'Productos activos', value: String(products.length), icon: Package, to: '/admin/products' },
  ];

  const isLoading = productsLoading || ordersLoading;

  return (
    <>
      <AdminPageHeader
        title={`Hola, ${user?.displayName ?? 'Administrador'}`}
        description="Este es el resumen de la actividad de la tienda."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, to, highlight }) =>
          isLoading ? (
            <Skeleton key={label} className="h-32 rounded-2xl" />
          ) : (
            <Link
              key={label}
              to={to}
              className={`group rounded-2xl border p-5 transition-shadow hover:shadow-lg hover:shadow-ink/5 ${
                highlight ? 'border-danger/30 bg-danger/[0.04]' : 'border-ink/10 bg-ivory'
              }`}
            >
              <div className="flex items-center justify-between text-muted">
                <span className="text-sm">{label}</span>
                <Icon className={`size-4 ${highlight ? 'text-danger' : ''}`} />
              </div>
              <p className="mt-4 font-serif text-3xl font-semibold tabular-nums">{value}</p>
            </Link>
          ),
        )}
      </div>

      <div className="mt-10 grid gap-8 xl:grid-cols-[1fr_340px]">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Últimos pedidos</h2>
            <Link to="/admin/orders" className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
              Ver todos <ArrowRight className="size-3.5" />
            </Link>
          </div>
          {ordersLoading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((key) => (
                <Skeleton key={key} className="h-20 rounded-xl" />
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ink/15">
              <EmptyState
                icon={<Inbox />}
                title="Sin pedidos todavía"
                description="Cuando un cliente confirme una compra, la vas a ver acá."
              />
            </div>
          ) : (
            <ul className="space-y-3">
              {recentOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Stock a reponer</h2>
          <div className="rounded-2xl border border-ink/10 bg-ivory p-5">
            {productsLoading ? (
              <Skeleton className="h-24" />
            ) : lowStockProducts.length === 0 ? (
              <p className="text-sm text-muted">Todos los productos tienen stock suficiente.</p>
            ) : (
              <ul className="divide-y divide-ink/10">
                {lowStockProducts.map((product) => (
                  <li key={product.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <Link to={`/admin/products/${product.id}/edit`} className="min-w-0 truncate text-sm hover:text-leather">
                      {product.name}
                    </Link>
                    <span
                      className={`flex shrink-0 items-center gap-1 text-xs font-medium ${
                        product.stock === 0 ? 'text-danger' : 'text-warning'
                      }`}
                    >
                      <AlertTriangle className="size-3.5" />
                      {product.stock === 0 ? 'Sin stock' : `${product.stock} u.`}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <ButtonLink to="/admin/products/new" variant="outline" fullWidth className="mt-4">
            Nuevo producto
          </ButtonLink>
        </section>
      </div>
    </>
  );
}
