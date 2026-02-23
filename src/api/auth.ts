import { getApiBaseUrl } from '../config/env'

const base = () => getApiBaseUrl()

export interface LoginResponse {
  accessToken: string
  refreshToken: string
}

export interface AdminProfile {
  id: string
  email: string
  role: string
}

/** Бэкенд оборачивает успешные ответы в { data, statusCode, message } */
function unwrapData<T>(raw: unknown): T {
  const obj = raw as { data?: T }
  if (obj != null && typeof obj === 'object' && typeof obj.data !== 'undefined') {
    return obj.data as T
  }
  return raw as T
}

async function handleResponse<T>(res: Response): Promise<T> {
  const text = await res.text()
  const data = text ? (JSON.parse(text) as unknown) : {}
  if (!res.ok) {
    const message =
      typeof (data as { message?: string }).message === 'string'
        ? (data as { message: string }).message
        : Array.isArray((data as { message?: unknown }).message)
          ? (data as { message: string[] }).message.join(', ')
          : res.statusText || 'Ошибка запроса'
    throw new Error(message)
  }
  return unwrapData<T>(data)
}

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const res = await fetch(`${base()}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  return handleResponse<LoginResponse>(res)
}

export async function refresh(refreshToken: string): Promise<LoginResponse> {
  const res = await fetch(`${base()}/admin/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  })
  return handleResponse<LoginResponse>(res)
}

export async function logout(accessToken: string): Promise<void> {
  const res = await fetch(`${base()}/admin/logout`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  await handleResponse<unknown>(res)
}

export async function getProfile(
  accessToken: string,
): Promise<AdminProfile> {
  const res = await fetch(`${base()}/admin/profile`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return handleResponse<AdminProfile>(res)
}
