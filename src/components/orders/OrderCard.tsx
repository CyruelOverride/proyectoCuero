import { Link } from 'react-router-dom';
import { ChevronRight, Phone } from 'lucide-react';
import type { Order } from '@/types';
import { cn } from '@/utils/cn';
import { formatCurrency, formatDateTime, formatOrderId } from '@/utils/format';
import { OrderStatusBadge } from './OrderStatusBadge';

/** Fila/tarjeta de pedido para la bandeja de entrada. Los pedidos nuevos se destacan. */
export function OrderCard({ order }: { order: Order }) {
  const isNew = order.status === 'Nuevo';
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <li>
      <Link
        to={`/admin/orders/${order.id}`}
        className={cn(
          'group relative flex flex-col gap-3 rounded-xl border bg-ivory p-4 transition-all sm:flex-row sm:items-center sm:gap-6 sm:px-5',
          'hover:-translate-y-px hover:shadow-lg hover:shadow-ink/5',
          isNew ? 'border-danger/30 bg-danger/[0.03]' : 'border-ink/10',
        )}
      >
        {isNew && <span aria-hidden className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-danger" />}

        <div className="flex min-w-0 flex-1 items-start justify-between gap-4 sm:items-center">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {isNew && (
                <span className="relative flex size-2" aria-hidden>
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-danger/60" />
                  <span className="relative inline-flex size-2 rounded-full bg-danger" />
                </span>
              )}
              <p className={cn('truncate font-mono text-xs tracking-wide', isNew ? 'font-semibold text-ink' : 'text-muted')}>
                {formatOrderId(order.id)}
              </p>
              {isNew && <span className="sr-only">Pedido nuevo sin revisar</span>}
            </div>
            <p className={cn('mt-1 truncate text-base', isNew ? 'font-semibold' : 'font-medium')}>
              {order.customer.firstName} {order.customer.lastName}
            </p>
            <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted">
              <span>{formatDateTime(order.createdAt)}</span>
              <span className="inline-flex items-center gap-1">
                <Phone className="size-3" />
                {order.customer.phone}
              </span>
            </p>
          </div>
          <OrderStatusBadge status={order.status} className="sm:hidden" />
        </div>

        <div className="flex items-center justify-between gap-6 border-t border-ink/5 pt-3 sm:border-0 sm:pt-0">
          <div className="text-left sm:text-right">
            <p className="font-medium tabular-nums">{formatCurrency(order.total)}</p>
            <p className="text-xs text-muted">
              {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
            </p>
          </div>
          <OrderStatusBadge status={order.status} className="hidden w-28 justify-center sm:inline-flex" />
          <ChevronRight className="size-5 text-ink/30 transition-transform group-hover:translate-x-0.5 group-hover:text-ink/60" />
        </div>
      </Link>
    </li>
  );
}
