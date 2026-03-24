import TrainerAnalyticsPage from '@/pages/trainer/analytics'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/trainer/analytics')({
  component: TrainerAnalyticsPage,
})
