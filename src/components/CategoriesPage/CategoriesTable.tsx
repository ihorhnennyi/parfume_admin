import {
  Box,
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
} from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import type { CategoryRow } from '../../types'

export interface CategoriesTableProps {
  rows: CategoryRow[]
  loading?: boolean
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export function CategoriesTable({ rows, loading = false, onEdit, onDelete }: CategoriesTableProps) {
  if (rows.length === 0 && !loading) {
    return (
      <Paper variant="outlined" sx={{ p: 4 }}>
        <Typography color="text.secondary" align="center">
          Нет категорий. Создайте первую.
        </Typography>
      </Paper>
    )
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="medium">
        <TableHead>
          <TableRow>
            <TableCell>Название</TableCell>
            <TableCell>Родительская категория</TableCell>
            <TableCell align="right" sx={{ width: 120 }}>
              Действия
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} hover>
              <TableCell>
                <Typography variant="body2" fontWeight={row.parentId ? 400 : 500}>
                  {row.parentId ? `— ${row.name}` : row.name}
                </Typography>
              </TableCell>
              <TableCell>
                {row.parentName ?? '—'}
              </TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                  <Tooltip title="Редактировать">
                    <IconButton size="small" onClick={() => onEdit?.(row.id)} aria-label="Редактировать">
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Удалить">
                    <IconButton size="small" color="error" onClick={() => onDelete?.(row.id)} aria-label="Удалить">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
