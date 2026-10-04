import { create } from 'zustand';
import { generateId } from '@/utils/id';

export type ToastVariant = 'success' | 'error' | 'info';

export type Toast = {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
};

type ToastState = {
  toasts: Toast[];
  show: (toast: Omit<Toast, 'id'>, durationMs?: number) => void;
  dismiss: (id: string) => void;
};

const MAX_VISIBLE = 3;

export const useToastStore = create<ToastState>()((set, get) => ({
  toasts: [],

  show: (toast, durationMs = 3500) => {
    const id = generateId();
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }].slice(-MAX_VISIBLE) }));
    window.setTimeout(() => get().dismiss(id), durationMs);
  },

  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
}));

/** Atajo para disparar toasts desde cualquier componente. */
export const toast = {
  success: (title: string, description?: string) =>
    useToastStore.getState().show({ variant: 'success', title, description }),
  error: (title: string, description?: string) =>
    useToastStore.getState().show({ variant: 'error', title, description }, 5000),
  info: (title: string, description?: string) =>
    useToastStore.getState().show({ variant: 'info', title, description }),
};
