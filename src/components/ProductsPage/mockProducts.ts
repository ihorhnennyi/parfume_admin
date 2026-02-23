import type { Product } from '../../types'

/** Моковые товары (id категорий из mockCategories: 1–8) */
export const MOCK_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Смартфон X', price: 29900, categoryId: '7', sku: 'PH-X-001' },
  { id: 'p2', name: 'Смартфон Y', price: 34900, categoryId: '7', sku: 'PH-Y-002' },
  { id: 'p3', name: 'Ноутбук Pro 15', price: 89900, categoryId: '4', sku: 'NB-P15-001' },
  { id: 'p4', name: 'Ноутбук Air', price: 74900, categoryId: '4', sku: 'NB-A-002' },
  { id: 'p5', name: 'Футболка базовая', price: 990, categoryId: '5', sku: 'TSH-M-001' },
  { id: 'p6', name: 'Джинсы классика', price: 2990, categoryId: '5', sku: 'JNS-M-001' },
  { id: 'p7', name: 'Платье летнее', price: 3990, categoryId: '6', sku: 'DRS-W-001' },
  { id: 'p8', name: 'Чехол универсальный', price: 490, categoryId: '8', sku: 'ACC-CH-001' },
  { id: 'p9', name: 'Товар без категории', price: 100, categoryId: null, sku: 'NO-CAT-01' },
]
