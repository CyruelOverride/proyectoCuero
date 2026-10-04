import { create } from 'zustand';
import { authService } from '@/services/api';
import type { User } from '@/types';
import { getErrorMessage } from '@/utils/errors';

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  /** true una vez que se verificó la sesión persistida al iniciar la app. */
  isHydrated: boolean;
  isSubmitting: boolean;
  error: string | null;
  hydrate: () => Promise<void>;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
};

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  isAuthenticated: false,
  isHydrated: false,
  isSubmitting: false,
  error: null,

  hydrate: async () => {
    if (get().isHydrated) return;
    try {
      const user = await authService.getCurrentUser();
      set({ user, isAuthenticated: user !== null, isHydrated: true });
    } catch {
      set({ user: null, isAuthenticated: false, isHydrated: true });
    }
  },

  login: async (username, password) => {
    set({ isSubmitting: true, error: null });
    try {
      const user = await authService.login(username, password);
      set({ user, isAuthenticated: true, isHydrated: true, isSubmitting: false });
      return true;
    } catch (error) {
      set({
        isSubmitting: false,
        error: getErrorMessage(error, 'No pudimos iniciar sesión. Intentá nuevamente.'),
      });
      return false;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } finally {
      set({ user: null, isAuthenticated: false, error: null });
    }
  },

  clearError: () => set({ error: null }),
}));
