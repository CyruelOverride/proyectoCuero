import type { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from './Button';

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center px-6 py-16 text-center', className)}>
      {icon && (
        <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-sand/70 text-leather [&_svg]:size-7">
          {icon}
        </div>
      )}
      <h2 className="text-2xl font-semibold sm:text-3xl">{title}</h2>
      {description && <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">{description}</p>}
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}

type ErrorStateProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
  action?: ReactNode;
  className?: string;
};

export function ErrorState({ title = 'Algo salió mal', message, onRetry, action, className }: ErrorStateProps) {
  return (
    <EmptyState
      className={className}
      icon={<AlertCircle />}
      title={title}
      description={message}
      action={
        action ??
        (onRetry && (
          <Button variant="outline" onClick={onRetry}>
            Reintentar
          </Button>
        ))
      }
    />
  );
}
