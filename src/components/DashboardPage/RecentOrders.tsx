import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { ArrowForward as ArrowIcon } from '@mui/icons-material'
import type { Order } from '../../types'
import { formatOrderDate } from '../../utils/formatDate'
import { formatPrice } from '../../utils/formatPrice'

export interface RecentOrdersProps {
  orders: Order[]
  maxItems?: number
}

export function RecentOrders({ orders, maxItems = 5 }: RecentOrdersProps) {
  const recent = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, maxItems)

  if (recent.length === 0) {
    return (
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Останні замовлення
        </Typography>
        <Typography color="text.secondary">Немає замовлень.</Typography>
      </Paper>
    )
  }

  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, pb: 0 }}>
        <Typography variant="h6">Останні замовлення</Typography>
        <Button
          component={RouterLink}
          to="/orders"
          endIcon={<ArrowIcon />}
          size="small"
        >
          Всі замовлення
        </Button>
      </Box>
      <TableContainer>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell>№</TableCell>
              <TableCell>Клієнт</TableCell>
              <TableCell>Дата</TableCell>
              <TableCell align="right">Сума</TableCell>
              <TableCell align="right" sx={{ width: 80 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {recent.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    {order.id}
                  </Typography>
                </TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {formatOrderDate(order.createdAt)}
                  </Typography>
                </TableCell>
                <TableCell align="right">{formatPrice(Math.max(0, Number(order.total) || 0))}</TableCell>
                <TableCell align="right">
                  <Button
                    component={RouterLink}
                    to={`/orders/${order.id}`}
                    size="small"
                  >
                    Відкрити
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}
