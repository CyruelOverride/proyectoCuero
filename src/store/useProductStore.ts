import { create } from 'zustand';
import { productService } from '@/services/api';
import { ApiError, type Product, type ProductInput, type RequestStatus } from '@/types';
import { getErrorMessage } from '@/utils/errors';

type ProductState = {
  products: Product[];
  status: RequestStatus;
  error: string | null;
  fetchProducts: () => Promise<void>;
  /** Devuelve el producto actualizado desde el servicio y lo sincroniza en la lista. */
  fetchProductById: (id: string) => Promise<Product>;
  createProduct: (input: ProductInput) => Promise<Product>;
  updateProduct: (id: string, input: ProductInput) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
};

function upsert(products: Product[], product: Product): Product[] {
  return products.some((item) => item.id === product.id)
    ? products.map((item) => (item.id === product.id ? product : item))
    : [...products, product];
}

export const useProductStore = create<ProductState>()((set) => ({
  products: [],
  status: 'idle',
  error: null,

  fetchProducts: async () => {
    set({ status: 'loading', error: null });
    try {
      const products = await productService.getProducts();
      set({ products, status: 'success' });
    } catch (error) {
      set({ status: 'error', error: getErrorMessage(error, 'Error al cargar los productos.') });
    }
  },

  fetchProductById: async (id) => {
    try {
      const product = await productService.getProductById(id);
      set((state) => ({ products: upsert(state.products, product) }));
      return product;
    } catch (error) {
      // Si el producto fue eliminado, se quita también de la caché local.
      if (error instanceof ApiError && error.code === 'NOT_FOUND') {
        set((state) => ({ products: state.products.filter((product) => product.id !== id) }));
      }
      throw error;
    }
  },

  createProduct: async (input) => {
    const product = await productService.createProduct(input);
    set((state) => ({ products: [...state.products, product] }));
    return product;
  },

  updateProduct: async (id, input) => {
    const product = await productService.updateProduct(id, input);
    set((state) => ({ products: upsert(state.products, product) }));
    return product;
  },

  deleteProduct: async (id) => {
    await productService.deleteProduct(id);
    set((state) => ({ products: state.products.filter((product) => product.id !== id) }));
  },
}));

export const selectProductById = (id: string | undefined) => (state: ProductState) =>
  id ? state.products.find((product) => product.id === id) : undefined;
