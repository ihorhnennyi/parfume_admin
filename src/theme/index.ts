import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6b8f71',
      light: '#9bb39f',
      dark: '#4d6b52',
    },
    secondary: {
      main: '#7a9a7a',
      light: '#a8c0a8',
      dark: '#5c7a5c',
    },
    background: {
      default: '#f6f9f6',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
})
