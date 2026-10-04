import { formatCurrency } from '@/utils/format';

export type OrderLine = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
};

type OrderItemsListProps = {
  lines: OrderLine[];
  total: number;
};

/** Detalle de productos, cantidades, precios y total. Se usa en checkout y en admin. */
export function OrderItemsList({ lines, total }: OrderItemsListProps) {
  return (
    <div>
      <table className="w-full text-sm">
        <thead className="sr-only sm:not-sr-only">
          <tr className="border-b border-ink/10 text-left text-xs tracking-wider text-muted uppercase">
            <th scope="col" className="pb-3 font-medium">Producto</th>
            <th scope="col" className="pb-3 text-right font-medium">Precio</th>
            <th scope="col" className="pb-3 text-center font-medium">Cant.</th>
            <th scope="col" className="pb-3 text-right font-medium">Subtotal</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink/10">
          {lines.map((line) => (
            <tr key={line.id} className="flex flex-wrap items-baseline gap-x-3 py-3 sm:table-row">
              <td className="w-full font-medium sm:w-auto sm:py-3.5">{line.name}</td>
              <td className="text-muted tabular-nums sm:py-3.5 sm:text-right">{formatCurrency(line.price)}</td>
              <td className="text-muted tabular-nums sm:py-3.5 sm:text-center">
                <span className="sm:hidden">× </span>
                {line.quantity}
              </td>
              <td className="ml-auto font-medium tabular-nums sm:py-3.5 sm:text-right">{formatCurrency(line.subtotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <dl className="mt-2 space-y-2 border-t border-ink/10 pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Subtotal</dt>
          <dd className="tabular-nums">{formatCurrency(total)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Envío</dt>
          <dd className="text-muted">A coordinar</dd>
        </div>
        <div className="flex items-baseline justify-between pt-2">
          <dt className="font-medium">Total</dt>
          <dd className="font-serif text-2xl font-semibold tabular-nums">{formatCurrency(total)}</dd>
        </div>
      </dl>
    </div>
  );
}
