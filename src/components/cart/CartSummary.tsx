import type { ReactNode } from 'react';
import { selectItemCount, selectSubtotal, selectTotal, useCartStore } from '@/store';
import { formatCurrency } from '@/utils/format';

type CartSummaryProps = {
  title?: string;
  children?: ReactNode;
};

export function CartSummary({ title = 'Resumen', children }: CartSummaryProps) {
  const itemCount = useCartStore(selectItemCount);
  const subtotal = useCartStore(selectSubtotal);
  const total = useCartStore(selectTotal);

  return (
    <section aria-label="Resumen de compra" className="rounded-2xl border border-ink/10 bg-ivory p-6 sm:p-7">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">
            Subtotal ({itemCount} {itemCount === 1 ? 'producto' : 'productos'})
          </dt>
          <dd className="tabular-nums">{formatCurrency(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Envío</dt>
          <dd className="text-muted">A coordinar</dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-ink/10 pt-4">
          <dt className="font-medium">Total</dt>
          <dd className="font-serif text-3xl font-semibold tabular-nums">{formatCurrency(total)}</dd>
        </div>
      </dl>
      {children && <div className="mt-6 flex flex-col gap-3">{children}</div>}
    </section>
  );
}
