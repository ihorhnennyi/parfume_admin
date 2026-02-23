import type { Category } from '../../types'

/** Моковые категории для разработки (позже заменить на API) */
export const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Электроника', parentId: null },
  { id: '2', name: 'Одежда', parentId: null },
  { id: '3', name: 'Телефоны', parentId: '1' },
  { id: '4', name: 'Ноутбуки', parentId: '1' },
  { id: '5', name: 'Мужская', parentId: '2' },
  { id: '6', name: 'Женская', parentId: '2' },
  { id: '7', name: 'Смартфоны', parentId: '3' },
  { id: '8', name: 'Аксессуары', parentId: null },
]
