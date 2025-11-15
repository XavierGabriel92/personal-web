import TrainerClientsPage from '@/pages/trainer/clients'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/trainer/clients/')({
  component: TrainerClientsPage,
})
