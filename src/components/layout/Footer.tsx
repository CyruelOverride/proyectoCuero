import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Logo } from './Logo';

const year = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="bg-espresso text-ivory/70">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <Logo tone="light" subtitle="Marroquinería artesanal · Desde 2009" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed">
            Diseñamos y confeccionamos cada pieza en nuestro taller con cueros vacunos seleccionados, curtidos al
            vegetal y cosidos a mano.
          </p>
        </div>

        <div>
          <h2 className="font-sans text-xs font-medium tracking-[0.25em] text-ivory uppercase">Tienda</h2>
          <ul className="mt-5 space-y-3 text-sm">
            <li><Link to="/#coleccion" className="transition-colors hover:text-ivory">Colección</Link></li>
            <li><Link to="/cart" className="transition-colors hover:text-ivory">Carrito</Link></li>
            <li><Link to="/#taller" className="transition-colors hover:text-ivory">El taller</Link></li>
            <li><Link to="/login" className="transition-colors hover:text-ivory">Acceso administración</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="font-sans text-xs font-medium tracking-[0.25em] text-ivory uppercase">Contacto</h2>
          <ul className="mt-5 space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              Gurruchaga 1650, Palermo, CABA
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="size-4 shrink-0" />
              +54 9 11 4567-8900
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="size-4 shrink-0" />
              hola@mareestilo.com.ar
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ivory/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-ivory/40 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <p>© {year} Mare Estilo Artesanías. Todos los derechos reservados.</p>
          <p>Envíos a todo el país · Cambios dentro de los 30 días</p>
        </div>
      </div>
    </footer>
  );
}
