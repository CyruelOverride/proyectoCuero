import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Pencil, Plus, Trash2 } from 'lucide-react';
import { AdminPageHeader } from '@/components/layout';
import { ProductImage, StockBadge, TagList } from '@/components/products';
import { ButtonLink, ConfirmDialog, EmptyState, ErrorState, Skeleton } from '@/components/ui';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useProducts } from '@/hooks/useProducts';
import { toast, useProductStore } from '@/store';
import type { Product } from '@/types';
import { getErrorMessage } from '@/utils/errors';
import { formatCurrency } from '@/utils/format';

export function AdminProductsPage() {
  useDocumentTitle('Productos');
  const { products, isLoading, isError, error, refetch } = useProducts();
  const deleteProduct = useProductStore((state) => state.deleteProduct);
  const [toDelete, setToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!toDelete) return;
    setIsDeleting(true);
    try {
      await deleteProduct(toDelete.id);
      toast.success('Producto eliminado', toDelete.name);
    } catch (deleteError) {
      toast.error('No se pudo eliminar el producto', getErrorMessage(deleteError, 'Intentá nuevamente en unos segundos.'));
    } finally {
      setIsDeleting(false);
      setToDelete(null);
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Productos"
        description={isLoading ? 'Cargando productos...' : `${products.length} productos en el catálogo`}
        actions={
          <ButtonLink to="/admin/products/new" leftIcon={<Plus className="size-4" />}>
            Nuevo producto
          </ButtonLink>
        }
      />

      {isLoading ? (
        <div className="space-y-3" role="status" aria-label="Cargando productos...">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState title="Error al cargar productos" message={error ?? ''} onRetry={refetch} />
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink/15 bg-ivory">
          <EmptyState
            icon={<Package />}
            title="Todavía no hay productos"
            description="Creá el primer producto para que aparezca en la tienda."
            action={<ButtonLink to="/admin/products/new">Nuevo producto</ButtonLink>}
          />
        </div>
      ) : (
        <>
          {/* Tabla (tablet/desktop) */}
          <div className="hidden overflow-hidden rounded-2xl border border-ink/10 bg-ivory md:block">
            <table className="w-full text-sm">
              <thead className="border-b border-ink/10 bg-cream/60 text-left text-xs tracking-wider text-muted uppercase">
                <tr>
                  <th scope="col" className="px-5 py-3.5 font-medium">Producto</th>
                  <th scope="col" className="px-5 py-3.5 font-medium">Precio</th>
                  <th scope="col" className="hidden px-5 py-3.5 font-medium xl:table-cell">Etiquetas</th>
                  <th scope="col" className="px-5 py-3.5 font-medium">Stock</th>
                  <th scope="col" className="px-5 py-3.5 text-right font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                {products.map((product) => (
                  <tr key={product.id} className="transition-colors hover:bg-cream/50">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-4">
                        <ProductImage src={product.image} alt="" className="size-14 shrink-0 rounded-lg" />
                        <Link to={`/products/${product.id}`} target="_blank" className="font-medium hover:text-leather">
                          {product.name}
                        </Link>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 tabular-nums">{formatCurrency(product.price)}</td>
                    <td className="hidden px-5 py-3.5 xl:table-cell">
                      <TagList tags={product.tags} max={3} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col items-start gap-1">
                        <span className="tabular-nums">{product.stock} u.</span>
                        <StockBadge stock={product.stock} />
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <RowActions product={product} onDelete={setToDelete} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tarjetas (mobile) */}
          <ul className="space-y-3 md:hidden">
            {products.map((product) => (
              <li key={product.id} className="flex gap-4 rounded-xl border border-ink/10 bg-ivory p-3">
                <ProductImage src={product.image} alt="" className="size-20 shrink-0 rounded-lg" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="truncate font-medium">{product.name}</p>
                  <p className="text-sm text-muted tabular-nums">
                    {formatCurrency(product.price)} · {product.stock} u.
                  </p>
                  <TagList tags={product.tags} max={2} className="mt-1.5" />
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <StockBadge stock={product.stock} />
                    <RowActions product={product} onDelete={setToDelete} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <ConfirmDialog
        isOpen={toDelete !== null}
        title="¿Eliminar producto?"
        description={
          <>
            Vas a eliminar <strong className="text-ink">{toDelete?.name}</strong> del catálogo. Los pedidos existentes
            conservarán su información. Esta acción no se puede deshacer.
          </>
        }
        confirmLabel="Eliminar"
        tone="danger"
        isLoading={isDeleting}
        loadingText="Eliminando..."
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}

function RowActions({ product, onDelete }: { product: Product; onDelete: (product: Product) => void }) {
  return (
    <div className="flex justify-end gap-1">
      <Link
        to={`/admin/products/${product.id}/edit`}
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-ink/70 transition-colors hover:bg-ink/5 hover:text-ink"
      >
        <Pencil className="size-3.5" />
        Editar
      </Link>
      <button
        type="button"
        onClick={() => onDelete(product)}
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-ink/70 transition-colors hover:bg-danger/10 hover:text-danger"
      >
        <Trash2 className="size-3.5" />
        Eliminar
      </button>
    </div>
  );
}
