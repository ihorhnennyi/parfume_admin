import { useRef } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { getUploadUrl } from '../../config/env'

export interface ProductImageListProps {
  images: string[]
  /** Добавить по data URL (локальный превью) */
  onAdd?: (dataUrl: string) => void
  /** Загрузить файлы на сервер (если передан, input поддерживает multiple) */
  onAddFiles?: (files: FileList) => void
  onRemove: (index: number) => void
  uploadLoading?: boolean
}

export function ProductImageList({
  images,
  onAdd,
  onAddFiles,
  onRemove,
  uploadLoading = false,
}: ProductImageListProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return
    if (onAddFiles) {
      onAddFiles(files)
      e.target.value = ''
      return
    }
    const file = files[0]
    if (!file.type.startsWith('image/') || !onAdd) return
    const reader = new FileReader()
    reader.onload = () => {
      onAdd(reader.result as string)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
        Изображения товара
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {images.map((src, index) => (
          <Box
            key={index}
            sx={{
              position: 'relative',
              width: 120,
              height: 120,
              borderRadius: 1,
              overflow: 'hidden',
              border: 1,
              borderColor: 'divider',
            }}
          >
            <img
              src={getUploadUrl(src)}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <IconButton
              size="small"
              color="error"
              sx={{
                position: 'absolute',
                top: 4,
                right: 4,
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'action.hover' },
              }}
              onClick={() => onRemove(index)}
              aria-label="Удалить изображение"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
        <Box
          component="button"
          type="button"
          disabled={uploadLoading}
          onClick={() => inputRef.current?.click()}
          sx={{
            width: 120,
            height: 120,
            borderRadius: 1,
            border: '2px dashed',
            borderColor: 'divider',
            bgcolor: 'action.hover',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&:hover': { borderColor: 'primary.main', bgcolor: 'action.selected' },
          }}
        >
          <AddIcon color="action" />
        </Box>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={!!onAddFiles}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </Box>
    </Box>
  )
}
