import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  /** Evita cerrar con Esc o click afuera (ej. mientras se procesa una acción). */
  isDismissable?: boolean;
};

const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' };

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  isDismissable = true,
}: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
    (focusables?.[focusables.length - 1] ?? dialogRef.current)?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isDismissable) onCloseRef.current();
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const elements = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus();
    };
  }, [isOpen, isDismissable]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <div
        aria-hidden
        className="absolute inset-0 animate-fade-in bg-ink/50 backdrop-blur-[2px]"
        onClick={() => isDismissable && onClose()}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cn(
          'relative w-full animate-slide-up rounded-2xl bg-ivory p-6 shadow-2xl shadow-ink/20 sm:p-7',
          sizes[size],
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-2xl font-semibold">
            {title}
          </h2>
          {isDismissable && (
            <button
              type="button"
              onClick={onClose}
              className="-mr-2 -mt-1 rounded-full p-2 text-ink/50 transition-colors hover:bg-ink/5 hover:text-ink"
              aria-label="Cerrar"
            >
              <X className="size-5" />
            </button>
          )}
        </div>
        {description && (
          <div id={descriptionId} className="mt-2 text-sm leading-relaxed text-muted">
            {description}
          </div>
        )}
        {children && <div className="mt-5">{children}</div>}
        {footer && <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
