import { Box, Button, Drawer, MenuItem, Typography } from '@mui/material'
import { FormField } from '../FormField'
import type { ProductFilters as ProductFiltersType } from '../../types'

export interface ProductsFilterProps {
  open: boolean
  onClose: () => void
  filters: ProductFiltersType
  onFiltersChange: (filters: ProductFiltersType) => void
  onApply: () => void
  onReset: () => void
  categoryOptions: { id: string; name: string }[]
}

const DRAWER_WIDTH = 320

export function ProductsFilter({
  open,
  onClose,
  filters,
  onFiltersChange,
  onApply,
  onReset,
  categoryOptions,
}: ProductsFilterProps) {
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
            label="Поиск по названию или артикулу"
            value={filters.search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            placeholder="Название или SKU"
          />
          <FormField
            label="Категория"
            select
            value={filters.categoryId ?? ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onFiltersChange({
                ...filters,
                categoryId: e.target.value || null,
              })
            }
          >
            <MenuItem value="">Все категории</MenuItem>
            {categoryOptions.map(({ id, name }) => (
              <MenuItem key={id} value={id}>
                {name}
              </MenuItem>
            ))}
          </FormField>
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
