import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Trash2 } from 'lucide-react';
import { CartEmptyState, CartItem, CartSummary } from '@/components/cart';
import { Button, ButtonLink, ConfirmDialog } from '@/components/ui';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { toast, useCartStore } from '@/store';

export function CartPage() {
  useDocumentTitle('Carrito');
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const navigate = useNavigate();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <CartEmptyState />
      </div>
    );
  }

  const handleClear = () => {
    clearCart();
    setIsConfirmOpen(false);
    toast.info('Carrito vaciado');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium tracking-[0.3em] text-leather uppercase">Tu selección</p>
          <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">Carrito</h1>
        </div>
        <button
          type="button"
          onClick={() => setIsConfirmOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-muted transition-colors hover:bg-danger/5 hover:text-danger"
        >
          <Trash2 className="size-4" />
          Vaciar carrito
        </button>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-14">
        <ul className="divide-y divide-ink/10 border-y border-ink/10" aria-label="Productos en el carrito">
          {items.map((item) => (
            <CartItem key={item.productId} item={item} />
          ))}
        </ul>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <CartSummary>
            <Button size="lg" fullWidth onClick={() => navigate('/checkout')}>
              Ordenar
              <ArrowRight className="size-4" />
            </Button>
            <ButtonLink to="/#coleccion" variant="ghost" fullWidth>
              Seguir comprando
            </ButtonLink>
            <p className="flex items-center justify-center gap-1.5 pt-1 text-xs text-muted">
              <Lock className="size-3" /> No necesitás crear una cuenta para comprar.
            </p>
          </CartSummary>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="¿Vaciar el carrito?"
        description="Se quitarán todos los productos que agregaste. Esta acción no se puede deshacer."
        confirmLabel="Vaciar carrito"
        tone="danger"
        onConfirm={handleClear}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
}
