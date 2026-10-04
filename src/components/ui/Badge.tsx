import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'leather' | 'dark';

const tones: Record<BadgeTone, string> = {
  neutral: 'bg-ink/5 text-ink/70 ring-ink/10',
  success: 'bg-success/10 text-success ring-success/20',
  warning: 'bg-warning/10 text-warning ring-warning/25',
  danger: 'bg-danger/10 text-danger ring-danger/20',
  info: 'bg-sky-50 text-sky-800 ring-sky-200',
  leather: 'bg-leather/10 text-leather-dark ring-leather/20',
  dark: 'bg-ink text-ivory ring-ink',
};

type BadgeProps = {
  tone?: BadgeTone;
  dot?: boolean;
  className?: string;
  children: ReactNode;
};

export function Badge({ tone = 'neutral', dot = false, className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        tones[tone],
        className,
      )}
    >
      {dot && <span aria-hidden className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

/** Contador numérico circular (ej. pedidos nuevos o items del carrito). */
export function CountBadge({ count, className, label }: { count: number; className?: string; label?: string }) {
  if (count <= 0) return null;
  return (
    <span
      aria-label={label}
      className={cn(
        'inline-flex min-w-5 items-center justify-center rounded-full bg-danger px-1.5 text-[11px] font-semibold leading-5 text-white',
        className,
      )}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}
