import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import * as authApi from '../api/auth'
import type { AdminProfile } from '../api/auth'

const REFRESH_TOKEN_KEY = 'admin_refresh_token'

interface AuthState {
  user: AdminProfile | null
  accessToken: string | null
  isLoading: boolean
}

interface AuthContextValue extends AuthState {
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  getAccessToken: () => string | null
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminProfile | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const refreshAttempted = useRef(false)

  const getAccessToken = useCallback(() => accessToken, [accessToken])

  const setTokens = useCallback(
    (access: string | null, refresh: string | null) => {
      setAccessToken(access)
      const validRefresh =
        typeof refresh === 'string' &&
        refresh.length > 0 &&
        refresh !== 'undefined'
      if (validRefresh) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refresh)
      } else {
        localStorage.removeItem(REFRESH_TOKEN_KEY)
      }
    },
    [],
  )

  const clearAuth = useCallback(() => {
    setUser(null)
    setAccessToken(null)
    setTokens(null, null)
  }, [setTokens])

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await authApi.login(email, password)
      const at =
        res && typeof (res as { accessToken?: string }).accessToken === 'string'
          ? (res as { accessToken: string }).accessToken
          : null
      const rt =
        res && typeof (res as { refreshToken?: string }).refreshToken === 'string'
          ? (res as { refreshToken: string }).refreshToken
          : null
      if (!at) {
        throw new Error('Сервер не вернул токен доступа')
      }
      setTokens(at, rt)
      const profile = await authApi.getProfile(at)
      setUser(profile)
    },
    [setTokens],
  )

  const logout = useCallback(async () => {
    const token = accessToken
    if (token) {
      try {
        await authApi.logout(token)
      } catch {
        // ignore network errors on logout
      }
    }
    clearAuth()
  }, [accessToken, clearAuth])

  useEffect(() => {
    if (refreshAttempted.current) return
    const stored = localStorage.getItem(REFRESH_TOKEN_KEY)
    const validStored =
      typeof stored === 'string' &&
      stored.length > 0 &&
      stored !== 'undefined'
    if (!validStored) {
      if (stored) localStorage.removeItem(REFRESH_TOKEN_KEY)
      setIsLoading(false)
      return
    }
    refreshAttempted.current = true
    authApi
      .refresh(stored)
      .then((res) => {
        const at =
          res && typeof (res as { accessToken?: string }).accessToken === 'string'
            ? (res as { accessToken: string }).accessToken
            : null
        const rt =
          res && typeof (res as { refreshToken?: string }).refreshToken === 'string'
            ? (res as { refreshToken: string }).refreshToken
            : null
        if (!at) return
        setTokens(at, rt)
        return authApi.getProfile(at)
      })
      .then((profile) => {
        if (profile) setUser(profile)
      })
      .catch(() => {
        localStorage.removeItem(REFRESH_TOKEN_KEY)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [setTokens])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      isLoading,
      isAuthenticated: !!user && !!accessToken,
      login,
      logout,
      getAccessToken,
    }),
    [user, accessToken, isLoading, login, logout, getAccessToken],
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
