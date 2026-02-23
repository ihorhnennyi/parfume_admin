import { Box, Button, Drawer, Typography } from '@mui/material'
import { FormField } from '../FormField'
import type { OrderFilters as OrderFiltersType } from '../../types'

export interface OrdersFilterProps {
  open: boolean
  onClose: () => void
  filters: OrderFiltersType
  onFiltersChange: (filters: OrderFiltersType) => void
  onApply: () => void
  onReset: () => void
}

const DRAWER_WIDTH = 320

export function OrdersFilter({
  open,
  onClose,
  filters,
  onFiltersChange,
  onApply,
  onReset,
}: OrdersFilterProps) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: { sx: { width: DRAWER_WIDTH } },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Фильтры
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
          <FormField
            label="Поиск (клиент, email, номер заказа)"
            value={filters.search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            placeholder="Поиск..."
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Button variant="outlined" onClick={onReset} fullWidth>
            Сбросить
          </Button>
          <Button variant="contained" onClick={onApply} fullWidth>
            Применить
          </Button>
        </Box>
      </Box>
    </Drawer>
  )
}
