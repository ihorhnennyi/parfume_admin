import type { Order, OrderRow, OrderFilters } from '../types'
import { formatOrderDate } from './formatDate'
import { formatPrice } from './formatPrice'

/** Преобразует заказы в строки таблицы */
export function toOrderRows(orders: Order[]): OrderRow[] {
  return orders.map((o) => ({
    id: o.id,
    createdAt: o.createdAt,
    createdAtFormatted: formatOrderDate(o.createdAt),
    customerName: o.customerName,
    customerEmail: o.customerEmail ?? null,
    total: o.total,
    totalFormatted: formatPrice(o.total),
    itemsCount: o.items.length,
  }))
}

/** Применяет фильтры к списку заказов */
export function filterOrders(orders: Order[], filters: OrderFilters): Order[] {
  return orders.filter((o) => {
    if (filters.search.trim()) {
      const search = filters.search.trim().toLowerCase()
      const matchName = o.customerName.toLowerCase().includes(search)
      const matchEmail = o.customerEmail?.toLowerCase().includes(search)
      const matchId = o.id.toLowerCase().includes(search)
      if (!matchName && !matchEmail && !matchId) return false
    }
    return true
  })
}

/** Сортировка: по дате (новые сверху) */
export function sortOrdersForTable(rows: OrderRow[]): OrderRow[] {
  return [...rows].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}
