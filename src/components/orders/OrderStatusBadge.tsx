import type { OrderStatus } from '@/types';
import { Badge, type BadgeTone } from '../ui';

const tones: Record<OrderStatus, BadgeTone> = {
  Nuevo: 'danger',
  Confirmado: 'success',
  'En proceso': 'info',
  Cancelado: 'neutral',
  Rechazado: 'warning',
};

export function OrderStatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  return (
    <Badge tone={tones[status]} dot className={className}>
      {status}
    </Badge>
  );
}
