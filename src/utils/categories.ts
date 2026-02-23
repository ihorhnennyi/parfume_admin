import type { Category, CategoryRow, CategoryFilters } from '../types'

/** Преобразует список категорий в строки таблицы с названием родителя */
export function toCategoryRows(categories: Category[]): CategoryRow[] {
  const byId = new Map(categories.map((c) => [c.id, c]))
  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    parentId: cat.parentId,
    parentName: cat.parentId ? byId.get(cat.parentId)?.name ?? null : null,
  }))
}

/** Применяет фильтры к списку категорий */
export function filterCategories(
  categories: Category[],
  filters: CategoryFilters
): Category[] {
  return categories.filter((cat) => {
    if (filters.search.trim()) {
      const search = filters.search.trim().toLowerCase()
      if (!cat.name.toLowerCase().includes(search)) return false
    }
    if (filters.parentId != null && filters.parentId !== '') {
      if (cat.parentId !== filters.parentId) return false
    }
    return true
  })
}

/** Сортировка: сначала родительские, потом подкатегории по имени */
export function sortCategoriesForTable(rows: CategoryRow[]): CategoryRow[] {
  return [...rows].sort((a, b) => {
    if (a.parentId === null && b.parentId !== null) return -1
    if (a.parentId !== null && b.parentId === null) return 1
    if (a.parentId !== null && b.parentId !== null && a.parentId !== b.parentId) {
      return a.parentName?.localeCompare(b.parentName ?? '') ?? 0
    }
    return a.name.localeCompare(b.name)
  })
}
