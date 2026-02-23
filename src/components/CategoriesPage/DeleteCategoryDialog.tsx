import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material'

export interface DeleteCategoryDialogProps {
  open: boolean
  categoryName: string
  onClose: () => void
  onConfirm: () => void | Promise<void>
  loading?: boolean
}

export function DeleteCategoryDialog({
  open,
  categoryName,
  onClose,
  onConfirm,
  loading = false,
}: DeleteCategoryDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} slotProps={{ paper: { sx: { borderRadius: 2 } } }}>
      <DialogTitle>Удалить категорию?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Категория «{categoryName}» будет удалена. Подкатегории останутся в списке без родителя.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading}>Отмена</Button>
        <Button onClick={() => void Promise.resolve(onConfirm())} color="error" variant="contained" disabled={loading}>
          {loading ? 'Удаление…' : 'Удалить'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
