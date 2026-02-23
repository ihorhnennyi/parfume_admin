import { request } from './client'
import type { OrderBackend } from '../types/order'

/** Список заказов (для админки) */
export async function getOrders(
  accessToken: string,
  includeInactive = true,
): Promise<OrderBackend[]> {
  const path = `orders?includeInactive=${includeInactive}`
  const data = await request<OrderBackend[]>(path, undefined, accessToken)
  return Array.isArray(data) ? data : []
}

/** Один заказ по ID */
export async function getOrder(
  id: string,
  accessToken: string,
): Promise<OrderBackend | null> {
  try {
    return await request<OrderBackend>(`orders/${id}`, undefined, accessToken)
  } catch {
    return null
  }
}

/** Удалить заказ (только для админа) */
export async function deleteOrder(id: string, accessToken: string): Promise<void> {
  await request(`orders/${id}`, { method: 'DELETE' }, accessToken)
}

/** Тело создания заказа (публичный API) */
export interface CreateOrderBody {
  items: Array<{ product: string; quantity: number; variant?: string }>
  customer: {
    firstName: string
    lastName: string
    email: string
    phone: string
    company?: string
  }
  deliveryAddress?: {
    country: string
    city: string
    street: string
    building?: string
    apartment?: string
    postalCode?: string
    notes?: string
  }
  paymentMethod: string
  deliveryMethod: string
  notes?: string
  deliveryCost?: number
  currency?: string
}

/** Создать заказ (публичный эндпоинт, без токена) */
export async function createOrder(body: CreateOrderBody): Promise<OrderBackend> {
  return request<OrderBackend>('orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

/** Создать тестовый заказ из первого товара (для админки) */
export async function createTestOrder(accessToken: string): Promise<OrderBackend> {
  const { getProducts } = await import('./products')
  const products = await getProducts(true)
  if (!products.length) {
    throw new Error('Нет товаров. Сначала создайте товар.')
  }
  const product = products[0]
  const productId = product._id ?? product.id ?? ''
  if (!productId) {
    throw new Error('Не удалось получить ID товара')
  }
  const hasVariants = product.variants && product.variants.length > 0
  const body: CreateOrderBody = {
    items: [
      {
        product: productId,
        quantity: 2,
        ...(hasVariants ? { variant: '0' } : {}),
      },
    ],
    customer: {
      firstName: 'Тест',
      lastName: 'Тестов',
      email: 'test@example.com',
      phone: '+380501234567',
    },
    deliveryAddress: {
      country: 'Украина',
      city: 'Киев',
      street: 'ул. Хрещатик',
      building: '1',
      apartment: '10',
      postalCode: '01001',
      notes: 'Тестовый заказ',
    },
    paymentMethod: 'cash',
    deliveryMethod: 'courier',
    notes: 'Тестовый заказ из админки',
    deliveryCost: 50,
    currency: 'UAH',
  }
  return createOrder(body)
}
