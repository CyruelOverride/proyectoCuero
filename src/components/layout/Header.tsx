import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, ShoppingBag, UserRound, X } from 'lucide-react';
import { selectItemCount, useAuthStore, useCartStore } from '@/store';
import { cn } from '@/utils/cn';
import { Logo } from './Logo';

const NAV_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/#coleccion', label: 'Colección' },
  { to: '/#taller', label: 'El taller' },
];

export function Header() {
  const itemCount = useCartStore(selectItemCount);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cierra el menú mobile al navegar.
  const [lastLocation, setLastLocation] = useState(location);
  if (lastLocation !== location) {
    setLastLocation(location);
    setIsMenuOpen(false);
  }

  const adminLink = isAuthenticated ? '/admin' : '/login';
  const adminLabel = isAuthenticated ? 'Panel admin' : 'Acceso admin';

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b transition-colors duration-300',
        isScrolled || isMenuOpen ? 'border-ink/10 bg-cream/95 backdrop-blur' : 'border-transparent bg-cream',
      )}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-9 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end
                  className="relative py-2 text-ink/70 transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-ink after:transition-transform hover:text-ink hover:after:scale-x-100"
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            to={adminLink}
            className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm text-ink/70 transition-colors hover:bg-ink/5 hover:text-ink sm:inline-flex"
          >
            <UserRound className="size-4" />
            {adminLabel}
          </Link>
          <Link
            to="/cart"
            className="relative inline-flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5"
            aria-label={`Carrito, ${itemCount} ${itemCount === 1 ? 'producto' : 'productos'}`}
          >
            <ShoppingBag className="size-5" />
            {itemCount > 0 && (
              <span
                key={itemCount}
                className="absolute top-1 right-0.5 flex min-w-5 animate-slide-up items-center justify-center rounded-full bg-leather px-1 text-[10px] leading-5 font-semibold text-white"
              >
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full transition-colors hover:bg-ink/5 md:hidden"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav id="mobile-menu" aria-label="Menú mobile" className="animate-fade-in border-t border-ink/10 md:hidden">
          <ul className="flex flex-col px-4 py-4">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="block py-3 font-serif text-2xl" onClick={() => setIsMenuOpen(false)}>
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mt-2 border-t border-ink/10 pt-4">
              <Link to={adminLink} className="flex items-center gap-2 py-2 text-sm text-ink/70">
                <UserRound className="size-4" />
                {adminLabel}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
