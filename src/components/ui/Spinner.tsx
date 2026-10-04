import { cn } from '@/utils/cn';

type SpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
};

const sizes = { sm: 'size-4 border-2', md: 'size-6 border-2', lg: 'size-10 border-[3px]' };

export function Spinner({ size = 'md', className, label }: SpinnerProps) {
  return (
    <span
      role={label ? 'status' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn('inline-block animate-spin rounded-full border-current border-r-transparent', sizes[size], className)}
    />
  );
}

/** Indicador de carga a pantalla/sección completa con texto. */
export function LoadingState({ message, className }: { message: string; className?: string }) {
  return (
    <div role="status" className={cn('flex flex-col items-center justify-center gap-4 py-20 text-muted', className)}>
      <Spinner size="lg" className="text-leather" />
      <p className="text-sm tracking-wide">{message}</p>
    </div>
  );
}
