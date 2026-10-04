import { Check, MessageCircle } from 'lucide-react';
import { formatOrderId } from '@/utils/format';
import { ButtonLink } from '../ui';

type OrderSuccessProps = {
  orderId: string | null;
};

export function OrderSuccess({ orderId }: OrderSuccessProps) {
  return (
    <div className="mx-auto flex max-w-xl animate-slide-up flex-col items-center text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-success/10 text-success ring-8 ring-success/5">
        <Check className="size-9" strokeWidth={2.2} />
      </div>
      <p className="mt-8 text-xs font-medium tracking-[0.25em] text-leather uppercase">Pedido recibido</p>
      <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">¡Gracias por tu compra!</h1>
      <p className="mt-4 leading-relaxed text-muted">
        Recibimos tu pedido correctamente. En las próximas horas te vamos a contactar por WhatsApp para confirmar
        el pago y coordinar la entrega.
      </p>

      {orderId && (
        <div className="mt-8 w-full rounded-2xl border border-dashed border-ink/20 bg-ivory px-6 py-5">
          <p className="text-xs tracking-widest text-muted uppercase">Número de pedido</p>
          <p className="mt-1.5 font-mono text-xl font-semibold tracking-wider select-all">{formatOrderId(orderId)}</p>
          <p className="mt-2 text-xs text-muted">Guardalo para cualquier consulta.</p>
        </div>
      )}

      <div className="mt-6 flex items-center gap-2 text-sm text-muted">
        <MessageCircle className="size-4" />
        Te vamos a escribir al teléfono que nos indicaste.
      </div>

      <ButtonLink to="/" size="lg" className="mt-10">
        Volver a la tienda
      </ButtonLink>
    </div>
  );
}
