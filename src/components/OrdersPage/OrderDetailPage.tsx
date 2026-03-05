import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Grid,
} from '@mui/material'
import { ArrowBack as BackIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'
import { useOrdersContext } from '../../contexts/OrdersContext'
import * as ordersApi from '../../api/orders'
import type { OrderBackend } from '../../types/order'
import { formatOrderDate } from '../../utils/formatDate'
import { formatPrice } from '../../utils/formatPrice'
import { getUploadUrl } from '../../config/env'

const STATUS_LABELS: Record<string, string> = {
  pending: 'Ожидает',
  confirmed: 'Подтверждён',
  processing: 'В обработке',
  shipped: 'Отправлен',
  delivered: 'Доставлен',
  cancelled: 'Отменён',
  refunded: 'Возврат',
}

const PAYMENT_LABELS: Record<string, string> = {
  cash: 'Наличные',
  card: 'Карта',
  online: 'Онлайн',
  bank_transfer: 'Банковский перевод',
}

const DELIVERY_LABELS: Record<string, string> = {
  pickup: 'Самовывоз',
  courier: 'Курьер',
  post: 'Почта',
  express: 'Экспресс',
}

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getAccessToken } = useAuth()
  const { refetchOrders } = useOrdersContext()
  const [order, setOrder] = useState<OrderBackend | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!id) return
    const token = getAccessToken()
    if (!token) {
      setLoading(false)
      return
    }
    setLoading(true)
    ordersApi
      .getOrder(id, token)
      .then((data) => {
        setOrder(data ?? null)
      })
      .catch(() => setOrder(null))
      .finally(() => setLoading(false))
  }, [id, getAccessToken])

  if (!id) {
    navigate('/orders', { replace: true })
    return null
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!order) {
    return (
      <Container maxWidth="md">
        <Typography color="text.secondary">Замовлення не знайдено.</Typography>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/orders')} sx={{ mt: 2 }}>
          До списку замовлень
        </Button>
      </Container>
    )
  }

  const handleDelete = async () => {
    if (!id) return
    const token = getAccessToken()
    if (!token) return
    setDeleting(true)
    try {
      await ordersApi.deleteOrder(id, token)
      await refetchOrders()
      navigate('/orders', { replace: true })
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  const customerName = [order.customer?.firstName, order.customer?.lastName].filter(Boolean).join(' ') || '—'
  const address = order.deliveryAddress
    ? [
        order.deliveryAddress.country,
        order.deliveryAddress.city,
        order.deliveryAddress.street,
        order.deliveryAddress.building,
        order.deliveryAddress.apartment,
        order.deliveryAddress.postalCode,
      ]
        .filter(Boolean)
        .join(', ')
    : null

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/orders')}>
          До списку замовлень
        </Button>
        <Button
          color="error"
          variant="outlined"
          startIcon={<DeleteIcon />}
          onClick={() => setDeleteDialogOpen(true)}
        >
          Видалити замовлення
        </Button>
      </Box>

      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Замовлення {order.orderNumber}
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Дата
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {formatOrderDate(order.createdAt)}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Статус
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {STATUS_LABELS[order.status] ?? order.status}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Клієнт
            </Typography>
            <Typography variant="body1" fontWeight={500}>{customerName}</Typography>
            <Typography variant="body2" color="text.secondary">{order.customer?.email}</Typography>
            <Typography variant="body2" color="text.secondary">{order.customer?.phone}</Typography>
            {order.customer?.company && (
              <Typography variant="body2" color="text.secondary">Компанія: {order.customer.company}</Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Доставка
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {DELIVERY_LABELS[order.deliveryMethod] ?? order.deliveryMethod}
            </Typography>
            {address && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {address}
              </Typography>
            )}
            {order.deliveryAddress?.notes && (
              <Typography variant="body2" color="text.secondary">
                Примітка: {order.deliveryAddress.notes}
              </Typography>
            )}

            <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
              Оплата
            </Typography>
            <Typography variant="body1">
              {PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {order.notes && (
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Коментар до замовлення
          </Typography>
          <Typography variant="body1">{order.notes}</Typography>
        </Paper>
      )}

      <Typography variant="h6" sx={{ mb: 2 }}>
        Склад замовлення
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 72 }}>Фото</TableCell>
              <TableCell>Товар</TableCell>
              <TableCell>Обʼєм / варіант</TableCell>
              <TableCell align="right">Ціна</TableCell>
              <TableCell align="center">Кількість</TableCell>
              <TableCell align="right">Сума</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.items.map((item, index) => {
              const imageUrl = item.variantImage || item.productImage
              return (
                <TableRow key={index}>
                  <TableCell sx={{ verticalAlign: 'middle' }}>
                    {imageUrl ? (
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 1,
                          border: 1,
                          borderColor: 'divider',
                          bgcolor: 'action.hover',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          component="img"
                          src={getUploadUrl(imageUrl)}
                          alt=""
                          sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        />
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 1,
                          bgcolor: 'action.hover',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          —
                        </Typography>
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {item.productName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {item.variantName ? (
                      <Typography variant="body2" color="text.secondary">
                        {item.variantName}
                      </Typography>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  <TableCell align="right">{formatPrice(item.price)}</TableCell>
                  <TableCell align="center">{item.quantity}</TableCell>
                  <TableCell align="right">{formatPrice(item.total)}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Grid container spacing={1} justifyContent="flex-end">
          {order.subtotal > 0 && (
            <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Typography color="text.secondary">Підсумок:</Typography>
              <Typography fontWeight={500}>{formatPrice(order.subtotal)}</Typography>
            </Grid>
          )}
          {order.deliveryCost > 0 && (
            <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Typography color="text.secondary">Доставка:</Typography>
              <Typography>{formatPrice(order.deliveryCost)}</Typography>
            </Grid>
          )}
          <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Typography variant="subtitle1" fontWeight={600}>Разом:</Typography>
            <Typography variant="subtitle1" fontWeight={600}>
              {formatPrice(order.total)}
              {order.currency && order.currency !== 'UAH' ? ` ${order.currency}` : ''}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Dialog open={deleteDialogOpen} onClose={() => !deleting && setDeleteDialogOpen(false)}>
        <DialogTitle>Видалити замовлення?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Замовлення {order.orderNumber} буде видалено безповоротно. Продовжити?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
            Скасувати
          </Button>
          <Button color="error" variant="contained" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Видалення…' : 'Видалити'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
