import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useToastStore, type ToastVariant } from '@/store';
import { cn } from '@/utils/cn';

const icons: Record<ToastVariant, typeof Info> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const iconColors: Record<ToastVariant, string> = {
  success: 'text-success',
  error: 'text-danger',
  info: 'text-leather',
};

export function Toaster() {
  const toasts = useToastStore((state) => state.toasts);
  const dismiss = useToastStore((state) => state.dismiss);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end"
    >
      {toasts.map((toast) => {
        const Icon = icons[toast.variant];
        return (
          <div
            key={toast.id}
            role={toast.variant === 'error' ? 'alert' : 'status'}
            className="pointer-events-auto flex w-full max-w-sm animate-slide-up items-start gap-3 rounded-xl border border-ink/10 bg-ivory p-4 shadow-xl shadow-ink/10"
          >
            <Icon className={cn('mt-0.5 size-5 shrink-0', iconColors[toast.variant])} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink">{toast.title}</p>
              {toast.description && <p className="mt-0.5 text-sm text-muted">{toast.description}</p>}
            </div>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              className="rounded-full p-1 text-ink/40 transition-colors hover:bg-ink/5 hover:text-ink"
              aria-label="Cerrar notificación"
            >
              <X className="size-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
