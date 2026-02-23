/**
 * Форматирует цену для отображения (гривні, з пробілами між розрядами).
 */
export function formatPrice(value: number): string {
  return new Intl.NumberFormat('uk-UA', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value) + ' грн'
}
