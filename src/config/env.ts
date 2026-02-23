const API_BASE_URL =
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL
    ? String(import.meta.env.VITE_API_URL).replace(/\/$/, '')
    : 'http://localhost:3000/api'

export function getApiBaseUrl(): string {
  return API_BASE_URL
}

/** Базовый URL бэкенда без /api (для статики: /uploads/...) */
export function getBackendOrigin(): string {
  return API_BASE_URL.replace(/\/api\/?$/, '') || 'http://localhost:3000'
}

/** Полный URL для пути вида /uploads/... */
export function getUploadUrl(path: string): string {
  if (!path || !path.startsWith('/')) return path
  return getBackendOrigin() + path
}
