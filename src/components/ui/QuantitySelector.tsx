import { Minus, Plus } from 'lucide-react';
import { cn } from '@/utils/cn';

type QuantitySelectorProps = {
  value: number;
  min?: number;
  max: number;
  onChange: (value: number) => void;
  size?: 'sm' | 'md';
  disabled?: boolean;
  label?: string;
};

export function QuantitySelector({
  value,
  min = 1,
  max,
  onChange,
  size = 'md',
  disabled = false,
  label = 'Cantidad',
}: QuantitySelectorProps) {
  const buttonClass = cn(
    'flex items-center justify-center text-ink/70 transition-colors hover:bg-ink/5 hover:text-ink disabled:cursor-not-allowed disabled:text-ink/20 disabled:hover:bg-transparent',
    size === 'sm' ? 'size-8' : 'size-11',
  );

  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        'inline-flex items-center overflow-hidden rounded-full border border-ink/15 bg-ivory',
        disabled && 'opacity-50',
      )}
    >
      <button
        type="button"
        className={buttonClass}
        onClick={() => onChange(value - 1)}
        disabled={disabled || value <= min}
        aria-label="Disminuir cantidad"
      >
        <Minus className="size-4" />
      </button>
      <span
        aria-live="polite"
        className={cn('text-center font-medium tabular-nums', size === 'sm' ? 'w-8 text-sm' : 'w-10')}
      >
        {value}
      </span>
      <button
        type="button"
        className={buttonClass}
        onClick={() => onChange(value + 1)}
        disabled={disabled || value >= max}
        aria-label="Aumentar cantidad"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
