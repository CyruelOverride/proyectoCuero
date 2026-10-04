import type { Customer } from '@/types';

type CustomerInfoProps = {
  customer: Customer;
};

export function CustomerInfo({ customer }: CustomerInfoProps) {
  const rows: { label: string; value: string; href?: string }[] = [
    { label: 'Nombre', value: `${customer.firstName} ${customer.lastName}` },
    { label: 'Email', value: customer.email, href: `mailto:${customer.email}` },
    { label: 'Teléfono', value: customer.phone, href: `tel:${customer.phone.replace(/[^\d+]/g, '')}` },
    { label: 'Dirección', value: customer.address },
    { label: 'Ciudad', value: customer.city },
  ];

  return (
    <dl className="grid gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
      {rows.map((row) => (
        <div key={row.label}>
          <dt className="text-xs tracking-wider text-muted uppercase">{row.label}</dt>
          <dd className="mt-1 break-words">
            {row.href ? (
              <a href={row.href} className="underline-offset-4 hover:text-leather hover:underline">
                {row.value}
              </a>
            ) : (
              row.value
            )}
          </dd>
        </div>
      ))}
      <div className="sm:col-span-2">
        <dt className="text-xs tracking-wider text-muted uppercase">Observaciones</dt>
        <dd className="mt-1 whitespace-pre-line">{customer.notes || <span className="text-ink/40">Sin observaciones</span>}</dd>
      </div>
    </dl>
  );
}
