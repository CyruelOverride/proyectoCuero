import { Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { OrderSuccess } from '@/components/checkout';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export function OrderSuccessPage() {
  useDocumentTitle('Pedido recibido');
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const stateOrderId = (location.state as { orderId?: unknown } | null)?.orderId;
  const orderId = typeof stateOrderId === 'string' ? stateOrderId : searchParams.get('id');

  if (!orderId) return <Navigate to="/" replace />;

  return (
    <div className="px-4 py-20 sm:px-6 lg:py-28">
      <OrderSuccess orderId={orderId} />
    </div>
  );
}
