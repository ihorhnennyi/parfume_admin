import type { Product, ProductRow, ProductFilters } from '../types'

/** Преобразует товары в строки таблицы с названием категории */
export function toProductRows(
  products: Product[],
  categoryById: Map<string, string>
): ProductRow[] {
  return products.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    categoryId: p.categoryId,
    categoryName: p.categoryId ? categoryById.get(p.categoryId) ?? null : null,
    sku: p.sku ?? null,
    description: p.description ?? null,
  }))
}

/** Применяет фильтры к списку товаров */
export function filterProducts(
  products: Product[],
  filters: ProductFilters
): Product[] {
  return products.filter((p) => {
    if (filters.search.trim()) {
      const search = filters.search.trim().toLowerCase()
      const matchName = p.name.toLowerCase().includes(search)
      const matchSku = p.sku?.toLowerCase().includes(search)
      if (!matchName && !matchSku) return false
    }
    if (filters.categoryId != null && filters.categoryId !== '') {
      if (p.categoryId !== filters.categoryId) return false
    }
    return true
  })
}

/** Сортировка: по названию категории, затем по имени товара */
export function sortProductsForTable(rows: ProductRow[]): ProductRow[] {
  return [...rows].sort((a, b) => {
    const catA = a.categoryName ?? ''
    const catB = b.categoryName ?? ''
    if (catA !== catB) return catA.localeCompare(catB)
    return a.name.localeCompare(b.name)
  })
}
