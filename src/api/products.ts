import { request } from './client'
import { getApiBaseUrl } from '../config/env'
import type {
  ProductBackend,
  ProductPriceBackend,
  ProductVariantBackend,
  ProductAttributeBackend,
} from '../types/product'
import type { Translation } from '../types/category'

const t = (s: string): Translation => ({ ua: s, ru: s, en: s })

/** Тело создания/обновления товара (соответствует бэкенду: переводы ua/ru/en, варианты, атрибуты) */
export interface ProductCreateUpdateBody {
  name: Translation
  slug?: string
  description?: Translation | null
  shortDescription?: Translation | null
  category?: string | null
  categories?: string[]
  price: ProductPriceBackend
  variants?: ProductVariantBackend[]
  attributes?: ProductAttributeBackend[]
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

/** Список товаров (для админки — с неактивными) */
export async function getProducts(
  includeInactive = true,
): Promise<ProductBackend[]> {
  const path = `products?includeInactive=${includeInactive === true}`
  const data = await request<ProductBackend[]>(path)
  return Array.isArray(data) ? data : []
}

/** Один товар по ID */
export async function getProduct(id: string): Promise<ProductBackend | null> {
  try {
    return await request<ProductBackend>(`products/${id}`)
  } catch {
    return null
  }
}

/** Создать товар (полное тело: переводы ua/ru/en, варианты/милитраж, атрибуты) */
export async function createProduct(
  body: ProductCreateUpdateBody,
  accessToken: string,
): Promise<ProductBackend> {
  return request<ProductBackend>(
    'products',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
    accessToken,
  )
}

/** Обновить товар (частичное тело: только переданные поля) */
export async function updateProduct(
  id: string,
  body: Partial<ProductCreateUpdateBody>,
  accessToken: string,
): Promise<ProductBackend> {
  return request<ProductBackend>(`products/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }, accessToken)
}

/** Хелпер: из простой формы (одна строка на поле) собрать тело с переводами t(ua)=t(ru)=t(en) */
export function toCreateUpdateBodyFromSimple(form: {
  name: string
  price: number
  oldPrice?: number
  currency?: string
  categoryId: string | null
  categories?: string[]
  sku?: string
  description?: string
  shortDescription?: string
  stock?: number
  order?: number
  isActive?: boolean
  isNew?: boolean
  isFeatured?: boolean
  isOnSale?: boolean
  variants?: ProductVariantBackend[]
  attributes?: ProductAttributeBackend[]
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
}): ProductCreateUpdateBody {
  return {
    name: t(form.name.trim()),
    category: form.categoryId || null,
    categories: form.categories ?? [],
    price: {
      current: form.price >= 0 ? form.price : 0,
      old: form.oldPrice != null && form.oldPrice > 0 ? form.oldPrice : undefined,
      currency: form.currency ?? 'UAH',
    },
    description: form.description?.trim() ? t(form.description.trim()) : null,
    shortDescription: form.shortDescription?.trim() ? t(form.shortDescription.trim()) : null,
    sku: form.sku?.trim() || null,
    stock: form.stock ?? 0,
    order: form.order ?? 0,
    isActive: form.isActive ?? true,
    isNew: form.isNew ?? false,
    isFeatured: form.isFeatured ?? false,
    isOnSale: form.isOnSale ?? false,
    variants: form.variants ?? [],
    attributes: form.attributes ?? [],
    metaTitle: form.metaTitle?.trim() ? t(form.metaTitle.trim()) : null,
    metaDescription: form.metaDescription?.trim() ? t(form.metaDescription.trim()) : null,
    metaKeywords: form.metaKeywords?.trim() ? t(form.metaKeywords.trim()) : null,
  }
}

/** Хелпер: из формы с переводами (ua, ru, en) собрать тело */
export function toCreateUpdateBodyWithTranslations(form: {
  name: Translation
  description?: Translation | null
  shortDescription?: Translation | null
  categoryId: string | null
  categories?: string[]
  price: ProductPriceBackend
  variants?: ProductVariantBackend[]
  attributes?: ProductAttributeBackend[]
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
}): ProductCreateUpdateBody {
  return {
    name: form.name,
    category: form.categoryId || null,
    categories: form.categories ?? [],
    price: form.price,
    description: form.description ?? null,
    shortDescription: form.shortDescription ?? null,
    sku: form.sku ?? null,
    stock: form.stock ?? 0,
    order: form.order ?? 0,
    isActive: form.isActive ?? true,
    isNew: form.isNew ?? false,
    isFeatured: form.isFeatured ?? false,
    isOnSale: form.isOnSale ?? false,
    variants: form.variants ?? [],
    attributes: form.attributes ?? [],
    metaTitle: form.metaTitle ?? null,
    metaDescription: form.metaDescription ?? null,
    metaKeywords: form.metaKeywords ?? null,
  }
}

/** Удалить товар */
export async function deleteProduct(
  id: string,
  accessToken: string,
): Promise<void> {
  await request(`products/${id}`, { method: 'DELETE' }, accessToken)
}

/** Добавить изображения к товару (multipart/form-data, поле images) */
export async function addProductImages(
  id: string,
  files: File[],
  accessToken: string,
): Promise<ProductBackend> {
  const form = new FormData()
  files.forEach((file) => form.append('images', file, file.name || 'image.jpg'))
  const baseUrl = getApiBaseUrl().replace(/\/$/, '')
  const headers: Record<string, string> = {}
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`
  const res = await fetch(`${baseUrl}/products/${id}/images`, {
    method: 'POST',
    headers,
    body: form,
  })
  const text = await res.text()
  let raw: { message?: string | string[]; data?: unknown }
  try {
    raw = text ? JSON.parse(text) : {}
  } catch {
    raw = { message: text || 'Ошибка загрузки' }
  }
  if (!res.ok) {
    const msg =
      typeof raw.message === 'string'
        ? raw.message
        : Array.isArray(raw.message)
          ? raw.message.join(', ')
          : 'Ошибка загрузки'
    throw new Error(msg)
  }
  const data = raw?.data !== undefined ? raw.data : raw
  return data as ProductBackend
}

/** Удалить изображение по индексу */
export async function deleteProductImage(
  id: string,
  imageIndex: number,
  accessToken: string,
): Promise<void> {
  await request(
    `products/${id}/images/${imageIndex}`,
    { method: 'DELETE' },
    accessToken,
  )
}

/** Загрузить изображение для варианта (милитраж) */
export async function uploadVariantImage(
  productId: string,
  variantIndex: number,
  file: File,
  accessToken: string,
): Promise<ProductBackend> {
  const form = new FormData()
  form.append('image', file, file.name || 'image.jpg')
  const baseUrl = getApiBaseUrl().replace(/\/$/, '')
  const url = `${baseUrl}/products/${productId}/variants/${variantIndex}/image`
  const headers: Record<string, string> = {}
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: form,
  })
  const text = await res.text()
  let raw: { message?: string | string[]; data?: unknown }
  try {
    raw = text ? JSON.parse(text) : {}
  } catch {
    raw = { message: text || 'Ошибка загрузки' }
  }
  if (!res.ok) {
    const msg =
      typeof raw.message === 'string'
        ? raw.message
        : Array.isArray(raw.message)
          ? raw.message.join(', ')
          : `Ошибка загрузки (${res.status})`
    throw new Error(msg)
  }
  const data = raw?.data !== undefined ? raw.data : raw
  return data as ProductBackend
}

/** Удалить изображение варианта */
export async function deleteVariantImage(
  productId: string,
  variantIndex: number,
  accessToken: string,
): Promise<void> {
  await request(
    `products/${productId}/variants/${variantIndex}/image`,
    { method: 'DELETE' },
    accessToken,
  )
}
