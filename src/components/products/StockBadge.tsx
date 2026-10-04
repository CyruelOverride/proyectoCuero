import type { StockLevel } from '@/types';
import { getStockLevel } from '@/utils/products';
import { Badge, type BadgeTone } from '../ui';

const config: Record<StockLevel, { tone: BadgeTone; label: (stock: number) => string }> = {
  available: { tone: 'success', label: () => 'Disponible' },
  low: { tone: 'warning', label: (stock) => `Últimas ${stock === 1 ? 'unidad' : `${stock} unidades`}` },
  out: { tone: 'neutral', label: () => 'Sin stock' },
};

export function StockBadge({ stock, className }: { stock: number; className?: string }) {
  const { tone, label } = config[getStockLevel(stock)];
  return (
    <Badge tone={tone} dot className={className}>
      {label(stock)}
    </Badge>
  );
}
