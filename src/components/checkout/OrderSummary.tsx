import { AlertCircle, ArrowLeft, Pencil } from 'lucide-react';
import type { CartItem } from '@/store';
import type { Customer } from '@/types';
import { Button } from '../ui';
import { CustomerInfo, DetailSection, OrderItemsList } from '../orders';

type OrderSummaryProps = {
  customer: Customer;
  items: CartItem[];
  total: number;
  isSubmitting: boolean;
  error: string | null;
  onBack: () => void;
  onConfirm: () => void;
};

/** Paso de revisión previo a crear el pedido. */
export function OrderSummary({ customer, items, total, isSubmitting, error, onBack, onConfirm }: OrderSummaryProps) {
  return (
    <div className="flex flex-col gap-6">
      <DetailSection
        title="Tus datos"
        action={
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
          >
            <Pencil className="size-3.5" /> Editar
          </button>
        }
      >
        <CustomerInfo customer={customer} />
      </DetailSection>

      <DetailSection title="Productos">
        <OrderItemsList
          total={total}
          lines={items.map((item) => ({
            id: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.price * item.quantity,
          }))}
        />
      </DetailSection>

      {error && (
        <div role="alert" className="flex items-start gap-3 rounded-xl border border-danger/20 bg-danger/5 p-4 text-sm text-danger">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <div>
            <p className="font-medium">Error al crear el pedido</p>
            <p className="mt-0.5 text-danger/90">{error}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button variant="outline" size="lg" onClick={onBack} disabled={isSubmitting} leftIcon={<ArrowLeft className="size-4" />}>
          Volver
        </Button>
        <Button size="lg" onClick={onConfirm} isLoading={isSubmitting} loadingText="Confirmando pedido...">
          Confirmar pedido
        </Button>
      </div>
    </div>
  );
}
