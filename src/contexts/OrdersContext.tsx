import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { Order } from '../types'
import { orderFromBackend } from '../types/order'
import { useAuth } from './AuthContext'
import * as ordersApi from '../api/orders'

interface OrdersContextValue {
  orders: Order[]
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>
  refetchOrders: () => Promise<void>
  loading: boolean
}

const OrdersContext = createContext<OrdersContextValue | null>(null)

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const { getAccessToken } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const refetchOrders = useCallback(async () => {
    const token = getAccessToken()
    if (!token) {
      setOrders([])
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const list = await ordersApi.getOrders(token, true)
      setOrders(list.map(orderFromBackend))
    } catch {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [getAccessToken])

  useEffect(() => {
    refetchOrders()
  }, [refetchOrders])

  return (
    <OrdersContext.Provider value={{ orders, setOrders, refetchOrders, loading }}>
      {children}
    </OrdersContext.Provider>
  )
}

export function useOrdersContext() {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error('useOrdersContext must be used within OrdersProvider')
  return ctx
}
