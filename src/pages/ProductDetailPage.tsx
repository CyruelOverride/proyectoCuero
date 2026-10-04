import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Check, PackageSearch, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import { ProductImage, StockBadge, TagList } from '@/components/products';
import { Button, ButtonLink, EmptyState, ErrorState, QuantitySelector, Skeleton } from '@/components/ui';
import { useAddToCart } from '@/hooks/useAddToCart';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useProduct } from '@/hooks/useProduct';
import { selectQuantityInCart, useCartStore } from '@/store';
import type { Product } from '@/types';
import { formatCurrency } from '@/utils/format';
import { clampQuantity } from '@/utils/validation';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { product, isLoading, error, isNotFound, retry } = useProduct(id);
  useDocumentTitle(product?.name);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <Link to="/#coleccion" className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink">
        <ArrowLeft className="size-4" /> Volver a la colección
      </Link>

      <div className="mt-8">
        {isLoading ? (
          <ProductDetailSkeleton />
        ) : product ? (
          <ProductDetail key={product.id} product={product} />
        ) : error && !isNotFound ? (
          <ErrorState title="No pudimos cargar el producto" message={error} onRetry={retry} />
        ) : (
          <EmptyState
            icon={<PackageSearch />}
            title="Producto no encontrado"
            description="El producto que buscás no existe o ya no forma parte de la colección."
            action={<ButtonLink to="/#coleccion">Ver la colección</ButtonLink>}
          />
        )}
      </div>
    </div>
  );
}

function ProductDetail({ product }: { product: Product }) {
  const inCart = useCartStore(selectQuantityInCart(product.id));
  const addToCart = useAddToCart();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const available = Math.max(product.stock - inCart, 0);
  const isOutOfStock = product.stock <= 0;
  const canAdd = available > 0;
  const safeQuantity = clampQuantity(quantity, 1, Math.max(available, 1));

  const handleAdd = () => {
    if (addToCart(product, safeQuantity)) {
      setQuantity(1);
      setJustAdded(true);
      window.setTimeout(() => setJustAdded(false), 2000);
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <ProductImage
        src={product.image}
        alt={product.name}
        loading="eager"
        className="aspect-[4/5] rounded-3xl lg:sticky lg:top-24 lg:self-start"
      />

      <div className="flex flex-col lg:py-6">
        <TagList tags={product.tags} />
        <h1 className="mt-5 text-4xl leading-tight font-semibold sm:text-5xl">{product.name}</h1>
        <p className="mt-4 font-serif text-3xl tabular-nums">{formatCurrency(product.price)}</p>

        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
          <StockBadge stock={product.stock} />
          {!isOutOfStock && (
            <span className="text-muted">
              {product.stock} {product.stock === 1 ? 'unidad disponible' : 'unidades disponibles'}
            </span>
          )}
        </div>

        <p className="mt-8 max-w-prose leading-relaxed text-ink/80">{product.description}</p>

        <div className="mt-10 border-t border-ink/10 pt-8">
          {isOutOfStock ? (
            <div className="rounded-xl bg-sand/50 p-5 text-sm">
              <p className="font-medium">Producto sin stock</p>
              <p className="mt-1 text-muted">
                Estamos confeccionando nuevas unidades. Escribinos para reservar la próxima tanda.
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <QuantitySelector
                  value={safeQuantity}
                  max={Math.max(available, 1)}
                  onChange={setQuantity}
                  disabled={!canAdd}
                />
                <Button
                  size="lg"
                  onClick={handleAdd}
                  disabled={!canAdd}
                  className="flex-1"
                  leftIcon={justAdded ? <Check className="size-5" /> : <ShoppingBag className="size-5" />}
                >
                  {justAdded ? 'Agregado al carrito' : 'Agregar al carrito'}
                </Button>
              </div>
              {inCart > 0 && (
                <p className="mt-4 text-sm text-muted">
                  Tenés {inCart} en tu carrito.{' '}
                  {!canAdd && <span className="text-warning">Alcanzaste el stock disponible. </span>}
                  <Link to="/cart" className="font-medium text-ink underline underline-offset-4 hover:text-leather">
                    Ver carrito
                  </Link>
                </p>
              )}
            </>
          )}
        </div>

        <ul className="mt-10 space-y-3 text-sm text-muted">
          <li className="flex items-center gap-3">
            <Truck className="size-4 text-leather" /> Envíos a todo el país, coordinados por WhatsApp.
          </li>
          <li className="flex items-center gap-3">
            <ShieldCheck className="size-4 text-leather" /> Garantía de 2 años en costuras y herrajes.
          </li>
        </ul>
      </div>
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16" role="status" aria-label="Cargando producto...">
      <Skeleton className="aspect-[4/5] rounded-3xl" />
      <div className="lg:py-6">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="mt-6 h-12 w-3/4" />
        <Skeleton className="mt-5 h-8 w-32" />
        <Skeleton className="mt-10 h-4 w-full" />
        <Skeleton className="mt-3 h-4 w-full" />
        <Skeleton className="mt-3 h-4 w-2/3" />
        <Skeleton className="mt-12 h-12 w-full rounded-full" />
      </div>
    </div>
  );
}
