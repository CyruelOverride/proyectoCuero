import { ShoppingBag } from 'lucide-react';
import { ButtonLink, EmptyState } from '../ui';

export function CartEmptyState() {
  return (
    <EmptyState
      className="py-24"
      icon={<ShoppingBag />}
      title="Tu carrito está vacío"
      description="Todavía no agregaste productos. Recorré la colección y encontrá la pieza que te acompañe por años."
      action={
        <ButtonLink to="/#coleccion" size="lg">
          Volver a la tienda
        </ButtonLink>
      }
    />
  );
}
