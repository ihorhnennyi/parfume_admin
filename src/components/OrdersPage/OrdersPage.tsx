import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Snackbar } from '@mui/material'
import { OrdersToolbar } from './OrdersToolbar'
import { OrdersFilter } from './OrdersFilter'
import { OrdersTable } from './OrdersTable'
import { useOrdersContext } from '../../contexts/OrdersContext'
import { useAuth } from '../../contexts/AuthContext'
import * as ordersApi from '../../api/orders'
import type { OrderFilters as OrderFiltersType } from '../../types'
import { toOrderRows, filterOrders, sortOrdersForTable } from '../../utils/orders'

const INITIAL_FILTERS: OrderFiltersType = {
  search: '',
}

export function OrdersPage() {
  const navigate = useNavigate()
  const { getAccessToken } = useAuth()
  const { orders, loading, refetchOrders } = useOrdersContext()

  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState<OrderFiltersType>(INITIAL_FILTERS)
  const [creatingTest, setCreatingTest] = useState(false)
  const [snackMessage, setSnackMessage] = useState<string | null>(null)

  const handleCreateTestOrder = useCallback(async () => {
    const token = getAccessToken()
    if (!token) {
      setSnackMessage('Нужна авторизация')
      return
    }
    setCreatingTest(true)
    try {
      const order = await ordersApi.createTestOrder(token)
      await refetchOrders()
      const id = order._id ?? (order as { id?: string }).id
      setSnackMessage(`Тестовый заказ ${order.orderNumber} создан`)
      if (id) {
        setTimeout(() => navigate(`/orders/${id}`), 1500)
      }
    } catch (e) {
      setSnackMessage(e instanceof Error ? e.message : 'Не удалось создать заказ')
    } finally {
      setCreatingTest(false)
    }
  }, [getAccessToken, refetchOrders, navigate])

  const filtered = useMemo(
    () => filterOrders(orders, filters),
    [orders, filters]
  )
  const rows = useMemo(
    () => sortOrdersForTable(toOrderRows(filtered)),
    [filtered]
  )

  return (
    <>
      <OrdersToolbar
        onToggleFilter={() => setFilterOpen((prev) => !prev)}
        filterOpen={filterOpen}
        onCreateTestOrder={handleCreateTestOrder}
        creatingTest={creatingTest}
      />
      <OrdersFilter
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        onApply={() => setFilterOpen(false)}
        onReset={() => setFilters(INITIAL_FILTERS)}
      />
      <OrdersTable rows={rows} loading={loading} onOpenOrder={(id) => navigate(`/orders/${id}`)} />

      <Snackbar
        open={!!snackMessage}
        autoHideDuration={5000}
        onClose={() => setSnackMessage(null)}
        message={snackMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      />
    </>
  )
}
