import { Box, Button, Typography } from '@mui/material'
import { FilterList as FilterIcon, Add as AddIcon } from '@mui/icons-material'

export interface OrdersToolbarProps {
  onToggleFilter: () => void
  filterOpen: boolean
  onCreateTestOrder?: () => void | Promise<void>
  creatingTest?: boolean
}

export function OrdersToolbar({
  onToggleFilter,
  filterOpen,
  onCreateTestOrder,
  creatingTest = false,
}: OrdersToolbarProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 3 }}>
      <Typography variant="h4" component="h1">
        Заказы
      </Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        {onCreateTestOrder && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onCreateTestOrder}
            disabled={creatingTest}
          >
            {creatingTest ? 'Создание…' : 'Тестовый заказ'}
          </Button>
        )}
        <Button
          variant="outlined"
          startIcon={<FilterIcon />}
          onClick={onToggleFilter}
          color={filterOpen ? 'primary' : 'inherit'}
        >
          Фильтры
        </Button>
      </Box>
    </Box>
  )
}
