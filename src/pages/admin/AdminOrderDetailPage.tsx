import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Copy, MessageCircle } from 'lucide-react';
import { DetailSection, OrderDetails, OrderStatusBadge, OrderStatusSelector } from '@/components/orders';
import { buttonClasses, ButtonLink, EmptyState, ErrorState, LoadingState } from '@/components/ui';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { selectOrderById, toast, useOrderStore } from '@/store';
import type { Order, OrderStatus } from '@/types';
import { formatCurrency, formatDateTime, formatOrderId } from '@/utils/format';
import { buildOrderWhatsAppMessage, buildWhatsAppLink } from '@/utils/whatsapp';

export function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const order = useOrderStore(selectOrderById(id));
  const fetchOrderById = useOrderStore((state) => state.fetchOrderById);
  const { run, isLoading, error, errorCode } = useAsync(fetchOrderById, 'No pudimos cargar el pedido.');
  useDocumentTitle(order ? `Pedido ${formatOrderId(order.id)}` : 'Pedido');

  useEffect(() => {
    if (id) void run(id);
  }, [id, run]);

  return (
    <>
      <Link to="/admin/orders" className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
        <ArrowLeft className="size-4" /> Volver a la bandeja
      </Link>

      {order ? (
        <OrderDetailView order={order} />
      ) : isLoading || (!error && !order) ? (
        <LoadingState message="Cargando pedido..." />
      ) : errorCode === 'NOT_FOUND' ? (
        <EmptyState
          title="Pedido no encontrado"
          description="El pedido que buscás no existe o el enlace es incorrecto."
          action={<ButtonLink to="/admin/orders">Volver a la bandeja</ButtonLink>}
        />
      ) : (
        <ErrorState message={error ?? ''} onRetry={() => id && run(id)} />
      )}
    </>
  );
}

function OrderDetailView({ order }: { order: Order }) {
  const updateOrderStatus = useOrderStore((state) => state.updateOrderStatus);
  const [isSaving, setIsSaving] = useState(false);

  const handleStatusChange = async (status: OrderStatus) => {
    setIsSaving(true);
    try {
      await updateOrderStatus(order.id, status);
      toast.success('Estado actualizado', `El pedido ahora está "${status}".`);
    } catch {
      toast.error('Error al actualizar pedido', 'No se pudo cambiar el estado. Intentá nuevamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const whatsappLink = buildWhatsAppLink(order.customer.phone, buildOrderWhatsAppMessage(order));

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(order.id);
      toast.info('Número de pedido copiado');
    } catch {
      toast.error('No se pudo copiar');
    }
  };

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-mono text-2xl font-semibold tracking-wide sm:text-3xl">{formatOrderId(order.id)}</h1>
            <button
              type="button"
              onClick={copyId}
              className="rounded-full p-1.5 text-ink/40 hover:bg-ink/5 hover:text-ink"
              aria-label="Copiar número de pedido"
            >
              <Copy className="size-4" />
            </button>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="mt-1.5 text-sm text-muted">Recibido el {formatDateTime(order.createdAt)}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <OrderDetails order={order} />

        <aside className="flex flex-col gap-6 lg:sticky lg:top-8 lg:self-start">
          <DetailSection title="Total">
            <p className="font-serif text-4xl font-semibold tabular-nums">{formatCurrency(order.total)}</p>
            <p className="mt-1 text-sm text-muted">
              {order.items.reduce((sum, item) => sum + item.quantity, 0)} productos · envío a coordinar
            </p>
          </DetailSection>

          <DetailSection title="Estado">
            <div className="mb-4 flex items-center gap-2 text-sm">
              <span className="text-muted">Actual:</span>
              <OrderStatusBadge status={order.status} />
            </div>
            <OrderStatusSelector currentStatus={order.status} isSaving={isSaving} onSave={handleStatusChange} />
          </DetailSection>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses({ variant: 'whatsapp', size: 'lg', fullWidth: true })}
          >
            <MessageCircle className="size-5" />
            Contactar por WhatsApp
          </a>
          <p className="-mt-3 text-center text-xs text-muted">
            Se abrirá WhatsApp con un mensaje sobre el pedido para {order.customer.firstName}.
          </p>
        </aside>
      </div>
    </>
  );
}
