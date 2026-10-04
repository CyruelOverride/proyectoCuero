import { Compass } from 'lucide-react';
import { ButtonLink, EmptyState } from '@/components/ui';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export function NotFoundPage() {
  useDocumentTitle('Página no encontrada');
  return (
    <EmptyState
      className="py-28"
      icon={<Compass />}
      title="No encontramos esta página"
      description="Puede que el enlace esté roto o que la página haya cambiado de lugar."
      action={<ButtonLink to="/">Volver al inicio</ButtonLink>}
    />
  );
}
