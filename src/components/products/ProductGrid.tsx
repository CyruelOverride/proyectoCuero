import type { Product } from '@/types';
import { cn } from '@/utils/cn';
import { Skeleton } from '../ui';
import { ProductCard } from './ProductCard';

type ProductGridProps = {
  products: Product[];
  className?: string;
};

const gridClasses = 'grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3';

export function ProductGrid({ products, className }: ProductGridProps) {
  return (
    <div className={cn(gridClasses, className)}>
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} priority={index < 3} />
      ))}
    </div>
  );
}

export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
  return (
    <div className={cn(gridClasses, className)} role="status" aria-label="Cargando productos...">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex flex-col">
          <Skeleton className="aspect-[4/5] rounded-2xl" />
          <Skeleton className="mt-5 h-6 w-2/3" />
          <Skeleton className="mt-3 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-4/5" />
          <div className="mt-5 flex gap-2">
            <Skeleton className="h-9 flex-1 rounded-full" />
            <Skeleton className="h-9 flex-1 rounded-full" />
          </div>
        </div>
      ))}
      <span className="sr-only">Cargando productos...</span>
    </div>
  );
}
