import { useState, type FormEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import type { Customer } from '@/types';
import { hasErrors, LIMITS, validateCustomer, type FieldErrors } from '@/utils/validation';
import { Button, Input, Textarea } from '../ui';

type CustomerFormProps = {
  initialValues: Customer;
  onSubmit: (customer: Customer) => void;
};

export function CustomerForm({ initialValues, onSubmit }: CustomerFormProps) {
  const [values, setValues] = useState<Customer>(initialValues);
  const [errors, setErrors] = useState<FieldErrors<Customer>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Customer, boolean>>>({});

  const update = (field: keyof Customer, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (touched[field]) setErrors(validateCustomer(next));
  };

  const markTouched = (field: keyof Customer) => {
    setTouched((current) => ({ ...current, [field]: true }));
    setErrors(validateCustomer(values));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validateCustomer(values);
    setErrors(validation);
    setTouched({ firstName: true, lastName: true, phone: true, email: true, address: true, city: true, notes: true });
    if (hasErrors(validation)) {
      const firstInvalid = event.currentTarget.querySelector<HTMLElement>('[aria-invalid="true"]');
      firstInvalid?.focus();
      return;
    }
    onSubmit(values);
  };

  const fieldError = (field: keyof Customer) => (touched[field] ? errors[field] : undefined);

  const field = (name: keyof Customer) => ({
    name,
    value: values[name] ?? '',
    error: fieldError(name),
    onChange: (event: { target: { value: string } }) => update(name, event.target.value),
    onBlur: () => markTouched(name),
  });

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-5 text-xs font-medium tracking-[0.2em] text-muted uppercase">Datos de contacto</legend>
        <Input label="Nombre" required autoComplete="given-name" {...field('firstName')} />
        <Input label="Apellido" required autoComplete="family-name" {...field('lastName')} />
        <Input
          label="Teléfono"
          required
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+54 9 11 2345-6789"
          hint="Te contactaremos por WhatsApp para coordinar el pago y la entrega."
          {...field('phone')}
        />
        <Input
          label="Email"
          required
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="nombre@email.com"
          {...field('email')}
        />
      </fieldset>

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-5 text-xs font-medium tracking-[0.2em] text-muted uppercase">Entrega</legend>
        <Input
          label="Dirección"
          required
          autoComplete="street-address"
          placeholder="Calle, número, piso/depto."
          containerClassName="sm:col-span-2"
          {...field('address')}
        />
        <Input label="Ciudad" required autoComplete="address-level2" {...field('city')} />
        <Textarea
          label="Observaciones"
          rows={3}
          maxLength={LIMITS.notesMax}
          placeholder="Horarios de entrega, talle del cinturón, indicaciones para el envío…"
          containerClassName="sm:col-span-2"
          {...field('notes')}
        />
      </fieldset>

      <div className="flex justify-end">
        <Button type="submit" size="lg" className="w-full sm:w-auto">
          Revisar pedido
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </form>
  );
}
