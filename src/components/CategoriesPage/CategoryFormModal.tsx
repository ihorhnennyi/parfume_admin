import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
} from '@mui/material'
import { FormField } from '../FormField'
import type { Category } from '../../types'

export interface CategoryFormModalProps {
  open: boolean
  /** Редактируемая категория (null = создание) */
  category: Category | null
  parentOptions: { id: string; name: string }[]
  onClose: () => void
  onSave: (data: { name: string; parentId: string | null }) => void | Promise<void>
  loading?: boolean
}

export function CategoryFormModal({
  open,
  category,
  parentOptions,
  onClose,
  onSave,
  loading = false,
}: CategoryFormModalProps) {
  const [name, setName] = useState('')
  const [parentId, setParentId] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setName(category?.name ?? '')
      setParentId(category?.parentId ?? null)
    }
  }, [open, category])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    await Promise.resolve(onSave({ name: trimmed, parentId }))
  }

  const isEdit = category != null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 2 } } }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>{isEdit ? 'Редактировать категорию' : 'Новая категория'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 3 }}>
          <FormField
            label="Название"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Название категории"
            required
          />
          <FormField
            label="Родительская категория"
            select
            value={parentId ?? ''}
            onChange={(e) => setParentId(e.target.value || null)}
          >
            <MenuItem value="">Без родителя (корневая)</MenuItem>
            {parentOptions.map(({ id, name: n }) => (
              <MenuItem key={id} value={id} disabled={isEdit && category?.id === id}>
                {n}
              </MenuItem>
            ))}
          </FormField>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose}>Отмена</Button>
          <Button type="submit" variant="contained" disabled={!name.trim() || loading}>
            {loading ? 'Сохранение…' : isEdit ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
