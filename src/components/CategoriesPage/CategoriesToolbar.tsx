import { Box, Button, Typography } from '@mui/material'
import { Add as AddIcon, FilterList as FilterIcon } from '@mui/icons-material'

export interface CategoriesToolbarProps {
  onAddCategory: () => void
  onToggleFilter: () => void
  filterOpen: boolean
}

export function CategoriesToolbar({
  onAddCategory,
  onToggleFilter,
  filterOpen,
}: CategoriesToolbarProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 3 }}>
      <Typography variant="h4" component="h1">
        Категории
      </Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="outlined"
          startIcon={<FilterIcon />}
          onClick={onToggleFilter}
          color={filterOpen ? 'primary' : 'inherit'}
        >
          Фильтры
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddCategory}
        >
          Создать категорию
        </Button>
      </Box>
    </Box>
  )
}
