import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate, type Location } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Info } from 'lucide-react';
import { Logo } from '@/components/layout';
import { Button, Input, LoadingState } from '@/components/ui';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useAuthStore } from '@/store';

const LOGIN_IMAGE =
  'https://images.unsplash.com/photo-1473188588951-666fce8e7c68?auto=format&fit=crop&w=1400&q=80';

function getRedirectPath(state: unknown): string {
  const from = (state as { from?: Location } | null)?.from;
  return from?.pathname?.startsWith('/admin') ? `${from.pathname}${from.search ?? ''}` : '/admin';
}

export function LoginPage() {
  useDocumentTitle('Acceso administración');
  const { isAuthenticated, isHydrated, isSubmitting, error, login, clearError } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);

  const redirectTo = getRedirectPath(location.state);

  if (!isHydrated) return <LoadingState message="Verificando sesión..." className="min-h-svh" />;
  if (isAuthenticated && !isSubmitting) return <Navigate to={redirectTo} replace />;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!username.trim() || !password) {
      setFieldError('Completá usuario y contraseña.');
      return;
    }
    setFieldError(null);
    if (await login(username, password)) navigate(redirectTo, { replace: true });
  };

  const message = fieldError ?? error;

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-espresso lg:block">
        <img src={LOGIN_IMAGE} alt="" className="absolute inset-0 size-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-ink/10" />
        <div className="absolute inset-x-12 bottom-12 text-ivory">
          <p className="font-serif text-4xl leading-tight font-medium">
            “El buen cuero se elige con las manos y se cuida con el tiempo.”
          </p>
          <p className="mt-4 text-sm text-ivory/60">Taller Mare Estilo Artesanías</p>
        </div>
      </div>

      <div className="flex flex-col px-6 py-8 sm:px-12">
        <Link to="/" className="inline-flex items-center gap-2 self-start text-sm text-muted hover:text-ink">
          <ArrowLeft className="size-4" /> Volver a la tienda
        </Link>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          <Logo subtitle="Panel de gestión" />
          <h1 className="mt-10 text-4xl font-semibold">Iniciar sesión</h1>
          <p className="mt-2 text-sm text-muted">Ingresá con tu usuario de administración.</p>

          <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-5">
            <Input
              label="Usuario"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
                if (error) clearError();
              }}
            />
            <Input
              label="Contraseña"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (error) clearError();
              }}
            />

            {message && (
              <p role="alert" className="flex items-center gap-2 rounded-lg bg-danger/5 px-3.5 py-3 text-sm text-danger">
                <AlertCircle className="size-4 shrink-0" />
                {message}
              </p>
            )}

            <Button type="submit" size="lg" fullWidth isLoading={isSubmitting} loadingText="Ingresando...">
              Ingresar
            </Button>
          </form>

          <p className="mt-8 flex items-start gap-2 rounded-lg border border-ink/10 bg-ivory p-3.5 text-xs leading-relaxed text-muted">
            <Info className="mt-0.5 size-3.5 shrink-0" />
            <span>
              Entorno de demostración: usuario <strong className="text-ink">admin</strong>, contraseña{' '}
              <strong className="text-ink">admin123</strong>. No usar este mecanismo en producción.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
