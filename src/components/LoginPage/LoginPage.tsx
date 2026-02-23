import { useState } from 'react'
import { Box, CircularProgress, Paper, Typography } from '@mui/material'
import { Navigate } from 'react-router-dom'
import { LoginForm } from '../LoginForm'
import { useAuth } from '../../contexts/AuthContext'

export function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (email: string, password: string) => {
    setSubmitError(null)
    setSubmitting(true)
    try {
      await login(email, password)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Ошибка входа')
    } finally {
      setSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Paper
        elevation={2}
        sx={{
          width: '100%',
          maxWidth: 400,
          p: 4,
        }}
      >
        <Typography
          component="h1"
          variant="h5"
          align="center"
          sx={{ mb: 3 }}
        >
          Вход в админ-панель
        </Typography>
        {submitError && (
          <Typography color="error" sx={{ mb: 2 }} variant="body2">
            {submitError}
          </Typography>
        )}
        <LoginForm onSubmit={handleSubmit} loading={submitting} />
      </Paper>
    </Box>
  )
}
