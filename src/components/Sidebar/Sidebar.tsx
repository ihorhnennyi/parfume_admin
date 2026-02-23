import { Box, List, ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material'
import { NavLink } from 'react-router-dom'
import {
  Dashboard as DashboardIcon,
  Category as CategoryIcon,
  Inventory2 as InventoryIcon,
  ShoppingCart as OrdersIcon,
} from '@mui/icons-material'
import { SIDEBAR_ITEMS } from '../../constants/navigation'

const ICONS: Record<string, React.ReactNode> = {
  [SIDEBAR_ITEMS[0].path]: <DashboardIcon />,
  [SIDEBAR_ITEMS[1].path]: <CategoryIcon />,
  [SIDEBAR_ITEMS[2].path]: <InventoryIcon />,
  [SIDEBAR_ITEMS[3].path]: <OrdersIcon />,
}

const SIDEBAR_WIDTH = 240
const SIDEBAR_WIDTH_COLLAPSED = 72

export interface SidebarProps {
  /** Свёрнут ли сайдбар (только иконки) */
  collapsed?: boolean
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  const width = collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH

  return (
    <Box
      component="nav"
      sx={{
        width,
        flexShrink: 0,
        bgcolor: 'background.paper',
        borderRight: 1,
        borderColor: 'divider',
        transition: (theme) => theme.transitions.create('width', { duration: theme.transitions.duration.short }),
      }}
    >
      <List disablePadding sx={{ pt: 2 }}>
        {SIDEBAR_ITEMS.map(({ path, label }) => (
          <Tooltip key={path} title={label} placement="right" disableHoverListener={!collapsed}>
            <ListItemButton
              component={NavLink}
              to={path}
              sx={{
                mx: 1,
                borderRadius: 1,
                justifyContent: collapsed ? 'center' : 'flex-start',
                px: collapsed ? 1 : 2,
                '&.active': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '& .MuiListItemIcon-root': {
                    color: 'inherit',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40, justifyContent: 'center' }}>
                {ICONS[path]}
              </ListItemIcon>
              {!collapsed && <ListItemText primary={label} />}
            </ListItemButton>
          </Tooltip>
        ))}
      </List>
    </Box>
  )
}
