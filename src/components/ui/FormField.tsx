import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

const controlClasses = (hasError: boolean) =>
  cn(
    'w-full rounded-lg border bg-ivory px-3.5 text-sm text-ink placeholder:text-ink/35',
    'transition-colors duration-150 focus:outline-none focus:ring-2',
    'disabled:cursor-not-allowed disabled:opacity-60',
    hasError
      ? 'border-danger/60 focus:border-danger focus:ring-danger/15'
      : 'border-ink/15 hover:border-ink/30 focus:border-leather focus:ring-leather/15',
  );

type FieldWrapperProps = {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  required?: boolean;
  className?: string;
  children: ReactNode;
};

function FieldWrapper({ id, label, error, hint, required, className, children }: FieldWrapperProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-sm font-medium text-ink/80">
        {label}
        {required && (
          <span aria-hidden className="ml-0.5 text-leather">
            *
          </span>
        )}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

type CommonProps = {
  label: string;
  error?: string;
  hint?: ReactNode;
  containerClassName?: string;
};

function describedBy(id: string, error?: string, hint?: ReactNode) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

export function Input({
  label,
  error,
  hint,
  containerClassName,
  className,
  id: providedId,
  required,
  ...props
}: CommonProps & InputHTMLAttributes<HTMLInputElement>) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  return (
    <FieldWrapper id={id} label={label} error={error} hint={hint} required={required} className={containerClassName}>
      <input
        id={id}
        required={required}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={cn(controlClasses(Boolean(error)), 'h-11', className)}
        {...props}
      />
    </FieldWrapper>
  );
}

export function Textarea({
  label,
  error,
  hint,
  containerClassName,
  className,
  id: providedId,
  required,
  ...props
}: CommonProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  return (
    <FieldWrapper id={id} label={label} error={error} hint={hint} required={required} className={containerClassName}>
      <textarea
        id={id}
        required={required}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={cn(controlClasses(Boolean(error)), 'min-h-24 resize-y py-2.5', className)}
        {...props}
      />
    </FieldWrapper>
  );
}

export function Select({
  label,
  error,
  hint,
  containerClassName,
  className,
  id: providedId,
  required,
  children,
  ...props
}: CommonProps & SelectHTMLAttributes<HTMLSelectElement>) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  return (
    <FieldWrapper id={id} label={label} error={error} hint={hint} required={required} className={containerClassName}>
      <select
        id={id}
        required={required}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={cn(controlClasses(Boolean(error)), 'h-11 cursor-pointer', className)}
        {...props}
      >
        {children}
      </select>
    </FieldWrapper>
  );
}
