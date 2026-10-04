import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { CustomerForm, OrderSummary } from '@/components/checkout';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { selectTotal, useCartStore, useOrderStore } from '@/store';
import type { Customer } from '@/types';
import { cn } from '@/utils/cn';

type Step = 'details' | 'review';

const EMPTY_CUSTOMER: Customer = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  notes: '',
};

export function CheckoutPage() {
  useDocumentTitle('Finalizar compra');
  const items = useCartStore((state) => state.items);
  const total = useCartStore(selectTotal);
  const clearCart = useCartStore((state) => state.clearCart);
  const createOrder = useOrderStore((state) => state.createOrder);
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('details');
  const [customer, setCustomer] = useState<Customer>(EMPTY_CUSTOMER);
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);
  const { run: submitOrder, isLoading, error, reset } = useAsync(createOrder, 'Error al crear el pedido. Intentá nuevamente.');

  // Una vez creado el pedido se vacía el carrito y se navega a la confirmación.
  // Se hace en un efecto para que el carrito vacío no dispare la redirección a /cart.
  useEffect(() => {
    if (!completedOrderId) return;
    clearCart();
    navigate(`/order-success?id=${encodeURIComponent(completedOrderId)}`, {
      replace: true,
      state: { orderId: completedOrderId },
    });
  }, [completedOrderId, clearCart, navigate]);

  if (items.length === 0 && !completedOrderId) {
    return <Navigate to="/cart" replace />;
  }

  const goToStep = (next: Step) => {
    reset();
    setStep(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirm = async () => {
    const order = await submitOrder({
      customer,
      items: items.map(({ productId, quantity }) => ({ productId, quantity })),
    });
    if (order) setCompletedOrderId(order.id);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-16">
      <Link to="/cart" className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink">
        <ArrowLeft className="size-4" /> Volver al carrito
      </Link>

      <h1 className="mt-6 text-4xl font-semibold sm:text-5xl">Finalizar compra</h1>
      <Stepper current={step} />

      <div className="mt-10">
        {step === 'details' ? (
          <div className="rounded-2xl border border-ink/10 bg-ivory p-6 sm:p-10">
            <CustomerForm
              initialValues={customer}
              onSubmit={(values) => {
                setCustomer(values);
                goToStep('review');
              }}
            />
          </div>
        ) : (
          <OrderSummary
            customer={customer}
            items={items}
            total={total}
            isSubmitting={isLoading}
            error={error}
            onBack={() => goToStep('details')}
            onConfirm={handleConfirm}
          />
        )}
      </div>
    </div>
  );
}

function Stepper({ current }: { current: Step }) {
  const steps: { id: Step; label: string }[] = [
    { id: 'details', label: 'Tus datos' },
    { id: 'review', label: 'Revisión y confirmación' },
  ];
  const currentIndex = steps.findIndex((step) => step.id === current);

  return (
    <ol className="mt-8 flex items-center gap-3 text-sm" aria-label="Pasos de la compra">
      {steps.map((step, index) => (
        <li key={step.id} className="flex items-center gap-3" aria-current={index === currentIndex ? 'step' : undefined}>
          {index > 0 && <span aria-hidden className="h-px w-8 bg-ink/20 sm:w-16" />}
          <span
            className={cn(
              'flex size-7 items-center justify-center rounded-full text-xs font-medium',
              index <= currentIndex ? 'bg-ink text-ivory' : 'bg-ink/10 text-ink/50',
            )}
          >
            {index + 1}
          </span>
          <span className={cn(index === currentIndex ? 'font-medium text-ink' : 'text-muted')}>{step.label}</span>
        </li>
      ))}
    </ol>
  );
}
