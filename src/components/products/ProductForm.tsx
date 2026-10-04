import { useState, type FormEvent } from 'react';
import { PRODUCT_CATEGORIES } from '@/data/productCategories';
import type { ProductInput } from '@/types';
import { hasErrors, validateProduct, type FieldErrors } from '@/utils/validation';
import { parseTags } from '@/utils/products';
import { Button, Input, Textarea } from '../ui';
import { ProductImage } from './ProductImage';
import { TagList } from './TagList';

type ProductFormProps = {
  initialValues?: ProductInput;
  submitLabel: string;
  isSubmitting: boolean;
  /** Errores devueltos por el servicio (validación del lado "servidor"). */
  serverErrors?: FieldErrors<ProductInput>;
  onSubmit: (values: ProductInput) => void;
  onCancel: () => void;
};

/** Los campos numéricos se editan como texto para permitir estados intermedios. */
type FormValues = Record<keyof ProductInput, string>;

const EMPTY_VALUES: FormValues = { name: '', price: '', description: '', tags: '', stock: '', image: '' };

function toFormValues(product?: ProductInput): FormValues {
  if (!product) return EMPTY_VALUES;
  return { ...product, price: String(product.price), stock: String(product.stock) };
}

function toProductInput(values: FormValues): ProductInput {
  const toNumber = (value: string) => (value.trim() === '' ? Number.NaN : Number(value));
  return {
    name: values.name.trim(),
    price: toNumber(values.price),
    description: values.description.trim(),
    tags: values.tags,
    stock: toNumber(values.stock),
    image: values.image.trim(),
  };
}

export function ProductForm({
  initialValues,
  submitLabel,
  isSubmitting,
  serverErrors,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [values, setValues] = useState<FormValues>(() => toFormValues(initialValues));
  const [errors, setErrors] = useState<FieldErrors<ProductInput>>({});
  const [submitted, setSubmitted] = useState(false);

  const visibleErrors = { ...serverErrors, ...errors };

  const update = (field: keyof FormValues, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (submitted) setErrors(validateProduct(toProductInput(next)));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    const input = toProductInput(values);
    const validation = validateProduct(input);
    setErrors(validation);
    if (!hasErrors(validation)) onSubmit(input);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="grid gap-5 rounded-2xl border border-ink/10 bg-ivory p-6 sm:grid-cols-2 sm:p-8">
        <Input
          label="Nombre"
          required
          value={values.name}
          onChange={(event) => update('name', event.target.value)}
          error={visibleErrors.name}
          placeholder="Ej: Billetera Clásica Vaqueta"
          containerClassName="sm:col-span-2"
          maxLength={80}
        />
        <Input
          label="Precio (ARS)"
          required
          type="number"
          inputMode="decimal"
          min={0}
          step="any"
          value={values.price}
          onChange={(event) => update('price', event.target.value)}
          error={visibleErrors.price}
          placeholder="38500"
        />
        <Input
          label="Stock"
          required
          type="number"
          inputMode="numeric"
          min={0}
          step={1}
          value={values.stock}
          onChange={(event) => update('stock', event.target.value)}
          error={visibleErrors.stock}
          placeholder="10"
        />
        <Textarea
          label="Descripción"
          required
          rows={5}
          value={values.description}
          onChange={(event) => update('description', event.target.value)}
          error={visibleErrors.description}
          hint={`${values.description.length}/600 caracteres`}
          containerClassName="sm:col-span-2"
          maxLength={600}
        />
        <Input
          label="Etiquetas"
          required
          value={values.tags}
          onChange={(event) => update('tags', event.target.value)}
          error={visibleErrors.tags}
          hint={`Separadas por coma. Para que aparezca en el filtro de la tienda usá: ${PRODUCT_CATEGORIES.join(', ')}.`}
          containerClassName="sm:col-span-2"
        />
        <Input
          label="URL de la imagen"
          required
          type="url"
          value={values.image}
          onChange={(event) => update('image', event.target.value)}
          error={visibleErrors.image}
          placeholder="https://..."
          containerClassName="sm:col-span-2"
        />
      </div>

      <aside className="flex flex-col gap-6">
        <div className="rounded-2xl border border-ink/10 bg-ivory p-5">
          <p className="mb-3 text-xs font-medium tracking-widest text-muted uppercase">Vista previa</p>
          <ProductImage src={values.image.trim()} alt="Vista previa del producto" className="aspect-[4/5] rounded-xl" />
          <p className="mt-4 font-serif text-xl font-semibold">{values.name || 'Nombre del producto'}</p>
          {parseTags(values.tags).length > 0 && <TagList tags={values.tags} className="mt-2" />}
        </div>
        <div className="flex flex-col gap-3">
          <Button type="submit" isLoading={isSubmitting} loadingText="Guardando producto..." fullWidth>
            {submitLabel}
          </Button>
          <Button variant="ghost" onClick={onCancel} disabled={isSubmitting} fullWidth>
            Cancelar
          </Button>
        </div>
      </aside>
    </form>
  );
}
