import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ExternalLink, Inbox, LayoutDashboard, LogOut, Package } from 'lucide-react';
import { selectNewOrdersCount, useAuthStore, useOrderStore } from '@/store';
import { cn } from '@/utils/cn';
import { CountBadge, Spinner } from '../ui';
import { Logo } from './Logo';

const navItemClasses = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
    isActive ? 'bg-ivory/10 text-ivory' : 'text-ivory/60 hover:bg-ivory/5 hover:text-ivory',
  );

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const newOrdersCount = useOrderStore(selectNewOrdersCount);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-full flex-col bg-espresso px-4 py-6">
      <div className="px-3">
        <Logo to="/admin" tone="light" size="sm" subtitle="Panel de gestión" />
      </div>

      <nav aria-label="Administración" className="mt-10 flex-1">
        <ul className="space-y-1">
          <li>
            <NavLink to="/admin" end className={navItemClasses} onClick={onNavigate}>
              <LayoutDashboard className="size-4" />
              Panel
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/products" className={navItemClasses} onClick={onNavigate}>
              <Package className="size-4" />
              Productos
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/orders" className={navItemClasses} onClick={onNavigate}>
              <Inbox className="size-4" />
              <span className="flex-1">Bandeja de Entrada</span>
              <CountBadge
                count={newOrdersCount}
                label={`${newOrdersCount} ${newOrdersCount === 1 ? 'pedido nuevo' : 'pedidos nuevos'}`}
              />
            </NavLink>
          </li>
        </ul>

        <div className="mt-8 border-t border-ivory/10 pt-6">
          <NavLink to="/" className={navItemClasses({ isActive: false })} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="size-4" />
            Ver tienda
          </NavLink>
        </div>
      </nav>

      <div className="border-t border-ivory/10 pt-5">
        {user && (
          <div className="mb-4 flex items-center gap-3 px-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-cognac/80 font-serif text-lg text-ivory">
              {user.displayName.charAt(0)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm text-ivory">{user.displayName}</p>
              <p className="truncate text-xs text-ivory/40">@{user.username}</p>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ivory/60 transition-colors hover:bg-ivory/5 hover:text-ivory disabled:opacity-60"
        >
          {isLoggingOut ? <Spinner size="sm" /> : <LogOut className="size-4" />}
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
