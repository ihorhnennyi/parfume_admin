import { Box, Container, Grid, Typography } from '@mui/material'
import { useProductsContext } from '../../contexts/ProductsContext'
import { useOrdersContext } from '../../contexts/OrdersContext'
import { StatsCard } from './StatsCard'
import { RecentOrders } from './RecentOrders'
import { formatPrice } from '../../utils/formatPrice'

export function DashboardPage() {
  const { products, categoryOptions } = useProductsContext()
  const { orders } = useOrdersContext()

  const ordersTotal = orders.reduce((sum, o) => sum + Math.max(0, Number(o.total) || 0), 0)

  return (
    <Container maxWidth="lg" disableGutters>
      <Typography variant="h4" component="h1" gutterBottom>
        Дашборд
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Огляд ключових показників магазину.
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Товари" value={products.length} subtitle="в каталозі" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Категорії" value={categoryOptions.length} subtitle="категорій та підкатегорій" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Замовлення" value={orders.length} subtitle="всього" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Сума замовлень" value={formatPrice(ordersTotal)} subtitle="за весь період" />
        </Grid>
      </Grid>

      <Box sx={{ mb: 2 }}>
        <RecentOrders orders={orders} maxItems={5} />
      </Box>
    </Container>
  )
}
