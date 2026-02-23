import { useState } from 'react'
import { IconButton, Avatar, Menu, MenuItem } from '@mui/material'
import { Person as PersonIcon } from '@mui/icons-material'

export interface UserMenuProps {
  /** Вызывается при нажатии «Выйти» */
  onLogout: () => void
}

export function UserMenu({ onLogout }: UserMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    handleClose()
    onLogout()
  }

  return (
    <>
      <IconButton
        onClick={handleOpen}
        color="inherit"
        aria-label="меню пользователя"
        aria-controls={open ? 'user-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Avatar
          sx={{ width: 32, height: 32, bgcolor: 'primary.light' }}
          aria-hidden
        >
          <PersonIcon fontSize="small" />
        </Avatar>
      </IconButton>

      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { minWidth: 160 } } }}
      >
        <MenuItem onClick={handleLogout}>Выйти</MenuItem>
      </Menu>
    </>
  )
}
