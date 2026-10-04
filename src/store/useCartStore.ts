import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { rawStorage, STORAGE_KEYS } from '@/services/storage/storage';
import type { Product } from '@/types';

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  /** Stock conocido al momento de agregar; el servidor revalida al crear el pedido. */
  stock: number;
};

export type CartActionResult = { ok: true } | { ok: false; message: string };

type CartState = {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => CartActionResult;
  updateQuantity: (productId: string, quantity: number) => CartActionResult;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  /** Actualiza precio/stock/nombre con los datos más recientes del catálogo. */
  syncWithProducts: (products: Product[]) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        if (!Number.isInteger(quantity) || quantity <= 0) {
          return { ok: false, message: 'La cantidad seleccionada no es válida.' };
        }
        if (product.stock <= 0) {
          return { ok: false, message: 'Este producto está sin stock.' };
        }

        const existing = get().items.find((item) => item.productId === product.id);
        const nextQuantity = (existing?.quantity ?? 0) + quantity;
        if (nextQuantity > product.stock) {
          const available = product.stock - (existing?.quantity ?? 0);
          return {
            ok: false,
            message:
              available > 0
                ? `Stock insuficiente. Podés agregar hasta ${available} unidad${available === 1 ? '' : 'es'} más.`
                : 'Ya tenés en el carrito todas las unidades disponibles.',
          };
        }

        const item: CartItem = {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          stock: product.stock,
          quantity: nextQuantity,
        };
        set((state) => ({
          items: existing
            ? state.items.map((current) => (current.productId === product.id ? item : current))
            : [...state.items, item],
        }));
        return { ok: true };
      },

      updateQuantity: (productId, quantity) => {
        const item = get().items.find((current) => current.productId === productId);
        if (!item) return { ok: false, message: 'El producto no está en el carrito.' };
        if (!Number.isInteger(quantity) || quantity < 1) {
          return { ok: false, message: 'La cantidad mínima es 1.' };
        }
        if (quantity > item.stock) {
          return { ok: false, message: `Solo hay ${item.stock} unidades disponibles.` };
        }
        set((state) => ({
          items: state.items.map((current) =>
            current.productId === productId ? { ...current, quantity } : current,
          ),
        }));
        return { ok: true };
      },

      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((item) => item.productId !== productId) })),

      clearCart: () => set({ items: [] }),

      syncWithProducts: (products) =>
        set((state) => ({
          items: state.items.flatMap((item) => {
            const product = products.find((current) => current.id === item.productId);
            if (!product || product.stock <= 0) return [];
            return [
              {
                ...item,
                name: product.name,
                price: product.price,
                image: product.image,
                stock: product.stock,
                quantity: Math.min(item.quantity, product.stock),
              },
            ];
          }),
        })),
    }),
    {
      name: STORAGE_KEYS.cart,
      version: 1,
      storage: createJSONStorage(() => rawStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

// ----- Selectores --------------------------------------------------------------

type CartSnapshot = Pick<CartState, 'items'>;

export const selectItemCount = (state: CartSnapshot) =>
  state.items.reduce((count, item) => count + item.quantity, 0);

export const selectSubtotal = (state: CartSnapshot) =>
  state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

/** Hoy el envío se coordina aparte, por lo que el total coincide con el subtotal. */
export const selectTotal = (state: CartSnapshot) => selectSubtotal(state);

export const selectQuantityInCart = (productId: string) => (state: CartSnapshot) =>
  state.items.find((item) => item.productId === productId)?.quantity ?? 0;
