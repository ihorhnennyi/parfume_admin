import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  CircularProgress,
} from '@mui/material'
import { Visibility as ViewIcon } from '@mui/icons-material'
import type { OrderRow } from '../../types'

export interface OrdersTableProps {
  rows: OrderRow[]
  loading?: boolean
  onOpenOrder?: (id: string) => void
}

export function OrdersTable({ rows, loading = false, onOpenOrder }: OrdersTableProps) {
  if (loading && rows.length === 0) {
    return (
      <Paper variant="outlined" sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Paper>
    )
  }
  if (rows.length === 0 && !loading) {
    return (
      <Paper variant="outlined" sx={{ p: 4 }}>
        <Typography color="text.secondary" align="center">
          Нет заказов.
        </Typography>
      </Paper>
    )
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="medium">
        <TableHead>
          <TableRow>
            <TableCell>№ / Дата</TableCell>
            <TableCell>Клиент</TableCell>
            <TableCell>Email</TableCell>
            <TableCell align="right">Сумма</TableCell>
            <TableCell align="center">Позиций</TableCell>
            <TableCell align="right" sx={{ width: 80 }} />
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              hover
              sx={onOpenOrder ? { cursor: 'pointer' } : undefined}
              onClick={onOpenOrder ? () => onOpenOrder(row.id) : undefined}
            >
              <TableCell>
                <Typography variant="body2" fontWeight={500}>
                  {row.id}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {row.createdAtFormatted}
                </Typography>
              </TableCell>
              <TableCell>{row.customerName}</TableCell>
              <TableCell>{row.customerEmail ?? '—'}</TableCell>
              <TableCell align="right">{row.totalFormatted}</TableCell>
              <TableCell align="center">{row.itemsCount}</TableCell>
              <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                <Tooltip title="Відкрити замовлення">
                  <IconButton size="small" onClick={() => onOpenOrder?.(row.id)} aria-label="Відкрити">
                    <ViewIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
