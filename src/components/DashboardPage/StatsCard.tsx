import { Card, CardContent, Typography } from '@mui/material'

export interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
}

export function StatsCard({ title, value, subtitle }: StatsCardProps) {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="p" fontWeight={600}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}
