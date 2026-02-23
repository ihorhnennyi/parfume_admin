import { useState, useCallback } from 'react'
import { Box, Button, Stack } from '@mui/material'
import { FormField } from '../FormField'
import type { LoginFormData, LoginFormErrors } from '../../types'
import { getLoginFormErrors, hasLoginFormErrors } from '../../utils/validation'

export interface LoginFormProps {
  /** Вызывается при успешной валидации с введёнными данными */
  onSubmit: (email: string, password: string) => void
  /** Блокировка кнопки отправки (например, во время запроса) */
  loading?: boolean
}

const initialFormData: LoginFormData = {
  email: '',
  password: '',
}

export function LoginForm({ onSubmit, loading = false }: LoginFormProps) {
  const [formData, setFormData] = useState<LoginFormData>(initialFormData)
  const [errors, setErrors] = useState<LoginFormErrors>({})

  const updateField = useCallback(<K extends keyof LoginFormData>(field: K, value: LoginFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }, [errors])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const nextErrors = getLoginFormErrors(formData)
      setErrors(nextErrors)
      if (!hasLoginFormErrors(nextErrors)) {
        onSubmit(formData.email.trim(), formData.password)
      }
    },
    [formData, onSubmit],
  )

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={2.5}>
        <FormField
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          errorMessage={errors.email}
          placeholder="example@mail.com"
        />
        <FormField
          label="Пароль"
          type="password"
          name="password"
          autoComplete="current-password"
          value={formData.password}
          onChange={(e) => updateField('password', e.target.value)}
          errorMessage={errors.password}
          placeholder="••••••••"
        />
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
          fullWidth
        >
          {loading ? 'Вход…' : 'Войти'}
        </Button>
      </Stack>
    </Box>
  )
}
