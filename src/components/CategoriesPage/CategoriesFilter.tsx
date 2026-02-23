import { Box, Button, Drawer, MenuItem, Typography } from '@mui/material'
import { FormField } from '../FormField'
import type { CategoryFilters as CategoryFiltersType } from '../../types'

export interface CategoriesFilterProps {
  open: boolean
  onClose: () => void
  filters: CategoryFiltersType
  onFiltersChange: (filters: CategoryFiltersType) => void
  onApply: () => void
  onReset: () => void
  /** Список категорий верхнего уровня для фильтра «Родительская» */
  parentOptions: { id: string; name: string }[]
}

const DRAWER_WIDTH = 320

export function CategoriesFilter({
  open,
  onClose,
  filters,
  onFiltersChange,
  onApply,
  onReset,
  parentOptions,
}: CategoriesFilterProps) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { width: DRAWER_WIDTH },
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Фильтры
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
          <FormField
            label="Поиск по названию"
            value={filters.search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFiltersChange({ ...filters, search: e.target.value })}
            placeholder="Название категории"
          />
          <FormField
            label="Родительская категория"
            select
            value={filters.parentId ?? ''}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                parentId: e.target.value || null,
              })
            }
          >
            <MenuItem value="">Все</MenuItem>
            {parentOptions.map(({ id, name }) => (
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
