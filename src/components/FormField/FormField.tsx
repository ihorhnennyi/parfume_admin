import type { TextFieldProps } from '@mui/material/TextField'
import { TextField } from '@mui/material'

export interface FormFieldProps extends Omit<TextFieldProps, 'error' | 'helperText'> {
  /** Текст ошибки валидации (если есть — поле в состоянии error) */
  errorMessage?: string
}

/**
 * Переиспользуемое поле формы: MUI TextField с единообразным отображением ошибки.
 */
export function FormField({ errorMessage, ...textFieldProps }: FormFieldProps) {
  return (
    <TextField
      fullWidth
      error={Boolean(errorMessage)}
      helperText={errorMessage}
      variant="outlined"
      {...textFieldProps}
    />
  )
}
