import ClientHome from '@/pages/client/home'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/client/home')({
  component: ClientHome,
})
