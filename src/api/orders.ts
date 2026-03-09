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

/** Создать тестовый заказ (бекенд: первый товар, 2 шт — в админку и в Telegram) */
export async function createTestOrder(accessToken: string): Promise<OrderBackend> {
  return request<OrderBackend>('orders/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, accessToken)
}

/** Формат ORDER_PAYLOAD з магазину (customer.fullName, items з variant, summary) */
export interface OrderPayloadCustomer {
  fullName?: string
  email: string
  phone: string
  address?: string
  city?: string
  comment?: string
}

export interface OrderPayloadVariant {
  name?: { ua?: string; ru?: string; en?: string }
  price?: { current?: number; old?: number | null; currency?: string }
  image?: string | null
  isActive?: boolean
  sku?: string
  stock?: number
}

export interface OrderPayloadItem {
  productId: string
  title?: string
  qty: number
  price?: number
  subtotal?: number
  currency?: string
  image?: string
  variant?: OrderPayloadVariant
}

export interface OrderPayloadSummary {
  totalItems?: number
  totalPrice?: number
  currency?: string
}

export interface OrderPayload {
  customer: OrderPayloadCustomer
  items: OrderPayloadItem[]
  summary?: OrderPayloadSummary
}

/** Відправити замовлення в форматі ORDER_PAYLOAD (POST /orders/checkout). Публічний ендпоінт — заказ потрапляє в адмінку та в Telegram. */
export async function submitOrderPayload(payload: OrderPayload): Promise<OrderBackend> {
  return request<OrderBackend>('orders/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}
