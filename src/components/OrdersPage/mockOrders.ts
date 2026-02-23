import type { Order } from '../../types'

/** Моковые заказы для разработки */
export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-1',
    createdAt: '2025-02-16T10:30:00',
    customerName: 'Іван Петренко',
    customerEmail: 'ivan@example.com',
    customerPhone: '+380 50 123 45 67',
    address: 'м. Київ, вул. Хрещатик, 1, кв. 10',
    comment: 'Передзвоніть за годину',
    total: 35890,
    items: [
      { productId: 'p1', productName: 'Смартфон X', quantity: 1, price: 29900, sum: 29900 },
      { productId: 'p8', productName: 'Чехол универсальный', quantity: 2, price: 490, sum: 5990 },
    ],
  },
  {
    id: 'ord-2',
    createdAt: '2025-02-15T14:20:00',
    customerName: 'Марія Коваленко',
    customerEmail: 'maria@example.com',
    customerPhone: '+380 67 111 22 33',
    address: 'м. Львів, вул. Франка, 25',
    total: 12990,
    items: [
      { productId: 'p5', productName: 'Футболка базовая', quantity: 2, price: 990, sum: 1980 },
      { productId: 'p6', productName: 'Джинсы классика', quantity: 1, price: 2990, sum: 2990 },
      { productId: 'p7', productName: 'Платье летнее', quantity: 2, price: 3990, sum: 7980 },
    ],
  },
  {
    id: 'ord-3',
    createdAt: '2025-02-14T09:15:00',
    customerName: 'Олексій Шевченко',
    customerEmail: 'oleksiy@example.com',
    customerPhone: '+380 63 444 55 66',
    address: 'м. Одеса, вул. Дерибасівська, 5',
    total: 89900,
    items: [
      { productId: 'p3', productName: 'Ноутбук Pro 15', quantity: 1, price: 89900, sum: 89900 },
    ],
  },
  {
    id: 'ord-4',
    createdAt: '2025-02-13T16:45:00',
    customerName: 'Анна Мельник',
    customerEmail: 'anna@example.com',
    address: 'м. Харків, пр. Науки, 40',
    total: 4450,
    items: [
      { productId: 'p5', productName: 'Футболка базовая', quantity: 4, price: 990, sum: 3960 },
      { productId: 'p8', productName: 'Чехол универсальный', quantity: 1, price: 490, sum: 490 },
    ],
  },
  {
    id: 'ord-5',
    createdAt: '2025-02-12T11:00:00',
    customerName: 'Дмитро Бондаренко',
    customerEmail: 'dmitro@example.com',
    total: 2990,
    items: [
      { productId: 'p6', productName: 'Джинсы классика', quantity: 1, price: 2990, sum: 2990 },
    ],
  },
]
