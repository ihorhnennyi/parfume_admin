import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material'
import { Menu as MenuIcon, MenuOpen as MenuOpenIcon } from '@mui/icons-material'
import { UserMenu } from './UserMenu'

export interface HeaderProps {
  /** Название магазина / приложения слева */
  title: string
  /** Свёрнут ли сайдбар (для иконки кнопки) */
  sidebarCollapsed: boolean
  /** Переключить свёрнутое состояние сайдбара */
  onToggleSidebar: () => void
  /** Вызывается при нажатии «Выйти» в меню пользователя */
  onLogout: () => void
}

export function Header({ title, sidebarCollapsed, onToggleSidebar, onLogout }: HeaderProps) {
  return (
    <AppBar position="sticky" elevation={0} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton
            color="inherit"
            onClick={onToggleSidebar}
            aria-label={sidebarCollapsed ? 'Развернуть меню' : 'Свернуть меню'}
            size="small"
          >
            {sidebarCollapsed ? <MenuIcon /> : <MenuOpenIcon />}
          </IconButton>
          <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
        <UserMenu onLogout={onLogout} />
      </Toolbar>
    </AppBar>
  )
}
