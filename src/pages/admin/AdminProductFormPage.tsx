import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { AdminPageHeader } from '@/components/layout';
import { ProductForm } from '@/components/products';
import { ButtonLink, EmptyState, ErrorState, LoadingState } from '@/components/ui';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useProduct } from '@/hooks/useProduct';
import { toast, useProductStore } from '@/store';
import { ApiError, type ProductInput } from '@/types';
import { getErrorMessage } from '@/utils/errors';
import type { FieldErrors } from '@/utils/validation';

/** Crea (/admin/products/new) o edita (/admin/products/:id/edit) un producto. */
export function AdminProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  useDocumentTitle(isEditing ? 'Editar producto' : 'Nuevo producto');

  return (
    <>
      <Link to="/admin/products" className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
        <ArrowLeft className="size-4" /> Volver a productos
      </Link>
      {id ? <EditProduct id={id} /> : <ProductEditor />}
    </>
  );
}

function EditProduct({ id }: { id: string }) {
  const { product, isLoading, error, isNotFound, retry } = useProduct(id);

  if (isLoading) return <LoadingState message="Cargando producto..." />;
  if (product) return <ProductEditor key={product.id} productId={product.id} initialValues={product} />;
  if (error && !isNotFound) return <ErrorState message={error} onRetry={retry} />;
  return (
    <EmptyState
      title="Producto no encontrado"
      description="El producto que intentás editar no existe o fue eliminado."
      action={<ButtonLink to="/admin/products">Volver a productos</ButtonLink>}
    />
  );
}

type ProductEditorProps = {
  productId?: string;
  initialValues?: ProductInput;
};

function ProductEditor({ productId, initialValues }: ProductEditorProps) {
  const createProduct = useProductStore((state) => state.createProduct);
  const updateProduct = useProductStore((state) => state.updateProduct);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [serverErrors, setServerErrors] = useState<FieldErrors<ProductInput>>();

  const handleSubmit = async (values: ProductInput) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setServerErrors(undefined);
    try {
      const saved = productId ? await updateProduct(productId, values) : await createProduct(values);
      toast.success(productId ? 'Producto actualizado' : 'Producto creado', saved.name);
      navigate('/admin/products');
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) setServerErrors(error.fieldErrors);
      setSubmitError(getErrorMessage(error, 'No se pudo guardar el producto. Intentá nuevamente.'));
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <AdminPageHeader
        title={productId ? 'Editar producto' : 'Nuevo producto'}
        description={
          productId ? 'Los cambios se reflejan inmediatamente en la tienda.' : 'Completá los datos para publicarlo en la tienda.'
        }
      />
      {submitError && (
        <div role="alert" className="mb-6 flex items-center gap-2 rounded-xl border border-danger/20 bg-danger/5 p-4 text-sm text-danger">
          <AlertCircle className="size-4 shrink-0" />
          {submitError}
        </div>
      )}
      <ProductForm
        initialValues={initialValues}
        submitLabel={productId ? 'Guardar cambios' : 'Crear producto'}
        isSubmitting={isSubmitting}
        serverErrors={serverErrors}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/admin/products')}
      />
    </>
  );
}
