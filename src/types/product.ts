import type { Translation } from './category'
import { translationToName } from './category'

/** Цена с бэкенда (основная и по вариантам/милитражу) */
export interface ProductPriceBackend {
  current: number
  old?: number
  currency?: string
}

/** Вариант товара (милитраж/объём: 50 мл, 100 мл и т.д.) с ценой под вариант */
export interface ProductVariantBackend {
  _id?: string
  name: Translation
  price: ProductPriceBackend
  sku?: string | null
  stock?: number
  isActive?: boolean
  /** URL изображения варианта (напр. для каждого милитража — своя картинка) */
  image?: string | null
}

/** Атрибут товара (название + значение, мультиязычные) */
export interface ProductAttributeBackend {
  _id?: string
  name: Translation
  value: Translation
  unit?: string | null
}

/** Изображение с бэкенда */
export interface ProductImageBackend {
  url: string
  alt?: string | null
  order?: number
  isMain?: boolean
}

/** Ответ бэкенда: один товар (category может быть populate) */
export interface ProductBackend {
  _id?: string
  id?: string
  name: Translation
  slug?: string
  description?: Translation | null
  shortDescription?: Translation | null
  category?: string | { _id: string; name?: Translation } | null
  categories?: string[]
  price: ProductPriceBackend
  variants?: ProductVariantBackend[]
  attributes?: ProductAttributeBackend[]
  images?: ProductImageBackend[]
  sku?: string | null
  stock?: number
  order?: number
  isActive?: boolean
  isNew?: boolean
  isFeatured?: boolean
  isOnSale?: boolean
  metaTitle?: Translation | null
  metaDescription?: Translation | null
  metaKeywords?: Translation | null
  customFields?: Record<string, unknown>
}

/** Товар (для списка и форм) */
export interface Product {
  id: string
  name: string
  price: number
  categoryId: string | null
  sku?: string
  description?: string
  /** URL или data URL изображений */
  images?: string[]
}

/** Преобразовать товар с бэкенда в Product (для списка: в таблице показываем основную цену товара, если 0 — берём цену первого варианта) */
export function productFromBackend(b: ProductBackend): Product {
  const id = b.id ?? b._id ?? ''
  const categoryId =
    b.category == null
      ? null
      : typeof b.category === 'string'
        ? b.category
        : (b.category as { _id: string })._id ?? null
  const mainPrice = b.price?.current ?? 0
  const firstVariantPrice = b.variants?.[0]?.price?.current
  const price = mainPrice > 0 ? mainPrice : (firstVariantPrice ?? mainPrice)
  return {
    id,
    name: translationToName(b.name),
    price,
    categoryId,
    sku: b.sku ?? undefined,
    description: b.description ? translationToName(b.description) : undefined,
    images: b.images?.map((img) => img.url) ?? [],
  }
}

/** Строка товара для таблицы (с названием категории) */
export interface ProductRow {
  id: string
  name: string
  price: number
  categoryId: string | null
  categoryName: string | null
  sku: string | null
  description: string | null
}

/** Значения фильтра товаров */
export interface ProductFilters {
  search: string
  categoryId: string | null
}
