import { initialProducts } from '@/data/initialProducts';
import { hasItem, readJson, STORAGE_KEYS, writeJson } from '@/services/storage/storage';
import { ApiError, type Product, type ProductInput } from '@/types';
import { generateId } from '@/utils/id';
import { normalizeTags } from '@/utils/products';
import { hasErrors, validateProduct } from '@/utils/validation';
import { simulateRequest } from './httpClient';

// ----- "Base de datos" local -------------------------------------------------

/**
 * Versión del catálogo semilla. v2: los productos iniciales pasan a usar las
 * categorías generales del filtro (billeteras, cinturones, carteras, bolsos, accesorios).
 */
const CATALOG_VERSION = 2;

/** Actualiza los tags de los productos semilla ya guardados, sin tocar los creados por el admin. */
function migrateCatalog(products: Product[]): Product[] {
  const seedTags = new Map(initialProducts.map((product) => [product.id, product.tags]));
  return products.map((product) => {
    const tags = seedTags.get(product.id);
    return tags ? { ...product, tags } : product;
  });
}

function loadProducts(): Product[] {
  if (!hasItem(STORAGE_KEYS.products)) {
    writeJson(STORAGE_KEYS.products, initialProducts);
    writeJson(STORAGE_KEYS.catalogVersion, CATALOG_VERSION);
  } else if (readJson<number>(STORAGE_KEYS.catalogVersion, 1) < CATALOG_VERSION) {
    writeJson(STORAGE_KEYS.products, migrateCatalog(readJson<Product[]>(STORAGE_KEYS.products, [])));
    writeJson(STORAGE_KEYS.catalogVersion, CATALOG_VERSION);
  }
  return readJson<Product[]>(STORAGE_KEYS.products, []);
}

function saveProducts(products: Product[]): void {
  writeJson(STORAGE_KEYS.products, products);
}

function findProductOrThrow(products: Product[], id: string): Product {
  const product = products.find((item) => item.id === id);
  if (!product) throw new ApiError('NOT_FOUND', 'Producto no encontrado.');
  return product;
}

/** Validación del lado "servidor": no se confía solo en la validación de la UI. */
function sanitizeProductInput(input: ProductInput): ProductInput {
  const product: ProductInput = {
    name: input.name.trim(),
    price: Number(input.price),
    description: input.description.trim(),
    tags: normalizeTags(input.tags),
    stock: Number(input.stock),
    image: input.image.trim(),
  };
  const errors = validateProduct(product);
  if (hasErrors(errors)) {
    throw new ApiError('VALIDATION', 'Revisá los datos del producto.', errors as Record<string, string>);
  }
  return product;
}

// ----- Repositorio interno (usado también por orderService) -----------------

export const productRepository = {
  findAll: loadProducts,
  saveAll: saveProducts,
};

// ----- API pública -----------------------------------------------------------

export const productService = {
  getProducts(): Promise<Product[]> {
    return simulateRequest(() => loadProducts());
  },

  getProductById(id: string): Promise<Product> {
    return simulateRequest(() => findProductOrThrow(loadProducts(), id));
  },

  createProduct(input: ProductInput): Promise<Product> {
    return simulateRequest(() => {
      const product: Product = { id: generateId(), ...sanitizeProductInput(input) };
      saveProducts([...loadProducts(), product]);
      return product;
    });
  },

  updateProduct(id: string, input: ProductInput): Promise<Product> {
    return simulateRequest(() => {
      const products = loadProducts();
      findProductOrThrow(products, id);
      const updated: Product = { id, ...sanitizeProductInput(input) };
      saveProducts(products.map((product) => (product.id === id ? updated : product)));
      return updated;
    });
  },

  deleteProduct(id: string): Promise<void> {
    return simulateRequest(() => {
      const products = loadProducts();
      findProductOrThrow(products, id);
      saveProducts(products.filter((product) => product.id !== id));
    });
  },
};

export type ProductService = typeof productService;
