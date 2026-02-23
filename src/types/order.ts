/** Данные клиента с бэкенда */
export interface OrderCustomerBackend {
  firstName: string
  lastName: string
  email: string
  phone: string
  company?: string
}

/** Адрес доставки с бэкенда */
export interface OrderDeliveryAddressBackend {
  country: string
  city: string
  street: string
  building?: string
  apartment?: string
  postalCode?: string
  notes?: string
}

/** Позиция заказа с бэкенда (с вариантом и картинкой) */
export interface OrderItemBackend {
  product: string
  productName: string
  productSlug?: string
  productImage?: string | null
  quantity: number
  price: number
  discount?: number
  total: number
  variant?: string | null
  variantName?: string | null
  variantImage?: string | null
  attributes?: Record<string, unknown>
}

/** Заказ с бэкенда (полная структура) */
export interface OrderBackend {
  _id: string
  orderNumber: string
  items: OrderItemBackend[]
  customer: OrderCustomerBackend
  deliveryAddress?: OrderDeliveryAddressBackend | null
  status: string
  paymentMethod: string
  deliveryMethod: string
  subtotal: number
  discount: number
  deliveryCost: number
  currency: string
  total: number
  notes?: string | null
  promoCode?: string | null
  isPaid?: boolean
  paidAt?: string | null
  trackingNumber?: string | null
  shippedAt?: string | null
  deliveredAt?: string | null
  createdAt: string
  updatedAt?: string
}

/** Позиція в замовленні (для списка) */
export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
  sum: number
}

/** Заказ (для списка) */
export interface Order {
  id: string
  createdAt: string
  customerName: string
  customerEmail?: string
  customerPhone?: string
  address?: string
  comment?: string
  total: number
  items: OrderItem[]
}

/** Преобразовать заказ с бэкенда в Order для списка */
export function orderFromBackend(b: OrderBackend): Order {
  const customerName = [b.customer?.firstName, b.customer?.lastName].filter(Boolean).join(' ') || ''
  const address = b.deliveryAddress
    ? [
        b.deliveryAddress.city,
        b.deliveryAddress.street,
        b.deliveryAddress.building,
        b.deliveryAddress.apartment,
      ]
        .filter(Boolean)
        .join(', ')
    : undefined
  return {
    id: b._id,
    createdAt: b.createdAt,
    customerName,
    customerEmail: b.customer?.email,
    customerPhone: b.customer?.phone,
    address,
    comment: b.notes ?? undefined,
    total: b.total,
    items: (b.items ?? []).map((it) => ({
      productId: typeof it.product === 'string' ? it.product : (it.product as { _id?: string })?._id ?? '',
      productName: it.productName ?? '',
      quantity: it.quantity,
      price: it.price,
      sum: it.total ?? it.price * it.quantity,
    })),
  }
}

/** Строка заказа для таблицы (без статуса) */
export interface OrderRow {
  id: string
  createdAt: string
  createdAtFormatted: string
  customerName: string
  customerEmail: string | null
  total: number
  totalFormatted: string
  itemsCount: number
}

/** Значения фильтра заказов */
export interface OrderFilters {
  search: string
}
