import { readJson, removeItem, STORAGE_KEYS, writeJson } from '@/services/storage/storage';
import { ApiError, type Session, type User } from '@/types';
import { generateId } from '@/utils/id';
import { simulateRequest } from './httpClient';

/**
 * ⚠️ Credenciales SOLO para desarrollo/demo. Esto no es un mecanismo de
 * autenticación seguro: en producción la validación debe hacerla el backend
 * y el token debe ser emitido y verificado por el servidor.
 */
const DEMO_CREDENTIALS = { username: 'admin', password: 'admin123' } as const;

const DEMO_USER: User = {
  id: 'admin-1',
  username: DEMO_CREDENTIALS.username,
  displayName: 'Administrador',
  role: 'admin',
};

const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

function readValidSession(): Session | null {
  const session = readJson<Session | null>(STORAGE_KEYS.session, null);
  if (!session) return null;
  if (new Date(session.expiresAt).getTime() <= Date.now()) {
    removeItem(STORAGE_KEYS.session);
    return null;
  }
  return session;
}

export const authService = {
  login(username: string, password: string): Promise<User> {
    return simulateRequest(
      () => {
        const isValid =
          username.trim() === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password;
        if (!isValid) throw new ApiError('UNAUTHORIZED', 'Usuario o contraseña incorrectos.');

        const session: Session = {
          user: DEMO_USER,
          token: `demo.${generateId()}`,
          expiresAt: new Date(Date.now() + SESSION_DURATION_MS).toISOString(),
        };
        writeJson(STORAGE_KEYS.session, session);
        return session.user;
      },
      { delay: 700 },
    );
  },

  logout(): Promise<void> {
    return simulateRequest(() => removeItem(STORAGE_KEYS.session), { delay: 200 });
  },

  getCurrentUser(): Promise<User | null> {
    return simulateRequest(() => readValidSession()?.user ?? null, { delay: 150 });
  },
};

export type AuthService = typeof authService;
