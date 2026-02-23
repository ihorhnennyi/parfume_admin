import { request } from './client'
import type { CategoryBackend } from '../types/category'
import type { Translation } from '../types/category'

/** Список категорий (для админки — с неактивными) */
export async function getCategories(
  includeInactive = true,
): Promise<CategoryBackend[]> {
  const path = `categories?includeInactive=${includeInactive === true}`
  const data = await request<CategoryBackend[]>(path)
  return Array.isArray(data) ? data : []
}

/** Одна категория по ID */
export async function getCategory(id: string): Promise<CategoryBackend | null> {
  try {
    return await request<CategoryBackend>(`categories/${id}`)
  } catch {
    return null
  }
}

/** Создать категорию. name — одна строка, на бэкенде уходит как Translation (ua/ru/en). */
export async function createCategory(
  body: { name: string; parentId: string | null },
  accessToken: string,
): Promise<CategoryBackend> {
  const nameTranslation: Translation = {
    ua: body.name,
    ru: body.name,
    en: body.name,
  }
  return request<CategoryBackend>('categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: nameTranslation,
      parent: body.parentId || null,
    }),
  }, accessToken)
}

/** Обновить категорию */
export async function updateCategory(
  id: string,
  body: { name: string; parentId: string | null },
  accessToken: string,
): Promise<CategoryBackend> {
  const nameTranslation: Translation = {
    ua: body.name,
    ru: body.name,
    en: body.name,
  }
  return request<CategoryBackend>(`categories/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: nameTranslation,
      parent: body.parentId || null,
    }),
  }, accessToken)
}

/** Удалить категорию */
export async function deleteCategory(
  id: string,
  accessToken: string,
): Promise<void> {
  await request(`categories/${id}`, { method: 'DELETE' }, accessToken)
}
