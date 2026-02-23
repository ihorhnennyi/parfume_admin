/** Мультиязычное поле с бэкенда */
export interface Translation {
  ua?: string | null
  ru?: string | null
  en?: string | null
}

/** Ответ бэкенда: одна категория (Mongoose: _id или id, parent) */
export interface CategoryBackend {
  _id?: string
  id?: string
  name: Translation
  parent?: string | null
  slug?: string
  order?: number
  isActive?: boolean
  description?: Translation | null
  image?: string | null
  icon?: string | null
  parentCategories?: string[]
}

/** Категория (для списка и таблицы) */
export interface Category {
  id: string
  name: string
  parentId: string | null
}

/** Выбрать одну строку названия из перевода (приоритет: ua → ru → en) */
export function translationToName(t: Translation | undefined | null): string {
  if (!t || typeof t !== 'object') return ''
  return (t.ua ?? t.ru ?? t.en ?? '') || ''
}

/** Преобразовать категорию с бэкенда в Category */
export function categoryFromBackend(b: CategoryBackend): Category {
  return {
    id: b.id ?? b._id ?? '',
    name: translationToName(b.name),
    parentId: b.parent ?? null,
  }
}

/** Категория с названием родителя для отображения в таблице */
export interface CategoryRow {
  id: string
  name: string
  parentId: string | null
  parentName: string | null
}

/** Значения фильтра категорий */
export interface CategoryFilters {
  search: string
  parentId: string | null
}
