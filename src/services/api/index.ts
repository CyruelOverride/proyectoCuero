/**
 * Punto de entrada de la capa de API. Los stores importan los servicios desde
 * aquí: para migrar a un backend real alcanza con exportar implementaciones
 * HTTP que respeten los mismos contratos (ProductService, OrderService, AuthService).
 */
export { authService, type AuthService } from './authService';
export { notificationService, type NotificationChannel } from './notificationService';
export { orderService, type OrderService } from './orderService';
export { productService, type ProductService } from './productService';
