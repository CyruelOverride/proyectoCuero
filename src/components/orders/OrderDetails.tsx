import type { ReactNode } from 'react';
import type { Order } from '@/types';
import { CustomerInfo } from './CustomerInfo';
import { OrderItemsList } from './OrderItemsList';

export function DetailSection({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="rounded-2xl border border-ink/10 bg-ivory p-5 sm:p-7">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold sm:text-2xl">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

/** Información del cliente y productos de un pedido ya registrado. */
export function OrderDetails({ order }: { order: Order }) {
  return (
    <div className="flex flex-col gap-6">
      <DetailSection title="Cliente">
        <CustomerInfo customer={order.customer} />
      </DetailSection>
      <DetailSection title="Productos">
        <OrderItemsList
          total={order.total}
          lines={order.items.map((item) => ({
            id: item.productId,
            name: item.productName,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.subtotal,
          }))}
        />
      </DetailSection>
    </div>
  );
}
