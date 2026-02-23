import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { Header } from '../Header'
import { Sidebar } from '../Sidebar'
import { ProductsProvider } from '../../contexts/ProductsContext'
import { OrdersProvider } from '../../contexts/OrdersContext'
import { useAuth } from '../../contexts/AuthContext'
import { useSidebarCollapsed } from '../../hooks/useSidebarCollapsed'
import { APP_TITLE } from '../../constants/app'

export function Layout() {
  const { logout } = useAuth()
  const { collapsed, toggle } = useSidebarCollapsed()

  const handleLogout = () => {
    void logout()
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Header
        title={APP_TITLE}
        sidebarCollapsed={collapsed}
        onToggleSidebar={toggle}
        onLogout={handleLogout}
      />
      <Box sx={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Sidebar collapsed={collapsed} />
        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            py: 3,
            px: 3,
            bgcolor: 'background.default',
            overflow: 'auto',
          }}
        >
          <ProductsProvider>
            <OrdersProvider>
              <Outlet />
            </OrdersProvider>
          </ProductsProvider>
        </Box>
      </Box>
    </Box>
  )
}
