import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';
import { ScrollManager } from '@/components/layout';
import { Toaster } from '@/components/ui';
import { AdminLayout } from '@/layouts/AdminLayout';
import { PublicLayout } from '@/layouts/PublicLayout';
import { CartPage } from '@/pages/CartPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { OrderSuccessPage } from '@/pages/OrderSuccessPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminOrderDetailPage } from '@/pages/admin/AdminOrderDetailPage';
import { AdminOrdersPage } from '@/pages/admin/AdminOrdersPage';
import { AdminProductFormPage } from '@/pages/admin/AdminProductFormPage';
import { AdminProductsPage } from '@/pages/admin/AdminProductsPage';
import { ProtectedRoute } from './ProtectedRoute';

function RootLayout() {
  return (
    <>
      <ScrollManager />
      <Outlet />
      <Toaster />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { path: '/', element: <HomePage /> },
          { path: '/products/:id', element: <ProductDetailPage /> },
          { path: '/cart', element: <CartPage /> },
          { path: '/checkout', element: <CheckoutPage /> },
          { path: '/order-success', element: <OrderSuccessPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
      { path: '/login', element: <LoginPage /> },
      {
        path: '/admin',
        element: (
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: 'products', element: <AdminProductsPage /> },
          { path: 'products/new', element: <AdminProductFormPage /> },
          { path: 'products/:id/edit', element: <AdminProductFormPage /> },
          { path: 'orders', element: <AdminOrdersPage /> },
          { path: 'orders/:id', element: <AdminOrderDetailPage /> },
          // Alias en español de la bandeja de entrada.
          { path: 'inbox', element: <Navigate to="/admin/orders" replace /> },
          { path: '*', element: <Navigate to="/admin" replace /> },
        ],
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
