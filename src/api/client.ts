import { getApiBaseUrl } from '../config/env'

const base = () => getApiBaseUrl()

/** Бэкенд оборачивает успешные ответы в { data, statusCode, message } */
function unwrapData<T>(raw: unknown): T {
  const obj = raw as { data?: T }
  if (obj != null && typeof obj === 'object' && typeof obj.data !== 'undefined') {
    return obj.data as T
  }
  return raw as T
}

async function parseErrorResponse(data: unknown): Promise<string> {
  const msg = (data as { message?: string | string[] }).message
  if (typeof msg === 'string') return msg
  if (Array.isArray(msg)) return msg.join(', ')
  return 'Ошибка запроса'
}

export async function request<T>(
  path: string,
  init?: RequestInit,
  accessToken?: string | null,
): Promise<T> {
  const url = `${base()}/${path.replace(/^\//, '')}`
  const headers: HeadersInit = {
    ...(init?.headers as HeadersInit),
  }
  if (accessToken) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${accessToken}`
  }
  const res = await fetch(url, { ...init, headers })
  const text = await res.text()
  const raw = text ? JSON.parse(text) : {}
  if (!res.ok) {
    throw new Error(parseErrorResponse(raw))
  }
  return unwrapData<T>(raw)
}
