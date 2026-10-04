# Mare Estilo Artesanías — Ecommerce de marroquinería

Tienda pública + panel administrativo construidos con React 19, TypeScript (strict), Vite, React Router,
Zustand y Tailwind CSS v4. La persistencia es local (localStorage) detrás de una capa de servicios
asíncrona que simula una API REST.

## Scripts

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + build de producción
npm run lint
```

Acceso admin (solo demo): `admin` / `admin123` en `/login`.

## Arquitectura

```
Page / Component → Store (zustand) → Service (services/api) → storage adapter → localStorage
```

- `src/services/storage/storage.ts` es el único archivo que toca `localStorage`.
- `src/services/api/*` expone `productService`, `orderService`, `authService` y `notificationService`
  con métodos async, latencia simulada y errores tipados (`ApiError`).
- `src/store/*` contiene stores separados por responsabilidad (carrito, auth, productos, pedidos, toasts).
- Las validaciones (`src/utils/validation.ts`) se ejecutan en la UI y también dentro de los servicios.

## Migrar a un backend real

1. Reemplazar `simulateRequest` (`services/api/httpClient.ts`) por un cliente `fetch`/axios que
   devuelva `Promise<T>` y rechace con `ApiError`.
2. Reimplementar cada servicio respetando su contrato (`ProductService`, `OrderService`, `AuthService`).
   En `createOrder`, el backend debe resolver precios, validar stock y descontarlo en una transacción.
3. Registrar nuevos canales en `notificationService` (email, WhatsApp, WebSocket…).

Páginas, componentes y stores no necesitan cambios.
"# proyectoCuero" 
