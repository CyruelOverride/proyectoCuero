import { memo } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useAddToCart } from '@/hooks/useAddToCart';
import type { Product } from '@/types';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/format';
import { ButtonLink, Button } from '../ui';
import { ProductImage } from './ProductImage';
import { StockBadge } from './StockBadge';
import { TagList } from './TagList';

type ProductCardProps = {
  product: Product;
  priority?: boolean;
};

export const ProductCard = memo(function ProductCard({ product, priority = false }: ProductCardProps) {
  const addToCart = useAddToCart();
  const isOutOfStock = product.stock <= 0;
  const detailPath = `/products/${product.id}`;

  return (
    <article className="group flex h-full flex-col">
      <Link
        to={detailPath}
        className="relative block overflow-hidden rounded-2xl"
        aria-label={`Ver ${product.name}`}
        tabIndex={-1}
      >
        <ProductImage
          src={product.image}
          alt={product.name}
          loading={priority ? 'eager' : 'lazy'}
          className="aspect-[4/5]"
          imgClassName={cn(
            'transition-transform duration-700 ease-out group-hover:scale-[1.04]',
            isOutOfStock && 'grayscale-[60%]',
          )}
        />
        <span className="absolute top-3 left-3 rounded-full bg-ivory/95 shadow-sm">
          <StockBadge stock={product.stock} />
        </span>
      </Link>

      <div className="flex flex-1 flex-col pt-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-semibold leading-tight">
            <Link to={detailPath} className="transition-colors hover:text-leather">
              {product.name}
            </Link>
          </h3>
          <p className="shrink-0 pt-0.5 text-base font-medium tabular-nums">{formatCurrency(product.price)}</p>
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{product.description}</p>
        <TagList tags={product.tags} max={3} className="mt-3" />

        <div className="mt-auto flex gap-2 pt-5">
          <ButtonLink to={detailPath} variant="outline" size="sm" className="flex-1">
            Ver detalle
          </ButtonLink>
          <Button
            size="sm"
            onClick={() => addToCart(product)}
            disabled={isOutOfStock}
            aria-label={isOutOfStock ? `${product.name} sin stock` : `Agregar ${product.name} al carrito`}
            leftIcon={<ShoppingBag className="size-4" />}
            className="flex-1"
          >
            {isOutOfStock ? 'Agotado' : 'Agregar'}
          </Button>
        </div>
      </div>
    </article>
  );
});
