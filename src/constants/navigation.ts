/** Пути приложения */
export const ROUTES = {
  dashboard: '/dashboard',
  categories: '/categories',
  products: '/products',
  orders: '/orders',
} as const

/** Пункты меню сайдбара */
export const SIDEBAR_ITEMS = [
  { path: ROUTES.dashboard, label: 'Дашборд' },
  { path: ROUTES.categories, label: 'Категории' },
  { path: ROUTES.products, label: 'Товары' },
  { path: ROUTES.orders, label: 'Заказы' },
] as const
