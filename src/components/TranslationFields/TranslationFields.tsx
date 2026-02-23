import { Box, Typography } from '@mui/material'
import { FormField } from '../FormField'
import type { Translation } from '../../types/category'

export interface TranslationFieldsProps {
  label: string
  value: Translation
  onChange: (value: Translation) => void
  placeholder?: string
  multiline?: boolean
  rows?: number
}

const LANGS = [
  { key: 'ua' as const, label: 'UA' },
  { key: 'ru' as const, label: 'RU' },
  { key: 'en' as const, label: 'EN' },
]

export function TranslationFields({
  label,
  value,
  onChange,
  placeholder,
  multiline,
  rows = 2,
}: TranslationFieldsProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
      {LANGS.map(({ key, label: langLabel }) => (
        <FormField
          key={key}
          label={langLabel}
          value={value?.[key] ?? ''}
          onChange={(e) =>
            onChange({ ...value, [key]: (e.target as HTMLInputElement).value })
          }
          placeholder={placeholder}
          multiline={multiline}
          rows={rows}
          size="small"
        />
      ))}
    </Box>
  )
}
