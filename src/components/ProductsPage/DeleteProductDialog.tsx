import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material'

export interface DeleteProductDialogProps {
  open: boolean
  productName: string
  onClose: () => void
  onConfirm: () => void | Promise<void>
  loading?: boolean
}

export function DeleteProductDialog({
  open,
  productName,
  onClose,
  onConfirm,
  loading = false,
}: DeleteProductDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} slotProps={{ paper: { sx: { borderRadius: 2 } } }}>
      <DialogTitle>Удалить товар?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Товар «{productName}» будет удалён. Это действие нельзя отменить.
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
