import { useState } from 'react';
import { BellRing, Inbox, RefreshCw } from 'lucide-react';
import { AdminPageHeader } from '@/components/layout';
import { OrderCard } from '@/components/orders';
import { Button, EmptyState, ErrorState, Skeleton } from '@/components/ui';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useOrders } from '@/hooks/useOrders';
import { useOrderStore } from '@/store';
import { ORDER_STATUSES, type OrderStatus } from '@/types';
import { cn } from '@/utils/cn';

type Filter = 'Todos' | OrderStatus;

const FILTERS: Filter[] = ['Todos', ...ORDER_STATUSES];

export function AdminOrdersPage() {
  useDocumentTitle('Bandeja de Entrada');
  const { orders, newOrdersCount, isLoading, isError, error, refetch } = useOrders();
  const isRefreshing = useOrderStore((state) => state.status === 'loading');
  const [filter, setFilter] = useState<Filter>('Todos');

  const countByStatus = (status: Filter) =>
    status === 'Todos' ? orders.length : orders.filter((order) => order.status === status).length;

  const visibleOrders = filter === 'Todos' ? orders : orders.filter((order) => order.status === filter);

  return (
    <>
      <AdminPageHeader
        title="Bandeja de Entrada"
        description="Pedidos realizados por los clientes, del más reciente al más antiguo."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => void refetch()}
            disabled={isRefreshing}
            leftIcon={<RefreshCw className={cn('size-3.5', isRefreshing && 'animate-spin')} />}
          >
            Actualizar
          </Button>
        }
      />

      {newOrdersCount > 0 && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm">
          <BellRing className="size-4 shrink-0 text-danger" />
          <p>
            Tenés <strong>{newOrdersCount}</strong> {newOrdersCount === 1 ? 'pedido nuevo' : 'pedidos nuevos'} pendiente
            {newOrdersCount === 1 ? '' : 's'} de revisión.
          </p>
          {filter !== 'Nuevo' && (
            <button
              type="button"
              onClick={() => setFilter('Nuevo')}
              className="ml-auto shrink-0 font-medium text-danger underline-offset-4 hover:underline"
            >
              Ver nuevos
            </button>
          )}
        </div>
      )}

      <div className="-mx-4 mb-6 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div role="tablist" aria-label="Filtrar por estado" className="flex w-max gap-2">
          {FILTERS.map((option) => {
            const count = countByStatus(option);
            const isActive = filter === option;
            return (
              <button
                key={option}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setFilter(option)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors',
                  isActive ? 'border-ink bg-ink text-ivory' : 'border-ink/15 bg-ivory text-ink/70 hover:border-ink/40',
                )}
              >
                {option}
                <span
                  className={cn(
                    'rounded-full px-1.5 text-xs tabular-nums',
                    option === 'Nuevo' && count > 0 && !isActive
                      ? 'bg-danger text-white'
                      : isActive
                        ? 'bg-ivory/20'
                        : 'bg-ink/5',
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3" role="status" aria-label="Cargando pedidos...">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState title="Error al cargar pedidos" message={error ?? ''} onRetry={refetch} />
      ) : visibleOrders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink/15 bg-ivory">
          <EmptyState
            icon={<Inbox />}
            title={filter === 'Todos' ? 'La bandeja está vacía' : `No hay pedidos en estado "${filter}"`}
            description={
              filter === 'Todos'
                ? 'Cuando un cliente confirme una compra, el pedido va a aparecer acá.'
                : 'Probá con otro filtro para ver el resto de los pedidos.'
            }
          />
        </div>
      ) : (
        <ul className="space-y-3">
          {visibleOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </ul>
      )}
    </>
  );
}
