import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { toast, useCartStore, type CartItem as CartItemType } from '@/store';
import { formatCurrency } from '@/utils/format';
import { QuantitySelector } from '../ui';
import { ProductImage } from '../products';

export function CartItem({ item }: { item: CartItemType }) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const handleQuantityChange = (quantity: number) => {
    const result = updateQuantity(item.productId, quantity);
    if (!result.ok) toast.error('No se pudo actualizar', result.message);
  };

  const handleRemove = () => {
    removeItem(item.productId);
    toast.info('Producto eliminado', item.name);
  };

  return (
    <li className="flex gap-4 py-6 sm:gap-6">
      <Link to={`/products/${item.productId}`} className="shrink-0">
        <ProductImage src={item.image} alt={item.name} className="aspect-[4/5] w-24 rounded-xl sm:w-28" />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold leading-tight sm:text-xl">
              <Link to={`/products/${item.productId}`} className="hover:text-leather">
                {item.name}
              </Link>
            </h3>
            <p className="mt-1 text-sm text-muted">
              {formatCurrency(item.price)} <span className="text-ink/40">c/u</span>
            </p>
          </div>
          <p className="shrink-0 font-medium tabular-nums">{formatCurrency(item.price * item.quantity)}</p>
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
          <div className="flex items-center gap-3">
            <QuantitySelector
              size="sm"
              value={item.quantity}
              max={item.stock}
              onChange={handleQuantityChange}
              label={`Cantidad de ${item.name}`}
            />
            {item.quantity >= item.stock && <span className="text-xs text-warning">Máximo disponible</span>}
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-sm text-ink/50 transition-colors hover:text-danger"
          >
            <Trash2 className="size-4" />
            Eliminar
          </button>
        </div>
      </div>
    </li>
  );
}
